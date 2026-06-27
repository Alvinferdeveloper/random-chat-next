'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '@/src/app/hooks/useDebounce';

export interface User {
    id: string;
    username: string;
    email: string;
    name: string;
    role: string;
    isBanned: boolean;
    createdAt: string;
    image: string | null;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export function useAdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);
    const [page, setPage] = useState(1);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/users?page=${page}&search=${debouncedSearch}`, {
                credentials: 'include'
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Error fetching users');

            setUsers(data.users);
            setPagination(data.pagination);
            setError(null);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const toggleBan = async (userId: string, isBanned: boolean, reason?: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/users/${userId}/ban`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isBanned, banReason: reason }),
                credentials: 'include'
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Error updating ban status');
            }

            // Update local state
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned } : u));
            return true;
        } catch (err) {
            setError((err as Error).message);
            return false;
        }
    };

    const changeRole = async (userId: string, role: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/users/${userId}/role`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role }),
                credentials: 'include'
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Error updating role');
            }

            // Update local state
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
            return true;
        } catch (err) {
            setError((err as Error).message);
            return false;
        }
    };

    return {
        users,
        pagination,
        loading,
        error,
        search,
        setSearch,
        page,
        setPage,
        toggleBan,
        changeRole,
        refresh: fetchUsers
    };
}
