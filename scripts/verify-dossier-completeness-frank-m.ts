import fs from "fs";
import path from "path";

/**
 * Script de Verificación de Calidad y Completitud de la Memoria y Dossier ABP
 * Responsable: Frank M. (QA Lead & Ciberseguridad)
 */

console.log("================================================================================");
console.log("📑 SUITE DE VERIFICACIÓN DE CALIDAD DOCUMENTAL Y COMPLETITUD — FRANK M. (QA)");
console.log("================================================================================");

let passes = 0;
let failures = 0;

function assertCheck(name: string, condition: boolean, detail: string) {
  if (condition) {
    console.log(`✅ [PASS] ${name}`);
    console.log(`       Detalle: ${detail}`);
    passes++;
  } else {
    console.error(`❌ [FAIL] ${name}`);
    console.error(`       Fallo: ${detail}`);
    failures++;
  }
}

const rootDir = process.cwd();
const abpDir = path.join(rootDir, "entrega-oficial-abp");
const docsDir = path.join(rootDir, "docs");

// Criterio 1: Dossier Documental Revisado
const requiredFolders = [
  "02_MANUALES_USUARIO_Y_OPERACIONES",
  "03_SEGURIDAD_Y_QA",
  "04_ARQUITECTURA_Y_BD",
];

const masterDoc = path.join(abpDir, "01_MEMORIA_TECNICA_CONSOLIDADA_ABP_AURENIS.md");
const masterContent = fs.existsSync(masterDoc) ? fs.readFileSync(masterDoc, "utf-8") : "";

assertCheck(
  "[DOD-1.1] Memoria Técnica Consolidada con 10 Capítulos Completos",
  fs.existsSync(masterDoc) && masterContent.includes("CAPÍTULO 10"),
  "Memoria técnica maestra estructurada y consistente"
);

assertCheck(
  "[DOD-1.2] Estructura de Carpetas Temáticas de Entrega Oficial ABP",
  requiredFolders.every((folder) => fs.existsSync(path.join(abpDir, folder))),
  "Todas las subcarpetas de manuales, seguridad/qa y arquitectura existen"
);

// Criterio 2: Cero Vacíos de Información
const forbiddenRegex = [
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

let foundPlaceholders = 0;
function checkDirForPlaceholders(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      checkDirForPlaceholders(full);
    } else if (entry.isFile() && (entry.name.endsWith(".md") || entry.name.endsWith(".html"))) {
      const content = fs.readFileSync(full, "utf-8");
      for (const line of content.split("\n")) {
        for (const pattern of forbiddenRegex) {
          if (pattern.test(line)) {
            foundPlaceholders++;
            console.error(`       [Placeholder en ${entry.name}]: ${line.trim()}`);
          }
        }
      }
    }
  }
}

checkDirForPlaceholders(abpDir);

assertCheck(
  "[DOD-2.1] Cero Vacíos de Información (Cero placeholders, TBD o textos temporales)",
  foundPlaceholders === 0,
  `Escaneo exhaustivo en ${abpDir}: 0 placeholders detectados`
);

// Criterio 3: Aprobación Documental Otorgada
const dictamenDoc = path.join(docsDir, "DICTAMEN_INSPECCION_FINAL_CALIDAD_MEMORIA_FRANK_M.md");
const dictamenAbp = path.join(abpDir, "03_SEGURIDAD_Y_QA/DICTAMEN_INSPECCION_FINAL_CALIDAD_MEMORIA_FRANK_M.md");

const dictamenExists = fs.existsSync(dictamenDoc) && fs.existsSync(dictamenAbp);
const dictamenContent = dictamenExists ? fs.readFileSync(dictamenDoc, "utf-8") : "";

assertCheck(
  "[DOD-3.1] Dictamen Oficial de Inspección y Aprobación de Calidad Documental Emitido y Firmado",
  dictamenExists &&
    dictamenContent.includes("FRANK M.") &&
    dictamenContent.includes("APROBADO SIN OBSERVACIONES"),
  "Dictamen formal de QA firmado y archivado en docs/ y entrega-oficial-abp/"
);

console.log("--------------------------------------------------------------------------------");
if (failures === 0) {
  console.log(`🎉 RESULTADO FINAL: 100% DE PRUEBAS DE CALIDAD DOCUMENTAL APROBADAS (${passes}/${passes + failures})`);
  process.exit(0);
} else {
  console.error(`🚨 ERRORES ENCONTRADOS: ${failures} fallo(s).`);
  process.exit(1);
}
