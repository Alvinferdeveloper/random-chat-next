import { useState, useEffect, useCallback } from 'react';
import { Room } from '@/src/app/rooms/hooks/useRoom';

export interface AdminRoom extends Room {
    status: 'IN_REVISION' | 'ACCEPTED' | 'REJECTED';
    owner: {
        name: string;
        email: string;
        username: string;
    };
}

export type RoomStatus = 'IN_REVISION' | 'ACCEPTED' | 'REJECTED';
export type RoomStatusFilter = RoomStatus | 'ALL';

export function useAdminRooms(statusFilter: RoomStatusFilter = 'IN_REVISION', page: number = 1) {
    const [rooms, setRooms] = useState<AdminRoom[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchRooms = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            params.set('status', statusFilter);
            params.set('page', String(page));
            params.set('limit', '12');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/admin/rooms?${params}`, { credentials: 'include' });
            const json = await response.json();
            setRooms(json.data);
            if (json.meta) {
                setTotal(json.meta.total);
                setTotalPages(json.meta.totalPages);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error loading rooms.');
        } finally {
            setLoading(false);
        }
    }, [statusFilter, page]);

    const updateStatus = async (roomId: string, newStatus: RoomStatus) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/admin/rooms/${roomId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
                credentials: 'include',
            });

            if (statusFilter === 'ALL') {
                setRooms((prev) =>
                    prev.map((r) => (r.id === roomId ? { ...r, status: newStatus } : r))
                );
            } else {
                setRooms((prev) => prev.filter((r) => r.id !== roomId));
            }
            return true;
        } catch (err: any) {
            console.error(err);
            return false;
        }
    };

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    return { rooms, loading, error, total, totalPages, updateStatus, refetch: fetchRooms };
}
