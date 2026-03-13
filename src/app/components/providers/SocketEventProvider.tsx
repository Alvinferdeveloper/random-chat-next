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

        const onConnect = () => {
            console.log('Socket conectado exitosamente');
        };

        const onDisconnect = (reason: string) => {
            console.warn('Socket desconectado:', reason);
            if (reason === 'io server disconnect') {
                // El servidor forzó la desconexión, hay que reconectar manualmente
                socket.connect();
            }
        };

        const onConnectError = (error: Error) => {
            console.error('Error de conexión socket:', error.message);
        };

        const onReconnectAttempt = (attempt: number) => {
            console.log(`Intentando reconexión (intento ${attempt})...`);
        };

        const onReconnectFailed = () => {
            console.error('La reconexión ha fallado después de varios intentos.');
        };

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

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('connect_error', onConnectError);
        socket.on('reconnect_attempt', onReconnectAttempt);
        socket.on('reconnect_failed', onReconnectFailed);
        
        socket.emit('get-initial-room-state');
        socket.on('initial-room-state', handleInitialState);
        socket.on('user-count', handleUserCountUpdate);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('connect_error', onConnectError);
            socket.off('reconnect_attempt', onReconnectAttempt);
            socket.off('reconnect_failed', onReconnectFailed);
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
