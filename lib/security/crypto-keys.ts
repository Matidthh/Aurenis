/**
 * Módulo de Auditoría y Validación de Claves Criptográficas — Aurenis
 *
 * Cumple con los estándares NIST SP 800-131A y RFC 7518 (JSON Web Algorithms):
 * - HS256: Longitud mínima de clave de 256 bits (32 bytes).
 * - HS384: Longitud mínima de clave de 384 bits (48 bytes).
 * - HS512: Longitud mínima de clave de 512 bits (64 bytes).
 * - Evaluación de Entropía de Shannon para descartar cadenas triviales o repetitivas.
 * - Generador CSPRNG de claves criptográficamente seguras.
 */

import { randomBytes } from "crypto";

export interface KeyValidationResult {
  isValid: boolean;
  algorithm: string;
  byteLength: number;
  bitLength: number;
  minBitLengthRequired: number;
  entropy: number;
  isWeakPattern: boolean;
  issues: string[];
}

// Patrones triviales o contraseñas por defecto no permitidas en producción
export const BANNED_SECRET_PATTERNS = [
  "password",
  "secret",
  "123456",
  "default",
  "changeme",
  "admin",
  "jwt_secret",
  "qwerty",
];

/**
 * Calcula la entropía de Shannon (bits por carácter) de una cadena.
 * Cadenas altamente aleatorias tienen entropía > 3.5 bits/char.
 */
export function calculateShannonEntropy(str: string): number {
  if (!str) return 0;
  const len = str.length;
  const frequencies = new Map<string, number>();

  for (const char of str) {
    frequencies.set(char, (frequencies.get(char) || 0) + 1);
  }

  let entropy = 0;
  for (const count of frequencies.values()) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }

  return entropy;
}

/**
 * Valida la robustez y longitud criptográfica de una clave para un algoritmo dado.
 */
export function validateCryptographicKey(
  secret: string | undefined | null,
  algorithm: "HS256" | "HS384" | "HS512" = "HS256"
): KeyValidationResult {
  const issues: string[] = [];
  const minBytes = algorithm === "HS256" ? 32 : algorithm === "HS384" ? 48 : 64;
  const minBits = minBytes * 8;

  if (!secret) {
    return {
      isValid: false,
      algorithm,
      byteLength: 0,
      bitLength: 0,
      minBitLengthRequired: minBits,
      entropy: 0,
      isWeakPattern: true,
      issues: ["La clave no está definida o está vacía."],
    };
  }

  const byteLength = new TextEncoder().encode(secret).length;
  const bitLength = byteLength * 8;
  const entropy = calculateShannonEntropy(secret);

  // 1. Verificación de longitud en bits
  if (bitLength < minBits) {
    issues.push(
      `Longitud insuficiente para ${algorithm}: Se requieren al menos ${minBits} bits (${minBytes} bytes), pero la clave tiene solo ${bitLength} bits (${byteLength} bytes).`
    );
  }

  // 2. Detección de patrones débiles o repetitivos
  const lower = secret.toLowerCase();
  const isWeak = BANNED_SECRET_PATTERNS.some((pattern) => {
    // Si la clave contiene o consiste repetitivamente en el patrón débil
    if (lower.includes(pattern)) {
      const remaining = lower.replaceAll(pattern, "").replaceAll(/[_\-0-9]/g, "");
      return remaining.length < 8; // Esencialmente el secreto es una variación del patrón débil
    }
    return false;
  });

  // Repetición simple (ej. "aaaaaaaaaaaa...")
  const isMonotonous = new Set(secret).size < 4 && secret.length > 8;

  if (isWeak || isMonotonous) {
    issues.push("La clave utiliza patrones débiles, repetitivos o predecibles.");
  }

  // 3. Verificación de entropía mínima
  if (entropy < 2.5 && byteLength >= minBytes) {
    issues.push(`La entropía de la clave es muy baja (${entropy.toFixed(2)} bits/carácter), carece de aleatoriedad suficiente.`);
  }

  return {
    isValid: issues.length === 0,
    algorithm,
    byteLength,
    bitLength,
    minBitLengthRequired: minBits,
    entropy: Number(entropy.toFixed(2)),
    isWeakPattern: isWeak || isMonotonous,
    issues,
  };
}

/**
 * Genera una clave criptográfica aleatoria segura con la longitud deseada usando CSPRNG.
 */
export function generateSecureSecret(byteLength: number = 32, encoding: "hex" | "base64" = "hex"): string {
  if (byteLength < 32) {
    throw new Error("Por razones de seguridad, las claves generadas deben tener al menos 32 bytes (256 bits).");
  }
  return randomBytes(byteLength).toString(encoding);
}

// Fallback de desarrollo con 256 bits (32 bytes) garantizados
const DEVELOPMENT_FALLBACK_SECRET = "aurenis-dev-fallback-secure-secret-key-min-256-bits-ok!!";

/**
 * Obtiene la clave JWT_SECRET verificada y protegida según el entorno.
 * En producción (NODE_ENV === "production"), el secreto DEBE existir y tener al menos 32 bytes (256 bits).
 */
export function getValidatedJwtSecret(): Uint8Array {
  const secretEnv = process.env.JWT_SECRET;
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    if (!secretEnv) {
      throw new Error(
        "[CRITICAL_SECURITY_ERROR] La variable de entorno JWT_SECRET es requerida en producción y no ha sido definida."
      );
    }

    const validation = validateCryptographicKey(secretEnv, "HS256");
    if (!validation.isValid) {
      throw new Error(
        `[CRITICAL_SECURITY_ERROR] JWT_SECRET inválido en producción: ${validation.issues.join(" ")}`
      );
    }

    return new TextEncoder().encode(secretEnv);
  }

  // Entorno de desarrollo o pruebas
  if (secretEnv) {
    const validation = validateCryptographicKey(secretEnv, "HS256");
    if (!validation.isValid) {
      console.warn(
        `⚠️ [SECURITY WARNING] JWT_SECRET no cumple los estándares criptográficos recomendados: ${validation.issues.join(" ")}`
      );
    }
    return new TextEncoder().encode(secretEnv);
  }

  // Fallback seguro de desarrollo (>= 256 bits)
  return new TextEncoder().encode(DEVELOPMENT_FALLBACK_SECRET);
}
