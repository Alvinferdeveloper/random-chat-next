'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/src/components/ui/sheet';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Badge } from '@/src/components/ui/badge';
import { Separator } from '@/src/components/ui/separator';
import { Hash, AlertTriangle, MessageSquare, Calendar, MapPin, Activity } from 'lucide-react';
import { useAdminUserDetails } from '../hooks/useAdminUserDetails';

interface UserDetailSheetProps {
    userId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const fadeUp = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] } },
};

const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.03 } },
};

function DetailSkeleton() {
    return (
        <div className="space-y-6 pb-6 animate-pulse">
            <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-muted shrink-0" />
                <div className="space-y-2 flex-1">
                    <div className="h-6 w-32 bg-muted rounded" />
                    <div className="h-4 w-48 bg-muted rounded" />
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-12 w-full bg-muted rounded-lg" />
            </div>
            <div className="space-y-2">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-12 w-full bg-muted rounded-lg" />
                <div className="h-12 w-full bg-muted rounded-lg" />
            </div>
            <div className="space-y-2">
                <div className="h-4 w-28 bg-muted rounded" />
                <div className="h-12 w-full bg-muted rounded-lg" />
                <div className="h-12 w-full bg-muted rounded-lg" />
            </div>
        </div>
    );
}

export function UserDetailSheet({ userId, open, onOpenChange }: UserDetailSheetProps) {
    const { t } = useTranslation();
    const { details, loading, fetchDetails, reset } = useAdminUserDetails();

    useEffect(() => {
        if (userId && open) {
            fetchDetails(userId);
        }
    }, [userId, open, fetchDetails]);

    const handleOpenChange = (open: boolean) => {
        if (!open) reset();
        onOpenChange(open);
    };

    const statusLabel: Record<string, string> = {
        PENDING: t('admin.user_detail.report_pending'),
        RESOLVED: t('admin.user_detail.report_resolved'),
        DISMISSED: t('admin.user_detail.report_dismissed'),
    };

    const roomStatusLabel: Record<string, string> = {
        ACCEPTED: t('admin.user_detail.room_activa'),
        IN_REVISION: t('admin.user_detail.room_revision'),
        REJECTED: t('admin.user_detail.room_rejected'),
    };

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetContent className="w-full sm:max-w-lg flex flex-col overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-100/60 dark:from-zinc-900/90 dark:to-zinc-900/60">
                <SheetHeader className="shrink-0">
                    <SheetTitle>{t('admin.user_detail.title')}</SheetTitle>
                    <p className="text-sm text-muted-foreground">{t('admin.user_detail.subtitle')}</p>
                </SheetHeader>

                {loading && !details ? (
                    <div className="py-6 pr-4">
                        <DetailSkeleton />
                    </div>
                ) : !details ? null : (
                    <ScrollArea className="flex-1 min-h-0 pr-4">
                        <motion.div
                            initial="hidden"
                            animate="show"
                            variants={stagger}
                            className="space-y-6 pb-6"
                        >
                            {/* Profile */}
                            <motion.div variants={fadeUp} className="flex items-start gap-4">
                                <Avatar className="h-16 w-16 border shrink-0">
                                    <AvatarImage src={details.user.image || ''} />
                                    <AvatarFallback className="text-lg">{details.user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-xl font-bold truncate">{details.user.username}</h3>
                                        {details.user.role === 'ADMIN' && (
                                            <Badge className="text-[10px] uppercase font-bold bg-amber-500/10 text-amber-600 border-amber-500/20 shrink-0">{t('admin.users.role.admin')}</Badge>
                                        )}
                                        {details.user.role === 'MODERATOR' && (
                                            <Badge className="text-[10px] uppercase font-bold bg-blue-500/10 text-blue-600 border-blue-500/20 shrink-0">{t('admin.users.role.mod')}</Badge>
                                        )}
                                        {details.user.isBanned && (
                                            <Badge variant="destructive" className="text-[10px] uppercase font-bold shrink-0">{t('admin.users.role.banned')}</Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{details.user.email}</p>
                                    {details.user.name && (
                                        <p className="text-sm">{details.user.name}</p>
                                    )}
                                </div>
                            </motion.div>

                            {details.user.isBanned && details.user.banReason && (
                                <motion.div variants={fadeUp} className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                                    <span><strong>{t('admin.user_detail.ban_reason')}</strong> {details.user.banReason}</span>
                                </motion.div>
                            )}

                            {/* Bio and details */}
                            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
                                {details.user.bio && (
                                    <div className="col-span-2">
                                        <p className="text-xs text-muted-foreground mb-1">{t('admin.user_detail.bio')}</p>
                                        <p className="text-sm">{details.user.bio}</p>
                                    </div>
                                )}
                                {details.user.location && (
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> {t('admin.user_detail.location')}</p>
                                        <p className="text-sm">{details.user.location}</p>
                                    </div>
                                )}
                                {details.user.ageRange && (
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">{t('admin.user_detail.age_range')}</p>
                                        <p className="text-sm">{details.user.ageRange.replace('RANGE_', '').replace('_', '-')}</p>
                                    </div>
                                )}
                                {details.user.conversationType && (
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">{t('admin.user_detail.conversation_type')}</p>
                                        <p className="text-sm capitalize">{details.user.conversationType.toLowerCase().replace(/_/g, ' ')}</p>
                                    </div>
                                )}
                            </motion.div>

                            {details.user.hobbies.length > 0 && (
                                <motion.div variants={fadeUp}>
                                    <p className="text-xs text-muted-foreground mb-2">{t('admin.user_detail.hobbies')}</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {details.user.hobbies.map(h => (
                                            <Badge key={h.id} variant="secondary" className="text-xs">
                                                {h.icon} {h.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            <motion.div variants={fadeUp}>
                                <Separator />
                            </motion.div>

                            {/* Rooms created */}
                            <motion.div variants={fadeUp}>
                                <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                                    <Hash className="h-4 w-4 text-muted-foreground" />
                                    {t('admin.user_detail.rooms_created', { count: details.ownedRooms.length })}
                                </h4>
                                {details.ownedRooms.length === 0 ? (
                                    <p className="text-xs text-muted-foreground">{t('admin.user_detail.no_rooms')}</p>
                                ) : (
                                    <div className="space-y-2">
                                        {details.ownedRooms.map(room => (
                                            <div key={room.id} className="flex items-center justify-between p-2.5 border rounded-lg active:scale-[0.99] transition-transform duration-150">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium truncate">{room.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{room.short_description}</p>
                                                </div>
                                                <Badge variant={room.status === 'ACCEPTED' ? 'secondary' : room.status === 'IN_REVISION' ? 'outline' : 'destructive'} className="text-[10px] shrink-0 ml-2">
                                                    {roomStatusLabel[room.status] || room.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                            <motion.div variants={fadeUp}>
                                <Separator />
                            </motion.div>

                            {/* Recent activity */}
                            <motion.div variants={fadeUp}>
                                <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                    {t('admin.user_detail.recent_activity')}
                                </h4>
                                {details.recentActivity.length === 0 ? (
                                    <p className="text-xs text-muted-foreground">{t('admin.user_detail.no_activity')}</p>
                                ) : (
                                    <div className="space-y-2">
                                        {details.recentActivity.map((act, i) => (
                                            <div key={`${act.roomId}-${i}`} className="flex items-center justify-between p-2.5 border rounded-lg active:scale-[0.99] transition-transform duration-150">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium truncate">{act.room?.name || act.roomId}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {t('admin.user_detail.activity_interactions', { count: act.interactionCount })} {new Date(act.lastInteraction).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                            <motion.div variants={fadeUp}>
                                <Separator />
                            </motion.div>

                            {/* Reports received */}
                            <motion.div variants={fadeUp}>
                                <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                                    <AlertTriangle className="h-4 w-4 text-destructive" />
                                    {t('admin.user_detail.reports_received', { count: details.reportsReceived.length })}
                                </h4>
                                {details.reportsReceived.length === 0 ? (
                                    <p className="text-xs text-muted-foreground">{t('admin.user_detail.no_reports_received')}</p>
                                ) : (
                                    <div className="space-y-2">
                                        {details.reportsReceived.slice(0, 10).map(r => (
                                            <div key={r.id} className="p-2.5 border rounded-lg active:scale-[0.99] transition-transform duration-150">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs font-medium">{t('admin.user_detail.by')} @{r.reporter?.username || t('admin.user_detail.unknown')}</p>
                                                    <Badge variant={r.status === 'PENDING' ? 'destructive' : 'secondary'} className="text-[10px]">
                                                        {statusLabel[r.status] || r.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">{r.reason}{r.room ? ` · ${t('admin.reports.context.room')} ${r.room.name}` : ''}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        ))}
                                        {details.reportsReceived.length > 10 && (
                                            <p className="text-xs text-muted-foreground text-center">{t('admin.user_detail.and_more', { count: details.reportsReceived.length - 10 })}</p>
                                        )}
                                    </div>
                                )}
                            </motion.div>

                            <motion.div variants={fadeUp}>
                                <Separator />
                            </motion.div>

                            {/* Reports made */}
                            <motion.div variants={fadeUp}>
                                <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                    {t('admin.user_detail.reports_made', { count: details.reportsMade.length })}
                                </h4>
                                {details.reportsMade.length === 0 ? (
                                    <p className="text-xs text-muted-foreground">{t('admin.user_detail.no_reports_made')}</p>
                                ) : (
                                    <div className="space-y-2">
                                        {details.reportsMade.slice(0, 10).map(r => (
                                            <div key={r.id} className="p-2.5 border rounded-lg active:scale-[0.99] transition-transform duration-150">
                                                <p className="text-xs font-medium">{t('admin.user_detail.against')} @{r.reportedUser?.username || t('admin.user_detail.unknown')}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{r.reason}{r.room ? ` · ${t('admin.reports.context.room')} ${r.room.name}` : ''}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        ))}
                                        {details.reportsMade.length > 10 && (
                                            <p className="text-xs text-muted-foreground text-center">{t('admin.user_detail.and_more', { count: details.reportsMade.length - 10 })}</p>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    </ScrollArea>
                )}
            </SheetContent>
        </Sheet>
    );
}
