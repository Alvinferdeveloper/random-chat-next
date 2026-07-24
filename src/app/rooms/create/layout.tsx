import { Metadata } from "next";
import { APP_NAME } from "@/src/app/constants";

export const metadata: Metadata = {
    title: "Crear Sala",
    description: `Crea tu propia sala de chat temática en ${APP_NAME}. Reúne a personas que comparten tus intereses.`,
    robots: {
        index: true,
        follow: true,
    },
};

export default function CreateRoomLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
