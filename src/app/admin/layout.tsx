'use client';

import { useAuth } from '@/src/app/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Loader2, ShieldCheck, LayoutDashboard, MessageSquare } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { session, isPending } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isPending) {
            if (!session?.user || (session.user as any).role !== 'ADMIN') {
                router.push('/rooms');
            }
        }
    }, [session, isPending, router]);

    if (isPending) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-background">
            {/* Admin Sidebar */}
            <aside className="w-64 border-r bg-card hidden md:block">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                        Admin Panel
                    </h2>
                </div>
                <nav className="p-4 space-y-2">
                    <Link href="/admin">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                        </Button>
                    </Link>
                    <Link href="/admin/rooms">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Salas Pendientes
                        </Button>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
