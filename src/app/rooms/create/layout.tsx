import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Crear Sala",
    description: "Crea tu propia sala de chat temática. Configura el espacio perfecto para reunir a personas con tus mismos intereses.",
    robots: {
        index: true,
        follow: true,
    },
};

export default function CreateRoomLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
