'use client';

import { useState, useEffect } from 'react';
import { ThemeToggle } from '../../pages/main/ThemeToggle';
import { UserNav } from '@/src/app/components/auth/UserNav';

export default function DynamicHeader() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="flex items-center gap-4">
                <div className="h-9 w-9 bg-muted/50 rounded-md animate-pulse"></div>
                <div className="h-8 w-8 bg-muted/50 rounded-full animate-pulse"></div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserNav />
        </div>
    );
}
