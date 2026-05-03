import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Política de Cookies | ChatHub",
    description: "Información sobre cómo utilizamos las cookies para mejorar tu experiencia.",
};

export default function CookiesPage() {
    return (
        <section>
            <h1 className="text-4xl font-extrabold mb-8">Política de Cookies</h1>
            <p className="text-lg text-muted-foreground mb-6">
                Utilizamos cookies para que ChatHub funcione correctamente y para entender cómo usas nuestra plataforma.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">¿Qué es una cookie?</h2>
            <p className="mb-4">
                Una cookie es un pequeño archivo de texto que se guarda en tu navegador. Nos permite recordar tu sesión y tus preferencias (como el tema oscuro/claro).
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Tipos de cookies que usamos</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
                <li><strong>Esenciales:</strong> Necesarias para el inicio de sesión y la seguridad.</li>
                <li><strong>Preferencias:</strong> Guardan tu idioma y configuración de interfaz.</li>
                <li><strong>Analíticas:</strong> Nos ayudan a saber qué salas de chat son las más populares para mejorar el servicio.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Control de cookies</h2>
            <p className="mb-4">
                Puedes desactivar las cookies en cualquier momento desde la configuración de tu navegador, pero ten en cuenta que algunas funciones de ChatHub podrían dejar de funcionar.
            </p>

            <div className="mt-12 p-6 bg-muted rounded-lg">
                <p className="text-sm italic">
                    Última actualización: 2 de mayo de 2026.
                </p>
            </div>
        </section>
    );
}
