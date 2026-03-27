'use client';

import { createContext, useContext } from 'react';
import { authClient } from '@/src/app/lib/auth-client';

type Session = ReturnType<typeof authClient.useSession>['data'];

type SessionContextType = {
    session: Session;
    isPending: boolean;
};

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const { data: session, isPending } = authClient.useSession();

    return (
        <SessionContext.Provider value={{ session, isPending }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const ctx = useContext(SessionContext);
    if (!ctx) throw new Error('useSession must be used within a <SessionProvider>');
    return ctx;
}
