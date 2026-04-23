"use client"
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import Image from "next/image";
import { ThemeToggle } from "@/src/app/components/layout/ThemeToggle";

const topicNames: Record<string, string> = {
    deportes: "Deportes",
    cocina: "Cocina",
    danza: "Danza",
    musica: "Música",
    cine: "Cine",
    viajes: "Viajes",
};

const topicIcons: Record<string, string> = {
    deportes: "⚽",
    cocina: "🍳",
};

interface ChatHeaderProps {
    roomId: string;
    roomName: string;
    isUserListVisible: boolean;
    onToggleUserList: () => void;
}

export function ChatHeader({ roomId, roomName, isUserListVisible, onToggleUserList }: ChatHeaderProps) {
    return (
        <header className="sticky top-0 z-50 h-14 sm:h-16 flex items-center justify-between px-2 sm:px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/20 gap-2">
            <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                <Link href="/rooms" className="shrink-0">
                    <Button variant="ghost" size="icon" aria-label="Volver" className="cursor-pointer h-8 w-8 sm:h-10 sm:w-10">
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                </Link>
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <span className="text-base sm:text-xl font-bold truncate">
                        {topicIcons[roomId] || "💬"} <span className="align-middle">{roomName || "Chat"}</span>
                    </span>
                    <Badge variant="outline" className="gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-medium shrink-0">
                        <span className="relative flex w-1.5 h-1.5 sm:w-2 sm:h-2">
                            <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-green-400"></span>
                            <span className="relative inline-flex w-full h-full rounded-full bg-green-500"></span>
                        </span>
                        <span className="hidden sm:inline">Sala activa</span>
                        <span className="inline sm:hidden">Activa</span>
                    </Badge>
                </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-3 shrink-0">
                <Button
                    variant={isUserListVisible ? "secondary" : "ghost"}
                    size="icon"
                    onClick={onToggleUserList}
                    aria-label="Mostrar participantes"
                    className="h-8 w-8 sm:h-10 sm:w-10"
                >
                    <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <div className="scale-75 sm:scale-100 origin-right flex items-center">
                    <ThemeToggle />
                </div>
                <Link href="/" className="flex items-center shrink-0">
                    <Image src="/images/logo_chat.png" width={70} height={70} alt="Logo" className="w-8 h-8 sm:w-12 sm:h-12 lg:w-[70px] lg:h-[70px] object-contain" />
                </Link>
            </div>
        </header>
    );
}
