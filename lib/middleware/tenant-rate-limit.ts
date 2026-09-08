/**
 * Rate Limiting por Tenant y Quotas
 * Sistema avanzado de limitación de recursos por cliente
 */

import { redisClient } from '@/lib/cache/redis-client';
import { prisma } from '@/lib/db/prisma';

export interface TenantRateLimitConfig {
  tenantId: string;
  requestsPerMinute?: number;
  requestsPerHour?: number;
  requestsPerDay?: number;
  concurrentConnections?: number;
  customLimits?: Record<string, number>;
}

export interface QuotaConfig {
  tenantId: string;
  resource: string;
  limit: number;
  period: 'minute' | 'hour' | 'day' | 'month';
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  limit: number;
  currentUsage: number;
}

export class TenantRateLimitError extends Error {
  constructor(
    message: string,
    public retryAfter: number,
    public quotaName?: string
  ) {
    super(message);
    this.name = 'TenantRateLimitError';
  }
}

/**
 * Servicio de Rate Limiting por Tenant
 */
export class TenantRateLimitService {
  /**
   * Verifica rate limit por tenant
   */
  async checkTenantRateLimit(
    tenantId: string,
    config: Partial<TenantRateLimitConfig> = {}
  ): Promise<RateLimitResult> {
    try {
      const client = redisClient.getClient();
      if (!redisClient.isReady()) {
        // Fallback: permitir todas las solicitudes si Redis no está disponible
        return {
          allowed: true,
          remaining: Number.MAX_SAFE_INTEGER,
          resetTime: Date.now() + 60000,
          limit: Number.MAX_SAFE_INTEGER,
          currentUsage: 0,
        };
      }

      const now = Date.now();
      const minuteKey = `ratelimit:${tenantId}:minute`;
      const hourKey = `ratelimit:${tenantId}:hour`;
      const dayKey = `ratelimit:${tenantId}:day`;

      const [
        minuteCount,
        hourCount,
        dayCount,
      ] = await Promise.all([
        this.getCurrentCount(client, minuteKey, 60),
        this.getCurrentCount(client, hourKey, 3600),
        this.getCurrentCount(client, dayKey, 86400),
      ]);

      const minuteLimit = config.requestsPerMinute || 1000;
      const hourLimit = config.requestsPerHour || 10000;
      const dayLimit = config.requestsPerDay || 100000;

      // Verificar límites
      if (minuteCount >= minuteLimit) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: await this.getResetTime(client, minuteKey),
          limit: minuteLimit,
          currentUsage: minuteCount,
        };
      }

