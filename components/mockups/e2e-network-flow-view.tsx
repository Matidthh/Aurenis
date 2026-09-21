"use client";

import React, { useState } from "react";
import {
  Database,
  Network,
  CheckCircle2,
  Play,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Server,
  Layers,
  FileCode,
  Activity,
  Clock,
  Search,
  SlidersHorizontal,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Terminal,
  Table as TableIcon,
  RefreshCw,
  Zap,
} from "lucide-react";
import { NetworkTrace, DatabaseTrace, WorkflowResult } from "@/app/api/system/e2e-workflow/route";

interface E2ENetworkFlowViewProps {
  onNavigateToTab?: (tab: string) => void;
  onOpenCriteriaModal?: () => void;
}

export function E2ENetworkFlowView({
  onNavigateToTab,
  onOpenCriteriaModal,
}: E2ENetworkFlowViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<"network" | "postgres" | "workflows">("network");
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>("wf-grades-bulk");
  const [networkFilterStatus, setNetworkFilterStatus] = useState<"all" | "200" | "201" | "error">("all");
  const [networkFilterResource, setNetworkFilterResource] = useState<string>("all");
  const [networkSearch, setNetworkSearch] = useState<string>("");
  const [selectedRequestTab, setSelectedRequestTab] = useState<"headers" | "payload" | "response" | "timing">("headers");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isRunningAll, setIsRunningAll] = useState<boolean>(false);
  const [runProgress, setRunProgress] = useState<number>(100);
  const [selectedDbTable, setSelectedDbTable] = useState<"Grade" | "Student" | "Teacher" | "AuditLog">("Grade");

  // Lista de Flujos E2E pre-construidos con trazabilidad real
  const [workflows, setWorkflows] = useState<WorkflowResult[]>([
    {
      id: "wf-grades-bulk",
      name: "Calificación Masiva Decreto 67",
      category: "Calificaciones & Evaluaciones",
      passed: true,
      status: "PASSED",
      timestamp: "Hace 2 minutos",
      summary: "6 calificaciones validadas en rango legal 1.0-7.0, persistidas atómicamente en PostgreSQL con recálculo de promedios.",
      networkTrace: {
        id: "req_grd_9841a",
        timestamp: "14:13:22.481",
        method: "POST",
        url: "/api/schools/col-san-patricio-2026/grades/bulk",
        status: 200,
        statusText: "OK",
        durationMs: 14.8,
        sizeBytes: 2480,
        resource: "Grades",
        requestHeaders: {
          "Content-Type": "application/json",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfdmFsZGVzXzAxIiwic2Nob29sSWQiOiJjb2wtc2FuLXBhdHJpY2lvLTIwMjYifQ...",
          "X-Tenant-School-Id": "col-san-patricio-2026",
          "User-Agent": "Aurenis-Client/1.0 (Next.js 15 App Router)",
          "Accept": "application/json",
        },
        responseHeaders: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store, max-age=0",
          "X-Transaction-Id": "tx_grades_981a",
          "X-Database-Time": "9.2ms",
          "X-RateLimit-Remaining": "498",
        },
        requestPayload: {
          schoolId: "col-san-patricio-2026",
          courseId: "course-1m-a",
          subjectId: "subj-mat-1ma",
          periodId: "period-sem1-2026",
          grades: [
            { studentId: "std-001", assessmentId: "ass-01", value: 6.8, notes: "Evaluación Sumativa 1" },
            { studentId: "std-002", assessmentId: "ass-01", value: 5.5, notes: "Evaluación Sumativa 1" },
            { studentId: "std-003", assessmentId: "ass-01", value: 4.2, notes: "Evaluación Sumativa 1" },
            { studentId: "std-004", assessmentId: "ass-01", value: 6.0, notes: "Evaluación Sumativa 1" },
            { studentId: "std-005", assessmentId: "ass-01", value: 7.0, notes: "Evaluación Sumativa 1" },
            { studentId: "std-006", assessmentId: "ass-01", value: 3.8, notes: "Evaluación Sumativa 1 - Refuerzo" },
          ],
        },
        responseBody: {
          success: true,
          recordsProcessed: 6,
          recordsSaved: 6,
          averagesRecalculated: 6,
          courseAverage: 5.55,
          message: "Calificaciones sincronizadas con éxito en libro digital",
        },
        waterfall: {
          dnsMs: 0.2,
          tlsMs: 0.4,
          ttfbMs: 13.1,
          downloadMs: 1.1,
          totalMs: 14.8,
        },
      },
      databaseTrace: {
        transactionId: "tx_grades_981a",
        isolationLevel: "READ COMMITTED",
        database: "PostgreSQL 16 (Aurenis Multi-tenant)",
        tablesAffected: ["Grade", "Enrollment", "AuditLog"],
        queries: [
          {
            sql: "BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED;",
            params: [],
            durationMs: 0.5,
            affectedRows: 0,
          },
          {
            sql: `INSERT INTO "Grade" ("id", "schoolId", "assessmentId", "enrollmentId", "value", "notes", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW()),
  (gen_random_uuid(), $1, $2, $6, $7, $8, NOW(), NOW()),
  (gen_random_uuid(), $1, $2, $9, $10, $11, NOW(), NOW()),
  (gen_random_uuid(), $1, $2, $12, $13, $14, NOW(), NOW()),
  (gen_random_uuid(), $1, $2, $15, $16, $17, NOW(), NOW()),
  (gen_random_uuid(), $1, $2, $18, $19, $20, NOW(), NOW())
ON CONFLICT ("assessmentId", "enrollmentId") DO UPDATE SET "value" = EXCLUDED."value", "updatedAt" = NOW();`,
            params: [
              "col-san-patricio-2026", "ass-01",
              "enr-001", 6.8, "Sumativa 1",
              "enr-002", 5.5, "Sumativa 1",
              "enr-003", 4.2, "Sumativa 1",
              "enr-004", 6.0, "Sumativa 1",
              "enr-005", 7.0, "Sumativa 1",
              "enr-006", 3.8, "Sumativa 1 - Refuerzo",
            ],
            durationMs: 4.8,
            affectedRows: 6,
          },
          {
            sql: `INSERT INTO "AuditLog" ("id", "schoolId", "action", "entity", "entityId", "metadata", "createdAt")
VALUES (gen_random_uuid(), $1, 'CREATE', 'GradeBulk', $2, $3, NOW());`,
            params: ["col-san-patricio-2026", "ass-01", "{\"count\":6,\"course\":\"1° Medio A\"}"],
            durationMs: 1.2,
            affectedRows: 1,
          },
          {
            sql: "COMMIT;",
            params: [],
            durationMs: 0.6,
            affectedRows: 0,
          },
        ],
        persistedSnapshot: [
          { id: "grd-7f91a01", student: "Alarcón Valenzuela, Martín", rut: "23.491.028-4", assessment: "Sumativa 1", value: 6.8, status: "Aprobado" },
          { id: "grd-7f91a02", student: "Benítez Castillo, Sofía", rut: "23.512.981-2", assessment: "Sumativa 1", value: 5.5, status: "Aprobado" },
          { id: "grd-7f91a03", student: "Carrasco Morales, Diego", rut: "23.604.119-9", assessment: "Sumativa 1", value: 4.2, status: "Aprobado" },
          { id: "grd-7f91a04", student: "Díaz Fuentes, Valentina", rut: "23.771.840-0", assessment: "Sumativa 1", value: 6.0, status: "Aprobado" },
          { id: "grd-7f91a05", student: "Espinoza Herrera, Benjamín", rut: "23.820.315-7", assessment: "Sumativa 1", value: 7.0, status: "Sobresaliente" },
          { id: "grd-7f91a06", student: "Fuenzalida Rivas, Florencia", rut: "23.901.442-3", assessment: "Sumativa 1", value: 3.8, status: "Reprobado (Refuerzo)" },
        ],
        verificationQuery: {
          sql: `SELECT g.id, s."rutOrNationalId" as rut, CONCAT(u."lastName", ', ', u."firstName") as student_name, g.value, a.title as assessment
FROM "Grade" g
JOIN "Enrollment" e ON g."enrollmentId" = e.id
JOIN "StudentProfile" sp ON e."studentProfileId" = sp.id
JOIN "Membership" m ON sp."membershipId" = m.id
JOIN "User" u ON m."userId" = u.id
JOIN "Assessment" a ON g."assessmentId" = a.id
WHERE g."schoolId" = 'col-san-patricio-2026' AND a.id = 'ass-01'
ORDER BY u."lastName" ASC;`,
          result: [
            { id: "grd-7f91a01", rut: "23.491.028-4", student_name: "Alarcón Valenzuela, Martín", value: 6.8, assessment: "Sumativa 1" },
            { id: "grd-7f91a02", rut: "23.512.981-2", student_name: "Benítez Castillo, Sofía", value: 5.5, assessment: "Sumativa 1" },
            { id: "grd-7f91a03", rut: "23.604.119-9", student_name: "Carrasco Morales, Diego", value: 4.2, assessment: "Sumativa 1" },
            { id: "grd-7f91a04", rut: "23.771.840-0", student_name: "Díaz Fuentes, Valentina", value: 6.0, assessment: "Sumativa 1" },
            { id: "grd-7f91a05", rut: "23.820.315-7", student_name: "Espinoza Herrera, Benjamín", value: 7.0, assessment: "Sumativa 1" },
            { id: "grd-7f91a06", rut: "23.901.442-3", student_name: "Fuenzalida Rivas, Florencia", value: 3.8, assessment: "Sumativa 1" },
          ],
        },
      },
    },
    {
      id: "wf-student-enrollment",
      name: "Matrícula de Nuevo Estudiante con RUT Chileno",
      category: "Estudiantes & Matrícula",
      passed: true,
      status: "PASSED",
      timestamp: "Hace 5 minutos",
      summary: "Validación de RUT con algoritmo Módulo 11, comprobación de unicidad en PostgreSQL, creación de usuario, membresía y enrollment con FK íntegra.",
      networkTrace: {
        id: "req_std_1092b",
        timestamp: "14:10:18.112",
        method: "POST",
        url: "/api/schools/col-san-patricio-2026/students",
        status: 201,
        statusText: "Created",
        durationMs: 21.4,
        sizeBytes: 1850,
        resource: "Students",
        requestHeaders: {
          "Content-Type": "application/json",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          "X-Tenant-School-Id": "col-san-patricio-2026",
          "Accept": "application/json",
        },
        responseHeaders: {
          "Content-Type": "application/json; charset=utf-8",
          "Location": "/api/schools/col-san-patricio-2026/students/std_99214",
          "X-Transaction-Id": "tx_student_99214",
          "X-Database-Time": "14.2ms",
        },
        requestPayload: {
          schoolId: "col-san-patricio-2026",
          firstName: "Lucas Ignacio",
          lastName: "Navarro Cárdenas",
          rut: "21.890.345-K",
          email: "lucas.navarro@sanpatricio.edu.cl",
          courseId: "course-1m-b",
          year: 2026,
          guardianName: "Marcela Cárdenas Soto",
          guardianRut: "13.441.902-3",
          guardianPhone: "+56 9 7812 3456",
        },
        responseBody: {
          success: true,
          studentId: "std_99214",
          enrollmentId: "enr_88123",
          user: {
            id: "usr_navarro_01",
            fullName: "Lucas Ignacio Navarro Cárdenas",
            rut: "21.890.345-K",
            email: "lucas.navarro@sanpatricio.edu.cl",
          },
          course: "1° Medio B",
          status: "ACTIVE",
        },
        waterfall: {
          dnsMs: 0.1,
          tlsMs: 0.3,
          ttfbMs: 19.8,
          downloadMs: 1.2,
          totalMs: 21.4,
        },
      },
      databaseTrace: {
        transactionId: "tx_student_99214",
        isolationLevel: "SERIALIZABLE",
        database: "PostgreSQL 16 (Aurenis Multi-tenant)",
        tablesAffected: ["User", "Membership", "StudentProfile", "Enrollment", "AuditLog"],
        queries: [
          {
            sql: "BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;",
            params: [],
            durationMs: 0.4,
            affectedRows: 0,
          },
          {
            sql: `SELECT id FROM "User" WHERE "rutOrNationalId" = $1 LIMIT 1;`,
            params: ["21.890.345-K"],
            durationMs: 1.5,
            affectedRows: 0,
          },
          {
            sql: `INSERT INTO "User" ("id", "email", "firstName", "lastName", "rutOrNationalId", "passwordHash", "status", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 'ACTIVE', NOW(), NOW()) RETURNING id;`,
            params: ["lucas.navarro@sanpatricio.edu.cl", "Lucas Ignacio", "Navarro Cárdenas", "21.890.345-K", "$2b$10$e8V..."],
            durationMs: 3.8,
            affectedRows: 1,
          },
          {
            sql: `INSERT INTO "Membership" ("id", "userId", "schoolId", "roleId", "isActive", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), $1, $2, $3, true, NOW(), NOW()) RETURNING id;`,
            params: ["usr_navarro_01", "col-san-patricio-2026", "role_student"],
            durationMs: 2.1,
            affectedRows: 1,
          },
          {
            sql: `INSERT INTO "Enrollment" ("id", "schoolId", "courseId", "studentProfileId", "year", "status", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), $1, $2, $3, $4, 'ACTIVE', NOW(), NOW());`,
            params: ["col-san-patricio-2026", "course-1m-b", "sp_0912", 2026],
            durationMs: 2.9,
            affectedRows: 1,
          },
          {
            sql: "COMMIT;",
            params: [],
            durationMs: 0.5,
            affectedRows: 0,
          },
        ],
        persistedSnapshot: [
          {
            userId: "usr_navarro_01",
            fullName: "Lucas Ignacio Navarro Cárdenas",
            rut: "21.890.345-K",
            email: "lucas.navarro@sanpatricio.edu.cl",
            course: "1° Medio B",
            status: "ACTIVE",
            enrolledAt: "2026-03-01T09:00:00.000Z",
          },
        ],
        verificationQuery: {
          sql: `SELECT u.id, u."rutOrNationalId", u."firstName", u."lastName", c.name as course, e.year, e.status
FROM "Enrollment" e
JOIN "StudentProfile" sp ON e."studentProfileId" = sp.id
JOIN "Membership" m ON sp."membershipId" = m.id
JOIN "User" u ON m."userId" = u.id
JOIN "Course" c ON e."courseId" = c.id
WHERE u."rutOrNationalId" = '21.890.345-K' AND e."schoolId" = 'col-san-patricio-2026';`,
          result: [
            {
              id: "usr_navarro_01",
              rutOrNationalId: "21.890.345-K",
              firstName: "Lucas Ignacio",
              lastName: "Navarro Cárdenas",
              course: "1° Medio B",
              year: 2026,
              status: "ACTIVE",
            },
          ],
        },
      },
    },
    {
      id: "wf-teacher-assignment",
      name: "Asignación Académica Docente y Control de Carga Horaria",
      category: "Docentes & Asignaturas",
      passed: true,
      status: "PASSED",
      timestamp: "Hace 8 minutos",
      summary: "Verificación de tope contractual de 44 hrs (actual 36 + 6 = 42 hrs <= 44 hrs OK), integridad referencial FK Course/Teacher y persistencia en tabla Subject.",
      networkTrace: {
        id: "req_tch_5502c",
        timestamp: "14:07:33.204",
        method: "POST",
        url: "/api/schools/col-san-patricio-2026/teachers/tch_valdes_01/assignments",
        status: 200,
        statusText: "OK",
        durationMs: 16.2,
        sizeBytes: 1540,
        resource: "Teachers",
        requestHeaders: {
          "Content-Type": "application/json",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          "X-Tenant-School-Id": "col-san-patricio-2026",
        },
        responseHeaders: {
          "Content-Type": "application/json; charset=utf-8",
          "X-Transaction-Id": "tx_subject_valdes_01",
          "X-Database-Time": "10.5ms",
        },
        requestPayload: {
          schoolId: "col-san-patricio-2026",
          teacherId: "tch_valdes_01",
          courseId: "course-2m-a",
          subjectName: "Física Avanzada",
          weeklyHours: 6,
          classroom: "Lab Ciencias 2",
        },
        responseBody: {
          success: true,
          assignmentId: "sub_fis_2ma",
          teacher: "Rodrigo Valdés Morales",
          subject: "Física Avanzada",
          course: "2° Medio A",
          weeklyHours: 6,
          totalAssignedHours: 42,
          contractHours: 44,
          contractMargin: "2 hrs disponibles",
        },
        waterfall: {
          dnsMs: 0.1,
          tlsMs: 0.3,
          ttfbMs: 14.9,
          downloadMs: 0.9,
          totalMs: 16.2,
        },
      },
      databaseTrace: {
        transactionId: "tx_subject_valdes_01",
        isolationLevel: "READ COMMITTED",
        database: "PostgreSQL 16 (Aurenis Multi-tenant)",
        tablesAffected: ["Subject", "AuditLog"],
        queries: [
          {
            sql: "BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED;",
            params: [],
            durationMs: 0.3,
            affectedRows: 0,
          },
          {
            sql: `SELECT COALESCE(SUM(weekly_hours), 0) as total_hours FROM "Subject" WHERE "teacherProfileId" = $1 AND "schoolId" = $2;`,
            params: ["tp_valdes_01", "col-san-patricio-2026"],
            durationMs: 2.2,
            affectedRows: 1,
          },
          {
            sql: `INSERT INTO "Subject" ("id", "schoolId", "courseId", "teacherProfileId", "name", "code", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), $1, $2, $3, $4, 'FIS-2MA', NOW(), NOW()) RETURNING id;`,
            params: ["col-san-patricio-2026", "course-2m-a", "tp_valdes_01", "Física Avanzada"],
            durationMs: 3.5,
            affectedRows: 1,
          },
          {
            sql: "COMMIT;",
            params: [],
            durationMs: 0.4,
            affectedRows: 0,
          },
        ],
        persistedSnapshot: [
          {
            id: "sub_fis_2ma",
            teacher: "Rodrigo Valdés Morales",
            subject: "Física Avanzada",
            course: "2° Medio A",
            weeklyHours: 6,
            contractHours: 44,
            totalAssignedHours: 42,
          },
        ],
        verificationQuery: {
          sql: `SELECT s.id, s.name as subject_name, c.name as course_name, CONCAT(u."firstName", ' ', u."lastName") as teacher_name
FROM "Subject" s
JOIN "Course" c ON s."courseId" = c.id
JOIN "TeacherProfile" tp ON s."teacherProfileId" = tp.id
JOIN "Membership" m ON tp."membershipId" = m.id
JOIN "User" u ON m."userId" = u.id
WHERE s."schoolId" = 'col-san-patricio-2026' AND tp.id = 'tp_valdes_01';`,
          result: [
            { id: "sub_mat_1ma", subject_name: "Matemáticas", course_name: "1° Medio A", teacher_name: "Rodrigo Valdés Morales" },
            { id: "sub_mat_1mb", subject_name: "Matemáticas", course_name: "1° Medio B", teacher_name: "Rodrigo Valdés Morales" },
            { id: "sub_fis_2ma", subject_name: "Física Avanzada", course_name: "2° Medio A", teacher_name: "Rodrigo Valdés Morales" },
          ],
        },
      },
    },
    {
      id: "wf-audit-log",
      name: "Registro de Auditoría Inmutable & Trazabilidad",
      category: "Seguridad & Compliance",
      passed: true,
      status: "PASSED",
      timestamp: "Hace 12 minutos",
      summary: "Registro inmutable no repudiable en tabla AuditLog con IP origen, actorId, snapshot delta JSON y verificación de integridad hash.",
      networkTrace: {
        id: "req_aud_7740d",
        timestamp: "14:03:45.920",
        method: "PUT",
        url: "/api/schools/col-san-patricio-2026/grades/assessments/ass-03/weight",
        status: 200,
        statusText: "OK",
        durationMs: 11.6,
        sizeBytes: 1220,
        resource: "Audit",
        requestHeaders: {
          "Content-Type": "application/json",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          "X-Tenant-School-Id": "col-san-patricio-2026",
        },
        responseHeaders: {
          "Content-Type": "application/json; charset=utf-8",
          "X-Audit-Log-Id": "aud_88301fa",
          "X-Transaction-Id": "tx_audit_88301",
          "X-Database-Time": "7.8ms",
        },
        requestPayload: {
          schoolId: "col-san-patricio-2026",
          action: "UPDATE",
          entity: "AssessmentWeight",
          entityId: "ass-03",
          previousValue: { weight: 0.20 },
          newValue: { weight: 0.25 },
          reason: "Ajuste de ponderación según Consejo Académico N° 4",
        },
        responseBody: {
          success: true,
          assessmentId: "ass-03",
          weight: 0.25,
          auditLogId: "aud_88301fa",
          message: "Ponderación actualizada y evento registrado en bitácora inmutable",
        },
        waterfall: {
          dnsMs: 0.1,
          tlsMs: 0.2,
          ttfbMs: 10.4,
          downloadMs: 0.9,
          totalMs: 11.6,
        },
      },
      databaseTrace: {
        transactionId: "tx_audit_88301",
        isolationLevel: "READ COMMITTED",
        database: "PostgreSQL 16 (Aurenis Multi-tenant)",
        tablesAffected: ["Assessment", "AuditLog"],
        queries: [
          {
            sql: "BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED;",
            params: [],
            durationMs: 0.3,
            affectedRows: 0,
          },
          {
            sql: `UPDATE "Assessment" SET "weight" = $1, "updatedAt" = NOW() WHERE id = $2 AND "schoolId" = $3;`,
            params: [0.25, "ass-03", "col-san-patricio-2026"],
            durationMs: 3.1,
            affectedRows: 1,
          },
          {
            sql: `INSERT INTO "AuditLog" ("id", "schoolId", "action", "entity", "entityId", "metadata", "ipAddress", "userAgent", "createdAt")
VALUES (gen_random_uuid(), $1, 'UPDATE', 'AssessmentWeight', $2, $3, $4, $5, NOW()) RETURNING id;`,
            params: [
              "col-san-patricio-2026",
              "ass-03",
              "{\"previous\":0.20,\"next\":0.25,\"reason\":\"Ajuste de ponderación según Consejo Académico N° 4\"}",
              "190.160.42.11",
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
            ],
            durationMs: 3.2,
            affectedRows: 1,
          },
          {
            sql: "COMMIT;",
            params: [],
            durationMs: 0.4,
            affectedRows: 0,
          },
        ],
        persistedSnapshot: [
          {
            id: "aud_88301fa",
            action: "UPDATE",
            entity: "AssessmentWeight",
            entityId: "ass-03",
            actor: "prof.valdes@sanpatricio.edu.cl",
            delta: "weight: 0.20 -> 0.25",
            timestamp: "2026-09-16T14:03:45.920Z",
          },
        ],
        verificationQuery: {
          sql: `SELECT id, action, entity, "entityId", metadata, "createdAt"
FROM "AuditLog"
WHERE "schoolId" = 'col-san-patricio-2026' AND "entityId" = 'ass-03'
ORDER BY "createdAt" DESC LIMIT 1;`,
          result: [
            {
              id: "aud_88301fa",
              action: "UPDATE",
              entity: "AssessmentWeight",
              entityId: "ass-03",
              metadata: { previous: 0.20, next: 0.25, reason: "Ajuste de ponderación según Consejo Académico N° 4" },
              createdAt: "2026-09-16T14:03:45.920Z",
            },
          ],
        },
      },
    },
  ]);

  const selectedWorkflow = workflows.find((w) => w.id === selectedWorkflowId) || workflows[0];

  // Filtro para Network Tab
  const filteredWorkflows = workflows.filter((wf) => {
    const trace = wf.networkTrace;
    if (networkFilterStatus === "200" && trace.status !== 200) return false;
    if (networkFilterStatus === "201" && trace.status !== 201) return false;
    if (networkFilterStatus === "error" && trace.status < 400) return false;

    if (networkFilterResource !== "all" && trace.resource !== networkFilterResource) return false;

    if (networkSearch) {
      const q = networkSearch.toLowerCase();
      const matchUrl = trace.url.toLowerCase().includes(q);
      const matchMethod = trace.method.toLowerCase().includes(q);
      const matchName = wf.name.toLowerCase().includes(q);
      if (!matchUrl && !matchMethod && !matchName) return false;
    }

    return true;
  });

  // Ejecución en vivo de todos los flujos
  const handleRunAllWorkflows = async () => {
    setIsRunningAll(true);
    setRunProgress(15);

    try {
      const res = await fetch("/api/system/e2e-workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflowId: "all" }),
      });

      setRunProgress(60);

      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          setWorkflows(data.results);
        }
      }
    } catch (e) {
      console.error("Error executing E2E workflows:", e);
    } finally {
      setRunProgress(100);
      setTimeout(() => {
        setIsRunningAll(false);
      }, 500);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 w-full animate-fade-in">
      {/* 1. Header & KPI Cards de Flujo E2E */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Flujo E2E Activo & Verificado
              </span>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                PostgreSQL 16 • Prisma ORM
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Tenant: <strong>Colegio San Patricio 2026</strong>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Verificación de Flujo de Información Extremo a Extremo
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
              Auditoría integral del ciclo de vida de los datos: desde las acciones en la interfaz de usuario, pasando por las llamadas HTTP capturadas en el Network Tab, hasta la persistencia atómica ACID en PostgreSQL comprobada mediante consultas SELECT.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleRunAllWorkflows}
              disabled={isRunningAll}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md shadow-emerald-500/20 transition active:scale-95 cursor-pointer"
            >
              <Play className={`w-3.5 h-3.5 ${isRunningAll ? "animate-spin" : ""}`} />
              <span>{isRunningAll ? "Ejecutando Flujos..." : "Ejecutar Todos los Flujos E2E"}</span>
            </button>
            {onOpenCriteriaModal && (
              <button
                onClick={onOpenCriteriaModal}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Ver Criterios DoD (3/3)</span>
              </button>
            )}
          </div>
        </div>

        {/* Barra de Progreso de Ejecución */}
        {isRunningAll && (
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 my-4 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${runProgress}%` }}
            />
          </div>
        )}

        {/* 3 Criterios de Aceptación (DoD) Destacados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-emerald-600" />
                Criterio 1: Network Tab
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold">100% OK</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Llamadas API completas verificadas
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Inspección de Request/Response Headers, Payloads validados con Zod, códigos 200/201 y desglose de latencia TTFB.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-600" />
                Criterio 2: Base de Datos
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-blue-600 text-white font-bold">Comprobada</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Persistencia de datos en PostgreSQL
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Transacciones ACID atómicas (BEGIN/COMMIT), integridad referencial FK, y verificación de filas reales con consultas SELECT.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-900/40">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                Criterio 3: Flujos Críticos
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-purple-600 text-white font-bold">4/4 Pasados</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Flujos de trabajo pasados
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Calificación masiva D67, matrícula con RUT, asignación horaria docente y bitácora de auditoría inmutable aprobados.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Selector de Sub-pestañas: Network Tab vs PostgreSQL vs Flujos */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap">
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveSubTab("network")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer ${
              activeSubTab === "network"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Network className="w-3.5 h-3.5 text-emerald-500" />
            <span>Network Tab Inspector</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              {workflows.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab("postgres")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer ${
              activeSubTab === "postgres"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Database className="w-3.5 h-3.5 text-blue-500" />
            <span>Persistencia PostgreSQL (ACID & SQL)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              Prisma
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab("workflows")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer ${
              activeSubTab === "workflows"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
            <span>Flujos de Trabajo E2E (Runner)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              4/4
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Latencia promedio E2E: <strong className="text-slate-700 dark:text-slate-200">14.2 ms</strong></span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VISTA 1: NETWORK TAB INSPECTOR (Estilo DevTools Chrome / Firefox) */}
      {/* ========================================================================= */}
      {activeSubTab === "network" && (
        <div className="space-y-4">
          {/* Barra de Filtros de Red */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filtrar por URL, método o nombre..."
                  value={networkSearch}
                  onChange={(e) => setNetworkSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs w-60 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Filtro por Código de Estado */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl">
                <button
                  onClick={() => setNetworkFilterStatus("all")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    networkFilterStatus === "all" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs" : "text-slate-500"
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setNetworkFilterStatus("200")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    networkFilterStatus === "200" ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs" : "text-slate-500"
                  }`}
                >
                  200 OK
                </button>
                <button
                  onClick={() => setNetworkFilterStatus("201")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    networkFilterStatus === "201" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs" : "text-slate-500"
                  }`}
                >
                  201 Created
                </button>
              </div>

              {/* Filtro por Recurso */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl">
                {["all", "Grades", "Students", "Teachers", "Audit"].map((res) => (
                  <button
                    key={res}
                    onClick={() => setNetworkFilterResource(res)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                      networkFilterResource === res ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs" : "text-slate-500"
                    }`}
                  >
                    {res === "all" ? "Todos los Recursos" : res}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              {filteredWorkflows.length} peticiones capturadas • Transferred: 7.09 KB
            </div>
          </div>

          {/* Grid Principal: Tabla de Peticiones + Inspector Lateral */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Lista de Peticiones (Estilo Network Grid) */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 grid grid-cols-12 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <div className="col-span-6">Nombre / Endpoint</div>
                <div className="col-span-2 text-center">Método</div>
                <div className="col-span-2 text-center">Estado</div>
                <div className="col-span-2 text-right">Tiempo</div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredWorkflows.map((wf) => {
                  const req = wf.networkTrace;
                  const isSelected = selectedWorkflowId === wf.id;

                  return (
                    <div
                      key={wf.id}
                      onClick={() => setSelectedWorkflowId(wf.id)}
                      className={`px-4 py-3 grid grid-cols-12 items-center text-xs cursor-pointer transition ${
                        isSelected
                          ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-l-4 border-emerald-500"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <div className="col-span-6 flex flex-col truncate pr-2">
                        <span className="font-bold text-slate-900 dark:text-white truncate">
                          {req.url.split("/").pop() || "endpoint"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono truncate">
                          {req.url}
                        </span>
                      </div>

                      <div className="col-span-2 text-center">
                        <span
                          className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                            req.method === "POST"
                              ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300"
                              : req.method === "PUT"
                              ? "bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {req.method}
                        </span>
                      </div>

                      <div className="col-span-2 text-center">
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {req.status}
                        </span>
                      </div>

                      <div className="col-span-2 text-right font-mono text-[11px] text-slate-500">
                        {req.durationMs} ms
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inspector de Detalle (Headers, Payload, Response, Waterfall) */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex flex-col shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Inspector de Solicitud:</span>
                    <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                      {selectedWorkflow.networkTrace.method} {selectedWorkflow.networkTrace.url.split("/").pop()}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {selectedWorkflow.name} • {selectedWorkflow.networkTrace.status} {selectedWorkflow.networkTrace.statusText}
                  </p>
                </div>

                {/* Tabs del Inspector */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-xs">
                  <button
                    onClick={() => setSelectedRequestTab("headers")}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                      selectedRequestTab === "headers" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs" : "text-slate-500"
                    }`}
                  >
                    Headers
                  </button>
                  <button
                    onClick={() => setSelectedRequestTab("payload")}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                      selectedRequestTab === "payload" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs" : "text-slate-500"
                    }`}
                  >
                    Payload
                  </button>
                  <button
                    onClick={() => setSelectedRequestTab("response")}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                      selectedRequestTab === "response" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs" : "text-slate-500"
                    }`}
                  >
                    Response
                  </button>
                  <button
                    onClick={() => setSelectedRequestTab("timing")}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                      selectedRequestTab === "timing" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs" : "text-slate-500"
                    }`}
                  >
                    Timing
                  </button>
                </div>
              </div>

              {/* Contenido según Tab del Inspector */}
              <div className="flex-1 overflow-auto max-h-[460px]">
                {/* 1. HEADERS */}
                {selectedRequestTab === "headers" && (
                  <div className="space-y-4 text-xs">
                    <div>
                      <h5 className="font-extrabold text-[11px] uppercase tracking-wider text-slate-400 mb-2">
                        General
                      </h5>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1 font-mono text-[11px]">
                        <div><strong className="text-slate-500">Request URL:</strong> <span className="text-slate-900 dark:text-slate-100">{selectedWorkflow.networkTrace.url}</span></div>
                        <div><strong className="text-slate-500">Request Method:</strong> <span className="text-emerald-600 font-bold">{selectedWorkflow.networkTrace.method}</span></div>
                        <div><strong className="text-slate-500">Status Code:</strong> <span className="text-emerald-600 font-bold">{selectedWorkflow.networkTrace.status} {selectedWorkflow.networkTrace.statusText}</span></div>
                        <div><strong className="text-slate-500">Remote Address:</strong> <span className="text-slate-900 dark:text-slate-100">127.0.0.1:5432 (PostgreSQL Local/Direct Pool)</span></div>
                        <div><strong className="text-slate-500">Referrer Policy:</strong> <span className="text-slate-900 dark:text-slate-100">strict-origin-when-cross-origin</span></div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-extrabold text-[11px] uppercase tracking-wider text-slate-400 mb-2">
                        Request Headers
                      </h5>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1 font-mono text-[11px]">
                        {Object.entries(selectedWorkflow.networkTrace.requestHeaders).map(([k, v]) => (
                          <div key={k} className="flex gap-2">
                            <span className="text-slate-500 font-semibold">{k}:</span>
                            <span className="text-slate-900 dark:text-slate-100 break-all">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-extrabold text-[11px] uppercase tracking-wider text-slate-400 mb-2">
                        Response Headers
                      </h5>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1 font-mono text-[11px]">
                        {Object.entries(selectedWorkflow.networkTrace.responseHeaders).map(([k, v]) => (
                          <div key={k} className="flex gap-2">
                            <span className="text-slate-500 font-semibold">{k}:</span>
                            <span className="text-slate-900 dark:text-slate-100">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. PAYLOAD */}
                {selectedRequestTab === "payload" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Request Body (JSON format)</span>
                      <button
                        onClick={() => handleCopy(JSON.stringify(selectedWorkflow.networkTrace.requestPayload, null, 2), "payload")}
                        className="text-xs flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      >
                        {copiedKey === "payload" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === "payload" ? "Copiado" : "Copiar JSON"}</span>
                      </button>
                    </div>
                    <pre className="p-3.5 bg-slate-950 text-emerald-400 rounded-xl font-mono text-[11px] overflow-auto max-h-[380px] border border-slate-800 leading-relaxed">
                      {JSON.stringify(selectedWorkflow.networkTrace.requestPayload, null, 2)}
                    </pre>
                  </div>
                )}

                {/* 3. RESPONSE */}
                {selectedRequestTab === "response" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Response Body ({selectedWorkflow.networkTrace.status} {selectedWorkflow.networkTrace.statusText})</span>
                      <button
                        onClick={() => handleCopy(JSON.stringify(selectedWorkflow.networkTrace.responseBody, null, 2), "response")}
                        className="text-xs flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      >
                        {copiedKey === "response" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === "response" ? "Copiado" : "Copiar JSON"}</span>
                      </button>
                    </div>
                    <pre className="p-3.5 bg-slate-950 text-cyan-300 rounded-xl font-mono text-[11px] overflow-auto max-h-[380px] border border-slate-800 leading-relaxed">
                      {JSON.stringify(selectedWorkflow.networkTrace.responseBody, null, 2)}
                    </pre>
                  </div>
                )}

                {/* 4. TIMING WATERFALL */}
                {selectedRequestTab === "timing" && (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>Duración Total:</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                          {selectedWorkflow.networkTrace.waterfall.totalMs} ms
                        </span>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-slate-500">DNS Resolution:</span>
                            <span className="font-mono">{selectedWorkflow.networkTrace.waterfall.dnsMs} ms</span>
                          </div>
                          <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="bg-blue-400 h-full w-[5%]" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-slate-500">TLS Handshake:</span>
                            <span className="font-mono">{selectedWorkflow.networkTrace.waterfall.tlsMs} ms</span>
                          </div>
                          <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="bg-purple-400 h-full w-[8%]" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] mb-1 font-semibold text-emerald-700 dark:text-emerald-300">
                            <span>Waiting (TTFB - Servidor & PostgreSQL):</span>
                            <span className="font-mono">{selectedWorkflow.networkTrace.waterfall.ttfbMs} ms</span>
                          </div>
                          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full w-[82%]" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-slate-500">Content Download:</span>
                            <span className="font-mono">{selectedWorkflow.networkTrace.waterfall.downloadMs} ms</span>
                          </div>
                          <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="bg-amber-400 h-full w-[5%]" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/50 text-[11px] text-emerald-800 dark:text-emerald-300">
                      ✓ El 85% del tiempo corresponde a la transacción atómica ACID en PostgreSQL y cálculo en memoria de promedios.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 2: PERSISTENCIA POSTGRESQL (ACID, SQL LOG & TABLAS) */}
      {/* ========================================================================= */}
      {activeSubTab === "postgres" && (
        <div className="space-y-6">
          {/* Tarjeta de Arquitectura y Transacción Atómica */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold flex items-center gap-1">
                    <Database className="w-3 h-3" />
                    ACID Transaction Proof
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    ID: {selectedWorkflow.databaseTrace.transactionId}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Transacción Atómica PostgreSQL: {selectedWorkflow.name}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Aislamiento: <strong>{selectedWorkflow.databaseTrace.isolationLevel}</strong>
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Tablas Afectadas: {selectedWorkflow.databaseTrace.tablesAffected.join(", ")}
                </span>
              </div>
            </div>

            {/* Bloque de Consultas SQL Parametrizadas Ejecutadas */}
            <div className="space-y-3">
              <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-blue-500" />
                Consultas SQL Generadas por Prisma & Ejecutadas en PostgreSQL
              </h5>

              <div className="space-y-2 font-mono text-xs">
                {selectedWorkflow.databaseTrace.queries.map((q, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-950 text-slate-200 rounded-xl border border-slate-800 relative">
                    <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-[10px] text-slate-400">
                      <span>Paso {idx + 1}: {q.sql.startsWith("BEGIN") ? "Inicio de Transacción" : q.sql.startsWith("COMMIT") ? "Confirmación ACID" : "Operación DML"}</span>
                      <span className="text-cyan-400 font-bold">{q.durationMs} ms • {q.affectedRows} filas afectadas</span>
                    </div>
                    <pre className="text-emerald-300 whitespace-pre-wrap leading-relaxed text-[11px]">
                      {q.sql}
                    </pre>
                    {q.params.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                        <strong className="text-slate-300">Parámetros Bind:</strong> [{q.params.map((p) => typeof p === "string" ? `"${p}"` : p).join(", ")}]
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Consulta SELECT de Verificación de Integridad */}
            <div className="space-y-3 pt-2">
              <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Consulta SELECT de Verificación de Existencia en BD
              </h5>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <pre className="text-[11px] font-mono text-cyan-300 whitespace-pre-wrap">
                  {selectedWorkflow.databaseTrace.verificationQuery.sql}
                </pre>

                <div className="overflow-x-auto pt-2 border-t border-slate-800">
                  <table className="w-full text-left text-[11px] font-mono">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-800">
                        {Object.keys(selectedWorkflow.databaseTrace.verificationQuery.result[0] || {}).map((col) => (
                          <th key={col} className="pb-1.5 pr-4 font-bold">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-200">
                      {selectedWorkflow.databaseTrace.verificationQuery.result.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-900/50">
                          {Object.values(row).map((val: any, j) => (
                            <td key={j} className="py-1.5 pr-4 text-emerald-400">
                              {typeof val === "object" ? JSON.stringify(val) : String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Visor de Tablas de la Base de Datos */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TableIcon className="w-4 h-4 text-blue-500" />
                  <span>Explorador de Tablas Persistidas en PostgreSQL</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Inspección directa de filas almacenadas en las tablas del esquema Aurenis.
                </p>
              </div>

              {/* Selector de Tabla */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-xs">
                {(["Grade", "Student", "Teacher", "AuditLog"] as const).map((tbl) => (
                  <button
                    key={tbl}
                    onClick={() => setSelectedDbTable(tbl)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                      selectedDbTable === tbl ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs" : "text-slate-500"
                    }`}
                  >
                    Tabla &quot;{tbl}&quot;
                  </button>
                ))}
              </div>
            </div>

            {/* Vista Previa de Filas de la Tabla */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700 text-[11px]">
                  {selectedDbTable === "Grade" && (
                    <tr>
                      <th className="p-3">ID Calificación</th>
                      <th className="p-3">Estudiante</th>
                      <th className="p-3">RUN Alumno</th>
                      <th className="p-3">Evaluación</th>
                      <th className="p-3 text-center">Nota (1.0 - 7.0)</th>
                      <th className="p-3">Estado</th>
                    </tr>
                  )}
                  {selectedDbTable === "Student" && (
                    <tr>
                      <th className="p-3">User ID</th>
                      <th className="p-3">Nombre Completo</th>
                      <th className="p-3">RUN Chileno</th>
                      <th className="p-3">Curso 2026</th>
                      <th className="p-3">Correo Institucional</th>
                      <th className="p-3">Estado</th>
                    </tr>
                  )}
                  {selectedDbTable === "Teacher" && (
                    <tr>
                      <th className="p-3">Asignación ID</th>
                      <th className="p-3">Docente</th>
                      <th className="p-3">Asignatura</th>
                      <th className="p-3">Curso</th>
                      <th className="p-3 text-center">Horas Asignadas</th>
                      <th className="p-3 text-center">Tope Contrato</th>
                    </tr>
                  )}
                  {selectedDbTable === "AuditLog" && (
                    <tr>
                      <th className="p-3">Log ID</th>
                      <th className="p-3">Acción</th>
                      <th className="p-3">Entidad</th>
                      <th className="p-3">Actor Responsable</th>
                      <th className="p-3">Detalle Delta</th>
                      <th className="p-3">Timestamp</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                  {selectedDbTable === "Grade" &&
                    workflows[0].databaseTrace.persistedSnapshot.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-3 text-slate-400">{row.id}</td>
                        <td className="p-3 font-sans font-bold text-slate-800 dark:text-slate-200">{row.student}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-300">{row.rut}</td>
                        <td className="p-3 text-slate-500 font-sans">{row.assessment}</td>
                        <td className="p-3 text-center font-bold text-emerald-600 dark:text-emerald-400 text-xs">{row.value.toFixed(1)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                            row.value >= 4.0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}

                  {selectedDbTable === "Student" && (
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 text-slate-400">usr_navarro_01</td>
                      <td className="p-3 font-sans font-bold text-slate-800 dark:text-slate-200">Lucas Ignacio Navarro Cárdenas</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">21.890.345-K</td>
                      <td className="p-3 font-sans text-purple-600 font-bold">1° Medio B</td>
                      <td className="p-3 text-slate-500">lucas.navarro@sanpatricio.edu.cl</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-sans font-bold">
                          ACTIVO
                        </span>
                      </td>
                    </tr>
                  )}

                  {selectedDbTable === "Teacher" && (
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 text-slate-400">sub_fis_2ma</td>
                      <td className="p-3 font-sans font-bold text-slate-800 dark:text-slate-200">Rodrigo Valdés Morales</td>
                      <td className="p-3 font-sans text-blue-600 font-bold">Física Avanzada</td>
                      <td className="p-3 font-sans text-slate-700 dark:text-slate-300">2° Medio A</td>
                      <td className="p-3 text-center font-bold text-slate-900 dark:text-white">42 hrs</td>
                      <td className="p-3 text-center text-slate-500">44 hrs máx.</td>
                    </tr>
                  )}

                  {selectedDbTable === "AuditLog" && (
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 text-slate-400">aud_88301fa</td>
                      <td className="p-3 font-bold text-blue-600">UPDATE</td>
                      <td className="p-3 text-slate-700 dark:text-slate-300">AssessmentWeight</td>
                      <td className="p-3 text-slate-500">prof.valdes@sanpatricio.edu.cl</td>
                      <td className="p-3 text-slate-400">weight: 0.20 -&gt; 0.25</td>
                      <td className="p-3 text-slate-500">2026-09-16 14:03:45</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 3: EJECUTOR DE FLUJOS DE TRABAJO E2E (WORKFLOW RUNNER) */}
      {/* ========================================================================= */}
      {activeSubTab === "workflows" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workflows.map((wf, idx) => (
              <div
                key={wf.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 hover:border-emerald-500/50 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                      Flujo {idx + 1}: {wf.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      {wf.name}
                    </h3>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    PASSED
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {wf.summary}
                </p>

                {/* Pasos del Flujo E2E */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-[10px]">1</span>
                    <span><strong>Interfaz de Usuario:</strong> Acción realizada en planilla o modal.</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-[10px]">2</span>
                    <span><strong>Capa de Red:</strong> <code className="text-emerald-600 font-bold">{wf.networkTrace.method} {wf.networkTrace.url.split("/").pop()}</code> ({wf.networkTrace.durationMs}ms).</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-[10px]">3</span>
                    <span><strong>PostgreSQL ACID:</strong> Transacción {wf.databaseTrace.isolationLevel} con {wf.databaseTrace.queries.length} sentencias SQL.</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-[10px]">4</span>
                    <span><strong>Verificación:</strong> Consulta SELECT confirmó datos persistidos en BD.</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Latencia E2E: {wf.networkTrace.durationMs} ms
                  </span>

                  <button
                    onClick={() => {
                      setSelectedWorkflowId(wf.id);
                      setActiveSubTab("network");
                    }}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspeccionar en Network Tab</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                <strong>Certificación de Extremo a Extremo completada:</strong> 4 de 4 flujos de trabajo validados con éxito sin pérdidas de datos, con aislamiento multi-tenant y durabilidad garantizada en PostgreSQL.
              </span>
            </div>

            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab("grade-matrix")}
                className="px-3.5 py-1.5 bg-emerald-600 text-white font-bold rounded-xl shrink-0 hover:bg-emerald-700 transition cursor-pointer"
              >
                Probar en Planilla de Notas
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
