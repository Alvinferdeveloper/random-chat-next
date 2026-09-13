'use client';

import { motion } from "framer-motion";

interface ReactionPickerProps {
    onSelect: (emoji: string) => void;
}

export const commonReactions = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

export function ReactionPicker({ onSelect }: ReactionPickerProps) {
    return (
        <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 bg-background border rounded-full shadow-lg p-1"
        >
            {commonReactions.map((emoji) => (
                <button
                    key={emoji}
                    onClick={() => onSelect(emoji)}
                    className="p-1.5 rounded-full hover:bg-muted transition-colors text-xl cursor-pointer"
                    aria-label={`React with ${emoji}`}
                >
                    {emoji}
                </button>
            ))}
        </motion.div>
    );
}
