'use client';

import { Button } from '@/src/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronLast } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
    className?: string;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    isLoading = false,
    className
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Button
                    key={i}
                    variant={currentPage === i ? "default" : "outline"}
                    size="sm"
                    className="w-9 h-9 p-0 rounded-lg"
                    onClick={() => onPageChange(i)}
                    disabled={isLoading}
                >
                    {i}
                </Button>
            );
        }
        return pages;
    };

    return (
        <div className={cn("flex items-center justify-between px-2 py-4", className)}>
            <div className="flex-1 text-sm text-muted-foreground hidden sm:block">
                Página {currentPage} de {totalPages}
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-lg"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1 || isLoading}
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-lg"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center space-x-1">
                    {renderPageNumbers()}
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-lg"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-lg"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages || isLoading}
                >
                    <ChevronLast className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
