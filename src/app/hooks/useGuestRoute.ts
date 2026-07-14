"use client";

import { useSession } from "@/src/app/hooks/useSession";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const GUEST_ROUTES = ["/", "/login", "/signup", "/verify-email"];

export function useGuestRoute() {
  const { session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isPending) return;

    if (session && GUEST_ROUTES.includes(pathname)) {
      router.replace("/rooms");
    }
  }, [session, isPending, pathname, router]);

  return { isAuthenticated: !!session, isPending };
}
