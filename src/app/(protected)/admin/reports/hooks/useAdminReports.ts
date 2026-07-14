'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '@/src/app/hooks/useDebounce';
import { Message } from '@/src/types/chat';

export interface Offender {
    user: {
        id: string;
        username: string;
        email: string;
        image: string | null;
        isBanned: boolean;
    };
    reportCount: number;
    recentReasons: string[];
    lastReportedAt: string;
}

export interface DetailedReport {
    id: string;
    reason: string;
    details: string | null;
    chatContext: Message[] | null;
    createdAt: string;
    reporter: { username: string };
    room: { name: string } | null;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export function useAdminReports() {
    const [offenders, setOffenders] = useState<Offender[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);
    const [page, setPage] = useState(1);

    const fetchReports = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ page: String(page) });
            if (debouncedSearch) params.set('search', debouncedSearch);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/reports/admin/top-offenders?${params}`, {
                credentials: 'include'
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Error fetching reports');

            setOffenders(data.offenders);
            setPagination(data.pagination);
            setError(null);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const resolveReports = async (userId: string, status: 'RESOLVED' | 'DISMISSED') => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/reports/admin/user/${userId}/resolve`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
                credentials: 'include'
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Error resolving reports');
            }

            // Remove from local list
            setOffenders(prev => prev.filter(o => o.user.id !== userId));
            return true;
        } catch (err) {
            setError((err as Error).message);
            return false;
        }
    };

    const fetchUserReports = async (userId: string): Promise<DetailedReport[]> => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/reports/admin/user/${userId}`, {
                credentials: 'include'
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error fetching user reports');
            return data;
        } catch (err) {
            setError((err as Error).message);
            return [];
        }
    };

    return {
        offenders,
        pagination,
        loading,
        error,
        page,
        setPage,
        search,
        setSearch,
        resolveReports,
        fetchUserReports,
        refresh: fetchReports
    };
}
