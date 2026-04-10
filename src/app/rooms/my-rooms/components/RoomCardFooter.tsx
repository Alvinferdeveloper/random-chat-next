import { formatDate } from "@/src/app/utils/date";
import { getRoomStatusConfig } from "@/src/app/utils/ui";
import { Calendar } from "lucide-react";
import { Room } from "@/src/app/rooms/hooks/useRoom";
import { cn } from "@/src/lib/utils";

interface Props {
    room: Room;
}

export default function RoomCardFooter({ room }: Props) {
    const roomStatusConfig = getRoomStatusConfig(room.status);
    
    return (
        <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-gray-400">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(room.created_at)}</span>
            </div>

            <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase",
                roomStatusConfig.className
            )}>
                {roomStatusConfig.label}
            </span>
        </div>
    );
}
