import { createAttendanceSession } from "../lib/services/attendance.service";

async function testService() {
  console.log("=== PRUEBA DE SERVICIO: createAttendanceSession en lib/services/attendance.service.ts ===");

  const sessionData = await createAttendanceSession({
    schoolId: "school-lpmm-001",
    courseId: "course-lpmm-4me",
    teacherUserId: "user-lpmm-profesor",
    dateStr: "2026-10-01",
    ttlSeconds: 30,
  });

  console.log("✓ Sesión de asistencia creada exitosamente:");
  console.log(`  - ID de Sesión: ${sessionData.sessionId}`);
  console.log(`  - ID de Curso: ${sessionData.courseId}`);
  console.log(`  - ID de Escuela: ${sessionData.schoolId}`);
  console.log(`  - Estado: ${sessionData.status}`);
  console.log(`  - Expiración: ${sessionData.expiresAt}`);
  console.log(`  - Token JWT (jose): ${sessionData.token.substring(0, 45)}...`);

  console.log("\n=== PRUEBA DE SERVICIO FINALIZADA CON ÉXITO (100% OK) ===");
}

testService().catch((err) => {
  console.error("Error en la prueba:", err);
  process.exit(1);
});
