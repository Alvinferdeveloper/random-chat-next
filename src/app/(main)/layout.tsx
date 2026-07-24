import GlobalLayout from "@/src/app/components/layout/GlobalLayout";
import { Metadata } from "next";
import { APP_NAME } from "@/src/app/constants";

export const metadata: Metadata = {
    title: "Inicio",
    description: `Explora salas de chat, conecta con personas y disfruta de una comunidad activa en ${APP_NAME}.`,
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return <GlobalLayout children={children} />
}