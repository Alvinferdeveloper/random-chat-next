'use client';

import { useState } from 'react';
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { authClient } from '../lib/auth-client';
import Link from 'next/link';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await authClient.signUp.email({
            name,
            email,
            password,
            callbackURL: `${window.location.origin}/verify-email`,
        });

        setLoading(false);

        if (error) {
            setError(error.message || 'Ocurrió un error durante el registro.');
        } else {
            setSuccess(true);
        }
    };

    if (success) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle>¡Registro Exitoso!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Hemos enviado un enlace de verificación a tu correo electrónico.</p>
                        <p className="mt-2">Por favor, revisa tu bandeja de entrada para continuar.</p>
                    </CardContent>
                </Card>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md mx-auto shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">Crear una Cuenta</CardTitle>
                    <CardDescription>Ingresa tus datos para registrarte</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        ¿Ya tienes una cuenta?{" "}
                        <Link href="/login" className="underline">
                            Inicia sesión
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
