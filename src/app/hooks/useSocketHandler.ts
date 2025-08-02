"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/components/providers/SocketProvider";
import { Message } from "@/src/types/chat";

export function useSocketHandler(roomId: string, username: string) {
    const socket = useSocket();
    const [messages, setMessages] = useState<Message[]>([]);
    const [connecting, setConnecting] = useState(true);

    useEffect(() => {
        if (socket && username) {
            socket.emit("joinRoom", roomId, username);
            setConnecting(false);

            const handleMessage = (msg: Message) => {
                setMessages((prev) => [...prev, msg]);
            };

            const handleImage = (img: Message) => {
                setMessages((prev) => [...prev, img]);
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
            socket.on("image", handleImage);
            socket.on("error", handleError);

            return () => {
                socket.off("message", handleMessage);
                socket.off("image", handleImage);
                socket.off("error", handleError);
                socket.emit("leaveRoom", roomId);
            };
        }
    }, [roomId, socket, username]);

    return { messages, connecting };
}
