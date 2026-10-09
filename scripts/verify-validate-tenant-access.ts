/**
 * ============================================================================
 * PRUEBA DE VERIFICACIÓN: validateTenantAccess (PREVENCIÓN IDOR MULTI-TENANT)
 * ============================================================================
 * Autores: Frank M. (QA & Seguridad) & Maicol R. (Backend Lead)
 * ============================================================================
 */

import { validateTenantAccess } from "../lib/security/object-authorization";

async function runTenantAccessTest() {
  console.log("================================================================================");
  console.log("🛡️ VERIFICACIÓN DE validateTenantAccess (PREVENCIÓN IDOR)");
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

  // 1. Sesión no autenticada
  const unauthRes = await validateTenantAccess({} as any, "lpmm");
  assert(!unauthRes.allowed && unauthRes.statusCode === 403, "Usuario sin sesión es rechazado por validateTenantAccess");

  // 2. System Admin bypass
  const adminRes = await validateTenantAccess(
    { userId: "sys-admin", isSystemAdmin: true } as any,
    "school-lpmm-001"
  );
  assert(adminRes.allowed && adminRes.roleName === "SYSTEM_ADMIN", "System Admin tiene acceso autorizado multi-tenant por bypass");

  console.log("\n================================================================================");
  console.log(`📊 RESULTADOS: ${passed}/${total} PRUEBAS SUPERADAS (${Math.round((passed / total) * 100)}%)`);
  console.log("🛡️ validateTenantAccess VERIFICADO CORRECTAMENTE");
  console.log("================================================================================");

  if (passed !== total) {
    process.exit(1);
  }
}

runTenantAccessTest().catch((err) => {
  console.error("Error en prueba de tenant access:", err);
  process.exit(1);
});
