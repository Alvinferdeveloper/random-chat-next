'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/src/components/ui/button';
import { X, LucideIcon } from 'lucide-react';

export interface BulkAction {
    key: string;
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    variant?: 'default' | 'destructive' | 'outline';
}

interface BulkActionBarProps {
    count: number;
    onClear: () => void;
    actions: BulkAction[];
    isSubmitting?: boolean;
}

export function BulkActionBar({ count, onClear, actions, isSubmitting }: BulkActionBarProps) {
    const { t } = useTranslation();

    return (
        <AnimatePresence>
            {count > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-xl border border-border/50 bg-background shadow-2xl px-4 py-3"
                >
                    <button
                        onClick={onClear}
                        className="flex items-center justify-center h-6 w-6 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer shrink-0"
                        aria-label={t('admin.bulk.clear')}
                        disabled={isSubmitting}
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-sm font-medium whitespace-nowrap">{t('admin.bulk.selected', { count })}</span>
                    <div className="w-px h-5 bg-border shrink-0" />
                    <div className="flex items-center gap-2">
                        {actions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <Button
                                    key={action.key}
                                    size="sm"
                                    variant={action.variant || 'default'}
                                    className="gap-1.5 cursor-pointer active:scale-[0.98]"
                                    onClick={action.onClick}
                                    disabled={isSubmitting}
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                    {action.label}
                                </Button>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
