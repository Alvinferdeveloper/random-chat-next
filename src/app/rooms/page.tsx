'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import { ConnectingAnimation } from '@/src/app/components/animations/ConnectionAnimation';
import useRoom from '@/src/app/rooms/hooks/useRoom';
import { useSocket } from '@/src/app/components/providers/SocketProvider';
import { Circle, Check, Loader2 } from 'lucide-react';
import { AdditionalInfoModal } from '@/src/app/components/auth/AdditionalInfoModal';
import { useAuth } from '@/src/app/hooks/useAuth';
import { useInfiniteScroll } from '@/src/app/rooms/hooks/useInfiniteScroll';
import { motion, Variants } from 'framer-motion';

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.05,
            duration: 0.3,
            ease: "easeOut"
        }
    })
};

export default function Rooms() {
    const router = useRouter();
    const [connecting, setConnecting] = useState<string | null>(null);
    const [hovered, setHovered] = useState<string | null>(null);
    const { rooms, error, loading, hasMore, loadMoreRooms } = useRoom();
    const { sentinelRef } = useInfiniteScroll({ loading, hasMore, onLoadMore: loadMoreRooms });
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
            socket.emit('get-initial-room-state');

            socket.on('initial-room-state', (roomState: Record<string, { userCount: number }>) => {
                const counts: Record<string, number> = {};
                for (const roomId in roomState) {
                    counts[roomId] = roomState[roomId].userCount;
                }
                setUserCounts(counts);
            });

            socket.on('user-count', (data: { roomId: string; count: number }) => {
                setUserCounts((prevCounts) => ({
                    ...prevCounts,
                    [data.roomId]: data.count,
                }));
            });
        }

        return () => {
            if (socket) {
                socket.off('initial-room-state');
                socket.off('user-count');
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
                {rooms.map((room, index) => {
                    return (
                        <motion.div
                            key={room.id}
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            variants={cardVariants}
                            viewport={{ once: true, amount: 0.1 }}
                            className="h-full"
                        >
                            <Card
                                className={`h-full flex flex-col bg-[#2f3136] border-none rounded-lg py-0 overflow-hidden hover:bg-[#32353b] transition-all duration-200 cursor-pointer group ${connecting === room.id ? "scale-[0.98] opacity-75" : ""
                                    } ${hovered === room.id ? "scale-[1.02] shadow-xl" : ""}`}
                                onMouseEnter={() => setHovered(room.id)}
                                onMouseLeave={() => setHovered(null)}
                                onClick={() => handleJoinRoom(room.id)}
                            >
                                <div className="relative shrink-0">
                                    <div className="h-[170px] relative w-full bg-gray-700">
                                        {room.server_banner && <img
                                            src={room.server_banner}
                                            alt="Room banner"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />}

                                    </div>

                                    <div className="absolute -bottom-5 left-4 z-10">
                                        <div className="w-16 h-16 bg-[#5865f2] rounded-full flex items-center justify-center border-[4px] border-[#2f3136] overflow-hidden shadow-sm">
                                            {room.server_icon && <img
                                                src={room.server_icon}
                                                alt="Icon"
                                                className="w-full h-full object-cover"
                                            />}
                                        </div>
                                    </div>
                                </div>

                                {/* Main content */}
                                <CardContent className="pt-4 pb-4 px-4 flex flex-col flex-1">
                                    {/* Room Name */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-4 h-4 min-w-[16px] bg-green-500 rounded-full flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                        <h3 className="text-white font-bold text-lg truncate pr-2">
                                            {room.name}
                                        </h3>
                                    </div>

                                    {/* Description */}
                                    <div className="flex-1 mb-4">
                                        {connecting === room.id ? (
                                            <div className="w-full py-2 animate-pulse">
                                                <ConnectingAnimation text="Conectando..." />
                                            </div>
                                        ) : (
                                            <p className="text-[#b9bbbe] text-sm leading-relaxed line-clamp-2 text-ellipsis overflow-hidden">
                                                {room.full_description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Member Stats */}
                                    <div className="mt-auto flex items-center gap-4 text-xs pt-2 border-t border-gray-700/50">
                                        <div className="flex items-center gap-1.5">
                                            <Circle className="w-2 h-2 fill-green-500 text-green-500 animate-pulse" />
                                            <span className="text-[#b9bbbe] font-medium">
                                                {userCounts[room.id] || 0} usuarios activos
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )
                })}
            </main>
            <div ref={sentinelRef} className="flex justify-center items-center h-20">
                {loading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
                {!loading && !hasMore && rooms.length > 0 && <p className="text-muted-foreground">No hay más salas para mostrar.</p>}
                {error && <p className="text-destructive">{error}</p>}
            </div>
        </div>
    )
}

