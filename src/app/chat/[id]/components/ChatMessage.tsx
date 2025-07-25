"use client"
import { Message } from "@/src/types/chat";

interface ChatMessageProps {
    msg: Message;
    username: string;
    openImageViewer: (imageUrl: string) => void;
    scrollToBottom: () => void;
}

function formatTime(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatMessage({ msg, username, openImageViewer, scrollToBottom }: ChatMessageProps) {
    const isMyMessage = msg.username === username && !msg.system;

    const imageUrl = msg.image ? URL.createObjectURL(new Blob([msg.image])) : null;

    return (
        <div
            className={`flex w-full flex-col gap-1 ${msg.system ? "items-center" : isMyMessage ? "items-end" : "items-start"}`}>
            <div className={`flex items-center gap-2 ${isMyMessage ? "flex-row-reverse" : "flex-row"}`}>
                {!msg.system && (
                    <span className="text-sm font-semibold text-primary">
                        {isMyMessage ? "Tú" : msg.username}
                    </span>
                )}
                <span className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</span>
            </div>
            <div
                className={`max-w-xs rounded-lg text-sm md:max-w-md ${msg.system
                    ? "bg-muted/30 text-center italic"
                    : isMyMessage
                        ? "bg-blue-700 text-white"
                        : "bg-muted"
                    }
                    ${msg.image ? "p-0.5" : "p-2"}`}>
                {msg.message && <p>{msg.message}</p>}
                {msg.image && imageUrl && (
                    <div
                        className="cursor-pointer"
                        onClick={() => openImageViewer(imageUrl)}
                    >
                        <img
                            src={imageUrl}
                            alt="Imagen enviada"
                            className="rounded-lg"
                            onLoad={scrollToBottom}
                        />
                        {msg.description && <p className="mt-2 text-sm">{msg.description}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
