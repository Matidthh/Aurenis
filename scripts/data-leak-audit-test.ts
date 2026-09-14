/**
 * Aurenis Data Leak & PII Audit Test Suite
 * 
 * Verifica los 3 Criterios de Aceptación:
 * 1. Hash de contraseña ausente en todas las respuestas JSON de la API
 * 2. Logs del servidor limpios de datos sensibles y PII (redacción y enmascaramiento)
 * 3. Bundle frontend y archivos cliente verificados sin API keys privadas ni secretos
 */

import { stripSensitiveFields, redactPiiInString, safeLogger, SENSITIVE_KEYS } from "../lib/security/redaction";
import { formatSuccessResponse, formatErrorResponse } from "../lib/api/response";
import * as fs from "fs";
import * as path from "path";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

let passedCount = 0;
let failedCount = 0;
let totalTests = 0;

function report(id: string, name: string, passed: boolean, details: string) {
  totalTests++;
  if (passed) {
    passedCount++;
    console.log(`[${totalTests}] [${id}] ✅ PASSED: ${name}`);
    console.log(`    ↳ ${details}`);
  } else {
    failedCount++;
    console.error(`[${totalTests}] [${id}] ❌ FAILED: ${name}`);
    console.error(`    ↳ ${details}`);
  }
}

/**
 * Escanea recursivamente un objeto o JSON en busca de cadenas o claves que contengan 'password', 'hash', 'bcrypt' o secretos
 */
function scanForLeaks(data: any, path: string = ""): { leaked: boolean; leakPath?: string; value?: any } {
  if (data === null || data === undefined) return { leaked: false };

  if (typeof data === "string") {
    // Detectar si es un hash bcrypt ($2a$, $2b$, $2y$)
    if (/^\$2[aby]\$[0-9]{2}\$[./A-Za-z0-9]{53}$/.test(data)) {
      return { leaked: true, leakPath: path, value: "[BCRYPT_HASH_DETECTED]" };
    }
    return { leaked: false };
  }

  if (typeof data === "object") {
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        const res = scanForLeaks(data[i], `${path}[${i}]`);
        if (res.leaked) return res;
      }
    } else {
      for (const [key, value] of Object.entries(data)) {
        const lowerKey = key.toLowerCase();
        if (
          lowerKey.includes("password") ||
          lowerKey === "passwordhash" ||
          lowerKey === "password_hash" ||
          lowerKey === "secret" ||
          lowerKey === "privatekey"
        ) {
          return { leaked: true, leakPath: `${path}.${key}`, value };
        }
        const res = scanForLeaks(value, `${path}.${key}`);
        if (res.leaked) return res;
      }
    }
  }

  return { leaked: false };
}

async function loginUser(email: string, pass: string): Promise<{ token: string; cookie: string; body: any }> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: pass }),
  });
  const body = await res.json();
  const setCookie = res.headers.get("set-cookie") || "";
  const match = setCookie.match(/aurenis_session=([^;]+)/);
  const token = match ? match[1] : "";
  const cookie = token ? `aurenis_session=${token}` : "";
  return { token, cookie, body };
}

