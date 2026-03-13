import GlobalLayout from "@/src/app/components/layout/GlobalLayout"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Explorar Salas",
    description: "Encuentra y únete a diversas salas de chat sobre tus temas favoritos.",
};

export default function RoomsLayout({ children }: { children: React.ReactNode }) {
    return <GlobalLayout children={children} />
}