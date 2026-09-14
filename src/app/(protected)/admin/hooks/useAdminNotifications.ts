'use client';

import { useEffect } from 'react';
import { useSocket } from '@/src/app/components/providers/SocketEventProvider';
import { useTranslation } from '@/src/app/lib/i18n';
import { toast } from 'sonner';

export function useAdminNotifications() {
    const socket = useSocket();
    const { t } = useTranslation();

    useEffect(() => {
        const handleNewReport = (data: { reportedUserId: string; username: string; reason: string }) => {
            toast.warning(t('admin.notifications.new_report', { username: data.username }), {
                description: t('admin.notifications.new_report_reason', { reason: data.reason }),
                action: {
                    label: t('admin.notifications.view'),
                    onClick: () => window.location.href = '/admin/reports',
                },
                duration: 8000,
            });
        };

        // Only actionable while rooms can land in IN_REVISION (manual moderation).
        // While auto-accept is on, every room is created ACCEPTED and there is
        // nothing for the admin to do, so we stay silent.
        const handleNewRoom = (data: { roomId: string; name: string; ownerUsername: string; status: string }) => {
            if (data.status !== 'IN_REVISION') return;

            toast.info(t('admin.notifications.new_room', { name: data.name }), {
                description: t('admin.notifications.new_room_owner', { username: data.ownerUsername }),
                action: {
                    label: t('admin.notifications.review'),
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
    }, [socket, t]);
}
