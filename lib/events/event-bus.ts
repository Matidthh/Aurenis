/**
 * Event Bus para arquitectura de eventos
 * Sistema de pub/sub para comunicación entre componentes
 */

export interface Event {
  type: string;
  payload: any;
  timestamp: Date;
  id: string;
  metadata?: Record<string, any>;
}

export type EventHandler = (event: Event) => Promise<void> | void;

export class EventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map();
  private middleware: Array<(event: Event, next: () => Promise<void>) => Promise<void>> = [];

  /**
   * Suscribe un handler a un tipo de evento
   */
  on(eventType: string, handler: EventHandler): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    
    this.handlers.get(eventType)!.add(handler);

    // Retornar función para unsuscribir
    return () => {
      this.handlers.get(eventType)?.delete(handler);
    };
  }

  /**
   * Suscribe un handler que se ejecuta solo una vez
   */
  once(eventType: string, handler: EventHandler): () => void {
    const wrapper: EventHandler = async (event) => {
      await handler(event);
      this.handlers.get(eventType)?.delete(wrapper);
    };

    return this.on(eventType, wrapper);
  }

  /**
   * Publica un evento
   */
  async publish(eventType: string, payload: any, metadata?: Record<string, any>): Promise<void> {
    const event: Event = {
      id: this.generateId(),
      type: eventType,
      payload,
      timestamp: new Date(),
      metadata,
    };

    await this.processEvent(event);
  }

  /**
   * Procesa un evento a través del middleware y handlers
   */
  private async processEvent(event: Event): Promise<void> {
    let index = 0;

    const next = async () => {
      if (index < this.middleware.length) {
        const middleware = this.middleware[index++];
        await middleware(event, next);
      } else {
        // Ejecutar handlers
        await this.executeHandlers(event);
      }
    };

    await next();
  }

  /**
   * Ejecuta todos los handlers suscritos al evento
   */
  private async executeHandlers(event: Event): Promise<void> {
    const handlers = this.handlers.get(event.type);
    if (!handlers) return;

    const promises = Array.from(handlers).map(handler => 
      this.executeHandlerSafely(handler, event)
    );

    await Promise.allSettled(promises);
  }

  /**
   * Ejecuta un handler de forma segura
   */
  private async executeHandlerSafely(handler: EventHandler, event: Event): Promise<void> {
    try {
      await handler(event);
    } catch (error) {
      console.error(`Error en handler para evento ${event.type}:`, error);
    }
  }

  /**
   * Agrega middleware al pipeline de eventos
   */
  use(middleware: (event: Event, next: () => Promise<void>) => Promise<void>): void {
    this.middleware.push(middleware);
  }

  /**
   * Elimina todos los handlers de un tipo de evento
   */
  removeAllListeners(eventType?: string): void {
    if (eventType) {
      this.handlers.delete(eventType);
    } else {
      this.handlers.clear();
    }
  }

  /**
   * Obtiene la cantidad de handlers para un tipo de evento
   */
  listenerCount(eventType: string): number {
    return this.handlers.get(eventType)?.size || 0;
  }

  /**
   * Genera un ID único para el evento
   */
  private generateId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const eventBus = new EventBus();