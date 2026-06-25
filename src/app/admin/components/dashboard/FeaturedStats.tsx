'use client';

import { Card } from '@/src/components/ui/card';
import { Activity, Hash, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';

interface LiveStats {
    onlineUsers: number;
    totalUsers: number;
    newUsersToday: number;
    pendingReports: number;
    activeRooms: number;
    pendingRooms: number;
}

const nf = (n?: number) => (n ?? 0).toLocaleString('es-ES');

export default function FeaturedStats({ stats, loading }: { stats: LiveStats | null; loading: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
            <Card className="overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-100/60 dark:from-zinc-900/90 dark:to-zinc-900/60">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                    <div className="p-6 lg:p-8">
                        {loading ? (
                            <div className="space-y-3">
                                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                                <div className="h-8 w-32 bg-muted rounded animate-pulse" />
                                <div className="h-3 w-36 bg-muted rounded animate-pulse" />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                                    </span>
                                    <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">En Vivo</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl lg:text-4xl font-bold tracking-tight">{nf(stats?.onlineUsers)}</span>
                                    <Wifi className="h-5 w-5 text-green-500" />
                                </div>
                                <p className="text-sm text-muted-foreground">usuarios conectados ahora mismo</p>
                            </div>
                        )}
                    </div>
                    <div className="p-6 lg:p-8">
                        {loading ? (
                            <div className="space-y-3">
                                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                                <div className="h-8 w-20 bg-muted rounded animate-pulse" />
                                <div className="h-3 w-36 bg-muted rounded animate-pulse" />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">Actividad</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl lg:text-4xl font-bold tracking-tight">{nf(stats?.activeRooms)}</span>
                                    <Activity className="h-5 w-5 text-primary" />
                                </div>
                                <p className="text-sm text-muted-foreground">salas activas en la plataforma</p>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
