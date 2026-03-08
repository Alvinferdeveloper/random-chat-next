import Image from "next/image";

const featureList = [
    {
        illustration: "/illustrations/themes.png", // Si usaste los SVG de código, recuerda cambiar .jpg por .svg
        title: "Salas Temáticas Infinitas",
        description: "Sumérgete en conversaciones sobre temas que te apasionan. Desde tecnología punta hasta arte clásico, nuestro algoritmo te sugiere la sala perfecta para ti.",
        tag: "Explorar"
    },
    {
        illustration: "/illustrations/connection.svg",
        title: "Conexiones Globales",
        description: "Chatea con personas de todo el mundo, descubre nuevas culturas y amplía tus horizontes diarios sin tener que salir de casa.",
        tag: "Comunidad"
    },
    {
        illustration: "/illustrations/security.png",
        title: "Entorno 100% Seguro",
        description: "Disfruta de una moderación proactiva y un espacio respetuoso diseñado para que puedas expresarte libremente con total privacidad.",
        tag: "Privacidad"
    },
];

export default function FeaturesSection() {
    return (
        <section id="como-funciona" className="py-20 md:py-32 bg-secondary-background dark:bg-gray-950 overflow-hidden">
            <div className="container px-4 mx-auto md:px-6">

                {/* 1. ENCABEZADO: Título Vivo y Moderno */}
                <div className="flex flex-col items-center max-w-4xl mx-auto text-center mb-20 md:mb-32">
                    <span className="flex items-center px-5 py-2 mb-8 text-sm font-bold tracking-wide text-emerald-950 uppercase bg-[#D6F045] rounded-full shadow-sm cursor-default">
                        ✨ Tu Nuevo Espacio Favorito
                    </span>

                    <h2 className="text-5xl font-black tracking-tighter text-gray-900 md:text-6xl lg:text-7xl dark:text-white leading-[1.1]">
                        Descubre. Conecta.<br className="hidden sm:block" />
                        <span className="relative inline-block mt-2 sm:mt-4">
                            <span className="relative z-10 text-emerald-900 dark:text-emerald-400">Comparte.</span>
                            {/* Efecto de marcador pintado por detrás */}
                            <span className="absolute bottom-1 md:bottom-2 left-0 w-full h-4 md:h-6 bg-[#D6F045] -z-10 rounded-sm transform -rotate-1 opacity-90"></span>
                        </span>
                    </h2>

                    <p className="mt-8 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Dile adiós a los chats aburridos. Encuentra tu tribu, únete a salas vibrantes y disfruta de un espacio <span className="font-semibold text-emerald-700 dark:text-emerald-400">100% seguro y moderado</span> diseñado para ti.
                    </p>
                </div>

                {/* 2. DISEÑO ZIG-ZAG (Storytelling) */}
                <div className="flex flex-col gap-24 md:gap-40 max-w-7xl mx-auto">
                    {featureList.map((feature, index) => (
                        <div
                            key={index}
                            // Aquí ocurre la magia del Zig-Zag: si es par va normal, si es impar se invierte el orden en desktop
                            className={`flex flex-col gap-12 lg:gap-20 items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                }`}
                        >
                            {/* LADO DE LA IMAGEN */}
                            <div className="w-full md:w-1/2 relative group">
                                {/* Sombra de resplandor (Glow) desenfocada detrás de la imagen */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#D6F045] to-emerald-400 rounded-[3rem] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 z-0"></div>

                                {/* Contenedor de la imagen (Z-10 para estar sobre el brillo) */}
                                <div className="relative z-10 aspect-square md:aspect-[4/3] w-full rounded-[3rem] overflow-hidden shadow-2xl border border-white/60 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                                    <Image
                                        src={feature.illustration}
                                        alt={feature.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>
                            </div>

                            {/* LADO DEL TEXTO */}
                            <div className="w-full md:w-1/2 flex flex-col justify-center px-4 sm:px-8">
                                <div className="flex items-center gap-4 mb-6">
                                    {/* Número indicador redondo */}
                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1B3C35] text-[#D6F045] font-bold text-xl shadow-lg shadow-emerald-900/20">
                                        {index + 1}
                                    </div>
                                    {/* Etiqueta / Tag */}
                                    <span className="text-sm font-bold tracking-widest text-emerald-700 dark:text-emerald-400 uppercase">
                                        {feature.tag}
                                    </span>
                                </div>

                                <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                                    {feature.title}
                                </h3>

                                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-10">
                                    {feature.description}
                                </p>

                                {/* Enlace de "Saber más" */}
                                <a href="#" className="inline-flex items-center text-lg font-bold text-[#1B3C35] dark:text-[#D6F045] hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors w-fit group/link">
                                    Conocer más detalles
                                    <svg className="w-6 h-6 ml-2 transform transition-transform group-hover/link:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}