'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Category {
    id: string;
    name: string;
    icon: string | null;
}

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async (search?: string) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            params.set('limit', '10');
            if (search) params.set('q', search);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/categories?${params}`,
                { credentials: 'include' }
            );

            if (!response.ok) {
                throw new Error('Error al cargar categorías');
            }

            const result = await response.json();
            setCategories(result);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return {
        categories,
        loading,
        error,
        refetch: fetchCategories,
    };
}