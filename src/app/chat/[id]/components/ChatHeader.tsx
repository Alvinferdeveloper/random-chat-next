"use client"
import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "@shadcn/button";
import { Badge } from "@shadcn/badge";

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
}

export function ChatHeader({ roomId }: ChatHeaderProps) {
    return (
        <header className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-2">
                <Link href="/">
                    <Button variant="ghost" size="icon" aria-label="Volver">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">
                        {topicIcons[roomId] || "💬"} {topicNames[roomId] || "Chat"}
                    </span>
                    <Badge variant="outline" className="gap-1 px-2 py-1 text-xs font-medium">
                        <span className="relative flex w-2 h-2 mr-1">
                            <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-green-400"></span>
                            <span className="relative inline-flex w-2 h-2 rounded-full bg-green-500"></span>
                        </span>
                        Sala activa
                    </Badge>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Link href="/" className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <span className="font-bold">ChatHub</span>
                </Link>
            </div>
        </header>
    );
}
