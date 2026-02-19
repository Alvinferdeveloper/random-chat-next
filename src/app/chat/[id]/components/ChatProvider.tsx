'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSocket } from '@/src/app/components/providers/SocketEventProvider';
import { Message } from '@/src/types/chat';
import { produce } from 'immer';

interface User {
    id: string;
    username: string;
    profileImage?: string;
}

interface ChatContextType {
    messages: Message[];
    usersInRoom: User[];
    notificationUser: string | null;
    typingUsers: Set<string>;
    startTyping: () => void;
    stopTyping: () => void;
    sendReaction: (messageId: string, emoji: string) => void;
    addOptimisticMessage: (message: Message) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
};

interface ChatProviderProps {
    children: React.ReactNode;
    username: string;
}

export const ChatProvider = ({ children, username }: ChatProviderProps) => {
    const socket = useSocket();
    const [messages, setMessages] = useState<Message[]>([]);
    const [usersInRoom, setUsersInRoom] = useState<User[]>([]);
    const [notificationUser, setNotificationUser] = useState<string | null>(null);
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (msg: Message) => {
            setMessages(prev => produce(prev, draft => {
                if (msg.username === username) {
                    const uploadingIndex = draft.findIndex(m =>
                        (m as Message & { isUploading?: boolean }).isUploading
                    );
                    if (uploadingIndex !== -1) draft.splice(uploadingIndex, 1);
                }
                draft.push(msg);
            }));
        };

        const handleUserJoined = (data: { username: string }) => {
            setNotificationUser(data.username);
            setTimeout(() => setNotificationUser(null), 4500);
        };

        const handleRoomUsers = (users: User[]) => setUsersInRoom(users);

        const handleUserStartedTyping = ({ username: typingUsername }: { username: string }) => {
            if (typingUsername !== username) {
                setTypingUsers(prev => {
                    const next = new Set(prev);
                    next.add(typingUsername);
                    return next;
                });
            }
        };

        const handleUserStoppedTyping = ({ username: typingUsername }: { username: string }) => {
            setTypingUsers(prev => {
                const next = new Set(prev);
                next.delete(typingUsername);
                return next;
            });
        };

        const handleReactionUpdate = (
            { messageId, emoji, reactingUsername }: { messageId: string; emoji: string; reactingUsername: string }
        ) => {
            setMessages(prev => produce(prev, draft => {
                const message = draft.find(msg => msg.id === messageId);
                if (!message) return;
                if (!message.reactions) message.reactions = [];

                let reaction = message.reactions.find(r => r.emoji === emoji);
                if (reaction) {
                    const userIndex = reaction.users.indexOf(reactingUsername);
                    if (userIndex > -1) {
                        reaction.users.splice(userIndex, 1);
                        if (reaction.users.length === 0) {
                            message.reactions = message.reactions.filter(r => r.emoji !== emoji);
                        }
                    } else {
                        reaction.users.push(reactingUsername);
                    }
                } else {
                    message.reactions.push({ emoji, users: [reactingUsername] });
                }
            }));
        };

        const handleError = (errMsg: string) => {
            setMessages(prev => produce(prev, draft => {
                draft.push({
                    id: Date.now().toString(),
                    username: 'Sistema',
                    userProfileImage: null,
                    message: errMsg,
                    timestamp: new Date().toISOString(),
                    system: true,
                    replyTo: null,
                });
            }));
        };

        socket.on('message', handleMessage);
        socket.on('image', handleMessage);
        socket.on('user-joined', handleUserJoined);
        socket.on('room_users', handleRoomUsers);
        socket.on('user-started-typing', handleUserStartedTyping);
        socket.on('user-stopped-typing', handleUserStoppedTyping);
        socket.on('reaction_update', handleReactionUpdate);
        socket.on('error', handleError);

        return () => {
            socket.off('message', handleMessage);
            socket.off('image', handleMessage);
            socket.off('user-joined', handleUserJoined);
            socket.off('room_users', handleRoomUsers);
            socket.off('user-started-typing', handleUserStartedTyping);
            socket.off('user-stopped-typing', handleUserStoppedTyping);
            socket.off('reaction_update', handleReactionUpdate);
            socket.off('error', handleError);
        };
    }, [socket, username]);

    const startTyping = useCallback(() => socket?.emit('start-typing'), [socket]);
    const stopTyping = useCallback(() => socket?.emit('stop-typing'), [socket]);
    const sendReaction = useCallback((messageId: string, emoji: string) => {
        socket?.emit('send_reaction', { messageId, emoji });
    }, [socket]);
    const addOptimisticMessage = useCallback((message: Message) => {
        setMessages(prev => produce(prev, draft => { draft.push(message); }));
    }, []);

    return (
        <ChatContext.Provider value={{
            messages,
            usersInRoom,
            notificationUser,
            typingUsers,
            startTyping,
            stopTyping,
            sendReaction,
            addOptimisticMessage,
        }}>
            {children}
        </ChatContext.Provider>
    );
};
