"use client"
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Users, Share2, Check } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Image from "next/image";
import { ThemeToggle } from "@/src/app/components/layout/ThemeToggle";
import { RoomPresence } from "@/src/app/chat/[id]/components/RoomPresence";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { APP_NAME } from "@/src/app/constants";

interface User {
    id: string;
    username: string;
    profileImage?: string;
}

interface ChatHeaderProps {
    roomId: string;
    roomName: string;
    roomIcon?: string;
    isUserListVisible: boolean;
    onToggleUserList: () => void;
    usersInRoom?: User[];
}

function RoomIcon({ roomName, roomIcon }: { roomName: string; roomIcon?: string }) {
    const [iconError, setIconError] = useState(false);

    if (roomIcon && !iconError) {
        return (
            <img
                src={roomIcon}
                alt=""
                className="w-6 h-6 rounded-full object-cover shrink-0"
                onError={() => setIconError(true)}
            />
        );
    }

    return (
        <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-[11px] font-bold flex items-center justify-center shrink-0 select-none">
            {(roomName || '?').charAt(0).toUpperCase()}
        </span>
    );
}

export function ChatHeader({ roomId, roomName, roomIcon, isUserListVisible, onToggleUserList, usersInRoom = [] }: ChatHeaderProps) {
    const { t } = useTranslation();
    const [justCopied, setJustCopied] = useState(false);

    const handleShare = async () => {
        const url = `${window.location.origin}/chat/${roomId}`;
        try {
            await navigator.clipboard.writeText(url);
            setJustCopied(true);
            toast.success(t('chat.header.link_copied'));
            setTimeout(() => setJustCopied(false), 2000);
        } catch {
            toast.error(t('chat.header.link_copy_error'));
        }
    };

    return (
        <header className="sticky top-0 z-50 h-14 sm:h-16 flex items-center justify-between px-3 sm:px-5 border-b border-white/[0.04] bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40 gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <Link href="/tribus" className="shrink-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl text-muted-foreground hover:text-foreground transition-all duration-200 ease-out hover:bg-accent/50 active:scale-[0.92]"
                        aria-label={t('chat.header.back')}
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>

                <div className="flex items-center gap-2.5 min-w-0">
                    <RoomIcon roomName={roomName} roomIcon={roomIcon} />

                    <h1 className="text-sm sm:text-base font-semibold tracking-tight truncate">
                        {roomName || t('chat.header.room_fallback')}
                    </h1>

                    <span className="relative flex w-1.5 h-1.5 sm:w-2 sm:h-2 shrink-0">
                        <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400/60 animate-ping" style={{ animationDuration: '2s' }} />
                        <span className="relative inline-flex w-full h-full rounded-full bg-emerald-500" />
                    </span>

                    <RoomPresence users={usersInRoom} onClick={onToggleUserList} />
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleShare}
                    aria-label={t('chat.header.share')}
                    className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl text-muted-foreground hover:text-foreground transition-all duration-200 ease-out hover:bg-accent/50 active:scale-[0.92] cursor-pointer"
                >
                    {justCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleUserList}
                    aria-label={t('chat.header.show_participants')}
                    className={`h-8 w-8 sm:h-9 sm:w-9 rounded-xl transition-all duration-200 ease-out active:scale-[0.92] ${isUserListVisible
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                        }`}
                >
                    <Users className="h-4 w-4" />
                </Button>

                <div className="flex items-center">
                    <ThemeToggle />
                </div>

                <Link href="/" className="flex items-center shrink-0 ml-0.5">
                    <Image
                        src="/images/logo_chat.png"
                        width={40}
                        height={40}
                        alt={APP_NAME}
                        className="w-8 h-8 sm:w-8 sm:h-8 object-contain opacity-70 hover:opacity-100 transition-opacity duration-200"
                    />
                </Link>
            </div>
        </header>
    );
}
