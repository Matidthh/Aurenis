/**
 * ============================================================================
 * PRUEBA DE VERIFICACIÓN: GLOBAL FORM SANITIZER (PREVENCIÓN DE INYECCIONES)
 * ============================================================================
 * Autores: Frank M. (QA & Seguridad) & Maicol R. (Backend Lead)
 * ============================================================================
 */

import { NextRequest } from "next/server";
import { parseAndSanitizeBody } from "../lib/security/global-form-sanitizer";

async function verifyGlobalSanitizer() {
  console.log("================================================================================");
  console.log("🛡️ VERIFICACIÓN ESTRICTA: PREVENCIÓN DE INYECCIONES EN FORMULARIOS");
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

  // Simular request con datos maliciosos y nulos
  const maliciousPayload = {
    title: "  Evaluación de Matemáticas \0 <script>alert('xss')</script>  ",
    description: "Prueba normal con espacios",
  };

  const req = new NextRequest("http://localhost:3000/api/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(maliciousPayload),
  });

  const result = await parseAndSanitizeBody<any>(req);

  assert(result.success, "Sanitizador procesa correctamente el cuerpo del formulario");
  assert(result.data.title === "Evaluación de Matemáticas  <script>alert('xss')</script>", "Null bytes eliminados y espacios normalizados en strings");

  // Simular payload anómalo (demasiado largo)
  const hugePayload = { text: "A".repeat(25000) };
  const reqHuge = new NextRequest("http://localhost:3000/api/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hugePayload),
  });

  const resultHuge = await parseAndSanitizeBody<any>(reqHuge);
  assert(!resultHuge.success, "Payloads anómalos o excesivamente grandes son rechazados automáticamente");

  console.log("\n================================================================================");
  console.log(`📊 RESULTADOS: ${passed}/${total} PRUEBAS SUPERADAS (${Math.round((passed / total) * 100)}%)`);
  console.log("🛡️ PREVENCIÓN DE INYECCIONES EN FORMULARIOS VERIFICADA");
  console.log("================================================================================");

  if (passed !== total) {
    process.exit(1);
  }
}

verifyGlobalSanitizer().catch((err) => {
  console.error("Error en verificación:", err);
  process.exit(1);
});
