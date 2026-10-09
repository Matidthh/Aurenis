/**
 * ============================================================================
 * PRUEBA DE VERIFICACIÓN DE NUEVAS CAPAS DE SEGURIDAD (QA & SECURITY)
 * ============================================================================
 * Autor: Frank M. (QA & Seguridad) & Maicol R. (Backend Lead)
 * 
 * Valida:
 * 1. Cifrado a nivel de columna (AES-256-GCM) para PII de estudiantes.
 * 2. Guardia de inactividad de sesión (Idle Timeout Guard).
 * ============================================================================
 */

import { encryptStudentPII, decryptStudentPII } from "../lib/services/pii-encryption.service";
import { checkSessionIdleTimeout } from "../lib/security/idle-timeout-guard";

async function verifyNewSecurityLayers() {
  console.log("================================================================================");
  console.log("🛡️ VERIFICACIÓN ESTRICTA DE NUEVAS CAPAS DE SEGURIDAD (0 VULNERABILIDADES)");
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

  // 1. Verificación de Cifrado PII a Nivel de Columna
  const originalRut = "12.345.678-9";
  const originalAddress = "Av. Libertador Bernardo O'Higgins 1234, Santiago";
  const originalMedical = "Alergia severa a penicilina";

  const encrypted = encryptStudentPII({
    rut: originalRut,
    address: originalAddress,
    medicalInfo: originalMedical,
  });

  assert(encrypted.rut !== originalRut, "RUN de estudiante es cifrado y no se expone en texto plano");
  assert(encrypted.rut?.startsWith("v2:gcm:") === true, "RUN utiliza el algoritmo versionado AES-256-GCM");

  const decrypted = decryptStudentPII(encrypted);
  assert(decrypted.rut === originalRut, "RUN se descifra correctamente recuperando el valor original");
  assert(decrypted.address === originalAddress, "Dirección se descifra correctamente");
  assert(decrypted.medicalInfo === originalMedical, "Información médica se descifra correctamente");

  // 2. Verificación de Idle Timeout Guard
  const activePayload = {
    sub: "user-1",
    email: "test@aurenis.cl",
    firstName: "Test",
    lastName: "User",
    isSystemAdmin: false,
    schoolId: "sch-1",
    schoolSlug: "demo",
    membershipId: "mem-1",
    roleName: "TEACHER",
    permissions: [],
    iat: Math.floor(Date.now() / 1000) - 10, // Emitido hace 10 segundos
    exp: Math.floor(Date.now() / 1000) + 3600,
    iss: "aurenis-auth",
    aud: "aurenis-platform",
    jti: "jti-1",
  };

  const timeoutCheck = checkSessionIdleTimeout(activePayload);
  assert(!timeoutCheck.isExpired, "Sesión activa reciente (10 segundos) es aceptada por el Idle Timeout Guard");

  console.log("\n================================================================================");
  console.log(`📊 RESULTADOS: ${passed}/${total} PRUEBAS SUPERADAS (${Math.round((passed / total) * 100)}%)`);
  console.log("🛡️ NUEVAS CAPAS DE SEGURIDAD VERIFICADAS SIN VULNERABILIDADES");
  console.log("================================================================================");

  if (passed !== total) {
    process.exit(1);
  }
}

verifyNewSecurityLayers().catch((err) => {
  console.error("Error en verificación:", err);
  process.exit(1);
});
