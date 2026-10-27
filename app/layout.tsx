import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Caveat } from "next/font/google";
import "./globals.css";
import { NetworkStatusProvider } from "@/lib/network/network-context";
import { NetworkErrorBanner } from "@/components/ui/network-error-banner";
import { ToastProvider } from "@/components/ui/toast";
import { ChunkErrorListener, ChunkErrorBoundary } from "@/components/chunk-error-handler";
import { MotionProvider } from "@/components/providers/motion-provider";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0f4f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Aurenis — Plataforma Integral de Gestión Escolar y Académica Multi-Tenant",
    template: "%s | Aurenis",
  },
  description: "Sistema de gestión escolar, libro de clases digital Decreto 67, asistencia y portales para colegios, profesores, apoderados y estudiantes en Chile.",
  keywords: ["gestion escolar", "libro de clases digital", "decreto 67", "aurenis", "colegios chile", "lpmm", "asistencia escolar", "calificaciones"],
  verification: {
    google: "google1a043c5bc8a45fb4",
  },
  icons: {
    icon: [
      { url: "/logonuevo.png", type: "image/png" }
    ],
    apple: "/logonuevo.png",
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://aurenis.app",
    title: "Aurenis — Plataforma Integral de Gestión Escolar y Académica Multi-Tenant",
    description: "Sistema líder de gestión escolar, libro digital Decreto 67 y portales interactivos para establecimientos educacionales.",
    siteName: "Aurenis",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurenis — Plataforma de Gestión Escolar",
    description: "Libro de clases digital y gestión académica multi-tenant en Chile.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${plusJakartaSans.variable} ${caveat.variable}`} suppressHydrationWarning>
      <head>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Aurenis",
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "All",
            "description": "Sistema de gestión escolar, libro de clases digital, asistencia y portales para colegios en Chile.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "CLP"
            }
          })}
        </script>
      </head>
      <body className="antialiased min-h-screen" suppressHydrationWarning>
        <ChunkErrorListener />
        <MotionProvider>
          <NetworkStatusProvider>
            <ToastProvider>
              <NetworkErrorBanner />
              <ChunkErrorBoundary>
                {children}
              </ChunkErrorBoundary>
            </ToastProvider>
          </NetworkStatusProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
