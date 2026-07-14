import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In",
    description: "Sign in to ChatHub to join chat rooms, connect with people, and share moments.",
    robots: {
        index: false,
        follow: true,
    },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}