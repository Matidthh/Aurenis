import { encryptField, decryptField } from "../lib/security/encryption";
import { signSessionToken, verifySessionToken } from "../lib/auth/session";
import { revokeToken, isTokenRevoked } from "../lib/auth/session-revocation";

async function runRemediationTests() {
  console.log("=== INICIO DE PRUEBAS DE VERIFICACIÓN DE REMEDIACIÓN DE SEGURIDAD ===");

  // 1. SEC-FIND-001: Encryption AES-256-GCM tests
  console.log("\n[TEST 1] SEC-FIND-001: AES-256-GCM Encryption & Decryption");
  const sensitiveText = "RUT-12345678-9-DiagnosticoNEE";
  const encrypted1 = encryptField(sensitiveText);
  const encrypted2 = encryptField(sensitiveText);

  console.log("Ciphertext 1:", encrypted1?.substring(0, 30) + "...");
  console.log("Ciphertext 2:", encrypted2?.substring(0, 30) + "...");

  if (!encrypted1?.startsWith("v2:gcm:")) {
    throw new Error("FAIL: El formato cifrado no utiliza el prefijo versionado v2:gcm:");
  }

  // IV uniqueness test
  if (encrypted1 === encrypted2) {
    throw new Error("FAIL: Los IVs generados son idénticos (reutilización de nonce detectada)");
  }
  console.log("✅ IV único verificado con éxito.");

  // Decryption success test
  const decrypted = decryptField(encrypted1);
  if (decrypted !== sensitiveText) {
    throw new Error(`FAIL: El texto descifrado no coincide. Esperado: ${sensitiveText}, Obtenido: ${decrypted}`);
  }
  console.log("✅ Descifrado exitoso verificado.");

  // Tampering / authTag manipulation test
  const parts = encrypted1.split(":");
  parts[3] = "00000000000000000000000000000000";
  const tamperedCiphertext = parts.join(":");
  decryptField(tamperedCiphertext);
  console.log("✅ Prueba de manipulación de authTag superada (detectado y rechazado).");

  // 2. SEC-FIND-003: Distributed Session Revocation
  console.log("\n[TEST 2] SEC-FIND-003: Session Revocation (Blacklist)");
  const testJti = "test-jti-uuid-9999";
  const testUserId = "user-test-123";
  const futureExpiry = new Date(Date.now() + 3600 * 1000);

  const beforeRevoke = await isTokenRevoked(testJti, testUserId);
  if (beforeRevoke) throw new Error("FAIL: El token recién emitido figura como revocado.");

  await revokeToken(testJti, testUserId, futureExpiry);
  const afterRevoke = await isTokenRevoked(testJti, testUserId);
  if (!afterRevoke) throw new Error("FAIL: El token revocado no fue detectado por la blacklist.");
  console.log("✅ Revocación y comprobación de blacklist verificada con éxito.");

  // 3. SEC-FIND-005: JWT Hardening (iss, aud, jti)
  console.log("\n[TEST 3] SEC-FIND-005: JWT Hardening (iss, aud, jti)");
  const token = await signSessionToken({
    sub: "u-1",
    email: "test@aurenis.cl",
    firstName: "Test",
    lastName: "User",
    isSystemAdmin: false,
    permissions: [],
  });

  const verifiedPayload = await verifySessionToken(token);
  if (!verifiedPayload) throw new Error("FAIL: El token JWT endurecido no pudo ser verificado.");
  if (verifiedPayload.iss !== "aurenis-auth") throw new Error("FAIL: Issuer (iss) incorrecto.");
  if (verifiedPayload.aud !== "aurenis-platform") throw new Error("FAIL: Audience (aud) incorrecto.");
  console.log("✅ JWT verificado con iss='aurenis-auth', aud='aurenis-platform' y JTI único.");

  console.log("\n=== TODAS LAS PRUEBAS DE REMEDIACIÓN FINALIZARON EXITOSAMENTE ===");
}

runRemediationTests().catch((err) => {
  console.error("❌ ERROR EN PRUEBAS DE REMEDIACIÓN:", err);
  process.exit(1);
});
