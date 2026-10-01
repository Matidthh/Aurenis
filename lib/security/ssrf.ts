/**
 * Aurenis - Módulo de Prevención de Server-Side Request Forgery (SSRF)
 * Cumplimiento con OWASP Top 10:2025 (A10: SSRF) y OWASP ASVS 5.0 (V12.6).
 *
 * Bloquea:
 * 1. Direcciones de Loopback (127.0.0.0/8, ::1, localhost).
 * 2. Redes privadas RFC 1918 (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16).
 * 3. Enlaces locales y APIAP (169.254.0.0/16, fe80::/10).
 * 4. Endpoints de metadatos de proveedores Cloud (AWS / GCP / Azure 169.254.169.254, metadata.google.internal).
 * 5. Protocolos no seguros (file://, gopher://, dict://, ftp://).
 */

import net from "net";

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "metadata.google.internal",
  "metadata.google",
  "169.254.169.254",
  "instance-data",
]);

/**
 * Comprueba si una dirección IP IPv4 pertenece a rangos privados, loopback o reservados.
 */
function isPrivateIpv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some(isNaN)) return true;

  const [a, b] = parts;

  // 127.0.0.0/8 (Loopback)
  if (a === 127) return true;
  // 10.0.0.0/8 (Private Network RFC 1918)
  if (a === 10) return true;
  // 172.16.0.0/12 (Private Network RFC 1918)
  if (a === 172 && b >= 16 && b <= 31) return true;
  // 192.168.0.0/16 (Private Network RFC 1918)
  if (a === 192 && b === 168) return true;
  // 169.254.0.0/16 (Link-Local / Cloud Metadata)
  if (a === 169 && b === 254) return true;
  // 0.0.0.0/8 (Current network)
  if (a === 0) return true;
  // 224.0.0.0/4 (Multicast)
  if (a >= 224) return true;

  return false;
}

/**
 * Comprueba si una dirección IP IPv6 es privada o loopback.
 */
function isPrivateIpv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  if (normalized === "::1" || normalized === "::") return true;
  if (normalized.startsWith("fe80:") || normalized.startsWith("fc00:") || normalized.startsWith("fd00:")) {
    return true;
  }
  return false;
}

export interface SsrfValidationResult {
  safe: boolean;
  reason?: string;
  sanitizedUrl?: string;
}

/**
 * Valida de forma estricta una URL antes de que el servidor realice cualquier petición saliente.
 */
export function validateOutgoingUrl(rawUrl: string): SsrfValidationResult {
  if (!rawUrl || typeof rawUrl !== "string") {
    return { safe: false, reason: "URL no provista o tipo de dato inválido." };
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return { safe: false, reason: "Formato de URL inválido o malformado." };
  }

  // 1. Validar protocolo
  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    return {
      safe: false,
      reason: `Protocolo no permitido: '${parsed.protocol}'. Solo se admiten HTTP y HTTPS.`,
    };
  }

  const hostname = parsed.hostname.toLowerCase().trim();

  // 2. Validar lista negra de nombres de host
  if (BLOCKED_HOSTNAMES.has(hostname) || hostname.endsWith(".internal") || hostname.endsWith(".local")) {
    return {
      safe: false,
      reason: `Destino bloqueado por protección SSRF: Hostname interno o de metadatos '${hostname}'.`,
    };
  }

  // 3. Validar si el hostname es una IP directa
  if (net.isIP(hostname)) {
    if (net.isIPv4(hostname) && isPrivateIpv4(hostname)) {
      return {
        safe: false,
        reason: `Destino bloqueado por protección SSRF: Dirección IP privada/loopback '${hostname}'.`,
      };
    }
    if (net.isIPv6(hostname) && isPrivateIpv6(hostname)) {
      return {
        safe: false,
        reason: `Destino bloqueado por protección SSRF: Dirección IPv6 privada/loopback '${hostname}'.`,
      };
    }
  }

  // 4. Bloquear puertos de servicios internos conocidos
  const port = parsed.port ? parseInt(parsed.port, 10) : parsed.protocol === "https:" ? 443 : 80;
  const blockedPorts = new Set([22, 25, 3306, 5432, 6379, 27017, 9200, 11211, 2375, 2376]);
  if (blockedPorts.has(port)) {
    return {
      safe: false,
      reason: `Puerto de destino restringido (${port}) para prevenir escaneo de infraestructura interna.`,
    };
  }

  return { safe: true, sanitizedUrl: parsed.toString() };
}
