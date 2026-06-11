'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Activity, Users, MessageSquare, Loader2 } from 'lucide-react';
import { useAdminStats } from './hooks/useAdminStats';

export default function AdminDashboard() {
    const { stats, loading } = useAdminStats();

    const statsCards = [
        {
            title: "Usuarios Totales",
            value: stats?.totalUsers,
            icon: Users,
            description: "Registrados en la plataforma"
        },
        {
            title: "Salas Activas",
            value: stats?.activeRooms,
            icon: Activity,
            description: "Visibles al público"
        },
        {
            title: "Salas Pendientes",
            value: stats?.pendingRooms,
            icon: MessageSquare,
            description: "Requieren revisión",
            highlight: (stats?.pendingRooms ?? 0) > 0
        }
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {statsCards.map((card, index) => (
                    <Card key={index} className={card.highlight ? "border-primary/50 bg-primary/5" : ""}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {card.title}
                            </CardTitle>
                            <card.icon className={`h-4 w-4 ${card.highlight ? "text-primary" : "text-muted-foreground"}`} />
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            ) : (
                                <div className="text-2xl font-bold">{card.value ?? 0}</div>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                                {card.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
