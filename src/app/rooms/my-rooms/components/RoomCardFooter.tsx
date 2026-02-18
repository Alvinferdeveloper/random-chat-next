import { formatDate } from "@/src/app/utils/date";
import { getRoomStatusConfig } from "@/src/app/utils/ui";
import { Calendar, Edit, Loader2, Trash2 } from "lucide-react";
import { Room } from "@/src/app/rooms/hooks/useRoom";

interface Props {
    room: Room;
    deletingId: string | null;
    handleDelete: (e: React.MouseEvent, roomId: string) => void;
}

export default function RoomCardFooter({ room, deletingId, handleDelete }: Props) {
    const roomStatusConfig = getRoomStatusConfig(room.status);
    return (
        <div className=" rounded-xl border-1 border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden" >

            {/* Header with status and date */}
            < div className="p-5 space-y-4" >
                <div className="flex justify-between items-start" >
                    <div className="flex flex-col" >

                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1" >
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(room.created_at)} </span>
                        </div>
                    </div>

                    < span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${roomStatusConfig.className}`
                    }>
                        {roomStatusConfig.label}
                    </span>
                </div>
            </div>

            {/* Footer with actions */}
            <div className=" px-5 py-3 border-t-2 border-gray-100 flex gap-3" >
                {/* Edit button */}
                <button className="flex-1 flex cursor-pointer items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm" >
                    <Edit className="h-4 w-4" />
                    Editar
                </button>

                {/* Delete button */}
                <button
                    onClick={(e) => handleDelete(e, room.id)}
                    disabled={deletingId === room.id}
                    className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {deletingId === room.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Trash2 className="h-4 w-4" />
                    )}
                    {deletingId === room.id ? "Eliminando..." : "Eliminar"}
                </button>
            </div>
        </div>
    )
}


