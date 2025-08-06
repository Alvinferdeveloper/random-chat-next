'use client';

import { useState, useEffect } from 'react';
import User from '@/components/icons/User';

interface UserJoinedNotificationProps {
    username: string | null;
}

export function UserJoinedNotification({ username }: UserJoinedNotificationProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const entryTimer = setTimeout(() => {
            setIsVisible(true);
        }, 50);

        const exitTimer = setTimeout(() => {
            setIsVisible(false);
        }, 4000);

        return () => {
            clearTimeout(entryTimer);
            clearTimeout(exitTimer);
        };
    }, []);

    if (!username) {
        return null;
    }

    return (
        <div
            className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 px-4 py-1.5 text-sm font-semibold text-white shadow-lg">
                <User />
                <span>
                    <span className="font-bold">{username}</span> se ha unido a la sala.
                </span>
            </div>
        </div>
    );
}