'use client';

import { useState } from 'react';
import { Room } from '@/src/app/rooms/hooks/useRoom';
import { Settings, Trash2, Heart, Loader2 } from 'lucide-react';
import { RoomEditDialog } from '@/src/app/rooms/components/RoomEditDialog';

interface RoomCardActionsProps {
    room: Room;
    isOwner: boolean;
    isFavorite: boolean;
    onToggleFavorite: (e: React.MouseEvent) => void;
    onDelete?: (roomId: string) => Promise<void>;
}

export function RoomCardActions({ room, isOwner, isFavorite, onToggleFavorite, onDelete }: RoomCardActionsProps) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!onDelete) return;

        if (confirm('¿Estás seguro de que quieres eliminar esta sala?')) {
            setIsDeleting(true);
            try {
                await onDelete(room.id);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleOpenEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditDialogOpen(true);
    };

    return (
        <div className="absolute top-2 right-2 flex gap-2 z-20">
            {isOwner && (
                <>
                    <button
                        onClick={handleOpenEdit}
                        className="p-2 cursor-pointer rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all group/settings"
                        aria-label="Edit room"
                    >
                        <Settings className="w-5 h-5 text-white group-hover/settings:rotate-90 transition-transform duration-300" />
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-2 cursor-pointer rounded-full bg-red-500/40 backdrop-blur-sm hover:bg-red-500/60 transition-all text-white disabled:opacity-50"
                        aria-label="Delete room"
                    >
                        {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                    </button>

                    <RoomEditDialog
                        room={room}
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                    />
                </>
            )}

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(e);
                }}
                className="p-2 cursor-pointer rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all z-20 group/heart"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
                <Heart
                    className={`w-5 h-5 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-white group-hover/heart:text-red-400"}`}
                />
            </button>
        </div>
    );
}
