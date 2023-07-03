import { PieceColor, PieceType } from "../Types";
import {
    getPossibleBishopMoves, getPossibleKingMoves, getPossibleQueenMoves, getPossibleKnightMoves, getCastlingMoves,
    getPossibleRookMoves, getPossiblePawnMoves
} from "../rules";
import { Pawn } from "./Pawn";
import { Piece } from "./Piece";
import { Position } from "./Position";

export class Board {
    pieces: Piece[];
    totalTurns: number;
    winningTeam?: PieceColor;

    constructor(pieces: Piece[], totalTurns: number) {
        this.pieces = pieces;
        this.totalTurns = totalTurns;
    }

    get currentTeam(): PieceColor {
        return this.totalTurns % 2 === 0 ? PieceColor.BLACK : PieceColor.WHITE;
    }

    clone(): Board {
        return new Board(this.pieces.map(p => p.clone()),
            this.totalTurns);
    }

    calculateAllMoves() {
        for (const piece of this.pieces) {
            piece.possibleMoves = this.getValidMoves(piece, this.pieces)
        }

        for (const king of this.pieces.filter(p => p.isKing)) {
            if (king.possibleMoves === undefined) continue;

            king.possibleMoves = [...king.possibleMoves, ...getCastlingMoves(king, this.pieces)];
        }

        this.checkCurrentTeamMoves();
        for (const piece of
            this.pieces.filter(p => p.color !== this.currentTeam)) {
            piece.possibleMoves = [];
        }

        if (this.pieces.filter(p => p.color === this.currentTeam)
            .some(p => p.possibleMoves !== undefined && p.possibleMoves.length > 0)) return;

        this.winningTeam = (this.currentTeam === PieceColor.WHITE) ? PieceColor.BLACK : PieceColor.WHITE;
    }

    checkCurrentTeamMoves() {
        for (const piece of this.pieces.filter(p => p.color === this.currentTeam)) {
            if (piece.possibleMoves === undefined) continue;

            for (const move of piece.possibleMoves) {
                const simulatedBoard = this.clone();

                simulatedBoard.pieces = simulatedBoard.pieces.filter(p => !p.samePosition(move));

                const clonedPiece = simulatedBoard.pieces.find(p => p.samePiecePosition(piece))!;
                clonedPiece.position = move.clone();

                const clonedKing = simulatedBoard.pieces.find(p => p.isKing && p.color === simulatedBoard.currentTeam)!;


                for (const enemy of simulatedBoard.pieces.filter(p => p.color !== simulatedBoard.currentTeam)) {
                    enemy.possibleMoves = simulatedBoard.getValidMoves(enemy, simulatedBoard.pieces);

                    if (enemy.isPawn) {
                        if (enemy.possibleMoves.some(m => m.x !== enemy.position.x
                            && m.isSimilar(clonedKing.position))) {
                            piece.possibleMoves = piece.possibleMoves?.filter(m => !m.isSimilar(move));
                        }
                    } else {
                        if (enemy.possibleMoves.some(m => m.isSimilar(clonedKing.position))) {
                            piece.possibleMoves = piece.possibleMoves?.filter(m => !m.isSimilar(move));
                        }
                    }
                }
            }
        }
    }


    getValidMoves(piece: Piece, boardState: Piece[]): Position[] {
        switch (piece.type) {
            case PieceType.PAWN:
                return getPossiblePawnMoves(piece, boardState);
            case PieceType.KNIGHT:
                return getPossibleKnightMoves(piece, boardState);
            case PieceType.BISHOP:
                return getPossibleBishopMoves(piece, boardState);
            case PieceType.ROOK:
                return getPossibleRookMoves(piece, boardState);
            case PieceType.QUEEN:
                return getPossibleQueenMoves(piece, boardState);
            case PieceType.KING:
                return getPossibleKingMoves(piece, boardState);
            default:
                return [];
        }
    }

    playMove(enPassantMove: boolean,
        validMove: boolean,
        playedPiece: Piece,
        destination: Position): boolean {
        const pawnDirection = 1;
        const destinationPiece = this.pieces.find(p => p.samePosition(destination));

        if (playedPiece.isKing && destinationPiece?.isRook
            && destinationPiece.color === playedPiece.color) {
            const direction = (destinationPiece.position.x - playedPiece.position.x > 0) ? 1 : -1;
            const newKingXPosition = playedPiece.position.x + direction * 2;
            this.pieces = this.pieces.map(p => {
                if (p.samePiecePosition(playedPiece)) {
                    p.position.x = newKingXPosition;
                } else if (p.samePiecePosition(destinationPiece)) {
                    p.position.x = newKingXPosition - direction;
                }

                return p;
            });

            this.calculateAllMoves();
            return true;
        }

        if (enPassantMove) {
            this.pieces = this.pieces.reduce((results, piece) => {
                if (piece.samePiecePosition(playedPiece)) {
                    if (piece.isPawn)
                        (piece as Pawn).enPassant = false;
                    piece.position.x = destination.x;
                    piece.position.y = destination.y;
                    piece.hasMoved = true;
                    results.push(piece);
                } else if (
                    !piece.samePosition(new Position(destination.x, destination.y - pawnDirection))
                ) {
                    if (piece.isPawn) {
                        (piece as Pawn).enPassant = false;
                    }
                    results.push(piece);
                }

                return results;
            }, [] as Piece[]);

            this.calculateAllMoves();
        } else if (validMove) {
            this.pieces = this.pieces.reduce((results, piece) => {
                if (piece.samePiecePosition(playedPiece)) {
                    if (piece.isPawn)
                        (piece as Pawn).enPassant =
                            Math.abs(playedPiece.position.y - destination.y) === 2 &&
                            piece.type === PieceType.PAWN;
                    piece.position.x = destination.x;
                    piece.position.y = destination.y;
                    piece.hasMoved = true;
                    results.push(piece);
                } else if (!piece.samePosition(destination)) {
                    if (piece.isPawn) {
                        (piece as Pawn).enPassant = false;
                    }
                    results.push(piece);
                }

                return results;
            }, [] as Piece[]);

            this.calculateAllMoves();
        } else {
            return false;
        }

        return true;
    }

}