/**
 * ============================================================================
 * PRUEBA DE VERIFICACIÓN: DETECCIÓN Y BLOQUEO DE TAUTOLOGÍAS E INYECCIÓN SQL
 * ============================================================================
 * Autores: Frank M. (QA & Seguridad) & Maicol R. (Backend Lead)
 * ============================================================================
 */

import { isAnomalousPayload } from "../lib/security/sanitization";

async function verifySqliTautologies() {
  console.log("================================================================================");
  console.log("🛡️ VERIFICACIÓN ESTRICTA: BLOQUEO DE TAUTOLOGÍAS (' OR '1'='1') E INYECCIÓN SQL");
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

  // Tautologías comunes de inyección SQL
  const tautology1 = "admin' OR '1'='1";
  const tautology2 = "' OR 1=1 --";
  const tautology3 = "' OR 'a'='a";
  const unionAttack = "1 UNION SELECT * FROM users";
  const dropAttack = "'; DROP TABLE students; --";

  assert(isAnomalousPayload(tautology1), "Tautología 'admin' OR '1'='1' es detectada y bloqueada");
  assert(isAnomalousPayload(tautology2), "Tautología '' OR 1=1 --' es detectada y bloqueada");
  assert(isAnomalousPayload(tautology3), "Tautología '' OR 'a'='a' es detectada y bloqueada");
  assert(isAnomalousPayload(unionAttack), "Ataque UNION SELECT es detectado y bloqueado");
  assert(isAnomalousPayload(dropAttack), "Intento de comando destructivo '; DROP TABLE' es bloqueado");

  // Input legítimo
  const legitimateInput = "director@lpmm.cl";
  assert(!isAnomalousPayload(legitimateInput), "Correo electrónico legítimo 'director@lpmm.cl' es permitido");

  console.log("\n================================================================================");
  console.log(`📊 RESULTADOS: ${passed}/${total} PRUEBAS SUPERADAS (${Math.round((passed / total) * 100)}%)`);
  console.log("🛡️ DETECCIÓN DE TAUTOLOGÍAS E INYECCIÓN SQL VERIFICADA CORRECTAMENTE");
  console.log("================================================================================");

  if (passed !== total) {
    process.exit(1);
  }
}

verifySqliTautologies().catch((err) => {
  console.error("Error en verificación:", err);
  process.exit(1);
});
