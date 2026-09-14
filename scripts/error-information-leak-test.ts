/**
 * Aurenis Information Leakage & Error Handling Audit Test Suite
 * 
 * Verifica los 3 Criterios de Aceptación:
 * 1. Stack traces ocultos en entorno de producción
 * 2. Mensajes de error genéricos y amigables al cliente
 * 3. Cabeceras Server limpias de versiones (sin X-Powered-By ni revelación de tecnologías)
 */

import { formatErrorResponse, apiError, sanitizeErrorMessage, sanitizeErrorDetails } from "../lib/api/response";
import { applySecurityHeaders, SECURITY_HEADERS, FORBIDDEN_VERSION_HEADERS } from "../lib/security/headers";
import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

let totalTests = 0;
let passedCount = 0;
let failedCount = 0;

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

async function runInformationLeakAudit() {
  console.log("================================================================================");
  console.log("🛡️  AURENIS — AUDITORÍA DE PROTECCIÓN CONTRA FUGA DE INFORMACIÓN EN ERRORES");
  console.log("================================================================================\n");

  // ============================================================================
  // CRITERIO 1: Stack traces ocultos en entorno de producción
  // ============================================================================
  console.log("--- [CRITERIO 1] Stack traces ocultos en entorno de producción ---");

  // 1.1: sanitizeErrorDetails elimina 'stack' y 'stackTrace' en simulación de producción
  {
    const originalEnv = process.env.NODE_ENV;
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";

    const errorWithStack = new Error("Database connection timeout at 127.0.0.1:5432");
    errorWithStack.stack = "Error: Database connection timeout\n    at Pool.connect (/app/node_modules/pg/lib/pool.js:12:5)\n    at Query.run (/app/lib/db/prisma.ts:45:10)";

    const sanitizedObj = sanitizeErrorDetails(errorWithStack);
    const hasStack = Boolean(sanitizedObj.stack || (typeof sanitizedObj === "string" && sanitizedObj.includes("at Pool.connect")));

    report(
      "STACK-01",
      "sanitizeErrorDetails elimina completamente stack traces de instancias de Error en producción",
      !hasStack && sanitizedObj.name === "ApplicationError",
      `Resultado: ${JSON.stringify(sanitizedObj)}`
    );

    (process.env as Record<string, string | undefined>).NODE_ENV = originalEnv;
  }

  // 1.2: formatErrorResponse purga stack traces en objetos de detalles
  {
    const originalEnv = process.env.NODE_ENV;
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";

    const errorDetails = {
      module: "auth_service",
      stack: "TypeError: Cannot read properties of undefined (reading 'id')\n    at authenticate (/app/lib/auth/session.ts:55:12)",
      trace: ["line 1", "line 2"],
      fileName: "/app/lib/auth/session.ts",
      safeHint: "Credenciales incorrectas",
    };

    const response = formatErrorResponse("Error interno", "INTERNAL_ERROR", {
      details: errorDetails,
    });

    const details = response.details;
    const hasStackOrTrace = Boolean(details?.stack || details?.trace || details?.fileName);

    report(
      "STACK-02",
      "formatErrorResponse purga propiedades 'stack', 'trace' y rutas de archivos en producción",
      !hasStackOrTrace && details?.safeHint === "Credenciales incorrectas",
      `Detalles filtrados: ${JSON.stringify(details)}`
    );

    (process.env as Record<string, string | undefined>).NODE_ENV = originalEnv;
  }

  // 1.3: Verificación de app/global-error.tsx para asegurar protección de stack traces
  {
    const globalErrorPath = path.resolve(process.cwd(), "app/global-error.tsx");
    const content = fs.readFileSync(globalErrorPath, "utf-8");

    const checksDevForStack = content.includes("isDev && error.stack") || content.includes("process.env.NODE_ENV === 'development'");
    const genericMessageInProd = content.includes("Se produjo un problema inesperado");

    report(
      "STACK-03",
      "app/global-error.tsx condiciona la visualización de stack trace exclusivamente al modo desarrollo",
      checksDevForStack && genericMessageInProd,
      "El componente de error global no expone trazas de pila ni información técnica a usuarios en producción."
    );
  }

  // ============================================================================
  // CRITERIO 2: Mensajes de error genéricos y amigables al cliente
  // ============================================================================
  console.log("\n--- [CRITERIO 2] Mensajes de error genéricos y amigables al cliente ---");

  // 2.1: Detección y neutralización de excepciones Prisma / SQL
  {
    const rawDbError = "PrismaClientKnownRequestError: Can't reach database server at `localhost:5432`";
    const sanitized = sanitizeErrorMessage(rawDbError, "DATABASE_ERROR");

    report(
      "MSG-01",
      "sanitizeErrorMessage neutraliza errores de Prisma/SQL transformándolos en mensaje amigable",
      sanitized === "Ha ocurrido un error interno en el servidor. Por favor, intente nuevamente más tarde." && !sanitized.includes("PrismaClient"),
      `Mensaje sanitizado: "${sanitized}"`
    );
  }

  // 2.2: Detección y neutralización de TypeErrors / Stack traces en texto
  {
    const rawJsError = "TypeError: Cannot read property 'map' of undefined\n    at renderList (/app/components/student-list-view.tsx:88:15)";
    const sanitized = sanitizeErrorMessage(rawJsError, "INTERNAL_ERROR");

    report(
      "MSG-02",
      "sanitizeErrorMessage reemplaza trazas de JavaScript por mensajes comprensibles sin fugas",
      !sanitized.includes("TypeError") && !sanitized.includes("/app/") && sanitized.includes("error interno"),
      `Mensaje obtenido: "${sanitized}"`
    );
  }

  // 2.3: Preservación de mensajes amigables y válidos de validación/negocio
  {
    const friendlyMessage = "El correo electrónico institucional ingresado no es válido.";
    const sanitized = sanitizeErrorMessage(friendlyMessage, "VALIDATION_ERROR");

    report(
      "MSG-03",
      "sanitizeErrorMessage conserva intactos los mensajes de validación y retroalimentación seguros",
      sanitized === friendlyMessage,
      `Mensaje preservado: "${sanitized}"`
    );
  }

  // 2.4: Endpoint /api/auth/login devuelve mensajes estructurados sin detalles técnicos
  {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "nonexistent@school.cl", password: "WrongPassword123!" }),
      });
      const data = await res.json();

      const isClean = !JSON.stringify(data).includes("TypeError") &&
        !JSON.stringify(data).includes("stack") &&
        !JSON.stringify(data).includes("/app/") &&
        typeof data.error === "string";

      report(
        "MSG-04",
        "Respuesta HTTP en /api/auth/login retorna error genérico y estructura limpia ante credenciales inválidas",
        (res.status === 401 || res.status === 400) && isClean,
        `Status: ${res.status}, Error recibido: "${data.error}"`
      );
    } catch (e) {
      report("MSG-04", "Endpoint Login Error", false, `Error de conexión: ${(e as Error).message}`);
    }
  }

  // ============================================================================
  // CRITERIO 3: Cabeceras Server limpias de versiones
  // ============================================================================
  console.log("\n--- [CRITERIO 3] Cabeceras Server limpias de versiones ---");

  // 3.1: Verificación de poweredByHeader: false en next.config.ts
  {
    const nextConfigPath = path.resolve(process.cwd(), "next.config.ts");
    const nextConfigContent = fs.readFileSync(nextConfigPath, "utf-8");

    const hasPoweredByFalse = nextConfigContent.includes("poweredByHeader: false");

    report(
      "HEADER-01",
      "next.config.ts tiene 'poweredByHeader: false' para suprimir X-Powered-By: Next.js",
      hasPoweredByFalse,
      "Directiva Next.js configurada correctamente para evitar revelar el framework."
    );
  }

  // 3.2: Cabecera 'Server' genérica en SECURITY_HEADERS
  {
    const serverHeader = SECURITY_HEADERS["Server"];
    const isCleanServer = Boolean(serverHeader && !serverHeader.match(/[0-9]+\.[0-9]+/)); // Sin números de versión

    report(
      "HEADER-02",
      "Cabecera 'Server' está fijada con un identificador genérico sin números de versión",
      isCleanServer && serverHeader === "Aurenis-Gateway",
      `Valor de Server: "${serverHeader}"`
    );
  }

  // 3.3: applySecurityHeaders elimina cabeceras prohibidas de versiones
  {
    const mockRes = NextResponse.json({ test: true });
    mockRes.headers.set("x-powered-by", "Next.js 15.0.0");
    mockRes.headers.set("server-version", "1.0.4-alpine");
    mockRes.headers.set("x-runtime", "nodejs-20.10");

    applySecurityHeaders(mockRes);

    const hasPoweredBy = mockRes.headers.has("x-powered-by");
    const hasServerVersion = mockRes.headers.has("server-version");
    const hasRuntime = mockRes.headers.has("x-runtime");
    const serverVal = mockRes.headers.get("server");

    report(
      "HEADER-03",
      "applySecurityHeaders elimina cabeceras de versión (x-powered-by, server-version, x-runtime)",
      !hasPoweredBy && !hasServerVersion && !hasRuntime && serverVal === "Aurenis-Gateway",
      `Cabeceras eliminadas con éxito. Server: "${serverVal}"`
    );
  }

  // 3.4: Petición HTTP en vivo no expone X-Powered-By ni versiones en headers
  {
    try {
      const res = await fetch(`${BASE_URL}/login`);
      const xPoweredBy = res.headers.get("x-powered-by");
      const server = res.headers.get("server");

      const noVersionInServer = !server || !server.match(/[0-9]+\.[0-9]+/);
      const noPoweredBy = !xPoweredBy;

      report(
        "HEADER-04",
        "Petición HTTP en vivo no contiene X-Powered-By ni versiones de software",
        noPoweredBy && noVersionInServer,
        `X-Powered-By: ${xPoweredBy || "(ausente)"}, Server: ${server || "Aurenis-Gateway"}`
      );
    } catch (e) {
      report("HEADER-04", "Headers en vivo", false, `Error: ${(e as Error).message}`);
    }
  }

  // ============================================================================
  // RESUMEN GENERAL
  // ============================================================================
  console.log("\n================================================================================");
  console.log(`📊 TOTAL PRUEBAS: ${totalTests} | APROBADAS: ${passedCount} | FALLIDAS: ${failedCount} (${((passedCount / totalTests) * 100).toFixed(1)}% Conforme)`);
  console.log("================================================================================");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runInformationLeakAudit().catch((err) => {
  console.error("Error fatal ejecutando auditoría:", err);
  process.exit(1);
});
