'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { motion } from 'framer-motion';

interface User {
    id: string;
    username: string;
    profileImage?: string;
}

interface MentionListProps {
    users: User[];
    query: string;
    onSelect: (username: string) => void;
}

export function MentionList({ users, query, onSelect }: MentionListProps) {
    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().startsWith(query.toLowerCase())
    );

    if (filteredUsers.length === 0) {
        return null;
    }
    
    const getInitials = (name: string) => {
        return name.charAt(0).toUpperCase();
    };

    return (
        <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-2 w-full bg-background border rounded-lg shadow-lg max-h-48 overflow-y-auto scrollbar-thin-light z-20"
        >
            <ul className="p-1">
                {filteredUsers.map(user => (
                    <li
                        key={user.id}
                        onClick={() => onSelect(user.username)}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer"
                    >
                        <Avatar className="h-7 w-7">
                            <AvatarImage src={user.profileImage} alt={`${user.username}'s profile picture`} />
                            <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.username}</span>
                    </li>
                ))}
            </ul>
        </motion.div>
    );
}
