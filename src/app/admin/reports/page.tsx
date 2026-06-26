'use client';

import { useAdminReports } from './hooks/useAdminReports';
import { useAdminUsers } from '../users/hooks/useAdminUsers';
import { motion } from 'framer-motion';
import { Badge } from '@/src/components/ui/badge';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { BanDialog } from '@/src/app/admin/users/components/BanDialog';
import { Pagination } from '@/src/app/components/shared/Pagination';
import { ChatContextDialog } from './components/ChatContextDialog';
import { DetailedReport } from './hooks/useAdminReports';
import { toast } from 'sonner';
import OffenderCard from './components/OffenderCard';

function ReportSkeleton() {
    return (
        <div className="rounded-xl border border-border/50 bg-gradient-to-br from-zinc-100 to-zinc-100/60 dark:from-zinc-900/90 dark:to-zinc-900/60 animate-pulse">
            <div className="flex items-center gap-4 p-4 border-b border-border/50">
                <div className="h-11 w-11 rounded-full bg-muted shrink-0" />
                <div className="space-y-2 flex-1">
                    <div className="h-4 w-48 bg-muted rounded" />
                    <div className="h-3 w-64 bg-muted rounded" />
                </div>
                <div className="flex gap-2">
                    <div className="h-8 w-20 bg-muted rounded-md" />
                    <div className="h-8 w-20 bg-muted rounded-md" />
                    <div className="h-8 w-20 bg-muted rounded-md" />
                </div>
            </div>
            <div className="p-4 space-y-3">
                <div className="h-3 w-32 bg-muted rounded" />
                <div className="flex gap-1.5">
                    <div className="h-5 w-16 bg-muted rounded-full" />
                    <div className="h-5 w-20 bg-muted rounded-full" />
                    <div className="h-5 w-14 bg-muted rounded-full" />
                </div>
                <div className="h-3 w-56 bg-muted rounded" />
            </div>
        </div>
    );
}

export default function AdminReportsPage() {
    const {
        offenders,
        pagination,
        loading,
        page,
        setPage,
        resolveReports,
        fetchUserReports
    } = useAdminReports();

    const { toggleBan } = useAdminUsers();

    const [processingId, setProcessingId] = useState<string | null>(null);
    const [banDialogOpen, setBanDialogOpen] = useState(false);
    const [userToBan, setUserToBan] = useState<{ id: string, username: string } | null>(null);

    const [isContextOpen, setIsContextOpen] = useState(false);
    const [contextReports, setContextReports] = useState<DetailedReport[]>([]);
    const [selectedUsername, setSelectedUsername] = useState('');

    const handleResolve = async (userId: string, status: 'RESOLVED' | 'DISMISSED') => {
        setProcessingId(userId);
        const success = await resolveReports(userId, status);
        if (success) {
            toast.success(status === 'RESOLVED' ? 'Reportes resueltos.' : 'Reportes descartados.');
        }
        setProcessingId(null);
    };

    const handleBanClick = (user: any) => {
        setUserToBan({ id: user.id, username: user.username });
        setBanDialogOpen(true);
    };

    const handleConfirmBan = async (reason: string) => {
        if (!userToBan) return;
        setProcessingId(userToBan.id);
        const success = await toggleBan(userToBan.id, true, reason);
        if (success) {
            toast.success(`Usuario @${userToBan.username} baneado.`);
            await resolveReports(userToBan.id, 'RESOLVED');
        }
        setProcessingId(null);
        setBanDialogOpen(false);
    };

    const handleViewContext = async (user: any) => {
        setProcessingId(user.id);
        const reports = await fetchUserReports(user.id);

        if (reports.length > 0) {
            setContextReports(reports);
            setSelectedUsername(user.username);
            setIsContextOpen(true);
        } else {
            toast.info('No se encontro historial de chat para los reportes de este usuario.');
        }
        setProcessingId(null);
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
                    <h1 className="text-2xl font-bold tracking-tight">Reportes de Comunidad</h1>
                    <p className="text-sm text-muted-foreground mt-1">Gestiona los reportes de los usuarios en la plataforma</p>
                </div>
                {!loading && offenders.length > 0 && (
                    <Badge variant="destructive" className="text-sm px-3 py-1 gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        {offenders.length} pendientes
                    </Badge>
                )}
            </motion.div>

            {loading ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                >
                    {[1, 2, 3].map((i) => (
                        <ReportSkeleton key={i} />
                    ))}
                </motion.div>
            ) : offenders.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center"
                >
                    <CheckCircle2 className="w-12 h-12 text-green-500/60 mb-4" />
                    <p className="text-lg font-medium mb-1">Todo despejado</p>
                    <p className="text-sm text-muted-foreground">No hay reportes pendientes de resolucion.</p>
                </motion.div>
            ) : (
                <div className="space-y-3">
                    {offenders.map((offender, index) => (
                        <OffenderCard
                            key={offender.user.id}
                            offender={offender}
                            index={index}
                            processingId={processingId}
                            onResolve={handleResolve}
                            onBanClick={handleBanClick}
                            onViewContext={handleViewContext}
                        />
                    ))}

                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex justify-center pt-2">
                            <Pagination
                                currentPage={page}
                                totalPages={pagination.totalPages}
                                onPageChange={setPage}
                                isLoading={loading}
                            />
                        </div>
                    )}
                </div>
            )}

            <BanDialog
                isOpen={banDialogOpen}
                onClose={() => setBanDialogOpen(false)}
                onConfirm={handleConfirmBan}
                username={userToBan?.username || ''}
            />

            <ChatContextDialog
                isOpen={isContextOpen}
                onClose={() => setIsContextOpen(false)}
                reports={contextReports}
                reportedUsername={selectedUsername}
            />
        </div>
    );
}
