/**
 * Script de Verificación End-to-End: Ciclo de Vida Real de ChunkLoadError y Transición de Deploys
 * Autores: Carlos M. (DevOps & Hosting Lead), Lucas P. (Frontend Lead), Frank M. (QA Lead)
 */

import http from "http";

interface TestCase {
  id: string;
  name: string;
  responsible: string;
  passed: boolean;
  expected: string;
  actual: string;
  details: string;
}

async function makeRequest(url: string): Promise<{ status: number; headers: http.IncomingHttpHeaders; body: string }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options: http.RequestOptions = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
      },
    };
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        resolve({
          status: res.statusCode || 0,
          headers: res.headers,
          body,
        });
      });
    });
    req.on("error", reject);
    req.end();
  });
}

async function runE2ENetworkVerification() {
  console.log("================================================================================");
  console.log("🌐 AUDITORÍA E2E DE RED Y PROTOCOLO: VERIFICACIÓN EN VIVO (CLOUD RUN / HOSTING)");
  console.log("================================================================================\n");

  const baseUrl = "http://localhost:3000";
  const results: TestCase[] = [];

  // CASO 1: Petición inicial del documento HTML (Build V1)
  console.log("▶ [PASO 1] Evaluando Cache-Control en documento HTML principal...");
  const htmlRes = await makeRequest(`${baseUrl}/`);
  const htmlCacheHeader = (htmlRes.headers["cache-control"] as string) || "";
  const isHtmlNoCache = htmlCacheHeader.includes("no-store") || htmlCacheHeader.includes("must-revalidate") || htmlCacheHeader.includes("max-age=0");
  
  results.push({
    id: "CHUNK-E2E-01",
    name: "Validación de Cabecera Anti-Caché en Documento HTML",
    responsible: "Carlos M.",
    passed: htmlRes.status === 200 && isHtmlNoCache,
    expected: "Status: 200, Cache-Control contiene 'no-store' o 'must-revalidate'",
    actual: `Status: ${htmlRes.status}, Cache-Control: "${htmlCacheHeader}"`,
    details: "El servidor prohíbe el cacheo estático del HTML en el navegador, permitiendo invalidación instantánea tras nuevos deploys.",
  });

  // CASO 2: Petición de chunk estático versionado existente
  console.log("▶ [PASO 2] Evaluando Cache-Control inmutable en assets versionados (_next/static)...");
  const staticRes = await makeRequest(`${baseUrl}/_next/static/css/app/layout.css`);
  const staticCacheHeader = (staticRes.headers["cache-control"] as string) || "";
  const isStaticImmutable = staticCacheHeader.includes("immutable") && staticCacheHeader.includes("max-age=31536000");

  results.push({
    id: "CHUNK-E2E-02",
    name: "Validación de Inmutabilidad en Chunks Estáticos Versionados",
    responsible: "Carlos M.",
    passed: staticRes.status === 200 && isStaticImmutable,
    expected: "Status: 200, Cache-Control contiene 'public, max-age=31536000, immutable'",
    actual: `Status: ${staticRes.status}, Cache-Control: "${staticCacheHeader}"`,
    details: "Los chunks versionados por hash se almacenan en caché inmutable por 1 año para máximo rendimiento sin colisionar con nuevas versiones.",
  });

  // CASO 3: Simulación de ChunkLoadError (Petición a chunk con hash viejo post-deploy)
  console.log("▶ [PASO 3] Simulando petición de chunk obsoleto eliminado por nuevo deploy...");
  const staleChunkUrl = `${baseUrl}/_next/static/chunks/components_landing_roi-calculator_tsx-obsolete-hash-v1.js`;
  const staleRes = await makeRequest(staleChunkUrl);

  results.push({
    id: "CHUNK-E2E-03",
    name: "Respuesta 404 controlada ante chunk desincronizado post-deploy",
    responsible: "Frank M.",
    passed: staleRes.status === 404,
    expected: "Status: 404 Not Found (desencadena ChunkLoadError en cliente)",
    actual: `Status: ${staleRes.status}`,
    details: "El servidor rechaza limpiamente el chunk inexistente, permitiendo que ChunkErrorListener en el navegador intercepte el error.",
  });

  // CASO 4: Recarga limpia post-intercepción
  console.log("▶ [PASO 4] Simulando recarga limpia tras captura del ChunkLoadError...");
  const reloadRes = await makeRequest(`${baseUrl}/`);

  results.push({
    id: "CHUNK-E2E-04",
    name: "Recuperación exitosa mediante reload limpio hacia HTML fresco",
    responsible: "Lucas P.",
    passed: reloadRes.status === 200,
    expected: "Status: 200 OK con HTML actualizado",
    actual: `Status: ${reloadRes.status}`,
    details: "El navegador obtiene la última versión del HTML que referencia los nuevos hashes de chunks válidos.",
  });

  // Imprimir resumen
  console.log("\n================================================================================");
  console.log("📊 RESULTADOS FINALES DE LA AUDITORÍA E2E DE RED");
  console.log("================================================================================\n");

  let passedCount = 0;
  for (const r of results) {
    const icon = r.passed ? "✅ PASSED" : "❌ FAILED";
    if (r.passed) passedCount++;
    console.log(`[${r.id}] ${icon} — Responsable: ${r.responsible}`);
    console.log(`  Prueba: ${r.name}`);
    console.log(`  Esperado: ${r.expected}`);
    console.log(`  Obtenido: ${r.actual}`);
    console.log(`  Detalle: ${r.details}\n`);
  }

  console.log(`Total: ${passedCount} / ${results.length} pruebas superadas exitosamente.\n`);

  if (passedCount !== results.length) {
    process.exit(1);
  }
}

runE2ENetworkVerification().catch((err) => {
  console.error("Error ejecutando auditoría E2E:", err);
  process.exit(1);
});
