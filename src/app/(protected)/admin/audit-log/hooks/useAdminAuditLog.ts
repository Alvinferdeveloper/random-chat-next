'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/src/app/lib/i18n';

export type AuditAction =
    | 'ROOM_STATUS_CHANGED'
    | 'ROOM_CATEGORIES_UPDATED'
    | 'USER_BANNED'
    | 'USER_UNBANNED'
    | 'USER_ROLE_CHANGED'
    | 'REPORT_RESOLVED'
    | 'REPORT_DISMISSED'
    | 'SETTING_UPDATED'
    | 'BROADCAST_SENT';

export type AuditTargetType = 'ROOM' | 'USER' | 'REPORT' | 'SETTING' | 'SYSTEM';
export type AuditTargetTypeFilter = AuditTargetType | 'ALL';

export interface AuditLogEntry {
    id: string;
    adminId: string;
    action: AuditAction;
    targetType: AuditTargetType;
    targetId: string | null;
    metadata: Record<string, unknown> | null;
    createdAt: string;
    admin: { name: string; username: string | null };
}

export function useAdminAuditLog(targetTypeFilter: AuditTargetTypeFilter = 'ALL', page: number = 1) {
    const { t } = useTranslation();
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            params.set('page', String(page));
            params.set('limit', '20');
            if (targetTypeFilter !== 'ALL') params.set('targetType', targetTypeFilter);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/admin/audit-log?${params}`, { credentials: 'include' });
            const json = await response.json();

            if (!response.ok) throw new Error(t(json.message || 'Error loading audit log'));

            setLogs(json.data);
            if (json.meta) {
                setTotal(json.meta.total);
                setTotalPages(json.meta.totalPages);
            }
        } catch (err: any) {
            setError(err.message || t('Error loading audit log'));
        } finally {
            setLoading(false);
        }
    }, [targetTypeFilter, page, t]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    return { logs, loading, error, total, totalPages, refetch: fetchLogs };
}
