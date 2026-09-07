import { useEffect, useState, useCallback, useRef } from "react";
import { useCachedOnMount } from "@/src/app/hooks/useCachedOnMount";
import { setSessionCache } from "@/src/app/utils/sessionCache";

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
    categories?: { id: string; name: string; icon: string | null }[],
}

export type RoomStatus = 'IN_REVISION' | 'ACCEPTED' | 'REJECTED';

export type RoomFetchType = 'all' | 'favorites';

type RoomsCacheEntry = { rooms: Room[]; page: number; hasMore: boolean };

// Cached (see sessionCache) so a returning tab can show the previous list
// instantly instead of an empty skeleton while it silently refetches page 1.
const ROOMS_CACHE_TTL_MS = 2 * 60 * 1000;

function roomsCacheKey(type: RoomFetchType, searchQuery: string) {
    return `rooms_cache:${type}:${searchQuery}`;
}

export default function useRoom(searchQuery: string = "", type: RoomFetchType = 'all') {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const paramsKeyRef = useRef(`${type}:${searchQuery}`);

    // Adopt a recent cached page 1 before paint so a reloaded tab doesn't
    // flash an empty skeleton for a list we already had a moment ago.
    useCachedOnMount<RoomsCacheEntry>(roomsCacheKey(type, searchQuery), ROOMS_CACHE_TTL_MS, (cached) => {
        setRooms(cached.rooms);
        setPage(cached.page);
        setHasMore(cached.hasMore);
    });

    useEffect(() => {
        const key = `${type}:${searchQuery}`;
        if (paramsKeyRef.current === key) return; // skip on initial mount
        paramsKeyRef.current = key;
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

            if (page === 1) {
                setSessionCache<RoomsCacheEntry>(roomsCacheKey(type, searchQuery), {
                    rooms: json.data,
                    page: 2,
                    hasMore: json.pagination.hasNextPage,
                });
            }

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