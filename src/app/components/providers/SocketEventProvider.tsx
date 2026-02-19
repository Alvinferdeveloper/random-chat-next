'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '@/src/app/lib/socket';

const SocketContext = createContext(socket);
export const useSocket = () => useContext(SocketContext);

type UserCounts = Record<string, number>;

interface RoomCountContextType {
    userCounts: UserCounts;
}

const RoomCountContext = createContext<RoomCountContextType>({ userCounts: {} });
export const useRoomUserCounts = () => useContext(RoomCountContext);

export const SocketEventProvider = ({ children }: { children: React.ReactNode }) => {
    const [userCounts, setUserCounts] = useState<UserCounts>({});

    useEffect(() => {
        socket.connect();

        const handleInitialState = (roomState: Record<string, { userCount: number }>) => {
            const counts: UserCounts = {};
            for (const roomId in roomState) {
                counts[roomId] = roomState[roomId].userCount;
            }
            setUserCounts(counts);
        };

        const handleUserCountUpdate = (data: { roomId: string; count: number }) => {
            setUserCounts((prev) => ({ ...prev, [data.roomId]: data.count }));
        };

        socket.emit('get-initial-room-state');
        socket.on('initial-room-state', handleInitialState);
        socket.on('user-count', handleUserCountUpdate);

        return () => {
            socket.off('initial-room-state', handleInitialState);
            socket.off('user-count', handleUserCountUpdate);
            socket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            <RoomCountContext.Provider value={{ userCounts }}>
                {children}
            </RoomCountContext.Provider>
        </SocketContext.Provider>
    );
};
