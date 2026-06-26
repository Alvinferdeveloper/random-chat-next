import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up",
    description: "Create your ChatHub account and join our community of themed chat rooms.",
    robots: {
        index: false,
        follow: true,
    },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}