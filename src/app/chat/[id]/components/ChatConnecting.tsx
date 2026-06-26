"use client"
import { Button } from "@shadcn/button";
import { ConnectingAnimation } from "@/components/animations/ConnectionAnimation";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const topicIcons: Record<string, string> = {
    deportes: "⚽",
    cocina: "🍳",
};

interface ChatConnectingProps {
    roomId: string;
}

export function ChatConnecting({ roomId }: ChatConnectingProps) {
    const { t } = useTranslation();
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="w-full max-w-md p-8 space-y-6 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10">
                    <span className="text-3xl">{topicIcons[roomId] || "💬"}</span>
                </div>
                <h1 className="text-2xl font-bold">
                    {t('chat.connecting.connecting_to', { topic: t(`chat.connecting.topic.${roomId}`) || t('chat.connecting.topic.default') })}
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
