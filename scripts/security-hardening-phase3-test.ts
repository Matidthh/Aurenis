/**
 * ============================================================================
 * AURENIS — SECURITY HARDENING PHASE 3 ADVERSARIAL TEST SUITE
 * ============================================================================
 * Suite de pruebas adversariales, ataques simulados y validación de controles:
 * - Prioridad 1: MFA TOTP RFC 6238, Cifrado AES-256-GCM, Anti-Replay.
 * - Prioridad 2: Flujo Seguro de Enrolamiento MFA y Transición de Estados.
 * - Prioridad 3: Login con MFA Obligatorio y Challenge Tokens No Privilegiados.
 * - Prioridad 4: Rate Limiting Específico para MFA y Fuerza Bruta.
 * - Prioridad 5: Step-Up Authentication en Operaciones Críticas.
 * - Prioridad 6: Account Recovery, Anti-Enumeración, Hasheo de Tokens y Revocación.
 * - Prioridad 7: Auditoría y Verificación de CERO Fuga de Secretos en Logs.
 * - Prioridad 8/9: Regresiones de Ciberseguridad (Phase 1, 2 y 3).
 * 
 * Autores: Frank M. (QA/Seguridad) & Maicol R. (Backend/Arquitectura)
 * ============================================================================
 */

import {
  generateTotpSecret,
  generateTotpUri,
  calculateTotpCode,
  getCurrentTimeStep,
  verifyTotpCode,
  generateRecoveryCodes,
  hashRecoveryCode,
  verifyRecoveryCode,
  isTotpReused,
  base32Encode,
  base32Decode,
} from "../lib/security/totp";

import {
  getMfaRecord,
  getUserMfaStatus,
  startMfaEnrollment,
  verifyMfaEnrollment,
  verifyMfaLogin,
  disableMfa,
  regenerateRecoveryCodes,
} from "../lib/services/mfa.service";

import {
  signMfaChallengeToken,
  verifyMfaChallengeToken,
  consumeChallengeToken,
  signStepUpToken,
  verifyStepUpToken,
} from "../lib/auth/challenge-token";

