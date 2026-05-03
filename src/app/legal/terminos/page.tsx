import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Términos de Servicio | ChatHub",
    description: "Lee los términos y condiciones de uso de la plataforma ChatHub.",
};

export default function TermsPage() {
    return (
        <section>
            <h1 className="text-4xl font-extrabold mb-8">Términos de Servicio</h1>
            <p className="text-lg text-muted-foreground mb-6">
                Al usar ChatHub, aceptas cumplir con los siguientes términos y condiciones. Por favor, léelos atentamente.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">1. Uso del Servicio</h2>
            <p className="mb-4">
                ChatHub es una plataforma para la comunicación entre personas. Te comprometes a no usar el servicio para fines ilegales o que violen nuestras normas de la comunidad.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. Contenido del Usuario</h2>
            <p className="mb-4">
                Eres el único responsable del contenido (mensajes, imágenes, links) que publiques. No toleramos el acoso, el spam o el contenido explícito no consentido.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. Terminación de Cuenta</h2>
            <p className="mb-4">
                Nos reservamos el derecho de suspender o eliminar cuentas que violen repetidamente nuestros términos o por comportamiento abusivo reportado por la comunidad.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. Limitación de Responsabilidad</h2>
            <p className="mb-4">
                ChatHub se proporciona "tal cual". No nos hacemos responsables de las interacciones externas entre usuarios ni de la pérdida de datos fuera de nuestro control técnico.
            </p>

            <div className="mt-12 p-6 bg-muted rounded-lg">
                <p className="text-sm italic">
                    Última actualización: 2 de mayo de 2026. El uso continuado de la app implica la aceptación de estos términos.
                </p>
            </div>
        </section>
    );
}
