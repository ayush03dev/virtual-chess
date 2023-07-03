import { io } from "socket.io-client";

const URL: string = process.env.NODE_ENV === 'production' ? '' : 'localhost:5000';

export const socket = io(URL, {
    autoConnect: false
});


socket.on("connect", () => console.log("Hey world!"));