'use client';

import { useEffect, useState } from 'react';
import { useSession } from './SessionProvider';
import { usePathname } from 'next/navigation';
import { Hammer, Loader2, Sparkles } from 'lucide-react';
import { useTranslation } from '@/src/app/lib/i18n';

export function MaintenanceGuard({ children }: { children: React.ReactNode }) {
    const { session, isPending } = useSession();
    const pathname = usePathname();
    const { t } = useTranslation()
    const [maintenanceActive, setMaintenanceActive] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkMaintenance = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings`);
            if (res.ok) {
                const data = await res.json();
                const settings = data.settings || {};
                setMaintenanceActive(settings.maintenance_mode === 'true');
            }
        } catch (error) {
            console.error('Error fetching system settings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkMaintenance();
        // Poll every 15 seconds to automatically restore access when maintenance ends
        const interval = setInterval(checkMaintenance, 15000);
        return () => clearInterval(interval);
    }, []);

    const isUserAdmin = session?.user?.role === 'ADMIN';
    const isAdminRoute = pathname?.startsWith('/admin');

    // If maintenance is active, user is NOT admin, and it's not a bypass route
    const showMaintenanceScreen = maintenanceActive && !isUserAdmin && !isAdminRoute;

    if (loading || isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (showMaintenanceScreen) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 overflow-hidden relative font-sans">
                {/* Decorative background elements */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[6000ms]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8000ms]"></div>

                <div className="w-full max-w-lg text-center space-y-8 z-10">
                    {/* Animated Icon Container */}
                    <div className="relative inline-flex items-center justify-center p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl animate-bounce">
                        <Hammer className="w-16 h-16 text-orange-500" />
                        <Sparkles className="w-6 h-6 text-indigo-400 absolute top-4 right-4 animate-spin" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 via-orange-400 to-indigo-400 bg-clip-text text-transparent">
                            {t('maintenance.title')}
                        </h1>
                        <p className="text-lg text-slate-400 max-w-md mx-auto leading-relaxed">
                            {t('maintenance.description')}
                        </p>
                    </div>

                    {/* Progress Bar Loader */}
                    <div className="w-full max-w-xs mx-auto space-y-2">
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden relative">
                            <div className="h-full bg-gradient-to-r from-orange-500 to-indigo-500 w-1/2 rounded-full absolute animate-infinite-loading"></div>
                        </div>
                        <p className="text-xs text-slate-500 animate-pulse">{t('maintenance.reconnecting')}</p>
                    </div>

                    <div className="pt-6 border-t border-slate-900 text-xs text-slate-600">
                        {t('maintenance.admin_hint')}
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes loading {
                        0% { left: -50%; width: 30%; }
                        50% { width: 40%; }
                        100% { left: 120%; width: 30%; }
                    }
                    .animate-infinite-loading {
                        position: absolute;
                        animation: loading 2s infinite linear;
                    }
                `}} />
            </div>
        );
    }

    return <>{children}</>;
}