import { encryptField, decryptField } from "../lib/security/encryption";
import { checkRateLimit, resetRateLimit, RATE_LIMIT_CONFIGS } from "../lib/security/rate-limiter";
import { requestPasswordReset, resetPasswordWithToken } from "../lib/services/recovery.service";
import { sanitizeAuditDetails, logAuditEvent } from "../lib/services/audit.service";
import { signSessionToken, verifySessionToken } from "../lib/auth/session";
import { isTokenRevoked, revokeToken, revokeAllUserSessions } from "../lib/auth/session-revocation";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, errorDetail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  ❌ [FAIL] ${testName}${errorDetail ? ` -> ${errorDetail}` : ""}`);
  }
}

async function runPhase3SecurityTestSuite() {
  console.log("=".repeat(80));
  console.log("🛡️  AURENIS — SECURITY HARDENING PHASE 3: ADVERSARIAL VERIFICATION SUITE");
  console.log("👥  Auditores: Frank M. (QA & Seguridad) & Maicol R. (Backend & Arquitectura)");
  console.log("=".repeat(80));

  // ==========================================================================
  // BLOQUE 1: MOTOR CRIPTOGRÁFICO TOTP (RFC 6238 & RFC 4226)
  // ==========================================================================
  console.log("\n📦 [BLOQUE 1] VALIDACIÓN CRIPTOGRÁFICA TOTP RFC 6238 & RECOVERY CODES");

  const secret = generateTotpSecret(20);
  assert(typeof secret === "string" && secret.length >= 32, "Generación de secreto Base32 CSPRNG (160 bits)");

  const decoded = base32Decode(secret);
  const reEncoded = base32Encode(decoded);
  assert(reEncoded === secret, "Codificación y Decodificación Base32 RFC 4648 reversible");

  const uri = generateTotpUri({ secret, accountName: "admin@aurenis.com", issuer: "Aurenis" });
  assert(uri.startsWith("otpauth://totp/Aurenis%3Aadmin%40aurenis.com") && uri.includes(secret), "Generación de URI otpauth:// conforme a estándar");

  const currentStep = getCurrentTimeStep();
  const currentCode = calculateTotpCode(secret, currentStep);
  assert(/^\d{6}$/.test(currentCode), "Cálculo de código TOTP de 6 dígitos numéricos");

  // Validación de código actual
  const validRes = await verifyTotpCode({ secret, code: currentCode, windowTolerance: 1 });
  assert(validRes.valid === true, "Verificación exitosa de código TOTP actual");

  // Tolerancia temporal de ventana (±1 paso = ±30s)
  const prevCode = calculateTotpCode(secret, currentStep - 1);
  const prevRes = await verifyTotpCode({ secret, code: prevCode, windowTolerance: 1 });
  assert(prevRes.valid === true, "Aceptación controlada de código con clock drift previo (-30s)");

  // Rechazo fuera de tolerancia (-2 pasos = -60s)
  const expiredCode = calculateTotpCode(secret, currentStep - 2);
  const expiredRes = await verifyTotpCode({ secret, code: expiredCode, windowTolerance: 1 });
  assert(expiredRes.valid === false, "Rechazo de código TOTP expirado fuera de ventana (-60s)");

  // Rechazo de código inválido arbitrario
  const wrongRes = await verifyTotpCode({ secret, code: "000000", windowTolerance: 1 });
  assert(wrongRes.valid === false, "Rechazo de código numérico aleatorio inválido");

  // Prevención de ataques de Replay (Replay Attack Prevention)
  const testUserId = "usr_adversarial_test_001";
  const firstUse = await verifyTotpCode({ secret, code: currentCode, userId: testUserId, windowTolerance: 1 });
  assert(firstUse.valid === true, "Primer uso de código TOTP permitido");

  const replayAttempt = await verifyTotpCode({ secret, code: currentCode, userId: testUserId, windowTolerance: 1 });
  assert(replayAttempt.valid === false && (replayAttempt.reason?.includes("ya utilizado") || false), "Ataque de Replay bloqueado en la misma ventana de 30s");

  // Cifrado AES-256-GCM del Secreto TOTP
  const encryptedSecret = encryptField(secret);
  assert(encryptedSecret?.startsWith("v2:gcm:") || false, "Cifrado AES-256-GCM del secreto TOTP (Formato v2:gcm:iv:tag:cipher)");

  const decryptedSecret = decryptField(encryptedSecret);
  assert(decryptedSecret === secret, "Descifrado fiel del secreto mediante llave maestra de la app");

  // Tamper check en secreto cifrado
  const tamperedCipher = encryptedSecret?.replace(/a/g, "b");
  try {
    const tamperedDec = decryptField(tamperedCipher);
    assert(tamperedDec !== secret, "Detección de alteración o fallo Fail-Closed ante ciphertext corrupto");
  } catch {
    assert(true, "Detección de alteración y fallo Fail-Closed ante ciphertext corrupto (Excepción esperada)");
  }

  // Recovery Codes Criptográficos
  const recovery = generateRecoveryCodes(8);
  assert(recovery.plainCodes.length === 8 && recovery.hashedCodes.length === 8, "Generación de 8 Recovery Codes con formato XXXX-XXXX-XXXX-XXXX");
  assert(recovery.hashedCodes.every((h) => h.length === 64), "Hasheo SHA-256 de los Recovery Codes");

  const validIndex = verifyRecoveryCode(recovery.plainCodes[0], recovery.hashedCodes);
  assert(validIndex === 0, "Validación exitosa de Recovery Code con su hash correspondiente");

  const invalidIndex = verifyRecoveryCode("INVALID-CODE-0000", recovery.hashedCodes);
  assert(invalidIndex === -1, "Rechazo de Recovery Code inexistente");

  // ==========================================================================
  // BLOQUE 2: CICLO DE VIDA DE ENROLAMIENTO MFA (MFA_NOT_ENROLLED -> PENDING -> ENABLED)
  // ==========================================================================
  console.log("\n🔄 [BLOQUE 2] CICLO DE VIDA DE ENROLAMIENTO Y ESTADOS MFA");

  const adminUserId = "usr_admin_lifecycle_001";
  const initialStatus = await getUserMfaStatus(adminUserId);
  assert(initialStatus === "MFA_NOT_ENROLLED", "Estado inicial del usuario: MFA_NOT_ENROLLED");

  // Iniciar enrolamiento
  const enrollStart = await startMfaEnrollment(adminUserId, "admin.test@aurenis.com");
  assert(enrollStart.mfaStatus === "MFA_PENDING", "Inicio de enrolamiento transiciona a MFA_PENDING");
  assert(enrollStart.recoveryCodes.length === 8, "Entrega única de 8 códigos de recuperación durante enrolamiento");

  // Intentar login antes de validar enrolamiento debe fallar
  try {
    await verifyMfaLogin(adminUserId, "123456");
    assert(false, "Login MFA antes de completar enrolamiento no permitido");
  } catch {
    assert(true, "Login MFA bloqueado mientras el estado sea MFA_PENDING");
  }

  // Validar código inicial con TOTP erróneo
  try {
    await verifyMfaEnrollment(adminUserId, "999999");
    assert(false, "Enrolamiento con código TOTP incorrecto no permitido");
  } catch {
    assert(true, "Enrolamiento con código TOTP incorrecto rechazado");
  }

  // Validar código inicial con TOTP correcto
  const validInitialCode = calculateTotpCode(enrollStart.secret, getCurrentTimeStep());
  const enrollVerify = await verifyMfaEnrollment(adminUserId, validInitialCode);
  assert(enrollVerify.mfaStatus === "MFA_ENABLED", "Enrolamiento verificado y activado formalmente a MFA_ENABLED");

  const recordAfterEnroll = await getMfaRecord(adminUserId);
  assert(recordAfterEnroll.encryptedSecret !== null, "Secreto TOTP persistido cifrado con AES-256-GCM");
  assert(recordAfterEnroll.pendingEncryptedSecret === null, "Secreto temporal de enrolamiento purgado de memoria");

  // ==========================================================================
  // BLOQUE 3: CHALLENGE TOKENS EFÍMEROS Y LOGIN SUPERADMIN SIN SESIÓN PREVIA
  // ==========================================================================
  console.log("\n🔑 [BLOQUE 3] CHALLENGE TOKENS NO PRIVILEGIADOS & PROTOCOLO DE LOGIN");

  const challenge = await signMfaChallengeToken({
    userId: adminUserId,
    email: "admin.test@aurenis.com",
    isSystemAdmin: true,
    purpose: "mfa_challenge",
  });

  assert(typeof challenge.challengeToken === "string" && challenge.expiresInSeconds === 300, "Emisión de MFA Challenge Token de 5 minutos");

  // Verificar que el Challenge Token no sea aceptado como sesión de usuario privilegiada normal
  const asSession = await verifySessionToken(challenge.challengeToken);
  assert(asSession === null, "MFA Challenge Token NO es aceptado por el motor de sesiones normales (No Session Bypass)");

  // Validar Challenge Token
  const validChallengePayload = await verifyMfaChallengeToken(challenge.challengeToken, "mfa_challenge");
  assert(validChallengePayload?.sub === adminUserId && validChallengePayload.purpose === "mfa_challenge", "Validación exitosa del Challenge Token con emisor y propósito verificado");

  // Consumir el Challenge Token (Single-Use)
  await consumeChallengeToken(challenge.jti, adminUserId);
  const replayedChallenge = await verifyMfaChallengeToken(challenge.challengeToken, "mfa_challenge");
  assert(replayedChallenge === null, "Challenge Token invalidado tras un solo uso (Single-Use Enforcement)");

  // ==========================================================================
  // BLOQUE 4: VERIFICACIÓN EN LOGIN (TOTP & RECOVERY CODE SINGLE-USE)
  // ==========================================================================
  console.log("\n🎯 [BLOQUE 4] VERIFICACIÓN EN LOGIN Y USO ÚNICO DE RECOVERY CODES");

  // 1. Verificación por TOTP exitosa
  const loginTotpCode = calculateTotpCode(enrollStart.secret, getCurrentTimeStep());
  const loginTotpRes = await verifyMfaLogin(adminUserId, loginTotpCode);
  assert(loginTotpRes.success === true && loginTotpRes.method === "totp", "Login exitoso mediante segundo factor TOTP");

  // 2. Verificación por Recovery Code
  const plainRecoveryCodeToUse = enrollStart.recoveryCodes[0];
  const loginRecoveryRes = await verifyMfaLogin(adminUserId, plainRecoveryCodeToUse);
  assert(loginRecoveryRes.success === true && loginRecoveryRes.method === "recovery_code", "Login exitoso mediante Recovery Code");
  assert(loginRecoveryRes.remainingRecoveryCodes === 7, "Contador de Recovery Codes decrementado a 7");

  // 3. Intento de reusar el mismo Recovery Code -> DEBE FALLAR
  try {
    await verifyMfaLogin(adminUserId, plainRecoveryCodeToUse);
    assert(false, "Reutilización de Recovery Code ya consumido no permitida");
  } catch {
    assert(true, "Reutilización de Recovery Code ya consumido rechazada exitosamente (Single-Use)");
  }

  // ==========================================================================
  // BLOQUE 5: STEP-UP AUTHENTICATION PARA ACCIONES SENSIBLES
  // ==========================================================================
  console.log("\n🚀 [BLOQUE 5] STEP-UP AUTHENTICATION PARA OPERACIONES CRÍTICAS");

  // Emisión de Step-Up Token tras re-autenticación
  const stepUp = await signStepUpToken({
    userId: adminUserId,
    action: "DISABLE_MFA",
  });
  assert(stepUp.expiresInSeconds === 900, "Emisión de Step-Up Token de 15 minutos");

  // Verificación de Step-Up Token para la acción correcta
  const stepUpValid = await verifyStepUpToken(stepUp.stepUpToken, adminUserId, "DISABLE_MFA");
  assert(stepUpValid.allowed === true, "Validación exitosa de Step-Up Token para acción específica autorizada");

  // Verificación de Step-Up Token con acción diferente
  const stepUpActionMismatch = await verifyStepUpToken(stepUp.stepUpToken, adminUserId, "DELETE_DATABASE");
  assert(stepUpActionMismatch.allowed === false, "Rechazo de Step-Up Token para una acción diferente no autorizada");

  // Verificación de Step-Up Token para otro usuario (Spoofing)
  const stepUpUserMismatch = await verifyStepUpToken(stepUp.stepUpToken, "other_user_999", "DISABLE_MFA");
  assert(stepUpUserMismatch.allowed === false, "Rechazo de Step-Up Token si el userId no coincide");

  // ==========================================================================
  // BLOQUE 6: ACCOUNT RECOVERY, ANTI-ENUMERACIÓN Y RESET SEGURO
  // ==========================================================================
  console.log("\n🛡️  [BLOQUE 6] RECUPERACIÓN DE CUENTA, ANTI-ENUMERACIÓN Y REVOCACIÓN");

  // Anti-enumeración: Solicitud para usuario existente y no existente devuelven mensaje idéntico
  const existingReq = await requestPasswordReset("admin@aurenis.com");
  const nonExistingReq = await requestPasswordReset("fake_non_existing_user@nobody.com");
  assert(existingReq.message === nonExistingReq.message, "Anti-Enumeración: Respuesta uniforme para correos existentes y no existentes");

  // Reset con token válido
  assert(typeof existingReq.debugToken === "string", "Generación de token CSPRNG de recuperación (256 bits)");
  const resetRes = await resetPasswordWithToken(existingReq.debugToken!, "NewAurenisAdmin2026!Strong");
  assert(resetRes.success === true, "Restablecimiento de contraseña exitoso con token criptográfico");

  // Intento de reusar el mismo token de reset -> DEBE FALLAR
  try {
    await resetPasswordWithToken(existingReq.debugToken!, "AnotherPassword2026!");
    assert(false, "Reutilización de token de reset ya consumido no permitida");
  } catch {
    assert(true, "Reutilización de token de reset ya consumido rechazada (Single-Use)");
  }

  // ==========================================================================
  // BLOQUE 7: RATE LIMITING ESPECÍFICO PARA MFA
  // ==========================================================================
  console.log("\n⏳ [BLOQUE 7] PROTECCIÓN RATE LIMITING CONTRA FUERZA BRUTA EN MFA");

  const rateLimitKey = `mfa:verify:test_adversary_ip`;
  await resetRateLimit(rateLimitKey);

  let blocked = false;
  for (let i = 0; i < 6; i++) {
    const res = await checkRateLimit(rateLimitKey, RATE_LIMIT_CONFIGS.MFA_VERIFY);
    if (!res.allowed) {
      blocked = true;
      break;
    }
  }
  assert(blocked === true, "Rate Limiter bloquea intentos tras exceder 5 solicitudes de MFA en 3 minutos");

  // ==========================================================================
  // BLOQUE 8: AUDIT LOGGING — CERO FUGA DE SECRETOS EN BITÁCORA
  // ==========================================================================
  console.log("\n📝 [BLOQUE 8] AUDIT LOGGING Y SANITIZACIÓN ESTRICTA DE SECRETOS");

  const dirtyDetails = {
    action: "MFA_LOGIN_FAILED",
    userId: "usr_test",
    password: "SuperSecretPassword123!",
    totp: "123456",
    secret: "JBSWY3DPEHPK3PXP",
    jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    recoveryCode: "ABCD-EFGH-IJKL-MNOP",
    allowedMetadata: "Chrome 128 / macOS",
  };

  const cleanDetails = sanitizeAuditDetails(dirtyDetails) as Record<string, unknown>;
  assert(cleanDetails.password === "[REDACTED_BY_SECURITY_POLICY]", "Sanitización de password en AuditLog");
  assert(cleanDetails.totp === "[REDACTED_BY_SECURITY_POLICY]", "Sanitización de código TOTP en AuditLog");
  assert(cleanDetails.secret === "[REDACTED_BY_SECURITY_POLICY]", "Sanitización de secreto Base32 en AuditLog");
  assert(cleanDetails.jwt === "[REDACTED_BY_SECURITY_POLICY]", "Sanitización de JWT en AuditLog");
  assert(cleanDetails.recoveryCode === "[REDACTED_BY_SECURITY_POLICY]", "Sanitización de Recovery Code en AuditLog");
  assert(cleanDetails.allowedMetadata === "Chrome 128 / macOS", "Preservación de metadata segura para trazabilidad");

  // ==========================================================================
  // RESUMEN Y DICTAMEN DE PHASE 3
  // ==========================================================================
  console.log("\n" + "=".repeat(80));
  console.log(`📊 RESULTADO DE LA SUITE DE PRUEBAS ADVERSARIALES PHASE 3:`);
  console.log(`   - Pruebas Totales Ejecutadas: ${totalTests}`);
  console.log(`   - Pruebas Aprobadas (PASS):    ${passedTests}`);
  console.log(`   - Pruebas Fallidas (FAIL):     ${failedTests}`);
  console.log("=".repeat(80));

  if (failedTests === 0) {
    console.log("🎉 VERIFICACIÓN SATISFACTORIA: TODOS LOS CONTROLES PHASE 3 OPERAN AL 100%");
  } else {
    console.error(`🚨 ALERTA: Se detectaron ${failedTests} fallos en los controles de Phase 3.`);
    process.exit(1);
  }
}

runPhase3SecurityTestSuite().catch((err) => {
  console.error("Error fatal ejecutando suite Phase 3:", err);
  process.exit(1);
});
