"use client";
import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/src/app/hooks/useDebounce";
import { is } from "zod/v4/locales";

const GIPHY_API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY;
const LIMIT = Number(process.env.NEXT_PUBLIC_LIMIT_GIFS) || 10;

export function useGifSearch() {
    const [search, setSearch] = useState("");
    const [gifs, setGifs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    // Favorites state
    const [favoriteGifs, setFavoriteGifs] = useState<any[]>([]);
    const [loadingFavorites, setLoadingFavorites] = useState(false);

    const debouncedSearch = useDebounce(search, 500);

    const fetchFavorites = useCallback(async () => {
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
    }, []);

    const toggleFavorite = async (giphyId: string, url: string, title?: string) => {
        const isFavorite = favoriteGifs.some(g => g.giphyId == giphyId);

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

    const fetchGifs = useCallback(async (isLoadMore = false) => {
        const currentOffset = isLoadMore ? offset + LIMIT : 0;

        if (isLoadMore) setLoadingMore(true);
        else setLoading(true);

        try {
            const baseUrl = debouncedSearch.trim() === ""
                ? "https://api.giphy.com/v1/gifs/trending"
                : "https://api.giphy.com/v1/gifs/search";

            const queryParam = debouncedSearch.trim() === "" ? "" : `&q=${encodeURIComponent(debouncedSearch)}`;
            const url = `${baseUrl}?api_key=${GIPHY_API_KEY}${queryParam}&limit=${LIMIT}&offset=${currentOffset}&rating=g`;

            const res = await fetch(url);
            const { data, pagination } = await res.json();

            if (isLoadMore) {
                setGifs(prev => [...prev, ...data]);
            } else {
                setGifs(data || []);
            }

            setOffset(currentOffset);
            setHasMore(data.length === LIMIT && (pagination.offset + data.length) < pagination.total_count);

        } catch (err) {
            console.error("Error fetching gifs:", err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [debouncedSearch, offset]);

    // it is only executed when the debouncedSearch changes
    useEffect(() => {
        setOffset(0);
        setHasMore(true);
        fetchGifs(false);
    }, [debouncedSearch]);

    // Initial favorites fetch
    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    const loadMore = useCallback(() => {
        if (!loading && !loadingMore && hasMore) {
            fetchGifs(true);
        }
    }, [loading, loadingMore, hasMore, fetchGifs]);

    return {
        search,
        setSearch,
        gifs,
        loading,
        loadingMore,
        loadMore,
        hasMore,
        favoriteGifs,
        loadingFavorites,
        toggleFavorite,
        refreshFavorites: fetchFavorites
    };
}
