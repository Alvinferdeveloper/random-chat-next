'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCategories } from '@/src/app/rooms/create/hooks/useCategories';
import { useCreateRoom } from '@/src/app/rooms/create/hooks/useCreateRoom';
import { useUpdateRoom } from '@/src/app/rooms/hooks/useUpdateRoom';
import { CategorySelector } from '@/src/app/rooms/create/components/CategorySelector';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import { Button } from '@/src/components/ui/button';
import { Loader2, Upload } from 'lucide-react';
import { AdminMyRoom } from '../hooks/useAdminMyRooms';
import { toast } from 'sonner';

interface EditRoomDialogProps {
    room: AdminMyRoom;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate: (roomId: string, updates: Partial<AdminMyRoom>) => void;
    onUpdateCategories: (roomId: string, categoryIds: string[]) => Promise<any>;
}

export default function EditRoomDialog({ room, open, onOpenChange, onUpdate, onUpdateCategories }: EditRoomDialogProps) {
    const { t } = useTranslation();
    const { categories: allCategories, loading: categoriesLoading } = useCategories();
    const { uploadRoomImage, uploading } = useCreateRoom();
    const { updateRoom: patchRoom, loading: patching } = useUpdateRoom();

    const [form, setForm] = useState({
        name: room.name,
        short_description: room.short_description,
        full_description: room.full_description,
    });
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(room.categories.map(c => c.id));
    const [selectedBanner, setSelectedBanner] = useState<File | null>(null);
    const [selectedIcon, setSelectedIcon] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [iconPreview, setIconPreview] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const bannerInputRef = useRef<HTMLInputElement>(null);
    const iconInputRef = useRef<HTMLInputElement>(null);

    const resetForm = () => {
        setForm({ name: room.name, short_description: room.short_description, full_description: room.full_description });
        setSelectedCategoryIds(room.categories.map(c => c.id));
        setSelectedBanner(null);
        setSelectedIcon(null);
        setBannerPreview(null);
        setIconPreview(null);
    };

    useEffect(() => {
        if (open) resetForm();
    }, [open]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'icon') => {
        const file = e.target.files?.[0];
        if (!file) return;
        const preview = URL.createObjectURL(file);
        if (type === 'banner') { setSelectedBanner(file); setBannerPreview(preview); }
        else { setSelectedIcon(file); setIconPreview(preview); }
    };

    const hasChanges =
        form.name !== room.name ||
        form.short_description !== room.short_description ||
        form.full_description !== room.full_description ||
        JSON.stringify([...selectedCategoryIds].sort()) !== JSON.stringify(room.categories.map(c => c.id).sort()) ||
        selectedBanner !== null ||
        selectedIcon !== null;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const patch: Partial<AdminMyRoom> = {};

            if (selectedBanner) {
                const res = await uploadRoomImage(room.id, 'banner', selectedBanner);
                if (res?.publicUrl) patch.server_banner = res.publicUrl;
            }
            if (selectedIcon) {
                const res = await uploadRoomImage(room.id, 'icon', selectedIcon);
                if (res?.publicUrl) patch.server_icon = res.publicUrl;
            }

            const fields: [keyof typeof form, string][] = [
                ['name', 'name'], ['short_description', 'short_description'], ['full_description', 'full_description'],
            ];
            for (const [key, apiField] of fields) {
                if (form[key] !== (room as any)[key]) {
                    await patchRoom(room.id, apiField, form[key]);
                    (patch as any)[key] = form[key];
                }
            }

            const origIds = room.categories.map(c => c.id).sort();
            const newIds = [...selectedCategoryIds].sort();
            if (JSON.stringify(origIds) !== JSON.stringify(newIds)) {
                await onUpdateCategories(room.id, selectedCategoryIds);
                patch.categories = allCategories.filter(c => selectedCategoryIds.includes(c.id));
            }

            if (Object.keys(patch).length > 0) {
                onUpdate(room.id, patch);
            }

            toast.success(t('admin.my_rooms.edit_success'));
            onOpenChange(false);
        } catch (err: any) {
            toast.error(t(err.message || 'admin.my_rooms.edit_error'));
        } finally {
            setIsSaving(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => onOpenChange(false)}>
            <div className="bg-background rounded-xl shadow-2xl border p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-semibold mb-1">{t('admin.my_rooms.edit_dialog_title')}</h3>
                <p className="text-sm text-muted-foreground mb-5">{t('admin.my_rooms.edit_dialog_desc')}</p>

                <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <ImageUpload label={t('rooms.edit.icon_label')} inputRef={iconInputRef} preview={iconPreview || room.server_icon} uploading={uploading === 'icon'} onChange={e => handleFileChange(e, 'icon')} rounded="full" />
                        <ImageUpload label={t('rooms.edit.banner_label')} inputRef={bannerInputRef} preview={bannerPreview || room.server_banner} uploading={uploading === 'banner'} onChange={e => handleFileChange(e, 'banner')} />
                    </div>

                    <Field label={t('rooms.create.form.name_label')} value={form.name} max={45}
                        onChange={v => setForm({ ...form, name: v })} />
                    <Field label={t('rooms.create.form.short_desc_label')} value={form.short_description} max={45}
                        onChange={v => setForm({ ...form, short_description: v })} />
                    <Field label={t('rooms.create.form.full_desc_label')} value={form.full_description} max={300} textarea
                        onChange={v => setForm({ ...form, full_description: v })} />

                    <div className="grid gap-2">
                        <CategorySelector categories={allCategories} selectedIds={selectedCategoryIds} onChange={setSelectedCategoryIds} loading={categoriesLoading} />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>{t('admin.categories.cancel')}</Button>
                    <Button onClick={handleSave} disabled={isSaving || !hasChanges}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('admin.my_rooms.edit_dialog_save')}
                    </Button>
                </div>
            </div>
        </div>
    );
}

function ImageUpload({ label, inputRef, preview, uploading, onChange, rounded = 'lg' }: {
    label: string; inputRef: React.RefObject<HTMLInputElement | null>; preview: string | null;
    uploading: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; rounded?: string;
}) {
    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <input type="file" ref={inputRef} onChange={onChange} className="hidden" accept="image/*" />
            <div onClick={() => inputRef.current?.click()}
                className={`h-24 ${rounded === 'full' ? 'w-24 rounded-full' : 'w-full rounded-lg'} border-2 border-dashed border-muted-foreground/30 flex items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all overflow-hidden relative group ${rounded === 'full' ? 'mx-auto' : ''}`}>
                {uploading ? <Loader2 className="h-5 w-5 animate-spin" />
                    : preview ? (
                        <>
                            <img src={preview} alt={label} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload className="h-4 w-4 text-white" />
                            </div>
                        </>
                    ) : <Upload className="h-5 w-5 text-muted-foreground/40" />}
            </div>
        </div>
    );
}

function Field({ label, value, max, onChange, textarea }: {
    label: string; value: string; max: number; onChange: (v: string) => void; textarea?: boolean;
}) {
    const Comp = textarea ? Textarea : Input;
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            <Comp value={value} onChange={e => onChange(e.target.value)} maxLength={max}
                {...(textarea ? { className: 'min-h-[80px]' } : {})} />
            <p className="text-[11px] text-muted-foreground">{value.length}/{max}</p>
        </div>
    );
}
