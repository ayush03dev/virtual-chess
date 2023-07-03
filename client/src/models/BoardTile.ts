import { TileColor } from "../Types";
import { Piece } from "./Piece";

export class BoardTile {
    x: number
    y: number
    color: TileColor
    piece: Piece | null;

    constructor(x: number, y: number, color: TileColor, piece: Piece | null) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.piece = piece;
    }
}

