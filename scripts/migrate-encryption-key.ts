import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

/**
 * Script de Migración de Clave de Cifrado (AES-256-CBC)
 * Autores: Malcom Marcelo y Carlos M.
 * Uso: npx tsx scripts/migrate-encryption-key.ts [--dry-run]
 */

const prisma = new PrismaClient();
const ALGORITHM = "aes-256-cbc";

function getOldKey(): Buffer {
  const oldSecret = process.env.JWT_SECRET || "aurenis-default-super-secret-key-at-least-32-characters";
  return crypto.createHash("sha256").update(oldSecret).digest();
}

function getNewKey(): Buffer {
  const newSecret = process.env.APP_ENCRYPTION_KEY;
  if (!newSecret || newSecret.length < 32) {
    throw new Error("APP_ENCRYPTION_KEY debe estar configurada y tener al menos 32 caracteres.");
  }
  return crypto.createHash("sha256").update(newSecret).digest();
}

function decryptWithOldKey(ciphertext: string | null | undefined): string | null {
  if (!ciphertext || typeof ciphertext !== "string" || !ciphertext.includes(":")) return ciphertext as any;
  try {
    const [ivHex, encryptedHex] = ciphertext.split(":");
    if (!ivHex || !encryptedHex) return ciphertext;
    const iv = Buffer.from(ivHex, "hex");
    const key = getOldKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch {
    return ciphertext; // Si ya estaba descifrado o falla
  }
}

function encryptWithNewKey(text: string | null | undefined): string | null {
  if (!text || typeof text !== "string" || text.trim() === "") return text as any;
  // Si ya tiene formato iv:ciphertext, intentar quitarlo o re-cifrar
  try {
    const iv = crypto.randomBytes(16);
    const key = getNewKey();
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
  } catch (err) {
    console.error("Error al re-cifrar:", err);
    return text;
  }
}

async function main() {
  const isDryRun = process.argv.includes("--dry-run");
  console.log(`[MIGRATION] Iniciando migración de clave de cifrado. Modo Dry-Run: ${isDryRun}`);

  const users = await prisma.user.findMany({
    where: { rutOrNationalId: { not: null } },
    select: { id: true, rutOrNationalId: true },
  });

  console.log(`[MIGRATION] Total de usuarios con RUT encontrados: ${users.length}`);

  let migratedCount = 0;
  for (const user of users) {
    if (!user.rutOrNationalId) continue;

    // 1. Descifrar con la key vieja
    const plainText = decryptWithOldKey(user.rutOrNationalId);
    if (!plainText) continue;

    // 2. Cifrar con la key nueva
    const newCiphertext = encryptWithNewKey(plainText);

    if (!isDryRun && newCiphertext) {
      await prisma.user.update({
        where: { id: user.id },
        data: { rutOrNationalId: newCiphertext },
      });
    }

    migratedCount++;
    if (migratedCount % 50 === 0) {
      console.log(`[MIGRATION] Procesados ${migratedCount}/${users.length} registros...`);
    }
  }

  console.log(`[MIGRATION] Migración completada exitosamente. Total procesados: ${migratedCount}`);
}

main()
  .catch((e) => {
    console.error("[MIGRATION ERROR]:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
