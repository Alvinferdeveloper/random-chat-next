"use client";
import { useEffect, useRef } from "react";
import { Message } from "@/src/types/chat";

export function useAutoScroll(messages: Message[]) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return { messagesEndRef, scrollToBottom };
}
