import { Metadata } from "next";
import { APP_NAME } from "@/src/app/constants";

export const metadata: Metadata = {
    title: "Crear Cuenta",
    description: `Crea tu cuenta en ${APP_NAME} y únete a nuestra comunidad de salas de chat temáticas.`,
    robots: {
        index: false,
        follow: true,
    },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}