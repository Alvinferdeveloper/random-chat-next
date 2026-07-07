'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useRoom from '@/src/app/rooms/hooks/useRoom';
import { useAuth } from '@/src/app/hooks/useAuth';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useInfiniteScroll } from '@/src/app/hooks/useInfiniteScroll';
import { Variants } from 'framer-motion';
import { RoomCard } from '@/src/app/rooms/components/RoomCard';
import { useRoomUserCounts } from '@/src/app/rooms/hooks/useRoomUserCounts';
import { SearchBar } from '@/src/app/rooms/components/SearchBar';
import { useDebounce } from '@/src/app/hooks/useDebounce';
import { Button } from '@/src/components/ui/button';
import Link from 'next/link';

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
    const { t } = useTranslation();
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
                <p className="ml-2">{t('rooms.favorites.loading_session')}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-main-gradient">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <Link href="/rooms" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2">
                            <ArrowLeft className="h-4 w-4" />
                            {t('rooms.favorites.back')}
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-white">{t('rooms.favorites.title')}</h1>
                        <p className="text-muted-foreground">{t('rooms.favorites.subtitle')}</p>
                    </div>

                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder={t('rooms.favorites.search_placeholder')}
                    />
                </div>

                <main className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {rooms.length === 0 && !loading && !error && (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                            <p className="text-gray-400 text-lg mb-4">{t('rooms.favorites.empty')}</p>
                            <Button onClick={() => router.push('/rooms')}>
                                {t('rooms.favorites.browse')}
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
                        <p className="text-muted-foreground">{t('rooms.favorites.end')}</p>
                    )}
                    {error && <p className="text-destructive">{error}</p>}
                </div>
            </div>
        </div>
    );
}
