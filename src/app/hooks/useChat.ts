"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useSocket } from "@/components/providers/SocketProvider";
import { useUsername } from "./useUsername";
import { useSocketHandler } from "./useSocketHandler";
import { useAutoScroll } from "./useAutoScroll";
import { useImageHandling } from "./useImageHandling";

export function useChat() {
    const params = useParams();
    const roomId = params.id as string;
    const socket = useSocket();
    const username = useUsername();
    const { messages, connecting } = useSocketHandler(roomId, username);
    const { messagesEndRef, scrollToBottom } = useAutoScroll(messages);
    const {
        previewImage,
        description,
        isModalOpen,
        handleImageSelect,
        handleImageSend,
        setDescription,
        closeModal,
    } = useImageHandling();
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
        previewImage,
        description,
        isModalOpen,
        setNewMessage,
        handleSendMessage,
        handleImageSelect,
        handleImageSend,
        setDescription,
        closeModal,
        scrollToBottom,
    };
}