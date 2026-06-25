'use client';

import { useAuth } from '@/src/app/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Loader2, ShieldCheck, LayoutDashboard, MessageSquare, Users, AlertCircle, Tag, LogOut, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAdminNotifications } from '@/src/app/admin/hooks/useAdminNotifications';

const NAV_ITEMS = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/rooms', label: 'Salas Pendientes', icon: MessageSquare },
    { href: '/admin/users', label: 'Usuarios', icon: Users },
    { href: '/admin/reports', label: 'Reportes', icon: AlertCircle },
    { href: '/admin/categories', label: 'Categorías', icon: Tag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { session, isPending } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useAdminNotifications();

    useEffect(() => {
        if (!isPending) {
            if (!session?.user || (session.user as any).role !== 'ADMIN') {
                router.push('/rooms');
            }
        }
    }, [session, isPending, router]);

    if (isPending) {
        return (
            <div className="flex h-screen items-center justify-center bg-admin-surface">
                <Loader2 className="h-8 w-8 animate-spin text-admin-nav-icon" />
            </div>
        );
    }

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
        return null;
    }

    const isActive = (item: typeof NAV_ITEMS[number]) => {
        if (item.exact) return pathname === item.href;
        return pathname.startsWith(item.href);
    };

    return (
        <div className="flex min-h-screen bg-admin-surface">
            {/* Admin Sidebar */}
            <aside className="w-64 shrink-0 hidden md:flex flex-col bg-admin-sidebar border-r border-admin-sidebar-border">
                {/* Header */}
                <div className="px-5 h-14 flex items-center border-b border-admin-sidebar-border">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center">
                            <ShieldCheck className="w-4 h-4 text-white dark:text-zinc-900" />
                        </div>
                        <span className="text-sm font-semibold tracking-tight truncate">Admin Panel</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
                    {NAV_ITEMS.map((item) => {
                        const active = isActive(item);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out",
                                    "active:scale-[0.98]",
                                    active
                                        ? "bg-admin-nav-active-bg text-admin-nav-active"
                                        : "text-admin-nav hover:text-admin-nav-hover hover:bg-admin-nav-hover-bg"
                                )}
                            >
                                <item.icon className={cn(
                                    "w-4 h-4 shrink-0 transition-colors duration-200",
                                    active
                                        ? "text-admin-nav-active"
                                        : "text-admin-nav-icon"
                                )} />
                                <span className="truncate">{item.label}</span>
                                {active && (
                                    <ChevronRight className="w-3.5 h-3.5 ml-auto shrink-0 text-admin-nav-icon" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom: Admin profile */}
                <div className="px-3 py-3 border-t border-admin-sidebar-border">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
                        <div className="w-7 h-7 rounded-full bg-admin-avatar-bg flex items-center justify-center text-[10px] font-bold text-admin-avatar-text shrink-0">
                            {(session.user as any).name?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium truncate text-admin-profile-name">
                                {(session.user as any).name || 'Admin'}
                            </p>
                            <p className="text-[10px] text-admin-profile-role truncate">
                                Administrador
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/rooms')}
                            className="p-1.5 rounded-md text-admin-nav-icon hover:text-admin-nav-hover hover:bg-admin-nav-hover-bg transition-colors"
                            aria-label="Salir del panel"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                {/* Subtle dot grid background */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle, var(--admin-dot) 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                    }}
                />
                <div className="relative p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
