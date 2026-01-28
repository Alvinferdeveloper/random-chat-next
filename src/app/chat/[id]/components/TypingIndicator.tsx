import React from "react";

interface TypingIndicatorProps {
    typingUsers: Set<string>;
}

export function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
    if (typingUsers.size === 0) return null;

    const users = Array.from(typingUsers);
    let text = "";

    if (users.length === 1) {
        text = `${users[0]} está escribiendo...`;
    } else if (users.length === 2) {
        text = `${users[0]} y ${users[1]} están escribiendo...`;
    } else {
        text = "Varias personas están escribiendo...";
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