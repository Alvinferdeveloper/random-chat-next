'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/src/components/ui/sheet';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Badge } from '@/src/components/ui/badge';
import { Separator } from '@/src/components/ui/separator';
import { Hash, AlertTriangle, MessageSquare, Calendar, MapPin, Activity } from 'lucide-react';
import { useAdminUserDetails } from '../hooks/useAdminUserDetails';

interface UserDetailSheetProps {
    userId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const statusLabel: Record<string, string> = {
    PENDING: 'Pendiente',
    RESOLVED: 'Resuelto',
    DISMISSED: 'Desestimado',
};

const fadeUp = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] } },
};

const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.03 } },
};

function DetailSkeleton() {
    return (
        <div className="space-y-6 pb-6 animate-pulse">
            <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-muted shrink-0" />
                <div className="space-y-2 flex-1">
                    <div className="h-6 w-32 bg-muted rounded" />
                    <div className="h-4 w-48 bg-muted rounded" />
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-12 w-full bg-muted rounded-lg" />
            </div>
            <div className="space-y-2">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-12 w-full bg-muted rounded-lg" />
                <div className="h-12 w-full bg-muted rounded-lg" />
            </div>
            <div className="space-y-2">
                <div className="h-4 w-28 bg-muted rounded" />
                <div className="h-12 w-full bg-muted rounded-lg" />
                <div className="h-12 w-full bg-muted rounded-lg" />
            </div>
        </div>
    );
}

