import type { Metadata } from "next";
import "./globals.css";
import { NetworkStatusProvider } from "@/lib/network/network-context";
import { NetworkErrorBanner } from "@/components/ui/network-error-banner";
import { ToastProvider } from "@/components/ui/toast";
import { ChunkErrorListener, ChunkErrorBoundary } from "@/components/chunk-error-handler";

export const metadata: Metadata = {
  title: "Aurenis",
  description: "Multi-tenant academic management platform for schools, teachers, students, and administrators.",
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
