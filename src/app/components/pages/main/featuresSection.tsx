import { MessageSquare, Users, Shield } from "lucide-react"

export default function FeaturesSection() {
    return (
        <section id="como-funciona" className="py-12 md:py-20 bg-muted/50">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Cómo funciona</h2>
                        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Conectar con personas afines nunca fue tan sencillo.
                        </p>
                    </div>
                </div>
                <div className="grid gap-6 mt-8 md:grid-cols-3">
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <div className="p-4 bg-primary/10 rounded-full">
                            <MessageSquare className="w-6 h-6 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">Elige un tema</h3>
                            <p className="text-muted-foreground">
                                Selecciona entre nuestras salas temáticas la que más te interese.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <div className="p-4 bg-primary/10 rounded-full">
                            <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">Únete a la conversación</h3>
                            <p className="text-muted-foreground">
                                Participa en tiempo real con otros usuarios que comparten tus intereses.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <div className="p-4 bg-primary/10 rounded-full">
                            <Shield className="w-6 h-6 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">Ambiente seguro</h3>
                            <p className="text-muted-foreground">Disfruta de conversaciones en un entorno moderado y respetuoso.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}