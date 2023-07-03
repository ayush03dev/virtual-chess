import { PieceColor, PieceType } from "./Types";
import { BoardTile, Piece, Position } from "./models";
import { Board } from "./models/Board";
import { Pawn } from "./models/Pawn";

export const VERTICAL_AXIS = ["1", "2", "3", "4", "5", "6", "7", "8"];
export const HORIZONTAL_AXIS = ["a", "b", "c", "d", "e", "f", "g", "h"];

export const defaultPieces: Piece[] = [
    new Piece(new Position(0, 0), PieceType.ROOK, PieceColor.BLACK, false),
    new Piece(new Position(0, 1), PieceType.KNIGHT, PieceColor.BLACK, false),
    new Piece(new Position(0, 2), PieceType.BISHOP, PieceColor.BLACK, false),
    new Piece(new Position(0, 3), PieceType.QUEEN, PieceColor.BLACK, false),
    new Piece(new Position(0, 4), PieceType.KING, PieceColor.BLACK, false),
    new Piece(new Position(0, 5), PieceType.BISHOP, PieceColor.BLACK, false),
    new Piece(new Position(0, 6), PieceType.KNIGHT, PieceColor.BLACK, false),
    new Piece(new Position(0, 7), PieceType.ROOK, PieceColor.BLACK, false),

    new Piece(new Position(1, 0), PieceType.PAWN, PieceColor.BLACK, false),
    new Piece(new Position(1, 1), PieceType.PAWN, PieceColor.BLACK, false),
    new Piece(new Position(1, 2), PieceType.PAWN, PieceColor.BLACK, false),
    new Piece(new Position(1, 3), PieceType.PAWN, PieceColor.BLACK, false),
    new Piece(new Position(1, 4), PieceType.PAWN, PieceColor.BLACK, false),
    new Piece(new Position(1, 5), PieceType.PAWN, PieceColor.BLACK, false),
    new Piece(new Position(1, 6), PieceType.PAWN, PieceColor.BLACK, false),
    new Piece(new Position(1, 7), PieceType.PAWN, PieceColor.BLACK, false),

    new Piece(new Position(6, 0), PieceType.PAWN, PieceColor.WHITE, false),
    new Piece(new Position(6, 1), PieceType.PAWN, PieceColor.WHITE, false),
    new Piece(new Position(6, 2), PieceType.PAWN, PieceColor.WHITE, false),
    new Piece(new Position(6, 3), PieceType.PAWN, PieceColor.WHITE, false),
    new Piece(new Position(6, 4), PieceType.PAWN, PieceColor.WHITE, false),
    new Piece(new Position(6, 5), PieceType.PAWN, PieceColor.WHITE, false),
    new Piece(new Position(6, 6), PieceType.PAWN, PieceColor.WHITE, false),
    new Piece(new Position(6, 7), PieceType.PAWN, PieceColor.WHITE, false),


    new Piece(new Position(7, 0), PieceType.ROOK, PieceColor.WHITE, false),
    new Piece(new Position(7, 1), PieceType.KNIGHT, PieceColor.WHITE, false),
    new Piece(new Position(7, 2), PieceType.BISHOP, PieceColor.WHITE, false),
    new Piece(new Position(7, 3), PieceType.QUEEN, PieceColor.WHITE, false),
    new Piece(new Position(7, 4), PieceType.KING, PieceColor.WHITE, false),
    new Piece(new Position(7, 5), PieceType.BISHOP, PieceColor.WHITE, false),
    new Piece(new Position(7, 6), PieceType.KNIGHT, PieceColor.WHITE, false),
    new Piece(new Position(7, 7), PieceType.ROOK, PieceColor.WHITE, false)
];

export const defaultBoard = new Board(defaultPieces, 1);

