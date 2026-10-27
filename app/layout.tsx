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
    default: "Aurenis | Libro de Clases Digital y Gestión Académica Decreto 67",
    template: "%s | Aurenis",
  },
  description:
    "Plataforma integral de gestión escolar y académica en Chile: Libro de clases digital certificado bajo Circular 30, evaluación Decreto 67, asistencia e interoperabilidad con SIGE.",
  keywords: [
    "Aurenis",
    "Libro de Clases Digital",
    "Circular 30",
    "Decreto 67",
    "SIGE",
    "MINEDUC",
    "Superintendencia de Educación",
    "Gestión escolar Chile",
    "Evaluación dual",
    "Subvención SEP software",
    "Asistencia escolar",
    "Colegios Chile",
  ],
  authors: [{ name: "Equipo Aurenis & Liceo Politécnico Marga Marga" }],
  creator: "Aurenis Cloud Education",
  publisher: "Aurenis Cloud Education",
  metadataBase: new URL("https://aurenis.app"),
  alternates: {
    canonical: "https://aurenis.app",
  },
  verification: {
    google: "google1a043c5bc8a45fb4",
  },
  icons: {
    icon: [{ url: "/logonuevo.png", type: "image/png" }],
    apple: "/logonuevo.png",
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://aurenis.app",
    title: "Aurenis | Libro de Clases Digital y Gestión Académica Decreto 67",
    description:
      "Plataforma de gestión escolar y libro de clases digital para Chile: cumplimiento Circular 30, Decreto 67 y sincronización SIGE.",
    siteName: "Aurenis",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurenis | Libro de Clases Digital y Gestión Académica Decreto 67",
    description:
      "Libro de clases digital, evaluación Decreto 67 y gestión escolar multi-tenant para establecimientos educacionales de Chile.",
  },
  other: {
    "geo.region": "CL-VS",
    "geo.placename": "Quilpué, Región de Valparaíso, Chile",
    "geo.position": "-33.0489;-71.4429",
    "ICBM": "-33.0489, -71.4429",
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
