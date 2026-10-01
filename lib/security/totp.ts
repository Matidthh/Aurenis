/**
 * ============================================================================
 * AURENIS — MOTOR CRIPTOGRÁFICO TOTP (RFC 6238 & RFC 4226)
 * ============================================================================
 * Implementación nativa de alta seguridad para Autenticación Multifactor (MFA).
 * 
 * Características:
 * - Compatible con Google Authenticator, Microsoft Authenticator, 1Password, Authy.
 * - Algoritmo HMAC-SHA1 estándar (RFC 6238) con paso de tiempo de 30 segundos y 6 dígitos.
 * - Codificación/Decodificación Base32 según RFC 4648.
 * - Tolerancia de reloj justificada y mínima (±1 intervalo = ±30s).
 * - Prevención estricta de ataques de repetición (Replay Attack Prevention).
 * - Generación de Recovery Codes criptográficamente seguros con hashing SHA-256.
 * 
 * Autores: Maicol R. (Backend/Arquitectura) & Frank M. (QA/Seguridad)
 * ============================================================================
 */

import crypto from "crypto";
import { Redis } from "@upstash/redis";

// Alfabeto canónico Base32 (RFC 4648)
const BASE32_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

// Configuración estándar RFC 6238
export const TOTP_CONFIG = {
  STEP_SECONDS: 30,
  DIGITS: 6,
  ALGORITHM: "sha1" as const,
  WINDOW_TOLERANCE: 1, // ±1 paso (±30s)
  RECOVERY_CODES_COUNT: 8,
};

// Cliente Redis para sincronización de protección contra Replay en entornos distribuidos
let redisClient: Redis | null = null;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
} catch {
  // Fallback a almacenamiento en memoria
}

// Almacén en memoria de códigos TOTP usados para prevenir replay si Redis no está activo
const usedTotpCodesMemory = new Map<string, number>();

function cleanupMemoryReplayStore(): void {
  const now = Date.now();
  for (const [key, exp] of usedTotpCodesMemory.entries()) {
    if (now >= exp) {
      usedTotpCodesMemory.delete(key);
    }
  }
}

/**
 * Codifica un Buffer binario en una cadena Base32 (RFC 4648 sin padding)
 */
