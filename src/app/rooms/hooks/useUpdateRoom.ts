import { useState } from "react";

export function useUpdateRoom() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateRoom = async (roomId: string, field: string, value: any) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/rooms/${roomId}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ [field]: value }),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.message || "Error al actualizar la sala.");
            }

            return json;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { updateRoom, loading, error };
}
