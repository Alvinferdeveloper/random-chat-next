"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import { Message } from "@/src/types/chat";

export function useAutoScroll(messages: Message[]) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const isNearBottomRef = useRef(true);
    const [isNearBottom, setIsNearBottom] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const prevMessageCountRef = useRef(messages.length);

    const checkNearBottom = useCallback(() => {
        const container = containerRef.current;
        if (!container) return true;
        const threshold = 150;
        return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
    }, []);

    const scrollToBottom = useCallback((smooth = true) => {
        messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "instant" });
    }, []);

    const jumpToBottom = useCallback(() => {
        scrollToBottom(true);
        setUnreadCount(0);
    }, [scrollToBottom]);

    useEffect(() => {
        // Match the actual scrollable pane by its dedicated class, not a
        // generic "overflow" substring: that matched an ancestor flex wrapper
        // that clips (overflow-hidden) but never actually scrolls, so
        // scrollTop there was always 0 and near-bottom detection was wrong.
        const container = messagesEndRef.current?.closest('.scrollbar-thin-light') as HTMLDivElement | null;
        containerRef.current = container;

        if (!container) return;

        const handleScroll = () => {
            const nearBottom = checkNearBottom();
            isNearBottomRef.current = nearBottom;
            setIsNearBottom(nearBottom);
            if (nearBottom) setUnreadCount(0);
        };

        container.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => container.removeEventListener("scroll", handleScroll);
    }, [checkNearBottom]);

    useEffect(() => {
        const newMessageCount = messages.length - prevMessageCountRef.current;
        prevMessageCountRef.current = messages.length;

        if (isNearBottomRef.current) {
            scrollToBottom(messages.length > 0);
        } else if (newMessageCount > 0) {
            setUnreadCount(prev => prev + newMessageCount);
        }
    }, [messages, scrollToBottom]);

    return { messagesEndRef, scrollToBottom: () => scrollToBottom(true), isNearBottom, unreadCount, jumpToBottom };
}
