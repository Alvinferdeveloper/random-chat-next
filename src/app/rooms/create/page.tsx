'use client';

import { useState } from 'react';
import { CreateRoomForm, RoomData } from './components/CreateRoomForm';
import { CustomizeRoom } from './components/CustomizeRoom';
import { ArrowLeft, Sparkles, LayoutTemplate } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/src/lib/utils';

export default function CreateRoomPage() {
    const [createdRoom, setCreatedRoom] = useState<RoomData | null>(null);

    const handleRoomCreated = (room: RoomData) => {
        setCreatedRoom(room);
    };

    // UI Helper: Steps of the process
    const steps = [
        { id: 1, name: 'Detalles', icon: LayoutTemplate, active: !createdRoom, completed: !!createdRoom },
        { id: 2, name: 'Personalización', icon: Sparkles, active: !!createdRoom, completed: false },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
                {/* Navigation header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <Link
                        href="/rooms"
                        className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                    >
                        <div className="p-2 rounded-full bg-secondary group-hover:bg-secondary/80 transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                        </div>
                        Volver a salas
                    </Link>

                    {/* Stepper / Steps indicator */}
                    <div className="flex items-center gap-2 bg-secondary/30 backdrop-blur-sm p-1.5 rounded-full border border-border/50">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
                                    step.active
                                        ? "bg-background shadow-sm text-foreground ring-1 ring-border"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <step.icon className={cn("h-4 w-4", step.active && "text-primary")} />
                                <span>{step.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2 text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                        {createdRoom ? (
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                Dale vida a tu Sala
                            </span>
                        ) : (
                            <span>Crea tu Comunidad</span>
                        )}
                    </h1>
                    <p className="text-muted-foreground max-w-lg mx-auto text-lg">
                        {createdRoom
                            ? 'Sube imágenes atractivas para destacar entre la multitud.'
                            : 'Configura el espacio perfecto para reunir a personas con tus mismos intereses.'}
                    </p>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    {!createdRoom ? (
                        <CreateRoomForm onRoomCreated={handleRoomCreated} />
                    ) : (
                        <CustomizeRoom room={createdRoom} />
                    )}
                </div>
            </div>
        </div>
    );
}