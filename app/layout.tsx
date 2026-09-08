import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aurenis",
  description: "Plataforma de gestión académica y escolar multi-institución con control de notas, asistencia y roles.",
  openGraph: {
    title: "Aurenis",
    description: "Plataforma de gestión académica y escolar multi-institución con control de notas, asistencia y roles.",
  },
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
