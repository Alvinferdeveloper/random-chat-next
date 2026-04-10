"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/src/app/components/providers/SocketEventProvider";
import { useAuth } from "@/src/app/hooks/useAuth";

export function useJoinRoom(roomId: string, username: string) {
    const socket = useSocket();
    const { session } = useAuth();
    const [connecting, setConnecting] = useState(true);

    useEffect(() => {
        if (socket && username && roomId) {
            setConnecting(true);
            socket.emit("join-room", roomId, username);

            const trackActivity = async () => {
                if (session?.user) {
                    try {
                        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/rooms/${roomId}/activity`, {
                            method: "POST",
                            credentials: "include",
                            headers: {
                                "Content-Type": "application/json"
                            },
                        });
                    } catch (error) {
                        console.error("Error tracking activity:", error);
                    }
                }
            };

            trackActivity();

            setConnecting(false);

            return () => {
                socket.emit("leave-room", roomId);
            };
        }
    }, [roomId, socket, username, session]);

    return { connecting };
}
