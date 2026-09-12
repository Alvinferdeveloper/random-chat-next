"use client"
import { useState } from "react";
import { Check, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { RoomInfo } from "@/src/app/chat/[id]/hooks/useRoomInfo";

interface RoomInfoDialogProps {
    room: RoomInfo;
    memberCount: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RoomInfoDialog({ room, memberCount, open, onOpenChange }: RoomInfoDialogProps) {
    const { t } = useTranslation();
    const [bannerError, setBannerError] = useState(false);
    const [iconError, setIconError] = useState(false);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="overflow-hidden p-0 gap-0">
                {room.server_banner && !bannerError && (
                    <img
                        src={room.server_banner}
                        alt=""
                        className="h-28 w-full object-cover"
                        onError={() => setBannerError(true)}
                    />
                )}

                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        {room.server_icon && !iconError ? (
                            <img
                                src={room.server_icon}
                                alt=""
                                className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-background shadow-sm"
                                onError={() => setIconError(true)}
                            />
                        ) : (
                            <span className="w-12 h-12 rounded-full bg-primary/15 text-primary text-lg font-bold flex items-center justify-center shrink-0 select-none">
                                {room.name.charAt(0).toUpperCase()}
                            </span>
                        )}

                        <DialogHeader className="flex-1 text-left space-y-0.5">
                            <DialogTitle className="flex items-center gap-1.5">
                                {room.name}
                                {room.verified && (
                                    <span className="w-4 h-4 min-w-[16px] bg-green-500 rounded-full flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-white" />
                                    </span>
                                )}
                            </DialogTitle>
                            {room.short_description && (
                                <p className="text-sm text-muted-foreground">{room.short_description}</p>
                            )}
                        </DialogHeader>
                    </div>

                    {room.full_description && (
                        <p className="text-sm text-foreground/85 leading-relaxed">{room.full_description}</p>
                    )}

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-3 border-t">
                        <Users className="w-3.5 h-3.5" />
                        <span>{t('chat.room_info.member_count', { count: memberCount })}</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
