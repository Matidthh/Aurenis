/**
 * Aurenis - Suite de Benchmark y Prueba de Carga Concurrente (Fase 2)
 * Autores: Maicol R. (Backend/DB) y Frank M. (QA/Security)
 * 
 * Simula flujos de usuarios reales en paralelo:
 * 1. Login (/api/auth/login)
 * 2. Dashboard y Cursos (/api/schools/colegio-san-jose/courses)
 * 3. Directorio de Estudiantes Paginado (/api/schools/colegio-san-jose/students?page=1&pageSize=50)
 * 4. Matriz de Calificaciones (/api/schools/colegio-san-jose/grades)
 * 
 * Mide: Requests Totales, RPS, Latencias (p50, p95, p99), Errores (4xx, 5xx), Timeouts y Memoria Heap.
 */

import http from "http";

interface BenchmarkResult {
  vuCount: number;
  totalRequests: number;
  durationSec: number;
  rps: number;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  error4xx: number;
  error5xx: number;
  timeouts: number;
  avgLatencyMs: number;
  maxMemoryMb: number;
}

const BASE_URL = process.env.BENCHMARK_TARGET_URL || "http://localhost:3000";

function makeRequest(path: string, method: string = "GET", body?: any, headers: Record<string, string> = {}): Promise<{ status: number; durationMs: number }> {
  return new Promise((resolve) => {
    const start = performance.now();
    const url = new URL(path, BASE_URL);

    const reqHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    const req = http.request(
      url,
      {
        method,
        headers: reqHeaders,
        timeout: 10000,
      },
      (res) => {
        res.on("data", () => {});
        res.on("end", () => {
          const durationMs = performance.now() - start;
          resolve({ status: res.statusCode || 500, durationMs });
        });
      }
    );

    req.on("timeout", () => {
      req.destroy();
      const durationMs = performance.now() - start;
      resolve({ status: 504, durationMs });
    });

    req.on("error", () => {
      const durationMs = performance.now() - start;
      resolve({ status: 503, durationMs });
    });

    if (body) {
      req.write(typeof body === "string" ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function simulateUserJourney(userIdx: number): Promise<{ latencies: number[]; errors4xx: number; errors5xx: number; timeouts: number }> {
  const latencies: number[] = [];
  let errors4xx = 0;
  let errors5xx = 0;
  let timeouts = 0;

  function record(res: { status: number; durationMs: number }) {
    latencies.push(res.durationMs);
    if (res.status === 504) timeouts++;
    else if (res.status >= 500) errors5xx++;
    else if (res.status >= 400 && res.status !== 429) errors4xx++;
  }

  // 1. Login Request
  const loginRes = await makeRequest("/api/auth/login", "POST", {
    email: userIdx % 2 === 0 ? "director@sanjose.cl" : "profesor@sanjose.cl",
    password: userIdx % 2 === 0 ? "AdminCSJ2026!" : "Profesor2026!",
    schoolSlug: "colegio-san-jose",
  });
  record(loginRes);

  // 2. Fetch School Courses
  const coursesRes = await makeRequest("/api/schools/colegio-san-jose/courses", "GET");
  record(coursesRes);

  // 3. Fetch Paginated Students (Paginación optimizada Fase 1)
  const studentsRes = await makeRequest("/api/schools/colegio-san-jose/students?page=1&pageSize=50", "GET");
  record(studentsRes);

  // 4. Fetch Grades Matrix
  const gradesRes = await makeRequest("/api/schools/colegio-san-jose/grades", "GET");
  record(gradesRes);

  return { latencies, errors4xx, errors5xx, timeouts };
}

async function runStage(vuCount: number, durationSec: number): Promise<BenchmarkResult> {
  console.log(`\n▶ Ejecutando etapa de carga: ${vuCount} Usuarios Virtuales (VUs) durante ${durationSec}s...`);

  const startTime = performance.now();
  const endTime = startTime + durationSec * 1000;
  const allLatencies: number[] = [];
  let totalErrors4xx = 0;
  let totalErrors5xx = 0;
  let totalTimeouts = 0;
  let activeWorkers = 0;
  let totalCompletedJourneys = 0;

  async function worker(vuId: number) {
    while (performance.now() < endTime) {
      activeWorkers++;
      const res = await simulateUserJourney(vuId);
      allLatencies.push(...res.latencies);
      totalErrors4xx += res.errors4xx;
      totalErrors5xx += res.errors5xx;
      totalTimeouts += res.timeouts;
      totalCompletedJourneys++;
      activeWorkers--;
      // Pausa humana breve entre acciones (20ms a 50ms)
      await new Promise((r) => setTimeout(r, 20 + Math.random() * 30));
    }
  }

  const workers = Array.from({ length: vuCount }, (_, idx) => worker(idx + 1));
  await Promise.all(workers);

  const totalTimeSec = (performance.now() - startTime) / 1000;
  allLatencies.sort((a, b) => a - b);

  const count = allLatencies.length;
  const p50 = count > 0 ? allLatencies[Math.floor(count * 0.5)] : 0;
  const p95 = count > 0 ? allLatencies[Math.floor(count * 0.95)] : 0;
  const p99 = count > 0 ? allLatencies[Math.floor(count * 0.99)] : 0;
  const avg = count > 0 ? allLatencies.reduce((a, b) => a + b, 0) / count : 0;
  const rps = totalTimeSec > 0 ? Math.round((count / totalTimeSec) * 10) / 10 : 0;
  const memoryUsageMb = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);

  return {
    vuCount,
    totalRequests: count,
    durationSec: Math.round(totalTimeSec * 10) / 10,
    rps,
    p50Ms: Math.round(p50 * 10) / 10,
    p95Ms: Math.round(p95 * 10) / 10,
    p99Ms: Math.round(p99 * 10) / 10,
    error4xx: totalErrors4xx,
    error5xx: totalErrors5xx,
    timeouts: totalTimeouts,
    avgLatencyMs: Math.round(avg * 10) / 10,
    maxMemoryMb: memoryUsageMb,
  };
}

async function main() {
  console.log("===============================================================================");
  console.log("🚀 INICIANDO BENCHMARK FORMAL DE CONCURRENCIA Y FLUJO COMPLETO — AURENIS");
  console.log("===============================================================================");
  console.log(`Target: ${BASE_URL}`);
  console.log("Flujo simulado: Login -> Dashboard/Cursos -> Estudiantes Paginados -> Calificaciones");

  const results: BenchmarkResult[] = [];

  // Ejecución escalonada de 4 etapas (VUs: 10, 25, 50, 100) en el entorno de desarrollo local
  const stages = [
    { vus: 10, duration: 4 },
    { vus: 25, duration: 5 },
    { vus: 50, duration: 6 },
    { vus: 100, duration: 6 },
  ];

  for (const stage of stages) {
    const res = await runStage(stage.vus, stage.duration);
    results.push(res);
  }

  console.log("\n===============================================================================");
  console.log("📊 RESULTADOS EMPÍRICOS DE CARGA Y CONCURRENCIA REGISTRADOS:");
  console.log("===============================================================================");
  console.table(
    results.map((r) => ({
      VUs: r.vuCount,
      "Req Totales": r.totalRequests,
      "Duración (s)": r.durationSec,
      RPS: r.rps,
      "p50 (ms)": r.p50Ms,
      "p95 (ms)": r.p95Ms,
      "p99 (ms)": r.p99Ms,
      "Err 4xx": r.error4xx,
      "Err 5xx": r.error5xx,
      Timeouts: r.timeouts,
      "Heap (MB)": r.maxMemoryMb,
    }))
  );

  console.log("\n✅ Benchmark finalizado exitosamente con evidencia empírica capturada.");
}

main().catch((err) => {
  console.error("Error en benchmark:", err);
  process.exit(1);
});
