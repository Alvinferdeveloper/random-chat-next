"use client"
import React from "react";
import { Input } from "@shadcn/input";
import { Button } from "@shadcn/button";
import { Send } from "lucide-react";

interface MessageInputProps {
    newMessage: string;
    setNewMessage: (value: string) => void;
    handleSendMessage: (e: React.FormEvent) => void;
}

export function MessageInput({ newMessage, setNewMessage, handleSendMessage }: MessageInputProps) {
    return (
        <div className="sticky bottom-0 p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1"
                />
                <Button
                    type="submit"
                    size="icon"
                    disabled={!newMessage.trim()}
                    className={`transition-all duration-300 ${newMessage.trim() ? "bg-primary hover:bg-primary/90" : "bg-muted text-muted-foreground"
                        }`}
                >
                    <Send className="w-4 h-4" />
                </Button>
            </form>
        </div>
    );
}
