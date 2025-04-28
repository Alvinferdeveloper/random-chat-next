import { Button } from "@/components/ui/button"
import { ArrowRight, MessageSquare, Users, Shield } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Conecta con personas que comparten tus intereses
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Únete a nuestras salas de chat temáticas y participa en conversaciones sobre tus temas favoritos.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="gap-2">
                  Comenzar ahora
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Saber más
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full h-80 md:h-96 lg:h-full">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
                <div className="relative z-10 grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="p-4 bg-background border rounded-lg shadow-sm">
                      <p className="text-sm">¡Hola! ¿Alguien vio el partido de anoche?</p>
                    </div>
                    <div className="p-4 bg-primary text-primary-foreground rounded-lg shadow-sm">
                      <p className="text-sm">¡Sí! Fue increíble ese gol en el último minuto.</p>
                    </div>
                  </div>
                  <div className="space-y-4 mt-8">
                    <div className="p-4 bg-background border rounded-lg shadow-sm">
                      <p className="text-sm">¿Alguien tiene una buena receta de pasta?</p>
                    </div>
                    <div className="p-4 bg-primary text-primary-foreground rounded-lg shadow-sm">
                      <p className="text-sm">Yo tengo una de lasaña vegetariana que queda deliciosa.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* CTA Section */}
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 text-primary"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 text-primary"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 text-primary"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
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
    </main>
  )
}
