import { ChangeEvent, useEffect, useRef, useState } from "react";
import "./Chatbox.css";
import { socket } from "../../socket";
import ChatMessage from "./ChatMessage/ChatMessage";

interface Props {
    username: string;
}

interface Message {
    message: string,
    username: string
}

export default function Chatbox({ username }: Props) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    }

    const onClick = (event: React.KeyboardEvent) => {
        if (event.key !== "Enter") return;
        if (message === "") return;
        socket.emit("chat", { username, message });
        setMessages((messages) => [...messages, { username, message }]);
        setMessage("");
    }

    useEffect(() => {
        socket.on("chat", data => {
            const msgs = messages.slice();
            msgs.push({ message: data.message, username: data.username });
            setMessages(msgs);
        });
    })

    return (<div className="chatbox-container">
        <h2 style={{ color: "White", textAlign: "justify", padding: "10px" }}>Chat With Friend</h2>

        <div id="chat-history">{messages.map((message, idx) => <ChatMessage key={idx} message={message.message} username={message.username} odd={idx % 2 !== 0} />)}
            <div ref={messagesEndRef} />
        </div>
        <input onKeyDown={e => onClick(e)} onChange={onChange} value={message} className="message-field" type="text" name="message-input"
            placeholder="Enter chat message" autoComplete="off" />

    </div>)
}