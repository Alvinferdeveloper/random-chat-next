import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mis Favoritos",
    description: "Accede a tus salas de chat favoritas en ChatHub. Comparte momentos con tu comunidad.",
    robots: {
        index: false,
        follow: true,
    },
};

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
