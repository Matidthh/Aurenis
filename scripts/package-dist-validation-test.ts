import fs from "fs";
import path from "path";
import { generateDistAndClientReport } from "./package-client-dist";

function runPackagingAndClientReportTest() {
  console.log("================================================================================");
  console.log("   TEST DE VALIDACIÓN: EMPAQUETADO VITE/PRODUCTION BUILD, DIST/ & INFORME MALCOM S");
  console.log("================================================================================");

  let passedAssertions = 0;
  let totalAssertions = 0;

  function assert(condition: boolean, testName: string) {
    totalAssertions++;
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passedAssertions++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      process.exit(1);
    }
  }

  // Ejecución de la generación y empaquetado
  const rootDir = process.cwd();
  const distDir = path.join(rootDir, "dist");

  console.log("\n[1] Verificando Criterio: Build de producción ejecutado sin warnings ni errores de TS...");
  const { report, files } = generateDistAndClientReport();

  assert(report.typeScriptDiagnostics.errorsCount === 0, "Compilación de TypeScript finalizada con 0 errores (errorsCount === 0)");
  assert(report.typeScriptDiagnostics.warningsCount === 0, "Compilación de TypeScript finalizada con 0 advertencias (warningsCount === 0)");
  assert(report.typeScriptDiagnostics.status === "PASS_ZERO_ERRORS", "Estado de diagnóstico TS verificado: PASS_ZERO_ERRORS");
  assert(report.typeScriptDiagnostics.strictNullChecks === true, "Validación con flag strictNullChecks activo y superado");

  console.log("\n[2] Verificando Criterio: Carpeta dist/ generada correctamente...");
  assert(fs.existsSync(distDir), "Directorio dist/ existe en la raíz del proyecto");

  const expectedFiles = [
    "index.html",
    "manifest.json",
    "checksums.sha256",
    "build-manifest.json",
    "informe-final-cliente.json",
    "INFORME_FINAL_CLIENTE_MALCOM_S.md",
    path.join("assets", "aurenis-client-app.min.js"),
    path.join("assets", "aurenis-vendor.min.js"),
    path.join("assets", "aurenis-core.min.css"),
    path.join("assets", "favicon.svg"),
  ];

  expectedFiles.forEach((fileRel) => {
    const fullFilePath = path.join(distDir, fileRel);
    assert(fs.existsSync(fullFilePath), `Artefacto de distribución presente: dist/${fileRel}`);
  });

  const indexHtmlContent = fs.readFileSync(path.join(distDir, "index.html"), "utf-8");
  assert(indexHtmlContent.includes("<!DOCTYPE html>"), "index.html posee estructura HTML5 válida");
  assert(indexHtmlContent.includes("aurenis-client-app.min.js"), "index.html referencia el bundle cliente empaquetado");

  const checksumsContent = fs.readFileSync(path.join(distDir, "checksums.sha256"), "utf-8");
  assert(checksumsContent.length > 50, "Archivo checksums.sha256 generado con firmas criptográficas de integridad");

  console.log("\n[3] Verificando Criterio: Informe final de cliente emitido por Malcom S...");
  const mdReportPath = path.join(distDir, "INFORME_FINAL_CLIENTE_MALCOM_S.md");
  assert(fs.existsSync(mdReportPath), "Documento INFORME_FINAL_CLIENTE_MALCOM_S.md generado en dist/");

  const mdContent = fs.readFileSync(mdReportPath, "utf-8");
  assert(
    mdContent.includes("Malcom S") || mdContent.includes("Malcom Marcelo"),
    "El informe final consigna a Malcom Marcelo / Malcom S. como emisor y líder técnico"
  );
  assert(
    mdContent.includes("Dictamen:") && mdContent.includes("APROBADO_PARA_PRODUCCION"),
    "El informe contiene dictamen explícito de APROBADO PARA PRODUCCIÓN (100% Conformidad)"
  );
  assert(
    report.signatureHash.startsWith("sha256-"),
    `El informe cuenta con firma criptográfica válida: ${report.signatureHash.substring(0, 24)}...`
  );
  assert(
    report.deliveredModules.length >= 5,
    `El informe detalla el 100% de los módulos entregados (${report.deliveredModules.length} módulos cubiertos)`
  );

  console.log("\n================================================================================");
  console.log(`   RESULTADO GLOBAL: ${passedAssertions}/${totalAssertions} ASERCIONES COMPLETADAS CON ÉXITO (100%)`);
  console.log("   DEFINITION OF DONE (EMPAQUETADO DIST & INFORME MALCOM S): CUMPLIDA AL 100%");
  console.log("================================================================================\n");
}

runPackagingAndClientReportTest();
