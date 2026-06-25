'use client';

import { useAdminUsers } from './hooks/useAdminUsers';
import { useAuth } from '@/src/app/hooks/useAuth';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Badge } from '@/src/components/ui/badge';
import { Search, Users, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { BanDialog } from './components/BanDialog';
import { UserDetailSheet } from './components/UserDetailSheet';
import { Pagination } from '@/src/app/components/shared/Pagination';
import UserRow from './components/UserRow';

const cardGradient = 'bg-gradient-to-br from-card to-muted/30 dark:from-zinc-900/90 dark:to-zinc-900/60';

function UserRowSkeleton() {
    return (
        <div className="flex items-center justify-between p-4 border rounded-xl animate-pulse">
            <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-full bg-muted shrink-0" />
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-28 bg-muted rounded" />
                        <div className="h-4 w-14 bg-muted rounded" />
                    </div>
                    <div className="flex gap-4">
                        <div className="h-3 w-40 bg-muted rounded" />
                        <div className="h-3 w-28 bg-muted rounded" />
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="h-8 w-14 bg-muted rounded-md" />
                <div className="h-8 w-14 bg-muted rounded-md" />
                <div className="h-8 w-20 bg-muted rounded-md" />
            </div>
        </div>
    );
}

export default function AdminUsersPage() {
    const {
        users,
        pagination,
        loading,
        error,
        search,
        setSearch,
        page,
        setPage,
        toggleBan,
        changeRole,
        refresh
    } = useAdminUsers();

    const { session } = useAuth();
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [banDialogOpen, setBanDialogOpen] = useState(false);
    const [userToBan, setUserToBan] = useState<{ id: string, username: string } | null>(null);
    const [detailUserId, setDetailUserId] = useState<string | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const handleActionClick = async (user: any) => {
        if (user.isBanned) {
            setProcessingId(user.id);
            const success = await toggleBan(user.id, false);
            if (success) toast.success(`Usuario @${user.username} desbaneado.`);
            setProcessingId(null);
        } else {
            setUserToBan({ id: user.id, username: user.username });
            setBanDialogOpen(true);
        }
    };

    const handleConfirmBan = async (reason: string) => {
        if (!userToBan) return;
        setProcessingId(userToBan.id);
        const success = await toggleBan(userToBan.id, true, reason);
        if (success) toast.success(`Usuario @${userToBan.username} baneado.`);
        setProcessingId(null);
        setBanDialogOpen(false);
    };

    const handleChangeRole = async (userId: string, username: string, newRole: string) => {
        setProcessingId(userId);
        const success = await changeRole(userId, newRole);
        if (success) toast.success(`Rol de @${username} actualizado a ${newRole}.`);
        setProcessingId(null);
    };

    const isMe = (userId: string) => session?.user?.id === userId;

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Gesti&oacute;n de Usuarios</h1>
                    <p className="text-sm text-muted-foreground mt-1">Administra los usuarios registrados en la plataforma</p>
                </div>
                {!loading && !error && pagination && (
                    <Badge variant="outline" className="text-sm px-3 py-1">
                        {pagination.total} usuarios
                    </Badge>
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1], delay: 0.05 }}
            >
                <Card className={`overflow-hidden border-border/50 ${cardGradient}`}>
                    <CardHeader className="pb-3">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nombre, email o username..."
                                className="pl-10"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                        {loading ? (
                            <div className="space-y-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <UserRowSkeleton key={i} />
                                ))}
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <AlertCircle className="h-10 w-10 text-destructive/60 mb-4" />
                                <p className="text-lg font-medium mb-1">Error al cargar</p>
                                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                                <button
                                    onClick={refresh}
                                    className="text-sm font-medium text-primary hover:underline active:scale-[0.98] transition-transform"
                                >
                                    Intentar de nuevo
                                </button>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <Users className="h-10 w-10 text-muted-foreground/30 mb-4" />
                                <p className="text-lg font-medium mb-1">No se encontraron usuarios</p>
                                <p className="text-sm text-muted-foreground">Prueba con otros t&eacute;rminos de b&uacute;squeda.</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {users.map((user, index) => (
                                    <UserRow
                                        key={user.id}
                                        user={user}
                                        index={index}
                                        isMe={isMe(user.id)}
                                        processingId={processingId}
                                        onView={(id) => { setDetailUserId(id); setDetailOpen(true); }}
                                        onChangeRole={handleChangeRole}
                                        onAction={handleActionClick}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                    {pagination && pagination.totalPages > 1 && (
                        <div className="border-t border-border px-6 py-3">
                            <Pagination
                                currentPage={page}
                                totalPages={pagination.totalPages}
                                onPageChange={setPage}
                                isLoading={loading}
                            />
                        </div>
                    )}
                </Card>
            </motion.div>

            <UserDetailSheet
                userId={detailUserId}
                open={detailOpen}
                onOpenChange={setDetailOpen}
            />
            <BanDialog
                isOpen={banDialogOpen}
                onClose={() => setBanDialogOpen(false)}
                onConfirm={handleConfirmBan}
                username={userToBan?.username || ''}
            />
        </div>
    );
}
