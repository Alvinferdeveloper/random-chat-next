'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Hash, Trash2, Pencil } from 'lucide-react';
import { AdminMyRoom } from '../hooks/useAdminMyRooms';
import { getRoomStatusConfig } from '@/src/app/utils/ui';
import { ConfirmDialog } from '@/src/app/components/shared/ConfirmDialog';
import { toast } from 'sonner';
import { cn } from '@/src/lib/utils';
import EditRoomDialog from './EditRoomDialog';

interface AdminRoomCardProps {
    room: AdminMyRoom;
    index: number;
    onDelete: (roomId: string) => Promise<any>;
    onUpdate: (roomId: string, updates: Partial<AdminMyRoom>) => void;
    onUpdateCategories: (roomId: string, categoryIds: string[]) => Promise<any>;
}

export default function AdminRoomCard({ room, index, onDelete, onUpdate, onUpdateCategories }: AdminRoomCardProps) {
    const { t } = useTranslation();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const statusConfig = getRoomStatusConfig(room.status);

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await onDelete(room.id);
        setIsDeleting(false);
        if (result.success) toast.success(t('admin.my_rooms.delete_success'));
        else toast.error(t('admin.my_rooms.delete_error'));
        setIsDeleteOpen(false);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1], delay: index * 0.05 }}
            >
                <Card className="flex flex-col h-full overflow-hidden border-border/50 bg-gradient-to-br from-zinc-100 to-zinc-100/60 dark:from-zinc-900/90 dark:to-zinc-900/60">
                    <div className="relative h-44 w-full bg-muted">
                        {room.server_banner ? (
                            <Image unoptimized src={room.server_banner} alt={room.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" />
                        ) : (
                            <div className="flex h-full items-center justify-center"><Hash className="h-10 w-10 text-muted-foreground/30" /></div>
                        )}
                        <Badge className={cn("absolute top-3 right-3 text-[10px] uppercase tracking-wider shadow-sm", statusConfig.className)}>
                            {t(statusConfig.labelKey)}
                        </Badge>
                        <div className="absolute -bottom-6 left-6 h-14 w-14 overflow-hidden rounded-full border-4 border-background bg-background shadow-sm">
                            {room.server_icon ? (
                                <Image src={room.server_icon} alt={room.name} fill className="object-cover" sizes="56px" />
                            ) : (
                                <div className="flex h-full items-center justify-center bg-primary text-primary-foreground text-sm font-bold">{room.name.charAt(0)}</div>
                            )}
                        </div>
                    </div>

                    <CardHeader className="mt-6 pb-2">
                        <div className="flex items-center justify-between gap-2">
                            <CardTitle className="text-lg truncate">{room.name}</CardTitle>
                            {room.verified && <Badge variant="secondary" className="shrink-0 text-[10px] px-1.5 py-0 h-5">{t('admin.rooms.verified')}</Badge>}
                        </div>
                        <CardDescription className="line-clamp-1">{room.short_description}</CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 space-y-3 text-sm">
                        <div>
                            <p className="text-xs text-muted-foreground/70 font-medium mb-1">{t('admin.rooms.full_desc')}</p>
                            <p className="text-muted-foreground/80 line-clamp-3 leading-relaxed">{room.full_description}</p>
                        </div>
                        {room.categories.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {room.categories.map(cat => (
                                    <Badge key={cat.id} variant="secondary" className="text-[10px]">
                                        {cat.icon && <span className="mr-1">{cat.icon}</span>}{cat.name}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex justify-between gap-3 pt-4 border-t border-border">
                        <Button variant="outline" className="flex-1 gap-2 active:scale-[0.98] cursor-pointer" onClick={() => setIsEditOpen(true)}>
                            <Pencil className="h-4 w-4" />{t('admin.my_rooms.edit')}
                        </Button>
                        <Button variant="outline" className="gap-2 active:scale-[0.98] cursor-pointer text-red-600 hover:text-red-600 hover:bg-red-500/10 border-red-500/20 hover:border-red-500/30" onClick={() => setIsDeleteOpen(true)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>

            <EditRoomDialog room={room} open={isEditOpen} onOpenChange={setIsEditOpen} onUpdate={onUpdate} onUpdateCategories={onUpdateCategories} />

            <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDelete}
                title={t('admin.my_rooms.delete_title')} description={t('admin.my_rooms.delete_desc')}
                confirmText={t('admin.my_rooms.delete_confirm')} variant="destructive" isLoading={isDeleting} />
        </>
    );
}
