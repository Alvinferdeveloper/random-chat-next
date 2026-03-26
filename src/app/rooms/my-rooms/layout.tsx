import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mis Salas",
    description: "Gestiona las salas de chat que has creado en ChatHub. Administra tu comunidad.",
    robots: {
        index: false,
        follow: true,
    },
};

export default function MyRoomsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
