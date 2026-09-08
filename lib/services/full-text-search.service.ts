/**
 * Servicio de Full-Text Search con PostgreSQL
 * Implementa búsqueda avanzada de texto en múltiples idiomas
 */

import { prisma } from '@/lib/db/prisma';
import { Prisma } from '@prisma/client';

export interface SearchOptions {
  limit?: number;
  offset?: number;
  language?: string;
  minRank?: number;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  rank: number;
}

export class FullTextSearchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FullTextSearchError';
  }
}

/**
 * Servicio de Full-Text Search
 */
export class FullTextSearchService {
  /**
   * Búsqueda simple de texto en columnas específicas
   */
  async searchSimple<T>(
    model: any,
    columns: string[],
    query: string,
    options: SearchOptions = {}
  ): Promise<SearchResult<T>> {
    try {
      const limit = options.limit || 20;
      const offset = options.offset || 0;
      const language = options.language || 'spanish';

      // Construir condición de búsqueda
      const searchConditions = columns.map(column => ({
        [column]: {
          search: query,
          mode: 'insensitive' as Prisma.QueryMode,
        },
      }));

      const where = {
        OR: searchConditions,
        deletedAt: null, // Solo registros activos
      };

      const [items, total] = await Promise.all([
        prisma[model.name].findMany({
          where,
          take: limit,
          skip: offset,
        }),
        prisma[model.name].count({ where }),
      ]);

      return {
        items: items as T[],
        total,
        rank: 1, // Ranking simple
      };
    } catch (error) {
      throw new FullTextSearchError(`Error en búsqueda simple: ${error}`);
    }
  }

  /**
   * Búsqueda avanzada con ranking usando ts_rank de PostgreSQL
   */
  async searchWithRanking<T>(
    model: any,
    searchVector: string,
    query: string,
    options: SearchOptions = {}
  ): Promise<SearchResult<T>> {
    try {
      const limit = options.limit || 20;
      const offset = options.offset || 0;
      const minRank = options.minRank || 0.1;

      // Usar raw query para aprovechar ts_rank de PostgreSQL
      const searchQuery = `
        SELECT *, 
               ts_rank(${searchVector}, plainto_tsquery('${options.language || 'spanish'}', $1)) as rank
        FROM "${model.name}"
        WHERE ${searchVector} @@ plainto_tsquery('${options.language || 'spanish'}', $1)
          AND "deletedAt" IS NULL
          AND ts_rank(${searchVector}, plainto_tsquery('${options.language || 'spanish'}', $1)) >= $2
        ORDER BY rank DESC
        LIMIT $3 OFFSET $4
      `;

      const countQuery = `
        SELECT COUNT(*) as total
        FROM "${model.name}"
        WHERE ${searchVector} @@ plainto_tsquery('${options.language || 'spanish'}', $1)
          AND "deletedAt" IS NULL
          AND ts_rank(${searchVector}, plainto_tsquery('${options.language || 'spanish'}', $1)) >= $2
      `;

      const [itemsResult, countResult] = await Promise.all([
        prisma.$queryRawUnsafe(searchQuery, query, minRank, limit, offset),
        prisma.$queryRawUnsafe(countQuery, query, minRank),
      ]);

      const items = itemsResult as any[];
      const total = (countResult as any[])[0]?.total || 0;

      return {
        items: items as T[],
        total,
        rank: items.length > 0 ? items[0].rank : 0,
      };
    } catch (error) {
      throw new FullTextSearchError(`Error en búsqueda con ranking: ${error}`);
    }
  }

  /**
   * Búsqueda multifield con pesos diferentes
   */
  async searchWeighted<T>(
    model: any,
    fields: Array<{ field: string; weight: number }>,
    query: string,
    options: SearchOptions = {}
  ): Promise<SearchResult<T>> {
    try {
      const limit = options.limit || 20;
      const offset = options.offset || 0;
      const language = options.language || 'spanish';

      // Construir vector de búsqueda con pesos
      const weightedVector = fields
        .map(f => `setweight(to_tsvector('${language}', COALESCE(${f.field}, '')), '${this.getWeightLabel(f.weight)}')`)
        .join(' || ');

      const searchQuery = `
        SELECT *, 
               ts_rank(${weightedVector}, plainto_tsquery('${language}', $1)) as rank
        FROM "${model.name}"
        WHERE ${weightedVector} @@ plainto_tsquery('${language}', $1)
          AND "deletedAt" IS NULL
        ORDER BY rank DESC
        LIMIT $2 OFFSET $3
      `;

      const countQuery = `
        SELECT COUNT(*) as total
        FROM "${model.name}"
        WHERE ${weightedVector} @@ plainto_tsquery('${language}', $1)
          AND "deletedAt" IS NULL
      `;

      const [itemsResult, countResult] = await Promise.all([
        prisma.$queryRawUnsafe(searchQuery, query, limit, offset),
        prisma.$queryRawUnsafe(countQuery, query),
      ]);

      const items = itemsResult as any[];
      const total = (countResult as any[])[0]?.total || 0;

      return {
        items: items as T[],
        total,
        rank: items.length > 0 ? items[0].rank : 0,
      };
    } catch (error) {
      throw new FullTextSearchError(`Error en búsqueda ponderada: ${error}`);
    }
  }

