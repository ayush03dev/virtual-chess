import express from "express";
const path = require("path");
import { createServer } from "http";
import { Server } from "socket.io";
import { Match } from "./Match";
import { Invite } from "./Invite";
import { Player } from "./Player";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"]
    },
    allowEIO3: true,
    transports: ['websocket', 'polling'],
});

app.use(express.static("public"));

let matches: Match[] = [];
let invites: Invite[] = [];
let players: Player[] = [];

io.on("connection", (socket) => {
    socket.on("create-invite", (data) => {
        const { uuid } = data;
        const username = data.username;

        const player = { username, connection: socket, match: null };
        players.push(player);
        invites.push({ host: player, id: uuid });
        console.log(player.username + " created the invite");
    })

    socket.on("accept-invite", (data) => {
        const { username, uuid } = data;
        const player: Player = { username, connection: socket, match: null };
        players.push(player);
        const invite = invites.find(inv => inv.id === uuid);
        if (invite) {
            console.log(player.username + " accepted the invite");
            invites = invites.filter(inv => inv !== invite);
            matches.push({ host: invite.host, friend: player, id: invite.id });
            invite.host.connection.emit("match-start", "white");
            player.connection.emit("match-start", "black");
        }
    });

    socket.on("chat", (data) => {
        const { username } = data;
        const player = players.find(p => p.username === username);
        const match = matches.find(m => m.host === player || m.friend === player);
        if (!match) player.connection.disconnect(true);
        const opponent: Player = match.host === player ? match.friend : match.host;
        opponent.connection.emit("chat", data);
    });

    socket.on("move-piece", (data) => {
        let { username, fromX, fromY, toX, toY } = data;

        fromX = Math.abs(fromX - 7);
        fromY = Math.abs(fromY - 7);

        toX = Math.abs(toX - 7);
        toY = Math.abs(toY - 7);
        const player = players.find(p => p.username === username);
        if (!player) return;
        const match = matches.find(m => m.host === player || m.friend === player);
        if (!match) return
        const opponent: Player = match.host === player ? match.friend : match.host;
        opponent.connection.emit("move-piece", { fromX, fromY, toX, toY });
    });

    socket.on("checkmate", (data) => {
        let { username, winner } = data;
        const player = players.find(p => p.username === username);
        const match = matches.find(m => m.host === player || m.friend === player);
        if (!match) player.connection.disconnect(true);
        const opponent = match.host === player ? match.friend : match.host;
        opponent.connection.emit("checkmate", data);
    });

    socket.on("castling", (data) => {
        let { username, x, y, pieceType } = data;
        const player = players.find(p => p.username === username);
        const match = matches.find(m => m.host === player || m.friend === player);
        if (!match) player.connection.disconnect(true);
        const opponent = match.host === player ? match.friend : match.host;
        x = Math.abs(x - 7);
        y = Math.abs(y - 7);
        opponent.connection.emit("castling", { x, y, pieceType });

    });

    socket.on("disconnect", (data) => {
        const player = players.find(p => p.connection === socket);
        if (!player) return;
        const invite = invites.find(inv => inv.host === player);
        const match = matches.find(m => m.host === player || m.friend === player);

        if (match) {
            const opponent = match.friend == player ? match.host : match.friend;
            matches = matches.filter(m => m != match);
            if (opponent) {
                if (opponent.connection.connected) {
                    opponent.connection.emit("opponent-abandoned");
                    opponent.connection.disconnect(true);
                }
                players = players.filter(p => p.username != opponent.username);
            }
        }
        if (invite) {
            invites = invites.filter(inv => inv.id != invite.id);
        }

        players = players.filter(p => p.username != player.username);
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

httpServer.listen(5000, '0.0.0.0', () => console.log("Server started!"));