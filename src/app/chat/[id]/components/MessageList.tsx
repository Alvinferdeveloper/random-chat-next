"use client"
import React from "react";
import { Message } from "@/src/types/chat";
import { ChatMessage } from "@/src/app/chat/[id]/components/ChatMessage";

interface MessageListProps {
    messages: Message[];
    username: string;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    openImageViewer: (imageUrl: string) => void;
    scrollToBottom: () => void;
    setReplyingToMessage: (message: Message) => void;
    sendReaction: (messageId: string, emoji: string) => void;
}

export function MessageList({ messages, username, messagesEndRef, openImageViewer, scrollToBottom, setReplyingToMessage, sendReaction }: MessageListProps) {
    return (
        <div className="flex-1 p-4 overflow-y-auto scrollbar-thin-light">
            <div className="space-y-4">
                {messages.map((msg, idx) => (
                    <ChatMessage
                        key={msg.id} // Use msg.id as key if available and unique
                        msg={msg}
                        username={username}
                        openImageViewer={openImageViewer}
                        scrollToBottom={scrollToBottom}
                        setReplyingToMessage={setReplyingToMessage}
                        sendReaction={sendReaction}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}
