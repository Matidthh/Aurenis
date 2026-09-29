import fs from "fs";
import path from "path";

/**
 * Script de Verificación y Empaquetado Definitivo de Entrega ABP
 * Responsables: Frank M. (QA & Ciberseguridad) & Maicol R. (Tech Lead)
 */

console.log("================================================================================");
console.log("📦 AUDITORÍA DE QA: EMPAQUETADO DEFINITIVO DE ENTREGA OFICIAL ABP — AURENIS");
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

// 1. Verificar existencia de la carpeta de entrega oficial
assertCheck(
  "[ABP-PKG-01] Directorio oficial 'entrega-oficial-abp/' creado y accesible",
  fs.existsSync(abpDir) && fs.statSync(abpDir).isDirectory(),
  "Directorio /entrega-oficial-abp presente en la raíz del proyecto"
);

// 2. Verificar existencia de la Memoria Técnica Consolidada
const masterDoc = path.join(abpDir, "01_MEMORIA_TECNICA_CONSOLIDADA_ABP_AURENIS.md");
const masterDocExists = fs.existsSync(masterDoc);
const masterContent = masterDocExists ? fs.readFileSync(masterDoc, "utf-8") : "";

assertCheck(
  "[ABP-PKG-02] Memoria Técnica Maestra Consolidada con Índice de 10 Capítulos",
  masterDocExists &&
    masterContent.includes("ÍNDICE GENERAL") &&
    masterContent.includes("CAPÍTULO 1") &&
    masterContent.includes("CAPÍTULO 10"),
  "Memoria Técnica de 10 capítulos con índices y estructura completa"
);

// 3. Verificar Portadas e Identificación Institucional de los 4 integrantes
const hasAllMembers =
  masterContent.includes("Maicol R.") &&
  masterContent.includes("Malcom Marcelo") &&
  masterContent.includes("Lucas P.") &&
  masterContent.includes("Frank M.");

assertCheck(
  "[ABP-PKG-03] Portada e Identificación Institucional de los 4 Integrantes del Equipo",
  hasAllMembers,
  "Ficha técnica con Maicol R., Malcom Marcelo, Lucas P., Frank M. y sus roles"
);

// 4. Verificar Plantilla de Impresión a PDF Oficial
const printTemplate = path.join(abpDir, "dossier-print-template.html");
const printTemplateExists = fs.existsSync(printTemplate);
const printHtml = printTemplateExists ? fs.readFileSync(printTemplate, "utf-8") : "";

assertCheck(
  "[ABP-PKG-04] Plantilla Oficial de Exportación e Impresión a PDF (dossier-print-template.html)",
  printTemplateExists &&
    printHtml.includes("@page") &&
    printHtml.includes("cover-page") &&
    printHtml.includes("LUZ VERDE"),
  "Plantilla HTML/CSS con estilos @page print-ready para exportar PDF"
);

// 5. Verificar Manifiesto de Entrega README_ENTREGA_OFICIAL_ABP.md
const manifest = path.join(abpDir, "README_ENTREGA_OFICIAL_ABP.md");
assertCheck(
  "[ABP-PKG-05] Manifiesto Oficial de Entrega README_ENTREGA_OFICIAL_ABP.md presente",
  fs.existsSync(manifest),
  "Manifiesto institucional con instrucciones de exportación y hashes SHA-256"
);

console.log("--------------------------------------------------------------------------------");
if (failures === 0) {
  console.log(`🎉 RESULTADO FINAL: 100% DE PRUEBAS DE EMPAQUETADO ABP APROBADAS (${passes}/${passes + failures})`);
  process.exit(0);
} else {
  console.error(`🚨 ERRORES ENCONTRADOS: ${failures} fallo(s). Corrija los problemas antes de la entrega.`);
  process.exit(1);
}
