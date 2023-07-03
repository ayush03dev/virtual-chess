import { PieceColor, TileColor } from "../../Types";
import { Piece } from "../../models";
import "./Tile.css";

interface Props {
    x: number,
    y: number,
    color: TileColor,
    piece: Piece | null,
    highlight: boolean
}

export default function Tile({ x, y, color, piece, highlight }: Props) {
    let className: string = ["tile", color === TileColor.WHITE ? "white-tile" : "black-tile", piece ? "chess-piece-tile" : "",
        highlight ? "tile-highlight" : ""].filter(Boolean).join(' ');
    return (
        <div
            id={`tile-${x}-${y}`}
            className={className}>
            {piece && <div style={{ backgroundImage: `url(${piece.image})` }} className="chess-piece"></div>}
        </div>
    );
}