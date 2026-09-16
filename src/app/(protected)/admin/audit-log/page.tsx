'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAdminAuditLog, AuditLogEntry, AuditTargetTypeFilter } from './hooks/useAdminAuditLog';
import { Badge } from '@/src/components/ui/badge';
import { Pagination } from '@/src/app/components/shared/Pagination';
import { AlertCircle, History } from 'lucide-react';

const TARGET_TABS: AuditTargetTypeFilter[] = ['ALL', 'ROOM', 'USER', 'REPORT', 'SETTING', 'SYSTEM'];

function LogRowSkeleton() {
    return (
        <div className="flex items-center gap-4 p-4 border-b border-border/50 animate-pulse">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-4 w-36 bg-muted rounded" />
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-4 flex-1 bg-muted rounded" />
            <div className="h-4 w-32 bg-muted rounded" />
        </div>
    );
}

const ROOM_STATUS_TAB_KEY: Record<string, string> = {
    IN_REVISION: 'admin.rooms.tabs.pending',
    ACCEPTED: 'admin.rooms.tabs.accepted',
    REJECTED: 'admin.rooms.tabs.rejected',
};

function ActionDetail({ entry, t }: { entry: AuditLogEntry; t: (key: string, opts?: any) => string }) {
    const meta = entry.metadata || {};
    switch (entry.action) {
        case 'ROOM_STATUS_CHANGED': {
            const statusKey = ROOM_STATUS_TAB_KEY[String(meta.newStatus)];
            return <span>→ {statusKey ? t(statusKey) : String(meta.newStatus)}</span>;
        }
        case 'ROOM_CATEGORIES_UPDATED':
            return <span>{Array.isArray(meta.categoryIds) ? meta.categoryIds.length : 0} {t('admin.my_rooms.edit_categories')}</span>;
        case 'USER_ROLE_CHANGED':
            return <span>→ {String(meta.newRole)}</span>;
        case 'USER_BANNED':
            return <span className="truncate max-w-[220px] inline-block align-bottom">{meta.banReason ? String(meta.banReason) : '—'}</span>;
        case 'SETTING_UPDATED':
            return <span className="font-mono text-xs">{entry.targetId} = {String(meta.value)}</span>;
        case 'BROADCAST_SENT':
            return <span className="truncate max-w-[280px] inline-block align-bottom">{String(meta.message ?? '')}</span>;
        default:
            return <span>—</span>;
    }
}

export default function AdminAuditLogPage() {
    const { t, i18n } = useTranslation();
    const [activeTab, setActiveTab] = useState<AuditTargetTypeFilter>('ALL');
    const [page, setPage] = useState(1);
    const { logs, loading, error, total, totalPages, refetch } = useAdminAuditLog(activeTab, page);

    const handleTabChange = (tab: AuditTargetTypeFilter) => {
        setActiveTab(tab);
        setPage(1);
    };

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{t('admin.audit_log.title')}</h1>
                    <p className="text-sm text-muted-foreground mt-1">{t('admin.audit_log.subtitle')}</p>
                </div>
                {!loading && !error && total > 0 && (
                    <Badge variant="outline" className="text-sm px-3 py-1 w-fit">
                        {t('admin.audit_log.count', { count: total })}
                    </Badge>
                )}
            </motion.div>

            <div className="flex gap-1 rounded-xl bg-muted/50 p-1 border border-border/50 w-fit overflow-x-auto">
                {TARGET_TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap ${
                            activeTab === tab
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        {t(`admin.audit_log.target_type.${tab}`)}
                    </button>
                ))}
            </div>

            <div className="rounded-xl border border-border/50 bg-gradient-to-br from-zinc-100 to-zinc-100/60 dark:from-zinc-900/90 dark:to-zinc-900/60 overflow-hidden">
                {loading ? (
                    <div>
                        {[1, 2, 3, 4, 5].map((i) => <LogRowSkeleton key={i} />)}
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <AlertCircle className="h-10 w-10 text-destructive/60 mb-4" />
                        <p className="text-lg font-medium mb-1">{t('admin.rooms.error_title')}</p>
                        <p className="text-sm text-muted-foreground mb-4">{error}</p>
                        <button onClick={refetch} className="text-sm font-medium text-primary hover:underline active:scale-[0.98] transition-transform cursor-pointer">
                            {t('admin.rooms.retry')}
                        </button>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <History className="h-10 w-10 text-muted-foreground/30 mb-4" />
                        <p className="text-lg font-medium mb-1">{t('admin.audit_log.empty_title')}</p>
                        <p className="text-sm text-muted-foreground">{t('admin.audit_log.empty_desc')}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border/50 text-xs text-muted-foreground/70 uppercase tracking-wide">
                                    <th className="text-left font-medium p-4">{t('admin.audit_log.col_admin')}</th>
                                    <th className="text-left font-medium p-4">{t('admin.audit_log.col_action')}</th>
                                    <th className="text-left font-medium p-4">{t('admin.audit_log.col_target')}</th>
                                    <th className="text-left font-medium p-4">{t('admin.audit_log.col_detail')}</th>
                                    <th className="text-left font-medium p-4">{t('admin.audit_log.col_when')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((entry) => (
                                    <tr key={entry.id} className="border-b border-border/30 last:border-0 hover:bg-accent/20 transition-colors">
                                        <td className="p-4 font-medium truncate max-w-[140px]">{entry.admin?.username ? `@${entry.admin.username}` : entry.admin?.name}</td>
                                        <td className="p-4">
                                            <Badge variant="secondary" className="text-[10px]">{t(`admin.audit_log.action.${entry.action}`)}</Badge>
                                        </td>
                                        <td className="p-4 text-xs text-muted-foreground">
                                            <span className="font-mono">{entry.targetId ? `${entry.targetType}:${entry.targetId.slice(0, 8)}` : entry.targetType}</span>
                                        </td>
                                        <td className="p-4 text-muted-foreground">
                                            <ActionDetail entry={entry} t={t} />
                                        </td>
                                        <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                                            {new Date(entry.createdAt).toLocaleString(i18n.language)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} isLoading={loading} />
        </div>
    );
}
