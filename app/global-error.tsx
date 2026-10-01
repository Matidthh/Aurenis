"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    // Si el error es una falla de carga de chunk por despliegue o conexión, recargar de forma segura
    const msg = (error?.message || error?.name || "").toLowerCase();
    if (msg.includes("chunk") || msg.includes("loading") || msg.includes("timeout")) {
      try {
        const lastReload = sessionStorage.getItem("aurenis_global_chunk_reload");
        const now = Date.now();
        if (!lastReload || now - parseInt(lastReload, 10) > 15000) {
          sessionStorage.setItem("aurenis_global_chunk_reload", now.toString());
          window.location.reload();
          return;
        }
      } catch {}
    }
  }, [error]);

  const handleReload = () => {
    try {
      sessionStorage.removeItem("aurenis_global_chunk_reload");
    } catch {}
    window.location.reload();
  };

  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Aurenis - Actualización del Sistema</title>
      </head>
      <body style={{ fontFamily: "system-ui, -apple-system, sans-serif", margin: 0, padding: 0, backgroundColor: "#f8fafc", color: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ maxWidth: 440, width: "100%", margin: "0 16px", backgroundColor: "#ffffff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "32px 24px", textAlign: "center", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, backgroundColor: "#fee2e2", color: "#dc2626", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px 0", color: "#0f172a" }}>
            Actualización o Incidente Temporal
          </h1>
          <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 20px 0", lineHeight: 1.5 }}>
            La plataforma ha detectado una nueva versión o reconexión de red. Puedes recargar para sincronizar los módulos.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{ padding: "10px 16px", borderRadius: 10, backgroundColor: "#2563eb", color: "#ffffff", border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
            >
              Reintentar
            </button>
            <button
              type="button"
              onClick={handleReload}
              style={{ padding: "10px 16px", borderRadius: 10, backgroundColor: "#f1f5f9", color: "#334155", border: "none", fontWeight: 500, fontSize: 13, cursor: "pointer" }}
            >
              Recargar plataforma
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

