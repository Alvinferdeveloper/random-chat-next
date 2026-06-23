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
    editMessage: (messageId: string, message: string) => void;
    deleteMessage: (messageId: string) => void;
    editingMessage: Message | null;
    setEditingMessage: (message: Message | null) => void;
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
    const [editingMessage, setEditingMessage] = useState<Message | null>(null);

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (msg: Message & { tempId?: string }) => {
            setMessages(prev => produce(prev, draft => {
                if (msg.username === username) {
                    // Try to find the optimistic message by tempId first, then by isUploading flag
                    const targetIndex = msg.tempId
                        ? draft.findIndex(m => m.id === msg.tempId)
                        : draft.findIndex(m => (m as Message & { isUploading?: boolean }).isUploading);

                    if (targetIndex !== -1) {
                        draft.splice(targetIndex, 1);
                    }
                }
                draft.push(msg);
            }));
        };

        const handleMessageHistory = (recentMessages: Message[]) => {
            setMessages(prev => produce(prev, draft => {
                const existingIds = new Set(draft.map(m => m.id));
                const filteredHistory = recentMessages.filter(m => !existingIds.has(m.id));
                draft.unshift(...filteredHistory);
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

        const handleGlobalSystemMessage = (msg: Message) => {
            setMessages(prev => produce(prev, draft => {
                draft.push({
                    ...msg,
                    system: true,
                } as Message);
            }));
        };

        socket.on('message', handleMessage);
        socket.on('image', handleMessage);
        socket.on('audio', handleMessage);
        socket.on('gif', handleMessage);
        socket.on('message-history', handleMessageHistory);
        socket.on('user-joined', handleUserJoined);
        socket.on('room_users', handleRoomUsers);
        socket.on('user-started-typing', handleUserStartedTyping);
        socket.on('user-stopped-typing', handleUserStoppedTyping);
        socket.on('reaction_update', handleReactionUpdate);
        const handleMessageEdited = (payload: { id: string; message: string; edited: boolean }) => {
            setMessages(prev => produce(prev, draft => {
                const msg = draft.find(m => m.id === payload.id);
                if (!msg || !('message' in msg)) return;
                (msg as any).message = payload.message;
                (msg as any).edited = true;
            }));
        };

        const handleMessageDeleted = (payload: { id: string }) => {
            setMessages(prev => produce(prev, draft => {
                const index = draft.findIndex(m => m.id === payload.id);
                if (index !== -1) {
                    draft.splice(index, 1);
                }
            }));
        };

        socket.on('global_system_message', handleGlobalSystemMessage);
        socket.on('message-edited', handleMessageEdited);
        socket.on('message-deleted', handleMessageDeleted);
        socket.on('error', handleError);

        return () => {
            socket.off('message', handleMessage);
            socket.off('image', handleMessage);
            socket.off('audio', handleMessage);
            socket.off("gif", handleMessage)
            socket.off('message-history', handleMessageHistory);
            socket.off('user-joined', handleUserJoined);
            socket.off('room_users', handleRoomUsers);
            socket.off('user-started-typing', handleUserStartedTyping);
            socket.off('user-stopped-typing', handleUserStoppedTyping);
            socket.off('reaction_update', handleReactionUpdate);
            socket.off('global_system_message', handleGlobalSystemMessage);
            socket.off('message-edited', handleMessageEdited);
            socket.off('message-deleted', handleMessageDeleted);
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

    const editMessage = useCallback((messageId: string, message: string) => {
        socket?.emit('edit-message', { messageId, message });
    }, [socket]);

    const deleteMessage = useCallback((messageId: string) => {
        socket?.emit('delete-message', { messageId });
    }, [socket]);

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
            editMessage,
            deleteMessage,
            editingMessage,
            setEditingMessage,
        }}>
            {children}
        </ChatContext.Provider>
    );
};
