"use client";
import { useEffect, useRef, useCallback } from "react";
import { Message } from "@/src/types/chat";

export function useAutoScroll(messages: Message[]) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const isNearBottomRef = useRef(true);

    const checkNearBottom = useCallback(() => {
        const container = containerRef.current;
        if (!container) return true;
        const threshold = 150;
        return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
    }, []);

    const scrollToBottom = useCallback((smooth = true) => {
        messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "instant" });
    }, []);

    useEffect(() => {
        const container = messagesEndRef.current?.closest('[class*="overflow"]') as HTMLDivElement | null;
        containerRef.current = container;

        if (!container) return;

        const handleScroll = () => {
            isNearBottomRef.current = checkNearBottom();
        };

        container.addEventListener("scroll", handleScroll, { passive: true });
        isNearBottomRef.current = checkNearBottom();

        return () => container.removeEventListener("scroll", handleScroll);
    }, [checkNearBottom]);

    useEffect(() => {
        if (isNearBottomRef.current) {
            scrollToBottom(messages.length > 0);
        }
    }, [messages, scrollToBottom]);

    return { messagesEndRef, scrollToBottom: () => scrollToBottom(true) };
}
