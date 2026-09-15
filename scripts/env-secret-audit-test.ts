/**
 * Aurenis — Suite de Verificación: Seguridad de Entorno (.env), Historial Git y Claves Criptográficas
 *
 * Criterios de Aceptación:
 * 1. Archivo .env incluido en .gitignore
 * 2. Revisión del historial git sin secretos expuestos
 * 3. Claves criptográficas con longitud suficiente (>= 256 bits / 32 bytes para HS256, entropía de Shannon)
 */

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";
import {
  validateCryptographicKey,
  generateSecureSecret,
  calculateShannonEntropy,
  getValidatedJwtSecret,
} from "../lib/security/crypto-keys";

interface TestReport {
  id: string;
  name: string;
  passed: boolean;
  details: string;
}

const reports: TestReport[] = [];

function report(id: string, name: string, passed: boolean, details: string) {
  reports.push({ id, name, passed, details });
  const icon = passed ? "✅ PASSED" : "❌ FAILED";
  console.log(`[${reports.length}] [${id}] ${icon}: ${name}`);
  console.log(`    ↳ ${details}`);
}

async function runAudit() {
  console.log("================================================================================");
  console.log("🔒 AURENIS — AUDITORÍA DE SEGURIDAD: .ENV, HISTORIAL GIT Y ROBUSTEZ CRIPTOGRÁFICA");
  console.log("================================================================================\n");

  // ============================================================================
  // CRITERIO 1: Archivo .env incluido en .gitignore
  // ============================================================================
  console.log("--- [CRITERIO 1] Archivo .env incluido en .gitignore ---");

  const gitignorePath = path.resolve(process.cwd(), ".gitignore");
  const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");

  // 1.1: Regla .env presente en el archivo .gitignore
  const hasEnvInGitignore = gitignoreContent.split("\n").some((line) => {
    const trimmed = line.trim();
    return trimmed === ".env" || trimmed === "/.env" || trimmed === "*.env";
  });

  report(
    "ENV-01",
    "El archivo .gitignore contiene explícitamente la regla para excluir '.env'",
    hasEnvInGitignore,
    `Regla .env detectada en .gitignore: ${hasEnvInGitignore}`
  );

  // 1.2: Variantes de entornos locales excluidas (.env.local, .env.production, etc.)
  const hasEnvLocalInGitignore = gitignoreContent.includes(".env*.local") || gitignoreContent.includes(".env.local");
  const hasEnvWildcard = gitignoreContent.includes("*.env");

  report(
    "ENV-02",
    "El archivo .gitignore contiene exclusiones completas para variantes de entornos (.env*.local, *.env)",
    hasEnvLocalInGitignore && hasEnvWildcard,
    `Exclusiones de variantes presentes: local=${hasEnvLocalInGitignore}, wildcard=${hasEnvWildcard}`
  );

  // 1.3: Verificación con git check-ignore en simulación de archivos
  let gitCheckIgnorePassed = false;
  try {
    const output = execSync("git check-ignore -v .env .env.local .env.production.local", {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    gitCheckIgnorePassed = output.includes(".gitignore") && output.includes(".env");
  } catch (e: any) {
    // Si algún archivo está ignorado, check-ignore retorna 0 o status según coincidencia
    gitCheckIgnorePassed = e.stdout?.includes(".gitignore") || false;
  }

  report(
    "ENV-03",
    "El comando 'git check-ignore' confirma que Git ignora activamente .env y sus variantes",
    gitCheckIgnorePassed,
    "Git aplica las directivas de .gitignore sobre .env, .env.local y .env.production.local"
  );

  // 1.4: La plantilla .env.example NO está ignorada (debe ser pública)
  let exampleNotIgnored = true;
  try {
    const exampleCheck = execSync("git check-ignore .env.example", {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    // Si devuelve salida, significa que fue erróneamente ignorado
    exampleNotIgnored = exampleCheck.trim().length === 0;
  } catch {
    // Código de salida no-cero significa que NO está ignorado (comportamiento esperado)
    exampleNotIgnored = true;
  }

  report(
    "ENV-04",
    "La plantilla pública .env.example se mantiene rastreable y no es ignorada",
    exampleNotIgnored,
    "El archivo .env.example permanece disponible como plantilla documental sin contener secretos"
  );

  // ============================================================================
  // CRITERIO 2: Revisión del historial git sin secretos expuestos
  // ============================================================================
  console.log("\n--- [CRITERIO 2] Revisión del historial git sin secretos expuestos ---");

  // 2.1: Búsqueda de archivos .env confirmados en el historial de commits
  let noEnvCommitted = false;
  try {
    const gitLogFiles = execSync(
      `git log --all --full-history --name-only --format="" | grep -E "(^|/)\.env(\.[^/]+)?$" | grep -v "example" || true`,
      { encoding: "utf-8" }
    ).trim();

    noEnvCommitted = gitLogFiles.length === 0;
    report(
      "GIT-01",
      "El historial completo de commits de Git no contiene ningún archivo .env comprometido",
      noEnvCommitted,
      noEnvCommitted
        ? "Ningún archivo .env real ha sido confirmado jamás en el repositorio"
        : `Archivos detectados en historial: ${gitLogFiles}`
    );
  } catch (e: any) {
    report("GIT-01", "Búsqueda en historial git", false, e.message);
  }

  // 2.2: Escaneo de claves criptográficas privadas expuestas en parches del historial
  let noPrivateKeysExposed = false;
  try {
    const privateKeyMatches = execSync(
      `git log -p | grep -E -i "BEGIN [A-Z ]*PRIVATE KEY" || true`,
      { encoding: "utf-8" }
    ).trim();

    noPrivateKeysExposed = privateKeyMatches.length === 0;
    report(
      "GIT-02",
      "El historial de Git no contiene claves privadas PEM/RSA/EC expuestas (BEGIN PRIVATE KEY)",
      noPrivateKeysExposed,
      noPrivateKeysExposed
        ? "0 claves privadas encontradas en el historial de commits"
        : "Se detectaron firmas de claves privadas en el historial"
    );
  } catch (e: any) {
    report("GIT-02", "Escaneo de claves privadas", false, e.message);
  }

  // 2.3: Escaneo de tokens o secretos de servicios de producción en el historial
  let noProdSecretsExposed = false;
  try {
    // Busca tokens de producción conocidos como sk_live, ghp_, xoxb, AKIA, etc.
    const secretMatches = execSync(
      `git log -p | grep -E "(sk_live_[0-9a-zA-Z]{24}|ghp_[0-9a-zA-Z]{36}|xox[baprs]-[0-9a-zA-Z]{10,48}|AKIA[0-9A-Z]{16})" || true`,
      { encoding: "utf-8" }
    ).trim();

    noProdSecretsExposed = secretMatches.length === 0;
    report(
      "GIT-03",
      "El historial de Git no contiene credenciales vivas de proveedores (Stripe, GitHub, AWS, Slack)",
      noProdSecretsExposed,
      noProdSecretsExposed
        ? "0 credenciales vivas de terceros detectadas en el historial"
        : `Posibles secretos encontrados: ${secretMatches.slice(0, 80)}...`
    );
  } catch (e: any) {
    report("GIT-03", "Escaneo de tokens en git log", false, e.message);
  }

  // ============================================================================
  // CRITERIO 3: Claves criptográficas con longitud suficiente
  // ============================================================================
  console.log("\n--- [CRITERIO 3] Claves criptográficas con longitud suficiente ---");

  // 3.1: Rechazo de clave con longitud insuficiente (< 256 bits / 32 bytes para HS256)
  const shortSecret = "clave-corta-16-b"; // 16 bytes = 128 bits
  const validationShort = validateCryptographicKey(shortSecret, "HS256");

  report(
    "CRYPTO-01",
    "El validador criptográfico rechaza claves con longitud inferior a 256 bits (32 bytes) para HS256",
    !validationShort.isValid && validationShort.bitLength === 128 && validationShort.minBitLengthRequired === 256,
    `Longitud: ${validationShort.bitLength} bits. Rechazada con motivo: "${validationShort.issues[0]}"`
  );

  // 3.2: Rechazo de claves con baja entropía o patrones predecibles/repetitivos
  const repetitiveSecret = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"; // 32 bytes pero 1 solo carácter repetido
  const validationRepetitive = validateCryptographicKey(repetitiveSecret, "HS256");

  report(
    "CRYPTO-02",
    "El validador criptográfico rechaza claves débiles o con baja entropía de Shannon",
    !validationRepetitive.isValid && validationRepetitive.isWeakPattern,
    `Entropía: ${validationRepetitive.entropy} bits/char. Rechazada por patrón débil: ${validationRepetitive.isWeakPattern}`
  );

  // 3.3: Aceptación de clave generada con CSPRNG de 256 bits (32 bytes)
  const secureKey256 = generateSecureSecret(32, "hex"); // 64 caracteres hex = 32 bytes = 256 bits
  const validation256 = validateCryptographicKey(secureKey256, "HS256");

  report(
    "CRYPTO-03",
    "El generador CSPRNG produce claves robustas que cumplen la longitud mínima y entropía para HS256",
    validation256.isValid && validation256.bitLength >= 256 && validation256.entropy > 3.0,
    `Longitud: ${validation256.bitLength} bits (${validation256.byteLength} bytes), Entropía: ${validation256.entropy} bits/char`
  );

  // 3.4: Validación de claves de alta seguridad para HS512 (>= 512 bits / 64 bytes)
  const secureKey512 = generateSecureSecret(64, "hex"); // 128 caracteres hex = 64 bytes = 512 bits
  const validation512 = validateCryptographicKey(secureKey512, "HS512");

  report(
    "CRYPTO-04",
    "El validador soporta claves robustas de 512 bits (64 bytes) para algoritmos de alta seguridad HS512",
    validation512.isValid && validation512.bitLength >= 512,
    `Longitud: ${validation512.bitLength} bits, Requeridos: ${validation512.minBitLengthRequired} bits`
  );

  // 3.5: Enforzamiento estricto en producción: getValidatedJwtSecret lanza excepción ante clave ausente o débil
  let threwInProductionWithoutKey = false;
  const originalEnv = process.env.NODE_ENV;
  const originalSecret = process.env.JWT_SECRET;

  try {
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    delete process.env.JWT_SECRET;
    getValidatedJwtSecret();
  } catch (e: any) {
    threwInProductionWithoutKey = e.message.includes("JWT_SECRET es requerida en producción");
  } finally {
    (process.env as Record<string, string | undefined>).NODE_ENV = originalEnv;
    if (originalSecret) {
      process.env.JWT_SECRET = originalSecret;
    }
  }

  report(
    "CRYPTO-05",
    "getValidatedJwtSecret() bloquea el arranque en producción si JWT_SECRET no está definida",
    threwInProductionWithoutKey,
    "Excepción crítica disparada adecuadamente al detectar entorno de producción sin secreto configurado"
  );

  // ============================================================================
  // RESUMEN
  // ============================================================================
  const passedCount = reports.filter((r) => r.passed).length;
  const totalCount = reports.length;
  const percent = ((passedCount / totalCount) * 100).toFixed(1);

  console.log("\n================================================================================");
  console.log(`📊 TOTAL PRUEBAS: ${totalCount} | APROBADAS: ${passedCount} | FALLIDAS: ${totalCount - passedCount} (${percent}% Conforme)`);
  console.log("================================================================================\n");

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

runAudit();
