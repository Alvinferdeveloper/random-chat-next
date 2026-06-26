'use client'

import Link from "next/link"
import Image from "next/image"
import Twitter from "@/src/app/components/icons/Twitter"
import Instagram from "@/src/app/components/icons/Instagram"
import Github from "@/src/app/components/icons/Github"
import { useTranslation } from '@/src/app/lib/i18n'

export default function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4">
          <div className="md:col-span-2 space-y-4 justify-items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/logo_chat.png" alt="ChatHub Logo" width={40} height={40} className="rounded-xl" />
              <span className="text-xl font-bold tracking-tight text-foreground">ChatHub</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              {t('layout.footer.description')}
            </p>
            <div className="flex items-center space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter />
                <span className="sr-only">{t('layout.footer.sr_twitter')}</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram />
                <span className="sr-only">{t('layout.footer.sr_instagram')}</span>
              </Link>
              <Link href="https://github.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Github />
                <span className="sr-only">{t('layout.footer.sr_github')}</span>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">{t('layout.footer.platform_heading')}</h3>
            <ul className="space-y-2">
              <li><Link href="/rooms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('layout.footer.explore_rooms')}</Link></li>
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('layout.footer.faq')}</Link></li>
              <li><Link href="/guia-comunidad" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('layout.footer.community_guidelines')}</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">{t('layout.footer.legal_heading')}</h3>
            <ul className="space-y-2">
              <li><Link href="/legal/privacidad" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('layout.footer.privacy')}</Link></li>
              <li><Link href="/legal/terminos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('layout.footer.terms')}</Link></li>
              <li><Link href="/legal/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('layout.footer.cookies')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-12 border-t border-border flex flex-col md:row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            {t('layout.footer.copyright', { year: currentYear })}
          </p>
        </div>
      </div>
    </footer>
  )
}
