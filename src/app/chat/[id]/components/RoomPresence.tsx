"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";

interface User {
    id: string;
    username: string;
    profileImage?: string;
}

interface RoomPresenceProps {
    users: User[];
    onClick?: () => void;
    maxVisible?: number;
}

/**
 * A compact stack of overlapping avatars for "who's here right now", instead
 * of a bare participant count - reuses the same avatar/initials convention
 * as the rest of the chat (ChatMessage, UserList).
 */
export function RoomPresence({ users, onClick, maxVisible = 3 }: RoomPresenceProps) {
    if (users.length === 0) return null;

    const visibleUsers = users.slice(0, maxVisible);

    return (
        <button
            onClick={onClick}
            className="hidden sm:flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95 shrink-0"
        >
            <div className="flex items-center -space-x-2">
                {visibleUsers.map((user) => (
                    <Avatar key={user.id} className="h-6 w-6 border-2 border-background">
                        <AvatarImage
                            src={user.profileImage || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.username}`}
                            alt={user.username}
                        />
                        <AvatarFallback className="text-[9px]">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                ))}
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full tabular-nums">
                {users.length}
            </span>
        </button>
    );
}
