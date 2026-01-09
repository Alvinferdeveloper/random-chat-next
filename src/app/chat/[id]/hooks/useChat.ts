"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useSocket } from "@/src/app/components/providers/SocketProvider";
import { useUsername } from "@/src/app/hooks/useUsername";
import { useSocketHandler } from "@/src/app/hooks/useSocketHandler";
import { useAutoScroll } from "@/src/app/chat/[id]/hooks/useAutoScroll";
import { Message, isTextMessage } from "@/src/types/chat";

export function useChat() {
    const params = useParams();
    const roomId = params.id as string;
    const socket = useSocket();
    const username = useUsername();
    const { messages, connecting, notificationUser, usersInRoom } = useSocketHandler(roomId, username);
    const { messagesEndRef, scrollToBottom } = useAutoScroll(messages);

    const [newMessage, setNewMessage] = useState("");
    const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);

    const createReplyContext = (message: Message) => {
        const messageSnippet = isTextMessage(message)
            ? message.message.substring(0, 50)
            : '[Imagen]'; // Or some other placeholder for images

        return {
            id: message.id,
            author: message.username,
            messageSnippet: messageSnippet.length === 50 ? `${messageSnippet}...` : messageSnippet,
        };
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === "" || !socket) return;

        const payload: { message: string, replyTo?: object } = {
            message: newMessage,
        };

        if (replyingToMessage) {
            payload.replyTo = createReplyContext(replyingToMessage);
        }

        socket.emit("message", payload);
        setNewMessage("");
        setReplyingToMessage(null);
    };

    const sendImage = (file: File, description?: string) => {
        if (!socket) return;

        const payload: { image: File, description?: string, replyTo?: object } = {
            image: file,
            description,
        };

        if (replyingToMessage) {
            payload.replyTo = createReplyContext(replyingToMessage);
        }

        socket.emit('image', payload);
        setReplyingToMessage(null);
    };

    const sendReaction = (messageId: string, emoji: string) => {
        if (!socket) return;
        socket.emit("send_reaction", { messageId, emoji });
    };

    return {
        roomId,
        messages,
        newMessage,
        username,
        connecting,
        messagesEndRef,
        replyingToMessage,
        notificationUser,
        usersInRoom,
        setNewMessage,
        handleSendMessage,
        sendImage,
        sendReaction,
        setReplyingToMessage,
        scrollToBottom,
    };
}