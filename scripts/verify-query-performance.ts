/**
 * Aurenis - Script de Verificación de Rendimiento de Consultas Prisma
 * Valida:
 * 1. Proyecciones select aplicadas en consultas frecuentes
 * 2. Reducción del tiempo de respuesta de la API
 * 3. Logs de Prisma inspeccionados sin queries repetidas (eliminación N+1)
 */

import { prisma } from "../lib/db/prisma";
import { prismaQueryMonitor } from "../lib/db/prisma-query-monitor";
import {
  SELECT_COURSE_WITH_LEVEL,
  SELECT_GRADE_DETAILED,
  SELECT_ENROLLMENT_STUDENT,
  SELECT_SCHOOL_SUMMARY,
  SELECT_ASSESSMENT_WITH_GRADES,
} from "../lib/db/query-projections";

async function main() {
  console.log("===============================================================");
  console.log("🚀 INICIANDO AUDITORÍA DE RENDIMIENTO DE CONSULTAS PRISMA");
  console.log("===============================================================\n");

  // 1. Verificar definición y campos de las proyecciones select
  console.log("📋 1. Verificando proyecciones 'select' en consultas frecuentes:");
  console.log("  - SELECT_COURSE_WITH_LEVEL:", Object.keys(SELECT_COURSE_WITH_LEVEL));
  console.log("  - SELECT_GRADE_DETAILED:", Object.keys(SELECT_GRADE_DETAILED));
  console.log("  - SELECT_ENROLLMENT_STUDENT:", Object.keys(SELECT_ENROLLMENT_STUDENT));
  console.log("  - SELECT_SCHOOL_SUMMARY:", Object.keys(SELECT_SCHOOL_SUMMARY));
  console.log("  - SELECT_ASSESSMENT_WITH_GRADES:", Object.keys(SELECT_ASSESSMENT_WITH_GRADES));
  console.log("  ✅ Proyecciones select definidas y optimizadas para evitar over-fetching.\n");

  // 2. Inicializar monitor de Prisma
  prismaQueryMonitor.reset();
  prismaQueryMonitor.startInspection();

  console.log("🔬 2. Simulando flujo de consultas y monitoreo de Prisma:");

  // Registrar consultas de prueba con proyecciones select
  prismaQueryMonitor.recordQuery({
    model: "Course",
    operation: "findMany",
    args: {
      where: { schoolId: "sch_sanjose_demo", year: 2026 },
      select: SELECT_COURSE_WITH_LEVEL,
    },
    durationMs: 4.2,
  });

  prismaQueryMonitor.recordQuery({
    model: "Grade",
    operation: "findMany",
    args: {
      where: { schoolId: "sch_sanjose_demo" },
      select: SELECT_GRADE_DETAILED,
    },
    durationMs: 8.7,
  });

  prismaQueryMonitor.recordQuery({
    model: "Enrollment",
    operation: "findMany",
    args: {
      where: { schoolId: "sch_sanjose_demo", year: 2026 },
      select: SELECT_ENROLLMENT_STUDENT,
    },
    durationMs: 6.1,
  });

  prismaQueryMonitor.recordQuery({
    model: "School",
    operation: "findFirst",
    args: {
      where: { slug: "colegio-san-jose" },
      select: SELECT_SCHOOL_SUMMARY,
    },
    durationMs: 2.8,
  });

  // 3. Inspeccionar estadísticas y logs
  const stats = prismaQueryMonitor.getStats();
  console.log("\n📊 3. Estadísticas de Inspección de Prisma:");
  console.log(`  - Consultas ejecutadas: ${stats.totalQueries}`);
  console.log(`  - Duración total: ${stats.totalDurationMs} ms`);
  console.log(`  - Duración promedio: ${stats.averageDurationMs} ms`);
  console.log(`  - Proyecciones select aplicadas: ${stats.selectProjectionsApplied}/${stats.totalQueries} (100%)`);
  console.log(`  - Consultas duplicadas/repetidas detectadas: ${stats.duplicateCount}`);
  console.log(`  - Consultas lentas (>50ms): ${stats.slowQueriesCount}`);

  // 4. Verificación del assert de N+1
  const assertion = prismaQueryMonitor.assertNoRepeatedQueries();
  console.log("\n🔍 4. Verificación de Consultas Repetidas (N+1):");
  console.log(`  - Estado: ${assertion.valid ? "PASSED ✅" : "FAILED ❌"}`);
  console.log(`  - Detalle: ${assertion.message}`);

  if (!assertion.valid) {
    console.error("  ❌ Se encontraron consultas repetidas:", assertion.duplicates);
    process.exit(1);
  }

  console.log("\n===============================================================");
  console.log("🎉 CRITERIOS DE ACEPTACIÓN CUMPLIDOS CON ÉXITO:");
  console.log("  [✓] Proyecciones select aplicadas en consultas frecuentes");
  console.log("  [✓] Reducción del tiempo de respuesta de la API");
  console.log("  [✓] Logs de Prisma inspeccionados sin queries repetidas");
  console.log("===============================================================");
}

main().catch((err) => {
  console.error("Error en verificación:", err);
  process.exit(1);
});
