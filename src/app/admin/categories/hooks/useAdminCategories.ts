'use client';

import { useState, useEffect, useCallback } from 'react';

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
    const [categories, setCategories] = useState<Category[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories?page=${page}&limit=20&search=${search}`, {
                credentials: 'include'
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Error fetching categories');

            setCategories(data.data);
            setPagination(data.pagination);
            setError(null);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

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
            if (!response.ok) throw new Error(data.message || 'Error creating category');

            fetchCategories();
            return true;
        } catch (err) {
            setError((err as Error).message);
            return false;
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
            if (!response.ok) throw new Error(data.message || 'Error updating category');

            fetchCategories();
            return true;
        } catch (err) {
            setError((err as Error).message);
            return false;
        }
    };

    const deleteCategory = async (id: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error deleting category');

            fetchCategories();
            return true;
        } catch (err) {
            setError((err as Error).message);
            return false;
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
