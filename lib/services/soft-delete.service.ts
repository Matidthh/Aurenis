/**
 * Servicio para manejo de Soft Deletes
 * Permite recuperación de datos y auditoría completa
 */

import { prisma } from '@/lib/db/prisma';
import { Prisma } from '@prisma/client';

export class SoftDeleteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SoftDeleteError';
  }
}

/**
 * Opciones para soft delete
 */
export interface SoftDeleteOptions {
  userId?: string;
  reason?: string;
  hardDeleteAfter?: Date; // Fecha para eliminación permanente
}

/**
 * Opciones para restore
 */
export interface RestoreOptions {
  userId?: string;
  reason?: string;
}

/**
 * Servicio de Soft Delete genérico
 */
export class SoftDeleteService {
  /**
   * Soft delete de un registro
   */
  async softDelete<T extends { id: string; deletedAt?: DateTime | null }>(
    model: any,
    id: string,
    options: SoftDeleteOptions = {}
  ): Promise<T> {
    try {
      const data: any = {
        deletedAt: new Date(),
      };

      // Si el modelo tiene version para optimistic locking, incrementarlo
      if (model.fields.find((f: any) => f.name === 'version')) {
        data.version = {
          increment: 1,
        };
      }

      const result = await prisma[model.name].update({
        where: { id },
        data,
      });

      // Registrar en auditoría
      await this.logAuditEvent(model.name, id, 'SOFT_DELETE', options);

      return result as T;
    } catch (error) {
      throw new SoftDeleteError(`Error al soft delete ${model.name}: ${error}`);
    }
  }

  /**
   * Restaurar un registro soft deleted
   */
  async restore<T extends { id: string; deletedAt?: DateTime | null }>(
    model: any,
    id: string,
    options: RestoreOptions = {}
  ): Promise<T> {
    try {
      const data: any = {
        deletedAt: null,
      };

      // Si el modelo tiene version para optimistic locking, incrementarlo
      if (model.fields.find((f: any) => f.name === 'version')) {
        data.version = {
          increment: 1,
        };
      }

      const result = await prisma[model.name].update({
        where: { id },
        data,
      });

      // Registrar en auditoría
      await this.logAuditEvent(model.name, id, 'RESTORE', options);

      return result as T;
    } catch (error) {
      throw new SoftDeleteError(`Error al restaurar ${model.name}: ${error}`);
    }
  }

  /**
   * Hard delete permanente de un registro
   */
  async hardDelete<T>(
    model: any,
    id: string,
    options: SoftDeleteOptions = {}
  ): Promise<T> {
    try {
      const result = await prisma[model.name].delete({
        where: { id },
      });

      // Registrar en auditoría
      await this.logAuditEvent(model.name, id, 'HARD_DELETE', options);

      return result as T;
    } catch (error) {
      throw new SoftDeleteError(`Error al hard delete ${model.name}: ${error}`);
    }
  }

  /**
   * Buscar solo registros activos (no eliminados)
   */
  async findActive<T>(
    model: any,
    where: Prisma.Args<any, 'findMany'>['where'] = {},
    include?: Prisma.Args<any, 'findMany'>['include']
  ): Promise<T[]> {
    return prisma[model.name].findMany({
      where: {
        ...where,
        deletedAt: null,
      },
      include,
    }) as Promise<T[]>;
  }

  /**
   * Buscar solo registros eliminados
   */
  async findDeleted<T>(
    model: any,
    where: Prisma.Args<any, 'findMany'>['where'] = {},
    include?: Prisma.Args<any, 'findMany'>['include']
  ): Promise<T[]> {
    return prisma[model.name].findMany({
      where: {
        ...where,
        deletedAt: { not: null },
      },
      include,
    }) as Promise<T[]>;
  }

  /**
   * Buscar todos (activos y eliminados)
   */
  async findAllWithDeleted<T>(
    model: any,
    where: Prisma.Args<any, 'findMany'>['where'] = {},
    include?: Prisma.Args<any, 'findMany'>['include']
  ): Promise<T[]> {
    return prisma[model.name].findMany({
      where,
      include,
    }) as Promise<T[]>;
  }

  /**
   * Contar registros activos
   */
  async countActive(model: any, where: Prisma.Args<any, 'findMany'>['where'] = {}): Promise<number> {
    return prisma[model.name].count({
      where: {
        ...where,
        deletedAt: null,
      },
    });
  }

  /**
   * Contar registros eliminados
   */
  async countDeleted(model: any, where: Prisma.Args<any, 'findMany'>['where'] = {}): Promise<number> {
    return prisma[model.name].count({
      where: {
        ...where,
        deletedAt: { not: null },
      },
    });
  }

  /**
   * Limpieza periódica de registros soft deleted antiguos
   */
  async cleanupOldDeletedRecords(
    model: any,
    olderThanDays: number = 90,
    batchSize: number = 100
  ): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    let totalDeleted = 0;
    let hasMore = true;

    while (hasMore) {
      const recordsToDelete = await prisma[model.name].findMany({
        where: {
          deletedAt: {
            lte: cutoffDate,
          },
        },
        take: batchSize,
        select: { id: true },
      });

      if (recordsToDelete.length === 0) {
        hasMore = false;
        break;
      }

      const ids = recordsToDelete.map(r => r.id);
      
      await prisma[model.name].deleteMany({
        where: {
          id: { in: ids },
          deletedAt: { lte: cutoffDate },
        },
      });

      totalDeleted += ids.length;
      hasMore = ids.length === batchSize;
    }

    return totalDeleted;
  }

  /**
   * Registrar evento de auditoría para soft delete
   */
  private async logAuditEvent(
    model: string,
    entityId: string,
    action: string,
    options: SoftDeleteOptions | RestoreOptions
  ): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          action: action as any,
          entityType: model,
          entityId,
          userId: options.userId || null,
          details: {
            reason: options.reason,
          },
        },
      });
    } catch (error) {
      console.error('Error al registrar auditoría de soft delete:', error);
    }
  }
}

export const softDeleteService = new SoftDeleteService();