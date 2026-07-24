import GlobalLayout from "@/src/app/components/layout/GlobalLayout"
import { Metadata } from "next";
import { APP_NAME } from "@/src/app/constants";

export const metadata: Metadata = {
    title: "Salas de Chat",
    description: `Explora y únete a salas de chat temáticas. Comparte momentos y conoce gente nueva con intereses similares en ${APP_NAME}.`,
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: `Salas de Chat - ${APP_NAME}`,
        description: `Explora y únete a salas de chat temáticas. Comparte momentos y conoce gente nueva.`,
    },
};

export default function RoomsLayout({ children }: { children: React.ReactNode }) {
    return <GlobalLayout children={children} />
}