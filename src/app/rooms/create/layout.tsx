import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create Room",
    description: "Create your own themed chat room. Set up the perfect space to gather people who share your interests.",
    robots: {
        index: true,
        follow: true,
    },
};

export default function CreateRoomLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
