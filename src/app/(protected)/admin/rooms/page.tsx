'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAdminRooms, RoomStatus, RoomStatusFilter } from './hooks/useAdminRooms';
import { Badge } from '@/src/components/ui/badge';
import { Input } from '@/src/components/ui/input';
import { ConfirmDialog } from '@/src/app/components/shared/ConfirmDialog';
import { Pagination } from '@/src/app/components/shared/Pagination';
import { toast } from 'sonner';
import { AlertCircle, Layers, Search, Check, X as XIcon } from 'lucide-react';
import RoomCard from './components/RoomCard';
import { BulkActionBar } from '../components/BulkActionBar';

const TABS: { key: RoomStatusFilter; labelKey: string }[] = [
    { key: 'ALL', labelKey: 'admin.rooms.tabs.all' },
    { key: 'IN_REVISION', labelKey: 'admin.rooms.tabs.pending' },
    { key: 'ACCEPTED', labelKey: 'admin.rooms.tabs.accepted' },
    { key: 'REJECTED', labelKey: 'admin.rooms.tabs.rejected' },
];

const EMPTY_KEYS: Record<RoomStatusFilter, { title: string; desc: string }> = {
    ALL: { title: 'admin.rooms.empty_title_all', desc: 'admin.rooms.empty_desc_all' },
    IN_REVISION: { title: 'admin.rooms.empty_title', desc: 'admin.rooms.empty_desc' },
    ACCEPTED: { title: 'admin.rooms.empty_title_accepted', desc: 'admin.rooms.empty_desc_accepted' },
    REJECTED: { title: 'admin.rooms.empty_title_rejected', desc: 'admin.rooms.empty_desc_rejected' },
};

const COUNT_KEYS: Record<RoomStatusFilter, string> = {
    ALL: 'admin.rooms.count_all',
    IN_REVISION: 'admin.rooms.count',
    ACCEPTED: 'admin.rooms.count_accepted',
    REJECTED: 'admin.rooms.count_rejected',
};

const CONFIRM_KEYS: Record<RoomStatus, { title: string; desc: string; text: string }> = {
    ACCEPTED: {
        title: 'admin.rooms.confirm_accept_title',
        desc: 'admin.rooms.confirm_accept_desc',
        text: 'admin.rooms.confirm_accept_text',
    },
    REJECTED: {
        title: 'admin.rooms.confirm_reject_title',
        desc: 'admin.rooms.confirm_reject_desc',
        text: 'admin.rooms.confirm_reject_text',
    },
    IN_REVISION: {
        title: 'admin.rooms.confirm_revision_title',
        desc: 'admin.rooms.confirm_revision_desc',
        text: 'admin.rooms.confirm_revision_text',
    },
};

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
                <div className="space-y-1.5">
                    <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-full bg-muted rounded animate-pulse" />
                    <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
                </div>
            </div>
            <div className="p-6 pt-4 border-t border-border flex gap-3">
                <div className="h-9 flex-1 bg-muted rounded-md animate-pulse" />
                <div className="h-9 flex-1 bg-muted rounded-md animate-pulse" />
            </div>
        </div>
    );
}

