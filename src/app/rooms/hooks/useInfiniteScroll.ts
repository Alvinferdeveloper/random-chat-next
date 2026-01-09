'use client';

import { useRef, useCallback } from 'react';

interface InfiniteScrollOptions {
    loading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
}

export function useInfiniteScroll({ loading, hasMore, onLoadMore }: InfiniteScrollOptions) {
    const observer = useRef<IntersectionObserver>(undefined);

    const sentinelRef = useCallback((node: HTMLElement | null) => {
        if (loading) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                onLoadMore();
            }
        });

        if (node) observer.current.observe(node);

    }, [loading, hasMore, onLoadMore]);

    return { sentinelRef };
}
