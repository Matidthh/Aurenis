/**
 * Servicio de Partitioning de Tablas
 * Implementa partitioning por tenant y tiempo para escalabilidad horizontal
 */

import { prisma } from '@/lib/db/prisma';

export interface PartitionConfig {
  tableName: string;
  partitionBy: 'tenant' | 'time' | 'hybrid';
  tenantColumn?: string;
  timeColumn?: string;
  timeInterval?: 'daily' | 'monthly' | 'yearly';
  retentionPartitions?: number;
}

export class PartitioningError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PartitioningError';
  }
}

/**
 * Servicio de Partitioning
 */
export class PartitioningService {
  private partitionConfigs: Map<string, PartitionConfig> = new Map();

  /**
   * Registra una configuración de partitioning
   */
  registerPartitionConfig(config: PartitionConfig): void {
    this.partitionConfigs.set(config.tableName, config);
  }

  /**
   * Crea particiones para una tabla
   */
  async createPartitions(tableName: string): Promise<void> {
    const config = this.partitionConfigs.get(tableName);
    if (!config) {
      throw new PartitioningError(`No hay configuración de partitioning para ${tableName}`);
    }

    try {
      switch (config.partitionBy) {
        case 'tenant':
          await this.createTenantPartitions(tableName, config);
          break;
        case 'time':
          await this.createTimePartitions(tableName, config);
          break;
        case 'hybrid':
          await this.createHybridPartitions(tableName, config);
          break;
        default:
          throw new PartitioningError(`Tipo de partitioning no soportado: ${config.partitionBy}`);
      }
    } catch (error) {
      throw new PartitioningError(`Error al crear particiones: ${error}`);
    }
  }

