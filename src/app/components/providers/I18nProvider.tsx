'use client';

import { useEffect } from 'react';
import { detectAndApplyLanguage } from '@/src/app/lib/i18n';

export function I18nProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        detectAndApplyLanguage();
    }, []);

    return <>{children}</>;
}
