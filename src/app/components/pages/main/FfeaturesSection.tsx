import Image from "next/image";

const featureList = [
    {
        illustration: "/illustrations/messaging.svg",
        title: "Salas Temáticas",
        description: "Sumérgete en conversaciones sobre temas que te apasionan. Desde tecnología hasta arte, hay una sala para ti.",
    },
    {
        illustration: "/illustrations/connected-world.svg",
        title: "Conexiones Globales",
        description: "Chatea con personas de todo el mundo. Amplía tus horizontes y conoce nuevas perspectivas.",
    },
    {
        illustration: "/illustrations/security.svg",
        title: "Entorno Seguro",
        description: "Priorizamos tu seguridad. Disfruta de un espacio moderado y respetuoso para expresarte libremente.",
    },
];

export default function FeaturesSection() {
    return (
        <section id="como-funciona" className="py-16 md:py-24 bg-white dark:bg-gray-900">
            <div className="container px-4 mx-auto md:px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        Descubre, Conecta, Comparte
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                        Nuestra plataforma está diseñada para que encuentres fácilmente conversaciones significativas y seguras.
                    </p>
                </div>
                <div className="grid gap-8 mt-12 md:grid-cols-3">
                    {featureList.map((feature, index) => (
                        <div key={index} className="p-8 text-center transition-shadow duration-300 bg-gray-50 rounded-xl dark:bg-gray-800 hover:shadow-lg">
                            <div className="flex items-center justify-center mb-6">
                                <Image src={feature.illustration} alt={feature.title} width={180} height={180} />
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}