'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';

export interface SearchedRoom {
    id: string;
    name: string;
    short_description: string;
    activeUsers: number;
    server_icon: string;
}

export function useRoomSearch(query: string) {
    const [rooms, setRooms] = useState<SearchedRoom[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        if (debouncedQuery.trim().length < 2) {
            setRooms([]);
            return;
        }

        let active = true;
        setLoading(true);
        setError(null);

        const fetchRooms = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const res = await fetch(
                    `${apiUrl}/api/v1/rooms?q=${encodeURIComponent(debouncedQuery)}&limit=10`,
                    { credentials: 'include' }
                );

                if (!active) return;

                if (!res.ok) {
                    throw new Error('ROOM_SEARCH_ERROR');
                }

                const json = await res.json();
                setRooms(json.data || []);
            } catch (err: any) {
                console.error("Error fetching rooms:", err);
                if (active) {
                    setError(err.message || 'ROOM_SEARCH_FALLBACK');
                    setRooms([]);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        fetchRooms();

        return () => {
            active = false;
        };
    }, [debouncedQuery]);

    return { rooms, loading, error };
}
