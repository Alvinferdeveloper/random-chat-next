"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/app/components/pages/main/themeToggle"
import { Button } from "@/components/ui/button"
import { MessageSquare, Users } from "lucide-react"

export default function Header() {
  const pathname = usePathname()
  const isHome = pathname === "/"

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
            className={`transition-colors hover:text-primary ${pathname === "/" ? "text-primary font-medium" : "text-muted-foreground"}`}
          >
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

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button size="sm" className="hidden md:flex gap-2">
            <Users className="w-4 h-4" />
            Iniciar sesión
          </Button>
        </div>
      </div>
    </header>
  )
}
