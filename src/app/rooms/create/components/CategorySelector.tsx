'use client';

import { useState } from 'react';
import { X, Check, Search } from 'lucide-react';
import { Category } from '../hooks/useCategories';
import { useCategorySearch } from '../hooks/useCategorySearch';
import { Loader2 } from 'lucide-react';

interface CategorySelectorProps {
    categories: Category[];
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    loading?: boolean;
}

export function CategorySelector({ categories, selectedIds, onChange, loading }: CategorySelectorProps) {
    const [showSearch, setShowSearch] = useState(false);
    const { categories: searchResults, loading: searchLoading, search, setSearch } = useCategorySearch();

    const selectedCategories = categories.filter(c => selectedIds.includes(c.id));

    // When search is active but empty, show original categories; when searching, show results
    const displayCategories = showSearch && search ? searchResults : categories;
    const availableCategories = displayCategories.filter(c => !selectedIds.includes(c.id));

    const addCategory = (id: string) => {
        onChange([...selectedIds, id]);
    };

    const removeCategory = (id: string) => {
        onChange(selectedIds.filter(cId => cId !== id));
    };

    const openSearch = () => {
        setShowSearch(true);
        setSearch('');
    };

    const closeSearch = () => {
        setShowSearch(false);
        setSearch('');
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">Categorías</label>

            {/* Selected categories as tags */}
            <div className="flex flex-wrap gap-1.5">
                {selectedCategories.map(category => (
                    <button
                        key={category.id}
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-secondary px-2 py-0.5 text-xs font-medium gap-1 hover:bg-destructive/20 hover:text-destructive transition-colors cursor-pointer"
                        onClick={() => removeCategory(category.id)}
                    >
                        {category.icon && <span>{category.icon}</span>}
                        {category.name}
                        <X className="h-3 w-3" />
                    </button>
                ))}
            </div>

            {/* Available categories */}
            {selectedIds.length < 3 && (
                <div className="space-y-2 pt-1">
                    {showSearch && (
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar categoría..."
                                className="w-full rounded-md border border-input bg-background px-3 py-2 pl-8 text-sm"
                                autoFocus
                            />
                        </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1.5">
                        {showSearch && searchLoading || loading ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm">Cargando...</span>
                            </div>
                        ) : availableCategories.length === 0 ? (
                            <span className="text-muted-foreground text-sm">
                                {showSearch && search ? 'No se encontraron' : 'No hay más categorías'}
                            </span>
                        ) : (
                            availableCategories.map(category => (
                                <button
                                    key={category.id}
                                    type="button"
                                    className="inline-flex items-center justify-center rounded-md border border-input bg-background px-2 py-0.5 text-xs font-medium gap-1 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                                    onClick={() => addCategory(category.id)}
                                >
                                    {category.icon && <span>{category.icon}</span>}
                                    {category.name}
                                    <Check className="h-3 w-3" />
                                </button>
                            ))
                        )}
                    </div>
                    
                    {categories.length > 3 && !showSearch && (
                        <button
                            type="button"
                            className="text-xs text-muted-foreground underline hover:text-foreground"
                            onClick={openSearch}
                        >
                            + Buscar más
                        </button>
                    )}

                    {showSearch && search === '' && (
                        <button
                            type="button"
                            className="text-xs text-muted-foreground underline hover:text-foreground"
                            onClick={closeSearch}
                        >
                            - Cerrar búsqueda
                        </button>
                    )}
                </div>
            )}

            {selectedIds.length >= 3 && (
                <p className="text-xs text-muted-foreground">
                    Máximo 3 categorías seleccionadas
                </p>
            )}
        </div>
    );
}