  /**
   * Búsqueda con sugerencias (autocompletado)
   */
  async searchSuggestions<T>(
    model: any,
    column: string,
    prefix: string,
    options: SearchOptions = {}
  ): Promise<T[]> {
    try {
      const limit = options.limit || 10;

      const items = await prisma[model.name].findMany({
        where: {
          [column]: {
            startsWith: prefix,
            mode: 'insensitive' as Prisma.QueryMode,
          },
          deletedAt: null,
        },
        take: limit,
        select: {
          [column]: true,
          id: true,
        },
      });

      return items as T[];
    } catch (error) {
      throw new FullTextSearchError(`Error en búsqueda de sugerencias: ${error}`);
    }
  }

  /**
   * Búsqueda fuzzy (tolerante a errores)
   */
  async searchFuzzy<T>(
    model: any,
    column: string,
    query: string,
    maxDistance: number = 2,
    options: SearchOptions = {}
  ): Promise<SearchResult<T>> {
    try {
      const limit = options.limit || 20;
      const offset = options.offset || 0;

      // Usar función de similitud de PostgreSQL (levenshtein o similar)
      const fuzzyQuery = `
        SELECT *, 
               levenshtein(${column}, $1) as distance
        FROM "${model.name}"
        WHERE levenshtein(${column}, $1) <= $2
          AND "deletedAt" IS NULL
        ORDER BY distance ASC
        LIMIT $3 OFFSET $4
      `;

      const countQuery = `
        SELECT COUNT(*) as total
        FROM "${model.name}"
        WHERE levenshtein(${column}, $1) <= $2
          AND "deletedAt" IS NULL
      `;

      const [itemsResult, countResult] = await Promise.all([
        prisma.$queryRawUnsafe(fuzzyQuery, query, maxDistance, limit, offset),
        prisma.$queryRawUnsafe(countQuery, query, maxDistance),
      ]);

      const items = itemsResult as any[];
      const total = (countResult as any[])[0]?.total || 0;

      return {
        items: items as T[],
        total,
        rank: items.length > 0 ? 1 - (items[0].distance / maxDistance) : 0,
      };
    } catch (error) {
      throw new FullTextSearchError(`Error en búsqueda fuzzy: ${error}`);
    }
  }

  /**
   * Actualizar índice de búsqueda para un registro
   */
  async updateSearchIndex(
    model: any,
    id: string,
    columns: string[]
  ): Promise<void> {
    try {
      const record = await prisma[model.name].findUnique({
        where: { id },
        select: columns.reduce((acc, col) => ({ ...acc, [col]: true }), {}),
      });

      if (!record) return;

      // Generar texto de búsqueda concatenando columnas
      const searchText = columns
        .map(col => record[col])
        .filter(val => val !== null && val !== undefined)
        .join(' ');

      await prisma[model.name].update({
        where: { id },
        data: {
          searchableText: searchText,
        },
      });
    } catch (error) {
      console.error('Error al actualizar índice de búsqueda:', error);
    }
  }

  /**
   * Reconstruir índices de búsqueda para todos los registros
   */
  async rebuildSearchIndex(
    model: any,
    columns: string[],
    batchSize: number = 100
  ): Promise<number> {
    let totalProcessed = 0;
    let hasMore = true;
    let offset = 0;

    while (hasMore) {
      const records = await prisma[model.name].findMany({
        where: { deletedAt: null },
        take: batchSize,
        skip: offset,
        select: {
          id: true,
          ...columns.reduce((acc, col) => ({ ...acc, [col]: true }), {}),
        },
      });

      if (records.length === 0) {
        hasMore = false;
        break;
      }

      for (const record of records) {
        const searchText = columns
          .map(col => record[col])
          .filter(val => val !== null && val !== undefined)
          .join(' ');

        await prisma[model.name].update({
          where: { id: record.id },
          data: { searchableText: searchText },
        });

        totalProcessed++;
      }

      offset += batchSize;
      hasMore = records.length === batchSize;
    }

    return totalProcessed;
  }

  /**
   * Obtiene etiqueta de peso para PostgreSQL
   */
  private getWeightLabel(weight: number): string {
    if (weight >= 1.0) return 'A';
    if (weight >= 0.5) return 'B';
    if (weight >= 0.2) return 'C';
    return 'D';
  }

  /**
   * Búsqueda combinada (texto + filtros)
   */
  async searchWithFilters<T>(
    model: any,
    searchColumns: string[],
    query: string,
    filters: Record<string, any>,
    options: SearchOptions = {}
  ): Promise<SearchResult<T>> {
    try {
      const limit = options.limit || 20;
      const offset = options.offset || 0;

      // Construir condiciones de búsqueda
      const searchConditions = searchColumns.map(column => ({
        [column]: {
          search: query,
          mode: 'insensitive' as Prisma.QueryMode,
        },
      }));

      // Construir filtros adicionales
      const filterConditions = Object.entries(filters).map(([key, value]) => ({
        [key]: value,
      }));

      const where = {
        AND: [
          { OR: searchConditions },
          ...filterConditions,
          { deletedAt: null },
        ],
      };

      const [items, total] = await Promise.all([
        prisma[model.name].findMany({
          where,
          take: limit,
          skip: offset,
        }),
        prisma[model.name].count({ where }),
      ]);

      return {
        items: items as T[],
        total,
        rank: 1,
      };
    } catch (error) {
      throw new FullTextSearchError(`Error en búsqueda con filtros: ${error}`);
    }
  }
}

export const fullTextSearchService = new FullTextSearchService();