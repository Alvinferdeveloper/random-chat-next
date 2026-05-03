import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Preguntas Frecuentes | ChatHub",
    description: "Encuentra respuestas a las dudas más comunes sobre ChatHub.",
};

export default function FAQPage() {
    const faqs = [
        {
            q: "¿Es ChatHub gratuito?",
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
