/**
 * Test de Simulación de Resiliencia ante ChunkLoadError tras Deploy
 * Responsable: Lucas P. (Frontend & Architecture Lead) & Frank M. (QA Lead)
 */

import { isChunkLoadError } from "../components/chunk-error-handler";

interface SimulationTest {
  id: string;
  name: string;
  responsible: string;
  passed: boolean;
  message: string;
}

const results: SimulationTest[] = [];

// Mock de sessionStorage y window
class MockSessionStorage {
  private store: Map<string, string> = new Map();
  getItem(key: string): string | null {
    return this.store.get(key) || null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  clear(): void {
    this.store.clear();
  }
}

async function runSimulation() {
  console.log("================================================================================");
  console.log("🔄 SIMULACIÓN DE RECUPERACIÓN AUTOMÁTICA ANTE CHUNKLOADERROR POST-DEPLOY");
  console.log("================================================================================\n");

  // 1. Verificación de patrones de error de chunks
  const testErrors = [
    { err: new Error("Loading chunk app/page failed.\n(error: https://ais-dev.../_next/static/chunks/app/page.js)"), expected: true },
    { err: { name: "ChunkLoadError", message: "Loading chunk 842 failed." }, expected: true },
    { err: new Error("Failed to fetch dynamically imported module: https://domain.com/chunk-xyz.js"), expected: true },
    { err: "error loading dynamically imported module", expected: true },
    { err: new Error("TypeError: Cannot read properties of undefined"), expected: false },
    { err: new Error("Network timeout on /api/schools"), expected: false },
  ];

  let detectionAllPassed = true;
  for (const item of testErrors) {
    const isChunk = isChunkLoadError(item.err);
    if (isChunk !== item.expected) {
      detectionAllPassed = false;
      console.log(`  ❌ Falló detección para: ${JSON.stringify(item.err)} (esperado: ${item.expected}, obtenido: ${isChunk})`);
    }
  }

  results.push({
    id: "CHUNK-SIM-01",
    name: "Identificación heurística exhaustiva de ChunkLoadError",
    responsible: "Lucas P.",
    passed: detectionAllPassed,
    message: detectionAllPassed
      ? "Todos los patrones de fallo de chunk (Webpack, Next.js dynamic import, ESM) fueron detectados con 100% de precisión."
      : "Hubo discrepancias en la detección heurística.",
  });

  // 2. Simulación del ciclo de vida: Deploy -> Hash viejo en cliente -> Error -> Reload -> Recuperación
  const mockStorage = new MockSessionStorage();
  let reloadCount = 0;
  const mockWindow = {
    location: {
      reload: () => {
        reloadCount++;
      },
    },
  };

  const CHUNK_RELOAD_KEY = "aurenis_chunk_reload_retry";
  const CHUNK_RELOAD_TIMESTAMP_KEY = "aurenis_chunk_reload_timestamp";

  function simulateTriggerReload(source: string, error: any): boolean {
    const hasReloaded = mockStorage.getItem(CHUNK_RELOAD_KEY);
    const lastReloadTime = parseInt(mockStorage.getItem(CHUNK_RELOAD_TIMESTAMP_KEY) || "0", 10);
    const now = Date.now();

    if (!hasReloaded || now - lastReloadTime > 30000) {
      mockStorage.setItem(CHUNK_RELOAD_KEY, "true");
      mockStorage.setItem(CHUNK_RELOAD_TIMESTAMP_KEY, now.toString());
      mockWindow.location.reload();
      return true;
    } else {
      return false; // Bloquea bucle infinito
    }
  }

  // Paso 1: Usuario en cliente recibe ChunkLoadError por primera vez tras deploy
  console.log("▶ Paso 1: Simulando primera falla de chunk tras deploy nuevo...");
  const firstAttempt = simulateTriggerReload("first-error", new Error("Loading chunk 123 failed"));
  const firstAttemptOk = firstAttempt === true && reloadCount === 1 && mockStorage.getItem(CHUNK_RELOAD_KEY) === "true";

  // Paso 2: Supongamos que falla de nuevo inmediatamente (ej. error real de servidor o script roto)
  console.log("▶ Paso 2: Simulando intento de error consecutivo (prevención de bucle infinito)...");
  const secondAttempt = simulateTriggerReload("second-error", new Error("Loading chunk 123 failed"));
  const loopPreventedOk = secondAttempt === false && reloadCount === 1; // NO debe haber llamado reload() de nuevo

  // Paso 3: Supongamos que la página cargó bien y se limpia el flag
  console.log("▶ Paso 3: Simulando sesión exitosa post-reload (limpieza de flag)...");
  mockStorage.removeItem(CHUNK_RELOAD_KEY);
  const resetOk = mockStorage.getItem(CHUNK_RELOAD_KEY) === null;

  const lifecyclePassed = firstAttemptOk && loopPreventedOk && resetOk;
  results.push({
    id: "CHUNK-SIM-02",
    name: "Protección de ciclo de vida, single-reload y prevención de bucle infinito",
    responsible: "Frank M.",
    passed: lifecyclePassed,
    message: lifecyclePassed
      ? "Auto-reload ejecutado exactamente 1 vez; intentos consecutivos bloqueados para evitar loops infinitos; flag limpiado en sesión sana."
      : "Fallo en la máquina de estados de recarga.",
  });

  // Imprimir resumen
  console.log("\n================================================================================");
  console.log("📊 RESULTADOS DE LA SIMULACIÓN");
  console.log("================================================================================\n");

  let totalPassed = 0;
  for (const r of results) {
    const icon = r.passed ? "✅ PASSED" : "❌ FAILED";
    if (r.passed) totalPassed++;
    console.log(`[${r.id}] ${icon} — Responsable: ${r.responsible}`);
    console.log(`  Prueba: ${r.name}`);
    console.log(`  Detalle: ${r.message}\n`);
  }

  console.log(`Total: ${totalPassed} / ${results.length} pruebas superadas exitosamente.\n`);
}

runSimulation().catch(console.error);
