'use client';

import { useState } from 'react';
import { useAdminRooms } from './hooks/useAdminRooms';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Check, X, Loader2 } from 'lucide-react';
import { Badge } from '@/src/components/ui/badge';
import { ConfirmDialog } from '@/src/app/components/shared/ConfirmDialog';
import { toast } from 'sonner';

export default function PendingRoomsPage() {
    const { rooms, loading, error, updateStatus } = useAdminRooms('IN_REVISION');
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [actionData, setActionData] = useState<{ id: string, status: 'ACCEPTED' | 'REJECTED' } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleActionClick = (roomId: string, status: 'ACCEPTED' | 'REJECTED') => {
        setActionData({ id: roomId, status });
        setIsConfirmOpen(true);
    };

    const handleConfirmAction = async () => {
        if (!actionData) return;
        setIsSubmitting(true);
        const success = await updateStatus(actionData.id, actionData.status);
        if (success) {
            toast.success(actionData.status === 'ACCEPTED' ? 'Sala aceptada.' : 'Sala rechazada.');
        }
        setIsSubmitting(false);
        setIsConfirmOpen(false);
        setActionData(null);
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Salas Pendientes de Revisión</h1>
                <Badge variant="outline" className="text-lg px-4 py-1">
                    {rooms.length} pendientes
                </Badge>
            </div>

            {rooms.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
                    <p className="text-muted-foreground text-lg">No hay salas pendientes de revisión en este momento.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {rooms.map((room) => (
                        <Card key={room.id} className="flex flex-col h-full bg-[#2f3136] border-none text-white overflow-hidden shadow-lg transition-all hover:shadow-xl">
                            <div className="relative h-48 w-full bg-muted">
                                {room.server_banner ? (
                                    <img
                                        src={room.server_banner}
                                        alt={room.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center bg-gray-700 text-gray-400">
                                        Sin Banner
                                    </div>
                                )}
                                <div className="absolute -bottom-6 left-6 h-16 w-16 overflow-hidden rounded-full border-4 border-[#2f3136] bg-background">
                                    {room.server_icon ? (
                                        <img
                                            src={room.server_icon}
                                            alt={room.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center bg-primary text-primary-foreground font-bold">
                                            {room.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <CardHeader className="mt-6">
                                <CardTitle className="flex items-center justify-between text-xl">
                                    {room.name}
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Creado por: <span className="text-blue-400 font-medium">@{room.owner?.username || 'Desconocido'}</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-300">Descripción Corta</h4>
                                    <p className="text-sm text-gray-400">{room.short_description}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-300">Descripción Completa</h4>
                                    <p className="text-sm text-gray-400 line-clamp-4">{room.full_description}</p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between gap-3 pt-4 border-t border-gray-700 bg-[#292b2f]">
                                <Button
                                    variant="destructive"
                                    className="flex-1 gap-2 bg-red-600 hover:bg-red-700 text-white"
                                    onClick={() => handleActionClick(room.id, 'REJECTED')}
                                    disabled={isSubmitting}
                                >
                                    <X className="h-4 w-4" />
                                    Rechazar
                                </Button>
                                <Button
                                    className="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => handleActionClick(room.id, 'ACCEPTED')}
                                    disabled={isSubmitting}
                                >
                                    <Check className="h-4 w-4" />
                                    Aceptar
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            <ConfirmDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmAction}
                title={actionData?.status === 'ACCEPTED' ? 'Aceptar Sala' : 'Rechazar Sala'}
                description={`¿Estás seguro de que deseas ${actionData?.status === 'ACCEPTED' ? 'aceptar' : 'rechazar'} esta sala?`}
                confirmText={actionData?.status === 'ACCEPTED' ? 'Aceptar' : 'Rechazar'}
                variant={actionData?.status === 'ACCEPTED' ? 'primary' : 'destructive'}
                isLoading={isSubmitting}
            />
        </div>
    );
}
