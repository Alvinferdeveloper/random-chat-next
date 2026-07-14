"use client";

import { useGuestRoute } from "@/src/app/hooks/useGuestRoute";

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { isPending } = useGuestRoute();

  if (isPending) {
    return null;
  }

  return <>{children}</>;
}
