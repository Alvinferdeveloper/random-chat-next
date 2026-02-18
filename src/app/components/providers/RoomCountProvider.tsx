'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './SocketProvider';

type UserCounts = Record<string, number>;

interface RoomCountContextType {
    userCounts: UserCounts;
}

const RoomCountContext = createContext<RoomCountContextType | undefined>(undefined);

export const RoomCountProvider = ({ children }: { children: React.ReactNode }) => {
    const socket = useSocket();
    const [userCounts, setUserCounts] = useState<UserCounts>({});

    useEffect(() => {
        if (!socket) return;

        const handleInitialState = (roomState: Record<string, { userCount: number }>) => {
            const counts: UserCounts = {};
            for (const roomId in roomState) {
                counts[roomId] = roomState[roomId].userCount;
            }
            setUserCounts(counts);
        };

        const handleUserCountUpdate = (data: { roomId: string; count: number }) => {
            setUserCounts((prevCounts) => ({
                ...prevCounts,
                [data.roomId]: data.count,
            }));
        };

        socket.emit('get-initial-room-state');
        socket.on('initial-room-state', handleInitialState);
        socket.on('user-count', handleUserCountUpdate);

        return () => {
            socket.off('initial-room-state', handleInitialState);
            socket.off('user-count', handleUserCountUpdate);
        };
    }, [socket]);

    return (
        <RoomCountContext.Provider value={{ userCounts }}>
            {children}
        </RoomCountContext.Provider>
    );
};

export const useRoomUserCountsContext = () => {
    const context = useContext(RoomCountContext);
    if (context === undefined) {
        throw new Error('useRoomUserCountsContext must be used within a RoomCountProvider');
    }
    return context;
};
