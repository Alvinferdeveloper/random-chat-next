'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '@/src/app/components/providers/SocketEventProvider';

interface LiveStats {
    onlineUsers: number;
    totalUsers: number;
    newUsersToday: number;
    pendingReports: number;
    activeRooms: number;
    pendingRooms: number;
}

export function useAdminLiveStats() {
    const socket = useSocket();
    const [stats, setStats] = useState<LiveStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchInitialStats = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/stats`, {
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                setStats(data);
            }
        } catch {
            // fallback: will get updates via socket
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialStats();

        const handleStatsUpdate = (data: LiveStats) => {
            setStats(data);
        };

        socket.on('admin-stats-update', handleStatsUpdate);

        return () => {
            socket.off('admin-stats-update', handleStatsUpdate);
        };
    }, [socket]);

    return { stats, loading };
}
