import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aurenis — Plataforma de Gestión Académica",
  description: "Plataforma multi-institucional moderna para colegios y liceos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
