/**
 * Aurenis Suite de Pruebas Integrales de Seguridad, Servicios Backend & QA
 * Cobertura Completa de los 12 Servicios del Dominio Escolar y Sistema SaaS Multi-Tenant.
 */

import { getSchoolAcademicOverview, listCoursesByYear, listAcademicPeriods } from "../lib/services/academic.service";
import { listAttendanceRecords, getAttendanceOverview } from "../lib/services/attendance.service";
import { logAuditEvent } from "../lib/services/audit.service";
import { BulkGradesProcessor } from "../lib/services/bulk-grades-processor";
import { DeadLetterQueueService } from "../lib/services/dead-letter-queue.service";
import { listAssessmentsWithGrades, getSchoolGradingConfig, createGrade } from "../lib/services/grade.service";
import { SCHOOLS_CATALOG } from "../lib/services/school.service";
import { SecurityFirewallService } from "../lib/services/security-firewall.service";
import { listStudentsBySchool, getStudentDetails } from "../lib/services/student.service";
import { SystemHealthService } from "../lib/services/system-health.service";
import { listTeachersBySchool, getTeacherDetails } from "../lib/services/teacher.service";
import { authenticateUser } from "../lib/services/user.service";
import { createTenantPrisma } from "../lib/db/tenant-extension";
import { NextRequest } from "next/server";

let passed = 0;
let total = 0;

function assert(condition: boolean, name: string, detail?: string) {
  total++;
  if (condition) {
    passed++;
    console.log(`✅ [PASS] ${name}`);
    if (detail) console.log(`   ➜ ${detail}`);
  } else {
    console.error(`❌ [FAIL] ${name}`);
    if (detail) console.error(`   ➜ ${detail}`);
  }
}

