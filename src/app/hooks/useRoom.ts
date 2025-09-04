import { useEffect, useState } from "react";

type Room = {
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

    useEffect(() => {
        const fetchRooms = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/rooms`, { credentials:'include'});
            if (!res.ok) {
                setError("Ocurrio un error al cargar las salas... ");
                return;
            }
            const json = await res.json();
            setRooms(json)
        }
        fetchRooms();
    }, [])

    return { rooms, error }
}