'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Check, X, RotateCcw, Hash } from 'lucide-react';
import { AdminRoom, RoomStatus } from '../hooks/useAdminRooms';

interface RoomCardProps {
    room: AdminRoom;
    index: number;
    onAction: (roomId: string, status: RoomStatus) => void;
    isSubmitting: boolean;
}

const statusConfig: Record<RoomStatus, { labelKey: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    IN_REVISION: { labelKey: 'rooms.status.in_revision', variant: 'secondary' },
    ACCEPTED: { labelKey: 'rooms.status.accepted', variant: 'default' },
    REJECTED: { labelKey: 'rooms.status.rejected', variant: 'destructive' },
};

type ActionDef = { status: RoomStatus; labelKey: string; variant: 'default' | 'destructive'; icon: typeof Check };

function getActions(roomStatus: RoomStatus): [ActionDef, ActionDef] {
    switch (roomStatus) {
        case 'IN_REVISION':
            return [
                { status: 'REJECTED', labelKey: 'admin.rooms.reject', variant: 'destructive', icon: X },
                { status: 'ACCEPTED', labelKey: 'admin.rooms.accept', variant: 'default', icon: Check },
            ];
        case 'ACCEPTED':
            return [
                { status: 'REJECTED', labelKey: 'admin.rooms.reject', variant: 'destructive', icon: X },
                { status: 'IN_REVISION', labelKey: 'admin.rooms.revision', variant: 'default', icon: RotateCcw },
            ];
        case 'REJECTED':
            return [
                { status: 'IN_REVISION', labelKey: 'admin.rooms.revision', variant: 'default', icon: RotateCcw },
                { status: 'ACCEPTED', labelKey: 'admin.rooms.accept', variant: 'default', icon: Check },
            ];
    }
}

export default function RoomCard({ room, index, onAction, isSubmitting }: RoomCardProps) {
    const { t } = useTranslation();
    const cfg = statusConfig[room.status];
    const actions = getActions(room.status);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1], delay: index * 0.05 }}
        >
            <Card className="flex flex-col h-full overflow-hidden border-border/50 bg-gradient-to-br from-zinc-100 to-zinc-100/60 dark:from-zinc-900/90 dark:to-zinc-900/60">
                <div className="relative h-44 w-full bg-muted">
                    {room.server_banner ? (
                        <Image
                            src={room.server_banner}
                            alt={room.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <Hash className="h-10 w-10 text-muted-foreground/30" />
                        </div>
                    )}
                    <div className="absolute top-3 right-3">
                        <Badge variant={cfg.variant} className="text-[10px] uppercase tracking-wider shadow-sm">
                            {t(cfg.labelKey)}
                        </Badge>
                    </div>
                    <div className="absolute -bottom-6 left-6 h-14 w-14 overflow-hidden rounded-full border-4 border-background bg-background shadow-sm">
                        {room.server_icon ? (
                            <Image
                                src={room.server_icon}
                                alt={room.name}
                                fill
                                className="object-cover"
                                sizes="56px"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center bg-primary text-primary-foreground text-sm font-bold">
                                {room.name.charAt(0)}
                            </div>
                        )}
                    </div>
                </div>

                <CardHeader className="mt-6 pb-2">
                    <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-lg truncate">{room.name}</CardTitle>
                        {room.verified && (
                            <Badge variant="secondary" className="shrink-0 text-[10px] px-1.5 py-0 h-5">
                                {t('admin.rooms.verified')}
                            </Badge>
                        )}
                    </div>
                    <CardDescription>
                        {t('admin.rooms.created_by')} <span className="font-medium text-foreground/70">@{room.owner?.username || t('admin.rooms.no_description')}</span>
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 space-y-3 text-sm">
                    <div>
                        <p className="text-xs text-muted-foreground/70 font-medium mb-1">{t('admin.rooms.short_desc')}</p>
                        <p className="text-muted-foreground">{room.short_description || t('admin.rooms.no_description')}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground/70 font-medium mb-1">{t('admin.rooms.full_desc')}</p>
                        <p className="text-muted-foreground/80 line-clamp-3 leading-relaxed">{room.full_description || t('admin.rooms.no_description')}</p>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between gap-3 pt-4 border-t border-border">
                    {actions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <Button
                                key={action.status}
                                variant={action.variant === 'destructive' ? 'outline' : 'default'}
                                className={
                                    action.variant === 'destructive'
                                        ? 'flex-1 gap-2 active:scale-[0.98] cursor-pointer text-red-600 hover:text-red-600 hover:bg-red-500/10 border-red-500/20 hover:border-red-500/30'
                                        : 'flex-1 gap-2 active:scale-[0.98] cursor-pointer'
                                }
                                onClick={() => onAction(room.id, action.status)}
                                disabled={isSubmitting}
                            >
                                <Icon className="h-4 w-4" />
                                {t(action.labelKey)}
                            </Button>
                        );
                    })}
                </CardFooter>
            </Card>
        </motion.div>
    );
}
