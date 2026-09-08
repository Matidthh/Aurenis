/**
 * Servicio de Archivado y Retención de Datos
 * Estrategias para gestionar datos históricos y cumplimiento
 */

import { prisma } from '@/lib/db/prisma';
import { messageQueue } from '@/lib/message-queue';

export interface ArchiveConfig {
  modelName: string;
  retentionDays: number;
  archiveAfterDays: number;
  criteria?: (record: any) => boolean;
  compress?: boolean;
}

export interface ArchiveResult {
  modelName: string;
  archivedCount: number;
  deletedCount: number;
  archivedSize: number;
  timestamp: Date;
}

export class DataArchiverError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DataArchiverError';
  }
}

/**
 * Servicio de Archivado de Datos
 */
export class DataArchiver {
  private archiveConfigs: Map<string, ArchiveConfig> = new Map();

  /**
   * Registra una configuración de archivado
   */
  registerArchiveConfig(config: ArchiveConfig): void {
    this.archiveConfigs.set(config.modelName, config);
  }

  /**
   * Archiva datos según la configuración registrada
   */
  async archiveData(modelName: string): Promise<ArchiveResult> {
    const config = this.archiveConfigs.get(modelName);
    if (!config) {
      throw new DataArchiverError(`No hay configuración de archivado para ${modelName}`);
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - config.archiveAfterDays);

    const result: ArchiveResult = {
      modelName,
      archivedCount: 0,
      deletedCount: 0,
      archivedSize: 0,
      timestamp: new Date(),
    };

    try {
      // Obtener registros a archivar
      const recordsToArchive = await this.getRecordsToArchive(modelName, cutoffDate, config);

      if (recordsToArchive.length === 0) {
        return result;
      }

      // Archivar registros
      for (const record of recordsToArchive) {
        await this.archiveRecord(modelName, record, config);
        result.archivedCount++;
        result.archivedSize += JSON.stringify(record).length;
      }

      // Eliminar registros originales después de archivar
      if (config.compress) {
        await this.deleteArchivedRecords(modelName, recordsToArchive.map(r => r.id));
        result.deletedCount = recordsToArchive.length;
      }

      return result;
    } catch (error) {
      throw new DataArchiverError(`Error al archivar ${modelName}: ${error}`);
    }
  }

  /**
   * Obtiene registros que cumplen criterios de archivado
   */
  private async getRecordsToArchive(
    modelName: string,
    cutoffDate: Date,
    config: ArchiveConfig
  ): Promise<any[]> {
    const where: any = {
      createdAt: {
        lte: cutoffDate,
      },
      deletedAt: null, // Solo registros activos
    };

    const records = await prisma[modelName].findMany({
      where,
      take: 1000, // Procesar en batches
    });

    // Aplicar criterio personalizado si existe
    if (config.criteria) {
      return records.filter(config.criteria);
    }

    return records;
  }

  /**
   * Archiva un registro individual
   */
  private async archiveRecord(modelName: string, record: any, config: ArchiveConfig): Promise<void> {
    try {
      // Crear registro en tabla de archivo
      await prisma.archivedRecord.create({
        data: {
          modelName,
          originalId: record.id,
          data: record,
          archivedAt: new Date(),
          retentionUntil: this.calculateRetentionDate(config.retentionDays),
          compressed: config.compress || false,
        },
      });
    } catch (error) {
      console.error(`Error al archivar registro ${record.id}:`, error);
    }
  }

  /**
   * Elimina registros originales después de archivar
   */
  private async deleteArchivedRecords(modelName: string, ids: string[]): Promise<void> {
    try {
      await prisma[modelName].deleteMany({
        where: {
          id: { in: ids },
        },
      });
    } catch (error) {
      console.error('Error al eliminar registros archivados:', error);
    }
  }

