import { type ReactNode } from 'react';

interface AuthSplitScreenProps {
  children: ReactNode;
  illustrationUrl?: string;
}

export function AuthSplitScreen({ children, illustrationUrl }: AuthSplitScreenProps) {
  return (
    <main className="min-h-[100dvh] flex">
      <section className="flex-1 flex items-center justify-center px-6 lg:px-12 py-8 bg-background">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </section>

      <section className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5">
        <div className="flex h-full w-full flex-col">
          <div className="flex flex-col items-center justify-center pt-16 pb-4 px-16 text-center">
            <div className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground/60">
              <span className="h-px w-8 bg-border" />
              Bienvenido a
              <span className="h-px w-8 bg-border" />
            </div>
            <h2 className="text-5xl font-bold tracking-tight text-foreground">
              Chat<span className="text-primary">Hub</span>
            </h2>
            <div className="mt-5 h-1 w-12 rounded-full bg-primary/30 mx-auto" />
            <p className="mt-5 text-base text-muted-foreground/80 max-w-sm leading-relaxed">
              Donde cada <span className="font-semibold text-foreground">conversacion</span> encuentra su lugar
            </p>
          </div>

          <div className="flex-1 relative px-16 pb-16">
            {illustrationUrl ? (
              <img
                src={illustrationUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-contain p-6"
              />
            ) : (
              <>
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border border-primary/10 animate-[float_12s_ease-in-out_infinite]" />
                <div className="absolute -bottom-32 -left-16 w-[30rem] h-[30rem] rounded-full border border-primary/10 animate-[float_15s_ease-in-out_infinite_reverse]" />
                <div className="absolute top-1/3 left-1/2 w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-[pulse-glow_8s_ease-in-out_infinite]" />
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
