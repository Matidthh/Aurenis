import { execSync } from "child_process";
import fs from "fs";
import path from "path";

/**
 * Aurenis Migration CI Validator
 * Valida la consistencia de archivos en Git, presencia de rollback.sql,
 * integridad del lockfile y sintaxis de schema.prisma.
 */

async function main() {
  console.log("================================================================================");
  console.log("🛡️ AURENIS MIGRATION PIPELINE VALIDATOR (CI/CD GATE)");
  console.log("================================================================================");

  let errors = 0;
  const migrationsDir = path.join(process.cwd(), "prisma", "migrations");
  const lockFile = path.join(migrationsDir, "migration_lock.toml");
  const schemaFile = path.join(process.cwd(), "prisma", "schema.prisma");

  // 1. Validar existencia del schema
  if (!fs.existsSync(schemaFile)) {
    console.error("❌ ERROR: prisma/schema.prisma no existe.");
    errors++;
  } else {
    console.log("✅ prisma/schema.prisma encontrado.");
  }

  // 2. Validar migration_lock.toml
  if (!fs.existsSync(lockFile)) {
    console.error("❌ ERROR: prisma/migrations/migration_lock.toml no existe.");
    errors++;
  } else {
    const lockContent = fs.readFileSync(lockFile, "utf-8");
    if (!lockContent.includes('provider = "postgresql"')) {
      console.error("❌ ERROR: migration_lock.toml no especifica provider = 'postgresql'.");
      errors++;
    } else {
      console.log("✅ migration_lock.toml validado (PostgreSQL).");
    }
  }

  // 3. Validar carpetas de migraciones
  const migrationFolders = fs
    .readdirSync(migrationsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  console.log(`\n🔍 Validando ${migrationFolders.length} migraciones registradas:`);

  for (const folder of migrationFolders) {
    const migrationSql = path.join(migrationsDir, folder, "migration.sql");
    const rollbackSql = path.join(migrationsDir, folder, "rollback.sql");

    const hasMigration = fs.existsSync(migrationSql);
    const hasRollback = fs.existsSync(rollbackSql);

    if (!hasMigration) {
      console.error(`❌ [${folder}] Falta migration.sql.`);
      errors++;
    }
    if (!hasRollback) {
      console.error(`❌ [${folder}] Falta rollback.sql.`);
      errors++;
    }

    if (hasMigration && hasRollback) {
      console.log(`✅ [${folder}] migration.sql y rollback.sql presentes.`);
    }
  }

  // 4. Validar sintaxis con prisma validate
  console.log("\n⚙️ Validando sintaxis de schema con 'npx prisma validate'...");
  try {
    execSync("npx prisma validate", { stdio: "inherit" });
    console.log("✅ Esquema Prisma sintácticamente válido.");
  } catch (valError: any) {
    console.error("❌ Fallo en prisma validate:", valError.message);
    errors++;
  }

  console.log("================================================================================");
  if (errors > 0) {
    console.error(`❌ Validación fallida con ${errors} error(es).`);
    process.exit(1);
  } else {
    console.log("✅ TODAS LAS VALIDACIONES DE MIGRACIÓN PASARON EXITOSAMENTE.");
    console.log("================================================================================");
  }
}

main().catch((err) => {
  console.error("❌ Error en validador de migraciones:", err);
  process.exit(1);
});
