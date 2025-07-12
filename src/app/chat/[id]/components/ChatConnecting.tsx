"use client"
import { Button } from "@shadcn/button";
import { ConnectingAnimation } from "@/components/animations/ConnectionAnimation";
import { useRouter } from "next/navigation";

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

interface ChatConnectingProps {
    roomId: string;
}

export function ChatConnecting({ roomId }: ChatConnectingProps) {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="w-full max-w-md p-8 space-y-6 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10">
                    <span className="text-3xl">{topicIcons[roomId] || "💬"}</span>
                </div>
                <h1 className="text-2xl font-bold">
                    Conectando a {topicNames[roomId] || "Chat"}
                </h1>
                <ConnectingAnimation text="Estableciendo conexión" />
                <p className="text-sm text-muted-foreground">
                    Estamos conectándote con otros usuarios interesados en este tema...
                </p>
                <Button variant="outline" onClick={() => router.push("/")} className="mt-4">
                    Cancelar
                </Button>
            </div>
        </div>
    );
}
