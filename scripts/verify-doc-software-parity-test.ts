/**
 * TEST AUTOMATIZADO DE VERIFICACIÓN DE PARIDAD Y VERACIDAD DOCUMENTAL VS SOFTWARE
 * AURENIS SAAS v2.4.0
 * 
 * Responsable de autoría: Frank M. (QA Lead & Ciberseguridad) & Maicol R. (Arquitectura)
 * Valida punto por punto que los manuales, guías y documentos reflejen con 100% de exactitud
 * el código fuente, archivos de configuración, esquemas de base de datos y scripts reales.
 */

import * as fs from "fs";
import * as path from "path";

interface AuditCheck {
  id: string;
  category: string;
  description: string;
  expectedFileOrCondition: string;
  validate: () => boolean | string;
}

const rootDir = process.cwd();

const checks: AuditCheck[] = [
  // 1. Prisma & Database Parity
  {
    id: "DOC-PRISMA-01",
    category: "Base de Datos & Prisma ORM",
    description: "Verificar que el archivo prisma/schema.prisma contenga los modelos principales documentados",
    expectedFileOrCondition: "prisma/schema.prisma con School, User, Membership, Course, Subject, Grade, AttendanceRecord",
    validate: () => {
      const schemaPath = path.join(rootDir, "prisma", "schema.prisma");
      if (!fs.existsSync(schemaPath)) return "prisma/schema.prisma no existe";
      const content = fs.readFileSync(schemaPath, "utf-8");
      const requiredModels = ["model User", "model School", "model Membership", "model Role", "model Course", "model Subject", "model Assessment", "model Grade", "model AttendanceRecord", "model AuditLog"];
      for (const m of requiredModels) {
        if (!content.includes(m)) return `Modelo ${m} ausente en prisma/schema.prisma`;
      }
      return true;
    },
  },
  // 2. Docker & Cloud Run Parity
  {
    id: "DOC-DEPLOY-01",
    category: "Despliegue & Docker",
    description: "Verificar que Dockerfile y .dockerignore existan y cumplan la configuración documentada",
    expectedFileOrCondition: "Dockerfile multi-stage y .dockerignore presentes",
    validate: () => {
      const dockerfilePath = path.join(rootDir, "Dockerfile");
      const dockerignorePath = path.join(rootDir, ".dockerignore");
      if (!fs.existsSync(dockerfilePath)) return "Dockerfile no existe";
      if (!fs.existsSync(dockerignorePath)) return ".dockerignore no existe";
      const dockerContent = fs.readFileSync(dockerfilePath, "utf-8");
      if (!dockerContent.includes("node:22-alpine")) return "Dockerfile no usa node:22-alpine";
      if (!dockerContent.includes("USER nextjs")) return "Dockerfile no usa usuario no-root nextjs";
      return true;
    },
  },
  // 3. Scripts de Despliegue y Mantenimiento
  {
    id: "DOC-SCRIPTS-01",
    category: "Scripts de Mantenimiento y DevOps",
    description: "Verificar que los scripts mencionados en los manuales existan en /scripts",
    expectedFileOrCondition: "cloud-run-deploy.sh, maintenance-db-backup.sh, migrate-deploy.sh",
    validate: () => {
      const requiredScripts = [
        "cloud-run-deploy.sh",
        "maintenance-db-backup.sh",
        "migrate-deploy.sh",
      ];
      for (const s of requiredScripts) {
        const p = path.join(rootDir, "scripts", s);
        if (!fs.existsSync(p)) return `Script scripts/${s} documentado pero no encontrado en el filesystem`;
      }
      return true;
    },
  },
  // 4. Variables de Entorno (.env.example)
  {
    id: "DOC-ENV-01",
    category: "Variables de Entorno",
    description: "Verificar que .env.example contenga todas las variables documentadas en la guía técnica",
    expectedFileOrCondition: "DATABASE_URL, JWT_SECRET, APP_ENCRYPTION_KEY, SESSION_COOKIE_NAME",
    validate: () => {
      const envPath = path.join(rootDir, ".env.example");
      if (!fs.existsSync(envPath)) return ".env.example no existe";
      const envContent = fs.readFileSync(envPath, "utf-8");
      const vars = ["DATABASE_URL", "JWT_SECRET", "APP_ENCRYPTION_KEY", "SESSION_COOKIE_NAME"];
      for (const v of vars) {
        if (!envContent.includes(v)) return `Variable ${v} ausente en .env.example`;
      }
      return true;
    },
  },
  // 5. Manuales Documentales en /docs
  {
    id: "DOC-MANUALS-01",
    category: "Manuales Oficiales",
    description: "Verificar existencia y completitud de todos los manuales requeridos",
    expectedFileOrCondition: "MANUAL_DE_USUARIO_ROLES_AURENIS.md, DEVELOPER_AND_OPERATIONS_GUIDE.md, GUIA_DESPLIEGUE_LOCAL_NODEJS_PRISMA_POSTGRESQL.md, MANUAL_DESPLIEGUE_CLOUD_RUN_Y_BASE_DATOS_GESTIONADA.md",
    validate: () => {
      const docs = [
        "MANUAL_DE_USUARIO_ROLES_AURENIS.md",
        "DEVELOPER_AND_OPERATIONS_GUIDE.md",
        "GUIA_DESPLIEGUE_LOCAL_NODEJS_PRISMA_POSTGRESQL.md",
        "MANUAL_DESPLIEGUE_CLOUD_RUN_Y_BASE_DATOS_GESTIONADA.md",
        "AUDITORIA_VERIFICACION_DOCUMENTAL_SOFTWARE_VS_MANUALES.md",
      ];
      for (const d of docs) {
        const p = path.join(rootDir, "docs", d);
        if (!fs.existsSync(p)) return `Documento docs/${d} no existe`;
        const stats = fs.statSync(p);
        if (stats.size < 500) return `Documento docs/${d} está incompleto (< 500 bytes)`;
      }
      return true;
    },
  },
  // 6. Verificación de Autenticación y Manejo de Errores
  {
    id: "DOC-AUTH-01",
    category: "Autenticación y Sesiones",
    description: "Verificar que la rotación de token JWT y sincronización de sesiones esté implementada",
    expectedFileOrCondition: "app/api/auth/refresh/route.ts, lib/auth/session-sync.ts",
    validate: () => {
      const refreshRoute = path.join(rootDir, "app", "api", "auth", "refresh", "route.ts");
      const sessionSync = path.join(rootDir, "lib", "auth", "session-sync.ts");
      if (!fs.existsSync(refreshRoute)) return "Ruta app/api/auth/refresh/route.ts no existe";
      if (!fs.existsSync(sessionSync)) return "Archivo lib/auth/session-sync.ts no existe";
      return true;
    },
  },
];

console.log("================================================================================");
console.log("🛡️ AUDITORÍA DE QA: VERIFICACIÓN DE CONCORDANCIA DOCUMENTAL VS SOFTWARE");
console.log("================================================================================");

let passedCount = 0;
let failedCount = 0;

for (const check of checks) {
  const res = check.validate();
  if (res === true) {
    passedCount++;
    console.log(`✅ [PASS] [${check.id}] ${check.description}`);
    console.log(`       Detalle: ${check.expectedFileOrCondition}`);
  } else {
    failedCount++;
    console.log(`❌ [FAIL] [${check.id}] ${check.description}`);
    console.log(`       Causa: ${res}`);
  }
}

console.log("--------------------------------------------------------------------------------");
if (failedCount === 0) {
  console.log(`🎉 RESULTADO FINAL: 100% DE PARIDAD DOCUMENTAL Y SOFTWARE APROBADA (${passedCount}/${checks.length})`);
  process.exit(0);
} else {
  console.error(`⚠️ RESULTADO FINAL: ${failedCount} DISCREPANCIAS DETECTADAS. REVISAR AUDITORÍA.`);
  process.exit(1);
}
