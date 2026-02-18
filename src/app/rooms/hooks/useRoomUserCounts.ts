'use client';

import { useRoomUserCountsContext } from '@/src/app/components/providers/RoomCountProvider';

/**
 * Hook to share room counts across multiple components.
 * It uses a shared Context to ensure socket events are only registered once.
 */
export const useRoomUserCounts = () => {
    const { userCounts } = useRoomUserCountsContext();
    return { userCounts };
};
