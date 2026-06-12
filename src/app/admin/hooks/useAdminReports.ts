'use client';

import { useState, useEffect, useCallback } from 'react';

interface Offender {
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
    const [page, setPage] = useState(1);

    const fetchReports = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/reports/admin/top-offenders?page=${page}`, {
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
    }, [page]);

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

    return {
        offenders,
        pagination,
        loading,
        error,
        page,
        setPage,
        resolveReports,
        refresh: fetchReports
    };
}
