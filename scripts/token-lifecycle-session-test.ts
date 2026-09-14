/**
 * Aurenis Security Suite — Pruebas de Caducidad Temporal de Tokens, Invalidez tras Logout y Prevención de Fijación de Sesión
 * 
 * Criterios de Aceptación:
 * 1. Expiración de token forzada recibiendo 401
 * 2. Token invalidado correctamente al cerrar sesión (Logout)
 * 3. Tokens viejos no reutilizables (Prevención de Fijación de Sesión y Rotación)
 */

import { SignJWT } from "jose";
import { verifySessionToken, signSessionToken } from "../lib/auth/session";
import { isTokenRevoked, revokeToken } from "../lib/auth/token-revocation";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "aurenis-default-super-secret-key-at-least-32-characters"
);

interface TestStep {
  name: string;
  category: "TOKEN_EXPIRATION" | "LOGOUT_INVALIDATION" | "SESSION_FIXATION";
  run: () => Promise<{ passed: boolean; message: string; details?: any }>;
}

async function loginUser(email: string, pass: string): Promise<{ cookie: string; rawToken: string }> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: pass }),
  });

  if (!res.ok) {
    throw new Error(`Login failed for ${email}: ${res.status}`);
  }

  const setCookie = res.headers.get("set-cookie") || "";
  const match = setCookie.match(/aurenis_session=([^;]+)/);
  const rawToken = match ? match[1] : "";
  const cookie = match ? `aurenis_session=${match[1]}` : setCookie.split(";")[0];

  return { cookie, rawToken };
}

