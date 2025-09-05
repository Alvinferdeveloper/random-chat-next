import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmailPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const success = searchParams.success === 'true';
    if (!success) redirect('/login');
    return (
        <main className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Verificación de Correo</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center">
                        <p>¡Tu correo ha sido verificado exitosamente!</p>
                        <Link href="/login" className="underline">
                            <Button className="mt-4">
                                Ir a Iniciar Sesión
                            </Button></Link>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
