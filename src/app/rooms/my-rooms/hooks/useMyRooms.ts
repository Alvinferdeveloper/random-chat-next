'use client';

import { useState, useEffect, useCallback } from "react";
import { Room } from "@/src/app/rooms/hooks/useRoom";

export function useMyRooms() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMyRooms = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/rooms/my-rooms`, {
                credentials: 'include',
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || "Error al cargar tus salas.");
            }

            const json = await response.json();
            setRooms(json.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteRoom = async (roomId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/rooms/${roomId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || "Error al eliminar la sala.");
            }

            // Update local state after deletion
            setRooms(prevRooms => prevRooms.filter(room => room.id !== roomId));
            return { success: true };
        } catch (err: any) {
            return { success: false, message: err.message };
        }
    };

    useEffect(() => {
        fetchMyRooms();
    }, [fetchMyRooms]);

    return {
        rooms,
        loading,
        error,
        refetch: fetchMyRooms,
        deleteRoom
    };
}
