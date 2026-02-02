'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { ThemeToggle } from './ThemeToggle';
import { UserNav } from '@/src/app/components/layout/ProfileDropDown';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo_chat.png" width={70} height={70} alt="Logo" />
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
        <div className=' gap-2 flex justify-between items-center'>
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
