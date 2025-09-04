'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import dynamic from 'next/dynamic';

const DynamicHeader = dynamic(() => import('./DynamicHeader'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center gap-4">
      <div className="h-9 w-9 bg-muted/50 rounded-md animate-pulse"></div>
      <div className="h-8 w-8 bg-muted/50 rounded-full animate-pulse"></div>
    </div>
  ),
});

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">ChatHub</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link
            href="/"
            className={`transition-colors hover:text-primary ${pathname === '/' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
            Inicio
          </Link>
          <Link href="#temas" className="text-muted-foreground transition-colors hover:text-primary">
            Temas
          </Link>
          <Link href="#como-funciona" className="text-muted-foreground transition-colors hover:text-primary">
            Cómo funciona
          </Link>
          <Link href="#acerca-de" className="text-muted-foreground transition-colors hover:text-primary">
            Acerca de
          </Link>
        </nav>

        <DynamicHeader />
      </div>
    </header>
  );
}
