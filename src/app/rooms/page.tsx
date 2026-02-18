'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useRoom from '@/src/app/rooms/hooks/useRoom';
import { AdditionalInfoModal } from '@/src/app/components/auth/AdditionalInfoModal';
import { useAuth } from '@/src/app/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { useInfiniteScroll } from '@/src/app/rooms/hooks/useInfiniteScroll';
import { Variants } from 'framer-motion';
import { RoomCard } from '@/src/app/rooms/components/RoomCard';

import { useRoomUserCounts } from '@/src/app/rooms/hooks/useRoomUserCounts';

const cardVariants: Variants = {
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

export default function Rooms() {
    const router = useRouter();
    const [connecting, setConnecting] = useState<string | null>(null);
    const { rooms, error, loading, hasMore, loadMoreRooms } = useRoom();
    const { sentinelRef } = useInfiniteScroll({ loading, hasMore, onLoadMore: loadMoreRooms });
    const { userCounts } = useRoomUserCounts();

    const { session, isPending } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (isPending) return;
        if (session?.user) {
            if (!(session.user as any).isCompleteProfile) {
                setIsModalOpen(true);
            }
        }
    }, [isPending, session]);

    const handleProfileComplete = () => {
        setIsModalOpen(false);
        window.location.reload();
    };

    const handleJoinRoom = (roomId: string) => {
        setConnecting(roomId);
        router.push(`/chat/${roomId}`);
    };

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Cargando sesión...</p>
            </div>
        );
    }

    return (
        <div>
            <AdditionalInfoModal
                isOpen={isModalOpen}
                onProfileComplete={handleProfileComplete}
            />
            <main className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
                {rooms.map((room, index) => (
                    <RoomCard
                        key={room.id}
                        room={room}
                        index={index}
                        userCount={userCounts[room.id] || 0}
                        isConnecting={connecting === room.id}
                        onJoin={handleJoinRoom}
                        cardVariants={cardVariants}
                    />
                ))}
            </main>
            <div ref={sentinelRef} className="flex justify-center items-center h-20">
                {loading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
                {!loading && !hasMore && rooms.length > 0 && <p className="text-muted-foreground">No hay más salas para mostrar.</p>}
                {error && <p className="text-destructive">{error}</p>}
            </div>
        </div>
    )
}

