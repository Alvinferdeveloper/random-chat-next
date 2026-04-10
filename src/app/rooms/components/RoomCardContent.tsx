'use client';

import { CardContent } from '@/src/components/ui/card';
import { ConnectingAnimation } from '@/src/app/components/animations/ConnectionAnimation';
import { Circle, Check } from 'lucide-react';

interface RoomCardContentProps {
    name: string;
    description: string;
    verified: boolean;
    userCount: number;
    isConnecting: boolean;
    footer?: React.ReactNode;
}

export function RoomCardContent({ name, description, verified, userCount, isConnecting, footer }: RoomCardContentProps) {
    return (
        <CardContent className="pt-4 pb-4 px-4 flex flex-col flex-1">
            {/* Room Name */}
            <div className="flex items-center gap-2 mb-2">
                {verified && (
                    <div className="w-4 h-4 min-w-[16px] bg-green-500 rounded-full flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white" />
                    </div>
                )}
                <h3 className="text-white font-bold text-lg truncate pr-2">
                    {name}
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
                        {description}
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
    );
}
