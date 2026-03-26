import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Registrarse",
    description: "Crea tu cuenta en ChatHub y únete a nuestra comunidad de salas de chat temáticas.",
    robots: {
        index: false,
        follow: true,
    },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}