/**
 * Aurenis - Inspector de Consultas y Telemetría de Rendimiento Prisma
 * Monitorea consultas ejecutadas, detecta duplicados/repeticiones (N+1 queries),
 * mide tiempos de respuesta y verifica la aplicación de proyecciones select.
 */

export interface PrismaQueryLog {
  id: string;
  timestamp: number;
  model?: string;
  operation?: string;
  queryText: string;
  fingerprint: string;
  durationMs: number;
  hasSelectProjection: boolean;
  isDuplicate: boolean;
  count: number;
  meta?: Record<string, unknown>;
}

export interface QueryInspectionStats {
  totalQueries: number;
  totalDurationMs: number;
  averageDurationMs: number;
  duplicateCount: number;
  slowQueriesCount: number;
  selectProjectionsApplied: number;
  repeatedQueriesDetected: boolean;
}

export interface DuplicateQueryGroup {
  fingerprint: string;
  queryText: string;
  count: number;
  totalDurationMs: number;
  occurrences: Array<{ timestamp: number; durationMs: number }>;
}

export class PrismaQueryMonitor {
  private logs: PrismaQueryLog[] = [];
  private isInspecting: boolean = true;
  private queryCountMap: Map<string, number> = new Map();
  private maxLogs: number = 2000;
  private slowQueryThresholdMs: number = 50;

  constructor() {
    this.logs = [];
  }

