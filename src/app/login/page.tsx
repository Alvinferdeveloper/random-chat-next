'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Separator } from "@/src/components/ui/separator";
import { authClient } from "@/src/app/lib/auth-client";
import Image from 'next/image';
import { ArrowLeft } from "lucide-react";
import Facebook from '@/src/app/components/svg/logos/Facebook';
import Google from '@/src/app/components/svg/logos/Google';
import { AuthSplitScreen } from '@/src/app/components/auth/AuthSplitScreen';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.23, 1, 0.32, 1] as const,
    },
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
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
        setError(t('auth.login.error.verify_email'));
      } else {
        setError(error.message || t('auth.login.error.invalid_credentials'));
      }
    } else {
      router.push('/rooms');
    }
  };

  return (
    <AuthSplitScreen
      illustrationUrl='/illustrations/themes_auth.png'
    >
      <div className="flex flex-col min-h-full">
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="group flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span>{t('auth.login.back')}</span>
          </Button>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="flex justify-center mb-2">
            <Link href="/">
              <Image src="/images/logo_chat.png" width={50} height={50} alt="ChatHub" priority className="h-auto" />
            </Link>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="space-y-5"
          >
            <motion.div variants={item} className="text-center">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {t('auth.login.title')}
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {t('auth.login.subtitle')}
              </p>
            </motion.div>

            <motion.div variants={item} className="space-y-3">
              <Button
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full h-11 cursor-pointer bg-transparent hover:bg-secondary transition-colors"
              >
                <Google />
                {t('auth.login.google')}
              </Button>
              <Button
                onClick={handleFacebookLogin}
                variant="outline"
                className="w-full h-11 cursor-pointer bg-transparent hover:bg-secondary transition-colors"
              >
                <Facebook />
                {t('auth.login.facebook')}
              </Button>
            </motion.div>

            <motion.div variants={item} className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t('auth.login.or_continue_with')}
                </span>
              </div>
            </motion.div>

            <motion.div variants={item}>
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.login.email_label')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.login.email_placeholder')}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.login.password_label')}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t('auth.login.password_placeholder')}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11"
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-lg"
                  >
                    {error}
                  </motion.p>
                )}

                <Button type="submit" className="w-full h-11 cursor-pointer" disabled={loading}>
                  {loading ? t('auth.login.loading') : t('auth.login.submit')}
                </Button>
              </form>
            </motion.div>

            <motion.div variants={item} className="text-center text-sm text-muted-foreground pt-2">
              {t('auth.login.no_account')}{' '}
              <Link href="/signup" className="underline font-medium hover:text-primary transition-colors">
                {t('auth.login.signup_link')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </AuthSplitScreen>
  );
}
