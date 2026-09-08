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
  private getModel(model: any): any {
    const name = typeof model === 'string' ? model : (model?.name || String(model));
    const camel = name.charAt(0).toLowerCase() + name.slice(1);
    return (prisma as any)[camel] || (prisma as any)[name];
  }

  /**
   * Soft delete de un registro
   */
  async softDelete<T extends { id: string; deletedAt?: Date | null }>(
    model: any,
    id: string,
    options: SoftDeleteOptions = {}
  ): Promise<T> {
    try {
      const data: any = {
        deletedAt: new Date(),
      };

      // Si el modelo tiene version para optimistic locking, incrementarlo
      if (model?.fields?.find((f: any) => f.name === 'version')) {
        data.version = {
          increment: 1,
        };
      }

      const result = await this.getModel(model).update({
        where: { id },
        data,
      });

      // Registrar en auditoría
      const modelName = typeof model === 'string' ? model : (model?.name || 'Unknown');
      await this.logAuditEvent(modelName, id, 'SOFT_DELETE', options);

      return result as T;
    } catch (error) {
      const modelName = typeof model === 'string' ? model : (model?.name || 'Unknown');
      throw new SoftDeleteError(`Error al soft delete ${modelName}: ${error}`);
    }
  }

  /**
   * Restaurar un registro soft deleted
   */
  async restore<T extends { id: string; deletedAt?: Date | null }>(
    model: any,
    id: string,
    options: RestoreOptions = {}
  ): Promise<T> {
    try {
      const data: any = {
        deletedAt: null,
      };

      // Si el modelo tiene version para optimistic locking, incrementarlo
      if (model?.fields?.find((f: any) => f.name === 'version')) {
        data.version = {
          increment: 1,
        };
      }

      const result = await this.getModel(model).update({
        where: { id },
        data,
      });

      // Registrar en auditoría
      const modelName = typeof model === 'string' ? model : (model?.name || 'Unknown');
      await this.logAuditEvent(modelName, id, 'RESTORE', options);

      return result as T;
    } catch (error) {
      const modelName = typeof model === 'string' ? model : (model?.name || 'Unknown');
      throw new SoftDeleteError(`Error al restaurar ${modelName}: ${error}`);
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
      const result = await this.getModel(model).delete({
        where: { id },
      });

      // Registrar en auditoría
      const modelName = typeof model === 'string' ? model : (model?.name || 'Unknown');
      await this.logAuditEvent(modelName, id, 'HARD_DELETE', options);

      return result as T;
    } catch (error) {
      const modelName = typeof model === 'string' ? model : (model?.name || 'Unknown');
      throw new SoftDeleteError(`Error al hard delete ${modelName}: ${error}`);
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
    return this.getModel(model).findMany({
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
    return this.getModel(model).findMany({
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
    return this.getModel(model).findMany({
      where,
      include,
    }) as Promise<T[]>;
  }

  /**
   * Contar registros activos
   */
  async countActive(model: any, where: Prisma.Args<any, 'findMany'>['where'] = {}): Promise<number> {
    return this.getModel(model).count({
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
    return this.getModel(model).count({
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
      const recordsToDelete = await this.getModel(model).findMany({
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

      const ids = recordsToDelete.map((r: any) => r.id);
      
      await this.getModel(model).deleteMany({
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