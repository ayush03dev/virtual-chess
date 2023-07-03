import { PieceType, PieceColor } from "../Types";
import { Piece } from "./Piece";
import { Position } from "./Position";

export class Pawn extends Piece {
    enPassant?: boolean;
    constructor(position: Position,
        color: PieceColor, hasMoved: boolean,
        enPassant?: boolean,
        possibleMoves: Position[] = []) {
        super(position, PieceType.PAWN, color, hasMoved, possibleMoves);
        this.enPassant = enPassant;
    }

    clone(): Pawn {
        return new Pawn(this.position.clone(),
            this.color, this.hasMoved, this.enPassant, this.possibleMoves?.map(m => m.clone()))
    }
}