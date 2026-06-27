'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/src/app/lib/i18n';
import { useDebounce } from '@/src/app/hooks/useDebounce';

interface Category {
    id: string;
    name: string;
    icon: string | null;
}

interface Pagination {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
}

export function useAdminCategories() {
    const { t } = useTranslation();
    const [categories, setCategories] = useState<Category[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories?page=${page}&limit=20&search=${debouncedSearch}`, {
                credentials: 'include'
            });
            const data = await response.json();

            if (!response.ok) throw new Error(t(data.message || 'Error al cargar categorias'));

            setCategories(data.data);
            setPagination(data.pagination);
            setError(null);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, t]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const createCategory = async (name: string, icon?: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, icon }),
                credentials: 'include'
            });

            const data = await response.json();
            if (!response.ok) return { success: false, message: t(data.message || 'Error al crear categoria') };

            fetchCategories();
            return { success: true };
        } catch (err) {
            return { success: false, message: 'Error al conectar con el servidor' };
        }
    };

    const updateCategory = async (id: string, name: string, icon?: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, icon }),
                credentials: 'include'
            });

            const data = await response.json();
            if (!response.ok) return { success: false, message: t(data.message || 'Error al actualizar categoria') };

            fetchCategories();
            return { success: true };
        } catch (err) {
            return { success: false, message: 'Error al conectar con el servidor' };
        }
    };

    const deleteCategory = async (id: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const data = await response.json();
            if (!response.ok) return { success: false, message: t(data.message || 'Error al eliminar categoria') };

            fetchCategories();
            return { success: true };
        } catch (err) {
            return { success: false, message: 'Error al conectar con el servidor' };
        }
    };

    return {
        categories,
        pagination,
        loading,
        error,
        page,
        setPage,
        search,
        setSearch,
        createCategory,
        updateCategory,
        deleteCategory,
        refresh: fetchCategories
    };
}
