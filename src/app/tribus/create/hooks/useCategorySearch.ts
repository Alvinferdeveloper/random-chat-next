'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useDebounce } from '@/src/app/hooks/useDebounce';

export interface Category {
    id: string;
    name: string;
    icon: string | null;
}

export function useCategorySearch() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const debouncedSearch = useDebounce(search, 300);

    const fetchCategories = useCallback(async (query?: string) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            params.set('limit', '20');
            if (query) params.set('q', query);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/categories?${params}`,
                { credentials: 'include' }
            );

            if (!response.ok) {
                throw new Error('CATEGORIES_SEARCH_ERROR');
            }

            const result = await response.json();
            setCategories(result);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch when debounced search changes
    useEffect(() => {
        if (!debouncedSearch) {
            setCategories([]);
            return;
        }

        fetchCategories(debouncedSearch);
    }, [debouncedSearch, fetchCategories]);

    return {
        categories,
        loading,
        error,
        search,
        setSearch,
        fetchCategories,
    };
}