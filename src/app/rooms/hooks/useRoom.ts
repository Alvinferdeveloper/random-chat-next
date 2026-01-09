import { useEffect, useState, useCallback } from "react";

export type Room = {
    id: string,
    name: string,
    short_description: string,
    full_description: string,
    server_banner: string,
    server_icon: string
}

export default function useRoom() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const loadMoreRooms = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/rooms?page=${page}&limit=${process.env.NEXT_PUBLIC_ROOMS_FETCH_LIMIT || 10}`);
            if (!res.ok) {
                throw new Error("Ocurrió un error al cargar las salas...");
            }
            const json = await res.json();

            setRooms(prevRooms => [...prevRooms, ...json.data]);
            setPage(prevPage => prevPage + 1);
            setHasMore(json.pagination.hasNextPage);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore]);

    useEffect(() => {
        loadMoreRooms();
    }, []);

    return { rooms, error, loading, hasMore, loadMoreRooms };
}