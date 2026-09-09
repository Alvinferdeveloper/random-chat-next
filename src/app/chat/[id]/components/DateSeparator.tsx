"use client"
import { useTranslation } from "react-i18next";
import { formatDateSeparator } from "@/src/app/chat/[id]/utils/time";

export function DateSeparator({ dateStr }: { dateStr: string }) {
    const { t, i18n } = useTranslation();

    return (
        <div className="w-full flex items-center gap-3 my-5 px-2 select-none">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70 whitespace-nowrap">
                {formatDateSeparator(dateStr, t, i18n.language)}
            </span>
            <div className="flex-1 h-px bg-border" />
        </div>
    );
}
