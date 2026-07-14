'use client';

import { useState, useCallback } from 'react';

interface UserProfile {
    id: string;
    username: string;
    email: string;
    name: string;
    image: string | null;
    bio: string | null;
    location: string | null;
    ageRange: string | null;
    conversationType: string | null;
    role: string;
    isBanned: boolean;
    banReason: string | null;
    hobbies: Array<{ id: string; name: string; icon: string }>;
}

interface OwnedRoom {
    id: string;
    name: string;
    normalized_name: string;
    short_description: string;
    server_icon: string | null;
    status: string;
    created_at: string;
}

interface ActivityItem {
    roomId: string;
    lastInteraction: string;
    interactionCount: number;
    room: { id: string; name: string; normalized_name: string } | null;
}

interface ReportItem {
    id: string;
    reason: string;
    details: string | null;
    status: string;
    createdAt: string;
    reporter?: { username: string };
    reportedUser?: { username: string };
    room?: { name: string } | null;
}

interface UserDetails {
    user: UserProfile;
    ownedRooms: OwnedRoom[];
    recentActivity: ActivityItem[];
    reportsReceived: ReportItem[];
    reportsMade: ReportItem[];
}

export function useAdminUserDetails() {
    const [details, setDetails] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchDetails = useCallback(async (userId: string) => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/users/${userId}/details`, {
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                setDetails(data);
            }
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setDetails(null);
    }, []);

    return { details, loading, fetchDetails, reset };
}
