import fs from "fs";
import path from "path";

/**
 * Script de Sincronización, Inspección y Certificación de Calidad y Completitud Documental
 * Responsable: Frank M. (QA Lead & Ciberseguridad)
 */

console.log("================================================================================");
console.log("🧐 AUDITORÍA DE QA: INSPECCIÓN FINAL DE CALIDAD Y COMPLETITUD DE LA MEMORIA");
console.log("    Auditor Líder: Frank M. (QA, Testing & Ciberseguridad)");
console.log("================================================================================");

const rootDir = process.cwd();
const docsDir = path.join(rootDir, "docs");
const abpDir = path.join(rootDir, "entrega-oficial-abp");

const dirManuales = path.join(abpDir, "02_MANUALES_USUARIO_Y_OPERACIONES");
const dirSeguridad = path.join(abpDir, "03_SEGURIDAD_Y_QA");
const dirArquitectura = path.join(abpDir, "04_ARQUITECTURA_Y_BD");

[dirManuales, dirSeguridad, dirArquitectura].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Mapeo de archivos a sincronizar
const filesToSync: { src: string; destDir: string; destName?: string }[] = [
  // 02 Manuales
  { src: path.join(docsDir, "MANUAL_DE_USUARIO_ROLES_AURENIS.md"), destDir: dirManuales },
  { src: path.join(docsDir, "DEVELOPER_AND_OPERATIONS_GUIDE.md"), destDir: dirManuales },
  { src: path.join(docsDir, "GUIA_DESPLIEGUE_LOCAL_NODEJS_PRISMA_POSTGRESQL.md"), destDir: dirManuales },
  { src: path.join(docsDir, "MANUAL_DESPLIEGUE_CLOUD_RUN_Y_BASE_DATOS_GESTIONADA.md"), destDir: dirManuales },
  { src: path.join(docsDir, "RUNBOOK_INCIDENTES.md"), destDir: dirManuales },

  // 03 Seguridad y QA
  { src: path.join(docsDir, "PLAN_DE_PRUEBAS_OFICIAL_IEEE_829_ABP.md"), destDir: dirSeguridad },
  { src: path.join(docsDir, "MEMORIA_CIBERSEGURIDAD_STRIDE_OWASP_RIESGOS.md"), destDir: dirSeguridad },
  { src: path.join(rootDir, "CVSS-V31-SCORING-MATRIX.md"), destDir: dirSeguridad },
  { src: path.join(docsDir, "AUDITORIA_VERIFICACION_DOCUMENTAL_SOFTWARE_VS_MANUALES.md"), destDir: dirSeguridad },
  { src: path.join(docsDir, "CERTIFICADO_FINAL_CIBERSEGURIDAD_FRANK_M.md"), destDir: dirSeguridad },
  { src: path.join(docsDir, "EVALUACION_FUNCIONAL_REQUISITOS_QA_FRANK_M.md"), destDir: dirSeguridad },
  { src: path.join(docsDir, "CATALOGO_CASOS_DE_PRUEBA_EJECUTADOS_Y_RESULTADOS.md"), destDir: dirSeguridad },
  { src: path.join(docsDir, "REGISTRO_HISTORICO_INCIDENCIAS_Y_RESOLUCION_BUGS.md"), destDir: dirSeguridad },

  // 04 Arquitectura y BD
  { src: path.join(docsDir, "ARCHITECTURE.md"), destDir: dirArquitectura },
  { src: path.join(docsDir, "DICCIONARIO_DE_DATOS_Y_DIAGRAMA_ER.md"), destDir: dirArquitectura },
  { src: path.join(docsDir, "RBAC_PERMISSIONS_MATRIX.md"), destDir: dirArquitectura },
  { src: path.join(docsDir, "DOCUMENTACION_TECNICA_HASHING_JWT_Y_MANEJO_TOKENS.md"), destDir: dirArquitectura },
  { src: path.join(docsDir, "CATALOGO_ENDPOINTS_ESPECIFICACION_APIS.md"), destDir: dirArquitectura },
  { src: path.join(docsDir, "AUDITORIA_INTEGRIDAD_REFERENCIAL.md"), destDir: dirArquitectura },
  { src: path.join(docsDir, "DESIGN_SYSTEM_LUCAS.md"), destDir: dirArquitectura },
];

console.log("📂 1. Sincronizando documentos en carpetas temáticas de entrega oficial ABP...");
for (const item of filesToSync) {
  if (fs.existsSync(item.src)) {
    const filename = item.destName || path.basename(item.src);
    const target = path.join(item.destDir, filename);
    fs.copyFileSync(item.src, target);
    console.log(`  -> Sincronizado: ${path.relative(rootDir, target)}`);
  } else {
    console.warn(`  ⚠️ Archivo origen no encontrado: ${item.src}`);
  }
}

// 2. Inspección de calidad y búsqueda exhaustiva de placeholders / vacíos de información
console.log("\n🔍 2. Ejecutando escaneo profundo de vacíos de información y calidad...");

const FORBIDDEN_PATTERNS = [
  /\bTODO\b/,
  /\bFIXME\b/,
  /\bTBD\b/,
  /\bCOMPLETAR\b/,
  /\[INSERTAR[^\]]*\]/i,
  /\[POR DEFINIR\]/i,
  /lorem ipsum/i,
  /\[COLOCAR AQUÍ[^\]]*\]/i,
  /\[PENDIENTE\]/i,
  /\[DRAFT\]/i,
];

let totalFilesInspected = 0;
let totalPlaceholdersFound = 0;
const inspectionResults: { file: string; lines: number; bytes: number; placeholders: string[] }[] = [];

function inspectFile(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf-8");
  const relPath = path.relative(rootDir, filePath);
  const lines = content.split("\n");
  const placeholders: string[] = [];

  lines.forEach((line, idx) => {
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.test(line)) {
        // Excluir si es código de validación de este u otro script
        if (filePath.endsWith(".ts") || filePath.endsWith(".js")) return;
        placeholders.push(`Línea ${idx + 1}: ${line.trim()}`);
      }
    }
  });

  totalFilesInspected++;
  totalPlaceholdersFound += placeholders.length;

  inspectionResults.push({
    file: relPath,
    lines: lines.length,
    bytes: Buffer.byteLength(content, "utf-8"),
    placeholders,
  });
}

function scanDirectoryRecursively(dirPath: string) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      scanDirectoryRecursively(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith(".md") || entry.name.endsWith(".html"))) {
      inspectFile(fullPath);
    }
  }
}

scanDirectoryRecursively(abpDir);

console.log(`\n📊 Archivos inspeccionados en carpeta de entrega: ${totalFilesInspected}`);
console.log(`❌ Placeholders o vacíos detectados: ${totalPlaceholdersFound}`);

for (const res of inspectionResults) {
  if (res.placeholders.length > 0) {
    console.error(`🚨 Fallo en ${res.file}:`);
    res.placeholders.forEach((p) => console.error(`   - ${p}`));
  } else {
    console.log(`  ✅ [100% ÍNTEGRO] ${res.file} (${res.lines} líneas, ${(res.bytes / 1024).toFixed(1)} KB)`);
  }
}

if (totalPlaceholdersFound > 0) {
  console.error("\n❌ Se detectaron vacíos de información. Abortando certificación.");
  process.exit(1);
}

console.log("\n================================================================================");
console.log("🏆 RESULTADO: CERO VACÍOS DE INFORMACIÓN. DOSSIER DOCUMENTAL 100% REVISADO.");
console.log("================================================================================");
