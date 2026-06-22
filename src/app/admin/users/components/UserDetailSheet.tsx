'use client';

import { useEffect } from 'react';
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
import { Loader2, Hash, AlertTriangle, MessageSquare, Calendar, MapPin } from 'lucide-react';
import { useAdminUserDetails } from '../hooks/useAdminUserDetails';

interface UserDetailSheetProps {
    userId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
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
            <SheetContent className="w-full sm:max-w-lg overflow-hidden flex flex-col">
                <SheetHeader className="shrink-0">
                    <SheetTitle>Detalle del Usuario</SheetTitle>
                    <p className="text-sm text-muted-foreground">Información completa del perfil y actividad</p>
                </SheetHeader>

                {loading && !details ? (
                    <div className="flex items-center justify-center py-20 gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Cargando detalles...</p>
                    </div>
                ) : !details ? null : (
                    <ScrollArea className="flex-1 pr-4">
                        <div className="space-y-6 py-4">
                            {/* Perfil */}
                            <div className="flex items-start gap-4">
                                <Avatar className="h-16 w-16 border">
                                    <AvatarImage src={details.user.image || ''} />
                                    <AvatarFallback className="text-lg">{details.user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-xl font-bold">{details.user.username}</h3>
                                        {details.user.role === 'ADMIN' && (
                                            <Badge className="text-[10px] uppercase font-bold bg-amber-500/10 text-amber-600 border-amber-500/20">Admin</Badge>
                                        )}
                                        {details.user.role === 'MODERATOR' && (
                                            <Badge className="text-[10px] uppercase font-bold bg-blue-500/10 text-blue-600 border-blue-500/20">Mod</Badge>
                                        )}
                                        {details.user.isBanned && (
                                            <Badge variant="destructive" className="text-[10px] uppercase font-bold">Baneado</Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{details.user.email}</p>
                                    {details.user.name && (
                                        <p className="text-sm">{details.user.name}</p>
                                    )}
                                </div>
                            </div>

                            {details.user.isBanned && details.user.banReason && (
                                <div className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                                    <span><strong>Razón del ban:</strong> {details.user.banReason}</span>
                                </div>
                            )}

                            {/* Bio y detalles */}
                            <div className="grid grid-cols-2 gap-3">
                                {details.user.bio && (
                                    <div className="col-span-2">
                                        <p className="text-xs text-muted-foreground mb-1">Bio</p>
                                        <p className="text-sm">{details.user.bio}</p>
                                    </div>
                                )}
                                {details.user.location && (
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> Ubicación</p>
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
                                        <p className="text-xs text-muted-foreground mb-1">Tipo de conversación</p>
                                        <p className="text-sm capitalize">{details.user.conversationType.toLowerCase().replace(/_/g, ' ')}</p>
                                    </div>
                                )}
                            </div>

                            {details.user.hobbies.length > 0 && (
                                <div>
                                    <p className="text-xs text-muted-foreground mb-2">Hobbies</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {details.user.hobbies.map(h => (
                                            <Badge key={h.id} variant="secondary" className="text-xs">
                                                {h.icon} {h.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Separator />

                            {/* Salas creadas */}
                            <div>
                                <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                                    <Hash className="h-4 w-4 text-muted-foreground" />
                                    Salas Creadas ({details.ownedRooms.length})
                                </h4>
                                {details.ownedRooms.length === 0 ? (
                                    <p className="text-xs text-muted-foreground">No ha creado ninguna sala.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {details.ownedRooms.map(room => (
                                            <div key={room.id} className="flex items-center justify-between p-2 border rounded-lg">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium truncate">{room.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{room.short_description}</p>
                                                </div>
                                                <Badge variant={room.status === 'ACCEPTED' ? 'secondary' : room.status === 'IN_REVISION' ? 'outline' : 'destructive'} className="text-[10px] shrink-0 ml-2">
                                                    {room.status === 'ACCEPTED' ? 'Activa' : room.status === 'IN_REVISION' ? 'Revisión' : 'Rechazada'}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Separator />

                            {/* Actividad reciente */}
                            <div>
                                <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                                    <ActivityIcon className="h-4 w-4 text-muted-foreground" />
                                    Actividad Reciente
                                </h4>
                                {details.recentActivity.length === 0 ? (
                                    <p className="text-xs text-muted-foreground">Sin actividad registrada.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {details.recentActivity.map((act, i) => (
                                            <div key={`${act.roomId}-${i}`} className="flex items-center justify-between p-2 border rounded-lg">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium truncate">{act.room?.name || act.roomId}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {act.interactionCount} interacciones · Última: {new Date(act.lastInteraction).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Separator />

                            {/* Reportes recibidos */}
                            <div>
                                <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                                    <AlertTriangle className="h-4 w-4 text-destructive" />
                                    Reportes Recibidos ({details.reportsReceived.length})
                                </h4>
                                {details.reportsReceived.length === 0 ? (
                                    <p className="text-xs text-muted-foreground">Sin reportes recibidos.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {details.reportsReceived.slice(0, 10).map(r => (
                                            <div key={r.id} className="p-2 border rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs font-medium">Por: @{r.reporter?.username || 'Desconocido'}</p>
                                                    <Badge variant={r.status === 'PENDING' ? 'destructive' : 'secondary'} className="text-[10px]">
                                                        {r.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">{r.reason}{r.room ? ` · Sala: ${r.room.name}` : ''}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        ))}
                                        {details.reportsReceived.length > 10 && (
                                            <p className="text-xs text-muted-foreground text-center">... y {details.reportsReceived.length - 10} más</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <Separator />

                            {/* Reportes emitidos */}
                            <div>
                                <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                    Reportes Emitidos ({details.reportsMade.length})
                                </h4>
                                {details.reportsMade.length === 0 ? (
                                    <p className="text-xs text-muted-foreground">No ha reportado a nadie.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {details.reportsMade.slice(0, 10).map(r => (
                                            <div key={r.id} className="p-2 border rounded-lg">
                                                <p className="text-xs font-medium">Contra: @{r.reportedUser?.username || 'Desconocido'}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{r.reason}{r.room ? ` · Sala: ${r.room.name}` : ''}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        ))}
                                        {details.reportsMade.length > 10 && (
                                            <p className="text-xs text-muted-foreground text-center">... y {details.reportsMade.length - 10} más</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </ScrollArea>
                )}
            </SheetContent>
        </Sheet>
    );
}

function ActivityIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
    );
}
