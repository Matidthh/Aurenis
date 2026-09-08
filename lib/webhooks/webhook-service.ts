/**
 * Servicio de Webhooks para integraciones con clientes
 * Permite que los clientes reciban notificaciones de eventos
 */

import { prisma } from '@/lib/db/prisma';
import { eventBus } from '@/lib/events/event-bus';
import { messageQueue } from '@/lib/queue/message-queue';

export interface WebhookConfig {
  tenantId: string;
  url: string;
  events: string[];
  secret?: string;
  headers?: Record<string, string>;
  active?: boolean;
}

export interface WebhookPayload {
  event: string;
  tenantId: string;
  data: any;
  timestamp: Date;
  eventId: string;
}

export interface WebhookDeliveryResult {
  webhookId: string;
  success: boolean;
  statusCode?: number;
  error?: string;
  deliveredAt: Date;
}

export class WebhookError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WebhookError';
  }
}

/**
 * Servicio de Webhooks
 */
export class WebhookService {
  /**
   * Crea un nuevo webhook
   */
  async createWebhook(config: WebhookConfig): Promise<string> {
    try {
      const webhook = await prisma.webhook.create({
        data: {
          tenantId: config.tenantId,
          url: config.url,
          events: config.events,
          secret: config.secret || this.generateSecret(),
          headers: config.headers || {},
          active: config.active !== false,
        },
      });

      return webhook.id;
    } catch (error) {
      throw new WebhookError(`Error al crear webhook: ${error}`);
    }
  }

  /**
   * Actualiza un webhook existente
   */
  async updateWebhook(webhookId: string, updates: Partial<WebhookConfig>): Promise<void> {
    try {
      await prisma.webhook.update({
        where: { id: webhookId },
        data: {
          ...(updates.url && { url: updates.url }),
          ...(updates.events && { events: updates.events }),
          ...(updates.secret && { secret: updates.secret }),
          ...(updates.headers && { headers: updates.headers }),
          ...(updates.active !== undefined && { active: updates.active }),
        },
      });
    } catch (error) {
      throw new WebhookError(`Error al actualizar webhook: ${error}`);
    }
  }

  /**
   * Elimina un webhook
   */
  async deleteWebhook(webhookId: string): Promise<void> {
    try {
      await prisma.webhook.delete({
        where: { id: webhookId },
      });
    } catch (error) {
      throw new WebhookError(`Error al eliminar webhook: ${error}`);
    }
  }

  /**
   * Obtiene webhooks de un tenant
   */
  async getTenantWebhooks(tenantId: string): Promise<any[]> {
    try {
      return prisma.webhook.findMany({
        where: {
          tenantId,
          active: true,
        },
      });
    } catch (error) {
      throw new WebhookError(`Error al obtener webhooks: ${error}`);
    }
  }

  /**
   * Envía un evento a los webhooks suscritos
   */
  async triggerEvent(event: string, tenantId: string, data: any): Promise<void> {
    try {
      const webhooks = await this.getTenantWebhooks(tenantId);
      const relevantWebhooks = webhooks.filter(wh => 
        wh.events.includes(event) || wh.events.includes('*')
      );

      if (relevantWebhooks.length === 0) {
        return;
      }

      const payload: WebhookPayload = {
        event,
        tenantId,
        data,
        timestamp: new Date(),
        eventId: this.generateEventId(),
      };

      // Enviar a cada webhook en background
      for (const webhook of relevantWebhooks) {
        await messageQueue.add(
          'webhooks',
          'deliver_webhook',
          {
            webhookId: webhook.id,
            payload,
            webhook: {
              url: webhook.url,
              secret: webhook.secret,
              headers: webhook.headers,
            },
          },
          { priority: 1 }
        );
      }
    } catch (error) {
      console.error('Error al trigger evento webhook:', error);
    }
  }

  /**
   * Entrega un webhook (ejecutado por message queue)
   */
  async deliverWebhook(webhookId: string, payload: WebhookPayload): Promise<WebhookDeliveryResult> {
    try {
      const webhook = await prisma.webhook.findUnique({
        where: { id: webhookId },
      });

      if (!webhook || !webhook.active) {
        return {
          webhookId,
          success: false,
          error: 'Webhook no encontrado o inactivo',
          deliveredAt: new Date(),
        };
      }

      // Preparar headers
      const headers = {
        'Content-Type': 'application/json',
        'X-Webhook-Event': payload.event,
        'X-Webhook-Id': payload.eventId,
        'X-Webhook-Timestamp': payload.timestamp.toISOString(),
        'X-Webhook-Signature': this.generateSignature(payload, webhook.secret),
        ...((typeof webhook.headers === 'object' && webhook.headers !== null && !Array.isArray(webhook.headers)) ? (webhook.headers as Record<string, string>) : {}),
      };

      // Enviar request
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const result: WebhookDeliveryResult = {
        webhookId,
        success: response.ok,
        statusCode: response.status,
        deliveredAt: new Date(),
      };

      if (!response.ok) {
        result.error = `HTTP ${response.status}: ${response.statusText}`;
      }

      // Registrar delivery
      await this.recordDelivery(webhookId, payload.eventId, result);

      return result;
    } catch (error) {
      const result: WebhookDeliveryResult = {
        webhookId,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        deliveredAt: new Date(),
      };

      await this.recordDelivery(webhookId, payload.eventId, result);

      return result;
    }
  }

