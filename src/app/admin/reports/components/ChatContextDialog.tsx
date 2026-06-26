'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/src/components/ui/dialog';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { Badge } from '@/src/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { MessageSquare, Clock, Calendar } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { DetailedReport } from '../hooks/useAdminReports';
import { Message, isTextMessage, isImageMessage } from '@/src/types/chat';

const ease = [0.23, 1, 0.32, 1] as const;

const fadeUp = {
    hidden: { opacity: 0, y: 8 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.25, ease, delay: i * 0.04 }
    })
};

interface ChatContextDialogProps {
    isOpen: boolean;
    onClose: () => void;
    reports: DetailedReport[];
    reportedUsername: string;
}

export function ChatContextDialog({ isOpen, onClose, reports, reportedUsername }: ChatContextDialogProps) {
    const { t } = useTranslation();

    const REASON_LABELS: Record<string, string> = {
        SPAM: t('admin.reports.reason.spam'),
        HARASSMENT: t('admin.reports.reason.harassment'),
        INAPPROPRIATE_CONTENT: t('admin.reports.reason.inappropriate'),
        HATE_SPEECH: t('admin.reports.reason.hate_speech'),
        ANNOYING_BEHAVIOR: t('admin.reports.reason.annoying'),
        OTHER: t('admin.reports.reason.other')
    };

    const reportsWithContext = reports.filter(r => r.chatContext && r.chatContext.length > 0);

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden flex flex-col h-[85vh] gap-0 bg-zinc-100 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                <DialogHeader className="p-6 border-b border-zinc-200 dark:border-zinc-800 shrink-0 bg-zinc-100 dark:bg-zinc-950">
                    <DialogTitle className="flex items-center gap-2.5 text-lg">
                        <span className="truncate">{t('admin.reports.context.title', { username: reportedUsername })}</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                        {reportsWithContext.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-muted-foreground py-20 px-6 text-center">
                                <Clock className="h-12 w-12 text-muted-foreground/20 mb-4" />
                                <h3 className="font-semibold text-base">{t('admin.reports.context.no_evidence_title')}</h3>
                                <p className="text-sm text-muted-foreground/70 max-w-xs mx-auto mt-1">
                                    {t('admin.reports.context.no_evidence_desc')}
                                </p>
                            </div>
                        ) : (
                            <div className="p-6 space-y-10">
                                {reportsWithContext.map((report, rIdx) => (
                                    <motion.div
                                        key={report.id}
                                        custom={rIdx}
                                        initial="hidden"
                                        animate="visible"
                                        variants={fadeUp}
                                        className="relative"
                                    >
                                        <div className="sticky top-0 z-10 py-3 bg-zinc-100 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-7 h-7 rounded-full bg-destructive/10 text-destructive flex items-center justify-center font-bold text-xs shrink-0">
                                                    {rIdx + 1}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold">{t('admin.reports.context.report_of', { username: report.reporter.username })}</span>
                                                        <Badge variant="destructive" className="h-5 text-[10px] font-bold">
                                                            {REASON_LABELS[report.reason] || report.reason}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-0.5 text-[10px] text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(report.createdAt).toLocaleString()}
                                                        </span>
                                                        {report.room && (
                                                            <span className="flex items-center gap-1">
                                                                <MessageSquare className="w-3 h-3" />
                                                                {t('admin.reports.context.room')} {report.room.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pl-4 border-l-2 border-border ml-4">
                                            {report.chatContext?.map((msg: Message, mIdx: number) => {
                                                const isReportedUser = msg.username === reportedUsername;
                                                return (
                                                    <motion.div
                                                        key={msg.id || mIdx}
                                                        custom={mIdx}
                                                        initial="hidden"
                                                        animate="visible"
                                                        variants={fadeUp}
                                                        className="flex gap-3"
                                                    >
                                                        <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                                                            <AvatarImage src={msg.userProfileImage || ''} />
                                                            <AvatarFallback className="text-[10px]">{msg.username?.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col gap-1 min-w-0 flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className={cn(
                                                                    "text-xs font-bold truncate",
                                                                    isReportedUser ? "text-destructive" : "text-primary"
                                                                )}>
                                                                    {msg.username}
                                                                </span>
                                                                <span className="text-[9px] text-muted-foreground shrink-0">
                                                                    {formatTime(msg.timestamp)}
                                                                </span>
                                                            </div>
                                                            <div className={cn(
                                                                "p-3 rounded-2xl text-xs leading-relaxed",
                                                                isReportedUser
                                                                    ? "bg-destructive/10 border border-destructive/20 text-foreground"
                                                                    : "bg-zinc-200/70 dark:bg-zinc-800/70 text-muted-foreground border border-zinc-200 dark:border-zinc-800"
                                                            )}>
                                                                {isTextMessage(msg) && msg.message}
                                                                {isImageMessage(msg) && (
                                                                    <div className="relative mt-2 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-300/50 dark:bg-zinc-700/50 max-h-40 w-auto">
                                                                        <Image
                                                                            src={msg.imageUrl || ''}
                                                                            alt={t('admin.reports.evidence')}
                                                                            width={320}
                                                                            height={160}
                                                                            className="object-contain w-auto h-auto max-h-40"
                                                                            style={{ width: 'auto', height: 'auto' }}
                                                                            unoptimized
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>

                                        {report.details && (
                                            <div className="mt-4 ml-8 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 italic text-xs text-muted-foreground">
                                                <span className="font-bold text-amber-600 not-italic block mb-1 uppercase tracking-wider text-[9px]">
                                                    {t('admin.reports.context.reporter_comment')}
                                                </span>
                                                &ldquo;{report.details}&rdquo;
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <div className="p-4 bg-zinc-100 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center shrink-0">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                        {t('admin.reports.context.evidence_count', { count: reportsWithContext.length })}
                    </span>
                    <span className="text-[10px] text-muted-foreground/50 font-mono font-medium">
                        ChatHub
                    </span>
                </div>
            </DialogContent>
        </Dialog>
    );
}
