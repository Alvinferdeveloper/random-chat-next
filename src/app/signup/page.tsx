'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { authClient } from '../lib/auth-client';
import Image from 'next/image';
import { ArrowLeft } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
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
            callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?success=true`,
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
            <main className="min-h-screen bg-gradient-to-br from-background dark:via-[#152438] via-slate-100 to-background flex flex-col items-center justify-center p-4 relative">
                <div className="flex items-center gap-2 mb-6">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/images/logo_chat.png" width={120} height={120} alt="Logo" priority />
                    </Link>
                </div>
                <Card className="w-full max-w-md text-center shadow-xl border dark:border-white/5 border-border/50 dark:bg-[#0f1722] bg-card">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">¡Registro Exitoso!</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-muted-foreground">
                        <p>Hemos enviado un enlace de verificación a tu correo electrónico.</p>
                        <p>Por favor, revisa tu bandeja de entrada para continuar.</p>
                        <Button
                            variant="outline"
                            className="mt-4 w-full cursor-pointer"
                            onClick={() => router.push('/login')}
                        >
                            Ir al inicio de sesión
                        </Button>
                    </CardContent>
                </Card>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-background dark:via-[#152438] via-slate-100 to-background flex flex-col items-center justify-center p-4 relative">

            <div className="absolute top-8 left-8 z-10">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="group flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-all duration-300"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Volver atrás</span>
                </Button>
            </div>

            <div className="flex items-center gap-2 mb-6">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/images/logo_chat.png" width={120} height={120} alt="Logo" priority />
                </Link>
            </div>

            <Card className="w-full max-w-md mx-auto shadow-xl border dark:border-white/5 border-border/50 dark:bg-[#0f1722] bg-card">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">Crear una Cuenta</CardTitle>
                    <CardDescription>Ingresa tus datos para registrarte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input id="name" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input id="email" type="email" placeholder="tu@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input id="password" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        {error && <p className="text-sm font-medium text-destructive bg-destructive/10 p-2 rounded-md">{error}</p>}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground mt-4">
                        ¿Ya tienes una cuenta?{" "}
                        <Link href="/login" className="underline font-medium hover:text-primary transition-colors">
                            Inicia sesión
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
