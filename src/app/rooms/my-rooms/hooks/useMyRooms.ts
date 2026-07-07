'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import { Room, RoomStatus } from "@/src/app/rooms/hooks/useRoom";

export function useMyRooms(statusFilter: RoomStatus | 'ALL' = 'ALL') {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const fetchingRef = useRef(false);

    useEffect(() => {
        setRooms([]);
        setPage(1);
        setHasMore(true);
        setLoading(true);
        setError(null);
    }, [statusFilter]);

    const loadMoreRooms = useCallback(async () => {
        if (fetchingRef.current || error || (!hasMore && page !== 1)) return;

        fetchingRef.current = true;
        setLoading(true);
        setError(null);

        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: (process.env.NEXT_PUBLIC_ROOMS_FETCH_LIMIT || 10).toString(),
            });

            if (statusFilter !== 'ALL') {
                queryParams.append("status", statusFilter);
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/rooms/my-rooms?${queryParams.toString()}`, {
                credentials: 'include',
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || "MY_ROOMS_LOAD_ERROR");
            }

            const json = await response.json();
            setRooms(prevRooms => page === 1 ? json.data : [...prevRooms, ...json.data]);
            setPage(prevPage => prevPage + 1);
            setHasMore(json.pagination?.hasNextPage ?? false);

        } catch (err: any) {
            if (err instanceof TypeError) {
                setError("NETWORK_ERROR");
            } else {
                setError(err.message || "MY_ROOMS_LOAD_ERROR");
            }
        } finally {
            fetchingRef.current = false;
            setLoading(false);
        }
    }, [page, error, hasMore, statusFilter]);

    useEffect(() => {
        if (page === 1 && !error) {
            loadMoreRooms();
        }
    }, [page, statusFilter, error, loadMoreRooms]);

    const deleteRoom = async (roomId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/rooms/${roomId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || "ROOM_DELETE_ERROR");
            }

            setRooms(prevRooms => prevRooms.filter(room => room.id !== roomId));
            return { success: true };
        } catch (err: any) {
            return { success: false, message: err.message };
        }
    };

    return {
        rooms,
        loading,
        error,
        hasMore,
        loadMoreRooms,
        deleteRoom
    };
}
