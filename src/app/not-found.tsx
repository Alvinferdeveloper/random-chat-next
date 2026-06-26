'use client'

import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import { Home, MapPinOff } from 'lucide-react'
import { useTranslation } from '@/src/app/lib/i18n'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mb-8 rounded-full bg-muted p-8">
        <MapPinOff className="h-16 w-16 text-muted-foreground" />
      </div>
      <h1 className="mb-2 text-4xl font-extrabold tracking-tight lg:text-5xl">
        404
      </h1>
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">
        {t('not_found.title')}
      </h2>
      <p className="mb-8 max-w-[500px] text-muted-foreground">
        {t('not_found.description')}
      </p>
      <Link href="/">
        <Button size="lg" className="gap-2 cursor-pointer">
          <Home className="h-4 w-4" />
          {t('not_found.back_home')}
        </Button>
      </Link>
    </div>
  )
}
