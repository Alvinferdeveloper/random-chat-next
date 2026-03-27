import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { ThemeProvider } from "@/src/app/components/providers/ThemeProvider";
import "./globals.css";
import { SocketEventProvider } from "@/src/app/components/providers/SocketEventProvider";
import { SessionProvider } from "@/src/app/components/providers/SessionProvider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: {
    template: "%s | ChatHub",
    default: "ChatHub - Conecta y Comparte en Tiempo Real",
  },
  description: "Únete a salas de chat temáticas, comparte momentos y conoce gente nueva en ChatHub, tu comunidad cálida y moderna.",
  keywords: ["chat", "chathub", "random chat", "salas de chat", "comunidad", "tiempo real", "mensajería"],
  authors: [{ name: "ChatHub Team" }],
  creator: "ChatHub Team",
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
    siteName: "ChatHub",
    title: "ChatHub - Conecta y Comparte en Tiempo Real",
    description: "Únete a salas de chat temáticas, comparte momentos y conoce gente nueva en ChatHub, tu comunidad cálida y moderna.",
    images: [
      {
        url: "/images/logo_chat.png",
        width: 1200,
        height: 630,
        alt: "ChatHub Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChatHub - Conecta y Comparte en Tiempo Real",
    description: "Únete a salas de chat temáticas, comparte momentos y conoce gente nueva en ChatHub, tu comunidad cálida y moderna.",
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
      <body className={montserrat.className}>
        <SessionProvider>
          <SocketEventProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <div className="flex flex-col min-h-screen">
                <div className="flex-1">{children}</div>
              </div>
            </ThemeProvider>
          </SocketEventProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
