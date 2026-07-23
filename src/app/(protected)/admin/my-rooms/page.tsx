'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAdminMyRooms, RoomStatus } from './hooks/useAdminMyRooms';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { AlertCircle, Layers, Plus } from 'lucide-react';
import AdminRoomCard from './components/AdminRoomCard';
import CreateRoomDialog from './components/CreateRoomDialog';

type StatusTab = RoomStatus | 'ALL';
const STATUS_TABS: StatusTab[] = ['ALL', 'IN_REVISION', 'ACCEPTED', 'REJECTED'];

function RoomSkeleton() {
    return (
        <div className="flex flex-col h-full overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-zinc-100 to-zinc-100/60 dark:from-zinc-900/90 dark:to-zinc-900/60">
            <div className="h-44 w-full bg-muted animate-pulse" />
            <div className="p-6 pb-2 mt-6 space-y-3">
                <div className="h-5 w-2/3 bg-muted rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
            </div>
            <div className="p-6 pt-2 flex-1 space-y-3">
                <div className="space-y-1.5">
                    <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-full bg-muted rounded animate-pulse" />
                </div>
            </div>
            <div className="p-6 pt-4 border-t border-border flex gap-3">
                <div className="h-9 flex-1 bg-muted rounded-md animate-pulse" />
                <div className="h-9 w-9 bg-muted rounded-md animate-pulse" />
            </div>
        </div>
    );
}

export default function AdminMyRoomsPage() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<StatusTab>('ALL');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const { rooms, loading, error, total, hasMore, loadMoreRooms, deleteRoom, updateRoom, updateCategories, createRoom, refetch } = useAdminMyRooms(activeTab);

    const handleTabChange = (tab: StatusTab) => {
        setActiveTab(tab);
    };

    const handleCategoriesUpdated = useCallback((roomId: string) => {
        // Re-fetch to get updated categories
        refetch();
    }, [refetch]);

    const tabLabel = (tab: StatusTab) => {
        if (tab === 'ALL') return t('admin.my_rooms.tabs.all');
        return t(`admin.my_rooms.tabs.${tab}`);
    };

    const emptyKey = activeTab === 'ALL' ? 'empty_all' : `empty_${activeTab}`;

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{t('admin.my_rooms.title')}</h1>
                    <p className="text-sm text-muted-foreground mt-1">{t('admin.my_rooms.subtitle')}</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)} className="gap-2 cursor-pointer">
                    <Plus className="h-4 w-4" />
                    {t('admin.my_rooms.create_new')}
                </Button>
                {!loading && !error && total > 0 && (
                    <Badge variant="outline" className="text-sm px-3 py-1 w-fit">
                        {total} {total === 1 ? 'sala' : 'salas'}
                    </Badge>
                )}
            </motion.div>

            <div className="flex gap-1 rounded-xl bg-muted/50 p-1 border border-border/50 w-fit">
                {STATUS_TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                            activeTab === tab
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        {tabLabel(tab)}
                    </button>
                ))}
            </div>

            {loading && rooms.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
                >
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <RoomSkeleton key={i} />
                    ))}
                </motion.div>
            ) : error ? (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center"
                >
                    <AlertCircle className="h-10 w-10 text-destructive/60 mb-4" />
                    <p className="text-lg font-medium mb-1">{t('admin.rooms.error_title')}</p>
                    <p className="text-sm text-muted-foreground mb-4">{error}</p>
                    <button
                        onClick={refetch}
                        className="text-sm font-medium text-primary hover:underline active:scale-[0.98] transition-transform"
                    >
                        {t('admin.rooms.retry')}
                    </button>
                </motion.div>
            ) : rooms.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center"
                >
                    <Layers className="h-10 w-10 text-muted-foreground/30 mb-4" />
                    <p className="text-lg font-medium mb-1">{t(`${emptyKey}_title`)}</p>
                    <p className="text-sm text-muted-foreground">{t(`${emptyKey}_desc`)}</p>
                </motion.div>
            ) : (
                <>
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {rooms.map((room, index) => (
                            <AdminRoomCard
                                key={room.id}
                                room={room}
                                index={index}
                                onDelete={deleteRoom}
                                onUpdate={updateRoom}
                                onUpdateCategories={updateCategories}
                            />
                        ))}
                    </div>

                    {hasMore && (
                        <div className="flex justify-center pt-4">
                            <button
                                onClick={loadMoreRooms}
                                disabled={loading}
                                className="px-6 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
                            >
                                {loading ? 'Cargando...' : 'Cargar más'}
                            </button>
                        </div>
                    )}

                    {!hasMore && rooms.length > 0 && (
                        <p className="text-center text-sm text-muted-foreground pt-4">
                            {t('admin.my_rooms.end')}
                        </p>
                    )}
                </>
            )}

            <CreateRoomDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                onCreate={createRoom}
            />
        </div>
    );
}
