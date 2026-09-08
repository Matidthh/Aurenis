/**
 * Servicio para Optimistic Locking
 * Previene conflictos de concurrencia en actualizaciones
 */

import { prisma } from '@/lib/db/prisma';
import { Prisma } from '@prisma/client';

export class OptimisticLockError extends Error {
  constructor(message: string, public currentVersion: number) {
    super(message);
    this.name = 'OptimisticLockError';
  }
}

export interface VersionedEntity {
  id: string;
  version: number;
}

/**
 * Servicio de Optimistic Locking
 */
export class OptimisticLockService {
  /**
   * Actualiza un registro con verificación de versión
   */
  async updateWithVersion<T extends VersionedEntity>(
    model: any,
    id: string,
    expectedVersion: number,
    data: Prisma.Args<any, 'update'>['data'],
    include?: Prisma.Args<any, 'update'>['include']
  ): Promise<T> {
    try {
      const result = await prisma[model.name].update({
        where: {
          id,
          version: expectedVersion,
        },
        data: {
          ...data,
          version: {
            increment: 1,
          },
        },
        include,
      });

      return result as T;
    } catch (error: any) {
      if (error.code === 'P2025') {
        // Record not found or version mismatch
        const current = await prisma[model.name].findUnique({
          where: { id },
          select: { version: true },
        });
        
        throw new OptimisticLockError(
          'El registro fue modificado por otro usuario. Por favor recarga los datos.',
          current?.version || expectedVersion
        );
      }
      throw error;
    }
  }

  /**
   * Actualiza múltiples registros con verificación de versión
   */
  async updateManyWithVersion(
    model: any,
    updates: Array<{ id: string; expectedVersion: number; data: any }>
  ): Promise<{ success: string[]; failed: Array<{ id: string; error: string }> }> {
    const results = {
      success: [] as string[],
      failed: [] as Array<{ id: string; error: string }>,
    };

    for (const update of updates) {
      try {
        await this.updateWithVersion(model, update.id, update.expectedVersion, update.data);
        results.success.push(update.id);
      } catch (error: any) {
        results.failed.push({
          id: update.id,
          error: error.message,
        });
      }
    }

    return results;
  }

  /**
   * Obtiene un registro con su versión actual
   */
  async getWithVersion<T extends VersionedEntity>(
    model: any,
    id: string,
    include?: Prisma.Args<any, 'findUnique'>['include']
  ): Promise<T | null> {
    return prisma[model.name].findUnique({
      where: { id },
      include,
    }) as Promise<T | null>;
  }

  /**
   * Verifica si un registro existe y tiene la versión esperada
   */
  async checkVersion(model: any, id: string, expectedVersion: number): Promise<boolean> {
    const record = await prisma[model.name].findUnique({
      where: { id },
      select: { version: true },
    });

    return record?.version === expectedVersion;
  }

  /**
   * Obtiene la versión actual de un registro
   */
  async getCurrentVersion(model: any, id: string): Promise<number | null> {
    const record = await prisma[model.name].findUnique({
      where: { id },
      select: { version: true },
    });

    return record?.version || null;
  }

  /**
   * Transacción con múltiples actualizaciones versionadas
   */
  async transactionWithVersion<T>(
    operations: Array<{
      model: any;
      id: string;
      expectedVersion: number;
      data: any;
    }>,
    callback?: () => Promise<T>
  ): Promise<T> {
    return prisma.$transaction(async (tx) => {
      // Verificar todas las versiones primero
      for (const op of operations) {
        const current = await tx[op.model.name].findUnique({
          where: { id: op.id },
          select: { version: true },
        });

        if (!current || current.version !== op.expectedVersion) {
          throw new OptimisticLockError(
            `Conflicto de versión en ${op.model.name} ${op.id}`,
            current?.version || op.expectedVersion
          );
        }
      }

      // Ejecutar todas las actualizaciones
      for (const op of operations) {
        await tx[op.model.name].update({
          where: {
            id: op.id,
            version: op.expectedVersion,
          },
          data: {
            ...op.data,
            version: { increment: 1 },
          },
        });
      }

      // Ejecutar callback adicional si existe
      if (callback) {
        return await callback();
      }

      return {} as T;
    });
  }

  /**
   * Conflicto de concurrencia - resolver con estrategia específica
   */
  async resolveConflict<T extends VersionedEntity>(
    model: any,
    id: string,
    localVersion: number,
    remoteVersion: number,
    mergeStrategy: 'local' | 'remote' | 'merge' = 'remote',
    mergeFn?: (local: any, remote: any) => any
  ): Promise<T> {
    const localData = await prisma[model.name].findUnique({
      where: { id },
    });

    const remoteData = await prisma[model.name].findUnique({
      where: { id },
    });

    if (!localData || !remoteData) {
      throw new Error('No se pudieron obtener los datos para resolver el conflicto');
    }

    switch (mergeStrategy) {
      case 'local':
        // Forzar versión local
        return await this.updateWithVersion(model, id, remoteVersion, localData);
      
      case 'remote':
        // Aceptar versión remota (recargar datos)
        return remoteData as T;
      
      case 'merge':
        if (!mergeFn) {
          throw new Error('Se requiere una función de merge para la estrategia merge');
        }
        const mergedData = mergeFn(localData, remoteData);
        return await this.updateWithVersion(model, id, remoteVersion, mergedData);
      
      default:
        throw new Error('Estrategia de merge no válida');
    }
  }
}

export const optimisticLockService = new OptimisticLockService();