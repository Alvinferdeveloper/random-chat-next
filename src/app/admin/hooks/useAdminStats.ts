'use client';

import { useState, useEffect } from 'react';

interface Stats {
    totalUsers: number;
    activeRooms: number;
    pendingRooms: number;
}

export function useAdminStats() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/stats`, {
                credentials: 'include',
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Error fetching stats');

            setStats(data);
            setError(null);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return { stats, loading, error, refresh: fetchStats };
}
