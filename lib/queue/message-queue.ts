/**
 * Message Queue para procesamiento asíncrono
 * Sistema de colas para tareas en background
 */

import { redisClient } from '@/lib/cache/redis-client';

export interface Job<T = any> {
  id: string;
  type: string;
  payload: T;
  priority: number;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  scheduledAt?: Date;
  metadata?: Record<string, any>;
}

export interface JobResult<T = any> {
  success: boolean;
  result?: T;
  error?: Error;
  jobId: string;
}

export interface QueueOptions {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
  priority?: number;
}

export class MessageQueue {
  private queues: Map<string, any> = new Map();
  private processors: Map<string, (job: Job) => Promise<any>> = new Map();
  private isProcessing: boolean = false;

  /**
   * Crea una nueva cola
   */
  createQueue(name: string): void {
    if (!this.queues.has(name)) {
      this.queues.set(name, {
        name,
        jobs: [],
        processing: false,
      });
    }
  }

  /**
   * Registra un processor para un tipo de job
   */
  processor(jobType: string, handler: (job: Job) => Promise<any>): void {
    this.processors.set(jobType, handler);
  }

  /**
   * Agrega un job a la cola
   */
  async add<T>(
    queueName: string,
    jobType: string,
    payload: T,
    options: QueueOptions = {}
  ): Promise<string> {
    try {
      const client = redisClient.getClient();
      if (!redisClient.isReady()) {
        throw new Error('Redis no está disponible');
      }

      const job: Job = {
        id: this.generateJobId(),
        type: jobType,
        payload,
        priority: options.priority || 0,
        attempts: 0,
        maxAttempts: options.maxRetries || 3,
        createdAt: new Date(),
        metadata: options,
      };

      const jobKey = `queue:${queueName}:job:${job.id}`;
      const queueKey = `queue:${queueName}:pending`;

      // Guardar job
      await client.setex(jobKey, 3600, JSON.stringify(job));

      // Agregar a la cola (sorted set por prioridad y timestamp)
      const score = -(job.priority * 1000000 + Date.now());
      await client.zadd(queueKey, score, job.id);

      return job.id;
    } catch (error) {
      console.error('Error al agregar job a la cola:', error);
      throw error;
    }
  }

  /**
   * Agrega un job programado
   */
  async addScheduled<T>(
    queueName: string,
    jobType: string,
    payload: T,
    scheduledAt: Date,
    options: QueueOptions = {}
  ): Promise<string> {
    try {
      const client = redisClient.getClient();
      if (!redisClient.isReady()) {
        throw new Error('Redis no está disponible');
      }

      const job: Job = {
        id: this.generateJobId(),
        type: jobType,
        payload,
        priority: options.priority || 0,
        attempts: 0,
        maxAttempts: options.maxRetries || 3,
        createdAt: new Date(),
        scheduledAt,
        metadata: options,
      };

      const jobKey = `queue:${queueName}:scheduled:${job.id}`;
      const scheduleKey = `queue:${queueName}:schedule`;

      // Guardar job programado
      await client.setex(jobKey, 86400, JSON.stringify(job));

      // Agregar a la cola de programación (sorted set por timestamp)
      const score = scheduledAt.getTime();
      await client.zadd(scheduleKey, score, job.id);

      return job.id;
    } catch (error) {
      console.error('Error al agregar job programado:', error);
      throw error;
    }
  }

  /**
   * Procesa jobs de una cola
   */
  async processQueue(queueName: string, batchSize: number = 10): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      const client = redisClient.getClient();
      if (!redisClient.isReady()) {
        return;
      }

