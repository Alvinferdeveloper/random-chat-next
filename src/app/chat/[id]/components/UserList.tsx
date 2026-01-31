'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { motion, AnimatePresence } from 'framer-motion';
import { useSocketHandler } from "@/src/app/hooks/useSocketHandler";
import { useUsername } from "@/src/app/hooks/useUsername";

interface User {
    id: string;
    username: string;
    profileImage?: string;
}

interface UserListProps {
    users: User[];
}

const TypingDots = () => {
    const dotVariants = {
        initial: { y: 0 },
        animate: { y: -3 }
    };

    const dotTransition = {
        duration: 0.4,
        repeat: Infinity,
        repeatType: "reverse" as const
    };

    return (
        <div className="flex gap-0.5 items-end h-3 mb-0.5 ml-1">
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="w-1 h-1 bg-emerald-500 rounded-full"
                    variants={dotVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ ...dotTransition, delay: i * 0.1 }}
                />
            ))}
        </div>
    );
};

export function UserList({ users }: UserListProps) {
    const username = useUsername();
    const { typingUsers } = useSocketHandler(username);

    const getInitials = (name: string) => {
        return name.charAt(0).toUpperCase();
    };

    return (
        <div className="bg-muted/40 border-l border-border h-full p-4 flex flex-col gap-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
                Participantes
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {users.length}
                </span>
            </h2>

            <div className="flex flex-col gap-2 overflow-y-auto scrollbar-thin-light pr-1">
                <AnimatePresence mode="popLayout">
                    {users.map((user, index) => {
                        const isTyping = typingUsers.has(user.username);

                        return (
                            <motion.div
                                key={user.id}
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0, transition: { delay: index * 0.05 } }}
                                exit={{ opacity: 0, x: 10 }}
                                className={`
                                    group flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200
                                    ${isTyping ? 'bg-emerald-500/5 hover:bg-emerald-500/10' : 'hover:bg-muted/60'}
                                `}
                            >
                                <div className="relative">
                                    <Avatar className="h-10 w-10 border border-background shadow-sm">
                                        <AvatarImage
                                            src={user.profileImage || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.username}`}
                                            alt={`${user.username}'s profile picture`}
                                        />
                                        <AvatarFallback className="bg-primary/5 text-primary">
                                            {getInitials(user.username)}
                                        </AvatarFallback>
                                    </Avatar>
                                    {/* Indicador de estado online (opcional, visual) */}
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                                </div>

                                <div className="flex flex-col justify-center min-w-0 flex-1">
                                    <span className="font-semibold text-sm truncate leading-none mb-1">
                                        {user.username}
                                    </span>

                                    <div className="h-4 flex items-center">
                                        <AnimatePresence mode="wait">
                                            {isTyping ? (
                                                <motion.div
                                                    key="typing"
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -5 }}
                                                    className="flex items-center text-xs text-emerald-600 font-medium"
                                                >
                                                    <span>Escribiendo</span>
                                                    <TypingDots />
                                                </motion.div>
                                            ) : (
                                                <motion.span
                                                    key="idle"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="text-xs text-muted-foreground/70 truncate"
                                                >
                                                    En línea
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}