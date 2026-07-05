'use client';
import { useState, useEffect } from 'react';

interface ChatSettings {
    chat_gifs_enabled: boolean;
    chat_images_enabled: boolean;
    chat_audio_enabled: boolean;
    loading: boolean;
}

export function useChatSettings(): ChatSettings {
    const [settings, setSettings] = useState({
        chat_gifs_enabled: true,
        chat_images_enabled: true,
        chat_audio_enabled: true,
    });
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings`);
            if (res.ok) {
                const data = await res.json();
                const s = data.settings || {};
                setSettings({
                    chat_gifs_enabled: s.chat_gifs_enabled !== 'false',
                    chat_images_enabled: s.chat_images_enabled !== 'false',
                    chat_audio_enabled: s.chat_audio_enabled !== 'false',
                });
            }
        } catch {
            // keep defaults (all enabled)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
        const interval = setInterval(fetchSettings, 30000);
        return () => clearInterval(interval);
    }, []);

    return { ...settings, loading };
}
