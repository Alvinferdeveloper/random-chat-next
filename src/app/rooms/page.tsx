"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@shadcn/card"
import { Button } from "@shadcn/button"
import { Users } from "lucide-react"
import { MessageSquare } from "lucide-react"
import { ArrowRight } from "lucide-react"
import { ConnectingAnimation } from "@/components/animations/ConnectionAnimation"

const categories = [
    {
      id: "deportes",
      title: "Deportes",
      description: "Discute sobre fútbol, baloncesto, tenis y más",
      activeUsers: 28,
      icon: "⚽",
      color: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-950/50",
      borderColor: "border-blue-200 dark:border-blue-800",
      iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
    },
    {
      id: "cocina",
      title: "Cocina",
      description: "Comparte recetas y trucos culinarios",
      activeUsers: 15,
      icon: "🍳",
      color: "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-950/50",
      borderColor: "border-red-200 dark:border-red-800",
      iconBg: "bg-red-500/10 dark:bg-red-500/20",
    },
    {
      id: "danza",
      title: "Danza",
      description: "Habla sobre baile, coreografías y eventos",
      activeUsers: 12,
      icon: "💃",
      color: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-950/50",
      borderColor: "border-purple-200 dark:border-purple-800",
      iconBg: "bg-purple-500/10 dark:bg-purple-500/20",
    },
    {
      id: "musica",
      title: "Música",
      description: "Discute sobre artistas, géneros y conciertos",
      activeUsers: 32,
      icon: "🎵",
      color: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-950/50",
      borderColor: "border-green-200 dark:border-green-800",
      iconBg: "bg-green-500/10 dark:bg-green-500/20",
    },
    {
      id: "cine",
      title: "Cine",
      description: "Comenta sobre películas, series y actores",
      activeUsers: 24,
      icon: "🎬",
      color: "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-950/50",
      borderColor: "border-yellow-200 dark:border-yellow-800",
      iconBg: "bg-yellow-500/10 dark:bg-yellow-500/20",
    },
    {
      id: "viajes",
      title: "Viajes",
      description: "Comparte experiencias y consejos de viaje",
      activeUsers: 19,
      icon: "✈️",
      color: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-950/50",
      borderColor: "border-orange-200 dark:border-orange-800",
      iconBg: "bg-orange-500/10 dark:bg-orange-500/20",
    },
  ]

export default function Rooms() {
    const router = useRouter()
    const [connecting, setConnecting] = useState<string | null>(null)
    const [hovered, setHovered] = useState<string | null>(null)

    const handleJoinRoom = (categoryId: string) => {
        setConnecting(categoryId)

        // Simular tiempo de conexión
        setTimeout(() => {
            router.push(`/chat/${categoryId}`)
        }, 2000)
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
                <Card
                    key={category.id}
                    className={`overflow-hidden transition-all duration-300 border ${category.borderColor} hover:shadow-lg ${connecting === category.id ? "scale-[0.98] opacity-75" : ""
                        } ${hovered === category.id ? "scale-[1.02]" : ""}`}
                    onMouseEnter={() => setHovered(category.id)}
                    onMouseLeave={() => setHovered(null)}
                >
                    <CardHeader className={`${category.color} pb-6`}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold">{category.title}</h3>
                            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${category.iconBg}`}>
                                <span className="text-2xl">{category.icon}</span>
                            </div>
                        </div>
                        <p className="mt-2 text-foreground/80">{category.description}</p>
                    </CardHeader>

                    <CardContent className="pt-6">
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="w-4 h-4 mr-2" />
                            <span>{category.activeUsers} usuarios activos</span>
                        </div>
                    </CardContent>

                    <CardFooter>
                        {connecting === category.id ? (
                            <div className="w-full py-2">
                                <ConnectingAnimation text="Conectando a la sala..." />
                            </div>
                        ) : (
                            <Button
                                onClick={() => handleJoinRoom(category.id)}
                                className="w-full gap-2 transition-all duration-300"
                                size="lg"
                            >
                                <MessageSquare className="w-4 h-4" />
                                Unirse a la sala
                                <ArrowRight
                                    className={`w-4 h-4 ml-auto transition-transform duration-300 ${hovered === category.id ? "translate-x-1" : ""
                                        }`}
                                />
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}