'use client';

import { useEffect } from 'react';
import { useSocket } from '@/src/app/components/providers/SocketEventProvider';
import { toast } from 'sonner';

export function useAdminNotifications() {
    const socket = useSocket();

    useEffect(() => {
        const handleNewReport = (data: { reportedUserId: string; username: string; reason: string }) => {
            toast.warning(`Nuevo reporte contra ${data.username}`, {
                description: `Motivo: ${data.reason}`,
                action: {
                    label: 'Ver',
                    onClick: () => window.location.href = '/admin/reports',
                },
                duration: 8000,
            });
        };

        const handleNewRoom = (data: { roomId: string; name: string; ownerUsername: string }) => {
            toast.info(`Nueva sala creada: ${data.name}`, {
                description: `Por: ${data.ownerUsername}`,
                action: {
                    label: 'Revisar',
                    onClick: () => window.location.href = '/admin/rooms',
                },
                duration: 8000,
            });
        };

        socket.on('admin-new-report', handleNewReport);
        socket.on('admin-room-created', handleNewRoom);

        return () => {
            socket.off('admin-new-report', handleNewReport);
            socket.off('admin-room-created', handleNewRoom);
        };
    }, [socket]);
}
