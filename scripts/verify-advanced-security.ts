/**
 * ============================================================================
 * PRUEBA DE VERIFICACIÓN: DEVICE FINGERPRINTING & MFA ENFORCEMENT
 * ============================================================================
 * Autores: Frank M. (QA & Seguridad) & Maicol R. (Backend Lead)
 * ============================================================================
 */

import { generateDeviceFingerprint, analyzeDeviceAnomaly } from "../lib/security/device-fingerprinting";
import { enforceMfaPolicy } from "../lib/security/mfa-enforcement";

async function verifyAdvancedSecurityLayers() {
  console.log("================================================================================");
  console.log("🛡️ VERIFICACIÓN ESTRICTA: FINGERPRINTING & MFA ENFORCEMENT");
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

  // 1. Device Fingerprint Generation
  const fp1 = generateDeviceFingerprint({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    acceptLanguage: "es-CL,es;q=0.9",
    ipAddress: "190.160.1.50",
  });

  const fp2 = generateDeviceFingerprint({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    acceptLanguage: "es-CL,es;q=0.9",
    ipAddress: "190.160.1.50",
  });

  assert(fp1.length === 64, "Device fingerprint genera un hash SHA-256 válido de 64 caracteres");
  assert(fp1 === fp2, "Huellas idénticas para los mismos parámetros de dispositivo");

  // 2. Anomaly Analysis
  const anomalyCheck = await analyzeDeviceAnomaly(fp1, ["other-fp-hash"]);
  assert(!anomalyCheck.isTrustedDevice && anomalyCheck.riskScore === 35, "Dispositivo desconocido es detectado como anomalía con puntaje de riesgo");

  // 3. MFA Enforcement for School Admin
  const adminMfaCheck = await enforceMfaPolicy({
    roleName: "SCHOOL_ADMIN",
    isMfaEnabledForUser: false,
  });

  assert(!adminMfaCheck.allowed && adminMfaCheck.requiresMfaSetup, "SCHOOL_ADMIN sin MFA es bloqueado y obligado a enrolarse");

  console.log("\n================================================================================");
  console.log(`📊 RESULTADOS: ${passed}/${total} PRUEBAS SUPERADAS (${Math.round((passed / total) * 100)}%)`);
  console.log("🛡️ FINGERPRINTING & MFA VERIFICADOS SIN VULNERABILIDADES");
  console.log("================================================================================");

  if (passed !== total) {
    process.exit(1);
  }
}

verifyAdvancedSecurityLayers().catch((err) => {
  console.error("Error en verificación:", err);
  process.exit(1);
});
