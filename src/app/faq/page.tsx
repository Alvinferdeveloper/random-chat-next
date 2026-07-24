import { Metadata } from "next";
import { JsonLd } from "@/src/components/seo/JsonLd";
import { APP_NAME } from "@/src/app/constants";

export const metadata: Metadata = {
    title: `Preguntas Frecuentes`,
    description: `Encuentra respuestas a las dudas más comunes sobre ${APP_NAME}.`,
};

export default function FAQPage() {
    const faqs = [
        {
            q: `¿Es ${APP_NAME} gratuito?`,
            a: "Sí, puedes unirte a cualquier sala pública y chatear de forma totalmente gratuita."
        },
        {
            q: "¿Cómo puedo crear mi propia sala?",
            a: "Actualmente, la creación de salas está limitada a moderadores, pero pronto habilitaremos la función para usuarios verificados."
        },
        {
            q: "¿Cómo reporto a un usuario?",
            a: "Dentro de la sala de chat, puedes hacer clic en el nombre del usuario y seleccionar 'Reportar' para que nuestro equipo de moderación lo revise."
        }
    ];

    return (
        <div className="container mx-auto px-4 py-16 max-w-3xl">
            <JsonLd data={{
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqs.map(faq => ({
                    '@type': 'Question',
                    name: faq.q,
                    acceptedAnswer: { '@type': 'Answer', text: faq.a },
                })),
            }} />
            <h1 className="text-4xl font-extrabold mb-12 text-center">Preguntas Frecuentes</h1>
            <div className="space-y-8">
                {faqs.map((faq, i) => (
                    <div key={i} className="border-b pb-6">
                        <h3 className="text-xl font-bold mb-3">{faq.q}</h3>
                        <p className="text-muted-foreground">{faq.a}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
