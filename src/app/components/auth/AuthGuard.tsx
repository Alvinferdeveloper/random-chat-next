"use client";

import { useProtectedRoute } from "@/src/app/hooks/useProtectedRoute";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isPending } = useProtectedRoute();

  if (isPending) {
    return null;
  }

  return <>{children}</>;
}