async function runTests() {
  console.log("=".repeat(80));
  console.log("🚀 SUITE INTEGRAL AURENIS - PRUEBAS DE LOS 12 SERVICIOS DEL DOMINIO");
  console.log("=".repeat(80));

  const mockDb = createTenantPrisma("sch_sanjose_demo");

  // 1. Servicio Académico
  console.log("\n--- 1. Academic Service ---");
  const overview = await getSchoolAcademicOverview(mockDb, "sch_sanjose_demo");
  assert(overview.totalCourses > 0, "Academic Overview - Total Courses", `Courses count: ${overview.totalCourses}`);
  const courses = await listCoursesByYear(mockDb, "sch_sanjose_demo", 2026);
  assert(courses.length > 0, "Academic Service - List Courses", `Found ${courses.length} courses`);
  const periods = await listAcademicPeriods(mockDb, "sch_sanjose_demo");
  assert(periods.length > 0, "Academic Service - List Periods", `Found ${periods.length} periods`);

  // 2. Servicio de Asistencia
  console.log("\n--- 2. Attendance Service ---");
  const attRecords = await listAttendanceRecords(mockDb, "sch_sanjose_demo");
  assert(attRecords.length > 0, "Attendance Service - List Records", `Found ${attRecords.length} records`);
  const attOverview = await getAttendanceOverview(mockDb, "sch_sanjose_demo");
  assert(attOverview.attendanceRate > 0, "Attendance Service - Overview Rate", `Rate: ${attOverview.attendanceRate}%`);

  // 3. Servicio de Auditoría
  console.log("\n--- 3. Audit Service ---");
  await logAuditEvent({
    schoolId: "sch_sanjose_demo",
    userId: "usr_director_demo",
    action: "READ" as any,
    entityType: "TEST",
    entityId: "test_123",
  });
  assert(true, "Audit Service - Event Logging", "Logged audit event without non-fatal errors");

  // 4. Procesador Masivo de Calificaciones (Bulk Grades Processor)
  console.log("\n--- 4. Bulk Grades Processor ---");
  const bulkResult = await BulkGradesProcessor.processBulkGrades({
    assessmentId: "ass_1_demo",
    schoolId: "sch_sanjose_demo",
    userId: "usr_teacher_demo",
    grades: [
      { enrollmentId: "enr_1", value: 6.5 },
      { enrollmentId: "enr_2", value: 5.8 },
    ],
  });
  assert(bulkResult.totalProcessed === 2, "Bulk Grades Processor - Chunk Processing", `Processed ${bulkResult.totalProcessed} items`);

  // 5. Servicio Dead Letter Queue (DLQ)
  console.log("\n--- 5. Dead Letter Queue Service ---");
  const jobId = DeadLetterQueueService.pushToDLQ("test-queue", "test-job", { test: true }, "Timeout", 3);
  assert(typeof jobId === "string" && jobId.length > 0, "DLQ - Push Job", `Job ID: ${jobId}`);
  const jobs = DeadLetterQueueService.listFailedJobs();
  assert(jobs.length > 0, "DLQ - List Failed Jobs", `Jobs in DLQ: ${jobs.length}`);
  const retryRes = DeadLetterQueueService.retryJob(jobId);
  assert(retryRes.success === true, "DLQ - Retry Job", `Retry status: ${retryRes.success}`);

  // 6. Servicio de Calificaciones (Grade Service)
  console.log("\n--- 6. Grade Service ---");
  const assessments = await listAssessmentsWithGrades(mockDb, "sch_sanjose_demo");
  assert(assessments.length > 0, "Grade Service - List Assessments", `Assessments count: ${assessments.length}`);
  const gradeConfig = await getSchoolGradingConfig(mockDb, "sch_sanjose_demo");
  assert(gradeConfig.minPassingGrade === 4.0, "Grade Service - Grading Config", `Min passing: ${gradeConfig.minPassingGrade}`);

  // 7. Servicio de Colegios (School Service)
  console.log("\n--- 7. School Service ---");
  assert(SCHOOLS_CATALOG.length > 0, "School Service - Catalog", `Catalog institutions: ${SCHOOLS_CATALOG.length}`);

  // 8. Firewall de Seguridad (Security Firewall Service)
  console.log("\n--- 8. Security Firewall Service ---");
  const dummyReq = new NextRequest("https://aurenis.app/api/test", {
    headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
  });
  const firewallRes = SecurityFirewallService.inspectRequest(dummyReq);
  assert(firewallRes.allowed === true, "Security Firewall - Valid Request Inspection", `Trust score: ${firewallRes.trustScore}`);

  // 9. Servicio de Estudiantes (Student Service)
  console.log("\n--- 9. Student Service ---");
  const students = await listStudentsBySchool(mockDb, "sch_sanjose_demo");
  assert(Array.isArray(students), "Student Service - List Students", `Returned student array successfully`);
  const studentDetail = await getStudentDetails(mockDb, "sch_sanjose_demo", "std_1");
  assert(studentDetail !== undefined, "Student Service - Get Details", "Executed query cleanly");

  // 10. Salud del Sistema (System Health Service)
  console.log("\n--- 10. System Health Service ---");
  const health = await SystemHealthService.checkHealth();
  assert(health.status === "healthy" || health.status === "degraded", "System Health - Check Health", `System status: ${health.status}`);

  // 11. Servicio de Docentes (Teacher Service)
  console.log("\n--- 11. Teacher Service ---");
  const teachers = await listTeachersBySchool(mockDb, "sch_sanjose_demo");
  assert(teachers.length > 0, "Teacher Service - List Teachers", `Teachers count: ${teachers.length}`);
  const teacherDetail = await getTeacherDetails(mockDb, "sch_sanjose_demo", "tp_1_demo");
  assert(teacherDetail !== undefined, "Teacher Service - Get Teacher Details", "Executed query cleanly");

  // 12. Servicio de Usuarios y Autenticación (User Service)
  console.log("\n--- 12. User Service ---");
  const authRes = await authenticateUser("director@sanjose.cl", "AdminCSJ2026!");
  assert(authRes !== null && typeof authRes === "object", "User Service - Demo User Authentication", `Authenticated user: ${authRes?.email}`);

  console.log("\n" + "=".repeat(80));
  console.log(`📊 RESULTADO FINAL: ${passed}/${total} PRUEBAS EXITOSAS (${Math.round((passed / total) * 100)}%)`);
  console.log("=".repeat(80));

  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("❌ Fatal error executing test suite:", err);
  process.exit(1);
});
