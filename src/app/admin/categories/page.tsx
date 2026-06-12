'use client';

import { useState } from 'react';
import { useAdminCategories } from '@/src/app/admin/hooks/useAdminCategories';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { 
    Plus, 
    Search, 
    Edit2, 
    Trash2, 
    Loader2, 
    Tag,
    X,
    Check
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

export default function AdminCategoriesPage() {
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
        let success = false;
        
        if (editingCategory) {
            success = await updateCategory(editingCategory.id, formData.name, formData.icon);
        } else {
            success = await createCategory(formData.name, formData.icon);
        }

        if (success) {
            setIsDialogOpen(false);
        }
        setIsSubmitting(false);
    };

    const handleDeleteClick = (id: string) => {
        setCategoryToDelete(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (categoryToDelete) {
            setIsSubmitting(true);
            await deleteCategory(categoryToDelete);
            setIsSubmitting(false);
            setIsConfirmOpen(false);
            setCategoryToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Gestión de Categorías</h1>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Nueva Categoría
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar categorías..."
                            className="pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Cargando categorías...</p>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-20 bg-muted/20 rounded-xl border-2 border-dashed">
                            <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <p className="text-muted-foreground font-medium">No se encontraron categorías.</p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {categories.map((category) => (
                                <div 
                                    key={category.id} 
                                    className="flex items-center justify-between p-4 border rounded-xl hover:bg-secondary/20 transition-colors group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {category.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold">{category.name}</h3>
                                            <p className="text-xs text-muted-foreground">ID: {category.id}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleOpenDialog(category)}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:bg-destructive/10"
                                            onClick={() => handleDeleteClick(category.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
                {pagination && pagination.totalPages > 1 && (
                    <div className="border-t p-4">
                        <Pagination 
                            currentPage={page}
                            totalPages={pagination.totalPages}
                            onPageChange={setPage}
                            isLoading={loading}
                        />
                    </div>
                )}
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Nombre de la Categoría</label>
                            <Input 
                                placeholder="Ej: Gaming, Música, Arte..." 
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Icono (URL o Clase)</label>
                            <Input 
                                placeholder="Opcional" 
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting || !formData.name.trim()}>
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                            {editingCategory ? 'Actualizar' : 'Crear Categoría'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Eliminar Categoría"
                description="¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer y podría afectar a las salas que la utilicen."
                confirmText="Eliminar"
                variant="destructive"
                isLoading={isSubmitting}
            />
        </div>
    );
}
