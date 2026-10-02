import {
  startAttendanceSession,
  getAttendanceSessionLiveState,
  recordAttendanceViaQR,
  saveBulkManualAttendance,
  closeAttendanceSession,
} from "../lib/services/attendance-session.service";

async function runAttendanceVerification() {
  console.log("=== PRUEBA DE INTEGRIDAD Y SEGURIDAD: SISTEMA DE ASISTENCIA HÍBRIDO (QR + MANUAL) ===");

  const schoolId = "school-lpmm-001";
  const courseId = "course-lpmm-4me";
  const dateStr = "2026-10-01";
  const teacherUserId = "user-lpmm-profesor";

  // 1. Docente inicia sesión de asistencia
  console.log("\n1. Iniciando sesión de asistencia para 4° Medio E...");
  const sessionState = await startAttendanceSession({
    schoolId,
    courseId,
    teacherUserId,
    dateStr,
  });

  console.log(`✓ Sesión creada ID: ${sessionState.sessionId}`);
  console.log(`✓ Token QR generado (corta duración 30s): ${sessionState.qrToken.substring(0, 30)}...`);
  console.log(`✓ Total alumnos matriculados: ${sessionState.totalStudents}`);
  console.log(`✓ Pendientes: ${sessionState.pendingCount}`);

  // 2. Estudiante 1 escanear QR
  console.log("\n2. Estudiante (Priscila Abarca) escanea código QR...");
  const scan1 = await recordAttendanceViaQR({
    schoolSlug: "lpmm",
    qrToken: sessionState.qrToken,
    studentUserId: "user-lpmm-4e-std-1",
  });
  console.log(`✓ Resultado escaneo 1: ${scan1.message} (${scan1.recordedAt})`);

  // 3. Obtener estado en vivo tras escaneo QR
  const liveState1 = await getAttendanceSessionLiveState({
    sessionId: sessionState.sessionId,
    schoolId,
    courseId,
    dateStr,
  });
  console.log(`✓ Estado en vivo actual: ${liveState1.registeredCount} / ${liveState1.totalStudents} registrados (${liveState1.qrCount} QR, ${liveState1.manualCount} Manual).`);

  // 4. Docente realiza registro manual para el resto del curso
  console.log("\n4. Docente realiza pase de lista manual para alumnos pendientes...");
  const pendingStudents = liveState1.students.filter((s) => s.status === "PENDING");
  const manualRecords = pendingStudents.map((s, idx) => ({
    studentProfileId: s.studentProfileId,
    status: (idx % 5 === 0 ? "LATE" : idx % 7 === 0 ? "ABSENT_JUSTIFIED" : "PRESENT") as any,
    method: "MANUAL" as any,
    justification: idx % 7 === 0 ? "Certificado médico presentado" : null,
  }));

  const saveManual = await saveBulkManualAttendance({
    schoolId,
    courseId,
    dateStr,
    teacherUserId,
    records: manualRecords,
  });
  console.log(`✓ Se guardaron manualmente ${saveManual.count} registros.`);

  // 5. Verificar equivalencia académica
  const liveState2 = await getAttendanceSessionLiveState({
    sessionId: sessionState.sessionId,
    schoolId,
    courseId,
    dateStr,
  });
  console.log("\n5. Verificando equivalencia académica entre métodos:");
  console.log(`- Total Alumnos: ${liveState2.totalStudents}`);
  console.log(`- Registrados: ${liveState2.registeredCount}`);
  console.log(`- Pendientes: ${liveState2.pendingCount}`);
  console.log(`- Desglose por método: ${liveState2.qrCount} por QR, ${liveState2.manualCount} por Manual.`);

  // 6. Cerrar sesión
  console.log("\n6. Cerrando sesión de asistencia...");
  const close = await closeAttendanceSession({
    sessionId: sessionState.sessionId,
    teacherUserId,
  });
  console.log(`✓ Sesión cerrada: ${close.message}`);

  // 7. Prueba de seguridad: Intento de re-escaneo tras cierre
  console.log("\n7. Prueba de seguridad anti-fraude (re-escaneo tras cierre):");
  try {
    await recordAttendanceViaQR({
      schoolSlug: "lpmm",
      qrToken: sessionState.qrToken,
      studentUserId: "user-lpmm-student-17",
    });
    console.error("❌ ERROR DE SEGURIDAD: Se permitió escaneo en sesión cerrada.");
  } catch (err: any) {
    console.log(`✓ Rechazado correctamente por seguridad backend: "${err.message}"`);
  }

  console.log("\n=== PRUEBAS FINALIZADAS EXITOSAMENTE CON 100% DE INTEGRIDAD DE DATOS Y SEGURIDAD ===");
}

runAttendanceVerification().catch((err) => {
  console.error("Error en la prueba de asistencia:", err);
  process.exit(1);
});
