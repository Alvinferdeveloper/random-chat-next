import { useEffect, useState, useCallback } from "react";

export type Room = {
    id: string,
    name: string,
    short_description: string,
    verified: boolean
    full_description: string,
    isFavorite: boolean,
    server_banner: string,
    server_icon: string,
    status: RoomStatus,
    created_at: string,
}

export type RoomStatus = 'IN_REVISION' | 'ACCEPTED' | 'REJECTED';

export type RoomFetchType = 'all' | 'favorites';

export default function useRoom(searchQuery: string = "", type: RoomFetchType = 'all') {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        setRooms([]);
        setPage(1);
        setHasMore(true);
    }, [searchQuery, type]);

    const loadMoreRooms = useCallback(async () => {
        if (loading || (!hasMore && page !== 1)) return;
        // Allow fetch if page is 1 (new search) even if hasMore might be stale, 
        // though resetting state above handles hasMore.

        setLoading(true);
        setError("");

        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: (process.env.NEXT_PUBLIC_ROOMS_FETCH_LIMIT || 10).toString(),
            });

            if (searchQuery) {
                queryParams.append("q", searchQuery);
            }

            const baseUrl = type === 'favorites'
                ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/rooms/favorites`
                : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/rooms`;

            const res = await fetch(`${baseUrl}?${queryParams.toString()}`, { credentials: 'include' });
            if (!res.ok) {
                throw new Error("Ocurrió un error al cargar las salas...");
            }
            const json = await res.json();

            setRooms(prevRooms => page === 1 ? json.data : [...prevRooms, ...json.data]);
            setPage(prevPage => prevPage + 1);
            setHasMore(json.pagination.hasNextPage);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore, searchQuery, type]);

    useEffect(() => {
        // Initial load or reload when search changes (because page resets to 1)
        if (page === 1) {
            loadMoreRooms();
        }
    }, [page, searchQuery, type]); // Add searchQuery to dependencies if we want it to trigger.
    // Actually, since we reset page to 1 on searchQuery change, 
    // and we have page in dependency of this effect, it might trigger twice if we are not careful.
    // Let's simplify: 
    // 1. Search Query updates -> Effect 1 resets page to 1. 
    // 2. Page updates to 1 -> Effect 2 triggers loadMoreRooms.

    return { rooms, error, loading, hasMore, loadMoreRooms };
}