'use client';

import { useState, useEffect, useCallback } from 'react';

interface ActiveRoom {
    id: string;
    name: string;
    normalized_name: string;
    short_description: string;
    server_icon: string | null;
    userCount: number;
}

export function useAdminTopActiveRooms() {
    const [rooms, setRooms] = useState<ActiveRoom[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRooms = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/rooms/active`, {
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                setRooms(data.rooms);
            }
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRooms();
        const interval = setInterval(fetchRooms, 15000);
        return () => clearInterval(interval);
    }, [fetchRooms]);

    return { rooms, loading, refresh: fetchRooms };
}
