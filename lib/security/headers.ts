/**
 * Aurenis HTTP Security Headers
 * Configuración centralizada de cabeceras de protección: HSTS, CSP, X-Content-Type-Options, Anti-Clickjacking y Referrer Policy.
 */

import { NextResponse } from "next/server";

export const SECURITY_HEADERS: Record<string, string> = {
  // 1. Strict-Transport-Security (HSTS) - Forzar HTTPS durante 1 año incluyendo subdominios
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",

  // 2. Content-Security-Policy (CSP) - Protección estricta contra XSS, inyección de código y framing malicioso
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https:",
    "connect-src 'self' https: wss:",
    "frame-ancestors 'self' https://ai.studio https://*.google.com",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
  ].join("; "),

  // 3. X-Content-Type-Options - Prevenir sniffing de tipos MIME
  "X-Content-Type-Options": "nosniff",

  // 4. X-Frame-Options - Protección anti-clickjacking
  "X-Frame-Options": "SAMEORIGIN",

  // 5. X-XSS-Protection - Filtro XSS heredado
  "X-XSS-Protection": "1; mode=block",

  // 6. Referrer-Policy - Protección de privacidad en enlaces salientes
  "Referrer-Policy": "strict-origin-when-cross-origin",

  // 7. Permissions-Policy - Restricción de APIs del navegador no requeridas
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
};

/**
 * Aplica todas las cabeceras de seguridad HTTP a un objeto NextResponse.
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(header, value);
  }
  return response;
}
