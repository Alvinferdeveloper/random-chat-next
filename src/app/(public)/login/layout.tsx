import { Metadata } from "next";
import { APP_NAME } from "@/src/app/constants";

export const metadata: Metadata = {
    title: "Iniciar Sesión",
    description: `Inicia sesión en ${APP_NAME} para unirte a salas de chat, conectar con personas y compartir momentos.`,
    robots: {
        index: false,
        follow: true,
    },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}