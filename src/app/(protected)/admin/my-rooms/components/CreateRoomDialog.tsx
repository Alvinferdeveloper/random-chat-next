'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CategorySelector } from '@/src/app/rooms/create/components/CategorySelector';
import { useCategories } from '@/src/app/rooms/create/hooks/useCategories';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CreateRoomDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreate: (data: { name: string; short_description: string; full_description: string; categoryIds?: string[] }) => Promise<any>;
}

export default function CreateRoomDialog({ open, onOpenChange, onCreate }: CreateRoomDialogProps) {
    const { t } = useTranslation();
    const { categories: allCategories, loading: categoriesLoading } = useCategories();
    const [isCreating, setIsCreating] = useState(false);

    const [form, setForm] = useState({
        name: '',
        short_description: '',
        full_description: '',
    });
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

    const handleCreate = async () => {
        setIsCreating(true);
        const result = await onCreate({
            ...form,
            categoryIds: selectedCategoryIds,
        });
        setIsCreating(false);

        if (result.success) {
            toast.success(t('admin.my_rooms.create_success'));
            setForm({ name: '', short_description: '', full_description: '' });
            setSelectedCategoryIds([]);
            onOpenChange(false);
        } else {
            toast.error(t(result.message || 'admin.my_rooms.create_error'));
        }
    };

    const isValid =
        form.name.trim().length >= 3 &&
        form.short_description.trim().length >= 10 &&
        form.full_description.trim().length >= 20;

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => onOpenChange(false)}>
            <div
                className="bg-background rounded-xl shadow-2xl border p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-lg font-semibold mb-1">{t('admin.my_rooms.create_dialog_title')}</h3>
                <p className="text-sm text-muted-foreground mb-5">{t('admin.my_rooms.create_dialog_desc')}</p>

                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="admin-room-name">{t('rooms.create.form.name_label')}</Label>
                        <Input
                            id="admin-room-name"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            placeholder={t('rooms.create.form.name_placeholder')}
                            maxLength={45}
                        />
                        <p className="text-[11px] text-muted-foreground">{form.name.length}/45</p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="admin-room-short">{t('rooms.create.form.short_desc_label')}</Label>
                        <Input
                            id="admin-room-short"
                            value={form.short_description}
                            onChange={e => setForm({ ...form, short_description: e.target.value })}
                            placeholder={t('rooms.create.form.short_desc_placeholder')}
                            maxLength={45}
                        />
                        <p className="text-[11px] text-muted-foreground">{form.short_description.length}/45</p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="admin-room-full">{t('rooms.create.form.full_desc_label')}</Label>
                        <Textarea
                            id="admin-room-full"
                            value={form.full_description}
                            onChange={e => setForm({ ...form, full_description: e.target.value })}
                            placeholder={t('rooms.create.form.full_desc_placeholder')}
                            maxLength={300}
                            className="min-h-[80px]"
                        />
                        <p className="text-[11px] text-muted-foreground">{form.full_description.length}/300</p>
                    </div>

                    <div className="grid gap-2">
                        <CategorySelector
                            categories={allCategories}
                            selectedIds={selectedCategoryIds}
                            onChange={setSelectedCategoryIds}
                            loading={categoriesLoading}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        {t('admin.categories.cancel')}
                    </Button>
                    <Button onClick={handleCreate} disabled={isCreating || !isValid}>
                        {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('admin.my_rooms.create_dialog_confirm')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
