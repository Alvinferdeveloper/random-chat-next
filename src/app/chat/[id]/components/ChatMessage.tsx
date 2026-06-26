"use client"
import { Message, isTextMessage, isImageMessage, isAudioMessage, isGifMessage, Reaction } from "@/src/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { Reply, ChevronRight, SmilePlus, Loader2, Heart, Megaphone, ShieldCheck, Pencil, Trash2 } from "lucide-react";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLongPress } from "@/src/app/chat/[id]/hooks/useLongPress";
import { useHover } from "@/src/app/hooks/useHover";
import { ReactionPicker } from "@/src/app/chat/[id]/components/ReactionPicker";
import { cn } from "@/src/lib/utils";
import { AudioPlayer } from "@/src/app/chat/[id]/components/AudioPlayer";
import { useAuth } from "@/src/app/hooks/useAuth";
import { useTranslation } from "react-i18next";

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
    favoriteGifs: any[];
    toggleFavorite: (giphyId: string, url: string, title?: string) => void;
    onEdit?: (message: Message) => void;
    onDelete?: (messageId: string) => void;
}

function formatTime(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatMessage({ msg, username, openImageViewer, scrollToBottom, setReplyingToMessage, sendReaction, usersInRoom, favoriteGifs, toggleFavorite, onEdit, onDelete }: ChatMessageProps) {
    const { t } = useTranslation();
    const isMyMessage = msg.username === username;
    const [menuVisible, setMenuVisible] = useState(false);
    const [pickerVisible, setPickerVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const messageRef = useRef<HTMLDivElement>(null);
    const hasHover = useHover();
    const { session } = useAuth();

    const handleLongPress = (event: React.MouseEvent | React.TouchEvent) => {
        event.preventDefault();
        const rect = messageRef.current?.getBoundingClientRect();
        if (rect) {
            setMenuPosition({ x: rect.x + rect.width / 2, y: rect.y });
            setMenuVisible(true);
        }
    };

    const handleClick = () => {
        if (isImageMessage(msg) && msg.imageUrl) {
            openImageViewer(msg.imageUrl)
        } else if (isGifMessage(msg) && msg.gifUrl) {
            openImageViewer(msg.gifUrl)
        }
    }

    const longPressHandlers = useLongPress(handleLongPress, handleClick, { delay: 300 });

    // Close menu on scroll
    const dismissMenu = useCallback(() => {
        if (menuVisible) {
            setMenuVisible(false);
            setPickerVisible(false);
        }
    }, [menuVisible]);

    useEffect(() => {
        if (!menuVisible) return;

        // Listen to scroll on the nearest scrollable ancestor and window
        const scrollParent = messageRef.current?.closest('[class*="overflow-y"]') as HTMLElement | null;
        const handler = () => dismissMenu();

        window.addEventListener('scroll', handler, true); // capture phase to catch all scrolls
        scrollParent?.addEventListener('scroll', handler);
        window.addEventListener('touchmove', handler, { passive: true });

        return () => {
            window.removeEventListener('scroll', handler, true);
            scrollParent?.removeEventListener('scroll', handler);
            window.removeEventListener('touchmove', handler);
        };
    }, [menuVisible, dismissMenu]);

    const imageUrl = isImageMessage(msg) ? msg.imageUrl : null;
    const audioUrl = isAudioMessage(msg) ? msg.audioUrl : null;
    const gifUrl = isGifMessage(msg) ? msg.gifUrl : null;

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

    const isGifFavorite = (giphyId: string) => favoriteGifs.some(g => g.giphyId === giphyId);

    const handleToggleGifFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!session || !isGifMessage(msg)) return;
        toggleFavorite(msg.giphyId, msg.gifUrl, t('chat.message.gif_label'));
    };

    const highlightMentions = (text: string) => {
        const mentionRegex = /@([a-zA-Z0-9_]+)/g;
        const parts = text.split(mentionRegex);

        return parts.map((part, index) => {
            if (index % 2 === 1) { // This is a username
                const userExists = usersInRoom.some(u => u.username === part);
                const isMe = part === username;
                return (
                    <Link
                        key={index}
                        href={`/profile/${encodeURIComponent(part)}`}
                        className={cn(
                            "font-semibold rounded px-1",
                            userExists ? "bg-blue-300/50 dark:bg-blue-700/50 text-blue-800 dark:text-blue-200" : "text-muted-foreground",
                            isMe && "ring-1 ring-blue-500"
                        )}
                    >
                        @{part}
                    </Link>
                );
            }
            return part; // This is a normal text part
        });
    };

    // System and Global Announcement rendering
    if ((msg as any).system) {
        if ((msg as any).isGlobal) {
            return (
                <div className="w-full flex justify-center my-6 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="max-w-md bg-primary/10 border-2 border-primary/20 backdrop-blur-md rounded-2xl p-4 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
                            <Megaphone className="w-12 h-12 rotate-12" />
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-xs uppercase tracking-widest text-primary">{t('chat.message.official_announcement')}</span>
                        </div>
                        {isTextMessage(msg) && (
                            <p className="text-sm font-medium leading-relaxed italic">
                                "{msg.message}"
                            </p>
                        )}
                        <div className="mt-3 text-[10px] text-muted-foreground flex justify-end">
                            {formatTime(msg.timestamp)}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="w-full flex justify-center my-2 animate-in fade-in duration-300">
                <div className="px-3 py-1 rounded-full bg-muted/50 border text-[11px] text-muted-foreground font-medium">
                    {isTextMessage(msg) ? msg.message : t('chat.message.system_message')}
                </div>
            </div>
        );
    }

    const messageContent = (
        <div
            ref={messageRef}
            className={cn(
                "max-w-xs rounded-2xl text-sm md:max-w-md relative mb-4",
                isMyMessage ? "bg-blue-700 text-white rounded-tr-none" : "bg-muted rounded-tl-none",
                isImageMessage(msg) || isGifMessage(msg) ? "p-0.5" : "p-3 shadow-sm"
            )}
            {...(!hasHover && longPressHandlers)}
            {...(!hasHover && { onContextMenu: (e) => handleLongPress(e) })}
        >
            {msg.replyTo && (
                <div className="flex items-center gap-2 p-2 text-xs text-muted-foreground bg-muted-foreground/20 rounded-t-lg">
                    <Reply className="h-3 w-3" />
                    <span>{t('chat.message.replying_to', { username: msg.replyTo.author })}</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="italic truncate max-w-[150px]">{msg.replyTo.messageSnippet}</span>
                </div>
            )}
            {isTextMessage(msg) && <p className="leading-relaxed">{highlightMentions(msg.message)}</p>}

            {/* Image Rendering */}
            {isImageMessage(msg) && imageUrl && (
                <div className="cursor-pointer overflow-hidden rounded-xl relative" onClick={handleClick}>
                    <img
                        src={imageUrl}
                        alt={t('chat.message.image_alt')}
                        className={cn("w-full object-cover", msg.isUploading && "opacity-50")}
                        onLoad={scrollToBottom}
                    />
                    {msg.isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                    )}
                    {msg.description && <p className="p-2 text-sm">{msg.description}</p>}
                </div>
            )}

            {/* GIF Rendering */}
            {isGifMessage(msg) && gifUrl && (
                <div className="group/gif cursor-pointer overflow-hidden rounded-xl relative" onClick={handleClick}>
                    <img
                        src={gifUrl}
                        alt={t('chat.message.gif_alt')}
                        className="w-full object-cover"
                        onLoad={scrollToBottom}
                    />

                    {/* Favorite Button (steal GIF) */}
                    {session && (
                        <button
                            onClick={handleToggleGifFavorite}
                            className="absolute cursor-pointer top-2 right-2 p-1.5 rounded-full bg-black/40 backdrop-blur-md opacity-0 group-hover/gif:opacity-100 transition-opacity hover:bg-black/60"
                            title={isGifFavorite(msg.giphyId) ? t('chat.message.remove_fav') : t('chat.message.steal_gif')}
                        >
                            <Heart className={cn(
                                "h-4 w-4 transition-colors",
                                isGifFavorite(msg.giphyId) ? "fill-red-500 text-red-500" : "text-white"
                            )} />
                        </button>
                    )}

                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] font-bold text-white uppercase tracking-wider border border-white/20">
                        {t('chat.message.gif')}
                    </div>
                </div>
            )}

            {/* Audio Rendering */}
            {isAudioMessage(msg) && audioUrl && (
                <AudioPlayer url={audioUrl} isUploading={msg.isUploading} duration={msg.duration} />
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
                    {isMyMessage ? (
                        <Avatar className="h-6 w-6">
                            <AvatarImage
                                src={msg.userProfileImage || `https://api.dicebear.com/9.x/avataaars/svg?seed=${msg.username}`}
                                alt={`${msg.username}'s profile picture`}
                            />
                            <AvatarFallback>{getInitials(msg.username)}</AvatarFallback>
                        </Avatar>
                    ) : (
                        <Link href={`/profile/${encodeURIComponent(msg.username)}`}>
                            <Avatar className="h-6 w-6 hover:ring-2 hover:ring-primary transition-all">
                                <AvatarImage
                                    src={msg.userProfileImage || `https://api.dicebear.com/9.x/avataaars/svg?seed=${msg.username}`}
                                    alt={`${msg.username}'s profile picture`}
                                />
                                <AvatarFallback>{getInitials(msg.username)}</AvatarFallback>
                            </Avatar>
                        </Link>
                    )}
                    {isMyMessage ? (
                        <span className="text-sm font-semibold text-primary">{t('chat.message.you')}</span>
                    ) : (
                        <Link
                            href={`/profile/${encodeURIComponent(msg.username)}`}
                            className="text-sm font-semibold text-primary hover:underline"
                        >
                            {msg.username}
                        </Link>
                    )}
                    <span className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</span>
                    {msg.edited && <span className="text-[10px] text-muted-foreground/60 italic ml-1">{t('chat.message.edited')}</span>}
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
                            {isMyMessage && isTextMessage(msg) && onEdit && (
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit(msg)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            )}
                            {isMyMessage && onDelete && (
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDelete(msg.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    )}
                    {messageContent}
                </div>
            </div>

            {menuVisible && !hasHover && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={dismissMenu}
                        onTouchMove={dismissMenu}
                    />
                    <div
                        className={cn(
                            "fixed z-50 bg-background/95 backdrop-blur-sm border rounded-xl shadow-xl p-1 flex flex-col items-stretch gap-0.5 min-w-[140px]",
                            "animate-in fade-in zoom-in-95 duration-200",
                            isMyMessage ? "right-6" : "left-6"
                        )}
                        style={{ top: menuPosition.y - 45 }}
                    >
                        {pickerVisible ? (
                            <div className="animate-in fade-in slide-in-from-left-2 duration-150">
                                <ReactionPicker onSelect={handleReact} />
                            </div>
                        ) : (
                            <div className="flex flex-col w-full">
                                <Button variant="ghost" size="sm" onClick={() => { setPickerVisible(true); }} className="flex items-center gap-3 rounded-lg justify-start px-3">
                                    <SmilePlus className="h-4 w-4" /> {t('chat.message.react')}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={handleReply} className="flex items-center gap-3 rounded-lg justify-start px-3">
                                    <Reply className="h-4 w-4" /> {t('chat.message.reply')}
                                </Button>
                                {isMyMessage && isTextMessage(msg) && onEdit && (
                                    <Button variant="ghost" size="sm" onClick={() => onEdit(msg)} className="flex items-center gap-3 rounded-lg justify-start px-3">
                                        <Pencil className="h-4 w-4" /> {t('chat.message.edit')}
                                    </Button>
                                )}
                                {isMyMessage && onDelete && (
                                    <Button variant="ghost" size="sm" onClick={() => onDelete(msg.id)} className="flex items-center gap-3 rounded-lg justify-start px-3">
                                        <Trash2 className="h-4 w-4" /> {t('chat.message.delete')}
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
}
