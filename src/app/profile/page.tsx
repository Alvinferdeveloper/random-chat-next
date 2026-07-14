'use client';

import { AuthGuard } from "@/src/app/components/auth/AuthGuard";
import { UserProfile } from "@/src/app/profile/components/UserProfile";
import { Suspense } from "react";
import { useTranslation } from 'react-i18next';

export default function ProfilePage() {
    const { t } = useTranslation();
    return (
        <AuthGuard>
            <div className="min-h-screen bg-main-gradient pb-20">
                <div className="container mx-auto max-w-5xl pt-16 px-4">
                    <Suspense fallback={
                        <div className="flex flex-col items-center justify-center space-y-4 h-64">
                            <div className="h-12 w-12 border-4 border-primary/30 border-t-primary animate-spin rounded-full" />
                            <p className="text-muted-foreground animate-pulse">{t('profile.suspense_fallback')}</p>
                        </div>
                    }>
                        <UserProfile />
                    </Suspense>
                </div>
            </div>
        </AuthGuard>
    );
}