"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useSocket } from "@/components/providers/SocketProvider";
import { useUsername } from "@/src/app/hooks/useUsername";
import { useSocketHandler } from "@/src/app/hooks/useSocketHandler";
import { useAutoScroll } from "./useAutoScroll";

export function useChat() {
    const params = useParams();
    const roomId = params.id as string;
    const socket = useSocket();
    const username = useUsername();
    const { messages, connecting, notificationUser } = useSocketHandler(roomId, username);
    const { messagesEndRef, scrollToBottom } = useAutoScroll(messages);
    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === "" || !socket) return;
        socket.emit("message", newMessage);
        setNewMessage("");
    };

    return {
        roomId,
        messages,
        newMessage,
        username,
        connecting,
        messagesEndRef,
        setNewMessage,
        handleSendMessage,
        scrollToBottom,
        notificationUser,
    };
}