'use client'

import Header from '@/src/app/components/layout/Header'
import Footer from '@/src/app/components/layout/Footer'
import { usePathname } from 'next/navigation'

export default function GlobalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    
    // Rutas donde NO queremos mostrar el footer (experiencia de app completa)
    const hideFooterRoutes = ['/chat', '/profile', '/admin'];
    const shouldHideFooter = hideFooterRoutes.some(route => pathname?.startsWith(route));

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            {!shouldHideFooter && <Footer />}
        </div>
    );
}