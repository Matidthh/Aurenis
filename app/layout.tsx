import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NetworkStatusProvider } from "@/lib/network/network-context";
import { NetworkErrorBanner } from "@/components/ui/network-error-banner";
import { ToastProvider } from "@/components/ui/toast";
import { ChunkErrorListener, ChunkErrorBoundary } from "@/components/chunk-error-handler";

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
  title: "Aurenis",
  description: "Multi-tenant academic management platform for schools, teachers, students, and administrators.",
  icons: {
    icon: [
      { url: "/logonuevo.png", type: "image/png" },
      { url: "/aurenis-logo.svg", type: "image/svg+xml" }
    ],
    apple: "/logonuevo.png",
  },
  openGraph: {
    title: "Aurenis",
    description: "Multi-tenant academic management platform for schools, teachers, students, and administrators.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased min-h-screen" suppressHydrationWarning>
        <ChunkErrorListener />
        <NetworkStatusProvider>
          <ToastProvider>
            <NetworkErrorBanner />
            <ChunkErrorBoundary>
              {children}
            </ChunkErrorBoundary>
          </ToastProvider>
        </NetworkStatusProvider>
      </body>
    </html>
  );
}
