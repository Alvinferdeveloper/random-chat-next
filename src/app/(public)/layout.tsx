"use client";

import { GuestGuard } from "@/src/app/components/auth/GuestGuard";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <GuestGuard>{children}</GuestGuard>;
}
