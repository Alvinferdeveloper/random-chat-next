import { Metadata } from "next";
import { APP_NAME } from "@/src/app/constants";

export const metadata: Metadata = {
    title: "Mis Tribus",
    description: `Gestiona las tribus que has creado en ${APP_NAME}. Administra tu comunidad.`,
    robots: {
        index: false,
        follow: true,
    },
};

export default function MyRoomsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
