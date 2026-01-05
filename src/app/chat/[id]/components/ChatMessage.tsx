"use client"
import { Message, isTextMessage, isImageMessage } from "@/src/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Reply, ChevronRight } from "lucide-react";
import React from "react";

interface ChatMessageProps {
    msg: Message;
    username: string;
    openImageViewer: (imageUrl: string) => void;
    scrollToBottom: () => void;
    setReplyingToMessage: (message: Message) => void;
}

function formatTime(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatMessage({ msg, username, openImageViewer, scrollToBottom, setReplyingToMessage }: ChatMessageProps) {
    const isMyMessage = msg.username === username;

    const imageUrl = isImageMessage(msg) && msg.image ? URL.createObjectURL(new Blob([msg.image])) : null;

    const getInitials = (name: string) => {
        return name.charAt(0).toUpperCase();
    };

    return (
        <div className={`flex w-full flex-col gap-1 ${isMyMessage ? "items-end" : "items-start"}`}>
            <div className={`flex items-center gap-2 ${isMyMessage ? "flex-row-reverse" : "flex-row"}`}>
                <Avatar className="h-6 w-6">
                    <AvatarImage src={msg.userProfileImage || undefined} alt={`${msg.username}'s profile picture`} />
                    <AvatarFallback>{getInitials(msg.username)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold text-primary">
                    {isMyMessage ? "Tú" : msg.username}
                </span>
                <span className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</span>
            </div>
            <div
                className={`max-w-xs rounded-lg text-sm md:max-w-md ${isMyMessage ? "bg-blue-700 text-white" : "bg-muted"} ${isImageMessage(msg) ? "p-0.5" : "p-2"}`}>

                {msg.replyTo && (
                    <div className="flex items-center gap-2 p-2 text-xs text-muted-foreground bg-muted-foreground/20 rounded-t-lg">
                        <Reply className="h-3 w-3" />
                        <span>Respondiendo a @{msg.replyTo.author}</span>
                        <ChevronRight className="h-3 w-3" />
                        <span className="italic truncate max-w-[150px]">{msg.replyTo.messageSnippet}</span>
                    </div>
                )}

                {isTextMessage(msg) && <p>{msg.message}</p>}
                {isImageMessage(msg) && imageUrl && (
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
            <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 opacity-0 hover:opacity-100 transition-opacity duration-200 ${isMyMessage ? "self-end" : "self-start"}`}
                onClick={() => setReplyingToMessage(msg)}
            >
                <Reply className="h-4 w-4" />
            </Button>
        </div>
    );
}
