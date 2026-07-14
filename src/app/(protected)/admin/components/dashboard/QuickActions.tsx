'use client';

import { Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function QuickActions({ onBroadcast }: { onBroadcast: () => void }) {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
            <h2 className="text-lg font-semibold tracking-tight mb-4">{t('admin.quick_actions.title')}</h2>
                <button
                    onClick={onBroadcast}
                    className="w-full border rounded-xl p-5 flex items-center gap-4 text-left hover:bg-accent/30 transition-all duration-200 ease-out active:scale-[0.98] group"
                >
                    <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200 shrink-0">
                        <Megaphone className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">{t('admin.quick_actions.global_announcement')}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{t('admin.quick_actions.global_announcement_desc')}</p>
                    </div>
                </button>
        </motion.div>
    );
}