const tests: TestStep[] = [
  // =========================================================================
  // CRITERIO 1: Expiración de token forzada recibiendo 401
  // =========================================================================
  {
    name: "EXP-01: Token expirado en tiempo (-10s) rechazado por verifySessionToken",
    category: "TOKEN_EXPIRATION",
    run: async () => {
      const expiredToken = await new SignJWT({
        sub: "usr_exp_001",
        email: "director@sanjose.cl",
        firstName: "Roberto",
        lastName: "Gómez",
        isSystemAdmin: false,
        schoolId: "sch_sanjose_demo",
        schoolSlug: "colegio-san-jose",
        membershipId: "mem_dir_001",
        roleName: "SCHOOL_ADMIN",
        permissions: ["academic:courses:manage"],
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt(Math.floor(Date.now() / 1000) - 3600)
        .setExpirationTime(Math.floor(Date.now() / 1000) - 10)
        .sign(JWT_SECRET);

      const payload = await verifySessionToken(expiredToken);
      const passed = payload === null;

      return {
        passed,
        message: `Token expirado verificado con resultado null: ${passed}`,
      };
    },
  },
  {
    name: "EXP-02: Endpoint de API retorna HTTP 401 Unauthorized ante Token Expirado en Bearer",
    category: "TOKEN_EXPIRATION",
    run: async () => {
      const expiredToken = await new SignJWT({
        sub: "usr_exp_002",
        email: "director@sanjose.cl",
        firstName: "Roberto",
        lastName: "Gómez",
        isSystemAdmin: false,
        schoolId: "sch_sanjose_demo",
        schoolSlug: "colegio-san-jose",
        membershipId: "mem_dir_001",
        roleName: "SCHOOL_ADMIN",
        permissions: ["academic:courses:manage"],
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt(Math.floor(Date.now() / 1000) - 7200)
        .setExpirationTime(Math.floor(Date.now() / 1000) - 60)
        .sign(JWT_SECRET);

      const res = await fetch(`${BASE_URL}/api/schools/sch_sanjose_demo/courses`, {
        headers: {
          Authorization: `Bearer ${expiredToken}`,
        },
      });

      const passed = res.status === 401;
      return {
        passed,
        message: `HTTP ${res.status}. Token vencido bloqueado correctamente con 401.`,
      };
    },
  },
  {
    name: "EXP-03: Ruta de Frontend protegida redirige a /login al presentar Cookie de sesión expirada",
    category: "TOKEN_EXPIRATION",
    run: async () => {
      const expiredToken = await new SignJWT({
        sub: "usr_exp_003",
        email: "director@sanjose.cl",
        schoolSlug: "colegio-san-jose",
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt(Math.floor(Date.now() / 1000) - 3600)
        .setExpirationTime(Math.floor(Date.now() / 1000) - 5)
        .sign(JWT_SECRET);

      const res = await fetch(`${BASE_URL}/colegio-san-jose/dashboard`, {
        headers: {
          Cookie: `aurenis_session=${expiredToken}`,
        },
        redirect: "manual",
      });

      const location = res.headers.get("location") || "";
      const isRedirectToLogin = (res.status === 307 || res.status === 302) && location.includes("/login");

      return {
        passed: isRedirectToLogin,
        message: `HTTP ${res.status} -> Redirigido a ${location}`,
      };
    },
  },

  // =========================================================================
  // CRITERIO 2: Token invalidado correctamente al cerrar sesión (Logout)
  // =========================================================================
  {
    name: "LOGOUT-01: Invocación de /api/auth/logout invalida la sesión y bloquea reutilización con HTTP 401",
    category: "LOGOUT_INVALIDATION",
    run: async () => {
      // 1. Iniciar sesión legítima
      const { cookie, rawToken } = await loginUser("director@sanjose.cl", "AdminCSJ2026!");

      // 2. Comprobar que el token es funcional antes de logout
      const beforeRes = await fetch(`${BASE_URL}/api/schools/sch_sanjose_demo/courses`, {
        headers: { Cookie: cookie },
      });
      if (beforeRes.status !== 200) {
        return { passed: false, message: `Fallo previo al logout: HTTP ${beforeRes.status}` };
      }

      // 3. Ejecutar Logout
      const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: { Cookie: cookie, Authorization: `Bearer ${rawToken}` },
      });

      // 4. Intentar reutilizar el token revocado (debe fallar con 401)
      const afterRes = await fetch(`${BASE_URL}/api/schools/sch_sanjose_demo/courses`, {
        headers: { Cookie: cookie, Authorization: `Bearer ${rawToken}` },
      });

      const passed = logoutRes.status === 200 && afterRes.status === 401;

      return {
        passed,
        message: `Logout status: ${logoutRes.status}, Acceso post-logout: HTTP ${afterRes.status} (401 esperado)`,
      };
    },
  },
  {
    name: "LOGOUT-02: Logout vía GET (Redirección navegador) revoca el token y limpia credenciales",
    category: "LOGOUT_INVALIDATION",
    run: async () => {
      const { cookie, rawToken } = await loginUser("profesor@sanjose.cl", "Profesor2026!");

      const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
        method: "GET",
        headers: { Cookie: cookie },
        redirect: "manual",
      });

      const isRedirectToLogin = (logoutRes.status === 307 || logoutRes.status === 302 || logoutRes.status === 308);

      // Reintento con el token capturado
      const reuseRes = await fetch(`${BASE_URL}/api/schools/sch_sanjose_demo/courses`, {
        headers: { Authorization: `Bearer ${rawToken}` },
      });

      const passed = isRedirectToLogin && reuseRes.status === 401;
      return {
        passed,
        message: `Logout GET status: ${logoutRes.status}, Reuso de token bloqueado con HTTP ${reuseRes.status}`,
      };
    },
  },

  // =========================================================================
  // CRITERIO 3: Tokens viejos no reutilizables (Prevención de Fijación de Sesión)
  // =========================================================================
  {
    name: "FIXATION-01: Generación de identificador criptográfico único (JTI) por sesión",
    category: "SESSION_FIXATION",
    run: async () => {
      const payloadBase = {
        sub: "usr_test_fixation",
        email: "test@aurenis.cl",
        firstName: "Test",
        lastName: "User",
        isSystemAdmin: false,
        permissions: [],
      };

      const token1 = await signSessionToken(payloadBase);
      const token2 = await signSessionToken(payloadBase);

      const verified1 = await verifySessionToken(token1);
      const verified2 = await verifySessionToken(token2);

      const tokensAreDifferent = token1 !== token2;
      const jti1 = (verified1 as any)?.jti;
      const jti2 = (verified2 as any)?.jti;
      const jtisAreUnique = Boolean(jti1 && jti2 && jti1 !== jti2);

      return {
        passed: tokensAreDifferent && jtisAreUnique,
        message: `Tokens distintos: ${tokensAreDifferent}, JTIs generados únicos: ${jtisAreUnique} (${jti1} vs ${jti2})`,
      };
    },
  },
  {
    name: "FIXATION-02: Rotación de sesión en selección de colegio con revocación del token previo",
    category: "SESSION_FIXATION",
    run: async () => {
      // Login del director
      const { cookie, rawToken } = await loginUser("director@sanjose.cl", "AdminCSJ2026!");

      // Seleccionar colegio para disparar rotación de sesión
      const selectRes = await fetch(`${BASE_URL}/api/auth/select-school`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie,
        },
        body: JSON.stringify({ schoolId: "sch_sanjose_demo" }),
      });

      if (!selectRes.ok) {
        return { passed: false, message: `Select school falló: HTTP ${selectRes.status}` };
      }

      // El token anterior rawToken debe haber quedado revocado
      const oldTokenReuse = await fetch(`${BASE_URL}/api/schools/sch_sanjose_demo/courses`, {
        headers: { Authorization: `Bearer ${rawToken}` },
      });

      const passed = oldTokenReuse.status === 401;
      return {
        passed,
        message: `Token previo a la rotación bloqueado: HTTP ${oldTokenReuse.status} (401 esperado). Prevención de fijación exitosa.`,
      };
    },
  },
  {
    name: "FIXATION-03: Módulo de revocación: verifySessionToken rechaza inmediatamente tokens revocados",
    category: "SESSION_FIXATION",
    run: async () => {
      const tempToken = await signSessionToken({
        sub: "usr_revoked_direct",
        email: "revoked@aurenis.cl",
        firstName: "Revoked",
        lastName: "User",
        isSystemAdmin: false,
        permissions: [],
      });

      // Antes de revocar: válido
      const beforeRevocation = await verifySessionToken(tempToken);

      // Revocación manual explícita
      revokeToken(tempToken);

      // Después de revocar: debe ser null
      const afterRevocation = await verifySessionToken(tempToken);
      const isRevoked = isTokenRevoked(tempToken);

      const passed = beforeRevocation !== null && afterRevocation === null && isRevoked === true;
      return {
        passed,
        message: `Token antes de revocar válido: ${beforeRevocation !== null}, tras revocar nulo: ${afterRevocation === null}, isTokenRevoked: ${isRevoked}`,
      };
    },
  },
];

