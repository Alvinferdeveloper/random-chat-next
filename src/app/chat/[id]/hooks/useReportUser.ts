'use client';

import { useState } from 'react';

export type ReportReason = 'SPAM' | 'HARASSMENT' | 'INAPPROPRIATE_CONTENT' | 'HATE_SPEECH' | 'ANNOYING_BEHAVIOR' | 'OTHER';

interface UseReportUserProps {
    reportedUserId: string;
    roomId?: string;
    onSuccess?: () => void;
}

export function useReportUser({ reportedUserId, roomId, onSuccess }: UseReportUserProps) {
    const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
    const [details, setDetails] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submitReport = async () => {
        if (!selectedReason) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/reports`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reportedUserId,
                    roomId,
                    reason: selectedReason,
                    details: details.trim() || undefined
                }),
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al enviar el reporte');
            }

            setIsSuccess(true);
            if (onSuccess) onSuccess();

            return true;
        } catch (err) {
            setError((err as Error).message);
            return false;
        } finally {
            setIsSubmitting(false);
        }
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
