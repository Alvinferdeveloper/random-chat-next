'use client';

import { Card } from '@/src/components/ui/card';
import { Users, UserPlus, MessageSquare, AlertCircle, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface LiveStats {
    onlineUsers: number;
    totalUsers: number;
    newUsersToday: number;
    pendingReports: number;
    activeRooms: number;
    pendingRooms: number;
}

interface StatCard {
    label: string;
    value: number | undefined;
    icon: LucideIcon;
    color: string;
    bg: string;
}

const nf = (n?: number) => (n ?? 0).toLocaleString('es-ES');

const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] } },
};

const cardGradient = 'bg-gradient-to-br from-card to-muted/30 dark:from-zinc-900/90 dark:to-zinc-900/60';

export default function SecondaryStats({ stats, loading }: { stats: LiveStats | null; loading: boolean }) {
    const cards: StatCard[] = [
        { label: 'Usuarios Totales', value: stats?.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        {
            label: 'Nuevos Hoy', value: stats?.newUsersToday, icon: UserPlus,
            color: (stats?.newUsersToday ?? 0) > 0 ? 'text-emerald-500' : 'text-muted-foreground',
            bg: (stats?.newUsersToday ?? 0) > 0 ? 'bg-emerald-500/10' : 'bg-muted/50',
        },
        {
            label: 'Salas Pendientes', value: stats?.pendingRooms, icon: MessageSquare,
            color: (stats?.pendingRooms ?? 0) > 0 ? 'text-amber-500' : 'text-muted-foreground',
            bg: (stats?.pendingRooms ?? 0) > 0 ? 'bg-amber-500/10' : 'bg-muted/50',
        },
        {
            label: 'Reportes Pendientes', value: stats?.pendingReports, icon: AlertCircle,
            color: (stats?.pendingReports ?? 0) > 0 ? 'text-red-500' : 'text-muted-foreground',
            bg: (stats?.pendingReports ?? 0) > 0 ? 'bg-red-500/10' : 'bg-muted/50',
        },
    ];

    return (
        <motion.div initial="hidden" animate="show" variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => (
                <motion.div key={card.label} variants={fadeUp}>
                    <Card className={`p-5 active:scale-[0.98] transition-transform duration-150 ease-out ${cardGradient}`}>
                        {loading ? (
                            <div className="space-y-3">
                                <div className="h-8 w-8 bg-muted rounded-lg animate-pulse" />
                                <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                                <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.bg}`}>
                                    <card.icon className={`h-4 w-4 ${card.color}`} />
                                </div>
                                <div>
                                    <div className="text-xl font-bold tracking-tight">{nf(card.value)}</div>
                                    <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
                                </div>
                            </div>
                        )}
                    </Card>
            </motion.div>
                ))}
            </motion.div>
    );
}