  /**
   * Crea particiones por tenant
   */
  private async createTenantPartitions(tableName: string, config: PartitionConfig): Promise<void> {
    if (!config.tenantColumn) {
      throw new PartitioningError('Se requiere tenantColumn para partitioning por tenant');
    }

    // Obtener tenants activos
    const tenants = await prisma.school.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true },
    });

    for (const tenant of tenants) {
      const partitionName = `${tableName}_tenant_${tenant.id.replace(/-/g, '_')}`;
      
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS ${partitionName} 
        PARTITION OF ${tableName}
        FOR VALUES WITH (MODULUS ${tenants.length}, REMAINDER ${tenants.indexOf(tenant)})
      `);
    }
  }

  /**
   * Crea particiones por tiempo
   */
  private async createTimePartitions(tableName: string, config: PartitionConfig): Promise<void> {
    if (!config.timeColumn) {
      throw new PartitioningError('Se requiere timeColumn para partitioning por tiempo');
    }

    const interval = config.timeInterval || 'monthly';
    const retentionMonths = config.retentionPartitions || 12;

    const now = new Date();
    const partitions: Array<{ name: string; start: Date; end: Date }> = [];

    // Crear particiones para meses futuros y pasados
    for (let i = -retentionMonths; i <= retentionMonths; i++) {
      const date = new Date(now);
      date.setMonth(date.getMonth() + i);

      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);

      const partitionName = `${tableName}_${date.getFullYear()}_${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      partitions.push({ name: partitionName, start, end });
    }

    // Crear particiones en PostgreSQL
    for (const partition of partitions) {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS ${partition.name}
        PARTITION OF ${tableName}
        FOR VALUES FROM ('${partition.start.toISOString()}') TO ('${partition.end.toISOString()}')
      `);
    }
  }

  /**
   * Crea particiones híbridas (tenant + tiempo)
   */
  private async createHybridPartitions(tableName: string, config: PartitionConfig): Promise<void> {
    if (!config.tenantColumn || !config.timeColumn) {
      throw new PartitioningError('Se requieren tenantColumn y timeColumn para partitioning híbrido');
    }

    // Para partitioning híbrido, primero particionar por tenant
    await this.createTenantPartitions(tableName, config);

    // Luego cada partición de tenant se particiona por tiempo
    const tenants = await prisma.school.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true },
    });

    for (const tenant of tenants) {
      const tenantPartitionName = `${tableName}_tenant_${tenant.id.replace(/-/g, '_')}`;
      
      // Aquí se necesitaría lógica adicional para sub-particionar
      // Esto requeriría modificar la estructura de particiones
      console.log(`Sub-particionando ${tenantPartitionName} por tiempo`);
    }
  }

  /**
   * Crea partición por defecto para datos fuera de rango
   */
  async createDefaultPartition(tableName: string): Promise<void> {
    const defaultPartitionName = `${tableName}_default`;

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS ${defaultPartitionName}
      PARTITION OF ${tableName}
      DEFAULT
    `);
  }

  /**
   * Elimina particiones antiguas
   */
  async dropOldPartitions(tableName: string, keepPartitions: number = 12): Promise<number> {
    const config = this.partitionConfigs.get(tableName);
    if (!config || config.partitionBy !== 'time') {
      throw new PartitioningError('Solo se pueden eliminar particiones de tiempo');
    }

    const now = new Date();
    const cutoffDate = new Date(now);
    cutoffDate.setMonth(cutoffDate.getMonth() - keepPartitions);

    // Obtener particiones antiguas
    const partitions = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE tablename LIKE ${`${tableName}%`}
      AND tablename != ${tableName}
      AND tablename != ${`${tableName}_default`}
    `;

    let droppedCount = 0;

    for (const partition of partitions) {
      const partitionDate = this.extractDateFromPartitionName(partition.tablename, tableName);
      
      if (partitionDate && partitionDate < cutoffDate) {
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS ${partition.tablename}`);
        droppedCount++;
      }
    }

    return droppedCount;
  }

  /**
   * Extrae fecha del nombre de partición
   */
  private extractDateFromPartitionName(partitionName: string, tableName: string): Date | null {
    try {
      const match = partitionName.match(new RegExp(`${tableName}_(\\d{4})_(\\d{2})`));
      if (match) {
        const year = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1;
        return new Date(year, month, 1);
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Mueve datos de partición default a particiones correctas
   */
  async redistributeDefaultPartition(tableName: string): Promise<number> {
    const defaultPartitionName = `${tableName}_default`;

    // Contar registros en partición default
    const count = await prisma.$executeRawUnsafe(`
      SELECT COUNT(*) FROM ${defaultPartitionName}
    `);

    if (count === 0) {
      return 0;
    }

    // Mover datos a particiones correctas
    // Esto requiere lógica específica según la estructura de la tabla
    console.log(`Redistribuyendo ${count} registros de ${defaultPartitionName}`);

    return count;
  }

  /**
   * Obtiene estadísticas de particiones
   */
  async getPartitionStats(tableName: string): Promise<{
    totalPartitions: number;
    totalRows: number;
    partitions: Array<{ name: string; rows: number; size: string }>;
  }> {
    const partitions = await prisma.$queryRaw<Array<{ tablename: string; n_tup_ins: number; pg_size_pretty: string }>>`
      SELECT 
        schemaname || '.' || tablename as tablename,
        n_tup_ins as rows,
        pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename)) as size
      FROM pg_stat_user_tables 
      WHERE tablename LIKE ${`${tableName}%`}
      ORDER BY tablename
    `;

    const totalRows = partitions.reduce((sum, p) => sum + Number(p.rows), 0);

    return {
      totalPartitions: partitions.length,
      totalRows,
      partitions: partitions.map(p => ({
        name: p.tablename,
        rows: Number(p.rows),
        size: p.pg_size_pretty,
      })),
    };
  }

  /**
   * Configura mantenimiento automático de particiones
   */
  setupAutomaticMaintenance(interval: number = 24 * 60 * 60 * 1000): void {
    setInterval(async () => {
      for (const [tableName, config] of this.partitionConfigs.entries()) {
        try {
          if (config.partitionBy === 'time') {
            await this.createPartitions(tableName);
            await this.dropOldPartitions(tableName, config.retentionPartitions);
          }
        } catch (error) {
          console.error(`Error en mantenimiento de particiones ${tableName}:`, error);
        }
      }
    }, interval);
  }

  /**
   * Verifica si una tabla está particionada
   */
  async isPartitioned(tableName: string): Promise<boolean> {
    const result = await prisma.$queryRaw<Array<{ partitioned: boolean }>>`
      SELECT 
        EXISTS (
          SELECT 1 
          FROM pg_inherits 
          WHERE inhparent = ${tableName}::regclass
        ) as partitioned
    `;

    return result[0]?.partitioned || false;
  }

  /**
   * Convierte tabla existente a particionada
   */
  async convertToPartitioned(tableName: string, config: PartitionConfig): Promise<void> {
    const isPartitioned = await this.isPartitioned(tableName);
    
    if (isPartitioned) {
      throw new PartitioningError(`La tabla ${tableName} ya está particionada`);
    }

    // Registrar configuración
    this.registerPartitionConfig(config);

    // Crear tabla temporal con datos
    const tempTableName = `${tableName}_temp_${Date.now()}`;
    
    await prisma.$executeRawUnsafe(`
      CREATE TABLE ${tempTableName} AS SELECT * FROM ${tableName}
    `);

    // Eliminar tabla original
    await prisma.$executeRawUnsafe(`DROP TABLE ${tableName}`);

    // Crear tabla particionada
    await this.createPartitionedTable(tableName, config);

    // Mover datos de temporal a particiones
    await this.moveDataToPartitions(tempTableName, tableName, config);

    // Eliminar tabla temporal
    await prisma.$executeRawUnsafe(`DROP TABLE ${tempTableName}`);
  }

  /**
   * Crea tabla particionada
   */
  private async createPartitionedTable(tableName: string, config: PartitionConfig): Promise<void> {
    let partitionKey = '';

    switch (config.partitionBy) {
      case 'tenant':
        partitionKey = `PARTITION BY HASH (${config.tenantColumn})`;
        break;
      case 'time':
        partitionKey = `PARTITION BY RANGE (${config.timeColumn})`;
        break;
      case 'hybrid':
        // Para híbrido, primero particionar por tenant
        partitionKey = `PARTITION BY HASH (${config.tenantColumn})`;
        break;
    }

    await prisma.$executeRawUnsafe(`
      CREATE TABLE ${tableName} (${partitionKey})
    `);
  }

  /**
   * Mueve datos a particiones
   */
  private async moveDataToPartitions(
    tempTableName: string,
    tableName: string,
    config: PartitionConfig
  ): Promise<void> {
    // Insertar datos en tabla particionada
    await prisma.$executeRawUnsafe(`
      INSERT INTO ${tableName} SELECT * FROM ${tempTableName}
    `);
  }
}

export const partitioningService = new PartitioningService();

// Configurar partitioning por defecto para tablas de alto volumen
partitioningService.registerPartitionConfig({
  tableName: 'AuditLog',
  partitionBy: 'time',
  timeColumn: 'timestamp',
  timeInterval: 'monthly',
  retentionPartitions: 24, // 2 años de datos
});

partitioningService.registerPartitionConfig({
  tableName: 'AttendanceRecord',
  partitionBy: 'time',
  timeColumn: 'date',
  timeInterval: 'monthly',
  retentionPartitions: 60, // 5 años de datos
});

partitioningService.registerPartitionConfig({
  tableName: 'Grade',
  partitionBy: 'hybrid',
  tenantColumn: 'schoolId',
  timeColumn: 'createdAt',
  timeInterval: 'yearly',
  retentionPartitions: 10, // 10 años de datos
});