'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import { ConnectingAnimation } from '../components/animations/ConnectionAnimation';
import useRoom from '@/src/app/rooms/hooks/useRoom';
import { useSocket } from '@/components/providers/SocketProvider';
import { Circle, Check } from 'lucide-react';
import { AdditionalInfoModal } from '../components/auth/AdditionalInfoModal';
import { useAuth } from '../hooks/useAuth';

export default function Rooms() {
    const router = useRouter();
    const [connecting, setConnecting] = useState<string | null>(null);
    const [hovered, setHovered] = useState<string | null>(null);
    const { rooms } = useRoom();
    const socket = useSocket();
    const [userCounts, setUserCounts] = useState<Record<string, number>>({});

    const { session, isPending } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (isPending) return;
        if (session?.user) {
            if (!(session.user as any).isCompleteProfile) {
                setIsModalOpen(true);
            }
        }
    }, [isPending, session]);

    const handleProfileComplete = () => {
        setIsModalOpen(false);
        window.location.reload();
    };

    useEffect(() => {
        if (socket) {
            socket.emit('getInitialRoomState');

            socket.on('initialRoomState', (roomState: Record<string, { userCount: number }>) => {
                const counts: Record<string, number> = {};
                for (const roomId in roomState) {
                    counts[roomId] = roomState[roomId].userCount;
                }
                setUserCounts(counts);
            });

            socket.on('userCount', (data: { roomId: string; count: number }) => {
                setUserCounts((prevCounts) => ({
                    ...prevCounts,
                    [data.roomId]: data.count,
                }));
            });
        }

        return () => {
            if (socket) {
                socket.off('initialRoomState');
                socket.off('userCount');
            }
        };
    }, [socket]);

    const handleJoinRoom = (roomId: string) => {
        setConnecting(roomId);
        router.push(`/chat/${roomId}`);
    };

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Cargando sesión...</p>
            </div>
        );
    }

    return (
        <div>
            <AdditionalInfoModal
                isOpen={isModalOpen}
                onProfileComplete={handleProfileComplete}
            />
            <main className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
                {rooms.map((room) => {
                    return (
                        <Card
                            key={room.id}
                            className={`bg-[#2f3136] border-none rounded-lg py-0 overflow-hidden hover:bg-[#32353b] transition-colors cursor-pointer ${connecting === room.id ? "scale-[0.98] opacity-75" : ""
                                } ${hovered === room.id ? "scale-[1.02]" : ""}`}
                            onMouseEnter={() => setHovered(room.id)}
                            onMouseLeave={() => setHovered(null)}
                            onClick={() => handleJoinRoom(room.id)}
                        >
                            <div className="relative">
                                {/* Banner Image */}
                                <div className="h-[170px] relative overflow-hidden">
                                    <img src={room.server_banner} alt="Room banner image" />
                                </div>

                                {/* room Icon */}
                                <div className="absolute -bottom-4 left-4">
                                    <div className="w-12 h-12 bg-[#5865f2] rounded-full flex items-center justify-center border-4 border-[#2f3136] overflow-hidden">
                                        <img src={room.server_icon} alt="" />
                                    </div>
                                </div>
                            </div>

                            <CardContent className="pt-3 pb-4 px-4">
                                {/* room Name with Verification */}
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                    <h3 className="text-white font-semibold text-lg">{room.name}</h3>
                                </div>

                                {/* Description */}
                                {connecting === room.id ? (
                                    <div className="w-full py-2">
                                        <ConnectingAnimation text="Conectando a la sala..." />
                                    </div>
                                ) : (
                                    <p className="text-[#b9bbbe] text-sm mb-4 leading-relaxed">{room.full_description}</p>)}

                                {/* Member Stats */}
                                <div className="flex items-center gap-4 text-xs">
                                    <div className="flex items-center gap-1">
                                        <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                                        <span className="text-[#b9bbbe]">{userCounts[room.id] || 0} usuarios activos </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </main>
        </div>
    )
}

