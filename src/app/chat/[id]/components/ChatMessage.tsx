"use client"
import { Message } from "@/src/types/chat";

interface ChatMessageProps {
    msg: Message;
    username: string;
}

function formatTime(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatMessage({ msg, username }: ChatMessageProps) {
    const isMyMessage = msg.username === username && !msg.system;

    return (
        <div
            className={`flex w-full flex-col gap-1 ${msg.system ? "items-center" : isMyMessage ? "items-end" : "items-start"
                }`}
        >
            <div className={`flex items-center gap-2 ${isMyMessage ? "flex-row-reverse" : "flex-row"}`}>
                {!msg.system && (
                    <span className="text-sm font-semibold text-primary">
                        {isMyMessage ? "Tú" : msg.username}
                    </span>
                )}
                <span className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</span>
            </div>
            <div
                className={`max-w-xs rounded-lg ${msg.image ? "p-0.5" : "p-2"} text-sm md:max-w-md ${msg.system
                    ? "bg-muted/30 text-center italic"
                    : isMyMessage
                        ? "bg-blue-700 text-white"
                        : "bg-muted"
                    }`}
            >
                {msg.message && <p>{msg.message}</p>}
                {msg.image && (
                    <div>
                        <img
                            src={URL.createObjectURL(new Blob([msg.image]))}
                            alt="Imagen enviada"
                            className="rounded-lg"
                        />
                        {msg.description && <p className="mt-2 text-sm px-1">{msg.description}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
