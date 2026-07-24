import { Metadata } from "next";
import { APP_NAME } from "@/src/app/constants";

export const metadata: Metadata = {
    title: "Mis Favoritos",
    description: `Accede a tus salas de chat favoritas en ${APP_NAME}. Comparte momentos con tu comunidad.`,
    robots: {
        index: false,
        follow: true,
    },
};

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
