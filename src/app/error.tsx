'use client'

import { useEffect } from 'react'
import { Button } from '@/src/components/ui/button'
import { AlertCircle, RotateCcw } from 'lucide-react'
import { useTranslation } from '@/src/app/lib/i18n'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useTranslation()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mb-8 rounded-full bg-red-100 p-8 dark:bg-red-900/20">
        <AlertCircle className="h-16 w-16 text-red-500" />
      </div>
      <h1 className="mb-2 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {t('error_page.title')}
      </h1>
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">
        {t('error_page.subtitle')}
      </h2>
      <p className="mb-8 max-w-[500px] text-muted-foreground">
        {t('error_page.description')}
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="default" className="gap-2 cursor-pointer">
          <RotateCcw className="h-4 w-4" />
          {t('error_page.retry')}
        </Button>
      </div>
    </div>
  )
}
