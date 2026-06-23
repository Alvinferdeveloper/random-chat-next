"use client";
import { useState, useEffect } from "react";
import { Message, isTextMessage } from "@/src/types/chat";
import { useSocket } from "@/src/app/components/providers/SocketEventProvider";

export function useMessageInput(
    editingMessage: Message | null = null,
    setEditingMessage: (msg: Message | null) => void = () => {},
    editMessage: (messageId: string, message: string) => void = () => {}
) {
    const socket = useSocket();
    const [newMessage, setNewMessage] = useState("");
    const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);
    const [isMentionListVisible, setIsMentionListVisible] = useState(false);
    const [mentionQuery, setMentionQuery] = useState("");
    const [mentionStartIndex, setMentionStartIndex] = useState(-1);

    useEffect(() => {
        if (editingMessage && isTextMessage(editingMessage)) {
            setNewMessage(editingMessage.message);
        }
    }, [editingMessage]);

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

    const handleSendMessage = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (newMessage.trim() === "" || !socket) return;

        if (editingMessage) {
            editMessage(editingMessage.id, newMessage);
            setEditingMessage(null);
            setNewMessage("");
            return;
        }

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

    const handleSelectMention = (selectedUsername: string) => {
        const prefix = newMessage.substring(0, mentionStartIndex);
        setNewMessage(`${prefix}@${selectedUsername} `);
        setIsMentionListVisible(false);
    };

    const cancelEdit = () => {
        setEditingMessage(null);
        setNewMessage("");
    };

    return {
        newMessage,
        setNewMessage,
        replyingToMessage,
        setReplyingToMessage,
        isMentionListVisible,
        mentionQuery,
        handleSendMessage,
        sendImage,
        handleSelectMention,
        cancelEdit,
    };
}
