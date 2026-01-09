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
                        >
                            <Card
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

