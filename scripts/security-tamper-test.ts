/**
 * Suite de Pruebas de Resiliencia de Seguridad:
 * 1. Modificación y Manipulación de Tokens JWT (Firma, Payload, alg: none, clave falsa)
 * 2. Inyección de roleId / Manipulación de roles en el cuerpo de peticiones
 * 3. Prevención de Escalamiento de Privilegios Vertical y Horizontal
 */

import { SignJWT } from "jose";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "aurenis-default-super-secret-key-at-least-32-characters"
);
const ATTACKER_SECRET = new TextEncoder().encode("attacker-fake-secret-key-at-least-32-chars");

interface SecurityTestResult {
  id: string;
  category: "JWT_TAMPERING" | "ROLE_INJECTION" | "ESCALATION_PREVENTION";
  description: string;
  expectedOutcome: string;
  httpStatusReceived: number;
  passed: boolean;
  details: string;
}

const results: SecurityTestResult[] = [];

async function login(email: string, pass: string): Promise<{ cookie: string; rawCookie: string }> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: pass }),
  });

  if (!res.ok) {
    throw new Error(`Login fallido para ${email}: ${res.status}`);
  }

  const setCookie = res.headers.get("set-cookie") || "";
  const match = setCookie.match(/aurenis_session=([^;]+)/);
  const token = match ? match[1] : "";
  return {
    cookie: `aurenis_session=${token}`,
    rawCookie: token,
  };
}