async function runDataLeakAudit() {
  console.log("================================================================================");
  console.log("🔍 AURENIS AUDITORÍA DE SEGURIDAD — FUGA DE HASHES, SECRETOS Y PII");
  console.log("================================================================================");

  // ============================================================================
  // CRITERIO 1: Hash de contraseña ausente en respuestas JSON
  // ============================================================================
  console.log("\n--- [CRITERIO 1] Verificación de Respuestas JSON (Sin Hashes ni Contraseñas) ---");

  // 1.1 Login SuperAdmin
  try {
    const admin = await loginUser("admin@aurenis.com", "AurenisSuperAdmin2026!");
    const leakCheck = scanForLeaks(admin.body);
    report(
      "JSON-01",
      "Respuesta de Login SuperAdmin no expone passwordHash ni secrets",
      !leakCheck.leaked,
      leakCheck.leaked
        ? `Fuga detectada en ${leakCheck.leakPath}: ${leakCheck.value}`
        : "Payload de login libre de hashes, contraseñas y secretos."
    );
  } catch (e) {
    report("JSON-01", "Login SuperAdmin", false, `Error de conexión: ${(e as Error).message}`);
  }

  // 1.2 Login Director de Colegio
  try {
    const director = await loginUser("director@sanjose.cl", "AdminCSJ2026!");
    const leakCheck = scanForLeaks(director.body);
    report(
      "JSON-02",
      "Respuesta de Login Director no expone passwordHash",
      !leakCheck.leaked,
      leakCheck.leaked
        ? `Fuga detectada en ${leakCheck.leakPath}: ${leakCheck.value}`
        : "Payload institucional sanitizado correctamente."
    );
  } catch (e) {
    report("JSON-02", "Login Director", false, `Error: ${(e as Error).message}`);
  }

  // 1.3 Login Profesor
  try {
    const teacher = await loginUser("profesor@sanjose.cl", "Profesor2026!");
    const leakCheck = scanForLeaks(teacher.body);
    report(
      "JSON-03",
      "Respuesta de Login Profesor libre de passwordHash",
      !leakCheck.leaked,
      leakCheck.leaked
        ? `Fuga detectada en ${leakCheck.leakPath}`
        : "Payload de profesor completamente sanitizado."
    );
  } catch (e) {
    report("JSON-03", "Login Profesor", false, `Error: ${(e as Error).message}`);
  }

  // 1.4 API System Schools (SuperAdmin)
  try {
    const admin = await loginUser("admin@aurenis.com", "AurenisSuperAdmin2026!");
    const res = await fetch(`${BASE_URL}/api/system/schools`, {
      headers: {
        Authorization: `Bearer ${admin.token}`,
        Cookie: admin.cookie,
      },
    });
    const data = await res.json();
    const leakCheck = scanForLeaks(data);
    report(
      "JSON-04",
      "Endpoint /api/system/schools no filtra contraseñas de administradores",
      !leakCheck.leaked && res.status === 200,
      `Status: ${res.status}. ${leakCheck.leaked ? `Fuga detectada en ${leakCheck.leakPath}: ${JSON.stringify(leakCheck.value)}` : "Listado de colegios y administradores sin campos de contraseña."}`
    );
  } catch (e) {
    report("JSON-04", "Listado de colegios", false, `Error: ${(e as Error).message}`);
  }

  // 1.5 formatSuccessResponse / stripSensitiveFields en runtime
  {
    const mockRawUser = {
      id: "usr_123",
      email: "test@colegio.cl",
      passwordHash: "$2b$10$e7K9a5WjB4Zq9mNxu5vO6uN7Gq8H1kL2mP3oQ4rS5tU6vW7xY8z0a",
      password: "RawPassword123!",
      secret: "SUPER_SECRET_KEY",
      activeSchool: {
        id: "sch_1",
        name: "Colegio Test",
      },
    };

    const formatted = formatSuccessResponse(mockRawUser);
    const leakCheck = scanForLeaks(formatted);

    report(
      "JSON-05",
      "Módulo de respuesta formatSuccessResponse purga automáticamente passwordHash y secretos",
      !leakCheck.leaked && !(formatted.data as any).passwordHash && !(formatted.data as any).password,
      leakCheck.leaked
        ? `Fuga detectada: ${leakCheck.leakPath}`
        : "stripSensitiveFields eliminó passwordHash, password y secret del payload JSON."
    );
  }

  // 1.6 formatErrorResponse sanitiza details
  {
    const errorDetails = {
      attemptedPassword: "SecretPassword123!",
      dbHash: "$2b$10$e7K9a5WjB4Zq9mNxu5vO6uN7Gq8H1kL2mP3oQ4rS5tU6vW7xY8z0a",
      message: "Validation failure",
    };

    const errFormatted = formatErrorResponse("Error de autenticación", "AUTH_FAILED", {
      details: errorDetails,
    });
    const leakCheck = scanForLeaks(errFormatted);

    report(
      "JSON-06",
      "formatErrorResponse sanitiza detalles de error ante excepciones",
      !leakCheck.leaked && !(errFormatted.details as any)?.attemptedPassword,
      leakCheck.leaked
        ? `Fuga en detalles de error: ${leakCheck.leakPath}`
        : "Los detalles de error no contienen campos de contraseña o hash."
    );
  }

  // ============================================================================
  // CRITERIO 2: Logs del servidor limpios de datos sensibles y PII
  // ============================================================================
  console.log("\n--- [CRITERIO 2] Verificación de Logs del Servidor (Redacción y PII) ---");

  // 2.1 Enmascaramiento de Tokens JWT en Strings de Log
  {
    const rawLog = "Error procesando solicitud con token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c para usuario carlos";
    const redacted = redactPiiInString(rawLog);
    const isClean = !redacted.includes("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9") && redacted.includes("[REDACTED_JWT]");

    report(
      "LOG-01",
      "redactPiiInString enmascara tokens JWT completos en mensajes de log",
      isClean,
      `Resultado: ${redacted.substring(0, 75)}...`
    );
  }

  // 2.2 Enmascaramiento de cabeceras Authorization: Bearer
  {
    const bearerLog = "Incoming request with header Authorization: Bearer secret_session_token_xyz123";
    const redacted = redactPiiInString(bearerLog);
    const isClean = !redacted.includes("secret_session_token_xyz123") && redacted.includes("Bearer [REDACTED_TOKEN]");

    report(
      "LOG-02",
      "redactPiiInString enmascara cabeceras Bearer token",
      isClean,
      `Resultado: ${redacted}`
    );
  }

  // 2.3 Enmascaramiento de contraseñas en URLs de conexión DB
  {
    const dbUrlLog = "Connecting to database at postgresql://aurenis_user:SuperSecretDBPass123!@localhost:5432/aurenis_db";
    const redacted = redactPiiInString(dbUrlLog);
    const isClean = !redacted.includes("SuperSecretDBPass123!") && redacted.includes("[REDACTED_PASSWORD]");

    report(
      "LOG-03",
      "redactPiiInString oculta contraseñas en URLs de base de datos",
      isClean,
      `Resultado: ${redacted}`
    );
  }

  // 2.4 safeLogger con objetos que contienen contraseñas o claves
  {
    let capturedLog = "";
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      capturedLog = args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" ");
    };

    safeLogger.error("Failed login attempt", {
      email: "user@school.cl",
      password: "MyPlainSecretPassword!",
      passwordHash: "$2b$10$e7K9a5WjB4Zq9mNxu5vO6uN7Gq8H1kL2mP3oQ4rS5tU6vW7xY8z0a",
      rut: "18.123.456-7",
    });

    console.error = originalConsoleError;

    const noPlainPassword = !capturedLog.includes("MyPlainSecretPassword!");
    const noHash = !capturedLog.includes("$2b$10$e7K9a5WjB4Zq9mNxu5vO6uN7Gq8H1kL2mP3oQ4rS5tU6vW7xY8z0a");
    const isRedacted = capturedLog.includes("[REDACTED]");

    report(
      "LOG-04",
      "safeLogger enmascara objetos con campos sensibles antes de imprimir en consola",
      noPlainPassword && noHash && isRedacted,
      `Log capturado: ${capturedLog}`
    );
  }

  // ============================================================================
  // CRITERIO 3: Bundle Frontend y Archivos Cliente sin API Keys Privadas
  // ============================================================================
  console.log("\n--- [CRITERIO 3] Verificación de Bundle Frontend y Variables de Entorno ---");

  // 3.1 Análisis de variables de entorno públicas en .env.example
  {
    const envExamplePath = path.resolve(process.cwd(), ".env.example");
    const envContent = fs.readFileSync(envExamplePath, "utf-8");
    const envLines = envContent.split("\n");

    const publicVars = envLines.filter(l => l.startsWith("NEXT_PUBLIC_"));
    let illegalPublicSecret = false;
    let illegalVarName = "";

    for (const pv of publicVars) {
      const varName = pv.split("=")[0].toUpperCase();
      if (
        varName.includes("SECRET") ||
        varName.includes("KEY") ||
        varName.includes("TOKEN") ||
        varName.includes("PRIVATE") ||
        varName.includes("DATABASE")
      ) {
        illegalPublicSecret = true;
        illegalVarName = varName;
        break;
      }
    }

    report(
      "BUNDLE-01",
      "Variables NEXT_PUBLIC_ en .env.example no contienen secretos ni credenciales privadas",
      !illegalPublicSecret,
      illegalPublicSecret
        ? `Variable pública sospechosa: ${illegalVarName}`
        : `Variables públicas verificadas seguras (${publicVars.map(v => v.split("=")[0]).join(", ")})`
    );
  }

  // 3.2 Análisis estático del código frontend (components/ y app/) buscando secretos hardcodeados
  {
    const directoriesToScan = ["app", "components"];
    let hardcodedSecretFound = false;
    let culpritFile = "";
    let secretPattern = "";

    const forbiddenPatterns = [
      /-----BEGIN (?:RSA )?PRIVATE KEY-----/,
      /AKIA[0-9A-Z]{16}/, // AWS Access Key
      /sk_live_[0-9a-zA-Z]{24}/, // Stripe live key
      /sk-[a-zA-Z0-9]{32,}/, // OpenAI/service private keys
    ];

    function scanDir(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (entry.isFile() && /\.(tsx|ts|jsx|js)$/.test(entry.name)) {
          const content = fs.readFileSync(fullPath, "utf-8");
          for (const pattern of forbiddenPatterns) {
            if (pattern.test(content)) {
              hardcodedSecretFound = true;
              culpritFile = fullPath;
              secretPattern = pattern.toString();
              return;
            }
          }
        }
      }
    }

    for (const d of directoriesToScan) {
      const resolved = path.resolve(process.cwd(), d);
      if (fs.existsSync(resolved)) {
        scanDir(resolved);
      }
    }

    report(
      "BUNDLE-02",
      "Análisis estático de componentes frontend sin API keys privadas ni certificados hardcodeados",
      !hardcodedSecretFound,
      hardcodedSecretFound
        ? `Secreto detectado en ${culpritFile} (Patrón: ${secretPattern})`
        : "Todos los componentes de React y páginas App Router verificados limpios de credenciales."
    );
  }

  // 3.3 Verificación de que JWT_SECRET y DATABASE_URL no tienen prefijo NEXT_PUBLIC_
  {
    const envExamplePath = path.resolve(process.cwd(), ".env.example");
    const envContent = fs.readFileSync(envExamplePath, "utf-8");

    const hasPublicJwt = envContent.includes("NEXT_PUBLIC_JWT_SECRET") || envContent.includes("NEXT_PUBLIC_DATABASE_URL");
    const hasPrivateJwt = envContent.includes("JWT_SECRET=") && envContent.includes("DATABASE_URL=");

    report(
      "BUNDLE-03",
      "JWT_SECRET y DATABASE_URL son variables exclusivas de servidor (sin prefijo NEXT_PUBLIC_)",
      !hasPublicJwt && hasPrivateJwt,
      !hasPublicJwt
        ? "Configuración estricta: Los secretos críticos solo se cargan en el entorno seguro del servidor."
        : "ALERTA: Se encontraron variables críticas con prefijo NEXT_PUBLIC_"
    );
  }

  console.log("\n================================================================================");
  console.log(`📊 Total vectores probados: ${totalTests} | Aprobadas: ${passedCount} | Fallidas: ${failedCount} (${((passedCount / totalTests) * 100).toFixed(1)}% Conforme)`);
  console.log("================================================================================");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runDataLeakAudit().catch((err) => {
  console.error("Error fatal ejecutando auditoría de datos:", err);
  process.exit(1);
});
