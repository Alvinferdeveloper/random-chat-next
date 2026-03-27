"use client";
import { useSession } from "@/src/app/components/providers/SessionProvider";

export function useAuth() {
    return useSession();
}
