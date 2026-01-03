"use client"

import { Button } from "@/src/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

const mockUsers = [
    { id: "user1", name: "Ana", image: "https://api.dicebear.com/8.x/adventurer/svg?seed=Ana" },
    { id: "user2", name: "Luis", image: "https://api.dicebear.com/8.x/adventurer/svg?seed=Luis" },
    { id: "user3", name: "Marta", image: "https://api.dicebear.com/8.x/adventurer/svg?seed=Marta" },
    { id: "user4", name: "Pedro", image: "https://api.dicebear.com/8.x/adventurer/svg?seed=Pedro" },
    { id: "user5", name: "Juan", image: "https://api.dicebear.com/8.x/adventurer/svg?seed=Juan" },
    { id: "user6", name: "Maria", image: "https://api.dicebear.com/8.x/adventurer/svg?seed=Maria" },
];

const messages = [
    {
        text: "¡Hola! ¿Alguien vio el partido de anoche?",
        isUser: false,
        senderId: "user1",
    },
    {
        text: "¡Sí! Fue increíble ese gol en el último minuto.",
        isUser: true,
        senderId: "user2",
    },
    {
        text: "¿Alguien tiene una buena receta de pasta?",
        isUser: false,
        senderId: "user3",
    },
    {
        text: "Yo tengo una de lasaña vegetariana que queda deliciosa.",
        isUser: true,
        senderId: "user4",
    },
    {
        text: "¿Como les parecio la pelicula de avatar?",
        isUser: false,
        senderId: "user5",
    },
    {
        text: "Me encanto, la historia es increible.",
        isUser: true,
        senderId: "user6",
    }
];

export default function HeroSection() {
    const [visibleMessages, setVisibleMessages] = useState<typeof messages>([]);

    useEffect(() => {
        let timeouts: ReturnType<typeof setTimeout>[] = [];

        const startChatAnimation = () => {
            setVisibleMessages([]);

            let currentDelay = 100;

            messages.forEach((message, index) => {
                const timeout = setTimeout(() => {
                    setVisibleMessages((prev) => [...prev, message]);

                    if (index === messages.length - 1) {
                        const resetTimeout = setTimeout(() => {
                            startChatAnimation();
                        }, 3000);
                        timeouts.push(resetTimeout);
                    }
                }, currentDelay);

                timeouts.push(timeout);
                currentDelay += 1500;
            });
        };

        startChatAnimation();

        return () => {
            timeouts.forEach(clearTimeout);
        };
    }, []);

    const getUserData = (senderId: string) => mockUsers.find(user => user.id === senderId);

    return (
        <section className="py-12 md:py-20 bg-gradient-to-b from-background to-muted/30">
            <div className="container px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
                    <div className="flex flex-col justify-center space-y-4">
                        <div className="space-y-4">
                            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-medium text-primary">
                                🎉 Nueva Comunidad
                            </div>

                            <h1 className="text-balance mb-5 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                                Conecta con personas que comparten <span className="text-primary underline decoration-primary/30 decoration-wavy underline-offset-8">tus intereses</span>
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
                                    {visibleMessages.map((message, index) => {
                                        if (message.isUser) return null;
                                        const sender = getUserData(message.senderId);
                                        return (
                                            <div key={index} className="flex items-start gap-3 p-3 bg-background border rounded-lg shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={sender?.image} alt={sender?.name} />
                                                    <AvatarFallback>{sender?.name?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold">{sender?.name}</p>
                                                    <p className="text-sm">{message.text}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="space-y-4 mt-8">
                                    {visibleMessages.map((message, index) => {
                                        if (!message.isUser) return null;
                                        const sender = getUserData(message.senderId);
                                        return (
                                            <div key={index} className="flex items-start flex-row-reverse gap-3 p-3 bg-primary text-primary-foreground rounded-lg shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={sender?.image} alt={sender?.name} />
                                                    <AvatarFallback>{sender?.name?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 text-right">
                                                    <p className="text-sm font-semibold">{sender?.name}</p>
                                                    <p className="text-sm">{message.text}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}