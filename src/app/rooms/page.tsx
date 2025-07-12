"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@shadcn/card"
import { Button } from "@shadcn/button"
import { Users } from "lucide-react"
import { MessageSquare } from "lucide-react"
import { ArrowRight } from "lucide-react"
import { ConnectingAnimation } from "@/components/animations/ConnectionAnimation"
import useRoom from "@/src/app/hooks/useRoom"
import { roomStyle } from "@/src/app/utils/roomStyle"
import { useSocket } from "@/components/providers/SocketProvider"

export default function Rooms() {
    const router = useRouter()
    const [connecting, setConnecting] = useState<string | null>(null)
    const [hovered, setHovered] = useState<string | null>(null)
    const { rooms } = useRoom();
    const socket = useSocket();

    const handleJoinRoom = async (roomId: string) => {
        setConnecting(roomId);
        const username = `user_${Math.floor(Math.random() * 10000)}`;
        socket.emit("joinRoom", roomId, username);
        router.push(`/chat/${roomId}`);

        socket.on("connect_error", (err) => {
            alert("No se pudo conectar al servidor de chat. Intenta más tarde.");
            setConnecting(null);
        });
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
            {rooms.map((room) => {
                const style = roomStyle(room.color || "DEFAULT")
                return (
                    <Card
                        key={room.id}
                        className={`overflow-hidden transition-all duration-300 border ${style.borderColor} hover:shadow-lg ${connecting === room.id ? "scale-[0.98] opacity-75" : ""
                            } ${hovered === room.id ? "scale-[1.02]" : ""}`}
                        onMouseEnter={() => setHovered(room.id)}
                        onMouseLeave={() => setHovered(null)}
                    >
                        <CardHeader className={`${style.color} pb-6`}>
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold">{room.name}</h3>
                                <div className={`flex items-center justify-center w-12 h-12 rounded-full`}>
                                    <span className="text-2xl">⚽</span>
                                </div>
                            </div>
                            <p className="mt-2 text-foreground/80">{room.short_description}</p>
                        </CardHeader>

                        <CardContent className="pt-6">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Users className="w-4 h-4 mr-2" />
                                <span>{25} usuarios activos</span>
                            </div>
                        </CardContent>

                        <CardFooter>
                            {connecting === room.id ? (
                                <div className="w-full py-2">
                                    <ConnectingAnimation text="Conectando a la sala..." />
                                </div>
                            ) : (
                                <Button
                                    onClick={() => handleJoinRoom(room.id)}
                                    className="w-full gap-2 transition-all duration-300"
                                    size="lg"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    Unirse a la sala
                                    <ArrowRight
                                        className={`w-4 h-4 ml-auto transition-transform duration-300 ${hovered === room.id ? "translate-x-1" : ""
                                            }`}
                                    />
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    )
}