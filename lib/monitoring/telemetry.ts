/**
 * Sistema de Telemetría y Monitoreo Distribuido
 * Implementa OpenTelemetry para tracing y métricas
 */

import { trace, context, Span, SpanStatusCode, SpanKind } from '@opentelemetry/api';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { JaegerExporter } from '@opentelemetry/exporter-trace-jaeger';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { MeterProvider } from '@opentelemetry/sdk-metrics';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';

export interface TraceConfig {
  serviceName: string;
  serviceVersion: string;
  environment: string;
  jaegerEndpoint?: string;
  prometheusPort?: number;
}

export interface SpanOptions {
  name: string;
  attributes?: Record<string, any>;
  kind?: SpanKind;
}

export class TelemetryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TelemetryError';
  }
}

/**
 * Servicio de Telemetría
 */
export class TelemetryService {
  private tracerProvider: NodeTracerProvider | null = null;
  private meterProvider: MeterProvider | null = null;
  private config: TraceConfig;
  private prometheusExporter: PrometheusExporter | null = null;

  constructor(config: TraceConfig) {
    this.config = config;
  }

  /**
   * Inicializa el sistema de telemetría
   */
  async initialize(): Promise<void> {
    try {
      // Configurar resource
      const resource = new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: this.config.serviceName,
        [SemanticResourceAttributes.SERVICE_VERSION]: this.config.serviceVersion,
        [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: this.config.environment,
      });

      // Configurar Tracer Provider
      this.tracerProvider = new NodeTracerProvider({ resource });

      // Configurar exportadores
      if (this.config.jaegerEndpoint) {
        const jaegerExporter = new JaegerExporter({
          endpoint: this.config.jaegerEndpoint,
        });
        this.tracerProvider.addSpanProcessor(new BatchSpanProcessor(jaegerExporter));
      } else {
        // En desarrollo, usar SimpleSpanProcessor para output inmediato
        const consoleExporter = new ConsoleSpanExporter();
        this.tracerProvider.addSpanProcessor(new SimpleSpanProcessor(consoleExporter));
      }

      this.tracerProvider.register();

      // Configurar Meter Provider para métricas
      this.meterProvider = new MeterProvider({ resource });

      if (this.config.prometheusPort) {
        this.prometheusExporter = new PrometheusExporter({
          port: this.config.prometheusPort,
        });
        
        const metricReader = new PeriodicExportingMetricReader({
          exporter: this.prometheusExporter,
          exportIntervalMillis: 10000,
        });
        
        this.meterProvider.addMetricReader(metricReader);
      }

      this.meterProvider.register();

      // Registrar instrumentaciones automáticas
      registerInstrumentations({
        tracerProvider: this.tracerProvider,
        meterProvider: this.meterProvider,
      });

      console.log('✅ Telemetría inicializada correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar telemetría:', error);
      throw new TelemetryError(`Error al inicializar telemetría: ${error}`);
    }
  }

  /**
   * Crea un span para tracing
   */
  createSpan(options: SpanOptions): Span {
    const tracer = trace.getTracer(this.config.serviceName);
    return tracer.startSpan(options.name, {
      attributes: options.attributes,
      kind: options.kind,
    });
  }

  /**
   * Ejecuta una función con tracing automático
   */
  async withSpan<T>(
    options: SpanOptions,
    fn: (span: Span) => Promise<T>
  ): Promise<T> {
    const span = this.createSpan(options);
    
    try {
      const result = await context.with(trace.setSpan(context.active(), span), async () => {
        return await fn(span);
      });
      
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({ 
        code: SpanStatusCode.ERROR, 
        message: (error as Error).message 
      });
      throw error;
    } finally {
      span.end();
    }
  }

  /**
   * Registra una métrica de contador
   */
  createCounter(name: string, description: string) {
    if (!this.meterProvider) {
      throw new TelemetryError('MeterProvider no inicializado');
    }

    const meter = this.meterProvider.getMeter(this.config.serviceName);
    return meter.createCounter(name, { description });
  }

  /**
   * Registra una métrica de histograma
   */
  createHistogram(name: string, description: string) {
    if (!this.meterProvider) {
      throw new TelemetryError('MeterProvider no inicializado');
    }

    const meter = this.meterProvider.getMeter(this.config.serviceName);
    return meter.createHistogram(name, { description });
  }

  /**
   * Registra una métrica de gauge
   */
  createGauge(name: string, description: string) {
    if (!this.meterProvider) {
      throw new TelemetryError('MeterProvider no inicializado');
    }

    const meter = this.meterProvider.getMeter(this.config.serviceName);
    return meter.createObservableGauge(name, { description });
  }

  /**
   * Obtiene la URL de métricas de Prometheus
   */
  getMetricsUrl(): string | null {
    if (!this.prometheusExporter) {
      return null;
    }
    return this.prometheusExporter.getUrl();
  }

  /**
   * Apaga el sistema de telemetría
   */
  async shutdown(): Promise<void> {
    const promises = [];

    if (this.tracerProvider) {
      promises.push(this.tracerProvider.shutdown());
    }

    if (this.meterProvider) {
      promises.push(this.meterProvider.shutdown());
    }

    await Promise.all(promises);
  }
}

