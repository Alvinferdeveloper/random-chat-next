import { useEffect, useState } from "react";

type Room = {
    id: string,
    name: string,
    short_description: string,
    full_description: string,
    icon: string,
    color: string
}

export default function useRoom() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRooms = async () => {
            const res = await fetch("http://192.168.179.105:3001/api/v1/room/getRooms");
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