"use client"
import { Button } from "@shadcn/button";
import { ConnectingAnimation } from "@/components/animations/ConnectionAnimation";
import { Flame } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface ChatConnectingProps {
    roomName?: string;
}

export function ChatConnecting({ roomName }: ChatConnectingProps) {
    const { t } = useTranslation();
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="w-full max-w-md p-8 space-y-6 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10">
                    <Flame className="w-7 h-7 text-primary" />
                </div>
                <h1 className="text-2xl font-bold">
                    {roomName
                        ? t('chat.connecting.connecting_to', { topic: roomName })
                        : t('chat.connecting.connecting_generic')}
                </h1>
                <ConnectingAnimation text={t('chat.connecting.establishing')} />
                <p className="text-sm text-muted-foreground">
                    {t('chat.connecting.connecting_users')}
                </p>
                <Button variant="outline" onClick={() => router.push("/")} className="mt-4">
                    {t('chat.connecting.cancel')}
                </Button>
            </div>
        </div>
    );
}
