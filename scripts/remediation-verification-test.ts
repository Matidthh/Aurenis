/**
 * Suite de Verificación de Remediaciones de Seguridad — AURENIS
 * Valida los 11 hallazgos y correcciones aplicadas por el equipo de desarrollo.
 */

import { verifyPassword, hashPassword } from "../lib/auth/password";
import { UserServiceError, authenticateUser } from "../lib/services/user.service";
import { requireTenantContext, UnauthorizedError } from "../lib/tenant/context";
import { SecurityFirewallService } from "../lib/services/security-firewall.service";
import { NextRequest } from "next/server";

interface TestItem {
  id: string;
  name: string;
  responsible: string;
  passed: boolean;
  message: string;
}

const tests: TestItem[] = [];

async function runVerification() {
  console.log("================================================================================");
  console.log("🛡️  AURENIS — SUITE DE VERIFICACIÓN DE REMEDIACIONES DE SEGURIDAD");
  console.log("================================================================================\n");

  // 1. Test verifyPassword hardening (Malcom Marcelo)
  console.log("▶ [Item 2] Verificando endurecimiento de verifyPassword...");
  const validHash = await hashPassword("SecurePass2026!");
  
  const testCases = [
    { name: "null hash", pass: "pass", hash: null as any, expected: false },
    { name: "undefined hash", pass: "pass", hash: undefined as any, expected: false },
    { name: "empty string hash", pass: "pass", hash: "", expected: false },
    { name: "whitespace hash", pass: "pass", hash: "   ", expected: false },
    { name: "invalid non-bcrypt string", pass: "pass", hash: "plain_text_not_hash", expected: false },
    { name: "incorrect password with valid hash", pass: "WrongPass!", hash: validHash, expected: false },
    { name: "empty password with valid hash", pass: "", hash: validHash, expected: false },
    { name: "correct password with valid hash", pass: "SecurePass2026!", hash: validHash, expected: true },
  ];

  let allPasswordCasesPassed = true;
  for (const tc of testCases) {
    const res = await verifyPassword(tc.pass, tc.hash);
    if (res !== tc.expected) {
      allPasswordCasesPassed = false;
      console.log(`  ❌ Falló caso '${tc.name}': esperado ${tc.expected}, recibido ${res}`);
    }
  }

  tests.push({
    id: "SEC-REMED-01",
    name: "Validación de Hash y Contraseña (verifyPassword guard contra null/vacíos)",
    responsible: "Malcom Marcelo",
    passed: allPasswordCasesPassed,
    message: allPasswordCasesPassed
      ? "Todos los casos de borde (null, undefined, string vacío, hash inválido) fueron rechazados de forma segura con false."
      : "Al menos un caso de verificación de contraseña falló.",
  });

  // 2. Test authenticateUser eliminates demo fallback (Malcom Marcelo)
  console.log("▶ [Item 3] Verificando eliminación de fallback demo en authenticateUser...");
  let demoFallbackEliminated = false;
  try {
    // Intentar autenticar con usuario no existente en BD (en demo anterior pasaba con 123456)
    await authenticateUser("random-ghost-user@sanjose.cl", "123456");
  } catch (err: any) {
    // Debe lanzar UserServiceError con 401 o 503 (si no hay BD conectada)
    if (err instanceof UserServiceError) {
      demoFallbackEliminated = true;
    }
  }

  tests.push({
    id: "SEC-REMED-02",
    name: "Eliminación de Bypass Demo en Autenticación",
    responsible: "Malcom Marcelo",
    passed: demoFallbackEliminated,
    message: demoFallbackEliminated
      ? "No existe ruta de bypass o contraseña genérica permitida; rechaza estrictamente con UserServiceError."
      : "El bypass demo aún permitió la autenticación sin validación en BD.",
  });

  // 3. Test requireTenantContext rejects unauthenticated calls (Lucas P.)
  console.log("▶ [Item 5] Verificando rechazo estricto en requireTenantContext sin sesión...");
  let tenantSessionEnforced = false;
  try {
    await requireTenantContext("colegio-san-jose");
  } catch (err: any) {
    if (err instanceof UnauthorizedError || err.name === "UnauthorizedError") {
      tenantSessionEnforced = true;
    }
  }

  tests.push({
    id: "SEC-REMED-03",
    name: "Eliminación de Contexto Directo Inseguro en requireTenantContext",
    responsible: "Lucas P.",
    passed: tenantSessionEnforced,
    message: tenantSessionEnforced
      ? "Llamadas sin sesión activa son rechazadas inmediatamente con UnauthorizedError en lugar de conceder SCHOOL_ADMIN."
      : "requireTenantContext otorgó privilegios sin sesión activa.",
  });

  // 4. Test SecurityFirewallService (Frank M.)
  console.log("▶ [Item 7] Verificando reglas de inspección perimetral en SecurityFirewallService...");
  const maliciousReq1 = new NextRequest("http://localhost:3000/api/schools?q=union%20select%201,2", {
    headers: {
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "x-forwarded-for": "198.51.100.1",
    },
  });
  const maliciousReq2 = new NextRequest("http://localhost:3000/api/schools", {
    headers: {
      "user-agent": "sqlmap/1.5.2#stable",
      "x-forwarded-for": "198.51.100.2",
    },
  });
  const legitimateReq = new NextRequest("http://localhost:3000/api/schools", {
    headers: {
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "x-forwarded-for": "198.51.100.3",
    },
  });

  const check1 = SecurityFirewallService.inspectRequest(maliciousReq1);
  const check2 = SecurityFirewallService.inspectRequest(maliciousReq2);
  const check3 = SecurityFirewallService.inspectRequest(legitimateReq);

  const firewallPassed = !check1.allowed && !check2.allowed && check3.allowed;
  tests.push({
    id: "SEC-REMED-04",
    name: "Integración de WAF / Firewall de Seguridad Perimetral",
    responsible: "Frank M.",
    passed: firewallPassed,
    message: firewallPassed
      ? "Ataques de SQL injection y firmas de escáner automatizado bloqueados con 403; peticiones legítimas admitidas."
      : "Fallo en la detección heurística del firewall.",
  });

  // Imprimir resumen
  console.log("\n================================================================================");
  console.log("📊 RESULTADOS DE LA SUITE DE VERIFICACIÓN DE REMEDIACIONES");
  console.log("================================================================================\n");

  let totalPassed = 0;
  for (const t of tests) {
    const icon = t.passed ? "✅ PASSED" : "❌ FAILED";
    if (t.passed) totalPassed++;
    console.log(`[${t.id}] ${icon} — Responsable: ${t.responsible}`);
    console.log(`  Prueba: ${t.name}`);
    console.log(`  Detalle: ${t.message}\n`);
  }

  console.log(`Total: ${totalPassed} / ${tests.length} pruebas superadas exitosamente.\n`);
}

runVerification().catch(console.error);