  /**
   * Calcula fecha de retención
   */
  private calculateRetentionDate(retentionDays: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + retentionDays);
    return date;
  }

  /**
   * Restaura un registro archivado
   */
  async restoreRecord(archiveId: string): Promise<any> {
    try {
      const archivedRecord = await prisma.archivedRecord.findUnique({
        where: { id: archiveId },
      });

      if (!archivedRecord) {
        throw new DataArchiverError('Registro archivado no encontrado');
      }

      // Restaurar en tabla original
      const restored = await prisma[archivedRecord.modelName].create({
        data: {
          ...archivedRecord.data,
          id: archivedRecord.originalId, // Mantener ID original
        },
      });

      // Eliminar registro archivado
      await prisma.archivedRecord.delete({
        where: { id: archiveId },
      });

      return restored;
    } catch (error) {
      throw new DataArchiverError(`Error al restaurar registro: ${error}`);
    }
  }

  /**
   * Limpia registros archivados expirados
   */
  async cleanupExpiredArchives(): Promise<number> {
    try {
      const now = new Date();
      const expiredRecords = await prisma.archivedRecord.findMany({
        where: {
          retentionUntil: {
            lte: now,
          },
        },
        select: { id: true },
      });

      if (expiredRecords.length === 0) {
        return 0;
      }

      const ids = expiredRecords.map(r => r.id);
      await prisma.archivedRecord.deleteMany({
        where: {
          id: { in: ids },
        },
      });

      return ids.length;
    } catch (error) {
      console.error('Error al limpiar archivos expirados:', error);
      return 0;
    }
  }

  /**
   * Obtiene estadísticas de archivado
   */
  async getArchiveStats(): Promise<{
    totalArchived: number;
    byModel: Record<string, number>;
    totalSize: number;
    expiringSoon: number;
  }> {
    try {
      const [totalArchived, byModel, totalSize, expiringSoon] = await Promise.all([
        prisma.archivedRecord.count(),
        prisma.archivedRecord.groupBy({
          by: ['modelName'],
          _count: true,
        }),
        prisma.archivedRecord.aggregate({
          _sum: {
            dataSize: true,
          },
        }),
        prisma.archivedRecord.count({
          where: {
            retentionUntil: {
              lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
            },
          },
        }),
      ]);

      const byModelMap = byModel.reduce((acc, item) => {
        acc[item.modelName] = item._count;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalArchived,
        byModel: byModelMap,
        totalSize: totalSize._sum.dataSize || 0,
        expiringSoon,
      };
    } catch (error) {
      console.error('Error al obtener estadísticas de archivado:', error);
      return {
        totalArchived: 0,
        byModel: {},
        totalSize: 0,
        expiringSoon: 0,
      };
    }
  }

  /**
   * Archiva datos en background
   */
  async archiveInBackground(modelName: string): Promise<string> {
    return await messageQueue.add(
      'archive',
      'archive_data',
      { modelName },
      { priority: 5 }
    );
  }

  /**
   * Configura archivado automático periódico
   */
  setupAutomaticArchiving(interval: number = 24 * 60 * 60 * 1000): void {
    setInterval(async () => {
      for (const modelName of this.archiveConfigs.keys()) {
        try {
          await this.archiveInBackground(modelName);
        } catch (error) {
          console.error(`Error en archivado automático de ${modelName}:`, error);
        }
      }
    }, interval);
  }

  /**
   * Exporta datos archivados a formato específico
   */
  async exportArchivedData(
    modelName: string,
    format: 'json' | 'csv' = 'json',
    filters?: any
  ): Promise<Buffer> {
    try {
      const where: any = {
        modelName,
        ...(filters && { data: filters }),
      };

      const records = await prisma.archivedRecord.findMany({
        where,
        orderBy: { archivedAt: 'desc' },
      });

      if (format === 'json') {
        return Buffer.from(JSON.stringify(records, null, 2));
      }

      if (format === 'csv') {
        // Implementar conversión a CSV
        const headers = Object.keys(records[0]?.data || {});
        const csvRows = [
          headers.join(','),
          ...records.map(r => 
            headers.map(h => JSON.stringify(r.data[h])).join(',')
          ),
        ];
        return Buffer.from(csvRows.join('\n'));
      }

      throw new DataArchiverError('Formato no soportado');
    } catch (error) {
      throw new DataArchiverError(`Error al exportar datos: ${error}`);
    }
  }
}

export const dataArchiver = new DataArchiver();

// Configurar archivado por defecto para modelos comunes
dataArchiver.registerArchiveConfig({
  modelName: 'AuditLog',
  retentionDays: 365, // 1 año
  archiveAfterDays: 90, // Archivar después de 90 días
  compress: true,
});

dataArchiver.registerArchiveConfig({
  modelName: 'AttendanceRecord',
  retentionDays: 1825, // 5 años
  archiveAfterDays: 365, // Archivar después de 1 año
  compress: true,
});

dataArchiver.registerArchiveConfig({
  modelName: 'Grade',
  retentionDays: 3650, // 10 años
  archiveAfterDays: 730, // Archivar después de 2 años
  compress: true,
});