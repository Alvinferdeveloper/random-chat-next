'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { authClient } from '../lib/auth-client';
import Image from 'next/image';
import { ArrowLeft, MailCheck } from "lucide-react";
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

export default function SignupPage() {
  const router = useRouter();
  const { t } = useTranslation();
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
      setError(error.message || t('auth.signup.error.fallback'));
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <main className="min-h-[100dvh] flex items-center justify-center px-6 bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] as const }}
          className="w-full max-w-sm text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <MailCheck className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
            {t('auth.signup.success.title')}
          </h1>
          <div className="space-y-1 text-sm text-muted-foreground mb-8">
            <p>{t('auth.signup.success.message1')}</p>
            <p>{t('auth.signup.success.message2')}</p>
          </div>
          <Button
            variant="outline"
            className="w-full cursor-pointer"
            onClick={() => router.push('/login')}
          >
            {t('auth.signup.success.go_to_login')}
          </Button>
        </motion.div>
      </main>
    );
  }

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
            <span>{t('auth.signup.back')}</span>
          </Button>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="flex justify-center mb-2">
            <Link href="/">
              <Image src="/images/logo_chat.png" width={150} height={150} alt="ChatHub" priority className="h-auto" />
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
                {t('auth.signup.title')}
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {t('auth.signup.subtitle')}
              </p>
            </motion.div>

            <motion.div variants={item}>
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('auth.signup.name_label')}</Label>
                  <Input
                    id="name"
                    placeholder={t('auth.signup.name_placeholder')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.signup.email_label')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.signup.email_placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.signup.password_label')}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t('auth.signup.password_placeholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
                  {loading ? t('auth.signup.loading') : t('auth.signup.submit')}
                </Button>
              </form>
            </motion.div>

            <motion.div variants={item} className="text-center text-sm text-muted-foreground pt-2">
              {t('auth.signup.has_account')}{' '}
              <Link href="/login" className="underline font-medium hover:text-primary transition-colors">
                {t('auth.signup.login_link')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </AuthSplitScreen>
  );
}
