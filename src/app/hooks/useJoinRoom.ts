"use client";
import { useState, useEffect, useRef } from "react";
import { useSocket } from "@/src/app/components/providers/SocketEventProvider";
import { useAuth } from "@/src/app/hooks/useAuth";

export function useJoinRoom(roomId: string, username: string) {
    const socket = useSocket();
    const { session } = useAuth();
    const [connecting, setConnecting] = useState(true);
    const activityTrackedRef = useRef<string | null>(null);

    const userId = session?.user?.id ?? null;

    // Main effect: join/leave room (does NOT depend on session)
    useEffect(() => {
        if (socket && username && roomId) {
            setConnecting(true);
            socket.emit("join-room", roomId, username);
            setConnecting(false);
            sessionStorage.setItem('last_chat_room', roomId);

            return () => {
                socket.emit("leave-room", roomId);
                sessionStorage.removeItem('last_chat_room');
            };
        }
    }, [roomId, socket, username]);

    // Separate effect: track activity once per room when authenticated
    useEffect(() => {
        if (userId && roomId && activityTrackedRef.current !== roomId) {
            activityTrackedRef.current = roomId;
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/rooms/${roomId}/activity`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
            }).catch(error => {
                console.error("Error tracking activity:", error);
            });
        }
    }, [userId, roomId]);

    return { connecting };
}
