'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useRoom from '@/src/app/rooms/hooks/useRoom';
import { AdditionalInfoModal } from '@/src/app/components/auth/AdditionalInfoModal';
import { useAuth } from '@/src/app/hooks/useAuth';
import { useInfiniteScroll } from '@/src/app/rooms/hooks/useInfiniteScroll';
import { Variants } from 'framer-motion';
import { RoomCard } from '@/src/app/rooms/components/RoomCard';
import { RoomSkeleton } from '@/src/app/rooms/components/RoomSkeleton';

import { useRoomUserCounts } from '@/src/app/rooms/hooks/useRoomUserCounts';

import { SearchBar } from '@/src/app/rooms/components/SearchBar';
import { useDebounce } from '@/src/app/hooks/useDebounce';

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
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 500);

    const { rooms, error, loading, hasMore, loadMoreRooms } = useRoom(debouncedSearch);

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

    const handleJoinRoom = (roomId: string, roomName: string) => {
        setConnecting(roomId);
        router.push(`/chat/${roomId}?roomName=${roomName}`);
    };

    const showInitialSkeleton = isPending || (loading && rooms.length === 0);

    return (
        <div className="bg-main-gradient">
            <AdditionalInfoModal
                isOpen={isModalOpen}
                onProfileComplete={handleProfileComplete}
            />
            <div className="p-6 pb-2 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="relative">
                    {/* brightness effect  */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25"></div>

                    <h1 className="relative px-4 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-blue-300 dark:from-white dark:via-blue-100 dark:to-blue-4000">
                        Salas Disponibles
                    </h1>
                </div>

                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Buscar sala por nombre..."
                />
            </div>
            <main className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
                {showInitialSkeleton ? (
                    [...Array(6)].map((_, i) => (
                        <RoomSkeleton key={i} />
                    ))
                ) : (
                    <>
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
                        {loading && [...Array(3)].map((_, i) => (
                            <RoomSkeleton key={`loading-${i}`} />
                        ))}
                    </>
                )}
            </main>
            <div ref={sentinelRef} className="flex justify-center items-center h-20">
                {!loading && !hasMore && rooms.length > 0 && <p className="text-muted-foreground">No hay más salas para mostrar.</p>}
                {error && <p className="text-destructive">{error}</p>}
            </div>
        </div>
    )
}

