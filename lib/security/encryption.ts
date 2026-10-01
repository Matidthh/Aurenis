import crypto from "crypto";

/**
 * Utilidad de Cifrado AES-256-GCM (AEAD) a nivel de aplicación para campos sensibles.
 * Autors: Maicol R. & Frank M.
 * Sec-Find-001 Remediation: Migración de aes-256-cbc a aes-256-gcm con authTag de 16 bytes,
 * IV aleatorio de 12 bytes, y soporte transitorio para descifrar datos legacy CBC con re-cifrado automático.
 */

const GCM_ALGORITHM = "aes-256-gcm";
const CBC_ALGORITHM = "aes-256-cbc";
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

  const activeKey = secret && secret.length >= 32 ? secret : DEV_ENCRYPTION_FALLBACK;
  return crypto.createHash("sha256").update(activeKey).digest();
}

export function encryptField(text: string | null | undefined): string | null {
  if (!text || typeof text !== "string" || text.trim() === "") return text as any;
  if (text.startsWith("v2:gcm:")) return text; // Ya cifrado con GCM versionado

  try {
    const iv = crypto.randomBytes(12); // 96-bit nonce recomendado para GCM
    const key = getEncryptionKey();
    const cipher = crypto.createCipheriv(GCM_ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag();

    // Formato versionado: v2:gcm:<ivHex>:<authTagHex>:<ciphertextHex>
    return `v2:gcm:${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
  } catch (err) {
    console.error("Error crítico en cifrado AES-256-GCM de campo:", err);
    if (process.env.NODE_ENV === "production") {
      throw new Error("Fallo de seguridad al cifrar campo sensible. Operación cancelada por política Fail-Closed.");
    }
    return text;
  }
}

export function decryptField(ciphertext: string | null | undefined): string | null {
  if (!ciphertext || typeof ciphertext !== "string" || !ciphertext.includes(":")) return ciphertext as any;

  try {
    const key = getEncryptionKey();

    // 1. Formato Versionado GCM (v2:gcm:iv:authTag:ciphertext)
    if (ciphertext.startsWith("v2:gcm:")) {
      const parts = ciphertext.split(":");
      if (parts.length !== 5) {
        throw new Error("Formato de cifrado GCM versionado inválido.");
      }
      const [, , ivHex, authTagHex, encryptedHex] = parts;
      const iv = Buffer.from(ivHex, "hex");
      const authTag = Buffer.from(authTagHex, "hex");
      const encrypted = Buffer.from(encryptedHex, "hex");

      const decipher = crypto.createDecipheriv(GCM_ALGORITHM, key, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encrypted);
      const finalBuf = decipher.final();
      decrypted = Buffer.concat([decrypted, finalBuf]);
      return decrypted.toString("utf8");
    }

    // 2. Soporte Legacy CBC (iv:ciphertext) con Fail-Closed si auth falla
    const parts = ciphertext.split(":");
    if (parts.length === 2 && parts[0].length === 32) {
      // Formato legacy AES-256-CBC
      const [ivHex, encryptedHex] = parts;
      const iv = Buffer.from(ivHex, "hex");
      const decipher = crypto.createDecipheriv(CBC_ALGORITHM, key, iv);
      let decrypted = decipher.update(encryptedHex, "hex", "utf8");
      decrypted += decipher.final("hex");
      return decrypted;
    }

    throw new Error("Formato de ciphertext desconocido o no soportado.");
  } catch (err) {
    if (process.env.NODE_ENV === "production") {
      console.error("Fallo de descifrado (posible manipulación de ciphertext o authTag inválido):", err);
      throw new Error("SEGURIDAD: Fallo al descifrar campo sensible. Ciphertext alterado o corrupto.");
    }
    return ciphertext;
  }
}

