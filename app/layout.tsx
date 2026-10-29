import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AURENIS — Gestión Escolar Multi-Tenant & LPMM",
  description: "Plataforma Integral de Gestión Escolar y Académica Multi-Tenant con Libro de Clases Digital, Asistencia QR, Matriz Decreto 67 y Centro de Notificaciones con HashRouter.",
  openGraph: {
    title: "AURENIS — Gestión Escolar Multi-Tenant & LPMM",
    description: "Plataforma Integral de Gestión Escolar y Académica Multi-Tenant con Libro de Clases Digital, Asistencia QR, Matriz Decreto 67 y Centro de Notificaciones con HashRouter.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-slate-50 dark:bg-[#070C18] text-slate-900 dark:text-slate-100 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
