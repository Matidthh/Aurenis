import { NextRequest } from "next/server";

interface SecurityAuditRecord {
  ip: string;
  userAgent: string;
  path: string;
  threatDetected: string | null;
  trustScore: number;
  timestamp: number;
}

// Registro en memoria de reputación de IPs y heurísticas de seguridad
const ipReputationMap = new Map<string, { requests: number; violations: number; blockedUntil: number }>();

/**
 * Servicio de Firewall de Aplicaciones (WAF) y Detección de Intenciones Maliciosas
 */
export class SecurityFirewallService {
  /**
   * Analiza una petición entrante en busca de comportamientos maliciosos o ataques comunes.
   */
  static inspectRequest(req: NextRequest): { allowed: boolean; reason?: string; trustScore: number } {
    const rawIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const ip = rawIp.split(",")[0].trim();
    const userAgent = req.headers.get("user-agent") || "";
    const url = req.url;
    const now = Date.now();

    // Si la ruta es expresamente un health check sin parámetros sospechosos
    const parsedPath = new URL(url).pathname;
    if (parsedPath === "/api/health" || parsedPath === "/api/system/health") {
      return { allowed: true, trustScore: 100 };
    }

    let record = ipReputationMap.get(ip);
    if (!record) {
      record = { requests: 0, violations: 0, blockedUntil: 0 };
      ipReputationMap.set(ip, record);
    }

    // Verificar si la IP está bloqueada temporalmente por mal comportamiento
    if (record.blockedUntil > now) {
      return {
        allowed: false,
        reason: "IP bloqueada temporalmente por exceso de anomalías o intentos maliciosos detectados.",
        trustScore: 0,
      };
    }

    record.requests++;

    // 1. Detección de bots sin User-Agent legítimo o atacantes automatizados
    if (!userAgent || userAgent.length < 5 || userAgent.toLowerCase().includes("sqlmap") || userAgent.toLowerCase().includes("nikto") || userAgent.toLowerCase().includes("scanner")) {
      record.violations++;
      if (record.violations > 3) {
        record.blockedUntil = now + 15 * 60 * 1000; // Bloqueo por 15 min
      }
      return {
        allowed: false,
        reason: "Firma de cliente no válida o bot malicioso identificado.",
        trustScore: 10,
      };
    }

    // 2. Heurísticas de inyección o payloads sospechosos en URL (con soporte para decodificación URI)
    let decodedUrl = url.toLowerCase();
    try {
      decodedUrl = decodeURIComponent(url).toLowerCase();
    } catch {
      // Ignorar fallo de decodificación malformada
    }
    const lowerUrl = url.toLowerCase();
    const suspiciousPatterns = ["union select", "script>", "<svg", "drop table", "../", "etc/passwd", "eval("];
    for (const pattern of suspiciousPatterns) {
      if (lowerUrl.includes(pattern) || decodedUrl.includes(pattern)) {
        record.violations += 5;
        record.blockedUntil = now + 60 * 60 * 1000; // Bloqueo por 1 hora
        return {
          allowed: false,
          reason: `Intento de ataque detectado y bloqueado (${pattern}).`,
          trustScore: 0,
        };
      }
    }

    // Cliente con buenas intenciones
    return {
      allowed: true,
      trustScore: Math.max(100 - record.violations * 10, 50),
    };
  }

  /**
   * Reporta una anomalía o fallo de validación grave desde un usuario
   */
  static reportViolation(req: NextRequest, severity: number = 1) {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    let record = ipReputationMap.get(ip);
    if (!record) {
      record = { requests: 0, violations: 0, blockedUntil: 0 };
      ipReputationMap.set(ip, record);
    }
    record.violations += severity;
    if (record.violations >= 10) {
      record.blockedUntil = Date.now() + 30 * 60 * 1000;
    }
  }
}