export const initialBoard: Board = new Board([
    new Piece(
        new Position(0, 7),
        PieceType.ROOK,
        PieceColor.BLACK,
        false),
    new Piece(
        new Position(1, 7),
        PieceType.KNIGHT,
        PieceColor.BLACK,
        false),
    new Piece(
        new Position(2, 7),
        PieceType.BISHOP,
        PieceColor.BLACK,
        false),
    new Piece(
        new Position(3, 7),
        PieceType.QUEEN,
        PieceColor.BLACK,
        false),
    new Piece(
        new Position(4, 7),
        PieceType.KING,
        PieceColor.BLACK,
        false),
    new Piece(
        new Position(5, 7),
        PieceType.BISHOP,
        PieceColor.BLACK,
        false),
    new Piece(
        new Position(6, 7),
        PieceType.KNIGHT,
        PieceColor.BLACK,
        false),
    new Piece(
        new Position(7, 7),
        PieceType.ROOK,
        PieceColor.BLACK,
        false),
    new Pawn(
        new Position(0, 6),
        PieceColor.BLACK,
        false),
    new Pawn(
        new Position(1, 6),
        PieceColor.BLACK,
        false),
    new Pawn(
        new Position(2, 6),
        PieceColor.BLACK,
        false),
    new Pawn(
        new Position(3, 6),
        PieceColor.BLACK,
        false),
    new Pawn(
        new Position(4, 6),
        PieceColor.BLACK,
        false),
    new Pawn(
        new Position(5, 6),
        PieceColor.BLACK,
        false),
    new Pawn(
        new Position(6, 6),
        PieceColor.BLACK,
        false),
    new Pawn(
        new Position(7, 6),
        PieceColor.BLACK,
        false),

    new Piece(
        new Position(0, 0),
        PieceType.ROOK,
        PieceColor.WHITE,
        false),
    new Piece(
        new Position(1, 0),
        PieceType.KNIGHT,
        PieceColor.WHITE,
        false),
    new Piece(
        new Position(2, 0),
        PieceType.BISHOP,
        PieceColor.WHITE,
        false),
    new Piece(
        new Position(3, 0),
        PieceType.QUEEN,
        PieceColor.WHITE,
        false),
    new Piece(
        new Position(4, 0),
        PieceType.KING,
        PieceColor.WHITE,
        false),
    new Piece(
        new Position(5, 0),
        PieceType.BISHOP,
        PieceColor.WHITE,
        false),
    new Piece(
        new Position(6, 0),
        PieceType.KNIGHT,
        PieceColor.WHITE,
        false),
    new Piece(
        new Position(7, 0),
        PieceType.ROOK,
        PieceColor.WHITE,
        false),
    new Pawn(
        new Position(0, 1),
        PieceColor.WHITE,
        false),
    new Pawn(
        new Position(1, 1),
        PieceColor.WHITE,
        false),
    new Pawn(
        new Position(2, 1),
        PieceColor.WHITE,
        false),
    new Pawn(
        new Position(3, 1),
        PieceColor.WHITE,
        false),
    new Pawn(
        new Position(4, 1),
        PieceColor.WHITE,
        false),
    new Pawn(
        new Position(5, 1),
        PieceColor.WHITE,
        false),
    new Pawn(
        new Position(6, 1),
        PieceColor.WHITE,
        false),
    new Pawn(
        new Position(7, 1),
        PieceColor.WHITE,
        false),
], 1);

initialBoard.calculateAllMoves();

export const initialBoardBlack: Board = new Board([
    new Piece(
        new Position(0, 7),
        PieceType.ROOK,
        PieceColor.WHITE,
        false),
    new Piece(
        new Position(1, 7),
        PieceType.KNIGHT,
        PieceColor.WHITE,
        false),
    new Piece(
        new Position(2, 7),
        PieceType.BISHOP,
        PieceColor.WHITE,
        false),
    new Piece(
        new Position(4, 7),
        PieceType.QUEEN,
        PieceColor.WHITE,
        false),
    new Piece(
        new Position(3, 7),
        PieceType.KING,
        PieceColor.WHITE,
        false),
    new Piece(
        new Position(5, 7),
        PieceType.BISHOP,
        PieceColor.WHITE,
        false),
    new Piece(
        new Position(6, 7),
        PieceType.KNIGHT,
        PieceColor.WHITE,
        false),
    new Piece(
        new Position(7, 7),
        PieceType.ROOK,
        PieceColor.WHITE,
        false),
    new Pawn(
        new Position(0, 6),
        PieceColor.WHITE,
        false),
    new Pawn(
        new Position(1, 6),
        PieceColor.WHITE,
        false),
    new Pawn(
        new Position(2, 6),
        PieceColor.WHITE,
        false),
    new Pawn(
        new Position(3, 6),
        PieceColor.WHITE,
        false),
    new Pawn(
        new Position(4, 6),
        PieceColor.WHITE,
        false),
    new Pawn(
        new Position(5, 6),
        PieceColor.WHITE,
        false),
    new Pawn(
        new Position(6, 6),
        PieceColor.WHITE,
        false),
    new Pawn(
        new Position(7, 6),
        PieceColor.WHITE,
        false),

    new Piece(
        new Position(0, 0),
        PieceType.ROOK,
        PieceColor.BLACK,
        false),
    new Piece(
        new Position(1, 0),
        PieceType.KNIGHT,
        PieceColor.BLACK,
        false),
    new Piece(
        new Position(2, 0),
        PieceType.BISHOP,
        PieceColor.BLACK,
        false),
    new Piece(
        new Position(4, 0),
        PieceType.QUEEN,
        PieceColor.BLACK,
        false),
    new Piece(
        new Position(3, 0),
        PieceType.KING,
        PieceColor.BLACK,
        false),
    new Piece(
        new Position(5, 0),
        PieceType.BISHOP,
        PieceColor.BLACK,
        false),
    new Piece(
        new Position(6, 0),
        PieceType.KNIGHT,
        PieceColor.BLACK,
        false),
    new Piece(
        new Position(7, 0),
        PieceType.ROOK,
        PieceColor.BLACK,
        false),
    new Pawn(
        new Position(0, 1),
        PieceColor.BLACK,
        false),
    new Pawn(
        new Position(1, 1),
        PieceColor.BLACK,
        false),
    new Pawn(
        new Position(2, 1),
        PieceColor.BLACK,
        false),
    new Pawn(
        new Position(3, 1),
        PieceColor.BLACK,
        false),
    new Pawn(
        new Position(4, 1),
        PieceColor.BLACK,
        false),
    new Pawn(
        new Position(5, 1),
        PieceColor.BLACK,
        false),
    new Pawn(
        new Position(6, 1),
        PieceColor.BLACK,
        false),
    new Pawn(
        new Position(7, 1),
        PieceColor.BLACK,
        false),
], 1);

initialBoardBlack.calculateAllMoves();
