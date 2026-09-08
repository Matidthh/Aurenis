/**
 * Gestor de Read Replicas y Connection Pooling
 * Sistema para escalabilidad de lectura y conexión eficiente
 */

import { PrismaClient } from '@prisma/client';

export interface ReplicaConfig {
  url: string;
  name: string;
  priority: number;
  region?: string;
  lagTolerance?: number; // Segundos de lag aceptable
}

export interface ConnectionPoolConfig {
  minConnections: number;
  maxConnections: number;
  connectionTimeout: number;
  idleTimeout: number;
  maxLifetime: number;
}

export class ReplicaManagerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReplicaManagerError';
  }
}

/**
 * Gestor de Read Replicas
 */
export class ReplicaManager {
  private writeClient: PrismaClient;
  private readClients: Map<string, PrismaClient> = new Map();
  private replicaConfigs: Map<string, ReplicaConfig> = new Map();
  private currentReplicaIndex: number = 0;
  private healthChecks: Map<string, boolean> = new Map();

  constructor(writeUrl: string, poolConfig?: ConnectionPoolConfig) {
    this.writeClient = new PrismaClient({
      datasources: {
        db: {
          url: writeUrl,
        },
      },
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
      ...this.buildPoolConfig(poolConfig),
    });
  }

  /**
   * Agrega una réplica de lectura
   */
  addReadReplica(config: ReplicaConfig): void {
    const client = new PrismaClient({
      datasources: {
        db: {
          url: config.url,
        },
      },
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });

    this.readClients.set(config.name, client);
    this.replicaConfigs.set(config.name, config);
    this.healthChecks.set(config.name, true);

    // Iniciar health check
    this.startHealthCheck(config.name);
  }

  /**
   * Obtiene cliente para escritura
   */
  getWriteClient(): PrismaClient {
    return this.writeClient;
  }

  /**
   * Obtiene cliente para lectura (load balancing)
   */
  getReadClient(): PrismaClient {
    const healthyReplicas = Array.from(this.readClients.entries())
      .filter(([name]) => this.healthChecks.get(name))
      .sort(([, a], [, b]) => {
        const configA = this.replicaConfigs.get(a.name || '');
        const configB = this.replicaConfigs.get(b.name || '');
        return (configB?.priority || 0) - (configA?.priority || 0);
      });

    if (healthyReplicas.length === 0) {
      // Fallback a cliente de escritura
      return this.writeClient;
    }

    // Round-robin entre réplicas saludables
    const replica = healthyReplicas[this.currentReplicaIndex % healthyReplicas.length];
    this.currentReplicaIndex++;

    return replica[1];
  }

  /**
   * Obtiene cliente por nombre específico
   */
  getReplicaByName(name: string): PrismaClient | null {
    const client = this.readClients.get(name);
    if (!client || !this.healthChecks.get(name)) {
      return null;
    }
    return client;
  }

  /**
   * Obtiene réplica más cercana a una región
   */
  getReplicaByRegion(region: string): PrismaClient | null {
    const regionalReplicas = Array.from(this.replicaConfigs.entries())
      .filter(([name, config]) => 
        config.region === region && this.healthChecks.get(name)
      )
      .sort(([, a], [, b]) => b.priority - a.priority);

    if (regionalReplicas.length === 0) {
      return this.getReadClient();
    }

    return this.readClients.get(regionalReplicas[0][0]) || null;
  }

  /**
   * Verifica salud de una réplica
   */
  private async checkReplicaHealth(name: string): Promise<boolean> {
    try {
      const client = this.readClients.get(name);
      if (!client) return false;

      // Query simple para verificar conexión
      await client.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error(`Health check failed for replica ${name}:`, error);
      return false;
    }
  }

  /**
   * Inicia health check periódico
   */
  private startHealthCheck(name: string): void {
    setInterval(async () => {
      const isHealthy = await this.checkReplicaHealth(name);
      this.healthChecks.set(name, isHealthy);

      if (!isHealthy) {
        console.warn(`Replica ${name} marked as unhealthy`);
      }
    }, 30000); // 30 segundos
  }

  /**
   * Obtiene estadísticas de réplicas
   */
  async getReplicaStats(): Promise<{
    write: { status: string };
    replicas: Array<{
      name: string;
      status: string;
      priority: number;
      region?: string;
    }>;
  }> {
    const writeStatus = await this.checkReplicaHealth('write');

    const replicaStats = Array.from(this.replicaConfigs.entries()).map(([name, config]) => ({
      name,
      status: this.healthChecks.get(name) ? 'healthy' : 'unhealthy',
      priority: config.priority,
      region: config.region,
    }));

    return {
      write: { status: writeStatus ? 'healthy' : 'unhealthy' },
      replicas: replicaStats,
    };
  }

