"use client"
import React, { useState, useRef } from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Send, Smile, Paperclip, X, Reply as ReplyIcon } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Message } from "@/src/types/chat";
import { MentionList } from "@/src/app/chat/[id]/components/MentionList";

interface User {
    id: string;
    username: string;
    profileImage?: string;
}
interface MessageInputProps {
    newMessage: string;
    setNewMessage: React.Dispatch<React.SetStateAction<string>>;
    handleSendMessage: (e: React.FormEvent) => void;
    handleImageSelect: (file: File) => void;
    replyingToMessage: Message | null;
    setReplyingToMessage: (message: Message | null) => void;
    usersInRoom: User[];
    isMentionListVisible: boolean;
    mentionQuery: string;
    handleSelectMention: (username: string) => void;
    onStartTyping?: () => void;
    onStopTyping?: () => void;
}

export function MessageInput({
    newMessage,
    setNewMessage,
    handleSendMessage,
    handleImageSelect,
    replyingToMessage,
    setReplyingToMessage,
    usersInRoom,
    isMentionListVisible,
    mentionQuery,
    handleSelectMention,
    onStartTyping,
    onStopTyping
}: MessageInputProps) {
    const [showPicker, setShowPicker] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const onEmojiClick = (emojiData: EmojiClickData) => {
        setNewMessage(prev => prev + emojiData.emoji);
        setShowPicker(false);
        inputRef.current?.focus();
        handleTypingInput();
    };

    const handleTypingInput = () => {
        if (!isTyping) {
            setIsTyping(true);
            onStartTyping?.();
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            onStopTyping?.();
        }, 2000);
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageSelect(file);
        }
        if (e.target) {
            e.target.value = "";
        }
    };

    const handleCancelReply = () => {
        setReplyingToMessage(null);
    };

    const onSubmit = (e: React.FormEvent) => {
        handleSendMessage(e);
        if (isTyping) {
            setIsTyping(false);
            onStopTyping?.();
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewMessage(value);
        if (value.trim().length > 0) {
            handleTypingInput();
        } else if (isTyping) {
            // If field is cleared, stop typing immediately
            setIsTyping(false);
            onStopTyping?.();
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        }
    };

    return (
        <div className="sticky bottom-0 p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 
                        transition-[padding] duration-300 ease-in-out pb-[calc(1rem+var(--bottom-inset,0px))]">
            {replyingToMessage && (
                <div className="flex items-center justify-between p-2 mb-2 text-sm bg-muted rounded-t-lg border-b border-border">
                    <div className="flex items-center gap-2">
                        <ReplyIcon className="h-4 w-4 text-primary" />
                        <span>Respondiendo a <span className="font-semibold">{replyingToMessage.username}</span>:</span>
                        <span className="truncate italic max-w-[200px]">
                            {"message" in replyingToMessage ? replyingToMessage.message : (replyingToMessage.description || '[Imagen]')}
                        </span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleCancelReply} className="h-6 w-6">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}
            <div className="relative">
                {isMentionListVisible && (
                    <MentionList
                        users={usersInRoom}
                        query={mentionQuery}
                        onSelect={handleSelectMention}
                    />
                )}
                {showPicker && (
                    <div className="absolute bottom-full mb-2 z-20">
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                    </div>
                )}
                <form onSubmit={onSubmit} className="flex items-center gap-2">
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-shrink-0"
                    >
                        <Paperclip className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                    <div className="relative flex-grow">
                        <Input
                            ref={inputRef}
                            value={newMessage}
                            onChange={onInputChange}
                            placeholder="Escribe un mensaje..."
                            className="pr-12"
                        />
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => setShowPicker(!showPicker)}
                            className="absolute inset-y-0 right-0 flex items-center justify-center"
                        >
                            <Smile className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    </div>
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!newMessage.trim()}
                        className={`flex-shrink-0 transition-all duration-300 ${newMessage.trim() ? "bg-primary hover:bg-primary/90" : "bg-muted text-muted-foreground"
                            }`}
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
