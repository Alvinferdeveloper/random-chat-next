import { Button } from "@/components/ui/button"
import Link from "next/link"
import Check from '@/app/components/icons/check'

export default function CtaSection() {
    return (
        <section id="acerca-de" className="py-12 md:py-20">
            <div className="container px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                    <div className="flex flex-col justify-center space-y-4">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Sobre ChatHub</h2>
                            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                Nuestra misión es crear espacios digitales donde las personas puedan conectar a través de intereses
                                comunes, fomentando conversaciones enriquecedoras y creando comunidad.
                            </p>
                        </div>
                        <div>
                            <Button asChild>
                                <Link href="#temas">Explorar salas</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center space-y-4">
                        <ul className="grid gap-4">
                            <li className="flex items-start gap-4">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <Check />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold">Comunidad activa</h3>
                                    <p className="text-muted-foreground">
                                        Miles de usuarios conectados diariamente en nuestras diferentes salas temáticas.
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <Check />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold">Experiencia personalizada</h3>
                                    <p className="text-muted-foreground">
                                        Elige los temas que te interesan y personaliza tu experiencia de chat.
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <Check />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold">Accesible en cualquier dispositivo</h3>
                                    <p className="text-muted-foreground">
                                        Diseño responsive que se adapta a móviles, tablets y ordenadores.
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}