async function runSecurityTests() {
  console.log("================================================================================");
  console.log("🛡️  AURENIS SECURITY SUITE - AUDITORÍA CONTRA MANIPULACIÓN Y ESCALAMIENTO");
  console.log("================================================================================");
  console.log(`Endpoint Objetivo: ${BASE_URL}`);
  console.log(`Fecha de Ejecución: ${new Date().toISOString()}`);
  console.log("");

  // Obtenemos tokens legítimos de Estudiante y Profesor
  const student = await login("estudiante@sanjose.cl", "Estudiante2026!");
  const teacher = await login("profesor@sanjose.cl", "Profesor2026!");
  const guardian = await login("apoderado@sanjose.cl", "Apoderado2026!");

  // --------------------------------------------------------------------------------
  // BLOQUE 1: MODIFICACIÓN Y ALTERACIÓN DE TOKENS JWT
  // --------------------------------------------------------------------------------
  console.log("--- BLOQUE 1: PRUEBAS DE MANIPULACIÓN DE TOKENS JWT ---");

  // Caso 1.1: Payload alterado con la firma original (Falsificación de firma)
  {
    const parts = student.rawCookie.split(".");
    const decodedPayload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8"));
    // Atacante modifica el payload para otorgarse SuperAdmin y permisos globales
    decodedPayload.isSystemAdmin = true;
    decodedPayload.roleName = "SUPER_ADMIN";
    decodedPayload.permissions = ["*"];
    const forgedPayloadB64 = Buffer.from(JSON.stringify(decodedPayload)).toString("base64url");
    const tamperedJwt = `${parts[0]}.${forgedPayloadB64}.${parts[2]}`;

    const res = await fetch(`${BASE_URL}/api/system/schools`, {
      headers: { Cookie: `aurenis_session=${tamperedJwt}` },
    });
    const body = await res.json();
    const passed = res.status === 401;

    results.push({
      id: "SEC-JWT-001",
      category: "JWT_TAMPERING",
      description: "Modificación de payload JWT con firma original mantenida (firma rota)",
      expectedOutcome: "HTTP 401 Unauthorized (Rechazo inmediato por fallo criptográfico de firma)",
      httpStatusReceived: res.status,
      passed,
      details: body.error || JSON.stringify(body),
    });
    console.log(`[SEC-JWT-001] Payload alterado + firma previa -> ${passed ? "\x1b[32mNEUTRALIZADO (HTTP 401)\x1b[0m" : "\x1b[31mVULNERABLE\x1b[0m"}`);
  }

  // Caso 1.2: Ataque "alg: none" (Bypass de algoritmo)
  {
    const noneHeader = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
    const adminPayload = Buffer.from(
      JSON.stringify({
        sub: "usr_student_demo",
        email: "estudiante@sanjose.cl",
        isSystemAdmin: true,
        roleName: "SUPER_ADMIN",
        permissions: ["*"],
      })
    ).toString("base64url");
    const noneJwt = `${noneHeader}.${adminPayload}.`;

    const res = await fetch(`${BASE_URL}/api/system/schools`, {
      headers: { Cookie: `aurenis_session=${noneJwt}` },
    });
    const body = await res.json();
    const passed = res.status === 401;

    results.push({
      id: "SEC-JWT-002",
      category: "JWT_TAMPERING",
      description: "Ataque alg: none (Token sin firma con claims de SuperAdmin)",
      expectedOutcome: "HTTP 401 Unauthorized (Rechazo de algoritmos no permitidos)",
      httpStatusReceived: res.status,
      passed,
      details: body.error || JSON.stringify(body),
    });
    console.log(`[SEC-JWT-002] Ataque alg: none -> ${passed ? "\x1b[32mNEUTRALIZADO (HTTP 401)\x1b[0m" : "\x1b[31mVULNERABLE\x1b[0m"}`);
  }

  // Caso 1.3: Token firmado con clave secreta de atacante (Falsificación externa)
  {
    const forgedJwt = await new SignJWT({
      sub: "usr_student_demo",
      email: "estudiante@sanjose.cl",
      isSystemAdmin: true,
      roleName: "SUPER_ADMIN",
      permissions: ["*"],
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(ATTACKER_SECRET);

    const res = await fetch(`${BASE_URL}/api/system/schools`, {
      headers: { Cookie: `aurenis_session=${forgedJwt}` },
    });
    const body = await res.json();
    const passed = res.status === 401;

    results.push({
      id: "SEC-JWT-003",
      category: "JWT_TAMPERING",
      description: "Token firmado con clave simétrica secreta arbitraria (Clave no coincidente)",
      expectedOutcome: "HTTP 401 Unauthorized (Firma con clave no autorizada rechazada)",
      httpStatusReceived: res.status,
      passed,
      details: body.error || JSON.stringify(body),
    });
    console.log(`[SEC-JWT-003] Token con clave falsa de atacante -> ${passed ? "\x1b[32mNEUTRALIZADO (HTTP 401)\x1b[0m" : "\x1b[31mVULNERABLE\x1b[0m"}`);
  }

  // Caso 1.4: Token con expiración vencida
  {
    const expiredJwt = await new SignJWT({
      sub: "usr_student_demo",
      email: "estudiante@sanjose.cl",
      isSystemAdmin: false,
      roleName: "STUDENT",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt(Math.floor(Date.now() / 1000) - 3600 * 24)
      .setExpirationTime(Math.floor(Date.now() / 1000) - 3600) // Expiró hace 1 hora
      .sign(JWT_SECRET);

    const res = await fetch(`${BASE_URL}/api/schools/sch_sanjose_demo/courses`, {
      headers: { Cookie: `aurenis_session=${expiredJwt}` },
    });
    const body = await res.json();
    const passed = res.status === 401;

    results.push({
      id: "SEC-JWT-004",
      category: "JWT_TAMPERING",
      description: "Token legítimo pero expirado en tiempo",
      expectedOutcome: "HTTP 401 Unauthorized (Expiración de token validada)",
      httpStatusReceived: res.status,
      passed,
      details: body.error || JSON.stringify(body),
    });
    console.log(`[SEC-JWT-004] Token expirado en tiempo -> ${passed ? "\x1b[32mNEUTRALIZADO (HTTP 401)\x1b[0m" : "\x1b[31mVULNERABLE\x1b[0m"}`);
  }

  // --------------------------------------------------------------------------------
  // BLOQUE 2: INYECCIÓN DE roleId Y PARÁMETROS DE ROL EN EL BACKEND
  // --------------------------------------------------------------------------------
  console.log("\n--- BLOQUE 2: INYECCIÓN DE roleId / MANIPULACIÓN DE ROL EN PAYLOADS ---");

  // Caso 2.1: Docente inyecta roleId y roleName en creación de curso para forzar privilegio
  {
    const res = await fetch(`${BASE_URL}/api/schools/sch_sanjose_demo/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: teacher.cookie,
      },
      body: JSON.stringify({
        name: "Curso Inyectado con roleId de Administrador",
        letter: "A",
        gradeNumber: 2,
        year: 2026,
        educationLevelId: "level-media",
        // Atributos inyectados maliciosamente:
        roleId: "role_admin_demo",
        role: "SCHOOL_ADMIN",
        isSystemAdmin: true,
        permissions: ["academic:courses:manage"],
      }),
    });
    const body = await res.json();
    const passed = res.status === 403;

    results.push({
      id: "SEC-ROLE-001",
      category: "ROLE_INJECTION",
      description: "Docente inyecta roleId='role_admin_demo' en POST /courses",
      expectedOutcome: "HTTP 403 Forbidden (Backend ignora roleId inyectado y verifica membresía en DB)",
      httpStatusReceived: res.status,
      passed,
      details: body.error || JSON.stringify(body),
    });
    console.log(`[SEC-ROLE-001] Inyección de roleId en POST /courses -> ${passed ? "\x1b[32mRECHAZADA (HTTP 403)\x1b[0m" : "\x1b[31mVULNERABLE\x1b[0m"}`);
  }

  // Caso 2.2: Estudiante inyecta roleId y roleName en ingreso de notas
  {
    const res = await fetch(`${BASE_URL}/api/schools/sch_sanjose_demo/grades`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: student.cookie,
      },
      body: JSON.stringify({
        assessmentId: "ass-1",
        studentProfileId: "sp-1",
        value: 7.0,
        // Inyección maliciosa:
        roleId: "role_teacher_demo",
        role: "TEACHER",
        permissions: ["grades:enter", "grades:manage"],
      }),
    });
    const body = await res.json();
    const passed = res.status === 403;

    results.push({
      id: "SEC-ROLE-002",
      category: "ROLE_INJECTION",
      description: "Estudiante inyecta roleId='role_teacher_demo' en POST /grades",
      expectedOutcome: "HTTP 403 Forbidden (Rechazo; no se otorgan facultades docentes por payload)",
      httpStatusReceived: res.status,
      passed,
      details: body.error || JSON.stringify(body),
    });
    console.log(`[SEC-ROLE-002] Inyección de roleId en POST /grades -> ${passed ? "\x1b[32mRECHAZADA (HTTP 403)\x1b[0m" : "\x1b[31mVULNERABLE\x1b[0m"}`);
  }

  // Caso 2.3: Apoderado inyecta roleId en modificación de configuración del colegio
  {
    const res = await fetch(`${BASE_URL}/api/schools/sch_sanjose_demo/settings`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: guardian.cookie,
      },
      body: JSON.stringify({
        minPassingGrade: 1.0,
        // Inyección maliciosa:
        roleId: "role_admin_demo",
        role: "SCHOOL_ADMIN",
        isSystemAdmin: true,
      }),
    });
    const body = await res.json();
    const passed = res.status === 403;

    results.push({
      id: "SEC-ROLE-003",
      category: "ROLE_INJECTION",
      description: "Apoderado inyecta roleId='role_admin_demo' en PATCH /settings",
      expectedOutcome: "HTTP 403 Forbidden (Rechazo de modificación no autorizada)",
      httpStatusReceived: res.status,
      passed,
      details: body.error || JSON.stringify(body),
    });
    console.log(`[SEC-ROLE-003] Inyección de roleId en PATCH /settings -> ${passed ? "\x1b[32mRECHAZADA (HTTP 403)\x1b[0m" : "\x1b[31mVULNERABLE\x1b[0m"}`);
  }

  // Caso 2.4: Intento de inyectar roleId durante cambio de institución activa
  {
    const res = await fetch(`${BASE_URL}/api/auth/select-school`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: student.cookie,
      },
      body: JSON.stringify({
        schoolId: "sch_sanjose_demo",
        // Inyección para intentar conseguir token con rol de Director:
        roleId: "role_admin_demo",
        roleName: "SCHOOL_ADMIN",
        isSystemAdmin: true,
      }),
    });
    const body = await res.json();
    // La petición puede dar éxito 200 porque el estudiante pertenece a sch_sanjose_demo,
    // PERO el token emitido NO debe tener rol SCHOOL_ADMIN ni isSystemAdmin=true.
    const setCookie = res.headers.get("set-cookie") || "";
    const newMatch = setCookie.match(/aurenis_session=([^;]+)/);
    let sessionPristine = false;
    if (newMatch) {
      const parts = newMatch[1].split(".");
      const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8"));
      sessionPristine = payload.roleName === "STUDENT" && payload.isSystemAdmin === false;
    }

    const passed = res.status === 200 && sessionPristine;
    results.push({
      id: "SEC-ROLE-004",
      category: "ROLE_INJECTION",
      description: "Inyección de roleId y roleName en /api/auth/select-school",
      expectedOutcome: "Token emitido mantiene estrictamente el rol real (STUDENT), ignorando parámetros inyectados",
      httpStatusReceived: res.status,
      passed,
      details: sessionPristine ? "Rol en nuevo JWT se preservó como STUDENT (DB authoritative)" : "Fallo de preservación de rol",
    });
    console.log(`[SEC-ROLE-004] Inyección de roleId en select-school -> ${passed ? "\x1b[32mNEUTRALIZADA (Rol DB Preservado)\x1b[0m" : "\x1b[31mVULNERABLE\x1b[0m"}`);
  }

  // --------------------------------------------------------------------------------
  // BLOQUE 3: PREVENCIÓN DE ESCALAMIENTO DE PRIVILEGIOS HORIZONTAL / MULTI-TENANT
  // --------------------------------------------------------------------------------
  console.log("\n--- BLOQUE 3: PREVENCIÓN DE ESCALAMIENTO HORIZONTAL ---");

  // Caso 3.1: Estudiante intenta seleccionar una institución a la que no pertenece
  {
    const res = await fetch(`${BASE_URL}/api/auth/select-school`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: student.cookie,
      },
      body: JSON.stringify({
        schoolId: "school-csm-999", // Colegio ajeno
      }),
    });
    const body = await res.json();
    const passed = res.status === 403;

    results.push({
      id: "SEC-ESC-001",
      category: "ESCALATION_PREVENTION",
      description: "Usuario intenta vincular sesión a colegio ajeno sin membresía",
      expectedOutcome: "HTTP 403 Forbidden (No posees permisos en esta institución)",
      httpStatusReceived: res.status,
      passed,
      details: body.error || JSON.stringify(body),
    });
    console.log(`[SEC-ESC-001] Escalamiento a colegio ajeno sin membresía -> ${passed ? "\x1b[32mBLOQUEADO (HTTP 403)\x1b[0m" : "\x1b[31mVULNERABLE\x1b[0m"}`);
  }

  console.log("\n================================================================================");
  console.log("  RESUMEN DE AUDITORÍA DE SEGURIDAD");
  console.log("================================================================================");
  const total = results.length;
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = total - passedCount;

  console.log(`Total vectores probados: ${total}`);
  console.log(`Pruebas superadas (Neutralizadas/Rechazadas): ${passedCount}`);
  console.log(`Fallos / Vulnerabilidades encontradas: ${failedCount}`);

  if (failedCount > 0) {
    console.log("\x1b[31mRESULTADO: NO CONFORME\x1b[0m");
    process.exit(1);
  } else {
    console.log("\x1b[32mRESULTADO: CONFORME (100% de vectores de ataque mitigados)\x1b[0m");
  }
}

runSecurityTests().catch((err) => {
  console.error("Error ejecutando pruebas de seguridad:", err);
  process.exit(1);
});
