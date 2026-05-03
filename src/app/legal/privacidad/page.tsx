import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Política de Privacidad | ChatHub",
    description: "Conoce cómo manejamos tus datos y protegemos tu privacidad en ChatHub.",
};

export default function PrivacyPage() {
    return (
        <section>
            <h1 className="text-4xl font-extrabold mb-8">Política de Privacidad</h1>
            <p className="text-lg text-muted-foreground mb-6">
                En ChatHub, la privacidad de nuestros usuarios es nuestra prioridad. Esta política describe cómo recopilamos, usamos y protegemos tu información.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">1. Información que recopilamos</h2>
            <p className="mb-4">
                Recopilamos información básica para el funcionamiento del servicio, como tu nombre de usuario, correo electrónico y los mensajes que envías en las salas de chat.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. Uso de la información</h2>
            <p className="mb-4">
                Utilizamos tus datos para:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Proporcionar y mantener el servicio de chat.</li>
                <li>Notificarte sobre cambios en nuestra plataforma.</li>
                <li>Permitirte participar en funciones interactivas.</li>
                <li>Brindar soporte al cliente.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. Seguridad de los datos</h2>
            <p className="mb-4">
                Implementamos medidas de seguridad para proteger tu información personal contra acceso no autorizado, alteración o divulgación. Sin embargo, recuerda que ningún método de transmisión por Internet es 100% seguro.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. Tus derechos</h2>
            <p className="mb-4">
                Tienes derecho a acceder, rectificar o eliminar tus datos personales en cualquier momento desde la configuración de tu perfil.
            </p>

            <div className="mt-12 p-6 bg-muted rounded-lg">
                <p className="text-sm italic">
                    Última actualización: 2 de mayo de 2026. Si tienes dudas, contáctanos en privacidad@chathub.com
                </p>
            </div>
        </section>
    );
}
