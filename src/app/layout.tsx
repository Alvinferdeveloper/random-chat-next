import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { ThemeProvider } from "@/src/app/components/providers/ThemeProvider";
import "./globals.css";
import { SocketEventProvider } from "@/src/app/components/providers/SocketEventProvider";
import { SessionProvider } from "@/src/app/components/providers/SessionProvider";
import { MaintenanceGuard } from "@/src/app/components/providers/MaintenanceGuard";
import { I18nProvider } from "@/src/app/components/providers/I18nProvider";
import { Toaster } from "@/src/components/ui/sonner";
import { JsonLd } from "@/src/components/seo/JsonLd";
import { APP_NAME, APP_URL } from "@/src/app/constants";
import localfont from 'next/font/local'

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const chillax = localfont({
  src: [
    {
      path: '../fonts/chillax/Chillax-Regular.woff2',
      weight: '400',
      style: 'normal',
    }, {
      path: '../fonts/chillax/Chillax-Semibold.woff2',
      weight: '600',
      style: 'normal',
    }, {
      path: '../fonts/chillax/Chillax-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: "--font-chillax",
})

const appUrl = APP_URL;

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: `${APP_NAME} - Conecta y Comparte en Tiempo Real`,
  },
  description: `Únete a salas de chat temáticas, comparte momentos y conoce gente nueva en ${APP_NAME}, tu comunidad cálida y moderna.`,
  keywords: ["chat", "random chat", "salas de chat", "comunidad", "tiempo real", "mensajería"],
  authors: [{ name: `${APP_NAME} Team` }],
  creator: `${APP_NAME} Team`,
  metadataBase: new URL(appUrl),
  alternates: {
    canonical: appUrl,
    languages: {
      es: appUrl,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: appUrl,
    siteName: APP_NAME,
    title: `${APP_NAME} - Conecta y Comparte en Tiempo Real`,
    description: `Únete a salas de chat temáticas, comparte momentos y conoce gente nueva en ${APP_NAME}, tu comunidad cálida y moderna.`,
    images: [
      {
        url: "/images/logo_chat.png",
        width: 1200,
        height: 630,
        alt: `${APP_NAME} Logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} - Conecta y Comparte en Tiempo Real`,
    description: `Únete a salas de chat temáticas, comparte momentos y conoce gente nueva en ${APP_NAME}, tu comunidad cálida y moderna.`,
    images: ["/images/logo_chat.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <JsonLd data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: APP_NAME,
          url: APP_URL,
          description: `Únete a salas de chat temáticas, comparte momentos y conoce gente nueva en ${APP_NAME}.`,
          inLanguage: 'es',
          publisher: {
            '@type': 'Organization',
            name: APP_NAME,
            logo: { '@type': 'ImageObject', url: `${APP_URL}/images/logo_chat.png` },
          },
        }} />
        <JsonLd data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: APP_NAME,
          url: APP_URL,
          logo: { '@type': 'ImageObject', url: `${APP_URL}/images/logo_chat.png`, width: 512, height: 512 },
          sameAs: [],
          contactPoint: { '@type': 'ContactPoint', contactType: 'customer service' },
        }} />
      </head>
      <body className={chillax.className}>
        <I18nProvider>
          <SessionProvider>
            <SocketEventProvider>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <MaintenanceGuard>
                  <div className="flex flex-col min-h-screen">
                    <div className="flex-1">{children}</div>
                  </div>
                </MaintenanceGuard>
                <Toaster richColors closeButton position="top-right" />
              </ThemeProvider>
            </SocketEventProvider>
          </SessionProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
