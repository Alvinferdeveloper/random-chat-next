"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/src/app/components/providers/SocketProvider";
import { Message } from "@/src/types/chat";

interface User {
    id: string;
    username: string;
    profileImage?: string;
}

export function useSocketHandler(roomId: string, username: string) {
    const socket = useSocket();
    const [messages, setMessages] = useState<Message[]>([]);
    const [usersInRoom, setUsersInRoom] = useState<User[]>([]);
    const [connecting, setConnecting] = useState(true);
    const [notificationUser, setNotificationUser] = useState<string | null>(null);

    useEffect(() => {
        if (socket && username) {
            socket.emit("join-room", roomId, username);
            setConnecting(false);

            const handleMessage = (msg: Message) => {
                setMessages((prev) => [...prev, msg]);
            };

            const handleImage = (img: Message) => {
                setMessages((prev) => [...prev, img]);
            };

            const handleUserJoined = (data: { username: string }) => {
                setNotificationUser(`${data.username}`);
                setTimeout(() => setNotificationUser(null), 4500);
            };

            const handleRoomUsers = (users: User[]) => {
                setUsersInRoom(users);
            };

            const handleError = (errMsg: string) => {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now().toString(),
                        username: "Sistema",
                        userProfileImage: null,
                        message: errMsg,
                        timestamp: new Date().toISOString(),
                        system: true,
                        replyTo: null,
                    },
                ]);
            };

            socket.on("message", handleMessage);
            socket.on("image", handleImage);
            socket.on("user-joined", handleUserJoined);
            socket.on("room_users", handleRoomUsers);
            socket.on("error", handleError);

            return () => {
                socket.off("message", handleMessage);
                socket.off("image", handleImage);
                socket.off("user-joined", handleUserJoined);
                socket.off("room_users", handleRoomUsers);
                socket.off("error", handleError);
                socket.emit("leave-room", roomId);
            };
        }
    }, [roomId, socket, username]);

    return { messages, connecting, notificationUser, usersInRoom };
}
