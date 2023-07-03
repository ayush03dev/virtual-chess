import './ChatMessage.css';

interface Props {
    message: string,
    username: string,
    odd: boolean
}

export default function ChatMessage({ message, username, odd }: Props) {
    const classes = ["chat-message", odd ? "odd-message" : "even-message"].join(" ");
    return (<p className={classes}><span className="username">{username}:</span> {message}</p>)
}