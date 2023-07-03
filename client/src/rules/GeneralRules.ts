import { Piece, Position } from "../models";
import { PieceColor } from "../Types";

export const tileIsOccupied = (position: Position, boardState: Piece[]): boolean => {
    const piece = boardState.find((p) => p.samePosition(position));

    if (piece) {
        return true;
    } else {
        return false;
    }
}

export const tileIsOccupiedByOpponent = (
    position: Position,
    boardState: Piece[],
    color: PieceColor
): boolean => {
    const piece = boardState.find(
        (p) => p.samePosition(position) && p.color !== color
    );

    if (piece) {
        return true;
    } else {
        return false;
    }
}

export const tileIsEmptyOrOccupiedByOpponent = (
    position: Position,
    boardState: Piece[],
    color: PieceColor
) => {
    return (
        !tileIsOccupied(position, boardState) ||
        tileIsOccupiedByOpponent(position, boardState, color)
    );
}