'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { motion, AnimatePresence } from 'framer-motion';
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { Flag } from 'lucide-react';
import { useState } from 'react';
import { ReportUserDialog } from './ReportUserDialog';
import { Button } from '@/src/components/ui/button';
import { useTranslation } from 'react-i18next';

interface User {
    id: string;
    username: string;
    profileImage?: string;
}

interface UserListProps {
    users: User[];
    typingUsers: Set<string>;
    roomId?: string;
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

export function UserList({ users, typingUsers, roomId }: UserListProps) {
    const { t } = useTranslation();
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const [userToReport, setUserToReport] = useState<{ id: string, username: string } | null>(null);

    const handleReportClick = (e: React.MouseEvent, user: User) => {
        e.preventDefault();
        e.stopPropagation();
        setUserToReport({ id: user.id, username: user.username });
        setReportDialogOpen(true);
    };

    const getInitials = (name: string) => {
        return name.charAt(0).toUpperCase();
    };

    return (
        <div className="bg-muted/40 border-l border-border h-full p-4 flex flex-col gap-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
                {t('chat.user_list.title')}
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {users.length}
                </span>
            </h2>

            <div className="flex flex-col gap-2 overflow-y-auto scrollbar-thin-light pr-1">
                <AnimatePresence mode="popLayout">
                    {users.map((user, index) => {
                        const isTyping = typingUsers.has(user.username);
                        const isAnonymous = user.id === user.username;

                        const userContent = (
                            <motion.div
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0, transition: { delay: index * 0.05 } }}
                                exit={{ opacity: 0, x: 10 }}
                                className={cn(
                                    "group flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200",
                                    !isAnonymous && "cursor-pointer hover:bg-muted/60",
                                    isTyping && "bg-emerald-500/5 hover:bg-emerald-500/10"
                                )}
                            >
                                <div className="relative">
                                    <Avatar className="h-10 w-10 border border-background shadow-sm transition-transform group-hover:scale-105">
                                        <AvatarImage
                                            src={user.profileImage || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.username}`}
                                            alt={`${user.username}'s profile picture`}
                                        />
                                        <AvatarFallback className="bg-primary/5 text-primary">
                                            {getInitials(user.username)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                                </div>

                                <div className="flex flex-col justify-center min-w-0 flex-1">
                                    <span className={cn(
                                        "font-semibold text-sm truncate leading-none mb-1 transition-colors",
                                        !isAnonymous && "group-hover:text-primary"
                                    )}>
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
                                                    <span>{t('chat.user_list.typing')}</span>
                                                    <TypingDots />
                                                </motion.div>
                                            ) : (
                                                <motion.span
                                                    key="idle"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="text-xs text-muted-foreground/70 truncate"
                                                >
                                                    {isAnonymous ? t('chat.user_list.guest') : t('chat.user_list.view_profile')}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {!isAnonymous && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                                        onClick={(e) => handleReportClick(e, user)}
                                    >
                                        <Flag className="w-4 h-4" />
                                    </Button>
                                )}
                            </motion.div>
                        );

                        if (isAnonymous) {
                            return <div key={user.id}>{userContent}</div>;
                        }

                        return (
                            <Link key={user.id} href={`/profile/${encodeURIComponent(user.username)}`}>
                                {userContent}
                            </Link>
                        );
                    })}
                </AnimatePresence>
            </div>

            <ReportUserDialog
                isOpen={reportDialogOpen}
                onClose={() => setReportDialogOpen(false)}
                reportedUsername={userToReport?.username || ''}
                reportedUserId={userToReport?.id || ''}
                roomId={roomId}
            />
        </div>
    );
}
