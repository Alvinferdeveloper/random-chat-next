'use client';

import { useState } from 'react';

interface RoomCardBannerProps {
    roomName: string;
    serverBanner?: string;
    serverIcon?: string;
    children?: React.ReactNode;
}

export function RoomCardBanner({ roomName, serverBanner, serverIcon, children }: RoomCardBannerProps) {
    const [bannerError, setBannerError] = useState(false);
    const [iconError, setIconError] = useState(false);

    return (
        <div className="relative shrink-0">
            {/* Banner Image */}
            <div className="h-[170px] relative w-full bg-gray-700">
                {serverBanner && !bannerError ? (
                    <img
                        src={serverBanner}
                        alt="Room banner"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={() => setBannerError(true)}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#5865f2]/60 via-[#3b3f45] to-[#2f3136] flex items-start p-3">
                        <span className="text-white/70 text-xs font-medium select-none">{roomName}</span>
                    </div>
                )}
                
                {children}
            </div>

            {/* Icon Image */}
            <div className="absolute -bottom-5 left-4 z-10">
                <div className="w-16 h-16 bg-[#5865f2] rounded-full flex items-center justify-center border-[4px] border-[#2f3136] overflow-hidden shadow-sm">
                    {serverIcon && !iconError ? (
                        <img
                            src={serverIcon}
                            alt="Icon"
                            className="w-full h-full object-cover"
                            onError={() => setIconError(true)}
                        />
                    ) : (
                        <span className="text-white font-bold text-xl select-none">
                            {roomName.charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