export function base32Encode(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = "";

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;

    while (bits >= 5) {
      output += BASE32_CHARS[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_CHARS[(value << (5 - bits)) & 31];
  }

  return output;
}

/**
 * Decodifica una cadena Base32 a Buffer binario
 */
export function base32Decode(base32Str: string): Buffer {
  const cleanStr = base32Str.toUpperCase().replace(/[^A-Z2-7]/g, "");
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < cleanStr.length; i++) {
    const char = cleanStr[i];
    const val = BASE32_CHARS.indexOf(char);
    if (val === -1) continue;

    value = (value << 5) | val;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

/**
 * Genera un secreto TOTP aleatorio de 20 bytes (160 bits) usando CSPRNG.
 * Retorna la representación en Base32 requerida por las apps autenticadoras.
 */
export function generateTotpSecret(byteLength: number = 20): string {
  const buffer = crypto.randomBytes(byteLength);
  return base32Encode(buffer);
}

/**
 * Genera el URI estándar otpauth:// compatible con lectores de códigos QR.
 */
export function generateTotpUri(params: {
  secret: string;
  accountName: string;
  issuer?: string;
}): string {
  const issuer = params.issuer || "Aurenis";
  const label = encodeURIComponent(`${issuer}:${params.accountName}`);
  const encodedIssuer = encodeURIComponent(issuer);
  return `otpauth://totp/${label}?secret=${params.secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}

/**
 * Calcula el código TOTP numérico de 6 dígitos para un secreto y paso de tiempo dado.
 */
export function calculateTotpCode(
  secretBase32: string,
  timeStep: number,
  digits: number = TOTP_CONFIG.DIGITS
): string {
  const key = base32Decode(secretBase32);
  if (key.length === 0) {
    throw new Error("Secreto Base32 inválido.");
  }

  // Contador de tiempo de 8 bytes en formato Big-Endian
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigInt64BE(BigInt(timeStep), 0);

  // HMAC-SHA1
  const hmac = crypto.createHmac(TOTP_CONFIG.ALGORITHM, key);
  hmac.update(counterBuffer);
  const digest = hmac.digest();

  // Truncamiento Dinámico (RFC 4226 §5.4)
  const offset = digest[digest.length - 1] & 0xf;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  const otp = binary % Math.pow(10, digits);
  return otp.toString().padStart(digits, "0");
}

/**
 * Obtiene el paso de tiempo actual (Unix Epoch / 30 segundos)
 */
export function getCurrentTimeStep(timestampMs: number = Date.now()): number {
  return Math.floor(timestampMs / 1000 / TOTP_CONFIG.STEP_SECONDS);
}

/**
 * Registra y comprueba si un código TOTP ya fue consumido en el paso actual para prevenir Replay.
 */
export async function isTotpReused(userId: string, code: string, timeStep: number): Promise<boolean> {
  const key = `totp_used:${userId}:${timeStep}:${code}`;
  const ttlSeconds = TOTP_CONFIG.STEP_SECONDS * 3; // Mantener por 90s

  if (redisClient) {
    try {
      const exists = await redisClient.get(key);
      if (exists) return true;
      await redisClient.set(key, "1", { ex: ttlSeconds });
      return false;
    } catch {
      // Fallback a memoria
    }
  }

  cleanupMemoryReplayStore();
  const now = Date.now();
  if (usedTotpCodesMemory.has(key)) {
    return true;
  }
  usedTotpCodesMemory.set(key, now + ttlSeconds * 1000);
  return false;
}

/**
 * Valida un código TOTP contra un secreto Base32 con tolerancia mínima de reloj y protección anti-replay.
 */
export async function verifyTotpCode(params: {
  secret: string;
  code: string;
  userId?: string;
  timestampMs?: number;
  windowTolerance?: number;
  skipReplayCheck?: boolean;
}): Promise<{ valid: boolean; matchedTimeStep?: number; reason?: string }> {
  const cleanCode = params.code.trim().replace(/\s+/g, "");
  if (!/^\d{6}$/.test(cleanCode)) {
    return { valid: false, reason: "El código debe contener exactamente 6 dígitos numéricos." };
  }

  const currentStep = getCurrentTimeStep(params.timestampMs || Date.now());
  const tolerance = params.windowTolerance ?? TOTP_CONFIG.WINDOW_TOLERANCE;

  // Evaluar ventana [-tolerance, ..., +tolerance]
  for (let offset = -tolerance; offset <= tolerance; offset++) {
    const stepToTest = currentStep + offset;
    let expectedCode: string;
    try {
      expectedCode = calculateTotpCode(params.secret, stepToTest);
    } catch {
      return { valid: false, reason: "Secreto TOTP corrupto o ilegible." };
    }

    // Comparación en tiempo constante para mitigar ataques de temporización
    const isMatch =
      cleanCode.length === expectedCode.length &&
      crypto.timingSafeEqual(Buffer.from(cleanCode), Buffer.from(expectedCode));

    if (isMatch) {
      if (params.userId && !params.skipReplayCheck) {
        const reused = await isTotpReused(params.userId, cleanCode, stepToTest);
        if (reused) {
          return { valid: false, reason: "Código TOTP ya utilizado. Espere el siguiente ciclo de 30 segundos." };
        }
      }
      return { valid: true, matchedTimeStep: stepToTest };
    }
  }

  return { valid: false, reason: "Código TOTP inválido o expirado." };
}

// ============================================================================
// RECOVERY CODES CRIPTOGRÁFICOS
// ============================================================================

export interface GeneratedRecoveryCodes {
  plainCodes: string[];
  hashedCodes: string[];
}

/**
 * Hashea un recovery code con SHA-256 para almacenamiento seguro en base de datos.
 */
export function hashRecoveryCode(code: string): string {
  const normalized = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

/**
 * Genera códigos de recuperación criptográficamente seguros formateados como XXXX-XXXX-XXXX-XXXX.
 */
export function generateRecoveryCodes(count: number = TOTP_CONFIG.RECOVERY_CODES_COUNT): GeneratedRecoveryCodes {
  const plainCodes: string[] = [];
  const hashedCodes: string[] = [];

  for (let i = 0; i < count; i++) {
    const raw = crypto.randomBytes(8).toString("hex").toUpperCase();
    const formatted = `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}`;
    plainCodes.push(formatted);
    hashedCodes.push(hashRecoveryCode(formatted));
  }

  return { plainCodes, hashedCodes };
}

/**
 * Verifica si un código de recuperación provisto coincide con alguno de los hashes almacenados.
 * Retorna el índice del hash coincidente o -1 si es inválido.
 */
export function verifyRecoveryCode(plainCode: string, storedHashes: string[]): number {
  if (!plainCode || typeof plainCode !== "string" || storedHashes.length === 0) {
    return -1;
  }

  const candidateHash = hashRecoveryCode(plainCode);
  const candidateBuf = Buffer.from(candidateHash, "hex");

  for (let i = 0; i < storedHashes.length; i++) {
    const targetHash = storedHashes[i];
    if (!targetHash || targetHash.length !== 64) continue;
    const targetBuf = Buffer.from(targetHash, "hex");

    if (candidateBuf.length === targetBuf.length && crypto.timingSafeEqual(candidateBuf, targetBuf)) {
      return i;
    }
  }

  return -1;
}
