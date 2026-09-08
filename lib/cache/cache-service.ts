/**
 * Servicio de Caching Distribuido
 * Implementa patrones de caching avanzados para multi-tenancy
 */

import { redisClient } from './redis-client';

export interface CacheOptions {
  ttl?: number;           // Time to live en segundos
  namespace?: string;     // Namespace para aislar caché por tenant
  tags?: string[];        // Tags para invalidación por grupo
}

export interface CacheResult<T> {
  data: T | null;
  hit: boolean;
}

const DEFAULT_TTL = 300; // 5 minutos por defecto

/**
 * Genera clave de caché con namespace y tags
 */
function generateKey(key: string, namespace?: string): string {
  if (namespace) {
    return `${namespace}:${key}`;
  }
  return key;
}

/**
 * Servicio de Caching con patrones avanzados
 */
export class CacheService {
  /**
   * Obtiene valor del caché
   */
  async get<T>(key: string, options: CacheOptions = {}): Promise<CacheResult<T>> {
    try {
      const client = redisClient.getClient();
      if (!redisClient.isReady()) {
        return { data: null, hit: false };
      }

      const cacheKey = generateKey(key, options.namespace);
      const cached = await client.get(cacheKey);

      if (cached) {
        return {
          data: JSON.parse(cached) as T,
          hit: true,
        };
      }

      return { data: null, hit: false };
    } catch (error) {
      console.error('Error al obtener del caché:', error);
      return { data: null, hit: false };
    }
  }

  /**
   * Guarda valor en caché
   */
  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    try {
      const client = redisClient.getClient();
      if (!redisClient.isReady()) {
        return;
      }

      const cacheKey = generateKey(key, options.namespace);
      const ttl = options.ttl || DEFAULT_TTL;

      // Guardar datos
      await client.setex(cacheKey, ttl, JSON.stringify(value));

      // Guardar tags si existen
      if (options.tags && options.tags.length > 0) {
        for (const tag of options.tags) {
          await client.sadd(`tag:${tag}`, cacheKey);
        }
      }
    } catch (error) {
      console.error('Error al guardar en caché:', error);
    }
  }

  /**
   * Elimina valor del caché
   */
  async delete(key: string, options: CacheOptions = {}): Promise<void> {
    try {
      const client = redisClient.getClient();
      if (!redisClient.isReady()) {
        return;
      }

      const cacheKey = generateKey(key, options.namespace);
      await client.del(cacheKey);
    } catch (error) {
      console.error('Error al eliminar del caché:', error);
    }
  }

  /**
   * Invalida caché por tags
   */
  async invalidateByTag(tag: string): Promise<void> {
    try {
      const client = redisClient.getClient();
      if (!redisClient.isReady()) {
        return;
      }

      const keys = await client.smembers(`tag:${tag}`);
      if (keys.length > 0) {
        await client.del(...keys);
        await client.del(`tag:${tag}`);
      }
    } catch (error) {
      console.error('Error al invalidar por tag:', error);
    }
  }

  /**
   * Invalida caché por namespace (tenant)
   */
  async invalidateNamespace(namespace: string): Promise<void> {
    try {
      const client = redisClient.getClient();
      if (!redisClient.isReady()) {
        return;
      }

      const pattern = `${namespace}:*`;
      const keys = await client.keys(pattern);
      
      if (keys.length > 0) {
        await client.del(...keys);
      }
    } catch (error) {
      console.error('Error al invalidar namespace:', error);
    }
  }

  /**
   * Pattern cache - get or set
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const cached = await this.get<T>(key, options);
    
    if (cached.hit && cached.data !== null) {
      return cached.data;
    }

    const value = await factory();
    await this.set(key, value, options);
    
    return value;
  }

  /**
   * Cache con stampede protection (prevenir thundering herd)
   */
  async getOrSetWithLock<T>(
    key: string,
    factory: () => Promise<T>,
    options: CacheOptions = {},
    lockTimeout: number = 10
  ): Promise<T> {
    const cacheKey = generateKey(key, options.namespace);
    const lockKey = `lock:${cacheKey}`;
    const client = redisClient.getClient();

    if (!redisClient.isReady()) {
      return await factory();
    }

    try {
      // Intentar obtener lock
      const lockAcquired = await client.set(lockKey, '1', 'PX', lockTimeout * 1000, 'NX');
      
      if (lockAcquired) {
        try {
          // Lock adquirido, ejecutar factory
          const value = await factory();
          await this.set(key, value, options);
          return value;
        } finally {
          // Liberar lock
          await client.del(lockKey);
        }
      } else {
        // Lock no adquirido, esperar y reintentar obtener del caché
        await new Promise(resolve => setTimeout(resolve, 100));
        const cached = await this.get<T>(key, options);
        
        if (cached.hit && cached.data !== null) {
          return cached.data;
        }
        
        // Fallback: ejecutar factory sin lock
        return await factory();
      }
    } catch (error) {
      console.error('Error en cache con lock:', error);
      return await factory();
    }
  }

  /**
   * Incrementa un contador (útil para rate limiting)
   */
  async increment(key: string, options: CacheOptions = {}): Promise<number> {
    try {
      const client = redisClient.getClient();
      if (!redisClient.isReady()) {
        return 0;
      }

      const cacheKey = generateKey(key, options.namespace);
      return await client.incr(cacheKey);
    } catch (error) {
      console.error('Error al incrementar contador:', error);
      return 0;
    }
  }

  /**
   * Incrementa con expiración
   */
  async incrementWithExpiry(
    key: string,
    expiry: number,
    options: CacheOptions = {}
  ): Promise<number> {
    try {
      const client = redisClient.getClient();
      if (!redisClient.isReady()) {
        return 0;
      }

      const cacheKey = generateKey(key, options.namespace);
      const result = await client.incr(cacheKey);
      
      if (result === 1) {
        await client.expire(cacheKey, expiry);
      }
      
      return result;
    } catch (error) {
      console.error('Error al incrementar con expiración:', error);
      return 0;
    }
  }

  /**
   * Obtiene múltiples claves en batch
   */
  async getMany<T>(keys: string[], options: CacheOptions = {}): Promise<Map<string, T>> {
    try {
      const client = redisClient.getClient();
      if (!redisClient.isReady()) {
        return new Map();
      }

      const cacheKeys = keys.map(key => generateKey(key, options.namespace));
      const values = await client.mget(...cacheKeys);
      
      const result = new Map<string, T>();
      keys.forEach((key, index) => {
        if (values[index]) {
          result.set(key, JSON.parse(values[index] as string) as T);
        }
      });
      
      return result;
    } catch (error) {
      console.error('Error al obtener múltiples claves:', error);
      return new Map();
    }
  }

  /**
   * Guarda múltiples claves en batch
   */
  async setMany<T>(
    entries: Map<string, T>,
    options: CacheOptions = {}
  ): Promise<void> {
    try {
      const client = redisClient.getClient();
      if (!redisClient.isReady()) {
        return;
      }

      const pipeline = client.pipeline();
      const ttl = options.ttl || DEFAULT_TTL;

      for (const [key, value] of entries.entries()) {
        const cacheKey = generateKey(key, options.namespace);
        pipeline.setex(cacheKey, ttl, JSON.stringify(value));
      }

      await pipeline.exec();
    } catch (error) {
      console.error('Error al guardar múltiples claves:', error);
    }
  }
}

export const cacheService = new CacheService();