  /**
   * Construye configuración de connection pool
   */
  private buildPoolConfig(config?: ConnectionPoolConfig): any {
    if (!config) return {};

    return {
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      // Connection pool configuration para Prisma
      // Nota: Prisma maneja connection pooling internamente,
      // pero puedes configurar timeouts y límites
    };
  }

  /**
   * Cierra todas las conexiones
   */
  async disconnect(): Promise<void> {
    await this.writeClient.$disconnect();

    for (const client of this.readClients.values()) {
      await client.$disconnect();
    }

    this.readClients.clear();
    this.replicaConfigs.clear();
    this.healthChecks.clear();
  }

  /**
   * Ejecuta query en réplica específica con fallback
   */
  async queryOnReplica<T>(
    replicaName: string,
    query: (client: PrismaClient) => Promise<T>,
    fallbackToWrite: boolean = true
  ): Promise<T> {
    const replica = this.getReplicaByName(replicaName);

    if (replica) {
      try {
        return await query(replica);
      } catch (error) {
        console.error(`Query failed on replica ${replicaName}:`, error);
        if (fallbackToWrite) {
          return await query(this.writeClient);
        }
        throw error;
      }
    }

    if (fallbackToWrite) {
      return await query(this.writeClient);
    }

    throw new ReplicaManagerError(`Replica ${replicaName} not available`);
  }

  /**
   * Ejecuta query en réplica más cercana
   */
  async queryOnNearestReplica<T>(
    region: string,
    query: (client: PrismaClient) => Promise<T>
  ): Promise<T> {
    const replica = this.getReplicaByRegion(region);

    if (replica) {
      return await query(replica);
    }

    return await query(this.getReadClient());
  }

  /**
   * Obtiene lag de réplica (si está disponible)
   */
  async getReplicaLag(replicaName: string): Promise<number | null> {
    try {
      const replica = this.readClients.get(replicaName);
      if (!replica) return null;

      // Query para obtener lag de replicación
      const result = await replica.$queryRaw<Array<{ lag_seconds: number }>>`
        SELECT EXTRACT(EPOCH FROM (now() - pg_last_xact_replay_timestamp())) as lag_seconds
      `;

      return result[0]?.lag_seconds || null;
    } catch (error) {
      console.error(`Error getting replica lag for ${replicaName}:`, error);
      return null;
    }
  }

  /**
   * Verifica si una réplica tiene lag aceptable
   */
  async isReplicaLagAcceptable(replicaName: string): Promise<boolean> {
    const config = this.replicaConfigs.get(replicaName);
    const lagTolerance = config?.lagTolerance || 5; // 5 segundos por defecto

    const lag = await this.getReplicaLag(replicaName);
    
    if (lag === null) return true; // No se puede determinar lag, asumir aceptable
    return lag <= lagTolerance;
  }
}

/**
 * Singleton global del gestor de réplicas
 */
let replicaManager: ReplicaManager | null = null;

export function getReplicaManager(): ReplicaManager {
  if (!replicaManager) {
    const writeUrl = process.env.DATABASE_URL || '';
    replicaManager = new ReplicaManager(writeUrl);

    // Agregar réplicas desde variables de entorno
    const replicaUrls = process.env.READ_REPLICA_URLS?.split(',') || [];
    
    replicaUrls.forEach((url, index) => {
      replicaManager!.addReadReplica({
        url: url.trim(),
        name: `replica_${index}`,
        priority: index,
        region: process.env.REPLICA_REGIONS?.split(',')[index],
      });
    });
  }

  return replicaManager;
}

/**
 * Prisma client wrapper que usa réplicas automáticamente
 */
export class PrismaWithReplicas {
  private manager: ReplicaManager;

  constructor() {
    this.manager = getReplicaManager();
  }

  /**
   * Cliente para escritura
   */
  get write() {
    return this.manager.getWriteClient();
  }

  /**
   * Cliente para lectura (con load balancing)
   */
  get read() {
    return this.manager.getReadClient();
  }

  /**
   * Cliente para lectura de réplica específica
   */
  replica(name: string) {
    const replica = this.manager.getReplicaByName(name);
    if (!replica) {
      throw new ReplicaManagerError(`Replica ${name} not found or unhealthy`);
    }
    return replica;
  }

  /**
   * Desconectar todas las conexiones
   */
  async disconnect() {
    await this.manager.disconnect();
  }
}

export const prismaWithReplicas = new PrismaWithReplicas();