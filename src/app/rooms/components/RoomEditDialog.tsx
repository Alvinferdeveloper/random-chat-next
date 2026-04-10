'use client';

import { useState, useRef } from 'react';
import { Room } from '@/src/app/rooms/hooks/useRoom';
import { useUpdateRoom } from '@/src/app/rooms/hooks/useUpdateRoom';
import { useCreateRoom } from '@/src/app/rooms/create/hooks/useCreateRoom';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Loader2, Upload } from 'lucide-react';

interface RoomEditDialogProps {
    room: Room;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RoomEditDialog({ room, open, onOpenChange }: RoomEditDialogProps) {
    const { updateRoom, loading: updating } = useUpdateRoom();
    const { uploadRoomImage, uploading } = useCreateRoom();

    const [editForm, setEditForm] = useState({
        name: room.name,
        short_description: room.short_description,
        full_description: room.full_description,
    });

    const bannerInputRef = useRef<HTMLInputElement>(null);
    const iconInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'icon') => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const result = await uploadRoomImage(room.id, type, file);
            if (result.success) window.location.reload();
        } catch (error) {
            console.error(`Error uploading ${type}:`, error);
        }
    };

    const handleSaveInfo = async () => {
        const fields = Object.keys(editForm) as (keyof typeof editForm)[];
        let changed = false;
        for (const field of fields) {
            if (editForm[field] !== (room as any)[field]) {
                await updateRoom(room.id, field, editForm[field]);
                changed = true;
            }
        }
        if (changed) window.location.reload();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-[500px] bg-[#2f3136] text-white border-none shadow-2xl overflow-y-auto max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <DialogHeader>
                    <DialogTitle>Editar Sala</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Modifica los detalles y apariencia de tu sala.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Images Section */}
                    <div className="grid grid-cols-2 gap-4">
                        <ImageUploadField
                            label="Icono"
                            type="icon"
                            currentImage={room.server_icon}
                            isUploading={uploading === 'icon'}
                            inputRef={iconInputRef}
                            onFileChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'icon')}
                        />
                        <ImageUploadField
                            label="Banner"
                            type="banner"
                            currentImage={room.server_banner}
                            isUploading={uploading === 'banner'}
                            inputRef={bannerInputRef}
                            onFileChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'banner')}
                            isBanner
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                            id="name"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="bg-[#36393f] border-none text-white focus-visible:ring-blue-500"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="short_description">Descripción Corta</Label>
                        <Input
                            id="short_description"
                            value={editForm.short_description}
                            onChange={(e) => setEditForm({ ...editForm, short_description: e.target.value })}
                            className="bg-[#36393f] border-none text-white focus-visible:ring-blue-500"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="full_description">Descripción Larga</Label>
                        <Textarea
                            id="full_description"
                            value={editForm.full_description}
                            onChange={(e) => setEditForm({ ...editForm, full_description: e.target.value })}
                            className="bg-[#36393f] border-none text-white focus-visible:ring-blue-500 min-h-[100px]"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleSaveInfo}
                        disabled={updating}
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                    >
                        {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Guardar Información
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function ImageUploadField({ label, currentImage, isUploading, inputRef, onFileChange, isBanner }: any) {
    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <input type="file" ref={inputRef} onChange={onFileChange} className="hidden" accept="image/*" />
            <div
                onClick={() => inputRef.current?.click()}
                className={`${isBanner ? 'h-24 w-full rounded-lg' : 'h-24 w-24 rounded-full'} border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-500/10 transition-all overflow-hidden relative group`}
            >
                {isUploading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                ) : currentImage ? (
                    <>
                        <img src={currentImage} alt={label} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Upload className="h-5 w-5" />
                        </div>
                    </>
                ) : (
                    <Upload className="h-6 w-6 text-gray-400" />
                )}
            </div>
        </div>
    );
}
