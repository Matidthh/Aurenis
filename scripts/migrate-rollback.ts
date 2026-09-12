import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

/**
 * Aurenis Migration Rollback Engine
 * Ejecuta reversión controlada de migraciones utilizando los scripts rollback.sql
 * y actualiza el estado interno de Prisma en _prisma_migrations.
 */

async function main() {
  const args = process.argv.slice(2);
  const targetIndex = args.indexOf("--target");
  const targetMigration = targetIndex !== -1 ? args[targetIndex + 1] : null;
  const isDryRun = args.includes("--dry-run");

  console.log("================================================================================");
  console.log("⏪ AURENIS MIGRATION ROLLBACK RUNNER");
  console.log(`🕒 Timestamp: ${new Date().toISOString()}`);
  console.log("================================================================================");

  const migrationsDir = path.join(process.cwd(), "prisma", "migrations");
  const migrations = fs
    .readdirSync(migrationsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .sort()
    .reverse(); // Orden descendente para rollback LIFO

  if (migrations.length === 0) {
    console.log("ℹ️ No hay migraciones registradas en el directorio.");
    return;
  }

  const migrationToRollback = targetMigration || migrations[0];
  const rollbackSqlPath = path.join(migrationsDir, migrationToRollback, "rollback.sql");

  if (!fs.existsSync(rollbackSqlPath)) {
    console.error(`❌ No se encontró el script de rollback en: ${rollbackSqlPath}`);
    process.exit(1);
  }

  const rollbackSql = fs.readFileSync(rollbackSqlPath, "utf-8");

  console.log(`🎯 Migración seleccionada para reversión: ${migrationToRollback}`);
  console.log(`📄 Archivo SQL de reversión: ${rollbackSqlPath}`);
  console.log("\n--- Contenido SQL a ejecutar ---");
  console.log(rollbackSql.slice(0, 500) + (rollbackSql.length > 500 ? "\n... [truncado]" : ""));
  console.log("--------------------------------\n");

  if (isDryRun) {
    console.log("🔍 Modo Dry-Run activo. No se aplicaron cambios a la base de datos.");
    return;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL no configurada.");
    process.exit(1);
  }

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

  try {
    console.log("⚙️ Ejecutando script de rollback SQL...");
    // Dividir por sentencias si es necesario o ejecutar raw
    await prisma.$executeRawUnsafe(rollbackSql);
    console.log("✅ Script de rollback ejecutado exitosamente en la base de datos.");

    console.log(`🔄 Marcando migración '${migrationToRollback}' como rolled-back en Prisma...`);
    try {
      execSync(`npx prisma migrate resolve --rolled-back "${migrationToRollback}"`, {
        stdio: "inherit",
      });
      console.log("✅ Estado de Prisma sincronizado.");
    } catch (resolveError: any) {
      console.warn("⚠️ Advertencia al sincronizar con prisma migrate resolve:", resolveError.message);
    }
  } catch (error: any) {
    console.error("❌ Error al ejecutar rollback:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("❌ Error no controlado en rollback:", err);
  process.exit(1);
});
