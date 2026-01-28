"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSocket } from "@/src/app/components/providers/SocketProvider";
import { useUsername } from "@/src/app/hooks/useUsername";
import { useSocketHandler } from "@/src/app/hooks/useSocketHandler";
import { useAutoScroll } from "@/src/app/chat/[id]/hooks/useAutoScroll";
import { Message, isTextMessage } from "@/src/types/chat";

export function useChat() {
    const params = useParams();
    const roomId = params.id as string;
    const socket = useSocket();
    const username = useUsername();
    const { messages, connecting, notificationUser, usersInRoom, typingUsers, startTyping, stopTyping } = useSocketHandler(roomId, username);
    const { messagesEndRef, scrollToBottom } = useAutoScroll(messages);

    const [newMessage, setNewMessage] = useState("");
    const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);

    const [isMentionListVisible, setIsMentionListVisible] = useState(false);
    const [mentionQuery, setMentionQuery] = useState("");
    const [mentionStartIndex, setMentionStartIndex] = useState(-1);

    useEffect(() => {
        const atIndex = newMessage.lastIndexOf('@');
        // Show mention list if '@' is typed at the start or after a space
        if (atIndex > -1 && (atIndex === 0 || /\s/.test(newMessage[atIndex - 1]))) {
            const query = newMessage.substring(atIndex + 1);
            // Don't show for '@ '
            if (query !== ' ') {
                setMentionQuery(query);
                setMentionStartIndex(atIndex);
                setIsMentionListVisible(true);
            } else {
                setIsMentionListVisible(false);
            }
        } else {
            setIsMentionListVisible(false);
        }
    }, [newMessage]);


    const createReplyContext = (message: Message) => {
        const messageSnippet = isTextMessage(message)
            ? message.message.substring(0, 50)
            : '[Imagen]';

        return {
            id: message.id,
            author: message.username,
            messageSnippet: messageSnippet.length === 50 ? `${messageSnippet}...` : messageSnippet,
        };
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === "" || !socket) return;

        const payload: { message: string, replyTo?: object } = {
            message: newMessage,
        };

        if (replyingToMessage) {
            payload.replyTo = createReplyContext(replyingToMessage);
        }

        socket.emit("message", payload);
        setNewMessage("");
        setReplyingToMessage(null);
    };

    const sendImage = (file: File, description?: string) => {
        if (!socket) return;

        const payload: { image: File, description?: string, replyTo?: object } = {
            image: file,
            description,
        };

        if (replyingToMessage) {
            payload.replyTo = createReplyContext(replyingToMessage);
        }

        socket.emit('image', payload);
        setReplyingToMessage(null);
    };

    const sendReaction = (messageId: string, emoji: string) => {
        if (!socket) return;
        socket.emit("send_reaction", { messageId, emoji });
    };

    const handleSelectMention = (selectedUsername: string) => {
        const prefix = newMessage.substring(0, mentionStartIndex);
        setNewMessage(`${prefix}@${selectedUsername} `);
        setIsMentionListVisible(false);
    };

    return {
        roomId,
        messages,
        newMessage,
        username,
        connecting,
        messagesEndRef,
        replyingToMessage,
        notificationUser,
        usersInRoom,
        isMentionListVisible,
        mentionQuery,
        setNewMessage,
        handleSendMessage,
        sendImage,
        sendReaction,
        setReplyingToMessage,
        scrollToBottom,
        handleSelectMention,
        typingUsers,
        startTyping,
        stopTyping
    };
}