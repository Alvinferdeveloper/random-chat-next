'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useRoom from '@/src/app/rooms/hooks/useRoom';
import { useAuth } from '@/src/app/hooks/useAuth';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useInfiniteScroll } from '@/src/app/rooms/hooks/useInfiniteScroll';
import { Variants } from 'framer-motion';
import { RoomCard } from '@/src/app/rooms/components/RoomCard';
import { useRoomUserCounts } from '@/src/app/rooms/hooks/useRoomUserCounts';
import { SearchBar } from '@/src/app/rooms/components/SearchBar';
import { useDebounce } from '@/src/app/hooks/useDebounce';
import { Button } from '@/src/components/ui/button';

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

export default function FavoritesPage() {
    const router = useRouter();
    const [connecting, setConnecting] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 500);

    const { rooms, error, loading, hasMore, loadMoreRooms } = useRoom(debouncedSearch, 'favorites');

    const { sentinelRef } = useInfiniteScroll({ loading, hasMore, onLoadMore: loadMoreRooms });
    const { userCounts } = useRoomUserCounts();

    const { isPending } = useAuth();

    const handleJoinRoom = (roomId: string) => {
        setConnecting(roomId);
        router.push(`/chat/${roomId}`);
    };

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2">Cargando sesión...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-main-gradient">
            <div className="p-6 pb-2 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="text-white cursor-pointer hover:bg-white/10"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg blur opacity-25"></div>
                        <h1 className="relative px-4 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-red-100 to-red-400">
                            Mis Favoritos
                        </h1>
                    </div>
                </div>

                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Buscar en favoritos..."
                />
            </div>

            <main className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
                {rooms.length === 0 && !loading && !error && (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                        <p className="text-gray-400 text-lg mb-4">No tienes salas favoritas todavía.</p>
                        <Button onClick={() => router.push('/rooms')}>
                            Explorar salas
                        </Button>
                    </div>
                )}
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
                {!loading && !hasMore && rooms.length > 0 && (
                    <p className="text-muted-foreground">Has llegado al final de tus favoritos.</p>
                )}
                {error && <p className="text-destructive">{error}</p>}
            </div>
        </div>
    );
}
