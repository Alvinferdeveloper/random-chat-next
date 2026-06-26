'use client';

import { Activity, Hash, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

interface ActiveRoom {
    id: string;
    name: string;
    normalized_name: string;
    short_description: string;
    server_icon: string | null;
    userCount: number;
}

export default function ActiveRoomsList({ rooms, loading }: { rooms: ActiveRoom[]; loading: boolean }) {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold tracking-tight">{t('admin.active_rooms.title')}</h2>
                {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                {!loading && (
                    <span className="text-xs text-muted-foreground tabular-nums">{t('admin.active_rooms.count', { count: rooms.length })}</span>
                )}
            </div>

            {loading ? (
                <div className="border rounded-xl divide-y divide-border overflow-hidden">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-muted animate-pulse" />
                                <div className="space-y-1.5">
                                    <div className="h-4 w-36 bg-muted rounded animate-pulse" />
                                    <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                                </div>
                            </div>
                            <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            ) : rooms.length === 0 ? (
                <div className="border rounded-xl p-10 text-center">
                    <Activity className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">{t('admin.active_rooms.empty')}</p>
                </div>
            ) : (
                <div className="border rounded-xl divide-y divide-border overflow-hidden">
                    {rooms.map((room, i) => (
                        <Link
                            key={room.id}
                            href={`/chat/${room.id}`}
                            className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors duration-150 active:scale-[0.99]"
                            style={{ animationDelay: `${i * 30}ms` }}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                {room.server_icon ? (
                                    <Image
                                        src={room.server_icon}
                                        alt={room.name}
                                        width={32}
                                        height={32}
                                        className="rounded-lg object-cover shrink-0"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <Hash className="h-4 w-4 text-primary" />
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">{room.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{room.short_description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm shrink-0 ml-4">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                                </span>
                                <span className="font-semibold tabular-nums text-muted-foreground">{room.userCount}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
