import crypto from "crypto";

/**
 * Utilidad de Cifrado AES-256 a nivel de aplicación para campos sensibles (RUT, notas médicas, etc.)
 * Autores: Malcom Marcelo (Arquitectura y Criptografía) y Carlos M. (Cumplimiento Legal y Privacidad)
 * Hardening: Eliminado fallback inseguro a JWT_SECRET. Exige APP_ENCRYPTION_KEY de 32+ caracteres.
 */

const ALGORITHM = "aes-256-cbc";
const DEV_ENCRYPTION_FALLBACK = "aurenis-dev-field-encryption-key-min-32-chars-long!";

function getEncryptionKey(): Buffer {
  const secret = process.env.APP_ENCRYPTION_KEY;
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    if (!secret || secret.length < 32) {
      throw new Error("CRITICAL_SECURITY_ERROR: APP_ENCRYPTION_KEY is missing or shorter than 32 characters in production.");
    }
    return crypto.createHash("sha256").update(secret).digest();
  }

  // En desarrollo o entornos de prueba sin variable configurada, utilizar clave garantizada de 256 bits
  const activeKey = secret && secret.length >= 32 ? secret : DEV_ENCRYPTION_FALLBACK;
  return crypto.createHash("sha256").update(activeKey).digest();
}

export function encryptField(text: string | null | undefined): string | null {
  if (!text || typeof text !== "string" || text.trim() === "") return text as any;
  if (text.includes(":") && text.length > 35) return text;
  try {
    const iv = crypto.randomBytes(16);
    const key = getEncryptionKey();
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
  } catch (err) {
    console.error("Error crítico en cifrado de campo:", err);
    if (process.env.NODE_ENV === "production") {
      throw new Error("Fallo de seguridad al cifrar campo sensible. Operación cancelada por política Fail-Closed.");
    }
    // En entornos no productivos registrar el fallo
    return text;
  }
}

export function decryptField(ciphertext: string | null | undefined): string | null {
  if (!ciphertext || typeof ciphertext !== "string" || !ciphertext.includes(":")) return ciphertext as any;
  try {
    const [ivHex, encryptedHex] = ciphertext.split(":");
    if (!ivHex || !encryptedHex) return ciphertext;
    const iv = Buffer.from(ivHex, "hex");
    const key = getEncryptionKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("hex");
    return decrypted;
  } catch {
    return ciphertext;
  }
}
