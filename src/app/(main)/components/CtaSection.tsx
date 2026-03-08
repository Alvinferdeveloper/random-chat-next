import { Button } from "@/src/components/ui/button"
import Link from "next/link"
import Check from '@/src/app/components/icons/Check'
import Image from "next/image"

export default function AboutAndCtaSection() {
    return (
        <section id="acerca-de" className="py-20 md:py-32">
            <div className="container px-4 mx-auto md:px-6">

                {/* Parte 1: Acerca de y Lista de Beneficios */}
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center mb-24">
                    <div className="flex flex-col space-y-8">
                        <div className="space-y-6">
                            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
                                Construyendo la mejor <br /> <span className="text-emerald-700">comunidad digital</span>
                            </h2>
                            <p className="max-w-[600px] text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                                Nuestra misión es crear espacios digitales donde las personas puedan conectar a través de intereses
                                comunes, fomentando conversaciones enriquecedoras y creando una verdadera comunidad.
                            </p>
                        </div>
                        <div>
                            <Button asChild size="lg" className="rounded-full px-8 text-base bg-emerald-800 hover:bg-emerald-900 text-white">
                                <Link href="#temas">Explorar las salas ahora</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Lista estilizada como la imagen 3 pero adaptada a tus datos */}
                    <div className="bg-[#F4F5F0] dark:bg-gray-900 p-8 md:p-10 rounded-[2.5rem]">
                        <ul className="grid gap-8">
                            <li className="flex items-start gap-5 group">
                                <div className="flex items-center justify-center w-16 h-14 cursor-pointer  p-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition">
                                    <Image src="/images/comunidad.png" alt="" width={50} height={50} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Comunidad activa</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Miles de usuarios conectados diariamente en nuestras diferentes salas temáticas.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-5 group">
                                <div className="flex items-center justify-center w-16 h-14 cursor-pointer  p-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition">
                                    <Image src="/images/custom_experience.png" alt="" width={50} height={50} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Experiencia personalizada</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Elige los temas que te interesan y personaliza tu experiencia de chat a tu gusto.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-5 group">
                                <div className="flex items-center justify-center w-16 h-14 cursor-pointer  p-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition">
                                    <Image src="/images/responsive.png" alt="" width={50} height={50} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Accesible en todo lugar</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Diseño responsive impecable que se adapta a móviles, tablets y ordenadores de escritorio.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Parte 2: Estadísticas (Inspirado en Imagen 3) */}
                <div className="bg-[#F8F9FA] dark:bg-gray-900 rounded-[2.5rem] p-10 md:p-16 mb-8 text-center border border-gray-100 dark:border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-800">
                        <div className="flex flex-col items-center pt-8 md:pt-0">
                            <h4 className="text-5xl md:text-6xl font-black text-emerald-800 dark:text-emerald-400 mb-2">2023</h4>
                            <p className="text-gray-500 font-medium">ChatHub Fundado</p>
                        </div>
                        <div className="flex flex-col items-center pt-8 md:pt-0">
                            <h4 className="text-5xl md:text-6xl font-black text-emerald-800 dark:text-emerald-400 mb-2">50K+</h4>
                            <p className="text-gray-500 font-medium">Usuarios Activos</p>
                        </div>
                        <div className="flex flex-col items-center pt-8 md:pt-0">
                            <h4 className="text-5xl md:text-6xl font-black text-emerald-800 dark:text-emerald-400 mb-2">1k+</h4>
                            <p className="text-gray-500 font-medium">Salas Creadas</p>
                        </div>
                    </div>
                </div>

                {/* Parte 3: El Gran Banner CTA Oscuro (Inspirado en la parte inferior de Imagen 3) */}
                <div className="bg-[#1B3C35] rounded-[2rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
                    <h2 className="text-3xl md:text-5xl font-bold text-white max-w-xl leading-tight">
                        Descubre todo el potencial de <span className="underline decoration-[#D6F045] underline-offset-8">ChatHub</span>
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                        <Button asChild variant="outline" className="rounded-full px-8 py-6 text-base font-semibold bg-white text-gray-900 border-none hover:bg-gray-100">
                            <Link href="#demo">Ver Demo</Link>
                        </Button>
                        <Button asChild className="rounded-full px-8 py-6 text-base font-semibold bg-[#D6F045] text-gray-900 hover:bg-[#c2db3b] shadow-none">
                            <Link href="#registro">Comenzar Gratis</Link>
                        </Button>
                    </div>
                </div>

            </div>
        </section>
    )
}