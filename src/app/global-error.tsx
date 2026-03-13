'use client'

import { useEffect } from 'react'
import { Button } from '@/src/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center font-sans antialiased">
          <div className="mb-4">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Critical Error</h1>
          </div>
          <p className="mb-8 max-w-[500px] text-muted-foreground">
            A critical error occurred and the application cannot continue.
          </p>
          <Button onClick={() => reset()} variant="destructive" className="cursor-pointer">
            Try again
          </Button>
        </div>
      </body>
    </html>
  )
}
