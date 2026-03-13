import GlobalLayout from "@/src/app/components/layout/GlobalLayout"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mi Perfil",
    description: "Gestiona tu cuenta, personaliza tu perfil y revisa tus salas favoritas.",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return <GlobalLayout children={children} />
}