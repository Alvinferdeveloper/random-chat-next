'use client';

import { Button } from '@/src/components/ui/button';
import { motion } from 'framer-motion';

interface GlobalSetting {
    key: string;
    value: string;
    description?: string;
    updatedAt: string;
}

export default function SystemSettings({
    settings,
    loading,
    onToggle,
}: {
    settings: GlobalSetting[];
    loading: boolean;
    onToggle: (key: string, currentValue: string) => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
            <h2 className="text-lg font-semibold tracking-tight mb-4">Ajustes del Sistema</h2>

            {loading ? (
                <div className="border rounded-xl divide-y divide-border">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4">
                            <div className="space-y-1.5">
                                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                                <div className="h-3 w-48 bg-muted rounded animate-pulse" />
                            </div>
                            <div className="h-8 w-20 bg-muted rounded-full animate-pulse" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="border rounded-xl divide-y divide-border overflow-hidden">
                    {settings.map((setting) => (
                        <div key={setting.key} className="flex items-center justify-between gap-4 p-4">
                            <div className="min-w-0">
                                <p className="text-sm font-medium capitalize">
                                    {setting.key.replace(/_/g, ' ')}
                                </p>
                                {setting.description && (
                                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                        {setting.description}
                                    </p>
                                )}
                                {setting.updatedAt && (
                                    <p className="text-[10px] text-muted-foreground/50 mt-1">
                                        &Uacute;ltima actualizaci&oacute;n: {new Date(setting.updatedAt).toLocaleString()}
                                    </p>
                                )}
                            </div>
                            <Button
                                size="sm"
                                variant={setting.value === 'true' ? 'default' : 'secondary'}
                                onClick={() => onToggle(setting.key, setting.value)}
                                className="rounded-full px-4 shrink-0 active:scale-[0.95] transition-transform duration-100"
                            >
                                {setting.value === 'true' ? 'Activo' : 'Desactivado'}
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
