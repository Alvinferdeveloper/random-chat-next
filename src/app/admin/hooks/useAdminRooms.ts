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

export function useAdminRooms(status: 'IN_REVISION' | 'ACCEPTED' | 'REJECTED' = 'IN_REVISION') {
    const [rooms, setRooms] = useState<AdminRoom[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRooms = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/admin/rooms?status=${status}&limit=50`, { credentials: 'include' });
            const json = await response.json();
            setRooms(json.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar las salas.');
        } finally {
            setLoading(false);
        }
    }, [status]);

    const updateStatus = async (roomId: string, newStatus: 'ACCEPTED' | 'REJECTED') => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/admin/rooms/${roomId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
                credentials: 'include',
            });
            // Remove the room from the list if status changed (assuming we are filtering by status)
            setRooms((prev) => prev.filter((r) => r.id !== roomId));
            return true;
        } catch (err: any) {
            console.error(err);
            return false;
        }
    };

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    return { rooms, loading, error, updateStatus, refetch: fetchRooms };
}
