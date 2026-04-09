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
                throw new Error("Has hecho demasiadas peticiones. Por favor, espera un momento antes de volver a intentarlo.");
            }

            if (!res.ok) {
                throw new Error("Ocurrió un error al cargar las salas. El servidor puede estar experimentando problemas.");
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
                setError("No se pudo establecer conexión con el servidor. Verifica tu conexión o inténtalo más tarde.");
            } else {
                setError(err.message || "Algo salió mal al cargar las salas.");
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