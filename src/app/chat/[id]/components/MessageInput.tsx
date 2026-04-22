"use client"
import React, { useState, useRef } from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Send, Smile, Paperclip, X, Reply as ReplyIcon, Mic, Film } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Message, isTextMessage, isImageMessage, isAudioMessage } from "@/src/types/chat";
import { MentionList } from "@/src/app/chat/[id]/components/MentionList";
import { useAudioRecording } from "@/src/app/chat/[id]/hooks/useAudioRecording";
import { useSocketHandler } from "@/src/app/hooks/useSocketHandler";
import { useUsername } from "@/src/app/hooks/useUsername";
import VoiceNotePreview from "@/src/app/chat/[id]/components/VoiceNotePreview";
import { formatTime } from "@/src/app/chat/[id]/utils/time";
import { GifPicker } from "./GifPicker";
import { useSocket } from "@/src/app/components/providers/SocketEventProvider";
import { useClickOutside } from "@/src/app/hooks/useClickOutside";
import { cn } from "@/src/lib/utils";

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
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showGifPicker, setShowGifPicker] = useState(false);
    
    // Reference for closing pickers when clicking outside
    const pickerRef = useRef<HTMLDivElement>(null);
    useClickOutside(pickerRef, () => {
        setShowEmojiPicker(false);
        setShowGifPicker(false);
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const socket = useSocket();
    const { addOptimisticMessage } = useSocketHandler();
    const { username } = useUsername();
    const {
        isRecording,
        recordingTime,
        startRecording,
        stopRecording,
        cancelRecording,
        sendAudioNote,
        audioBlob
    } = useAudioRecording();

    const onEmojiClick = (emojiData: EmojiClickData) => {
        setNewMessage(prev => prev + emojiData.emoji);
        setShowEmojiPicker(false);
        inputRef.current?.focus();
        handleTypingInput();
    };

    const handleGifSelect = (gifUrl: string, giphyId: string) => {
        if (!socket || !username) return;

        const tempId = typeof crypto !== 'undefined' && crypto.randomUUID 
            ? crypto.randomUUID() 
            : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        let replyContext = undefined;
        if (replyingToMessage) {
            const snippet = isTextMessage(replyingToMessage) 
                ? replyingToMessage.message.substring(0, 50) 
                : '[Multimedia]';
            
            replyContext = {
                id: replyingToMessage.id,
                author: replyingToMessage.username,
                messageSnippet: snippet
            };
        }

        // Optimistic UI for GIF
        const optimisticGif = {
            id: tempId,
            username: username,
            userProfileImage: null,
            timestamp: new Date().toISOString(),
            gifUrl: gifUrl,
            giphyId: giphyId,
            replyTo: replyContext || null,
            reactions: [],
            isUploading: false
        };
        addOptimisticMessage(optimisticGif as any);

        socket.emit('gif', {
            gifUrl,
            giphyId,
            replyTo: replyContext,
            tempId
        });

        setShowGifPicker(false);
        setReplyingToMessage(null);
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
            setIsTyping(false);
            onStopTyping?.();
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        }
    };

    const handleSendAudio = async () => {
        let replyContext = undefined;
        if (replyingToMessage) {
            const messageSnippet = isTextMessage(replyingToMessage)
                ? replyingToMessage.message.substring(0, 50)
                : '[Imagen]';

            replyContext = {
                id: replyingToMessage.id,
                author: replyingToMessage.username,
                messageSnippet: messageSnippet.length === 50 ? `${messageSnippet}...` : messageSnippet,
            };
        }
        await sendAudioNote(replyContext, addOptimisticMessage, username);
    };

    return (
        <div className="sticky bottom-0  p-4 border-t bg-transparent z-30 
                        transition-[padding] duration-300 ease-in-out pb-[calc(1rem+var(--bottom-inset,0px))]">
            {replyingToMessage && (
                <div className="flex items-center justify-between p-2 mb-2 text-sm bg-muted rounded-t-lg border-b border-border">
                    <div className="flex items-center gap-2">
                        <ReplyIcon className="h-4 w-4 text-primary" />
                        <span>Respondiendo a <span className="font-semibold">{replyingToMessage.username}</span>:</span>
                        <span className="truncate italic max-w-[200px]">
                            {isTextMessage(replyingToMessage) ? replyingToMessage.message : (isImageMessage(replyingToMessage) ? replyingToMessage.description : (isAudioMessage(replyingToMessage) ? 'Nota de voz' : ''))}
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
                
                {/* Pickers container with click-outside detection */}
                <div ref={pickerRef}>
                    {showEmojiPicker && (
                        <div className="absolute bottom-full mb-2 z-20">
                            <EmojiPicker onEmojiClick={onEmojiClick} />
                        </div>
                    )}
                    
                    {showGifPicker && (
                        <div className="absolute bottom-full mb-2 z-20">
                            <GifPicker onSelect={handleGifSelect} />
                        </div>
                    )}
                </div>

                {/* Voice Note Preview Overlay */}
                {audioBlob && !isRecording && (
                    <VoiceNotePreview
                        recordingTime={recordingTime}
                        cancelRecording={cancelRecording}
                        handleSendAudio={handleSendAudio}
                    />
                )}

                <div className="flex items-center gap-2">
                    {isRecording ? (
                        <div className="flex-1 flex items-center justify-between px-4 h-10 bg-red-500/10 rounded-xl animate-pulse">
                            <div className="flex items-center gap-2 text-red-500">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                                <span className="text-sm font-bold uppercase tracking-tighter">GRABANDO {formatTime(recordingTime)}</span>
                            </div>
                            <button
                                onClick={cancelRecording}
                                className="text-xs font-bold text-gray-500 hover:text-gray-700 uppercase tracking-wider"
                            >
                                Cancelar
                            </button>
                        </div>
                    ) : (
                        <>
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
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey && !isMentionListVisible) {
                                            e.preventDefault();
                                            if (newMessage.trim()) {
                                                onSubmit(e as any);
                                            }
                                        }
                                    }}
                                    placeholder="Escribe un mensaje..."
                                    className="pr-20 bg-background/90"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center gap-0.5 px-1">
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => {
                                            setShowGifPicker(!showGifPicker);
                                            setShowEmojiPicker(false);
                                        }}
                                        className={cn(
                                            "cursor-pointer",
                                            showGifPicker ? "text-primary" : "text-muted-foreground"
                                        )}
                                    >
                                        <Film className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => {
                                            setShowEmojiPicker(!showEmojiPicker);
                                            setShowGifPicker(false);
                                        }}
                                        className={cn(
                                            "cursor-pointer",
                                            showEmojiPicker ? "text-primary" : "text-muted-foreground"
                                        )}
                                    >
                                        <Smile className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex items-center gap-1">
                        {isRecording ? (
                            <Button
                                onClick={() => stopRecording()}
                                className="h-10 w-10 cursor-pointer bg-red-500 hover:bg-red-600 text-white rounded-full shrink-0 shadow-lg shadow-red-500/20 transition-all"
                                size="icon"
                            >
                                <Mic className="h-5 w-5" />
                            </Button>
                        ) : newMessage.trim() === "" ? (
                            <Button
                                type="button"
                                onClick={startRecording}
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 cursor-pointer text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full shrink-0 transition-colors"
                            >
                                <Mic className="h-5 w-5" />
                            </Button>
                        ) : (
                            <form onSubmit={onSubmit}>
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!newMessage.trim()}
                                    className={`flex-shrink-0 transition-all duration-300 h-10 w-10 rounded-full cursor-pointer ${newMessage.trim() ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
