/**
 * SCRIPT DE VALIDACIÓN DE CONFIGURACIÓN DE DESPLIEGUE EN PRODUCCIÓN (CLOUD RUN & CLOUD SQL)
 * Responsable de autoría: Frank M. (QA Lead & Ciberseguridad) | Aprobación: Maicol R. (Tech Lead)
 */

import fs from "fs";
import path from "path";

interface TestCase {
  id: string;
  name: string;
  category: "DOCKER" | "CLOUD_CONFIG" | "DEPLOYMENT_GUIDE" | "SECURITY";
  run: () => { passed: boolean; message: string };
}

const testCases: TestCase[] = [
  {
    id: "CR-01",
    name: "Validación de Dockerfile Multi-Stage y Seguridad No-Root",
    category: "DOCKER",
    run: () => {
      const dockerfilePath = path.join(process.cwd(), "Dockerfile");
      if (!fs.existsSync(dockerfilePath)) {
        return { passed: false, message: "No se encontró el archivo Dockerfile en la raíz." };
      }
      const content = fs.readFileSync(dockerfilePath, "utf-8");
      const hasMultiStage = content.includes("AS deps") && content.includes("AS builder") && content.includes("AS runner");
      const hasNonRootUser = content.includes("USER nextjs") || content.includes("adduser");
      const hasHealthCheck = content.includes("HEALTHCHECK");
      const hasPrismaGenerate = content.includes("prisma generate");

      if (!hasMultiStage) return { passed: false, message: "Dockerfile carece de arquitectura multi-stage." };
      if (!hasNonRootUser) return { passed: false, message: "Dockerfile no define usuario sin privilegios (no-root)." };
      if (!hasHealthCheck) return { passed: false, message: "Dockerfile carece de directiva HEALTHCHECK." };
      if (!hasPrismaGenerate) return { passed: false, message: "Dockerfile no incluye compilación de cliente Prisma." };

      return { passed: true, message: "Dockerfile multi-stage verificado con usuario no-root y healthcheck." };
    },
  },
  {
    id: "CR-02",
    name: "Validación de .dockerignore y Exclusión de Secretos",
    category: "DOCKER",
    run: () => {
      const dockerignorePath = path.join(process.cwd(), ".dockerignore");
      if (!fs.existsSync(dockerignorePath)) {
        return { passed: false, message: "No se encontró el archivo .dockerignore." };
      }
      const content = fs.readFileSync(dockerignorePath, "utf-8");
      const excludesEnv = content.includes(".env");
      const excludesNodeModules = content.includes("node_modules");
      const excludesGit = content.includes(".git");

      if (!excludesEnv || !excludesNodeModules || !excludesGit) {
        return { passed: false, message: ".dockerignore no excluye variables de entorno o dependencias locales." };
      }
      return { passed: true, message: ".dockerignore verificado correctamente." };
    },
  },
  {
    id: "CR-03",
    name: "Validación de Script de Despliegue Automatizado (cloud-run-deploy.sh)",
    category: "CLOUD_CONFIG",
    run: () => {
      const scriptPath = path.join(process.cwd(), "scripts/cloud-run-deploy.sh");
      if (!fs.existsSync(scriptPath)) {
        return { passed: false, message: "No se encontró scripts/cloud-run-deploy.sh." };
      }
      const content = fs.readFileSync(scriptPath, "utf-8");
      const hasCloudSql = content.includes("cloudsql-instances");
      const hasSecrets = content.includes("set-secrets");
      const hasPrismaJob = content.includes("prisma,migrate,deploy") || content.includes("prisma");

      if (!hasCloudSql || !hasSecrets || !hasPrismaJob) {
        return { passed: false, message: "El script de despliegue no contiene integración completa con Cloud SQL y Secret Manager." };
      }
      return { passed: true, message: "Script de despliegue automatizado verificado con soporte Cloud SQL y Jobs." };
    },
  },
  {
    id: "CR-04",
    name: "Validación de Manual de Despliegue en Producción (DoD 3/3)",
    category: "DEPLOYMENT_GUIDE",
    run: () => {
      const manualPath = path.join(process.cwd(), "docs/MANUAL_DESPLIEGUE_CLOUD_RUN_Y_BASE_DATOS_GESTIONADA.md");
      if (!fs.existsSync(manualPath)) {
        return { passed: false, message: "No se encontró docs/MANUAL_DESPLIEGUE_CLOUD_RUN_Y_BASE_DATOS_GESTIONADA.md." };
      }
      const content = fs.readFileSync(manualPath, "utf-8");
      const hasDockerSteps = content.includes("Pasos de Construcción del Contenedor Docker");
      const hasCloudConfig = content.includes("Configuración de Producción en Google Cloud");
      const hasDeployGuide = content.includes("Guía de Despliegue Emitida");
      const hasRollback = content.includes("Rollback");

      if (!hasDockerSteps || !hasCloudConfig || !hasDeployGuide || !hasRollback) {
        return { passed: false, message: "El manual de despliegue no cubre todos los criterios obligatorios de DoD." };
      }
      return { passed: true, message: "Manual de despliegue formal emitido y verificado al 100%." };
    },
  },
];

console.log("================================================================================");
console.log("🛡️ AUDITORÍA DE QA: VERIFICACIÓN DE DESPLIEGUE CLOUD RUN Y POSTGRESQL");
console.log("================================================================================");

let allPassed = true;

for (const tc of testCases) {
  const result = tc.run();
  const icon = result.passed ? "✅ [PASS]" : "❌ [FAIL]";
  console.log(`${icon} [${tc.id}] ${tc.name}`);
  console.log(`       Detalle: ${result.message}`);
  if (!result.passed) {
    allPassed = false;
  }
}

console.log("--------------------------------------------------------------------------------");
if (allPassed) {
  console.log("🎉 RESULTADO FINAL: 100% DE PRUEBAS DE CONFIGURACIÓN DE DESPLIEGUE APROBADAS (4/4)");
  process.exit(0);
} else {
  console.error("⚠️ ERROR: Se encontraron fallas en la verificación de despliegue.");
  process.exit(1);
}
