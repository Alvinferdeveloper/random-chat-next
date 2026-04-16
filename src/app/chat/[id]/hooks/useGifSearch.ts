"use client";
import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/src/app/hooks/useDebounce";

const GIPHY_API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY;

export function useGifSearch() {
    const [search, setSearch] = useState("");
    const [gifs, setGifs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const LIMIT = 20;
    const debouncedSearch = useDebounce(search, 500);

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
        hasMore
    };
}
