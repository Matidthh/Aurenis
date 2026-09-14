/**
 * Aurenis Input Sanitization & Security Module
 * Utilidades de limpieza, escape y neutralización de entradas maliciosas (XSS, SQLi, Buffer Overflows).
 */

/**
 * Escapa caracteres HTML especiales para evitar inyección en contextos fuera del JSX estándar.
 */
export function escapeHtml(str: string): string {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Limpia y normaliza cadenas de texto eliminando caracteres de control, bytes nulos y espacios redundantes.
 */
export function sanitizeString(input: unknown): string {
  if (input === null || input === undefined) return "";
  if (typeof input !== "string") return String(input);

  return input
    // Eliminar caracteres nulos (Null Bytes \0) que pueden corromper buffers o parsers
    .replace(/\0/g, "")
    // Eliminar caracteres de control no imprimibles (excepto saltos de línea y tabulaciones legítimas)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    // Normalizar espacios
    .trim();
}

/**
 * Limpia recursivamente todas las propiedades de un objeto o payload JSON recibido.
 */
export function sanitizeObject<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "string") {
    return sanitizeString(obj) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item)) as unknown as T;
  }

  if (typeof obj === "object" && !(obj instanceof Date) && !(obj instanceof RegExp)) {
    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      // Prevenir Prototype Pollution
      if (key === "__proto__" || key === "constructor" || key === "prototype") {
        continue;
      }
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized as T;
  }

  return obj;
}

/**
 * Valida si un texto contiene patrones altamente anómalos o sospechosos.
 */
export function isAnomalousPayload(text: string): boolean {
  if (!text || typeof text !== "string") return false;

  // 1. Longitud excesiva para campos normales (> 20,000 caracteres)
  if (text.length > 20000) return true;

  // 2. Presencia de bytes nulos
  if (text.includes("\0")) return true;

  // 3. Intento de evasión de directorios crítico
  if (text.includes("../../../") || text.includes("..\\..\\..\\")) return true;

  return false;
}
