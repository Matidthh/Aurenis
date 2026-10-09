/**
 * ============================================================================
 * PRUEBA DE VERIFICACIÓN: UPSTASH RATELIMIT (ENFORCE AUTH RATE LIMIT)
 * ============================================================================
 * Autores: Frank M. (QA & Seguridad) & Maicol R. (Backend)
 * ============================================================================
 */

import { NextRequest } from "next/server";
import { enforceAuthRateLimit } from "../lib/security/upstash-ratelimit";

async function verifyUpstashRatelimit() {
  console.log("================================================================================");
  console.log("🛡️ VERIFICACIÓN DE UPSTASH RATELIMIT EN RUTAS /api/auth/*");
  console.log("================================================================================\n");

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, desc: string) {
    total++;
    if (condition) {
      passed++;
      console.log(`  ✅ [PASS] ${desc}`);
    } else {
      console.error(`  ❌ [FAIL] ${desc}`);
    }
  }

  // Simular múltiples peticiones desde la misma IP para disparar el rate limit (>5 intentos)
  const req = new NextRequest("http://localhost:3000/api/auth/login", {
    headers: {
      "x-forwarded-for": "203.0.113.195",
    },
  });

  let lastResponse: any = null;
  for (let i = 1; i <= 7; i++) {
    lastResponse = await enforceAuthRateLimit(req);
  }

  assert(lastResponse !== null && lastResponse.status === 429, "Rate limiter bloquea peticiones masivas tras exceder el límite con HTTP 429");

  console.log("\n================================================================================");
  console.log(`📊 RESULTADOS: ${passed}/${total} PRUEBAS SUPERADAS (${Math.round((passed / total) * 100)}%)`);
  console.log("🛡️ UPSTASH RATELIMIT VERIFICADO CORRECTAMENTE");
  console.log("================================================================================");

  if (passed !== total) {
    process.exit(1);
  }
}

verifyUpstashRatelimit().catch((err) => {
  console.error("Error en prueba de upstash ratelimit:", err);
  process.exit(1);
});
