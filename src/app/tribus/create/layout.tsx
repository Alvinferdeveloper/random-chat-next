import { Metadata } from "next";
import { APP_NAME } from "@/src/app/constants";

export const metadata: Metadata = {
    title: "Crear Tribu",
    description: `Crea tu propia tribu temática en ${APP_NAME}. Reúne a personas que comparten tus intereses.`,
    robots: {
        index: true,
        follow: true,
    },
};

export default function CreateRoomLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
