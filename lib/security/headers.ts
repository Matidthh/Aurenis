/**
 * Aurenis HTTP Security Headers
 * Configuración centralizada de cabeceras de protección: HSTS, CSP con Nonce dinámico, X-Content-Type-Options, Anti-Clickjacking y Referrer Policy.
 */

import { NextResponse } from "next/server";

const isProduction = process.env.NODE_ENV === "production";

function generateNonce(): string {
  const array = new Uint8Array(16);
  if (typeof globalThis !== "undefined" && globalThis.crypto && typeof globalThis.crypto.getRandomValues === "function") {
    globalThis.crypto.getRandomValues(array);
  } else {
    // Fallback pseudo-random si crypto global no está disponible en el entorno de ejecución exacto
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Buffer.from(array).toString("base64");
}

export function getSecurityHeaders(nonce?: string): Record<string, string> {
  const cspNonce = nonce || generateNonce();

  return {
    // 1. Strict-Transport-Security (HSTS) - Forzar HTTPS durante 1 año incluyendo subdominios
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",

    // 2. Content-Security-Policy (CSP) con Nonce criptográfico (SEC-FIND-004 Hardening)
    "Content-Security-Policy": [
      "default-src 'self'",
      isProduction
        ? `script-src 'self' 'nonce-${cspNonce}' 'strict-dynamic' https:`
        : `script-src 'self' 'nonce-${cspNonce}' 'unsafe-eval' 'unsafe-inline'`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data: https:",
      "connect-src 'self' https: wss:",
      "frame-ancestors 'self' https://ai.studio https://*.google.com https://*.googleusercontent.com https://*.run.app https://*.aistudio.google.com",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
    ].join("; "),

    // 3. X-Content-Type-Options - Prevenir sniffing de tipos MIME
    "X-Content-Type-Options": "nosniff",

    // 3.1. X-Frame-Options - Protección Anti-Clickjacking
    "X-Frame-Options": "SAMEORIGIN",

    // 4. Referrer-Policy - Protección de privacidad en enlaces salientes
    "Referrer-Policy": "strict-origin-when-cross-origin",

    // 5. Permissions-Policy - Restricción de APIs del navegador no requeridas
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",

    // 6. Server - Identificador genérico sin revelación de versión ni stack tecnológico
    "Server": "Aurenis-Gateway",
  };
}

/**
 * Exportación estática de respaldo para compatibilidad con tests (SEC-FIND-004)
 */
export const SECURITY_HEADERS = getSecurityHeaders();

/**
 * Cabeceras informativas o de versión que deben ser eliminadas de las respuestas.
 */
export const FORBIDDEN_VERSION_HEADERS = [
  "x-powered-by",
  "x-nextjs-version",
  "x-aspnet-version",
  "x-version",
  "x-runtime",
  "server-version",
];

/**
 * Aplica todas las cabeceras de seguridad HTTP con Nonce opcional a un objeto NextResponse
 * y elimina cabeceras que revelen tecnologías internas o versiones.
 */
export function applySecurityHeaders<T = any>(response: NextResponse<T>, nonce?: string): NextResponse<T> {
  const headers = getSecurityHeaders(nonce);
  for (const [header, value] of Object.entries(headers)) {
    response.headers.set(header, value);
  }

  // Eliminar cabeceras que revelen versiones o stack tecnológico
  for (const forbidden of FORBIDDEN_VERSION_HEADERS) {
    response.headers.delete(forbidden);
  }

  // Asegurar que x-frame-options no bloquee el renderizado en iframe dentro de AI Studio
  response.headers.delete("x-frame-options");

  return response;
}
