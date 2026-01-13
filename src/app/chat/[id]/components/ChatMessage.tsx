"use client"
import { Message, isTextMessage, isImageMessage, Reaction } from "@/src/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Reply, ChevronRight, SmilePlus } from "lucide-react";
import React, { useState, useRef } from "react";
import { useLongPress } from "@/src/app/chat/[id]/hooks/useLongPress";
import { useHover } from "@/src/app/hooks/useHover";
import { ReactionPicker } from "@/src/app/chat/[id]/components/ReactionPicker";
import { cn } from "@/src/lib/utils";

interface User {
    id: string;
    username: string;
    profileImage?: string;
}

interface ChatMessageProps {
    msg: Message;
    username: string;
    openImageViewer: (imageUrl: string) => void;
    scrollToBottom: () => void;
    setReplyingToMessage: (message: Message) => void;
    sendReaction: (messageId: string, emoji: string) => void;
    usersInRoom: User[];
}

function formatTime(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatMessage({ msg, username, openImageViewer, scrollToBottom, setReplyingToMessage, sendReaction, usersInRoom }: ChatMessageProps) {
    const isMyMessage = msg.username === username;
    const [menuVisible, setMenuVisible] = useState(false);
    const [pickerVisible, setPickerVisible] = useState(false);
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

    const handleReact = (emoji: string) => {
        sendReaction(msg.id, emoji);
        setPickerVisible(false);
        setMenuVisible(false);
    }

    const highlightMentions = (text: string) => {
        const mentionRegex = /@([a-zA-Z0-9_]+)/g;
        const parts = text.split(mentionRegex);

        return parts.map((part, index) => {
            if (index % 2 === 1) { // This is a username
                const userExists = usersInRoom.some(u => u.username === part);
                const isMe = part === username;
                return (
                    <span key={index} className={cn(
                        "font-semibold rounded px-1",
                        userExists ? "bg-blue-300/50 dark:bg-blue-700/50 text-blue-800 dark:text-blue-200" : "text-muted-foreground",
                        isMe && "ring-1 ring-blue-500"
                    )}>
                        @{part}
                    </span>
                );
            }
            return part; // This is a normal text part
        });
    };


    const messageContent = (
        <div
            ref={messageRef}
            className={cn(
                "max-w-xs rounded-2xl text-sm md:max-w-md relative mb-4",
                isMyMessage ? "bg-blue-700 text-white rounded-br-none" : "bg-muted rounded-bl-none",
                isImageMessage(msg) ? "p-1" : "p-3 shadow-sm"
            )}
            {...(!hasHover && longPressHandlers)}
            {...(!hasHover && { onContextMenu: (e) => handleLongPress(e) })}
        >
            {msg.replyTo && (
                <div className="flex items-center gap-2 p-2 text-xs text-muted-foreground bg-muted-foreground/20 rounded-t-lg">
                    <Reply className="h-3 w-3" />
                    <span>Respondiendo a @{msg.replyTo.author}</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="italic truncate max-w-[150px]">{msg.replyTo.messageSnippet}</span>
                </div>
            )}
            {isTextMessage(msg) && <p className="leading-relaxed">{highlightMentions(msg.message)}</p>}
            {isImageMessage(msg) && imageUrl && (
                <div className="cursor-pointer overflow-hidden rounded-xl" onClick={handleClick}>
                    <img src={imageUrl} alt="Imagen" className="w-full object-cover" onLoad={scrollToBottom} />
                    {msg.description && <p className="p-2 text-sm">{msg.description}</p>}
                </div>
            )}
            {msg.reactions && msg.reactions.length > 0 && (
                <div className={cn(
                    "absolute -bottom-3 flex gap-1 items-center z-10",
                    isMyMessage ? "right-2 flex-row-reverse" : "left-2"
                )}>
                    {msg.reactions.map((reaction: Reaction) => (
                        <button
                            key={reaction.emoji}
                            onClick={() => handleReact(reaction.emoji)}
                            className={cn(
                                "flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border-2 transition-transform hover:scale-110 active:scale-95",
                                "bg-white dark:bg-zinc-800 shadow-md",
                                isMyMessage ? "border-blue-700" : "border-muted"
                            )}
                        >
                            <span>{reaction.emoji}</span>
                            <span className={cn(
                                "font-bold",
                                isMyMessage ? "text-blue-700 dark:text-blue-400" : "text-muted-foreground"
                            )}>
                                {reaction.users.length}
                            </span>
                        </button>
                    ))}
                </div>
            )}
            {pickerVisible && hasHover && (
                <div className={cn(
                    "absolute -top-12 z-30 animate-in fade-in zoom-in duration-200",
                    isMyMessage ? "right-0" : "left-0"
                )}>
                    <ReactionPicker onSelect={handleReact} />
                </div>
            )}
        </div>
    );

    return (
        <>
            <div className={`group w-full flex flex-col gap-1 ${isMyMessage ? "items-end" : "items-start"}`}>
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

                <div className="flex items-center gap-2">
                    {hasHover && (
                        <div className={cn(
                            "flex flex-col gap-1 self-center opacity-0 group-hover:opacity-100 transition-opacity",
                            isMyMessage ? "order-first" : "order-last"
                        )}>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setPickerVisible(v => !v)}>
                                <SmilePlus className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleReply}>
                                <Reply className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                    {messageContent}
                </div>
            </div>

            {menuVisible && !hasHover && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => { setMenuVisible(false); setPickerVisible(false); }} />
                    <div
                        className={cn(
                            "fixed z-50 bg-background border rounded-lg shadow-lg p-1 flex items-center gap-1 right-6",
                            isMyMessage ? "right-6" : "left-6"
                        )}
                        style={{ top: menuPosition.y - 45 }}
                    >
                        {pickerVisible ? (
                            <ReactionPicker onSelect={handleReact} />
                        ) : (
                            <>
                                <Button variant="ghost" size="sm" onClick={() => { setPickerVisible(true); }} className="flex items-center gap-2">
                                    <SmilePlus className="h-4 w-4" /> React
                                </Button>
                                <Button variant="ghost" size="sm" onClick={handleReply} className="flex items-center gap-2">
                                    <Reply className="h-4 w-4" /> Responder
                                </Button>
                            </>
                        )}
                    </div>
                </>
            )}
        </>
    );
}
