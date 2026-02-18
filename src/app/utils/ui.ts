import { RoomStatus } from "@/src/app/rooms/hooks/useRoom";

const ROOM_STATUS_CONFIG = {
    IN_REVISION: {
        className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        label: 'En revisión',
    },
    ACCEPTED: {
        className: 'bg-green-100 text-green-700 border-green-200',
        label: 'Aceptado',
    },
    REJECTED: {
        className: 'bg-red-100 text-red-700 border-red-200',
        label: 'Rechazado',
    },
} satisfies Record<RoomStatus, { className: string; label: string }>;

export const getRoomStatusConfig = (status: RoomStatus) => {
    return ROOM_STATUS_CONFIG[status];
};
