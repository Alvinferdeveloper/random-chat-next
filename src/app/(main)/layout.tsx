import GlobalLayout from "@/src/app/components/layout/GlobalLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Inicio",
    description: "Explora nuestras salas de chat, conéctate con otros y disfruta de una comunidad vibrante.",
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return <GlobalLayout children={children} />
}