      while (true) {
        // Mover jobs programados que ya están listos
        await this.moveScheduledJobs(queueName);

        // Obtener jobs pendientes
        const jobIds = await client.zrange(`queue:${queueName}:pending`, 0, batchSize - 1);

        if (jobIds.length === 0) {
          break;
        }

        // Remover jobs de la cola pendiente
        await client.zremrangebyrank(`queue:${queueName}:pending`, 0, batchSize - 1);

        // Procesar cada job
        for (const jobId of jobIds) {
          await this.processJob(queueName, jobId);
        }
      }
    } catch (error) {
      console.error('Error procesando cola:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Mueve jobs programados que ya están listos a la cola pendiente
   */
  private async moveScheduledJobs(queueName: string): Promise<void> {
    try {
      const client = redisClient.getClient();
      if (!redisClient.isReady()) {
        return;
      }

      const now = Date.now();
      const scheduleKey = `queue:${queueName}:schedule`;
      const pendingKey = `queue:${queueName}:pending`;

      // Obtener jobs que ya están listos
      const readyJobs = await client.zrangebyscore(scheduleKey, 0, now);

      if (readyJobs.length === 0) {
        return;
      }

      // Mover jobs a la cola pendiente
      for (const jobId of readyJobs) {
        const jobKey = `queue:${queueName}:scheduled:${jobId}`;
        const jobData = await client.get(jobKey);

        if (jobData) {
          const job = JSON.parse(jobData) as Job;
          const newJobKey = `queue:${queueName}:job:${jobId}`;

          // Mover job
          await client.setex(newJobKey, 3600, JSON.stringify(job));
          await client.del(jobKey);

          // Agregar a cola pendiente
          const score = -(job.priority * 1000000 + Date.now());
          await client.zadd(pendingKey, score, jobId);
        }

        // Remover de cola de programación
        await client.zrem(scheduleKey, jobId);
      }
    } catch (error) {
      console.error('Error moviendo jobs programados:', error);
    }
  }

  /**
   * Procesa un job individual
   */
  private async processJob(queueName: string, jobId: string): Promise<void> {
    try {
      const client = redisClient.getClient();
      if (!redisClient.isReady()) {
        return;
      }

      const jobKey = `queue:${queueName}:job:${jobId}`;
      const jobData = await client.get(jobKey);

      if (!jobData) {
        return;
      }

      const job = JSON.parse(jobData) as Job;
      const processor = this.processors.get(job.type);

      if (!processor) {
        console.error(`No hay processor para job type: ${job.type}`);
        await this.moveToDead(queueName, job, 'No processor found');
        return;
      }

      // Marcar como procesando
      const processingKey = `queue:${queueName}:processing:${jobId}`;
      await client.setex(processingKey, 300, JSON.stringify(job));
      await client.del(jobKey);

      try {
        // Ejecutar processor
        const result = await processor(job);

        // Remover de procesando
        await client.del(processingKey);

        // Guardar resultado exitoso
        await this.saveResult(queueName, jobId, { success: true, result, jobId });
      } catch (error) {
        // Manejar error
        await client.del(processingKey);

        job.attempts++;

        if (job.attempts >= job.maxAttempts) {
          await this.moveToDead(queueName, job, error);
        } else {
          // Reintentar con delay
          const retryDelay = job.metadata?.retryDelay || 5000;
          setTimeout(() => {
            this.retryJob(queueName, job);
          }, retryDelay);
        }
      }
    } catch (error) {
      console.error('Error procesando job:', error);
    }
  }

  /**
   * Reintenta un job fallido
   */
  private async retryJob(queueName: string, job: Job): Promise<void> {
    try {
      const client = redisClient.getClient();
      if (!redisClient.isReady()) {
        return;
      }

      const jobKey = `queue:${queueName}:job:${job.id}`;
      const queueKey = `queue:${queueName}:pending`;

      await client.setex(jobKey, 3600, JSON.stringify(job));

      const score = -(job.priority * 1000000 + Date.now());
      await client.zadd(queueKey, score, job.id);
    } catch (error) {
      console.error('Error al reintentar job:', error);
    }
  }

  /**
   * Mueve un job a la cola de muertos
   */
  private async moveToDead(queueName: string, job: Job, error: any): Promise<void> {
    try {
      const client = redisClient.getClient();
      if (!redisClient.isReady()) {
        return;
      }

      const deadKey = `queue:${queueName}:dead:${job.id}`;
      const deadQueueKey = `queue:${queueName}:dead`;

      await client.setex(deadKey, 604800, JSON.stringify({
        ...job,
        error: error instanceof Error ? error.message : String(error),
        failedAt: new Date(),
      }));

      await client.zadd(deadQueueKey, Date.now(), job.id);
    } catch (error) {
      console.error('Error moviendo job a dead queue:', error);
    }
  }

  /**
   * Guarda resultado de un job
   */
  private async saveResult(queueName: string, jobId: string, result: JobResult): Promise<void> {
    try {
      const client = redisClient.getClient();
      if (!redisClient.isReady()) {
        return;
      }

      const resultKey = `queue:${queueName}:result:${jobId}`;
      await client.setex(resultKey, 86400, JSON.stringify(result));
    } catch (error) {
      console.error('Error guardando resultado:', error);
    }
  }

  /**
   * Obtiene resultado de un job
   */
  async getResult(queueName: string, jobId: string): Promise<JobResult | null> {
    try {
      const client = redisClient.getClient();
      if (!redisClient.isReady()) {
        return null;
      }

      const resultKey = `queue:${queueName}:result:${jobId}`;
      const resultData = await client.get(resultKey);

      if (!resultData) {
        return null;
      }

      return JSON.parse(resultData) as JobResult;
    } catch (error) {
      console.error('Error obteniendo resultado:', error);
      return null;
    }
  }

  /**
   * Obtiene estadísticas de una cola
   */
  async getQueueStats(queueName: string): Promise<{
    pending: number;
    processing: number;
    scheduled: number;
    dead: number;
  }> {
    try {
      const client = redisClient.getClient();
      if (!redisClient.isReady()) {
        return {
          pending: 0,
          processing: 0,
          scheduled: 0,
          dead: 0,
        };
      }

      const [pending, processing, scheduled, dead] = await Promise.all([
        client.zcard(`queue:${queueName}:pending`),
        client.keys(`queue:${queueName}:processing:*`).then(keys => keys.length),
        client.zcard(`queue:${queueName}:schedule`),
        client.zcard(`queue:${queueName}:dead`),
      ]);

      return {
        pending,
        processing,
        scheduled,
        dead,
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return {
        pending: 0,
        processing: 0,
        scheduled: 0,
        dead: 0,
      };
    }
  }

  /**
   * Genera un ID único para el job
   */
  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Inicia procesamiento automático de una cola
   */
  startProcessing(queueName: string, interval: number = 5000): void {
    const process = async () => {
      await this.processQueue(queueName);
    };

    // Procesar inmediatamente
    process();

    // Programar procesamiento periódico
    setInterval(process, interval);
  }
}

export const messageQueue = new MessageQueue();