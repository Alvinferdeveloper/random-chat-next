'use client';

import { useRoomUserCounts as useRoomUserCountsFromProvider } from '@/src/app/components/providers/SocketEventProvider';

/**
 * Hook to access shared room user counts.
 * State is managed globally by SocketEventProvider (events registered once).
 */
export const useRoomUserCounts = () => {
    return useRoomUserCountsFromProvider();
};
