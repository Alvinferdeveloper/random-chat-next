'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '@/src/app/components/providers/SocketEventProvider';

export type ReportReason = 'SPAM' | 'HARASSMENT' | 'INAPPROPRIATE_CONTENT' | 'HATE_SPEECH' | 'ANNOYING_BEHAVIOR' | 'OTHER';

interface UseReportUserProps {
    reportedUserId: string;
    roomId?: string;
    onSuccess?: () => void;
}

export function useReportUser({ reportedUserId, roomId, onSuccess }: UseReportUserProps) {
    const socket = useSocket();
    const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
    const [details, setDetails] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSuccess = useCallback((msg: string) => {
        setIsSuccess(true);
        setIsSubmitting(false);
        if (onSuccess) onSuccess();
    }, [onSuccess]);

    const handleError = useCallback((msg: string) => {
        setError(msg);
        setIsSubmitting(false);
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('report-success', handleSuccess);
        socket.on('error', handleError);

        return () => {
            socket.off('report-success', handleSuccess);
            socket.off('error', handleError);
        };
    }, [socket, handleSuccess, handleError]);

    const submitReport = async () => {
        if (!selectedReason || !socket) return;

        setIsSubmitting(true);
        setError(null);

        socket.emit('report-user', {
            reportedUserId,
            reason: selectedReason,
            details: details.trim() || undefined
        });

        // We don't await here as it's an event. Success/Error are handled by listeners.
        return true;
    };

    const reset = () => {
        setSelectedReason(null);
        setDetails('');
        setIsSuccess(false);
        setError(null);
    };

    return {
        selectedReason,
        setSelectedReason,
        details,
        setDetails,
        isSubmitting,
        isSuccess,
        error,
        submitReport,
        reset
    };
}

