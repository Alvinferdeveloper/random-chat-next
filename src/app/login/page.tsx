'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Separator } from "@/src/components/ui/separator";
import { authClient } from "@/src/app/lib/auth-client";
import Image from 'next/image';
import { ArrowLeft } from "lucide-react";
import Facebook from '@/src/app/components/svg/logos/Facebook';
import Google from '@/src/app/components/svg/logos/Google';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/rooms`
        });
    };

    const handleFacebookLogin = async () => {
        await authClient.signIn.social({
            provider: "facebook",
            callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/rooms`
        });
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await authClient.signIn.email({
            email,
            password,
            callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/admin`,
        });

        setLoading(false);

        if (error) {
            if (error.status === 403) {
                setError('Por favor, verifica tu correo electrónico antes de iniciar sesión.');
            } else {
                setError(error.message || 'Credenciales incorrectas.');
            }
        } else {
            router.push('/rooms');
        }
    };

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
                    <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
                    <CardDescription>Elige tu método preferido para acceder</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <Button
                            onClick={handleGoogleLogin}
                            variant="outline"
                            className="w-full h-11 border cursor-pointer dark:hover:bg-white/5 hover:bg-slate-100 transition-colors bg-transparent"
                        >
                            <Google />
                            Continuar con Google
                        </Button>
                        <Button
                            onClick={handleFacebookLogin}
                            variant="outline"
                            className="w-full h-11 border cursor-pointer dark:hover:bg-white/5 hover:bg-slate-100 transition-colors bg-transparent"
                        >
                            <Facebook />
                            Continuar con Facebook
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <Separator />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="dark:bg-[#0f1722] bg-card px-2 text-muted-foreground">O continúa con</span>
                        </div>
                    </div>

                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input id="email" type="email" placeholder="tu@ejemplo.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input id="password" type="password" placeholder="********" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        {error && <p className="text-sm font-medium text-destructive bg-destructive/10 p-2 rounded-md">{error}</p>}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground mt-4">
                        ¿No tienes cuenta?{" "}
                        <Link href="/signup" className="underline font-medium hover:text-primary transition-colors">
                            Regístrate aquí
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}