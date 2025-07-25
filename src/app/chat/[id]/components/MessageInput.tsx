"use client"
import React, { useState, useRef } from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Send, Smile, Paperclip } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface MessageInputProps {
    newMessage: string;
    setNewMessage: (value: string | ((prev: string) => string)) => void;
    handleSendMessage: (e: React.FormEvent) => void;
    handleImageSelect: (file: File) => void;
}

export function MessageInput({ newMessage, setNewMessage, handleSendMessage, handleImageSelect }: MessageInputProps) {
    const [showPicker, setShowPicker] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onEmojiClick = (emojiData: EmojiClickData) => {
        setNewMessage(prev => prev + emojiData.emoji);
        setShowPicker(false);
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageSelect(file);
        }
        // Reset the input value to allow selecting the same file again
        if (e.target) {
            e.target.value = "";
        }
    };

    return (
        <div className="sticky bottom-0 p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="relative">
                {showPicker && (
                    <div className="absolute bottom-full mb-2">
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                    </div>
                )}
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => fileInputRef.current?.click()}
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
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
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
