'use client';
import { useState, useEffect, useRef } from 'react';

interface ChatSettings {
    chat_gifs_enabled: boolean;
    chat_images_enabled: boolean;
    chat_audio_enabled: boolean;
    loading: boolean;
}

const STALE_MS = 5 * 60 * 1000;

let cachedSettings: ChatSettings | null = null;
let cachedAt = 0;

export function useChatSettings(): ChatSettings {
    const [settings, setSettings] = useState<ChatSettings>(
        cachedSettings ?? {
            chat_gifs_enabled: true,
            chat_images_enabled: true,
            chat_audio_enabled: true,
        }
    );
    const [loading, setLoading] = useState(!cachedSettings);
    const lastFetchRef = useRef(cachedAt);

    const fetchSettings = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings`);
            if (res.ok) {
                const data = await res.json();
                const s = data.settings || {};
                const next: ChatSettings = {
                    chat_gifs_enabled: s.chat_gifs_enabled !== 'false',
                    chat_images_enabled: s.chat_images_enabled !== 'false',
                    chat_audio_enabled: s.chat_audio_enabled !== 'false',
                    loading: false,
                };
                cachedSettings = next;
                cachedAt = Date.now();
                lastFetchRef.current = cachedAt;
                setSettings(next);
            }
        } catch {
            // keep defaults
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const isStale = Date.now() - cachedAt > STALE_MS;
        if (!cachedSettings || isStale) {
            fetchSettings();
        }

        const handleVisibility = () => {
            if (document.visibilityState === 'visible' && Date.now() - lastFetchRef.current > STALE_MS) {
                fetchSettings();
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);

        return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, []);

    return { ...settings, loading };
}