  /**
   * Genera una huella digital determinista de la consulta para detectar repeticiones
   */
  public generateFingerprint(model?: string, operation?: string, args?: unknown): string {
    if (!model && !operation) {
      if (typeof args === "string") {
        // Normalizar SQL eliminando valores literales para comparar la estructura
        return args.replace(/(\$|\?|\d+|'[^']*')/g, "?").trim();
      }
      return JSON.stringify(args || "").slice(0, 200);
    }

    const argsObj = (args as Record<string, unknown>) || {};
    // Extraer claves de filtro where para identificar consultas estructuralmente idénticas
    const whereKeys = argsObj.where ? Object.keys(argsObj.where as object).sort().join(",") : "none";
    const selectApplied = !!argsObj.select;

    return `${model || "raw"}.${operation || "query"}[where:${whereKeys}][select:${selectApplied}]`;
  }

  /**
   * Registra una consulta ejecutada en Prisma
   */
  public recordQuery(entry: {
    model?: string;
    operation?: string;
    args?: unknown;
    queryText?: string;
    durationMs: number;
    meta?: Record<string, unknown>;
  }): PrismaQueryLog {
    if (!this.isInspecting) {
      return {
        id: "ignored",
        timestamp: Date.now(),
        queryText: "",
        fingerprint: "",
        durationMs: entry.durationMs,
        hasSelectProjection: false,
        isDuplicate: false,
        count: 0,
      };
    }

    const argsObj = (entry.args as Record<string, unknown>) || {};
    const hasSelectProjection = !!argsObj.select;
    const fingerprint = this.generateFingerprint(entry.model, entry.operation, entry.args);
    
    // Contar ocurrencias de esta misma consulta
    const currentCount = (this.queryCountMap.get(fingerprint) || 0) + 1;
    this.queryCountMap.set(fingerprint, currentCount);

    const isDuplicate = currentCount > 1;

    const queryText =
      entry.queryText ||
      `${entry.model || "Db"}.${entry.operation || "execute"}(${JSON.stringify(
        argsObj.where || argsObj.select || {}
      ).slice(0, 150)})`;

    const logItem: PrismaQueryLog = {
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      model: entry.model,
      operation: entry.operation,
      queryText,
      fingerprint,
      durationMs: Math.round(entry.durationMs * 100) / 100,
      hasSelectProjection,
      isDuplicate,
      count: currentCount,
      meta: entry.meta,
    };

    this.logs.push(logItem);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    return logItem;
  }

  /**
   * Obtiene los logs registrados con opciones de filtrado
   */
  public getLogs(filter?: { limit?: number; model?: string; onlyDuplicates?: boolean }): PrismaQueryLog[] {
    let result = [...this.logs];
    if (filter?.model) {
      result = result.filter((l) => l.model?.toLowerCase() === filter.model?.toLowerCase());
    }
    if (filter?.onlyDuplicates) {
      result = result.filter((l) => l.isDuplicate);
    }
    if (filter?.limit && filter.limit > 0) {
      result = result.slice(-filter.limit);
    }
    return result;
  }

  /**
   * Inicia un bloque de inspección limpia
   */
  public startInspection(): void {
    this.logs = [];
    this.queryCountMap.clear();
    this.isInspecting = true;
  }

  /**
   * Detiene la inspección
   */
  public stopInspection(): void {
    this.isInspecting = false;
  }

  /**
   * Limpia los logs acumulados
   */
  public clear(): void {
    this.logs = [];
    this.queryCountMap.clear();
  }

  /**
   * Alias de clear para compatibilidad
   */
  public reset(): void {
    this.clear();
  }

  /**
   * Identifica consultas duplicadas / repetidas (N+1 queries)
   */
  public getDuplicateQueries(): DuplicateQueryGroup[] {
    const groups: Map<string, DuplicateQueryGroup> = new Map();

    for (const log of this.logs) {
      if (!groups.has(log.fingerprint)) {
        groups.set(log.fingerprint, {
          fingerprint: log.fingerprint,
          queryText: log.queryText,
          count: 0,
          totalDurationMs: 0,
          occurrences: [],
        });
      }

      const group = groups.get(log.fingerprint)!;
      group.count += 1;
      group.totalDurationMs += log.durationMs;
      group.occurrences.push({
        timestamp: log.timestamp,
        durationMs: log.durationMs,
      });
    }

    // Filtrar solo las que se ejecutaron más de una vez
    return Array.from(groups.values()).filter((g) => g.count > 1);
  }

  /**
   * Obtiene consultas lentas que superan el umbral establecido
   */
  public getSlowQueries(thresholdMs: number = this.slowQueryThresholdMs): PrismaQueryLog[] {
    return this.logs.filter((log) => log.durationMs > thresholdMs);
  }

  /**
   * Obtiene estadísticas agregadas de la sesión de inspección
   */
  public getStats(): QueryInspectionStats {
    const totalQueries = this.logs.length;
    const totalDurationMs = this.logs.reduce((acc, l) => acc + l.durationMs, 0);
    const averageDurationMs = totalQueries > 0 ? totalDurationMs / totalQueries : 0;
    const duplicates = this.getDuplicateQueries();
    const duplicateCount = duplicates.reduce((acc, d) => acc + (d.count - 1), 0);
    const slowQueriesCount = this.getSlowQueries().length;
    const selectProjectionsApplied = this.logs.filter((l) => l.hasSelectProjection).length;

    return {
      totalQueries,
      totalDurationMs: Math.round(totalDurationMs * 100) / 100,
      averageDurationMs: Math.round(averageDurationMs * 100) / 100,
      duplicateCount,
      slowQueriesCount,
      selectProjectionsApplied,
      repeatedQueriesDetected: duplicateCount > 0,
    };
  }

  /**
   * Ejecuta una función asíncrona dentro de una traza aislada y devuelve resultados y logs
   */
  public async runWithQueryTracing<T>(
    operationName: string,
    fn: () => Promise<T>
  ): Promise<{
    result: T;
    stats: QueryInspectionStats;
    queries: PrismaQueryLog[];
    duplicateQueries: DuplicateQueryGroup[];
  }> {
    const previousLogs = [...this.logs];
    const previousMap = new Map(this.queryCountMap);

    this.startInspection();
    const startTime = performance.now();

    try {
      const result = await fn();
      const stats = this.getStats();
      const queries = this.getLogs();
      const duplicateQueries = this.getDuplicateQueries();

      return {
        result,
        stats,
        queries,
        duplicateQueries,
      };
    } finally {
      // Restaurar o preservar logs
      this.logs = [...previousLogs, ...this.logs];
      for (const [key, count] of this.queryCountMap.entries()) {
        previousMap.set(key, (previousMap.get(key) || 0) + count);
      }
      this.queryCountMap = previousMap;
    }
  }

  /**
   * Aserto de prueba: confirma que no existen queries repetidas
   */
  public assertNoRepeatedQueries(): { valid: boolean; duplicates: DuplicateQueryGroup[]; message: string } {
    const duplicates = this.getDuplicateQueries();
    if (duplicates.length > 0) {
      return {
        valid: false,
        duplicates,
        message: `Se detectaron ${duplicates.length} grupos de consultas repetidas (N+1 queries).`,
      };
    }
    return {
      valid: true,
      duplicates: [],
      message: "Inspección exitosa: 0 consultas repetidas detectadas.",
    };
  }
}

// Instancia singleton para monitoreo global de Prisma
export const prismaQueryMonitor = new PrismaQueryMonitor();
