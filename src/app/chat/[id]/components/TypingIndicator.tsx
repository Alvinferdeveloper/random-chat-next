"use client"
import React from "react";
import { useTranslation } from "react-i18next";

interface TypingIndicatorProps {
    typingUsers: Set<string>;
}

export function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
    const { t } = useTranslation();
    if (typingUsers.size === 0) return null;

    const users = Array.from(typingUsers);
    let text = "";

    if (users.length === 1) {
        text = t('chat.typing.single', { username: users[0] });
    } else if (users.length === 2) {
        text = t('chat.typing.double', { user1: users[0], user2: users[1] });
    } else {
        text = t('chat.typing.multiple');
    }

    return (
        <div className="flex items-center gap-3 px-4 py-2">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1 w-fit h-8 shadow-sm">
                <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"></span>
            </div>
            <span className="text-xs text-muted-foreground font-medium animate-fade-in">
                {text}
            </span>
        </div>
    );
}