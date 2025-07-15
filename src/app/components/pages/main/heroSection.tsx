"use client"

import { Button } from "@shadcn/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

const messages = [
    {
        text: "¡Hola! ¿Alguien vio el partido de anoche?",
        isUser: false,
    },
    {
        text: "¡Sí! Fue increíble ese gol en el último minuto.",
        isUser: true,
    },
    {
        text: "¿Alguien tiene una buena receta de pasta?",
        isUser: false,
    },
    {
        text: "Yo tengo una de lasaña vegetariana que queda deliciosa.",
        isUser: true,
    },
]

export default function HeroSection() {
    const [visibleMessages, setVisibleMessages] = useState<typeof messages>([])

    useEffect(() => {
        const timeouts: ReturnType<typeof setTimeout>[] = []
        let delay = 500 // Initial delay for the first message

        messages.forEach((message) => {
            const timeout = setTimeout(() => {
                setVisibleMessages((prev) => [...prev, message])
            }, delay)
            timeouts.push(timeout)
            delay += 2000 // Subsequent messages have a 2s delay
        })

        return () => {
            timeouts.forEach(clearTimeout)
        }
    }, [])

    return (
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
                            <Button size="lg" className="gap-2" asChild>
                                <Link href="/rooms">
                                    Comenzar ahora
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
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
                                    {visibleMessages.map((message, index) => (
                                        !message.isUser && (
                                            <div key={index} className="p-4 bg-background border rounded-lg shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                <p className="text-sm">{message.text}</p>
                                            </div>
                                        )
                                    ))}
                                </div>
                                <div className="space-y-4 mt-8">
                                    {visibleMessages.map((message, index) => (
                                        message.isUser && (
                                            <div key={index} className="p-4 bg-primary text-primary-foreground rounded-lg shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                <p className="text-sm">{message.text}</p>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}