import GlobalLayout from "@/src/app/components/layout/GlobalLayout"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mi Perfil",
    description: "Gestiona tu perfil de usuario en ChatHub. Actualiza tu información y preferencias.",
    robots: {
        index: false,
        follow: true,
    },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return <GlobalLayout children={children} />
}