export function UserDetailSheet({ userId, open, onOpenChange }: UserDetailSheetProps) {
    const { details, loading, fetchDetails, reset } = useAdminUserDetails();

    useEffect(() => {
        if (userId && open) {
            fetchDetails(userId);
        }
    }, [userId, open, fetchDetails]);

    const handleOpenChange = (open: boolean) => {
        if (!open) reset();
        onOpenChange(open);
    };

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetContent className="w-full sm:max-w-lg flex flex-col overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-100/60 dark:from-zinc-900/90 dark:to-zinc-900/60">
                <SheetHeader className="shrink-0">
                    <SheetTitle>Detalle del Usuario</SheetTitle>
                    <p className="text-sm text-muted-foreground">Informaci&oacute;n completa del perfil y actividad</p>
                </SheetHeader>

                {loading && !details ? (
                    <div className="py-6 pr-4">
                        <DetailSkeleton />
                    </div>
                ) : !details ? null : (
                    <ScrollArea className="flex-1 min-h-0 pr-4">
                        <motion.div
                            initial="hidden"
                            animate="show"
                            variants={stagger}
                            className="space-y-6 pb-6"
                        >
                            {/* Perfil */}
                            <motion.div variants={fadeUp} className="flex items-start gap-4">
                                <Avatar className="h-16 w-16 border shrink-0">
                                    <AvatarImage src={details.user.image || ''} />
                                    <AvatarFallback className="text-lg">{details.user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-xl font-bold truncate">{details.user.username}</h3>
                                        {details.user.role === 'ADMIN' && (
                                            <Badge className="text-[10px] uppercase font-bold bg-amber-500/10 text-amber-600 border-amber-500/20 shrink-0">Admin</Badge>
                                        )}
                                        {details.user.role === 'MODERATOR' && (
                                            <Badge className="text-[10px] uppercase font-bold bg-blue-500/10 text-blue-600 border-blue-500/20 shrink-0">Mod</Badge>
                                        )}
                                        {details.user.isBanned && (
                                            <Badge variant="destructive" className="text-[10px] uppercase font-bold shrink-0">Baneado</Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{details.user.email}</p>
                                    {details.user.name && (
                                        <p className="text-sm">{details.user.name}</p>
                                    )}
                                </div>
                            </motion.div>

                            {details.user.isBanned && details.user.banReason && (
                                <motion.div variants={fadeUp} className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                                    <span><strong>Raz&oacute;n del ban:</strong> {details.user.banReason}</span>
                                </motion.div>
                            )}

                            {/* Bio y detalles */}
                            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
                                {details.user.bio && (
                                    <div className="col-span-2">
                                        <p className="text-xs text-muted-foreground mb-1">Bio</p>
                                        <p className="text-sm">{details.user.bio}</p>
                                    </div>
                                )}
                                {details.user.location && (
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> Ubicaci&oacute;n</p>
                                        <p className="text-sm">{details.user.location}</p>
                                    </div>
                                )}
                                {details.user.ageRange && (
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Rango de edad</p>
                                        <p className="text-sm">{details.user.ageRange.replace('RANGE_', '').replace('_', '-')}</p>
                                    </div>
                                )}
                                {details.user.conversationType && (
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Tipo de conversaci&oacute;n</p>
                                        <p className="text-sm capitalize">{details.user.conversationType.toLowerCase().replace(/_/g, ' ')}</p>
                                    </div>
                                )}
                            </motion.div>

                            {details.user.hobbies.length > 0 && (
                                <motion.div variants={fadeUp}>
                                    <p className="text-xs text-muted-foreground mb-2">Hobbies</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {details.user.hobbies.map(h => (
                                            <Badge key={h.id} variant="secondary" className="text-xs">
                                                {h.icon} {h.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            <motion.div variants={fadeUp}>
                                <Separator />
                            </motion.div>

                            {/* Salas creadas */}
                            <motion.div variants={fadeUp}>
                                <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                                    <Hash className="h-4 w-4 text-muted-foreground" />
                                    Salas Creadas ({details.ownedRooms.length})
                                </h4>
                                {details.ownedRooms.length === 0 ? (
                                    <p className="text-xs text-muted-foreground">No ha creado ninguna sala.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {details.ownedRooms.map(room => (
                                            <div key={room.id} className="flex items-center justify-between p-2.5 border rounded-lg active:scale-[0.99] transition-transform duration-150">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium truncate">{room.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{room.short_description}</p>
                                                </div>
                                                <Badge variant={room.status === 'ACCEPTED' ? 'secondary' : room.status === 'IN_REVISION' ? 'outline' : 'destructive'} className="text-[10px] shrink-0 ml-2">
                                                    {room.status === 'ACCEPTED' ? 'Activa' : room.status === 'IN_REVISION' ? 'Revisi&oacute;n' : 'Rechazada'}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                            <motion.div variants={fadeUp}>
                                <Separator />
                            </motion.div>

                            {/* Actividad reciente */}
                            <motion.div variants={fadeUp}>
                                <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                    Actividad Reciente
                                </h4>
                                {details.recentActivity.length === 0 ? (
                                    <p className="text-xs text-muted-foreground">Sin actividad registrada.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {details.recentActivity.map((act, i) => (
                                            <div key={`${act.roomId}-${i}`} className="flex items-center justify-between p-2.5 border rounded-lg active:scale-[0.99] transition-transform duration-150">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium truncate">{act.room?.name || act.roomId}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {act.interactionCount} interacciones &middot; &Uacute;ltima: {new Date(act.lastInteraction).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                            <motion.div variants={fadeUp}>
                                <Separator />
                            </motion.div>

                            {/* Reportes recibidos */}
                            <motion.div variants={fadeUp}>
                                <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                                    <AlertTriangle className="h-4 w-4 text-destructive" />
                                    Reportes Recibidos ({details.reportsReceived.length})
                                </h4>
                                {details.reportsReceived.length === 0 ? (
                                    <p className="text-xs text-muted-foreground">Sin reportes recibidos.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {details.reportsReceived.slice(0, 10).map(r => (
                                            <div key={r.id} className="p-2.5 border rounded-lg active:scale-[0.99] transition-transform duration-150">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs font-medium">Por: @{r.reporter?.username || 'Desconocido'}</p>
                                                    <Badge variant={r.status === 'PENDING' ? 'destructive' : 'secondary'} className="text-[10px]">
                                                        {statusLabel[r.status] || r.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">{r.reason}{r.room ? ` &middot; Sala: ${r.room.name}` : ''}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        ))}
                                        {details.reportsReceived.length > 10 && (
                                            <p className="text-xs text-muted-foreground text-center">... y {details.reportsReceived.length - 10} m&aacute;s</p>
                                        )}
                                    </div>
                                )}
                            </motion.div>

                            <motion.div variants={fadeUp}>
                                <Separator />
                            </motion.div>

                            {/* Reportes emitidos */}
                            <motion.div variants={fadeUp}>
                                <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                    Reportes Emitidos ({details.reportsMade.length})
                                </h4>
                                {details.reportsMade.length === 0 ? (
                                    <p className="text-xs text-muted-foreground">No ha reportado a nadie.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {details.reportsMade.slice(0, 10).map(r => (
                                            <div key={r.id} className="p-2.5 border rounded-lg active:scale-[0.99] transition-transform duration-150">
                                                <p className="text-xs font-medium">Contra: @{r.reportedUser?.username || 'Desconocido'}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{r.reason}{r.room ? ` &middot; Sala: ${r.room.name}` : ''}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        ))}
                                        {details.reportsMade.length > 10 && (
                                            <p className="text-xs text-muted-foreground text-center">... y {details.reportsMade.length - 10} m&aacute;s</p>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    </ScrollArea>
                )}
            </SheetContent>
        </Sheet>
    );
}
