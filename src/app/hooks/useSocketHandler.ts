"use client";
import { useChatContext } from "@/src/app/chat/[id]/components/ChatProvider";

/**
 * Thin wrapper around ChatContext.
 * All socket event logic lives in ChatProvider (registered once).
 * Use this hook in any component inside /chat/[id] to access chat state.
 */
export function useSocketHandler() {
    return useChatContext();
}
