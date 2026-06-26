'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Eye, XCircle, UserX, ShieldAlert, Calendar, Loader2 } from 'lucide-react';
import { Offender } from '../hooks/useAdminReports';

interface OffenderCardProps {
    offender: Offender;
    index: number;
    processingId: string | null;
    onResolve: (userId: string, status: 'RESOLVED' | 'DISMISSED') => void;
    onBanClick: (user: Offender['user']) => void;
    onViewContext: (user: Offender['user']) => void;
}

export default function OffenderCard({ offender, index, processingId, onResolve, onBanClick, onViewContext }: OffenderCardProps) {
    const { t } = useTranslation();

    const REASON_LABELS: Record<string, string> = {
        SPAM: t('admin.reports.reason.spam'),
        HARASSMENT: t('admin.reports.reason.harassment'),
        INAPPROPRIATE_CONTENT: t('admin.reports.reason.inappropriate'),
        HATE_SPEECH: t('admin.reports.reason.hate_speech'),
        ANNOYING_BEHAVIOR: t('admin.reports.reason.annoying'),
        OTHER: t('admin.reports.reason.other')
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1], delay: index * 0.04 }}
        >
            <div className="overflow-hidden rounded-lg border border-border/50 bg-gradient-to-br from-zinc-100 to-zinc-100/60 dark:from-zinc-900/90 dark:to-zinc-900/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-border/50">
                    <div className="flex items-center gap-4 min-w-0">
                        <Avatar className="h-11 w-11 border shrink-0">
                            <AvatarImage src={offender.user.image || ''} />
                            <AvatarFallback>{offender.user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-sm truncate">{offender.user.username}</h3>
                                <Badge variant="destructive" className="text-[10px] font-bold h-5">
                                    {t('admin.reports.report_count', { count: offender.reportCount })}
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">{offender.user.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1.5 text-xs active:scale-[0.98] cursor-pointer"
                            onClick={() => onViewContext(offender.user)}
                            disabled={processingId === offender.user.id}
                        >
                            {processingId === offender.user.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
                            {t('admin.reports.evidence')}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1.5 text-xs text-muted-foreground active:scale-[0.98] cursor-pointer"
                            onClick={() => onResolve(offender.user.id, 'DISMISSED')}
                            disabled={processingId === offender.user.id}
                        >
                            <XCircle className="w-3.5 h-3.5" />
                            {t('admin.reports.dismiss')}
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 gap-1.5 text-xs active:scale-[0.98] cursor-pointer"
                            onClick={() => onBanClick(offender.user)}
                            disabled={processingId === offender.user.id}
                        >
                            <UserX className="w-3.5 h-3.5" />
                            {t('admin.reports.ban')}
                        </Button>
                    </div>
                </div>

                <div className="p-4 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase mb-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        {t('admin.reports.recent_reasons')}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {offender.recentReasons.map((reason, i) => (
                            <Badge key={i} variant="secondary" className="text-[10px] bg-secondary/50 font-medium">
                                {REASON_LABELS[reason] || reason}
                            </Badge>
                        ))}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        {t('admin.reports.last_report')} {new Date(offender.lastReportedAt).toLocaleString()}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
