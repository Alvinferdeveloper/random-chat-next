"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/src/app/components/providers/SocketProvider";

export function useJoinRoom(roomId: string, username: string) {
    const socket = useSocket();
    const [connecting, setConnecting] = useState(true);

    useEffect(() => {
        if (socket && username && roomId) {
            setConnecting(true);
            socket.emit("join-room", roomId, username);

            // Assuming successful join if we emit. 
            // Ideally we'd wait for an ack.
            setConnecting(false);

            return () => {
                socket.emit("leave-room", roomId);
            };
        }
    }, [roomId, socket, username]);

    return { connecting };
}
