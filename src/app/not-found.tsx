import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import { Home, MapPinOff } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mb-8 rounded-full bg-muted p-8">
        <MapPinOff className="h-16 w-16 text-muted-foreground" />
      </div>
      <h1 className="mb-2 text-4xl font-extrabold tracking-tight lg:text-5xl">
        404
      </h1>
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">
        Página no encontrada
      </h2>
      <p className="mb-8 max-w-[500px] text-muted-foreground">
        Lo sentimos, no pudimos encontrar la página que buscas. Es posible que haya sido eliminada o que la dirección sea incorrecta.
      </p>
      <Link href="/">
        <Button size="lg" className="gap-2 cursor-pointer">
          <Home className="h-4 w-4" />
          Volver al Inicio
        </Button>
      </Link>
    </div>
  )
}
