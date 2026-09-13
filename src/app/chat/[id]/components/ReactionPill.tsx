"use client"
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Reaction } from "@/src/types/chat";
import { useHover } from "@/src/app/hooks/useHover";
import { useLongPress } from "@/src/app/chat/[id]/hooks/useLongPress";
import { cn } from "@/src/lib/utils";

const MOBILE_TOOLTIP_DURATION_MS = 2200;

function formatReactionTooltip(users: string[], emoji: string, t: (key: string, opts?: Record<string, unknown>) => string) {
    if (users.length === 1) return t('chat.reaction_tooltip.one', { user: users[0], emoji });
    if (users.length === 2) return t('chat.reaction_tooltip.two', { user1: users[0], user2: users[1], emoji });
    return t('chat.reaction_tooltip.many', { user1: users[0], user2: users[1], count: users.length - 2, emoji });
}

interface ReactionPillProps {
    reaction: Reaction;
    isMyMessage: boolean;
    onReact: (emoji: string) => void;
    /** Lets the parent message hide its own hover-only action toolbar while
     * the pointer is over a reaction, since the pill sits inside the bubble
     * and would otherwise register as "hovering the message" too. */
    onHoverChange?: (hovered: boolean) => void;
}

/**
 * A single reaction pill (emoji + count) that reveals who reacted:
 * - Desktop: a tooltip fades in on hover (CSS-driven, no re-render).
 * - Touch devices: holding the pill briefly peeks the same tooltip,
 *   while a quick tap still toggles the reaction as before.
 */
export function ReactionPill({ reaction, isMyMessage, onReact, onHoverChange }: ReactionPillProps) {
    const { t } = useTranslation();
    const hasHover = useHover();
    const [isPeeking, setIsPeeking] = useState(false);

    const peekTooltip = useCallback(() => {
        setIsPeeking(true);
        window.setTimeout(() => setIsPeeking(false), MOBILE_TOOLTIP_DURATION_MS);
    }, []);

    const longPressHandlers = useLongPress(peekTooltip, () => onReact(reaction.emoji), { delay: 300 });

    const tooltipLabel = formatReactionTooltip(reaction.users, reaction.emoji, t);
    const tooltipClassName = cn(
        "absolute bottom-full mb-1.5 max-w-[220px] w-max rounded-lg border bg-background/95 backdrop-blur-sm shadow-md px-2.5 py-1 text-[11px] font-medium text-foreground pointer-events-none z-30",
        // Anchor to the edge facing the center of the screen instead of
        // centering on the pill - own-message reactions sit near the right
        // edge (others near the left), so a centered tooltip could overflow
        // past the viewport and cause horizontal scroll.
        isMyMessage ? "right-0" : "left-0"
    );

    return (
        <div className="relative group/reaction">
            {hasHover ? (
                <div className={cn(tooltipClassName, "opacity-0 group-hover/reaction:opacity-100 transition-opacity duration-150 ease-out")}>
                    {tooltipLabel}
                </div>
            ) : (
                isPeeking && <div className={tooltipClassName}>{tooltipLabel}</div>
            )}
            <button
                {...(hasHover
                    ? {
                        onMouseEnter: () => onHoverChange?.(true),
                        onMouseLeave: () => onHoverChange?.(false),
                        onClick: () => onReact(reaction.emoji),
                    }
                    : longPressHandlers)}
                className={cn(
                    "flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border-2 transition-transform hover:scale-110 active:scale-95 cursor-pointer",
                    "bg-white dark:bg-zinc-800 shadow-md",
                    isMyMessage ? "border-primary" : "border-muted"
                )}
            >
                <span>{reaction.emoji}</span>
                <span className={cn("font-bold", isMyMessage ? "text-primary" : "text-muted-foreground")}>
                    {reaction.users.length}
                </span>
            </button>
        </div>
    );
}
