"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/src/app/components/providers/SocketProvider";
import { Message } from "@/src/types/chat";
import { produce } from "immer";

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
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

    const startTyping = () => {
        if (socket) {
            socket.emit("start-typing");
        }
    };

    const stopTyping = () => {
        if (socket) {
            socket.emit("stop-typing");
        }
    };

    useEffect(() => {
        if (socket && username) {
            socket.emit("join-room", roomId, username);
            setConnecting(false);

            const handleMessage = (msg: Message) => {
                setMessages(prev => produce(prev, draft => {
                    draft.push(msg);
                }));
            };

            const handleUserJoined = (data: { username: string }) => {
                setNotificationUser(data.username);
                setTimeout(() => setNotificationUser(null), 4500);
            };

            const handleRoomUsers = (users: User[]) => {
                setUsersInRoom(users);
            };

            const handleUserStartedTyping = ({ username: typingUsername }: { username: string }) => {
                if (typingUsername !== username) { // Don't show ourselves
                    setTypingUsers(prev => {
                        const newSet = new Set(prev);
                        newSet.add(typingUsername);
                        return newSet;
                    });
                }
            };

            const handleUserStoppedTyping = ({ username: typingUsername }: { username: string }) => {
                setTypingUsers(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(typingUsername);
                    return newSet;
                });
            };

            const handleReactionUpdate = (
                { messageId, emoji, reactingUsername }: { messageId: string, emoji: string, reactingUsername: string }
            ) => {
                setMessages(prevMessages =>
                    produce(prevMessages, draft => {
                        const message = draft.find(msg => msg.id === messageId);
                        if (!message) return;

                        if (!message.reactions) {
                            message.reactions = [];
                        }

                        let reaction = message.reactions.find(r => r.emoji === emoji);

                        if (reaction) {
                            const userIndex = reaction.users.indexOf(reactingUsername);
                            if (userIndex > -1) {
                                // User exists, remove them (un-react)
                                reaction.users.splice(userIndex, 1);
                                // If no users left for this reaction, remove the reaction itself
                                if (reaction.users.length === 0) {
                                    message.reactions = message.reactions.filter(r => r.emoji !== emoji);
                                }
                            } else {
                                // User does not exist, add them
                                reaction.users.push(reactingUsername);
                            }
                        } else {
                            // Reaction does not exist, create it
                            message.reactions.push({ emoji, users: [reactingUsername] });
                        }
                    })
                );
            };

            const handleError = (errMsg: string) => {
                setMessages(prev => produce(prev, draft => {
                    draft.push({
                        id: Date.now().toString(),
                        username: "Sistema",
                        userProfileImage: null,
                        message: errMsg,
                        timestamp: new Date().toISOString(),
                        system: true,
                        replyTo: null,
                    });
                }));
            };

            socket.on("message", handleMessage);
            socket.on("image", handleMessage);
            socket.on("user-joined", handleUserJoined);
            socket.on("room_users", handleRoomUsers);
            socket.on("user-started-typing", handleUserStartedTyping);
            socket.on("user-stopped-typing", handleUserStoppedTyping);
            socket.on("reaction_update", handleReactionUpdate);
            socket.on("error", handleError);

            return () => {
                socket.off("message", handleMessage);
                socket.off("image", handleMessage);
                socket.off("user-joined", handleUserJoined);
                socket.off("room_users", handleRoomUsers);
                socket.off("user-started-typing", handleUserStartedTyping);
                socket.off("user-stopped-typing", handleUserStoppedTyping);
                socket.off("reaction_update", handleReactionUpdate);
                socket.off("error", handleError);
                socket.emit("leave-room", roomId);
            };
        }
    }, [roomId, socket, username]);

    return { messages, connecting, notificationUser, usersInRoom, typingUsers, startTyping, stopTyping };
}
