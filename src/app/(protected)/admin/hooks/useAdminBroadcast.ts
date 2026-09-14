'use client';

import { useState } from 'react';
import { useTranslation } from '@/src/app/lib/i18n';

export function useAdminBroadcast() {
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendBroadcast = async (message: string) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/broadcast`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
                credentials: 'include'
            });

            const data = await response.json();
            if (!response.ok) throw new Error(t(data.message || 'Error sending the announcement'));

            return true;
        } catch (err) {
            setError((err as Error).message);
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    return { sendBroadcast, isSubmitting, error };
}
