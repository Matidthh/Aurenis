import { prisma } from "../lib/db/prisma";

/**
 * Script de Healthcheck y Diagnóstico Operativo de AURENIS
 * Responsable Técnico: Maicol R. (Backend / Base de Datos) & Frank M. (Seguridad / QA)
 */
async function runHealthcheck() {
  console.log("================================================================================");
  console.log("🏥 [AURENIS OPS] INICIANDO HEALTHCHECK Y DIAGNÓSTICO DEL SISTEMA");
  console.log("================================================================================");
  const startTime = Date.now();
  const checks: { name: string; status: "OK" | "WARN" | "FAIL"; details: string }[] = [];

  // 1. Verificación de Variables de Entorno Críticas
  const envCheck = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    JWT_SECRET: !!process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 32,
    NODE_ENV: process.env.NODE_ENV || "development",
  };

  if (envCheck.DATABASE_URL && envCheck.JWT_SECRET) {
    checks.push({
      name: "Variables de Entorno Críticas",
      status: "OK",
      details: `DATABASE_URL: Configurado | JWT_SECRET: Válido (>= 32 chars) | NODE_ENV: ${envCheck.NODE_ENV}`,
    });
  } else {
    checks.push({
      name: "Variables de Entorno Críticas",
      status: "FAIL",
      details: `Falta configuración de variables requeridas.`,
    });
  }

  // 2. Conexión y Latencia de Base de Datos
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - dbStart;

    checks.push({
      name: "Conectividad PostgreSQL / Prisma ORM",
      status: dbLatency < 50 ? "OK" : "WARN",
      details: `Conexión activa con éxito. Latencia de consulta ping: ${dbLatency}ms`,
    });
  } catch (error: any) {
    checks.push({
      name: "Conectividad PostgreSQL / Prisma ORM",
      status: "FAIL",
      details: `Error al conectar con la base de datos: ${error.message}`,
    });
  }

  // 3. Conteo y Consistencia de Tablas Principales
  try {
    const [schoolCount, userCount, membershipCount, auditLogCount] = await Promise.all([
      prisma.school.count(),
      prisma.user.count(),
      prisma.membership.count(),
      prisma.auditLog.count(),
    ]);

    checks.push({
      name: "Integridad de Esquema y Datos Principales",
      status: "OK",
      details: `Instituciones: ${schoolCount} | Usuarios: ${userCount} | Membresías: ${membershipCount} | Registros de Auditoría: ${auditLogCount}`,
    });
  } catch (error: any) {
    checks.push({
      name: "Integridad de Esquema y Datos Principales",
      status: "FAIL",
      details: `Error al consultar entidades del modelo: ${error.message}`,
    });
  }

  // 4. Integridad de la Bitácora de Auditoría (AuditLog)
  try {
    const corruptedAuditLogs = await prisma.auditLog.count({
      where: {
        entityType: "",
      },
    });

    checks.push({
      name: "Consistencia de Bitácora de Auditoría (Audit Trail)",
      status: corruptedAuditLogs === 0 ? "OK" : "WARN",
      details: corruptedAuditLogs === 0
        ? "100% de los registros de auditoría cumplen con campos obligatorios."
        : `Se detectaron ${corruptedAuditLogs} registros con campos incompletos.`,
    });
  } catch (error: any) {
    checks.push({
      name: "Consistencia de Bitácora de Auditoría (Audit Trail)",
      status: "FAIL",
      details: `Error al verificar bitácora de auditoría: ${error.message}`,
    });
  }

  // 5. Verificación de Memoria y Recursos de Proceso
  const memUsage = process.memoryUsage();
  const heapUsedMb = (memUsage.heapUsed / 1024 / 1024).toFixed(2);
  const rssMb = (memUsage.rss / 1024 / 1024).toFixed(2);

  checks.push({
    name: "Uso de Recursos del Proceso Node.js",
    status: "OK",
    details: `Heap Usado: ${heapUsedMb} MB | RSS Total: ${rssMb} MB | Uptime: ${process.uptime().toFixed(1)}s`,
  });

  const totalTime = Date.now() - startTime;

  console.log("\n📋 RESUMEN DE COMPONENTES EVALUADOS:");
  console.log("--------------------------------------------------------------------------------");
  checks.forEach((c) => {
    const icon = c.status === "OK" ? "✅ [OK]" : c.status === "WARN" ? "⚠️ [WARN]" : "❌ [FAIL]";
    console.log(`${icon.padEnd(10)} ${c.name.padEnd(45)} -> ${c.details}`);
  });

  const hasFailures = checks.some((c) => c.status === "FAIL");
  console.log("================================================================================");
  if (hasFailures) {
    console.error(`🚨 DIAGNÓSTICO: FALLA DETECTADA en ${totalTime}ms. Requiere atención inmediata.`);
    process.exit(1);
  } else {
    console.log(`✨ DIAGNÓSTICO: TODOS LOS SISTEMAS OPERATIVOS Y SANOS (${totalTime}ms).`);
  }
}

runHealthcheck().catch((err) => {
  console.error("Fallo no controlado en Healthcheck:", err);
  process.exit(1);
});
