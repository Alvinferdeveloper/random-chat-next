'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronLast } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const ease = [0.23, 1, 0.32, 1] as const;

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
    className?: string;
}

function PageButton({ page, active, onClick, disabled }: { page: number; active: boolean; onClick: () => void; disabled: boolean }) {
    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "relative w-9 h-9 rounded-xl text-sm font-medium transition-colors duration-150 cursor-pointer select-none",
                active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
        >
            {active && (
                <motion.span
                    layoutId="activePage"
                    className="absolute inset-0 rounded-xl bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
            )}
            <span className="relative z-10">{page}</span>
        </motion.button>
    );
}

function NavButton({ children, onClick, disabled, label }: { children: React.ReactNode; onClick: () => void; disabled: boolean; label: string }) {
    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            className={cn(
                "flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer select-none",
                "text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150",
                "disabled:opacity-30 disabled:pointer-events-none"
            )}
        >
            {children}
        </motion.button>
    );
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    isLoading = false,
    className
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className={cn("flex flex-col items-center gap-3 px-2 py-4", className)}>
            <div className="flex items-center gap-1">
                <NavButton onClick={() => onPageChange(1)} disabled={currentPage === 1 || isLoading} label="Primera pagina">
                    <ChevronsLeft className="w-4 h-4" />
                </NavButton>
                <NavButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1 || isLoading} label="Pagina anterior">
                    <ChevronLeft className="w-4 h-4" />
                </NavButton>

                <div className="flex items-center gap-1 mx-1">
                    {pages.map((i) => (
                        <PageButton
                            key={i}
                            page={i}
                            active={currentPage === i}
                            onClick={() => onPageChange(i)}
                            disabled={isLoading}
                        />
                    ))}
                </div>

                <NavButton onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages || isLoading} label="Pagina siguiente">
                    <ChevronRight className="w-4 h-4" />
                </NavButton>
                <NavButton onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages || isLoading} label="Ultima pagina">
                    <ChevronLast className="w-4 h-4" />
                </NavButton>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-muted-foreground/60 font-medium tracking-wide"
            >
                Pagina {currentPage} de {totalPages}
            </motion.div>
        </div>
    );
}
