"use client"
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useSocket } from "@/components/providers/SocketProvider";
import { Message } from "@/src/types/chat";

export function useChat() {
    const params = useParams();
    const roomId = params.id as string;
    const socket = useSocket();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [username, setUsername] = useState<string>("");
    const [connecting, setConnecting] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let storedUsername = localStorage.getItem("username");
        if (!storedUsername) {
            storedUsername = `Usuario${Math.floor(Math.random() * 10000)}`;
            localStorage.setItem("username", storedUsername);
        }
        setUsername(storedUsername);

        if (socket) {
            socket.emit("joinRoom", roomId, storedUsername);
            setConnecting(false);

            const handleMessage = (msg: Message) => {
                setMessages((prev) => [...prev, msg]);
            };

            const handleError = (errMsg: string) => {
                setMessages((prev) => [
                    ...prev,
                    {
                        username: "Sistema",
                        message: errMsg,
                        timestamp: new Date().toISOString(),
                        system: true,
                    },
                ]);
            };

            socket.on("message", handleMessage);
            socket.on("error", handleError);

            return () => {
                socket.off("message", handleMessage);
                socket.off("error", handleError);
            };
        }
    }, [roomId, socket]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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
    };
}
