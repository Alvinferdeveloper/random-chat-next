'use client';

import { useMyRooms } from '@/src/app/rooms/my-rooms/hooks/useMyRooms';
import { RoomCard } from '@/src/app/rooms/components/RoomCard';
import { Trash2, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useRoomUserCounts } from '@/src/app/rooms/hooks/useRoomUserCounts';
import RoomCardFooter from '@/src/app/rooms/my-rooms/components/RoomCardFooter';

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.05,
            duration: 0.3,
            ease: "easeOut"
        }
    })
};

export default function MyRoomsPage() {
    const { rooms, loading, error, deleteRoom } = useMyRooms();
    const router = useRouter();
    const [connecting, setConnecting] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const { userCounts } = useRoomUserCounts();

    const handleDelete = async (e: React.MouseEvent, roomId: string) => {
        e.stopPropagation();
        if (confirm('¿Estás seguro de que quieres eliminar esta sala?')) {
            setDeletingId(roomId);
            await deleteRoom(roomId);
            setDeletingId(null);
        }
    };


    const handleJoinRoom = (roomId: string) => {
        setConnecting(roomId);
        router.push(`/chat/${roomId}`);
    };

    if (loading && rooms.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Cargando tus salas...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <Link href="/rooms" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2">
                            <ArrowLeft className="h-4 w-4" />
                            Explorar todas las salas
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Mis Salas</h1>
                        <p className="text-muted-foreground">Gestiona las salas que has creado.</p>
                    </div>
                    <Link href="/rooms/create">
                        <button className="bg-primary cursor-pointer hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-medium transition-colors">
                            Crear nueva sala
                        </button>
                    </Link>
                </div>

                {error && (
                    <div className="bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded-md">
                        {error}
                    </div>
                )}

                {rooms.length === 0 && !loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-muted/20 rounded-xl border border-dashed border-border">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                            <Trash2 className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold text-white">No tienes salas aún</h2>
                            <p className="text-muted-foreground max-w-sm">
                                ¡Parece que no has creado ninguna sala de chat todavía! Empieza creando una para tu comunidad.
                            </p>
                        </div>
                        <Link href="/rooms/create">
                            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-md font-medium transition-colors">
                                Crear mi primera sala
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {rooms.map((room, index) => (
                            <RoomCard
                                key={room.id}
                                room={room}
                                index={index}
                                userCount={userCounts[room.id] || 0}
                                isConnecting={connecting === room.id}
                                onJoin={handleJoinRoom}
                                cardVariants={cardVariants}
                                footer={
                                    <RoomCardFooter room={room} deletingId={deletingId} handleDelete={handleDelete} />
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
