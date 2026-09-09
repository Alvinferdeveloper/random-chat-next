"use client"
import React from "react";
import { Message } from "@/src/types/chat";
import { ChatMessage } from "@/src/app/chat/[id]/components/ChatMessage";
import { EmptyMessagesState } from "@/src/app/chat/[id]/components/EmptyMessagesState";

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
    favoriteGifs: any[];
    toggleFavorite: (giphyId: string, url: string, title?: string) => void;
    onEdit?: (message: Message) => void;
    onDelete?: (messageId: string) => void;
}

const GROUP_WINDOW_MS = 5 * 60 * 1000;

// A message starts a new group unless the message right before it is by the
// same author and close enough in time - never looks further back than that,
// so another author's message (or a system message) always breaks the run.
function isGroupStart(messages: Message[], index: number): boolean {
    const msg = messages[index];
    if ((msg as any).system) return true;

    const prev = messages[index - 1];
    if (!prev || (prev as any).system) return true;
    if (prev.username !== msg.username) return true;

    const gap = new Date(msg.timestamp).getTime() - new Date(prev.timestamp).getTime();
    return gap > GROUP_WINDOW_MS;
}

export function MessageList({ messages, username, messagesEndRef, openImageViewer, scrollToBottom, setReplyingToMessage, sendReaction, usersInRoom, favoriteGifs, toggleFavorite, onEdit, onDelete }: MessageListProps) {
    if (messages.length === 0) {
        return (
            <div className="flex flex-col h-full min-h-[50vh]">
                <EmptyMessagesState />
            </div>
        );
    }

    return (
        <div className="flex-1 p-4">
            <div>
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
                        favoriteGifs={favoriteGifs}
                        toggleFavorite={toggleFavorite}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        isGroupStart={isGroupStart(messages, idx)}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}
