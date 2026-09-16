'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCategories } from '@/src/app/tribus/create/hooks/useCategories';
import { CategorySelector } from '@/src/app/tribus/create/components/CategorySelector';
import { Button } from '@/src/components/ui/button';
import { Loader2 } from 'lucide-react';
import { AdminRoom } from '../hooks/useAdminRooms';
import { toast } from 'sonner';

interface EditCategoriesDialogProps {
    room: AdminRoom;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdateCategories: (roomId: string, categoryIds: string[]) => Promise<{ success: boolean; message?: string }>;
    onUpdate: (roomId: string, updates: Partial<AdminRoom>) => void;
}

export default function EditCategoriesDialog({ room, open, onOpenChange, onUpdateCategories, onUpdate }: EditCategoriesDialogProps) {
    const { t } = useTranslation();
    const { categories: allCategories, loading: categoriesLoading } = useCategories();
    const [selectedIds, setSelectedIds] = useState<string[]>(room.categories?.map(c => c.id) || []);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (open) setSelectedIds(room.categories?.map(c => c.id) || []);
    }, [open, room]);

    const originalIds = (room.categories?.map(c => c.id) || []).sort();
    const hasChanges = JSON.stringify([...selectedIds].sort()) !== JSON.stringify(originalIds);

    const handleSave = async () => {
        setIsSaving(true);
        const result = await onUpdateCategories(room.id, selectedIds);
        setIsSaving(false);

        if (result.success) {
            onUpdate(room.id, { categories: allCategories.filter(c => selectedIds.includes(c.id)) });
            toast.success(t('admin.rooms.categories_saved'));
            onOpenChange(false);
        } else {
            toast.error(t(result.message || 'admin.rooms.categories_error'));
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => onOpenChange(false)}>
            <div className="bg-background rounded-xl shadow-2xl border p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-semibold mb-1">{t('admin.rooms.edit_categories_title')}</h3>
                <p className="text-sm text-muted-foreground mb-5">{t('admin.rooms.edit_categories_desc', { name: room.name })}</p>

                <CategorySelector
                    categories={allCategories}
                    selectedIds={selectedIds}
                    onChange={setSelectedIds}
                    loading={categoriesLoading}
                />

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
