'use client';

import { useState, useEffect } from 'react';

export interface GlobalSetting {
    key: string;
    value: string;
    description?: string;
    updatedAt: string;
}

export function useAdminSettings() {
    const [settings, setSettings] = useState<GlobalSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/settings`, {
                credentials: 'include',
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Error al obtener la configuración global');

            if (data && Array.isArray(data.settings)) {
                setSettings(data.settings);
            } else if (data && typeof data.settings === 'object') {
                const arr = Object.entries(data.settings).map(([key, value]) => ({
                    key,
                    value: typeof value === 'string' ? value : JSON.stringify(value),
                    updatedAt: new Date().toISOString()
                }));
                setSettings(arr);
            }
            setError(null);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const updateSetting = async (key: string, value: string, description?: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/settings/${key}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ value, description }),
                credentials: 'include',
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Error al actualizar la configuración');

            await fetchSettings();
            return true;
        } catch (err) {
            setError((err as Error).message);
            return false;
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return { settings, loading, error, refresh: fetchSettings, updateSetting };
}
