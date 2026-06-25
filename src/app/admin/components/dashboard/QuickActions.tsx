'use client';

import { Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function QuickActions({ onBroadcast }: { onBroadcast: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
            <h2 className="text-lg font-semibold tracking-tight mb-4">Acciones R&aacute;pidas</h2>
                <button
                    onClick={onBroadcast}
                    className="w-full border rounded-xl p-5 flex items-center gap-4 text-left hover:bg-accent/30 transition-all duration-200 ease-out active:scale-[0.98] group"
                >
                    <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200 shrink-0">
                        <Megaphone className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">Anuncio Global</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Enviar mensaje del sistema a todas las salas activas</p>
                    </div>
                </button>
        </motion.div>
    );
}
