'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { authClient } from '../lib/auth-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setError('No se proporcionó un token de verificación.');
            setStatus('error');
            return;
        }

        const verifyToken = async () => {
            const { data, error } = await authClient.verifyEmail({ query: { token } });

            if (error) {
                setError(error.message || 'El enlace de verificación no es válido o ha expirado.');
                setStatus('error');
            } else {
                setStatus('success');
            }
        };

        verifyToken();
    }, [token]);

    const renderContent = () => {
        switch (status) {
            case 'verifying':
                return <p>Verificando tu correo electrónico...</p>;
            case 'success':
                return (
                    <div className="text-center">
                        <p>¡Tu correo ha sido verificado exitosamente!</p>
                        <Button onClick={() => router.push('/login')} className="mt-4">
                            Ir a Iniciar Sesión
                        </Button>
                    </div>
                );
            case 'error':
                return (
                    <div className="text-center">
                        <p className="text-destructive">{error}</p>
                        <Button onClick={() => router.push('/signup')} variant="outline" className="mt-4">
                            Volver a Registrarse
                        </Button>
                    </div>
                );
        }
    };

    return (
        <main className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Verificación de Correo</CardTitle>
                </CardHeader>
                <CardContent>
                    {renderContent()}
                </CardContent>
            </Card>
        </main>
    );
}
