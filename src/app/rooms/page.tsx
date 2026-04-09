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

    const { rooms, error, loading, hasMore, loadMoreRooms, retry } = useRoom(debouncedSearch);

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

    const ErrorView = () => (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="bg-destructive/10 p-4 rounded-full mb-4">
                <svg className="h-12 w-12 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Error al cargar las salas</h2>
            <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
            <button
                onClick={retry}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
            >
                Intentar de nuevo
            </button>
        </div>
    );

    return (
        <div className="bg-main-gradient min-h-screen">
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

            {error && rooms.length === 0 ? (
                <ErrorView />
            ) : (
                <>
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

                    {error && rooms.length > 0 && (
                        <div className="flex flex-col items-center p-6 bg-destructive/5 rounded-lg mx-6 mb-6">
                            <p className="text-destructive font-medium mb-3">{error}</p>
                            <button
                                onClick={retry}
                                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
                            >
                                Reintentar cargar más
                            </button>
                        </div>
                    )}

                    <div ref={sentinelRef} className="flex justify-center items-center h-20">
                        {!loading && !hasMore && rooms.length > 0 && (
                            <p className="text-muted-foreground">No hay más salas para mostrar.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

