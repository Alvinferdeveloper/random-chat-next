'use client';

import { useAdminReports } from './hooks/useAdminReports';
import { useAdminUsers } from '../users/hooks/useAdminUsers';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/src/components/ui/badge';
import { Input } from '@/src/components/ui/input';
import { CheckCircle2, ShieldAlert, Search } from 'lucide-react';
import { useState } from 'react';
import { BanDialog } from '@/src/app/(protected)/admin/users/components/BanDialog';
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
    const { t } = useTranslation();
    const {
        offenders,
        pagination,
        loading,
        error,
        search,
        setSearch,
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
            toast.success(status === 'RESOLVED' ? t('admin.toast.reports_resolved') : t('admin.toast.reports_dismissed'));
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
            toast.success(t('admin.toast.user_banned', { username: userToBan.username }));
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
            toast.info(t('admin.toast.no_chat_history'));
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
                    <h1 className="text-2xl font-bold tracking-tight">{t('admin.reports.title')}</h1>
                    <p className="text-sm text-muted-foreground mt-1">{t('admin.reports.subtitle')}</p>
                </div>
                {!loading && offenders.length > 0 && (
                    <Badge variant="destructive" className="text-sm px-3 py-1 gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        {t('admin.reports.count', { count: offenders.length })}
                    </Badge>
                )}
            </motion.div>

            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={t('admin.reports.search_placeholder')}
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

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
            ) : error ? (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center"
                >
                    <ShieldAlert className="h-10 w-10 text-destructive/60 mb-4" />
                    <p className="text-lg font-medium mb-1">{t('admin.reports.error_title')}</p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                </motion.div>
            ) : offenders.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center"
                >
                    <CheckCircle2 className="w-12 h-12 text-green-500/60 mb-4" />
                    <p className="text-lg font-medium mb-1">{t('admin.reports.empty_title')}</p>
                    <p className="text-sm text-muted-foreground">{t('admin.reports.empty_desc')}</p>
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