      if (hourCount >= hourLimit) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: await this.getResetTime(client, hourKey),
          limit: hourLimit,
          currentUsage: hourCount,
        };
      }

      if (dayCount >= dayLimit) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: await this.getResetTime(client, dayKey),
          limit: dayLimit,
          currentUsage: dayCount,
        };
      }

      // Incrementar contadores
      await Promise.all([
        client.incr(minuteKey),
        client.expire(minuteKey, 60),
        client.incr(hourKey),
        client.expire(hourKey, 3600),
        client.incr(dayKey),
        client.expire(dayKey, 86400),
      ]);

      return {
        allowed: true,
        remaining: Math.min(
          minuteLimit - minuteCount - 1,
          hourLimit - hourCount - 1,
          dayLimit - dayCount - 1
        ),
        resetTime: now + 60000,
        limit: minuteLimit,
        currentUsage: minuteCount + 1,
      };
    } catch (error) {
      console.error('Error en rate limiting por tenant:', error);
      // Fallback: permitir solicitud
      return {
        allowed: true,
        remaining: Number.MAX_SAFE_INTEGER,
        resetTime: Date.now() + 60000,
        limit: Number.MAX_SAFE_INTEGER,
        currentUsage: 0,
      };
    }
  }

  /**
   * Verifica quota específica por recurso
   */
  async checkQuota(
    quota: QuotaConfig
  ): Promise<RateLimitResult> {
    try {
      const client = redisClient.getClient();
      if (!redisClient.isReady()) {
        return {
          allowed: true,
          remaining: Number.MAX_SAFE_INTEGER,
          resetTime: Date.now() + 60000,
          limit: quota.limit,
          currentUsage: 0,
        };
      }

      const periodSeconds = this.getPeriodSeconds(quota.period);
      const key = `quota:${quota.tenantId}:${quota.resource}`;

      const currentCount = await this.getCurrentCount(client, key, periodSeconds);

      if (currentCount >= quota.limit) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: await this.getResetTime(client, key),
          limit: quota.limit,
          currentUsage: currentCount,
        };
      }

      await client.incr(key);
      await client.expire(key, periodSeconds);

      return {
        allowed: true,
        remaining: quota.limit - currentCount - 1,
        resetTime: Date.now() + periodSeconds * 1000,
        limit: quota.limit,
        currentUsage: currentCount + 1,
      };
    } catch (error) {
      console.error('Error en verificación de quota:', error);
      return {
        allowed: true,
        remaining: Number.MAX_SAFE_INTEGER,
        resetTime: Date.now() + 60000,
        limit: quota.limit,
        currentUsage: 0,
      };
    }
  }

  /**
   * Obtiene configuración de rate limit desde base de datos
   */
  async getTenantRateLimitConfig(tenantId: string): Promise<TenantRateLimitConfig> {
    try {
      const school = await prisma.school.findUnique({
        where: { id: tenantId },
        include: { settings: true },
      });

      if (!school || !school.settings) {
        return { tenantId };
      }

      // Aquí se podrían implementar planes tier (Basic, Pro, Enterprise)
      // con diferentes límites según el plan del cliente
      return {
        tenantId,
        requestsPerMinute: 1000, // Valor por defecto
        requestsPerHour: 10000,
        requestsPerDay: 100000,
      };
    } catch (error) {
      console.error('Error al obtener configuración de rate limit:', error);
      return { tenantId };
    }
  }

  /**
   * Obtiene uso actual de recursos del tenant
   */
  async getTenantUsage(tenantId: string): Promise<{
    minute: number;
    hour: number;
    day: number;
    quotas: Record<string, { current: number; limit: number }>;
  }> {
    try {
      const client = redisClient.getClient();
      if (!redisClient.isReady()) {
        return {
          minute: 0,
          hour: 0,
          day: 0,
          quotas: {},
        };
      }

      const [minuteCount, hourCount, dayCount] = await Promise.all([
        this.getCurrentCount(client, `ratelimit:${tenantId}:minute`, 60),
        this.getCurrentCount(client, `ratelimit:${tenantId}:hour`, 3600),
        this.getCurrentCount(client, `ratelimit:${tenantId}:day`, 86400),
      ]);

      return {
        minute: minuteCount,
        hour: hourCount,
        day: dayCount,
        quotas: {},
      };
    } catch (error) {
      console.error('Error al obtener uso del tenant:', error);
      return {
        minute: 0,
        hour: 0,
        day: 0,
        quotas: {},
      };
    }
  }

  /**
   * Resetea contadores de rate limit (admin only)
   */
  async resetTenantRateLimit(tenantId: string): Promise<void> {
    try {
      const client = redisClient.getClient();
      if (!redisClient.isReady()) {
        return;
      }

      const keys = [
        `ratelimit:${tenantId}:minute`,
        `ratelimit:${tenantId}:hour`,
        `ratelimit:${tenantId}:day`,
      ];

      await client.del(...keys);
    } catch (error) {
      console.error('Error al resetear rate limit:', error);
    }
  }

  /**
   * Obtiene count actual con manejo de expiración
   */
  private async getCurrentCount(client: any, key: string, ttl: number): Promise<number> {
    const count = await client.get(key);
    if (count === null) {
      return 0;
    }
    return parseInt(count, 10);
  }

  /**
   * Obtiene tiempo de reset para una clave
   */
  private async getResetTime(client: any, key: string): Promise<number> {
    const ttl = await client.ttl(key);
    return Date.now() + (ttl * 1000);
  }

  /**
   * Convierte período a segundos
   */
  private getPeriodSeconds(period: string): number {
    switch (period) {
      case 'minute':
        return 60;
      case 'hour':
        return 3600;
      case 'day':
        return 86400;
      case 'month':
        return 2592000; // 30 días
      default:
        return 60;
    }
  }
}

export const tenantRateLimitService = new TenantRateLimitService();