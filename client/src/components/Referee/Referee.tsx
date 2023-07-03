import { useEffect, useRef, useState } from "react";
import { PieceColor, PieceType } from "../../Types";
import { Piece, Position } from "../../models";
import { Board } from "../../models/Board";
import { Pawn } from "../../models/Pawn";
import { defaultBoard, initialBoard, initialBoardBlack } from "../../Constants";
import Chessboard from "../Chessboard/Chessboard";
import { socket } from "../../socket";
import Chatbox from "../Chatbox/Chatbox";
import "./Referee.css";
import { Col, Row } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.css';
import Spinner from "../Spinner/Spinner";
const moveSound = require("../../sounds/move-self.mp3");

interface Props {
    uuid: string,
    username: string,
    createInvite: boolean,
}

export default function Referee(props: Props) {
    const [board, setBoard] = useState<Board>(initialBoardBlack);
    const [promotionPawn, setPromotionPawn] = useState<Piece>();
    const modalRef = useRef<HTMLDivElement>(null);
    const checkmateModalRef = useRef<HTMLDivElement>(null);
    const disconnectModalRef = useRef<HTMLDivElement>(null);
    const [waiting, setWaiting] = useState<boolean>(true);
    const [team, setTeam] = useState<PieceColor>(PieceColor.WHITE);

    useEffect(() => {
        if (props.createInvite) {
            socket.connect();
            socket.emit("create-invite", { username: props.username, uuid: props.uuid });
        } else {
            socket.connect();
            socket.emit("accept-invite", { username: props.username, uuid: props.uuid })
        }

        socket.on("match-start", (data) => {
            setWaiting(false);
            if (data === "white") {
                setBoard(initialBoard);
            } else {
                setTeam(PieceColor.BLACK);
            }
        });

        socket.on("opponent-abandoned", () => {
            board.winningTeam = team;
            disconnectModalRef.current?.classList.remove("hidden");
        });

        socket.on("checkmate", (data) => {
            board.winningTeam = data.winner === "white" ? PieceColor.WHITE : PieceColor.BLACK;
            checkmateModalRef.current?.classList.remove("hidden");
        });

        socket.on("castling", (data) => {
            const { x, y, pieceType } = data;
            let type;

            if (pieceType === "queen") {
                type = PieceType.QUEEN;
            } else if (pieceType === "rook") {
                type = PieceType.ROOK;
            } else if (pieceType === "knight") {
                type = PieceType.KNIGHT;
            } else {
                type = PieceType.BISHOP;
            }

            const piece = board.pieces.find(p => p.position.x === x && p.position.y === y);
            if (piece) {
                setPromotionPawn(piece);
                promotePawn(type);
            }
        });

    }, []);

    if (waiting) {
        return (<div style={{ textAlign: "center" }}>
            <Spinner />
            <h1 style={{ color: "white" }}>Waiting for other player to join...</h1>
            <h1 style={{ color: "white" }}>Invite Id: <span style={{ color: "#ff79c6" }}>{props.uuid}</span></h1>

        </div>)
    }

    socket.on("move-piece", (data) => {
        const { fromX, fromY, toX, toY } = data;
        const from = new Position(fromX, fromY);
        const to = new Position(toX, toY);
        const piece = board.pieces.find(p => p.position.isSimilar(from));
        if (piece) {
            const move = playMove(piece, to, false);
        }
    });

    const onClick = () => {
        window.location.reload();
    }

    function playMove(playedPiece: Piece, destination: Position, flag: boolean = true): boolean {
        if (playedPiece.possibleMoves === undefined) return false;
        if (playedPiece.color === PieceColor.WHITE
            && board.totalTurns % 2 !== 1) return false;
        if (playedPiece.color === PieceColor.BLACK
            && board.totalTurns % 2 !== 0) return false;
        let playedMoveIsValid = false;

        let validMove = playedPiece.possibleMoves?.some(m => m.isSimilar(destination));
        if (flag && !validMove) return false;
        validMove = true;
        const enPassantMove = isEnPassantMove(
            playedPiece.position,
            destination,
            playedPiece.type,
            playedPiece.color
        );
        new Audio(moveSound).play();

        setBoard(() => {
            const clonedBoard = board.clone();
            clonedBoard.totalTurns += 1;
            playedMoveIsValid = clonedBoard.playMove(enPassantMove,
                validMove, playedPiece,
                destination);

            if (clonedBoard.winningTeam !== undefined) {
                checkmateModalRef.current?.classList.remove("hidden");
                // Checkmate
                socket.emit("checkmate", { username: props.username, winner: board.winningTeam === PieceColor.WHITE ? "white" : "black" })
            }

            return clonedBoard;
        })

        let promotionRow = 7;
        if (destination.y === promotionRow && playedPiece.isPawn) {
            if ((playedPiece.color === PieceColor.WHITE && props.createInvite) || (playedPiece.color === PieceColor.BLACK && !props.createInvite))
                modalRef.current?.classList.remove("hidden");
            setPromotionPawn((previousPromotionPawn) => {
                const clonedPlayedPiece = playedPiece.clone();
                clonedPlayedPiece.position = destination.clone();
                return clonedPlayedPiece;
            });
        }

        return playedMoveIsValid;
    }

    function isEnPassantMove(
        initialPosition: Position,
        desiredPosition: Position,
        type: PieceType,
        color: PieceColor
    ) {
        const pawnDirection = 1;

        if (type === PieceType.PAWN) {
            if (
                (desiredPosition.x - initialPosition.x === -1 ||
                    desiredPosition.x - initialPosition.x === 1) &&
                desiredPosition.y - initialPosition.y === pawnDirection
            ) {
                const piece = board.pieces.find(
                    (p) =>
                        p.position.x === desiredPosition.x &&
                        p.position.y === desiredPosition.y - pawnDirection &&
                        p.isPawn &&
                        (p as Pawn).enPassant
                );
                if (piece) {
                    return true;
                }
            }
        }

        return false;
    }

    function promotePawn(pieceType: PieceType) {
        if (promotionPawn === undefined) {
            return;
        }

        setBoard((previousBoard) => {
            const clonedBoard = board.clone();
            clonedBoard.pieces = clonedBoard.pieces.reduce((results, piece) => {
                if (piece.samePiecePosition(promotionPawn)) {
                    results.push(new Piece(piece.position.clone(), pieceType,
                        piece.color, true));
                } else {
                    results.push(piece);
                }
                return results;
            }, [] as Piece[]);

            clonedBoard.calculateAllMoves();
            socket.emit("castling", { username: props.username, x: promotionPawn.position.x, y: promotionPawn.position.y, pieceType });
            return clonedBoard;
        })

        modalRef.current?.classList.add("hidden");
    }

    function promotionTeamType() {
        return (promotionPawn?.color === PieceColor.WHITE) ? "w" : "b";
    }

    return (
        <>
            <p style={{ color: "white", fontSize: "24px", textAlign: "center" }}>Total turns: {board.totalTurns} | Current Move: {board.totalTurns % 2 == 0 ? "Black" : "White"}</p>
            <div className="board-modal hidden" ref={modalRef}>
                <div className="board-modal-body">
                    <img onClick={() => promotePawn(PieceType.ROOK)} src={`/assets/images/rook_${promotionTeamType()}.png`} />
                    <img onClick={() => promotePawn(PieceType.BISHOP)} src={`/assets/images/bishop_${promotionTeamType()}.png`} />
                    <img onClick={() => promotePawn(PieceType.KNIGHT)} src={`/assets/images/knight_${promotionTeamType()}.png`} />
                    <img onClick={() => promotePawn(PieceType.QUEEN)} src={`/assets/images/queen_${promotionTeamType()}.png`} />
                </div>
            </div>
            <div className="board-modal hidden" ref={checkmateModalRef}>
                <div className="board-modal-body">
                    <div className="checkmate-body">
                        <span>Checkmate! The winning team is {board.winningTeam === PieceColor.WHITE ? "white" : "black"}.</span>
                        <button onClick={onClick}>Play again</button>
                    </div>
                </div>
            </div>
            <div className="board-modal hidden" ref={disconnectModalRef}>
                <div className="board-modal-body">
                    <div className="checkmate-body">
                        <span>You won the game because the opponent has disconnected!</span>
                        <button onClick={onClick}>Play again</button>
                    </div>
                </div>
            </div>

            <Row>
                <Col lg={8}>
                    <Chessboard playMove={playMove}
                        pieces={board.pieces} color={team} username={props.username} />
                </Col>
                <Col lg={4} style={{ padding: '2% 0' }}>
                    <Chatbox username={props.username} />
                </Col>
            </Row>

        </>
    )

}