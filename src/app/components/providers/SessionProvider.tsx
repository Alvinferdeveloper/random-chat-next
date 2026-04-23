'use client';

import { createContext, useContext, useMemo } from 'react';
import { authClient } from '@/src/app/lib/auth-client';

type Session = ReturnType<typeof authClient.useSession>['data'];

type SessionContextType = {
    session: Session;
    isPending: boolean;
};

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const { data: session, isPending } = authClient.useSession();

    // Memoize context value to avoid re-rendering all consumers
    // when better-auth returns a new session object with the same data
    const value = useMemo(() => ({ session, isPending }), [
        session?.user?.id,
        session?.user?.name,
        session?.user?.email,
        session?.user?.image,
        isPending
    ]);

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const ctx = useContext(SessionContext);
    if (!ctx) throw new Error('useSession must be used within a <SessionProvider>');
    return ctx;
}