async function main() {
  console.log("================================================================================");
  console.log("🔒 AURENIS SECURITY SUITE — CADUCIDAD, LOGOUT Y FIJACIÓN DE SESIÓN");
  console.log("================================================================================\n");

  let passedCount = 0;
  const results: { name: string; category: string; passed: boolean; message: string }[] = [];

  for (let i = 0; i < tests.length; i++) {
    const t = tests[i];
    try {
      const res = await t.run();
      const statusIcon = res.passed ? "✅ PASSED" : "❌ FAILED";
      console.log(`[${i + 1}/${tests.length}] [${t.category}] ${t.name}`);
      console.log(`   ${statusIcon} -> ${res.message}\n`);
      results.push({ name: t.name, category: t.category, passed: res.passed, message: res.message });
      if (res.passed) passedCount++;
    } catch (err: any) {
      console.log(`[${i + 1}/${tests.length}] [${t.category}] ${t.name}`);
      console.log(`   ❌ ERROR INESPERADO -> ${err.message}\n`);
      results.push({ name: t.name, category: t.category, passed: false, message: err.message });
    }
  }

  console.log("================================================================================");
  console.log("📊 RESUMEN DE LA AUDITORÍA DE CICLO DE VIDA DE TOKENS");
  console.log("================================================================================");
  console.log(`Total vectores probados: ${tests.length}`);
  console.log(`Pruebas superadas (Neutralizadas/Validadas): ${passedCount}`);
  console.log(`Fallos / Vulnerabilidades encontradas: ${tests.length - passedCount}`);

  if (passedCount === tests.length) {
    console.log("\n🎉 RESULTADO: CONFORME (100% de pruebas de caducidad, logout y anti-fijación superadas)");
    process.exit(0);
  } else {
    console.log("\n⚠️ RESULTADO: NO CONFORME (Se identificaron fallos en la invalidación de sesiones)");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Error crítico ejecutando suite:", err);
  process.exit(1);
});
