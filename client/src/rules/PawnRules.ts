import { PieceColor } from "../Types";
import { Piece, Position } from "../models";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";
import { Pawn } from "../models/Pawn";

export const pawnMove = (initialPosition: Position, desiredPosition: Position, color: PieceColor, boardState: Piece[]): boolean => {

    const specialRow = 1;
    const pawnDirection = 1;

    //MOVEMENT LOGIC
    if (
        initialPosition.x === desiredPosition.x &&
        initialPosition.y === specialRow &&
        desiredPosition.y - initialPosition.y === 2 * pawnDirection
    ) {
        if (
            !tileIsOccupied(desiredPosition, boardState) &&
            !tileIsOccupied(
                new Position(desiredPosition.x, desiredPosition.y - pawnDirection),
                boardState
            )
        ) {
            return true;
        }
    } else if (
        initialPosition.x === desiredPosition.x &&
        desiredPosition.y - initialPosition.y === pawnDirection
    ) {
        if (!tileIsOccupied(desiredPosition, boardState)) {
            return true;
        }
    }
    //ATTACK LOGIC
    else if (
        desiredPosition.x - initialPosition.x === -1 &&
        desiredPosition.y - initialPosition.y === pawnDirection
    ) {
        //ATTACK IN UPPER OR BOTTOM LEFT CORNER
        if (tileIsOccupiedByOpponent(desiredPosition, boardState, color)) {
            return true;
        }
    } else if (
        desiredPosition.x - initialPosition.x === 1 &&
        desiredPosition.y - initialPosition.y === pawnDirection
    ) {
        //ATTACK IN THE UPPER OR BOTTOM RIGHT CORNER
        if (tileIsOccupiedByOpponent(desiredPosition, boardState, color)) {
            return true;
        }
    }

    return false;
}

export const getPossiblePawnMoves = (pawn: Piece, boardState: Piece[]): Position[] => {
    const possibleMoves: Position[] = [];

    const specialRow = 1;
    const pawnDirection = 1;

    const normalMove = new Position(pawn.position.x, pawn.position.y + pawnDirection);
    const specialMove = new Position(normalMove.x, normalMove.y + pawnDirection);
    const upperLeftAttack = new Position(pawn.position.x - 1, pawn.position.y + pawnDirection);
    const upperRightAttack = new Position(pawn.position.x + 1, pawn.position.y + pawnDirection);
    const leftPosition = new Position(pawn.position.x - 1, pawn.position.y);
    const rightPosition = new Position(pawn.position.x + 1, pawn.position.y);

    if (!tileIsOccupied(normalMove, boardState)) {
        possibleMoves.push(normalMove);

        if (pawn.position.y === specialRow &&
            !tileIsOccupied(specialMove, boardState)) {
            possibleMoves.push(specialMove)
        }
    }

    if (tileIsOccupiedByOpponent(upperLeftAttack, boardState, pawn.color)) {
        possibleMoves.push(upperLeftAttack);
    } else if (!tileIsOccupied(upperLeftAttack, boardState)) {
        const leftPiece = boardState.find(p => p.samePosition(leftPosition));
        if (leftPiece != null && (leftPiece as Pawn).enPassant) {
            possibleMoves.push(upperLeftAttack);
        }
    }

    if (tileIsOccupiedByOpponent(upperRightAttack, boardState, pawn.color)) {
        possibleMoves.push(upperRightAttack);
    } else if (!tileIsOccupied(upperRightAttack, boardState)) {
        const rightPiece = boardState.find(p => p.samePosition(rightPosition));
        if (rightPiece != null && (rightPiece as Pawn).enPassant) {
            possibleMoves.push(upperRightAttack);
        }
    }

    return possibleMoves;
}