'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Activity, Users, MessageSquare, Loader2, Megaphone, Send, UserPlus, AlertCircle, Hash } from 'lucide-react';
import { useAdminLiveStats } from './hooks/useAdminLiveStats';
import { useAdminTopActiveRooms } from './hooks/useAdminTopActiveRooms';
import { useAdminBroadcast } from './hooks/useAdminBroadcast';
import { useAdminSettings } from './hooks/useAdminSettings';
import { Button } from '@/src/components/ui/button';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter 
} from '@/src/components/ui/dialog';
import { Textarea } from '@/src/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminDashboard() {
    const { stats, loading } = useAdminLiveStats();
    const { rooms: activeRooms, loading: loadingActiveRooms } = useAdminTopActiveRooms();
    const { sendBroadcast, isSubmitting, error: broadcastError } = useAdminBroadcast();
    const { settings, loading: settingsLoading, updateSetting } = useAdminSettings();
    const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
    const [broadcastMsg, setBroadcastMsg] = useState('');

    const handleToggleSetting = async (key: string, currentValue: string) => {
        const newValue = currentValue === 'true' ? 'false' : 'true';
        const success = await updateSetting(key, newValue);
        if (success) {
            toast.success(`Configuración actualizada correctamente.`);
        } else {
            toast.error('Error al actualizar la configuración.');
        }
    };

    const handleSendBroadcast = async () => {
        if (!broadcastMsg.trim()) return;
        const success = await sendBroadcast(broadcastMsg);
        if (success) {
            setIsBroadcastOpen(false);
            setBroadcastMsg('');
            toast.success('Anuncio enviado correctamente a todas las salas.');
        }
    };

    const liveStatCards = [
        {
            title: "Usuarios Online",
            value: stats?.onlineUsers,
            icon: Activity,
            description: "Conectados ahora mismo",
            live: true,
        },
        {
            title: "Usuarios Totales",
            value: stats?.totalUsers,
            icon: Users,
            description: "Registrados en la plataforma",
        },
        {
            title: "Nuevos Hoy",
            value: stats?.newUsersToday,
            icon: UserPlus,
            description: "Registrados hoy",
            highlight: (stats?.newUsersToday ?? 0) > 0,
        },
        {
            title: "Salas Activas",
            value: stats?.activeRooms,
            icon: Hash,
            description: "Visibles al público",
        },
        {
            title: "Salas Pendientes",
            value: stats?.pendingRooms,
            icon: MessageSquare,
            description: "Requieren revisión",
            highlight: (stats?.pendingRooms ?? 0) > 0,
        },
        {
            title: "Reportes Pendientes",
            value: stats?.pendingReports,
            icon: AlertCircle,
            description: "Esperando revisión",
            highlight: (stats?.pendingReports ?? 0) > 0,
        },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {liveStatCards.map((card, index) => (
                    <Card key={index} className={card.highlight ? "border-primary/50 bg-primary/5" : ""}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {card.title}
                            </CardTitle>
                            <card.icon className={`h-4 w-4 ${card.highlight ? "text-primary" : "text-muted-foreground"} ${card.live ? "animate-pulse" : ""}`} />
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            ) : (
                                <div className={`text-2xl font-bold ${card.live ? "text-green-500" : ""}`}>
                                    {card.value ?? 0}
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                                {card.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Salas más activas en vivo */}
            <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Salas Más Activas</h2>
                    {loadingActiveRooms && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                </div>
                <Card>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {activeRooms.length === 0 && !loadingActiveRooms && (
                                <p className="text-sm text-muted-foreground p-6 text-center">
                                    No hay usuarios activos en ninguna sala.
                                </p>
                            )}
                            {activeRooms.map((room) => (
                                <Link
                                    key={room.id}
                                    href={`/chat/${room.id}`}
                                    className="flex items-center justify-between p-4 hover:bg-secondary/10 transition-colors"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        {room.server_icon ? (
                                            <Image
                                                src={room.server_icon}
                                                alt={room.name}
                                                width={32}
                                                height={32}
                                                className="rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Hash className="h-4 w-4 text-primary" />
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <p className="font-medium truncate">{room.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{room.short_description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm shrink-0 ml-4">
                                        <Activity className="h-4 w-4 text-green-500" />
                                        <span className="font-semibold tabular-nums">{room.userCount}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Acciones Rápidas</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="hover:bg-secondary/10 transition-colors cursor-pointer group" onClick={() => setIsBroadcastOpen(true)}>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Megaphone className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Anuncio Global</CardTitle>
                                <CardDescription>Enviar mensaje a todos los usuarios</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                </div>
            </div>

            {/* Ajustes Globales del Sistema */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Ajustes del Sistema</h2>
                {settingsLoading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {settings.map((setting) => (
                            <Card key={setting.key} className="flex flex-col justify-between">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between gap-4">
                                        <CardTitle className="text-lg capitalize font-semibold">
                                            {setting.key.replace(/_/g, ' ')}
                                        </CardTitle>
                                        <Button
                                            size="sm"
                                            variant={setting.value === 'true' ? "default" : "secondary"}
                                            onClick={() => handleToggleSetting(setting.key, setting.value)}
                                            className="rounded-full px-4"
                                        >
                                            {setting.value === 'true' ? 'Activo' : 'Desactivado'}
                                        </Button>
                                    </div>
                                    <CardDescription className="mt-2 text-sm">
                                        {setting.description || 'Sin descripción'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0 text-xs text-muted-foreground">
                                    Última actualización: {setting.updatedAt ? new Date(setting.updatedAt).toLocaleString() : 'N/A'}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <Dialog open={isBroadcastOpen} onOpenChange={setIsBroadcastOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Megaphone className="h-5 w-5 text-primary" />
                            Enviar Anuncio del Sistema
                        </DialogTitle>
                        <DialogDescription>
                            Este mensaje aparecerá instantáneamente en todas las salas de chat activas. Úsalo con responsabilidad.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-3">
                        {broadcastError && (
                            <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-lg">
                                {broadcastError}
                            </div>
                        )}
                        <Textarea 
                            placeholder="Escribe el mensaje del sistema aquí..."
                            className="min-h-[120px] resize-none rounded-xl"
                            value={broadcastMsg}
                            onChange={(e) => setBroadcastMsg(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsBroadcastOpen(false)} disabled={isSubmitting} className="rounded-xl">
                            Cancelar
                        </Button>
                        <Button onClick={handleSendBroadcast} disabled={isSubmitting || !broadcastMsg.trim()} className="gap-2 rounded-xl">
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            Enviar Anuncio
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}