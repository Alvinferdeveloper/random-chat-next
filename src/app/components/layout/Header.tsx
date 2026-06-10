'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { ThemeToggle } from './ThemeToggle';
import { UserNav } from '@/src/app/components/layout/ProfileDropDown';
import { GlobalSearch } from './GlobalSearch';
import { Compass, Menu, Search, X, HelpCircle, Users } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/src/components/ui/sheet';
import { cn } from '@/src/lib/utils';

export default function Header() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isAppView = pathname?.startsWith('/chat') || pathname?.startsWith('/rooms') || pathname?.startsWith('/profile') || pathname?.startsWith('/dashboard');

  const navItems = isAppView ? [
    { href: '/rooms', label: 'Explorar', icon: Compass },
  ] : [
    { href: '/rooms', label: 'Explorar', icon: Compass },
    { href: '/faq', label: 'FAQ', icon: HelpCircle },
    { href: '/guia-comunidad', label: 'Comunidad', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center h-16 px-4 md:px-8 mx-auto gap-2">

        {/* Mobile: Menu Trigger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0 cursor-pointer">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[280px] p-0">
              <SheetHeader className="p-6 text-left border-b">
                <SheetTitle className="flex items-center gap-2">
                  <Image src="/images/logo_chat.png" width={32} height={32} alt="Logo" className="rounded-lg" />
                  <span>ChatHub</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 p-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}
                <div className="mt-4 pt-4 border-t flex items-center justify-between px-4">
                  <span className="text-sm font-medium text-muted-foreground">Tema</span>
                  <ThemeToggle />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Left side: Brand */}
        <div className="flex items-center gap-4 lg:gap-8 flex-1 md:flex-initial">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src="/images/logo_chat.png" width={40} height={40} alt="Logo" className="rounded-xl" />
            <span className="text-xl font-bold tracking-tighter hidden lg:block">ChatHub</span>
          </Link>
        </div>

        {/* Center: Desktop Navigation and Desktop Search */}
        <div className="flex-1 flex items-center justify-center gap-4">
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:block w-full max-w-sm ml-4">
            <GlobalSearch />
          </div>
        </div>

        {/* Right side: Actions (Mobile & Desktop) */}
        <div className="flex items-center gap-1 sm:gap-4 flex-none md:flex-initial">
          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden cursor-pointer"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </Button>

          <div className="hidden sm:flex items-center gap-2">
            <ThemeToggle />
          </div>
          <div className="h-6 w-px bg-border hidden sm:block"></div>
          <UserNav />
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <div className={cn(
        "md:hidden px-4 pb-4 animate-in slide-in-from-top-2 duration-200",
        isSearchOpen ? "block" : "hidden"
      )}>
        <GlobalSearch />
      </div>
    </header>
  );
}
