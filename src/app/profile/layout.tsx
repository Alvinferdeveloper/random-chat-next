import GlobalLayout from "@/src/app/components/layout/GlobalLayout"
import { Metadata } from "next";
import { APP_NAME } from "@/src/app/constants";

export const metadata: Metadata = {
    title: "Mi Perfil",
    description: `Administra tu perfil de usuario en ${APP_NAME}. Actualiza tu información y preferencias.`,
    robots: {
        index: false,
        follow: true,
    },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return <GlobalLayout children={children} />
}