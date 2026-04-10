'use client';

import { Room } from '@/src/app/rooms/hooks/useRoom';
import { Card } from '@/src/components/ui/card';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFavoriteRoom } from '@/src/app/rooms/hooks/useFavoriteRoom';
import { useAuth } from '@/src/app/hooks/useAuth';

import { RoomCardBanner } from '@/src/app/rooms/components/RoomCardBanner';
import { RoomCardActions } from '@/src/app/rooms/components/RoomCardActions';
import { RoomCardContent } from '@/src/app/rooms/components/RoomCardContent';

interface RoomCardProps {
    room: Room;
    index: number;
    userCount: number;
    isConnecting: boolean;
    onJoin: (roomId: string, roomName: string) => void;
    cardVariants: any;
    footer?: React.ReactNode;
    onDelete?: (roomId: string) => Promise<any>;
}

export function RoomCard({
    room,
    index,
    userCount,
    isConnecting,
    onJoin,
    cardVariants,
    footer,
    onDelete
}: RoomCardProps) {
    const { isFavorite, toggleFavorite } = useFavoriteRoom(room.id, room.isFavorite);
    const [hovered, setHovered] = useState(false);
    const { session } = useAuth();

    const isOwner = session?.user?.id === room.ownerId;

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
                className={`h-full flex flex-col bg-[#2f3136] border-none rounded-lg py-0 overflow-hidden hover:bg-[#32353b] transition-all duration-200 cursor-pointer group ${isConnecting ? "scale-[0.98] opacity-75" : ""
                    } ${hovered ? "scale-[1.02] shadow-xl" : ""}`}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={() => onJoin(room.id, room.name)}
            >
                <RoomCardBanner
                    roomName={room.name}
                    serverBanner={room.server_banner}
                    serverIcon={room.server_icon}
                >
                    <RoomCardActions
                        room={room}
                        isOwner={isOwner}
                        isFavorite={isFavorite}
                        onToggleFavorite={toggleFavorite}
                        onDelete={onDelete}
                    />
                </RoomCardBanner>

                <RoomCardContent
                    name={room.name}
                    description={room.full_description}
                    verified={room.verified}
                    userCount={userCount}
                    isConnecting={isConnecting}
                    footer={footer}
                />
            </Card>
        </motion.div>
    );
}
