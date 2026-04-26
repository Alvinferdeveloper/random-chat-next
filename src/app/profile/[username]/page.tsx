'use client';

import { useParams } from 'next/navigation';
import { UserProfile } from '@/src/app/profile/components/UserProfile';
import { Suspense } from 'react';
import { Button } from '@/src/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OtherProfilePage() {
    const params = useParams();
    const encodedUsername = params.username as string;
    const username = decodeURIComponent(encodedUsername);
    const router = useRouter();

    return (
        <div className="min-h-screen bg-main-gradient pb-20">
            <div className="container mx-auto max-w-5xl pt-16 px-4">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-6 text-white hover:bg-white/10 cursor-pointer"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Volver
                </Button>

                <Suspense fallback={
                    <div className="flex flex-col items-center justify-center space-y-4 h-64">
                        <div className="h-12 w-12 border-4 border-primary/30 border-t-primary animate-spin rounded-full" />
                        <p className="text-muted-foreground animate-pulse">Cargando perfil...</p>
                    </div>
                }>
                    <UserProfile targetUsername={username} />
                </Suspense>
            </div>
        </div>
    );
}
