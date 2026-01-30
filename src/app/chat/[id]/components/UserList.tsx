'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { motion, AnimatePresence } from 'framer-motion';
import { User } from 'lucide-react';

interface User {
    id: string;
    username: string;
    profileImage?: string;
}

interface UserListProps {
    users: User[];
}

export function UserList({ users }: UserListProps) {

    const getInitials = (name: string) => {
        return name.charAt(0).toUpperCase();
    };

    return (
        <div className="bg-muted/40 border-l border-border h-full p-4 flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Participantes ({users.length})</h2>
            <div className="flex flex-col gap-3 overflow-y-auto scrollbar-thin-light">
                <AnimatePresence>
                    {users.map((user, index) => (
                        <motion.div
                            key={user.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0, transition: { delay: index * 0.05 } }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/60 transition-colors"
                        >
                            <Avatar className="h-9 w-9">
                                <AvatarImage
                                    src={user.profileImage || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.username}`}
                                    alt={`${user.username}'s profile picture`}
                                />
                                <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium truncate">{user.username}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
