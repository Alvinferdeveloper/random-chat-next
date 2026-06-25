'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdminRooms } from './hooks/useAdminRooms';
import { Badge } from '@/src/components/ui/badge';
import { ConfirmDialog } from '@/src/app/components/shared/ConfirmDialog';
import { toast } from 'sonner';
import { MessageSquare, AlertCircle } from 'lucide-react';
import RoomCard from './components/RoomCard';

function RoomSkeleton() {
    return (
        <div className="flex flex-col h-full overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card to-muted/30 dark:from-zinc-900/90 dark:to-zinc-900/60">
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

export default function PendingRoomsPage() {
    const { rooms, loading, error, updateStatus, refetch } = useAdminRooms('IN_REVISION');
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [actionData, setActionData] = useState<{ id: string, status: 'ACCEPTED' | 'REJECTED' } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleActionClick = (roomId: string, status: 'ACCEPTED' | 'REJECTED') => {
        setActionData({ id: roomId, status });
        setIsConfirmOpen(true);
    };

    const handleConfirmAction = async () => {
        if (!actionData) return;
        setIsSubmitting(true);
        const success = await updateStatus(actionData.id, actionData.status);
        if (success) {
            toast.success(actionData.status === 'ACCEPTED' ? 'Sala aceptada.' : 'Sala rechazada.');
        }
        setIsSubmitting(false);
        setIsConfirmOpen(false);
        setActionData(null);
    };

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Salas Pendientes</h1>
                    <p className="text-sm text-muted-foreground mt-1">Revisa y modera las salas creadas por los usuarios</p>
                </div>
                {!loading && !error && (
                    <Badge variant="outline" className="text-sm px-3 py-1">
                        {rooms.length} pendientes
                    </Badge>
                )}
            </motion.div>

            {loading ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
                >
                    {[1, 2, 3].map((i) => (
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
                    <p className="text-lg font-medium mb-1">Error al cargar</p>
                    <p className="text-sm text-muted-foreground mb-4">{error}</p>
                    <button
                        onClick={refetch}
                        className="text-sm font-medium text-primary hover:underline active:scale-[0.98] transition-transform"
                    >
                        Intentar de nuevo
                    </button>
                </motion.div>
            ) : rooms.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center"
                >
                    <MessageSquare className="h-10 w-10 text-muted-foreground/30 mb-4" />
                    <p className="text-lg font-medium mb-1">No hay salas pendientes</p>
                    <p className="text-sm text-muted-foreground">Todas las salas han sido revisadas.</p>
                </motion.div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {rooms.map((room, index) => (
                        <RoomCard
                            key={room.id}
                            room={room}
                            index={index}
                            onAction={handleActionClick}
                            isSubmitting={isSubmitting}
                        />
                    ))}
                </div>
            )}

            <ConfirmDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmAction}
                title={actionData?.status === 'ACCEPTED' ? 'Aceptar Sala' : 'Rechazar Sala'}
                description={`¿Estás seguro de que deseas ${actionData?.status === 'ACCEPTED' ? 'aceptar' : 'rechazar'} esta sala?`}
                confirmText={actionData?.status === 'ACCEPTED' ? 'Aceptar' : 'Rechazar'}
                variant={actionData?.status === 'ACCEPTED' ? 'primary' : 'destructive'}
                isLoading={isSubmitting}
            />
        </div>
    );
}
