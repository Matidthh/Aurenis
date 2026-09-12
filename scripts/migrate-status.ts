import { execSync } from "child_process";
import fs from "fs";
import path from "path";

/**
 * Aurenis Migration Status Inspector
 * Inspecciona y valida el estado de las migraciones locales en Git frente
 * a la base de datos de destino.
 */

async function main() {
  console.log("================================================================================");
  console.log("🔍 AURENIS MIGRATION STATUS & AUDIT INSPECTOR");
  console.log("================================================================================");

  const migrationsDir = path.join(process.cwd(), "prisma", "migrations");
  
  if (!fs.existsSync(migrationsDir)) {
    console.error("❌ No se encontró el directorio prisma/migrations.");
    process.exit(1);
  }

  // 1. Listar migraciones en Git
  const localMigrations = fs
    .readdirSync(migrationsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .sort();

  console.log(`📁 Migraciones versionadas en Git (${localMigrations.length}):`);
  localMigrations.forEach((m, idx) => {
    const hasSql = fs.existsSync(path.join(migrationsDir, m, "migration.sql"));
    const hasRollback = fs.existsSync(path.join(migrationsDir, m, "rollback.sql"));
    console.log(
      `   ${idx + 1}. [${m}] -> migration.sql: ${hasSql ? "✅" : "❌"} | rollback.sql: ${hasRollback ? "✅" : "❌"}`
    );
  });

  console.log("\n📡 Consultando estado en base de datos remota con 'prisma migrate status'...\n");

  try {
    execSync("npx prisma migrate status", { stdio: "inherit" });
    console.log("\n✅ Auditoría de estado completada sin discrepancias detectadas.");
  } catch (error: any) {
    console.warn("\n⚠️ Nota: prisma migrate status reportó discrepancias o migraciones pendientes.");
  }
}

main().catch((err) => {
  console.error("❌ Error en inspector de estado:", err);
  process.exit(1);
});
