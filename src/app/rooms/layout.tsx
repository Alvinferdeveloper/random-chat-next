import GlobalLayout from "@/src/app/components/layout/GlobalLayout"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Salas de Chat",
    description: "Explora y únete a salas de chat temáticas. Comparte momentos y conoce gente nueva con intereses similares.",
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: "Salas de Chat - ChatHub",
        description: "Explora y únete a salas de chat temáticas. Comparte momentos y conoce gente nueva.",
    },
};

export default function RoomsLayout({ children }: { children: React.ReactNode }) {
    return <GlobalLayout children={children} />
}