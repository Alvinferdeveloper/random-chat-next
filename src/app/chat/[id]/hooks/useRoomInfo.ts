import { useEffect, useState } from "react";

export type RoomInfo = {
    id: string;
    name: string;
    short_description: string;
    full_description: string;
    server_icon: string;
    server_banner: string;
    verified: boolean;
};

/**
 * Fetches the public info of a single room (name, icon, description, etc.)
 * so the chat page has everything it needs to render the header and the
 * "tribe info" dialog, without relying on data carried over via query params.
 */
export function useRoomInfo(roomId: string) {
    const [room, setRoom] = useState<RoomInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!roomId) return;
        let cancelled = false;

        setLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/rooms/${roomId}`)
            .then(res => res.ok ? res.json() : null)
            .then(json => {
                if (!cancelled) setRoom(json?.data ?? null);
            })
            .catch(() => {
                if (!cancelled) setRoom(null);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [roomId]);

    return { room, loading };
}