export default function ManageRoomsPage() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<RoomStatusFilter>('IN_REVISION');
    const [page, setPage] = useState(1);
    const { rooms, loading, error, total, totalPages, search, setSearch, updateStatus, updateCategories, updateRoom, refetch } = useAdminRooms(activeTab, page);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [actionData, setActionData] = useState<{ id: string; status: RoomStatus } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);

    const handleActionClick = useCallback((roomId: string, status: RoomStatus) => {
        setActionData({ id: roomId, status });
        setIsConfirmOpen(true);
    }, []);

    const handleConfirmAction = async () => {
        if (!actionData) return;
        setIsSubmitting(true);
        const success = await updateStatus(actionData.id, actionData.status);
        if (success) {
            const keyMap: Record<string, string> = {
                ACCEPTED: 'admin.toast.room_accepted',
                REJECTED: 'admin.toast.room_rejected',
                IN_REVISION: 'admin.toast.room_revision',
            };
            toast.success(t(keyMap[actionData.status]));
        }
        setIsSubmitting(false);
        setIsConfirmOpen(false);
        setActionData(null);
    };

    const handleTabChange = (tab: RoomStatusFilter) => {
        setActiveTab(tab);
        setPage(1);
        setSelectedIds(new Set());
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
        setSelectedIds(new Set());
    };

    const toggleSelect = (roomId: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(roomId)) next.delete(roomId);
            else next.add(roomId);
            return next;
        });
    };

    const handleBulkAction = async (status: RoomStatus) => {
        setIsBulkSubmitting(true);
        const ids = Array.from(selectedIds);
        const results = await Promise.all(ids.map((id) => updateStatus(id, status)));
        const successCount = results.filter(Boolean).length;

        if (successCount > 0) {
            const keyMap: Record<string, string> = {
                ACCEPTED: 'admin.toast.bulk_room_accepted',
                REJECTED: 'admin.toast.bulk_room_rejected',
                IN_REVISION: 'admin.toast.bulk_room_revision',
            };
            toast.success(t(keyMap[status], { count: successCount }));
        }
        setSelectedIds(new Set());
        setIsBulkSubmitting(false);
    };

    const confirmVariant = actionData?.status === 'REJECTED' ? 'destructive' : 'primary';

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{t('admin.rooms.title')}</h1>
                    <p className="text-sm text-muted-foreground mt-1">{t('admin.rooms.subtitle')}</p>
                </div>
                {!loading && !error && total > 0 && (
                    <Badge variant="outline" className="text-sm px-3 py-1 w-fit">
                        {t(COUNT_KEYS[activeTab], { count: total })}
                    </Badge>
                )}
            </motion.div>

            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={t('admin.rooms.search_placeholder')}
                    className="pl-10"
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                />
            </div>

            <div className="flex gap-1 rounded-xl bg-muted/50 p-1 border border-border/50 w-fit">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => handleTabChange(tab.key)}
                        className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                            activeTab === tab.key
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        {t(tab.labelKey)}
                    </button>
                ))}
            </div>

            {loading ? (
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
                    <p className="text-lg font-medium mb-1">{t(EMPTY_KEYS[activeTab].title)}</p>
                    <p className="text-sm text-muted-foreground">{t(EMPTY_KEYS[activeTab].desc)}</p>
                </motion.div>
            ) : (
                <>
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {rooms.map((room, index) => (
                            <RoomCard
                                key={room.id}
                                room={room}
                                index={index}
                                onAction={handleActionClick}
                                onUpdateCategories={updateCategories}
                                onUpdateRoom={updateRoom}
                                isSubmitting={isSubmitting}
                                selected={selectedIds.has(room.id)}
                                onToggleSelect={toggleSelect}
                            />
                        ))}
                    </div>

                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        isLoading={loading}
                    />
                </>
            )}

            <ConfirmDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmAction}
                title={actionData ? t(CONFIRM_KEYS[actionData.status].title) : ''}
                description={actionData ? t(CONFIRM_KEYS[actionData.status].desc) : ''}
                confirmText={actionData ? t(CONFIRM_KEYS[actionData.status].text) : ''}
                variant={confirmVariant}
                isLoading={isSubmitting}
            />

            <BulkActionBar
                count={selectedIds.size}
                onClear={() => setSelectedIds(new Set())}
                isSubmitting={isBulkSubmitting}
                actions={[
                    { key: 'reject', label: t('admin.rooms.reject'), icon: XIcon, variant: 'destructive', onClick: () => handleBulkAction('REJECTED') },
                    { key: 'accept', label: t('admin.rooms.accept'), icon: Check, variant: 'default', onClick: () => handleBulkAction('ACCEPTED') },
                ]}
            />
        </div>
    );
}
