"use client"
import { Flame } from "lucide-react";
import { useTranslation } from "react-i18next";

export function EmptyMessagesState() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-1 flex-col items-center justify-center text-center px-6 py-16 gap-3">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-1">
                <Flame className="w-6 h-6" />
            </div>
            <h2 className="text-base font-semibold">{t('chat.empty_state.title')}</h2>
            <p className="text-sm text-muted-foreground max-w-xs">{t('chat.empty_state.subtitle')}</p>
        </div>
    );
}
