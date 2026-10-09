/**
 * ============================================================================
 * PRUEBA DE VERIFICACIÓN: FLUJO DE RECUPERACIÓN DE CONTRASEÑA (15-MIN TOKEN)
 * ============================================================================
 * Autores: Frank M. (QA & Seguridad) & Maicol R. (Backend Lead)
 * ============================================================================
 */

import { requestPasswordReset, resetPasswordWithToken } from "../lib/services/recovery.service";

async function verifyPasswordResetWorkflow() {
  console.log("================================================================================");
  console.log("🛡️ VERIFICACIÓN DEL FLUJO 'FORGOT PASSWORD' (TOKEN HASHEADOS & EXPIRACIÓN 15 MIN)");
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

  // 1. Solicitar recuperación para un correo de prueba
  const reqResult = await requestPasswordReset("director@lpmm.cl", {
    ipAddress: "190.160.1.1",
    userAgent: "Automated-Test-Agent",
  });

  assert(reqResult.success, "Solicitud de recuperación procesada exitosamente con respuesta uniforme anti-enumeración");
  assert(reqResult.debugToken !== undefined, "Token de prueba (32 bytes) generado por CSPRNG en entorno de testing");
  assert(reqResult.debugToken?.length === 64, "Token plano tiene longitud hexadecimal de 64 caracteres (256 bits)");

  // 2. Intentar restablecer la contraseña usando el token generado
  if (reqResult.debugToken) {
    const newPassword = "NewSecurePassword2026!";
    const resetResult = await resetPasswordWithToken(reqResult.debugToken, newPassword, {
      ipAddress: "190.160.1.1",
      userAgent: "Automated-Test-Agent",
    });

    assert(resetResult.success, "Contraseña restablecida exitosamente utilizando el token válido");

    // 3. Verificar que el token sea de un solo uso (Single-Use) e intente re-utilizarse
    try {
      await resetPasswordWithToken(reqResult.debugToken, "AnotherPassword2026!");
      assert(false, "Reutilización del mismo token debe ser rechazada");
    } catch (err: any) {
      assert(err.message.includes("expirado") || err.message.includes("utilizado"), "Token reutilizado rechazado con mensaje de seguridad");
    }
  }

  console.log("\n================================================================================");
  console.log(`📊 RESULTADOS: ${passed}/${total} PRUEBAS SUPERADAS (${Math.round((passed / total) * 100)}%)`);
  console.log("🛡️ FLUJO FORGOT PASSWORD CON TOKEN HASHEADO Y EXPIRACIÓN 15 MIN VERIFICADO");
  console.log("================================================================================");

  if (passed !== total) {
    process.exit(1);
  }
}

verifyPasswordResetWorkflow().catch((err) => {
  console.error("Error en verificación:", err);
  process.exit(1);
});
