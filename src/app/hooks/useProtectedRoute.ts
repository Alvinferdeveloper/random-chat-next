"use client";

import { useSession } from "@/src/app/hooks/useSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useProtectedRoute() {
  const { session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.replace("/login");
    }
  }, [session, isPending, router]);

  return { isAuthenticated: !!session, isPending };
}
