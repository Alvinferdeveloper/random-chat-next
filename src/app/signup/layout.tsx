import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Crear Cuenta",
    description: "Regístrate en ChatHub para empezar a conectar con personas de todo el mundo.",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}