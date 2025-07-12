"use client"
import React from "react";
import { Message } from "@/src/types/chat";
import { ChatMessage } from "./ChatMessage";

interface MessageListProps {
    messages: Message[];
    username: string;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function MessageList({ messages, username, messagesEndRef }: MessageListProps) {
    return (
        <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
                {messages.map((msg, idx) => (
                    <ChatMessage key={idx} msg={msg} username={username} />
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}
