"use client";

import { useAuth } from "@/src/app/hooks/useAuth";

export function useSession() {
  return useAuth();
}
