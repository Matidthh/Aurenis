import { execSync } from "child_process";
import { PrismaClient } from "@prisma/client";

/**
 * Aurenis Enterprise Migration Runner
 * Script automatizado para ejecución segura y reproducible de migraciones en
 * entornos de Desarrollo, Pruebas (Test), Staging y Producción.
 */

interface MigrationDeployOptions {
  env: string;
  seed: boolean;
  dryRun: boolean;
  timeoutMs: number;
}

function parseArgs(): MigrationDeployOptions {
  const args = process.argv.slice(2);
  return {
    env: process.env.NODE_ENV || "development",
    seed: args.includes("--seed"),
    dryRun: args.includes("--dry-run"),
    timeoutMs: 30000,
  };
}

function log(level: "INFO" | "WARN" | "ERROR" | "SUCCESS", message: string) {
  const timestamp = new Date().toISOString();
  const icons = {
    INFO: "ℹ️",
    WARN: "⚠️",
    ERROR: "❌",
    SUCCESS: "✅",
  };
  console.log(`[${timestamp}] ${icons[level]} [${level}] ${message}`);
}

async function verifyDatabaseConnectivity(databaseUrl: string): Promise<boolean> {
  log("INFO", "Verificando conectividad con el motor de base de datos PostgreSQL...");
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

  try {
    const startTime = Date.now();
    await prisma.$queryRawUnsafe("SELECT 1 as health_check;");
    const latency = Date.now() - startTime;
    log("SUCCESS", `Conexión a base de datos establecida exitosamente (${latency}ms).`);
    return true;
  } catch (error: any) {
    log("ERROR", `Fallo de conexión a la base de datos: ${error.message}`);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function verifySchemaHealth(databaseUrl: string): Promise<boolean> {
  log("INFO", "Ejecutando verificaciones de salud e integridad post-migración...");
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

  try {
    // 1. Verificar existencia de tablas críticas del núcleo y módulos empresariales
    const criticalTables = [
      "User",
      "School",
      "SchoolSettings",
      "Role",
      "Permission",
      "SchoolMembership",
      "Course",
      "Subject",
      "Enrollment",
      "Grade",
      "AttendanceRecord",
      "Classroom",
      "AuditLog",
      "ArchivedRecord",
      "Webhook",
    ];

    const result = await prisma.$queryRawUnsafe<{ tablename: string }[]>(
      `SELECT tablename FROM pg_tables WHERE schemaname = 'public';`
    );

    const existingTables = new Set(result.map((row) => row.tablename));
    const missingTables = criticalTables.filter((table) => !existingTables.has(table));

    if (missingTables.length > 0) {
      log("WARN", `Tablas no detectadas en el esquema público: ${missingTables.join(", ")}`);
    } else {
      log("SUCCESS", `Verificación de integridad: Todas las tablas núcleo (${criticalTables.length}) están presentes.`);
    }

    // 2. Comprobar conteo de migraciones aplicadas en la tabla oficial de Prisma
    const migrationRows = await prisma.$queryRawUnsafe<{ id: string; migration_name: string; finished_at: string }[]>(
      `SELECT id, migration_name, finished_at FROM "_prisma_migrations" ORDER BY finished_at DESC;`
    );

    log("INFO", `Total de migraciones registradas en base de datos: ${migrationRows.length}`);
    if (migrationRows.length > 0) {
      log("INFO", `Última migración aplicada: ${migrationRows[0].migration_name}`);
    }

    return true;
  } catch (error: any) {
    log("WARN", `Advertencia en verificación post-migración: ${error.message}`);
    return true; // No abortar si es una primera inicialización
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const options = parseArgs();
  const startTime = Date.now();

  console.log("================================================================================");
  console.log("🚀 AURENIS ENTERPRISE DATABASE MIGRATION PIPELINE");
  console.log(`🌍 Entorno de ejecución: ${options.env.toUpperCase()}`);
  console.log(`🕒 Timestamp: ${new Date().toISOString()}`);
  console.log("================================================================================");

  // 1. Verificación de variables de entorno
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    log("ERROR", "La variable de entorno DATABASE_URL no está definida.");
    process.exit(1);
  }

  // Sanitizar URL para logs
  const sanitizedUrl = databaseUrl.replace(/:([^:@]+)@/, ":****@");
  log("INFO", `Target Database: ${sanitizedUrl}`);

  // 2. Pre-flight check de conectividad
  const isConnected = await verifyDatabaseConnectivity(databaseUrl);
  if (!isConnected) {
    log("ERROR", "No es posible proceder con las migraciones debido a falta de conectividad.");
    process.exit(1);
  }

  // 3. Ejecución de migraciones
  if (options.dryRun) {
    log("WARN", "Modo Dry-Run activado: Se omitirá la aplicación real de migraciones.");
    log("INFO", "Ejecutando 'prisma migrate status' en modo diagnóstico...");
    try {
      execSync("npx prisma migrate status", { stdio: "inherit" });
      log("SUCCESS", "Diagnóstico completado exitosamente.");
    } catch (e: any) {
      log("ERROR", `Error en diagnóstico: ${e.message}`);
      process.exit(1);
    }
    return;
  }

  try {
    log("INFO", "Ejecutando 'prisma migrate deploy' para aplicar migraciones pendientes...");
    execSync("npx prisma migrate deploy", { stdio: "inherit" });
    log("SUCCESS", "Migraciones aplicadas con éxito en la base de datos.");
  } catch (error: any) {
    log("ERROR", `Error crítico al aplicar migraciones con 'prisma migrate deploy': ${error.message}`);
    log("ERROR", "Consulta la guía de rollback en docs/procedimiento-rollback-migraciones.md");
    process.exit(1);
  }

  // 4. Generación de cliente Prisma actualizado
  try {
    log("INFO", "Sincronizando y generando cliente de Prisma (@prisma/client)...");
    execSync("npx prisma generate", { stdio: "inherit" });
    log("SUCCESS", "Cliente Prisma generado correctamente.");
  } catch (error: any) {
    log("WARN", `Advertencia al generar cliente Prisma: ${error.message}`);
  }

  // 5. Post-migration health checks
  await verifySchemaHealth(databaseUrl);

  // 6. Si se solicita sembrado de datos (seed) en entornos de prueba o desarrollo
  if (options.seed || options.env === "test") {
    try {
      log("INFO", "Ejecutando sembrado inicial de datos (prisma db:seed)...");
      execSync("npm run db:seed", { stdio: "inherit" });
      log("SUCCESS", "Datos semilla insertados correctamente.");
    } catch (seedError: any) {
      log("WARN", `Advertencia durante el sembrado de datos: ${seedError.message}`);
    }
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log("================================================================================");
  log("SUCCESS", `Pipeline de migraciones completado exitosamente en ${durationSec}s.`);
  console.log("================================================================================");
}

main().catch((err) => {
  log("ERROR", `Fallo no controlado en el runner de migraciones: ${err.message}`);
  process.exit(1);
});
