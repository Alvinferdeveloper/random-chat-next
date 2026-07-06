'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useRoom from '@/src/app/rooms/hooks/useRoom';
import { AdditionalInfoModal } from '@/src/app/components/auth/AdditionalInfoModal';
import { useAuth } from '@/src/app/hooks/useAuth';
import { useInfiniteScroll } from '@/src/app/hooks/useInfiniteScroll';
import { motion, Variants } from 'framer-motion';
import { RoomCard } from '@/src/app/rooms/components/RoomCard';
import { RoomSkeleton } from '@/src/app/rooms/components/RoomSkeleton';

import { useRoomUserCounts } from '@/src/app/rooms/hooks/useRoomUserCounts';
import { useDebounce } from '@/src/app/hooks/useDebounce';
import { Search, X, Loader2 } from 'lucide-react';

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
    const { t } = useTranslation();
    const router = useRouter();
    const [connecting, setConnecting] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 500);

    const { rooms, error, loading, hasMore, loadMoreRooms, retry } = useRoom(debouncedSearch);

    const { sentinelRef } = useInfiniteScroll({ loading, hasMore, onLoadMore: loadMoreRooms });
    const { userCounts } = useRoomUserCounts();

    const { session, isPending } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const isCompleteProfile = (session?.user as any)?.isCompleteProfile ?? true;

    useEffect(() => {
        if (isPending) return;
        if (session?.user && !isCompleteProfile) {
            setIsModalOpen(true);
        }
    }, [isPending, isCompleteProfile, session?.user]);

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
            <h2 className="text-xl font-bold mb-2">{t('rooms.error.title')}</h2>
            <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
            <button
                onClick={retry}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
            >
                {t('rooms.error.retry')}
            </button>
        </div>
    );

    return (
        <div className="bg-background min-h-screen">
            <AdditionalInfoModal
                isOpen={isModalOpen}
                onProfileComplete={handleProfileComplete}
            />

            {/* HERO SECTION */}
            <section className="relative w-full min-h-[360px] md:min-h-[500px] flex flex-col items-center justify-center px-6 py-12 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/illustrations/room_background.png"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-background/30 dark:from-background/95 dark:via-background/60 dark:to-background/40" />
                </div>

                <div className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] as const }}
                    >
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                            {t('rooms.hero.badge')}
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] as const, delay: 0.1 }}
                        className="relative text-white text-5xl md:text-[64px] font-black tracking-tight leading-[1.05] drop-shadow-xl after:block after:content-[''] after:w-14 after:h-1 after:bg-emerald-400/60 after:mx-auto after:mt-5 after:rounded-full"
                    >
                        {t('rooms.hero.title').split('ChatHub').map((part, i, arr) => (
                            <span key={i}>
                                {part}
                                {i < arr.length - 1 && <span className="text-primary">ChatHub</span>}
                            </span>
                        ))}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] as const, delay: 0.2 }}
                        className="text-white/85 text-base md:text-lg font-medium mt-5 max-w-2xl drop-shadow-md leading-relaxed"
                    >
                        {t('rooms.hero.subtitle')}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] as const, delay: 0.3 }}
                        className="w-full max-w-[680px] mt-8"
                    >
                        <div className="relative flex items-center gap-2 rounded-xl border border-white/20 bg-white/15 backdrop-blur-md px-4 py-2 shadow-lg transition-all duration-200 focus-within:bg-white/20 focus-within:border-white/30">
                            <Search className="w-5 h-5 text-white/70 shrink-0" />
                            <input
                                type="text"
                                className="w-full h-10 bg-transparent outline-none text-white placeholder:text-white/50 text-base"
                                placeholder={t('rooms.search.placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="p-1.5 text-white/60 hover:text-white cursor-pointer transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-[1600px] mx-auto pt-4">

                {error && rooms.length === 0 ? (
                    <ErrorView />
                ) : (
                    <>
                        <main className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-6 pt-2">
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
                                    {t('rooms.load_more.retry')}
                                </button>
                            </div>
                        )}

                        <div ref={sentinelRef} className="flex justify-center items-center h-20">
                            {loading && rooms.length > 0 && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>{t('rooms.load_more.loading')}</span>
                                </div>
                            )}
                            {!loading && !hasMore && rooms.length > 0 && (
                                <p className="text-muted-foreground">{t('rooms.load_more.no_more')}</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

