import Image from "next/image";

const featureList = [
    {
        illustration: "/illustrations/themes.jpg",
        title: "Salas Temáticas",
        description: "Sumérgete en conversaciones sobre temas que te apasionan. Desde tecnología hasta arte, hay una sala para ti.",
    },
    {
        illustration: "/illustrations/connection.jpg",
        title: "Conexiones Globales",
        description: "Chatea con personas de todo el mundo. Amplía tus horizontes y conoce nuevas perspectivas.",
    },
    {
        illustration: "/illustrations/security.jpg",
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
                        <div key={index} className="mx-auto text-center transition-shadow w-11/12 duration-300 bg-gray-50 rounded-xl h-[500px] dark:bg-gray-800 hover:shadow-lg">
                            <div className="flex items-center justify-center w-full h-1/2">
                                <Image className="rounded-2xl w-full h-full object-covers" src={feature.illustration} alt={feature.title} width={300} height={300} />
                            </div>
                            <div className="p-8">
                                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}