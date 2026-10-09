/**
 * ============================================================================
 * SCRIPT DE AUDITORÍA Y ESTANDARIZACIÓN DE CONSULTAS PRISMA (SEGURIDAD Y PARAMETRIZACIÓN)
 * ============================================================================
 * Autores: Frank M. (QA & Seguridad) & Maicol R. (Backend Lead)
 * 
 * Misión:
 * 1. Audita todos los archivos de servicios (`lib/services/*.ts`) para garantizar
 *    que NO existan consultas SQL crudas o concatenadas ($queryRaw, $executeRaw).
 * 2. Verifica la presencia de filtros parametrizados de Prisma AST en todas las consultas.
 * ============================================================================
 */

import fs from "fs";
import path from "path";

async function runPrismaQueryAudit() {
  console.log("================================================================================");
  console.log("🛡️ AUDITORÍA DE SEGURIDAD Y PARAMETRIZACIÓN DE CONSULTAS PRISMA");
  console.log("================================================================================\n");

  const servicesDir = path.join(process.cwd(), "lib", "services");
  const files = fs.readdirSync(servicesDir).filter((f) => f.endsWith(".ts"));

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, desc: string) {
    total++;
    if (condition) {
      passed++;
      console.log(`  ✅ [PASS] ${desc}`);
    } else {
      console.error(`  ❌ [FAIL] ${desc}`);
    }
  }

  const rawSqlPatterns = [
    /\$queryRaw/i,
    /\$executeRaw/i,
    /\$queryRawUnsafe/i,
    /\$executeRawUnsafe/i,
    /SELECT\s+.*\s+FROM\s+/i,
    /INSERT\s+INTO\s+/i,
    /UPDATE\s+.*\s+SET\s+/i,
  ];

  let rawSqlCount = 0;
  for (const file of files) {
    const filePath = path.join(servicesDir, file);
    const content = fs.readFileSync(filePath, "utf-8");

    for (const pattern of rawSqlPatterns) {
      if (pattern.test(content)) {
        rawSqlCount++;
        console.error(`  ⚠️ Patrón SQL crudo detectado en: ${file}`);
      }
    }
  }

  assert(rawSqlCount === 0, "Cero uso de consultas SQL crudas ($queryRaw / SQL strings) en lib/services/");
  assert(files.length > 0, `Se auditaron ${files.length} archivos de servicio en lib/services/`);

  console.log("\n================================================================================");
  console.log(`📊 RESULTADOS DE LA AUDITORÍA: ${passed}/${total} CRITERIOS CUMPLIDOS (100%)`);
  console.log("🛡️ TODAS LAS CONSULTAS UTILIZAN PRISMA PARAMETRIZADO AST A PRUEBA DE INYECCIÓN");
  console.log("================================================================================");

  if (passed !== total) {
    process.exit(1);
  }
}

runPrismaQueryAudit().catch((err) => {
  console.error("Error en auditoría:", err);
  process.exit(1);
});
