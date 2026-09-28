import { prisma } from "../lib/db/prisma";

/**
 * Script de Mantenimiento y Optimización de Base de Datos
 * Responsable Técnico: Maicol R. (Lead de Arquitectura y Backend)
 */
async function runDbMaintenance() {
  console.log("================================================================================");
  console.log("🔧 [AURENIS OPS] INICIANDO RUTINA DE MANTENIMIENTO DE BASE DE DATOS");
  console.log("================================================================================");
  const start = Date.now();

  try {
    // 1. Verificación del Pool de Conexiones
    console.log("1️⃣ Verificando conectividad y estado del pool Prisma...");
    const ping = await prisma.$queryRaw`SELECT NOW() AS server_time, version() AS version`;
    console.log("   ✅ Conexión establecida con PostgreSQL. Metadata:", ping);

    // 2. Conteo de entidades para análisis de cardinalidad
    console.log("\n2️⃣ Evaluando cardinalidad de entidades para optimización de planes de ejecución...");
    const stats = {
      schools: await prisma.school.count(),
      users: await prisma.user.count(),
      students: await prisma.studentProfile.count(),
      teachers: await prisma.teacherProfile.count(),
      grades: await prisma.grade.count(),
      attendances: await prisma.attendanceRecord.count(),
      auditLogs: await prisma.auditLog.count(),
    };

    console.table(stats);

    // 3. Recomendaciones de VACUUM y ANALYZE
    console.log("\n3️⃣ Evaluando tablas candidatas para VACUUM ANALYZE...");
    if (stats.auditLogs > 10000 || stats.grades > 50000) {
      console.log("   ⚠️ [ALERTA DE VOLUMEN] Se sugiere ejecutar 'VACUUM (VERBOSE, ANALYZE)' en tablas de alto tráfico.");
    } else {
      console.log("   ✅ Los volúmenes actuales se encuentran dentro del rango óptimo de operación.");
    }

    // 4. Verificación de Integridad Referencial Huérfana
    console.log("\n4️⃣ Verificando inexistencia de registros huérfanos...");
    const orphanMemberships = await prisma.membership.findMany({
      where: {
        user: { is: null as any },
      },
    });

    if (orphanMemberships.length === 0) {
      console.log("   ✅ Cero registros huérfanos en membresías.");
    } else {
      console.warn(`   ⚠️ Se encontraron ${orphanMemberships.length} membresías huérfanas.`);
    }

    const elapsed = Date.now() - start;
    console.log("\n================================================================================");
    console.log(`✨ [AURENIS OPS] RUTINA DE MANTENIMIENTO COMPLETADA CON ÉXITO EN ${elapsed}ms.`);
    console.log("================================================================================");
  } catch (error: any) {
    console.error("❌ Error en la rutina de mantenimiento:", error);
    process.exit(1);
  }
}

runDbMaintenance();
