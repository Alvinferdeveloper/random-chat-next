import GlobalLayout from "@/src/app/components/layout/GlobalLayout"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Profile",
    description: "Manage your ChatHub user profile. Update your information and preferences.",
    robots: {
        index: false,
        follow: true,
    },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return <GlobalLayout children={children} />
}