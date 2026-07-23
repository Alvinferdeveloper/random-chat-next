'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import { RoomStatus } from "@/src/app/rooms/hooks/useRoom";

export type { RoomStatus };

export type AdminMyRoom = {
    id: string;
    name: string;
    normalized_name: string;
    short_description: string;
    full_description: string;
    server_banner: string;
    server_icon: string;
    created_at: string;
    verified: boolean;
    status: RoomStatus;
    ownerId: string;
    isFavorite: boolean;
    categories: { id: string; name: string; icon: string | null }[];
};

export function useAdminMyRooms(statusFilter: RoomStatus | 'ALL' = 'ALL') {
    const [rooms, setRooms] = useState<AdminMyRoom[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState(0);
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
                limit: '12',
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
            setTotal(json.pagination?.totalItems ?? 0);

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
            setTotal(prev => prev - 1);
            return { success: true };
        } catch (err: any) {
            return { success: false, message: err.message };
        }
    };

    const updateCategories = async (roomId: string, categoryIds: string[]) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/rooms/${roomId}/categories`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categoryIds }),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || "CATEGORIES_UPDATE_ERROR");
            }

            // Update local state
            setRooms(prevRooms => prevRooms.map(room => {
                if (room.id === roomId) {
                    return { ...room, categories: room.categories.filter(c => categoryIds.includes(c.id)) };
                }
                return room;
            }));

            return { success: true };
        } catch (err: any) {
            return { success: false, message: err.message };
        }
    };

    const updateRoom = (roomId: string, updates: Partial<AdminMyRoom>) => {
        setRooms(prev => prev.map(room => room.id === roomId ? { ...room, ...updates } : room));
    };

    const refetch = useCallback(() => {
        setRooms([]);
        setPage(1);
        setHasMore(true);
        setLoading(true);
        setError(null);
    }, []);

    const createRoom = async (data: { name: string; short_description: string; full_description: string; categoryIds?: string[] }) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/rooms`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || "ROOM_CREATE_ERROR");
            }

            const result = await response.json();
            refetch();
            return { success: true, data: result.data };
        } catch (err: any) {
            return { success: false, message: err.message };
        }
    };

    return {
        rooms,
        loading,
        error,
        hasMore,
        total,
        loadMoreRooms,
        deleteRoom,
        updateRoom,
        updateCategories,
        createRoom,
        refetch,
    };
}
