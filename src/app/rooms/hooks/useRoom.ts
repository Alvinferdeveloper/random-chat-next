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
    ownerId: string,
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
        setError("");
    }, [searchQuery, type]);

    const loadMoreRooms = useCallback(async () => {
        if (loading || error || (!hasMore && page !== 1)) return;

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

            if (res.status === 429) {
                throw new Error("RATE_LIMIT");
            }

            if (!res.ok) {
                throw new Error("ROOMS_LOAD_ERROR");
            }
            const json = await res.json();

            setRooms(prevRooms => page === 1 ? json.data : [...prevRooms, ...json.data]);
            setPage(prevPage => prevPage + 1);
            setHasMore(json.pagination.hasNextPage);

        } catch (err: any) {
            // fetch() only throws an exception (rejects the promise) on network errors 
            // or when something prevents the request from completing. 
            // In these cases, the error is traditionally a TypeError.
            if (err instanceof TypeError) {
                setError("NETWORK_ERROR");
            } else {
                setError(err.message || "ROOMS_GENERIC_ERROR");
            }
        } finally {
            setLoading(false);
        }
    }, [page, loading, error, hasMore, searchQuery, type]);

    const retry = useCallback(() => {
        setError("");
        loadMoreRooms();
    }, [loadMoreRooms]);

    useEffect(() => {
        if (page === 1 && !error) {
            loadMoreRooms();
        }
    }, [page, searchQuery, type, error]);

    return { rooms, error, loading, hasMore, loadMoreRooms, retry };
}