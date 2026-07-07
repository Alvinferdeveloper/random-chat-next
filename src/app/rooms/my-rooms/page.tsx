'use client';

import { useTranslation } from 'react-i18next';
import { useMyRooms } from '@/src/app/rooms/my-rooms/hooks/useMyRooms';
import { RoomCard } from '@/src/app/rooms/components/RoomCard';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useRoomUserCounts } from '@/src/app/rooms/hooks/useRoomUserCounts';
import { useInfiniteScroll } from '@/src/app/hooks/useInfiniteScroll';
import RoomCardFooter from '@/src/app/rooms/my-rooms/components/RoomCardFooter';
import { RoomStatus } from '@/src/app/rooms/hooks/useRoom';
import { cn } from '@/src/lib/utils';

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

type StatusTab = RoomStatus | 'ALL';
const STATUS_TABS: StatusTab[] = ['ALL', 'IN_REVISION', 'ACCEPTED', 'REJECTED'];

export default function MyRoomsPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const [connecting, setConnecting] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<StatusTab>('ALL');
    const { userCounts } = useRoomUserCounts();
    const { rooms, loading, error, hasMore, loadMoreRooms, deleteRoom } = useMyRooms(activeTab);

    const { sentinelRef } = useInfiniteScroll({ loading, hasMore, onLoadMore: loadMoreRooms });

    const handleJoinRoom = (roomId: string, roomName: string) => {
        setConnecting(roomId);
        router.push(`/chat/${roomId}?roomName=${roomName}`);
    };

    const tabLabel = (tab: StatusTab) => {
        switch (tab) {
            case 'ALL': return t('rooms.my-rooms.tabs.all');
            case 'IN_REVISION': return t('rooms.my-rooms.tabs.in_revision');
            case 'ACCEPTED': return t('rooms.my-rooms.tabs.accepted');
            case 'REJECTED': return t('rooms.my-rooms.tabs.rejected');
        }
    };

    const emptyKey = activeTab === 'ALL' ? 'empty_all' : `empty_${activeTab.toLowerCase()}`;

    if (loading && rooms.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">{t('rooms.my-rooms.loading')}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-main-gradient p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <Link href="/rooms" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2">
                            <ArrowLeft className="h-4 w-4" />
                            {t('rooms.my-rooms.back')}
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-white">{t('rooms.my-rooms.title')}</h1>
                        <p className="text-muted-foreground">{t('rooms.my-rooms.subtitle')}</p>
                    </div>
                    <Link href="/rooms/create">
                        <button className="bg-primary cursor-pointer hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-medium transition-colors">
                            {t('rooms.my-rooms.create_new')}
                        </button>
                    </Link>
                </div>

                <div className="flex gap-1 bg-muted/30 rounded-lg p-1 w-fit">
                    {STATUS_TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer",
                                activeTab === tab
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            {tabLabel(tab)}
                        </button>
                    ))}
                </div>

                {error && rooms.length === 0 && (
                    <div className="bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded-md">
                        {error}
                    </div>
                )}

                {rooms.length === 0 && !loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-muted/20 rounded-xl border border-dashed border-border">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                            <Loader2 className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold text-white">
                                {t(`rooms.my-rooms.${emptyKey}_title`)}
                            </h2>
                            <p className="text-muted-foreground max-w-sm">
                                {t(`rooms.my-rooms.${emptyKey}_desc`)}
                            </p>
                        </div>
                        {activeTab === 'ALL' && (
                            <Link href="/rooms/create">
                                <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-md font-medium transition-colors">
                                    {t('rooms.my-rooms.create_first')}
                                </button>
                            </Link>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {rooms.map((room, index) => (
                                <RoomCard
                                    key={room.id}
                                    room={room}
                                    index={index}
                                    userCount={userCounts[room.id] || 0}
                                    isConnecting={connecting === room.id}
                                    onJoin={handleJoinRoom}
                                    cardVariants={cardVariants}
                                    onDelete={deleteRoom}
                                    footer={
                                        <RoomCardFooter room={room} />
                                    }
                                />
                            ))}
                        </div>

                        <div ref={sentinelRef} className="flex justify-center items-center h-20">
                            {loading && rooms.length > 0 && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>{t('rooms.load_more.loading')}</span>
                                </div>
                            )}
                            {!loading && !hasMore && rooms.length > 0 && (
                                <p className="text-muted-foreground">{t('rooms.my-rooms.end')}</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
