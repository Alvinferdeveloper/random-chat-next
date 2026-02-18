'use client';

import { Room } from '@/src/app/rooms/hooks/useRoom';
import { Card, CardContent } from '@/src/components/ui/card';
import { ConnectingAnimation } from '@/src/app/components/animations/ConnectionAnimation';
import { Circle, Check } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface RoomCardProps {
    room: Room;
    index: number;
    userCount: number;
    isConnecting: boolean;
    onJoin: (roomId: string) => void;
    cardVariants: any;
    footer?: React.ReactNode;
}

export function RoomCard({
    room,
    index,
    userCount,
    isConnecting,
    onJoin,
    cardVariants,
    footer
}: RoomCardProps) {
    const [hovered, setHovered] = useState(false);

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
                onClick={() => onJoin(room.id)}
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
                        {
                            room.verified && (
                                <div className="w-4 h-4 min-w-[16px] bg-green-500 rounded-full flex items-center justify-center shrink-0">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                            )
                        }
                        <h3 className="text-white font-bold text-lg truncate pr-2">
                            {room.name}
                        </h3>
                    </div>

                    {/* Description */}
                    <div className="flex-1 mb-4">
                        {isConnecting ? (
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
                                {userCount || 0} usuarios activos
                            </span>
                        </div>
                    </div>
                    {footer && (
                        <div className="mt-4 pt-4 border-t border-gray-700/50" onClick={(e) => e.stopPropagation()}>
                            {footer}
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}


