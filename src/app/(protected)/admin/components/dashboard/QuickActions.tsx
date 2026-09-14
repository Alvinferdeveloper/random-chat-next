'use client';

import { Megaphone, MessageSquare, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { cn } from '@/src/lib/utils';

interface QuickActionsProps {
    onBroadcast: () => void;
    pendingRooms?: number;
    pendingReports?: number;
}

export default function QuickActions({ onBroadcast, pendingRooms = 0, pendingReports = 0 }: QuickActionsProps) {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
            <h2 className="text-lg font-semibold tracking-tight mb-4">{t('admin.quick_actions.title')}</h2>
            <div className="grid gap-4 md:grid-cols-3">
                <Link
                    href="/admin/rooms"
                    className={cn(
                        "border rounded-xl p-5 flex items-center gap-4 text-left hover:bg-accent/30 transition-all duration-200 ease-out active:scale-[0.98] group",
                        pendingRooms > 0 && "border-amber-500/30 bg-amber-500/5"
                    )}
                >
                    <div className={cn(
                        "p-3 rounded-xl transition-colors duration-200 shrink-0",
                        pendingRooms > 0
                            ? "bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white"
                            : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                    )}>
                        <MessageSquare className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium">{t('admin.quick_actions.pending_rooms')}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {pendingRooms > 0
                                ? t('admin.quick_actions.pending_rooms_desc', { count: pendingRooms })
                                : t('admin.quick_actions.pending_rooms_desc_empty')}
                        </p>
                    </div>
                </Link>

                <Link
                    href="/admin/reports"
                    className={cn(
                        "border rounded-xl p-5 flex items-center gap-4 text-left hover:bg-accent/30 transition-all duration-200 ease-out active:scale-[0.98] group",
                        pendingReports > 0 && "border-red-500/30 bg-red-500/5"
                    )}
                >
                    <div className={cn(
                        "p-3 rounded-xl transition-colors duration-200 shrink-0",
                        pendingReports > 0
                            ? "bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white"
                            : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                    )}>
                        <AlertCircle className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium">{t('admin.quick_actions.pending_reports')}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {pendingReports > 0
                                ? t('admin.quick_actions.pending_reports_desc', { count: pendingReports })
                                : t('admin.quick_actions.pending_reports_desc_empty')}
                        </p>
                    </div>
                </Link>

                <button
                    onClick={onBroadcast}
                    className="border rounded-xl p-5 flex items-center gap-4 text-left hover:bg-accent/30 transition-all duration-200 ease-out active:scale-[0.98] group"
                >
                    <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200 shrink-0">
                        <Megaphone className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium">{t('admin.quick_actions.global_announcement')}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{t('admin.quick_actions.global_announcement_desc')}</p>
                    </div>
                </button>
            </div>
        </motion.div>
    );
}
