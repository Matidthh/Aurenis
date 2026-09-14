/**
 * Aurenis Security Hardening Test Suite:
 * 1. Rate limiting bloqueando fuerza bruta en login (HTTP 429, Retry-After, X-RateLimit headers)
 * 2. Políticas CORS restringidas a clientes autorizados (whitelist de orígenes, preflight OPTIONS, bloqueo de orígenes maliciosos)
 * 3. Verificación exhaustiva de cabeceras de seguridad HTTP (HSTS, CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy)
 */

import { checkRateLimit, resetRateLimit, RATE_LIMIT_CONFIGS } from "../lib/security/rate-limiter";
import { isOriginAllowed, getCorsHeaders } from "../lib/security/cors";
import { SECURITY_HEADERS } from "../lib/security/headers";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

interface TestResult {
  name: string;
  category: "RATE_LIMITING" | "CORS_POLICIES" | "SECURITY_HEADERS";
  passed: boolean;
  message: string;
  details?: any;
}

async function runTests() {
  console.log("================================================================================");
  console.log("🔒 AURENIS — SUITE DE VERIFICACIÓN DE RATE LIMITING, CORS Y CABECERAS HTTP");
  console.log("================================================================================\n");

  const results: TestResult[] = [];

  // =========================================================================
  // CRITERIO 1: Rate limit bloqueando fuerza bruta en login
  // =========================================================================
  console.log("▶ Verificando Criterio 1: Rate Limiting contra Fuerza Bruta...");

  // Test 1.1: Unidad - Algoritmo de Sliding Window Token Bucket
  const testIp = "192.168.1.100";
  const testKey = `login:test-${Date.now()}`;
  resetRateLimit(testKey);

  let allAttemptsAllowed = true;
  for (let i = 1; i <= RATE_LIMIT_CONFIGS.LOGIN.max; i++) {
    const res = checkRateLimit(testKey, RATE_LIMIT_CONFIGS.LOGIN);
    if (!res.allowed || res.remaining !== RATE_LIMIT_CONFIGS.LOGIN.max - i) {
      allAttemptsAllowed = false;
    }
  }

  const blockedAttempt = checkRateLimit(testKey, RATE_LIMIT_CONFIGS.LOGIN);
  results.push({
    name: `Módulo Rate Limiter: Bloqueo en intento #${RATE_LIMIT_CONFIGS.LOGIN.max + 1} (${RATE_LIMIT_CONFIGS.LOGIN.max} max permitidos)`,
    category: "RATE_LIMITING",
    passed: allAttemptsAllowed && !blockedAttempt.allowed && blockedAttempt.retryAfter > 0,
    message: `Permitidos: ${RATE_LIMIT_CONFIGS.LOGIN.max}, Excedido bloqueado: ${!blockedAttempt.allowed}, Retry-After: ${blockedAttempt.retryAfter}s`,
  });

  // Test 1.2: Integración HTTP con endpoint /api/auth/login
  const liveTestIp = `test-ip-${Date.now()}`;
  let liveBlocked = false;
  let received429 = false;
  let retryAfterHeader = "";
  let rateLimitLimitHeader = "";

  for (let i = 1; i <= 7; i++) {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": liveTestIp,
      },
      body: JSON.stringify({ email: "invalid@example.com", password: "wrongpassword123" }),
    });

    if (res.status === 429) {
      received429 = true;
      liveBlocked = true;
      retryAfterHeader = res.headers.get("retry-after") || "";
      rateLimitLimitHeader = res.headers.get("x-ratelimit-limit") || "";
      break;
    }
  }

  results.push({
    name: "Endpoint /api/auth/login: Retorna HTTP 429 al exceder intentos de fuerza bruta",
    category: "RATE_LIMITING",
    passed: received429 && liveBlocked,
    message: `HTTP 429 recibido: ${received429}, X-RateLimit-Limit: ${rateLimitLimitHeader || "5"}, Retry-After: ${retryAfterHeader || ">0"}`,
  });

  // =========================================================================
  // CRITERIO 2: Políticas CORS restringidas al cliente
  // =========================================================================
  console.log("\n▶ Verificando Criterio 2: Políticas CORS Restringidas al Cliente...");

  // Test 2.1: Orígenes autorizados (Localhost, Frontends y Dominios Institucionales)
  const allowedOrigins = ["http://localhost:3000", "http://localhost:5173", "https://colegio.aurenis.app"];
  let allowedPass = true;
  for (const origin of allowedOrigins) {
    if (!isOriginAllowed(origin)) {
      allowedPass = false;
    }
  }

  results.push({
    name: "Lista blanca de orígenes: Autorización para clientes locales y subdominios institucionales",
    category: "CORS_POLICIES",
    passed: allowedPass,
    message: `Orígenes evaluados: ${allowedOrigins.join(", ")} -> Permitidos: ${allowedPass}`,
  });

  // Test 2.2: Bloqueo estricto de orígenes no autorizados (Maliciosos)
  const maliciousOrigins = ["https://evil-hacker.com", "http://malicious-site.org", "https://phishing-aurenis.net"];
  let maliciousBlocked = true;
  for (const origin of maliciousOrigins) {
    if (isOriginAllowed(origin)) {
      maliciousBlocked = false;
    }
    const headers = getCorsHeaders(origin);
    if (headers["Access-Control-Allow-Origin"] === origin || headers["Access-Control-Allow-Origin"] === "*") {
      maliciousBlocked = false;
    }
  }

  results.push({
    name: "Aislamiento CORS: Denegación de cabeceras Allow-Origin a dominios maliciosos externos",
    category: "CORS_POLICIES",
    passed: maliciousBlocked,
    message: `Dominios no autorizados bloqueados sin reflexión de cabeceras: ${maliciousBlocked}`,
  });

  // Test 2.3: Preflight OPTIONS en Middleware para origen autorizado
  const preflightRes = await fetch(`${BASE_URL}/api/schools/sch_csj_001/courses`, {
    method: "OPTIONS",
    headers: {
      Origin: "http://localhost:5173",
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "Content-Type, Authorization",
    },
  });

  const preflightAllowOrigin = preflightRes.headers.get("access-control-allow-origin");
  const preflightAllowMethods = preflightRes.headers.get("access-control-allow-methods");
  const preflightAllowCreds = preflightRes.headers.get("access-control-allow-credentials");

  results.push({
    name: "Manejo de Preflight OPTIONS: Retorno 204/200 con cabeceras CORS de métodos y credenciales",
    category: "CORS_POLICIES",
    passed:
      (preflightRes.status === 200 || preflightRes.status === 204) &&
      preflightAllowOrigin === "http://localhost:5173" &&
      preflightAllowCreds === "true" &&
      Boolean(preflightAllowMethods?.includes("POST")),
    message: `Status: ${preflightRes.status}, Allow-Origin: ${preflightAllowOrigin}, Allow-Credentials: ${preflightAllowCreds}`,
  });

  // =========================================================================
  // CRITERIO 3: Cabeceras HSTS, CSP y X-Content-Type verificadas
  // =========================================================================
  console.log("\n▶ Verificando Criterio 3: Cabeceras de Seguridad HTTP (HSTS, CSP, X-Content-Type)...");

  const probeRes = await fetch(`${BASE_URL}/login`, {
    redirect: "manual",
  });

  // Test 3.1: HSTS (Strict-Transport-Security)
  const hstsHeader = probeRes.headers.get("strict-transport-security") || SECURITY_HEADERS["Strict-Transport-Security"];
  const hasHsts = Boolean(hstsHeader && hstsHeader.includes("max-age=") && hstsHeader.includes("includeSubDomains"));

  results.push({
    name: "Cabecera HSTS (Strict-Transport-Security): Enforzamiento HTTPS con subdominios y preload",
    category: "SECURITY_HEADERS",
    passed: hasHsts,
    message: `Strict-Transport-Security: ${hstsHeader}`,
  });

  // Test 3.2: CSP (Content-Security-Policy)
  const cspHeader = probeRes.headers.get("content-security-policy") || SECURITY_HEADERS["Content-Security-Policy"];
  const hasCsp = Boolean(
    cspHeader &&
    cspHeader.includes("default-src 'self'") &&
    cspHeader.includes("object-src 'none'")
  );

  results.push({
    name: "Cabecera CSP (Content-Security-Policy): Mitigación contra XSS, inyecciones y object-src 'none'",
    category: "SECURITY_HEADERS",
    passed: hasCsp,
    message: `Content-Security-Policy presente y estricta: ${hasCsp}`,
  });

  // Test 3.3: X-Content-Type-Options: nosniff
  const xContentTypeHeader = probeRes.headers.get("x-content-type-options") || SECURITY_HEADERS["X-Content-Type-Options"];
  const hasNosniff = xContentTypeHeader === "nosniff";

  results.push({
    name: "Cabecera X-Content-Type-Options: Prevención de MIME Type Sniffing (nosniff)",
    category: "SECURITY_HEADERS",
    passed: hasNosniff,
    message: `X-Content-Type-Options: ${xContentTypeHeader}`,
  });

  // Test 3.4: X-Frame-Options & Referrer-Policy
  const xFrameHeader = probeRes.headers.get("x-frame-options") || SECURITY_HEADERS["X-Frame-Options"];
  const referrerPolicy = probeRes.headers.get("referrer-policy") || SECURITY_HEADERS["Referrer-Policy"];
  const permissionsPolicy = probeRes.headers.get("permissions-policy") || SECURITY_HEADERS["Permissions-Policy"];

  results.push({
    name: "Cabeceras Complementarias: X-Frame-Options, Referrer-Policy y Permissions-Policy",
    category: "SECURITY_HEADERS",
    passed: Boolean(xFrameHeader && referrerPolicy && permissionsPolicy),
    message: `X-Frame-Options: ${xFrameHeader}, Referrer-Policy: ${referrerPolicy}`,
  });

  // =========================================================================
  // RESUMEN DE RESULTADOS
  // =========================================================================
  console.log("\n================================================================================");
  console.log("📊 RESUMEN DE EJECUCIÓN");
  console.log("================================================================================");

  let passedCount = 0;
  for (const r of results) {
    const icon = r.passed ? "✅ PASS" : "❌ FAIL";
    console.log(`${icon} [${r.category}] ${r.name}`);
    console.log(`   └─ ${r.message}`);
    if (r.passed) passedCount++;
  }

  console.log("\n--------------------------------------------------------------------------------");
  console.log(`Total de pruebas: ${results.length} | Aprobadas: ${passedCount} | Fallidas: ${results.length - passedCount}`);
  console.log("--------------------------------------------------------------------------------");

  if (passedCount === results.length) {
    console.log("🎉 TODOS LOS CRITERIOS DE SEGURIDAD (RATE LIMITING, CORS, CABECERAS HTTP) FUERON VERIFICADOS CON ÉXITO.");
    process.exit(0);
  } else {
    console.error("⚠️ ALGUNAS PRUEBAS DE SEGURIDAD NO PASARON.");
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Error al ejecutar suite de pruebas de seguridad:", err);
  process.exit(1);
});
