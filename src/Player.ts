import { Socket } from "socket.io"
import { Match } from "./Match"

export class Player {
    username: string
    connection: Socket
    match: Match
}