"use client"
import { Message, isTextMessage, isImageMessage } from "@/src/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Reply, ChevronRight } from "lucide-react";
import React, { useState, useRef } from "react";
import { useLongPress } from "@/src/app/chat/[id]/hooks/useLongPress";
import { useHover } from "@/src/app/hooks/useHover";

interface ChatMessageProps {
    msg: Message;
    username: string;
    openImageViewer: (imageUrl: string) => void;
    scrollToBottom: () => void;
    setReplyingToMessage: (message: Message) => void;
}

function formatTime(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatMessage({ msg, username, openImageViewer, scrollToBottom, setReplyingToMessage }: ChatMessageProps) {
    const isMyMessage = msg.username === username;
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const messageRef = useRef<HTMLDivElement>(null);
    const hasHover = useHover();

    const handleLongPress = (event: React.MouseEvent | React.TouchEvent) => {
        event.preventDefault();
        const rect = messageRef.current?.getBoundingClientRect();
        if (rect) {
            setMenuPosition({ x: rect.x + rect.width / 2, y: rect.y });
            setMenuVisible(true);
        }
    };

    const handleClick = () => {
        if (isImageMessage(msg) && imageUrl) {
            openImageViewer(imageUrl)
        }
    }

    const longPressHandlers = useLongPress(handleLongPress, handleClick, { delay: 300 });

    const imageUrl = isImageMessage(msg) && msg.image ? URL.createObjectURL(new Blob([msg.image])) : null;

    const getInitials = (name: string) => {
        return name.charAt(0).toUpperCase();
    };

    const handleReply = () => {
        setReplyingToMessage(msg);
        setMenuVisible(false);
    };

    const messageContent = (
        <div
            className={`max-w-xs rounded-lg text-sm md:max-w-md relative ${isMyMessage ? "bg-blue-700 text-white" : "bg-muted"} ${isImageMessage(msg) ? "p-0.5" : "p-2"}`}>

            {msg.replyTo && (
                <div className="flex items-center gap-2 p-2 text-xs text-muted-foreground bg-muted-foreground/20 rounded-t-lg">
                    <Reply className="h-3 w-3" />
                    <span>Respondiendo a @{msg.replyTo.author}</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="italic truncate max-w-[150px]">{msg.replyTo.messageSnippet}</span>
                </div>
            )}

            {isTextMessage(msg) && <p>{msg.message}</p>}
            {isImageMessage(msg) && imageUrl && (
                <div className="cursor-pointer">
                    <img
                        src={imageUrl}
                        alt="Imagen enviada"
                        className="rounded-lg"
                        onLoad={scrollToBottom}
                    />
                    {msg.description && <p className="mt-2 text-sm">{msg.description}</p>}
                </div>
            )}
        </div>
    );

    return (
        <>
            <div className={`group flex w-full flex-col gap-1 ${isMyMessage ? "items-end" : "items-start"}`}>
                <div className={`flex items-center gap-2 ${isMyMessage ? "flex-row-reverse" : "flex-row"}`}>
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={msg.userProfileImage || undefined} alt={`${msg.username}'s profile picture`} />
                        <AvatarFallback>{getInitials(msg.username)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-semibold text-primary">
                        {isMyMessage ? "Tú" : msg.username}
                    </span>
                    <span className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</span>
                </div>

                {hasHover ? (
                    <div className="relative flex items-center gap-2" ref={messageRef}>
                        {isMyMessage && (
                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleReply}>
                                <Reply className="h-4 w-4" />
                            </Button>
                        )}
                        {messageContent}
                        {!isMyMessage && (
                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleReply}>
                                <Reply className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="relative" ref={messageRef} {...longPressHandlers} onContextMenu={(e) => handleLongPress(e)}>
                        {messageContent}
                    </div>
                )}
            </div>

            {menuVisible && !hasHover && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuVisible(false)} />
                    <div
                        className="fixed z-50 bg-background border rounded-lg shadow-lg p-1"
                        style={{ top: menuPosition.y - 45, left: menuPosition.x }}
                    >
                        <Button variant="ghost" size="sm" onClick={handleReply} className="flex items-center gap-2">
                            <Reply className="h-4 w-4" />
                            Responder
                        </Button>
                    </div>
                </>
            )}
        </>
    );
}
