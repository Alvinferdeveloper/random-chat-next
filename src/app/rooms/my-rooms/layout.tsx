import { Metadata } from "next";
import { APP_NAME } from "@/src/app/constants";

export const metadata: Metadata = {
    title: "Mis Salas",
    description: `Gestiona las salas de chat que has creado en ${APP_NAME}. Administra tu comunidad.`,
    robots: {
        index: false,
        follow: true,
    },
};

export default function MyRoomsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
