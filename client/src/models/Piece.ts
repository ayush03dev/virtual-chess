import { PieceColor, PieceType } from "../Types"
import { Position } from "./Position"

export class Piece {
    image: string
    position: Position
    possibleMoves?: Position[]
    hasMoved: boolean
    type: PieceType
    color: PieceColor;

    constructor(position: Position, type: PieceType,
        color: PieceColor, hasMoved: boolean,
        possibleMoves: Position[] = []) {
        this.image = `assets/images/${type}_${color}.png`;
        this.position = position;
        this.type = type;
        this.color = color;
        this.possibleMoves = possibleMoves;
        this.hasMoved = hasMoved;
    }

    get isPawn(): boolean {
        return this.type === PieceType.PAWN
    }

    get isRook(): boolean {
        return this.type === PieceType.ROOK
    }

    get isKnight(): boolean {
        return this.type === PieceType.KNIGHT
    }

    get isBishop(): boolean {
        return this.type === PieceType.BISHOP
    }

    get isKing(): boolean {
        return this.type === PieceType.KING
    }

    get isQueen(): boolean {
        return this.type === PieceType.QUEEN
    }

    samePiecePosition(otherPiece: Piece): boolean {
        return this.position.isSimilar(otherPiece.position);
    }

    samePosition(otherPosition: Position): boolean {
        return this.position.isSimilar(otherPosition);
    }

    clone(): Piece {
        return new Piece(this.position.clone(),
            this.type, this.color, this.hasMoved,
            this.possibleMoves?.map(m => m.clone()));
    }
}