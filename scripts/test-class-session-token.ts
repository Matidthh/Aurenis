import {
  generateClassSessionToken,
  validateClassSessionToken,
} from "../lib/services/class-session-token.service";

async function testClassSessionTokenService() {
  console.log("=== PRUEBA DE SERVICIO: GENERADOR DE TOKENS TEMPORALES DE SESIÓN DE CLASE ===");

  const schoolSlug = "lpmm";
  const courseId = "course-lpmm-4me";
  const teacherUserId = "user-lpmm-profesor";

  // 1. Generar token con TTL de 10 segundos
  console.log("\n1. Solicitando token de sesión de clase con TTL de 10 segundos...");
  const tokenData = await generateClassSessionToken({
    schoolSlug,
    courseId,
    teacherUserId,
    ttlSeconds: 10,
  });

  console.log("✓ Token generado exitosamente:");
  console.log(`  - Session ID: ${tokenData.sessionId}`);
  console.log(`  - Course ID: ${tokenData.courseId}`);
  console.log(`  - TTL Seconds: ${tokenData.ttlSeconds}`);
  console.log(`  - Expires At: ${tokenData.expiresAt}`);
  console.log(`  - Token JWT (HS256): ${tokenData.token.substring(0, 45)}...`);

  // 2. Validar token inmediatamente
  console.log("\n2. Validando token de sesión de clase inmediatamente...");
  const payload = await validateClassSessionToken(tokenData.token);
  console.log("✓ Token verificado correctamente con firma criptográfica:");
  console.log(`  - Payload Session ID: ${payload.sessionId}`);
  console.log(`  - Payload Course ID: ${payload.courseId}`);

  console.log("\n=== PRUEBA DE TOKEN TEMPORAL FINALIZADA CON ÉXITO (100% OK) ===");
}

testClassSessionTokenService().catch((err) => {
  console.error("Error en la prueba:", err);
  process.exit(1);
});