/**
 * Exportador de consola para desarrollo
 */
class ConsoleSpanExporter {
  export(spans: any, resultCallback: any): void {
    spans.forEach((span: any) => {
      console.log('🔍 Span:', {
        name: span.name,
        kind: span.kind,
        status: span.status,
        attributes: span.attributes,
        duration: span.duration,
      });
    });
    resultCallback({ code: 0 });
  }

  shutdown(): Promise<void> {
    return Promise.resolve();
  }
}

/**
 * Singleton global del servicio de telemetría
 */
let telemetryService: TelemetryService | null = null;

export function getTelemetryService(): TelemetryService {
  if (!telemetryService) {
    telemetryService = new TelemetryService({
      serviceName: process.env.OTEL_SERVICE_NAME || 'aurenis',
      serviceVersion: process.env.OTEL_SERVICE_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      jaegerEndpoint: process.env.OTEL_JAEGER_ENDPOINT,
      prometheusPort: process.env.OTEL_PROMETHEUS_PORT 
        ? parseInt(process.env.OTEL_PROMETHEUS_PORT, 10) 
        : 9464,
    });
  }

  return telemetryService;
}

/**
 * Decorador para funciones con tracing automático
 */
export function traced(spanName: string, attributes?: Record<string, any>) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const telemetry = getTelemetryService();
      
      return await telemetry.withSpan(
        {
          name: spanName,
          attributes: {
            ...attributes,
            'function.name': propertyKey,
            'function.args': JSON.stringify(args),
          },
        },
        async (span) => {
          return await originalMethod.apply(this, args);
        }
      );
    };

    return descriptor;
  };
}

/**
 * Helper para medir tiempo de ejecución
 */
export async function measureTime<T>(
  name: string,
  fn: () => Promise<T>
): Promise<{ result: T; duration: number }> {
  const start = Date.now();
  const result = await fn();
  const duration = Date.now() - start;

  const telemetry = getTelemetryService();
  const histogram = telemetry.createHistogram(name, 'Execution time in milliseconds');
  histogram.record(duration);

  return { result, duration };
}

/**
 * Helper para contar eventos
 */
export function incrementCounter(name: string, value: number = 1, attributes?: Record<string, any>) {
  const telemetry = getTelemetryService();
  const counter = telemetry.createCounter(name, 'Event counter');
  counter.add(value, attributes);
}

/**
 * Helper para registrar errores
 */
export function recordError(error: Error, context?: Record<string, any>) {
  const telemetry = getTelemetryService();
  const counter = telemetry.createCounter('errors_total', 'Total errors');
  
  counter.add(1, {
    'error.type': error.name,
    'error.message': error.message,
    ...context,
  });
}