  /**
   * Registra un delivery de webhook
   */
  private async recordDelivery(
    webhookId: string,
    eventId: string,
    result: WebhookDeliveryResult
  ): Promise<void> {
    try {
      await prisma.webhookDelivery.create({
        data: {
          webhookId,
          eventId,
          success: result.success,
          statusCode: result.statusCode,
          error: result.error,
          deliveredAt: result.deliveredAt,
        },
      });
    } catch (error) {
      console.error('Error al registrar delivery:', error);
    }
  }

  /**
   * Obtiene historial de deliveries de un webhook
   */
  async getWebhookDeliveries(
    webhookId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<any[]> {
    try {
      return prisma.webhookDelivery.findMany({
        where: { webhookId },
        orderBy: { deliveredAt: 'desc' },
        take: limit,
        skip: offset,
      });
    } catch (error) {
      throw new WebhookError(`Error al obtener deliveries: ${error}`);
    }
  }

  /**
   * Reenvía un webhook fallido
   */
  async redeliverWebhook(deliveryId: string): Promise<WebhookDeliveryResult> {
    try {
      const delivery = await prisma.webhookDelivery.findUnique({
        where: { id: deliveryId },
        include: { webhook: true },
      });

      if (!delivery) {
        throw new WebhookError('Delivery no encontrado');
      }

      // Reconstruir payload original (simplificado)
      const payload: WebhookPayload = {
        event: delivery.eventType || 'unknown',
        tenantId: delivery.webhook.tenantId,
        data: delivery.payload || {},
        timestamp: new Date(),
        eventId: this.generateEventId(),
      };

      return await this.deliverWebhook(delivery.webhookId, payload);
    } catch (error) {
      throw new WebhookError(`Error al reenviar webhook: ${error}`);
    }
  }

  /**
   * Verifica la firma de un webhook (para webhooks entrantes)
   */
  verifySignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = this.generateSignature(
      JSON.parse(payload),
      secret
    );
    return signature === expectedSignature;
  }

  /**
   * Genera firma HMAC para webhook
   */
  private generateSignature(payload: any, secret: string): string {
    const crypto = require('crypto');
    const payloadString = JSON.stringify(payload);
    return crypto
      .createHmac('sha256', secret)
      .update(payloadString)
      .digest('hex');
  }

  /**
   * Genera un secreto para webhook
   */
  private generateSecret(): string {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Genera un ID único para evento
   */
  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Configura webhooks automáticos para eventos del sistema
   */
  setupAutomaticWebhooks(): void {
    // Suscribir a eventos del event bus y trigger webhooks
    eventBus.use(async (event, next) => {
      await next();

      // Trigger webhooks para eventos específicos
      if (this.shouldTriggerWebhook(event.type)) {
        const tenantId = event.metadata?.tenantId || event.payload?.tenantId;
        if (tenantId) {
          await this.triggerEvent(event.type, tenantId, event.payload);
        }
      }
    });
  }

  /**
   * Determina si un evento debe trigger webhooks
   */
  private shouldTriggerWebhook(eventType: string): boolean {
    const webhookEvents = [
      'user.created',
      'user.updated',
      'enrollment.created',
      'grade.created',
      'grade.updated',
      'attendance.recorded',
      'school.created',
      'school.updated',
    ];

    return webhookEvents.some(pattern => 
      eventType === pattern || eventType.startsWith(pattern.split('.')[0])
    );
  }
}

// Agregar modelos al schema de Prisma (esto debería ir en schema.prisma)
/*
model Webhook {
  id        String   @id @default(cuid())
  tenantId  String
  url       String
  events    String[]
  secret    String
  headers   Json?
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  deliveries WebhookDelivery[]

  @@index([tenantId])
  @@index([active])
}

model WebhookDelivery {
  id         String   @id @default(cuid())
  webhookId  String
  eventId    String
  eventType String?
  payload    Json?
  success    Boolean
  statusCode Int?
  error      String?
  deliveredAt DateTime @default(now())

  webhook    Webhook  @relation(fields: [webhookId], references: [id], onDelete: Cascade)

  @@index([webhookId])
  @@index([eventId])
  @@index([success])
}
*/

export const webhookService = new WebhookService();