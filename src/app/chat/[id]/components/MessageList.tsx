"use client"
import React from "react";
import { Message } from "@/src/types/chat";
import { ChatMessage } from "@/src/app/chat/[id]/components/ChatMessage";

interface User {
    id: string;
    username: string;
    profileImage?: string;
}

interface MessageListProps {
    messages: Message[];
    username: string;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    openImageViewer: (imageUrl: string) => void;
    scrollToBottom: () => void;
    setReplyingToMessage: (message: Message) => void;
    sendReaction: (messageId: string, emoji: string) => void;
    usersInRoom: User[];
}

export function MessageList({ messages, username, messagesEndRef, openImageViewer, scrollToBottom, setReplyingToMessage, sendReaction, usersInRoom }: MessageListProps) {
    return (
        <div className="flex-1 p-4 overflow-y-auto scrollbar-thin-light">
            <div className="space-y-4">
                {messages.map((msg, idx) => (
                    <ChatMessage
                        key={msg.id}
                        msg={msg}
                        username={username}
                        openImageViewer={openImageViewer}
                        scrollToBottom={scrollToBottom}
                        setReplyingToMessage={setReplyingToMessage}
                        sendReaction={sendReaction}
                        usersInRoom={usersInRoom}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}
