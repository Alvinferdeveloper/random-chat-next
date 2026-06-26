"use client"
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Image from "next/image";
import { ThemeToggle } from "@/src/app/components/layout/ThemeToggle";
import { useTranslation } from "react-i18next";

interface ChatHeaderProps {
    roomId: string;
    roomName: string;
    isUserListVisible: boolean;
    onToggleUserList: () => void;
    userCount?: number;
}

const ROOM_COLORS: Record<string, string> = {
    deportes: "bg-rose-500",
    cocina: "bg-amber-500",
    danza: "bg-violet-500",
    musica: "bg-sky-500",
    cine: "bg-indigo-500",
    viajes: "bg-emerald-500",
};

export function ChatHeader({ roomId, roomName, isUserListVisible, onToggleUserList, userCount = 0 }: ChatHeaderProps) {
    const { t } = useTranslation();
    const dotColor = ROOM_COLORS[roomId] || "bg-primary";

    return (
        <header className="sticky top-0 z-50 h-14 sm:h-16 flex items-center justify-between px-3 sm:px-5 border-b border-white/[0.04] bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40 gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <Link href="/rooms" className="shrink-0">
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
                    <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />

                    <h1 className="text-sm sm:text-base font-semibold tracking-tight truncate">
                        {roomName || t('chat.header.room_fallback')}
                    </h1>

                    <span className="relative flex w-1.5 h-1.5 sm:w-2 sm:h-2 shrink-0">
                        <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400/60 animate-ping" style={{ animationDuration: '2s' }} />
                        <span className="relative inline-flex w-full h-full rounded-full bg-emerald-500" />
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleUserList}
                    aria-label={t('chat.header.show_participants')}
                    className={`h-8 w-8 sm:h-9 sm:w-9 rounded-xl transition-all duration-200 ease-out active:scale-[0.92] ${
                        isUserListVisible
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                >
                    <Users className="h-4 w-4" />
                </Button>

                {userCount > 0 && (
                    <span className="text-[11px] sm:text-xs font-medium text-muted-foreground/60 tabular-nums -ml-0.5 sm:-ml-1">
                        {userCount}
                    </span>
                )}

                <div className="flex items-center">
                    <ThemeToggle />
                </div>

                <Link href="/" className="flex items-center shrink-0 ml-0.5">
                    <Image
                        src="/images/logo_chat.png"
                        width={32}
                        height={32}
                        alt="ChatHub"
                        className="w-7 h-7 sm:w-8 sm:h-8 object-contain opacity-70 hover:opacity-100 transition-opacity duration-200"
                    />
                </Link>
            </div>
        </header>
    );
}
