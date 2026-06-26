'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAdminCategories } from './hooks/useAdminCategories';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Tag,
    Hash,
    Music,
    Gamepad2,
    Palette,
    Globe,
    Coffee,
    Brain,
    Zap,
    Flame,
    Users,
    BookOpen,
    LucideIcon
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/src/components/ui/dialog';
import { ConfirmDialog } from '@/src/app/components/shared/ConfirmDialog';
import { Pagination } from '@/src/app/components/shared/Pagination';
import { toast } from 'sonner';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
    gaming: Gamepad2,
    musica: Music,
    music: Music,
    arte: Palette,
    art: Palette,
    tecnologia: Zap,
    tech: Zap,
    cultura: Globe,
    social: Users,
    libros: BookOpen,
    books: BookOpen,
    ocio: Coffee,
    hobbies: Coffee,
    educacion: Brain,
    education: Brain,
    tendencias: Flame,
    general: Hash,
};

const CATEGORY_COLORS = [
    { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800/50', dot: 'bg-blue-500' },
    { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800/50', dot: 'bg-emerald-500' },
    { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800/50', dot: 'bg-amber-500' },
    { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800/50', dot: 'bg-rose-500' },
    { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200 dark:border-violet-800/50', dot: 'bg-violet-500' },
    { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-800/50', dot: 'bg-cyan-500' },
    { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800/50', dot: 'bg-orange-500' },
    { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-200 dark:border-pink-800/50', dot: 'bg-pink-500' },
];

function CategorySkeleton() {
    return (
        <div className="h-14 rounded-xl border border-border/50 bg-gradient-to-br from-zinc-100 to-zinc-100/60 dark:from-zinc-900/90 dark:to-zinc-900/60 animate-pulse flex items-center gap-3 px-4">
            <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
            <div className="h-4 w-28 bg-muted rounded" />
        </div>
    );
}

export default function AdminCategoriesPage() {
    const { t } = useTranslation();
    const {
        categories,
        pagination,
        loading,
        search,
        setSearch,
        page,
        setPage,
        createCategory,
        updateCategory,
        deleteCategory
    } = useAdminCategories();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    const [editingCategory, setEditingCategory] = useState<{ id: string, name: string, icon: string | null } | null>(null);
    const [formData, setFormData] = useState({ name: '', icon: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOpenDialog = (category?: any) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, icon: category.icon || '' });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', icon: '' });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) return;

        setIsSubmitting(true);
        let result;

        if (editingCategory) {
            result = await updateCategory(editingCategory.id, formData.name, formData.icon);
        } else {
            result = await createCategory(formData.name, formData.icon);
        }

        if (result.success) {
            toast.success(editingCategory ? t('admin.toast.category_updated') : t('admin.toast.category_created'));
            setIsDialogOpen(false);
        } else if (result.message) {
            toast.error(result.message);
        }

        setIsSubmitting(false);
    };

    const handleDeleteClick = (id: string) => {
        setCategoryToDelete(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!categoryToDelete) return;

        setIsSubmitting(true);
        const result = await deleteCategory(categoryToDelete);
        if (result.success) {
            toast.success(t('admin.toast.category_deleted'));
        } else if (result.message) {
            toast.error(result.message);
        }
        setIsSubmitting(false);
        setIsConfirmOpen(false);
        setCategoryToDelete(null);
    };

    const getCategoryIcon = (name: string) => {
        const key = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const Icon = CATEGORY_ICONS[key] || CATEGORY_ICONS[Object.keys(CATEGORY_ICONS).find(k => key.includes(k)) || ''];
        return Icon || Tag;
    };

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{t('admin.categories.title')}</h1>
                    <p className="text-sm text-muted-foreground mt-1">{t('admin.categories.subtitle')}</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="gap-2 active:scale-[0.98] cursor-pointer">
                    <Plus className="w-4 h-4" />
                    {t('admin.categories.new_button')}
                </Button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1], delay: 0.05 }}
                className="relative w-full max-w-sm"
            >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={t('admin.categories.search_placeholder')}
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </motion.div>

            {loading ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-wrap gap-3"
                >
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <CategorySkeleton key={i} />
                    ))}
                </motion.div>
            ) : categories.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center"
                >
                    <Tag className="h-10 w-10 text-muted-foreground/30 mb-4" />
                    <p className="text-lg font-medium mb-1">{t('admin.categories.empty_title')}</p>
                    <p className="text-sm text-muted-foreground">{t('admin.categories.empty_desc')}</p>
                </motion.div>
            ) : (
                <>
                    <div className="flex flex-wrap gap-3">
                        {categories.map((category, index) => {
                            const Icon = getCategoryIcon(category.name);
                            const colorIndex = index % CATEGORY_COLORS.length;
                            const color = CATEGORY_COLORS[colorIndex];

                            return (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, scale: 0.92 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1], delay: index * 0.03 }}
                                    className="group relative"
                                >
                                    <div className={`
                                        flex items-center gap-2.5 px-4 py-2.5 rounded-xl border cursor-default
                                        transition-all duration-200 ease-out active:scale-[0.98]
                                        ${color.bg} ${color.border} ${color.text}
                                    `}>
                                        <Icon className="w-4 h-4 shrink-0" />
                                        <span className="text-sm font-semibold">{category.name}</span>

                                        <div className="flex items-center gap-0.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                            <div className="w-px h-5 bg-current/20 mx-1" />
                                            <button
                                                onClick={() => handleOpenDialog(category)}
                                                className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors active:scale-[0.95]"
                                                title={t('admin.categories.edit_tooltip')}
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(category.id)}
                                                className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors active:scale-[0.95] text-red-600 dark:text-red-400"
                                                title={t('admin.categories.delete_tooltip')}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex justify-center pt-4">
                            <Pagination
                                currentPage={page}
                                totalPages={pagination.totalPages}
                                onPageChange={setPage}
                                isLoading={loading}
                            />
                        </div>
                    )}
                </>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-zinc-100 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                    <DialogHeader>
                        <DialogTitle>
                            {editingCategory ? t('admin.categories.edit_dialog_title') : t('admin.categories.new_dialog_title')}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">{t('admin.categories.name_label')}</label>
                            <Input
                                placeholder={t('admin.categories.name_placeholder')}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">{t('admin.categories.icon_label')}</label>
                            <Input
                                placeholder={t('admin.categories.icon_placeholder')}
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="active:scale-[0.98] cursor-pointer">
                            {t('admin.categories.cancel')}
                        </Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting || !formData.name.trim()} className="active:scale-[0.98] cursor-pointer">
                            {editingCategory ? t('admin.categories.update') : t('admin.categories.create')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title={t('admin.categories.delete_title')}
                description={t('admin.categories.delete_description')}
                confirmText={t('admin.categories.delete_confirm')}
                variant="destructive"
                isLoading={isSubmitting}
            />
        </div>
    );
}
