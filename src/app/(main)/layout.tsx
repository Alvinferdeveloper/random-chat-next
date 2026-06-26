import GlobalLayout from "@/src/app/components/layout/GlobalLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Home",
    description: "Explore our chat rooms, connect with others, and enjoy a vibrant community.",
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return <GlobalLayout children={children} />
}