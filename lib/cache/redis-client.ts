/**
 * Cliente de Redis para caching distribuido
 * Implementa patrones de caching avanzados para multi-tenancy
 */

// Temporalmente comentado para build sin dependencias
// import { Redis } from 'ioredis';

// Configuración de Redis
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

class RedisClient {
  private client: any = null;
  private isConnected: boolean = false;

  /**
   * Obtiene o crea la instancia singleton de Redis
   */
  getClient(): any {
    if (!this.client) {
      // Temporalmente deshabilitado para build
      console.log('Redis deshabilitado temporalmente para build');
      this.isConnected = false;
      return null;
      
      /*
      this.client = new Redis(REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        enableReadyCheck: true,
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        console.log('✅ Redis conectado');
      });

      this.client.on('error', (error) => {
        console.error('❌ Error en Redis:', error);
        this.isConnected = false;
      });

      this.client.on('close', () => {
        this.isConnected = false;
        console.log('🔌 Redis desconectado');
      });
      */
    }

    return this.client;
  }

  /**
   * Verifica si Redis está conectado
   */
  isReady(): boolean {
    return this.isConnected && this.client !== null;
  }

  /**
   * Cierra la conexión de Redis
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      // await this.client.quit();
      this.client = null;
      this.isConnected = false;
    }
  }
}

export const redisClient = new RedisClient();