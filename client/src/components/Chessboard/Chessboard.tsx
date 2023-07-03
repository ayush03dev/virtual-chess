import { useEffect, useRef, useState } from "react";
import { PieceColor, PieceType, TileColor } from "../../Types";
import { BoardTile, Piece, Position } from "../../models";
import Tile from "../Tile/Tile";
import "./Chessboard.css";
import { defaultPieces } from "../../Constants";
import { socket } from "../../socket";
const moveSound = require("../../sounds/move-self.mp3");

interface Props {
    pieces: Piece[],
    color: PieceColor,
    username: string,
    playMove: (piece: Piece, position: Position) => boolean;
}

export default function Chessboard({ pieces, color, username, playMove }: Props) {

    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [movingPiece, setMovingPiece] = useState<Piece | null>(null);
    const [grabPosition, setGrabPosition] = useState<Position>(new Position(-1, -1));
    const boardRef = useRef<HTMLDivElement>(null);
    const tileRef = useRef<HTMLDivElement>(null);

    useEffect((): any => {
        document.body.style.overflow = "hidden";
        return () => (document.body.style.overflow = "scroll");
    })
    function defaultBoard() {
        const board: BoardTile[][] = [];
        for (let row = 0; row < 8; row++) {
            const currentRow: BoardTile[] = [];
            for (let col = 0; col < 8; col++) {
                let color;
                if (row % 2 === 0) {
                    color = col % 2 === 0 ? TileColor.WHITE : TileColor.BLACK;
                } else {
                    color = col % 2 !== 0 ? TileColor.WHITE : TileColor.BLACK;
                }
                const tile = new BoardTile(row, col, color, null);
                currentRow.push(tile);
            }
            board.push(currentRow);
        }

        let newBoard = board.slice();

        for (let i = 0; i < defaultPieces.length; i++) {
            const piece = defaultPieces[i];
            newBoard[piece.position.x][piece.position.y].piece = piece;
        }
        return newBoard;
    };

    function grabPiece(e: React.MouseEvent) {
        const element = e.target as HTMLElement;
        let parent = boardRef.current;
        if (!parent || !tileRef.current) return;
        let bounds = parent.getBoundingClientRect();

        let y = e.clientX - bounds.left;
        let x = e.clientY - bounds.top;
        x = Math.floor(x / tileRef.current.clientHeight);
        y = Math.floor(y / tileRef.current.clientHeight);

        const normalized = new Position(x, y).normalize();
        x = normalized.x;
        y = normalized.y;

        if (element.classList.contains("chess-piece")) {
            const piece = pieces.find((p) =>
                p.samePosition(new Position(x, y)));

            if (piece?.color !== color) return;

            setGrabPosition(new Position(x, y));
            element.style.position = "absolute";
            element.style.left = `${x + element.offsetLeft}px`;
            element.style.top = `${y + element.offsetTop}px`;

            setActivePiece(element);
            setMovingPiece(piece);
        }
    }

    function movePiece(e: React.MouseEvent) {
        const chessboard = boardRef.current;
        if (activePiece && chessboard && tileRef.current) {
            const height = tileRef.current.clientHeight;
            // These (x, y) cordinates are relative to the page
            const x = e.clientX - (height / 2);
            const y = e.clientY - (height / 2);
            const minX = chessboard.offsetLeft - (25 / 100 * height);
            const minY = chessboard.offsetTop - (25 / 100 * height);
            const maxX = chessboard.offsetLeft + chessboard.clientWidth - (75 / 100 * height);
            const maxY = chessboard.offsetTop + chessboard.clientHeight - (75 / 100 * height);
            activePiece.style.position = "absolute";

            if (x < minX) {
                activePiece.style.left = `${minX}px`;
            } else if (x > maxX) {
                activePiece.style.left = `${maxX}px`;
            } else {
                activePiece.style.left = `${x}px`;
            }

            if (y < minY) {
                activePiece.style.top = `${minY}px`;
            } else if (y > maxY) {
                activePiece.style.top = `${maxY}px`;
            } else {
                activePiece.style.top = `${y}px`;
            }
        }
    }

    function dropPiece(e: React.MouseEvent) {
        const chessboard = boardRef.current;
        if (activePiece && chessboard && tileRef.current && movingPiece) {
            const height = tileRef.current.clientHeight;
            let bounds = chessboard.getBoundingClientRect();
            // These (x, y) cordinates are relative to the board!
            let y = e.clientX - bounds.left;
            let x = e.clientY - bounds.top;
            x = Math.floor(x / tileRef.current.clientHeight);
            y = Math.floor(y / tileRef.current.clientHeight);
            const normalized = new Position(x, y).normalize();
            x = normalized.x;
            y = normalized.y;

            const currentPiece = pieces.find((p) =>
                p.samePosition(grabPosition)
            );

            if (currentPiece) {
                var success = playMove(currentPiece.clone(), new Position(x, y));

                if (!success) {
                    //RESETS THE PIECE POSITION
                    activePiece.style.position = "relative";
                    activePiece.style.removeProperty("top");
                    activePiece.style.removeProperty("left");
                } else {
                    socket.emit("move-piece", { username, fromX: grabPosition.x, fromY: grabPosition.y, toX: x, toY: y });
                    new Audio(moveSound).play();
                }
            }
            setActivePiece(null);

        }
    }

    let array = [];

    for (let j = 7; j >= 0; j--) {
        const row = [];
        for (let i = 0; i < 8; i++) {
            const number = j + i + 2;
            const piece = pieces.find((p) =>
                p.samePosition(new Position(i, j))
            );

            let currentPiece = activePiece != null ? pieces.find(p => p.samePosition(grabPosition)) : undefined;
            let highlight = currentPiece?.possibleMoves ?
                currentPiece.possibleMoves.some(p => p.isSimilar(new Position(i, j))) : false;
            const tileColor = number % 2 == 0 ? TileColor.BLACK : TileColor.WHITE;
            const p = piece ? piece : null;
            row.push(<Tile key={`${j}-${i}`} color={tileColor} x={i} y={j} piece={p} highlight={highlight} />)
        }
        array.push(row);
    }

    return (
        <div className="board">
            <div className="board-container" ref={boardRef}>
                {array.map((row, rowIdx) => {
                    return (
                        <div ref={tileRef} className="board-row" key={rowIdx} onMouseDown={(e) => grabPiece(e)} onMouseMove={(e) => movePiece(e)}
                            onMouseUp={(e) => dropPiece(e)}>
                            {row}
                        </div>)
                })}
            </div>

        </div>
    )

}