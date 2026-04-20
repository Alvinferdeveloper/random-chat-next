"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/src/app/hooks/useAuth";

export function useFavoriteGifs() {
    const { session } = useAuth();
    const [favoriteGifs, setFavoriteGifs] = useState<any[]>([]);
    const [loadingFavorites, setLoadingFavorites] = useState(false);

    const fetchFavorites = useCallback(async () => {
        if (!session) return;

        setLoadingFavorites(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/favorites/gifs`, {
                credentials: 'include'
            });
            const json = await res.json();
            if (json.success) setFavoriteGifs(json.data);
        } catch (error) {
            console.error("Error fetching favorite gifs:", error);
        } finally {
            setLoadingFavorites(false);
        }
    }, [session]);

    const toggleFavorite = async (giphyId: string, url: string, title?: string) => {
        if (!session) return;

        const isFavorite = favoriteGifs.some(g => g.giphyId === giphyId);

        try {
            if (isFavorite) {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/favorites/gifs/${giphyId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                setFavoriteGifs(prev => prev.filter(g => g.giphyId !== giphyId));
            } else {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/favorites/gifs`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ giphyId, url, title })
                });
                const json = await res.json();
                if (json.success) setFavoriteGifs(prev => [json.data, ...prev]);
            }
        } catch (error) {
            console.error("Error toggling favorite gif:", error);
        }
    };

    useEffect(() => {
        if (session) {
            fetchFavorites();
        } else {
            setFavoriteGifs([]);
        }
    }, [session, fetchFavorites]);

    return {
        favoriteGifs,
        loadingFavorites,
        toggleFavorite,
        refreshFavorites: fetchFavorites
    };
}
