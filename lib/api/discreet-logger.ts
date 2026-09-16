/**
 * Módulo de Registro Discreto en Consola para Aurenis
 * Permite registrar errores de red, códigos HTTP 500/503 y diagnósticos
 * de forma limpia, estructurada y sin exponer datos sensibles (PII/Tokens).
 */

export interface DiscreetLogOptions {
  url?: string;
  method?: string;
  status?: number;
  statusText?: string;
  errorCode?: string;
  errorMessage?: string;
  durationMs?: number;
  retryAttempt?: number;
  details?: unknown;
}

/**
 * Sanitiza una URL eliminando credenciales, tokens o parámetros sensibles en queries
 */
function sanitizeUrl(url?: string): string {
  if (!url) return "unknown-endpoint";
  try {
    // Si es relativa, parsear con base ficticia
    const parsed = new URL(url, "https://aurenis.local");
    const searchParams = parsed.searchParams;
    const sensitiveKeys = ["token", "auth", "secret", "password", "key", "apiKey", "access_token", "rut"];
    
    sensitiveKeys.forEach((key) => {
      if (searchParams.has(key)) {
        searchParams.set(key, "[REDACTED]");
      }
    });

    const cleanPath = parsed.pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    return cleanPath;
  } catch {
    return url.split("?")[0] || url;
  }
}

class DiscreetLogger {
  private isDevelopment = process.env.NODE_ENV !== "production";

  /**
   * Registro discreto para fallos de red (sin conexión, timeouts, DNS)
   */
  logNetworkError(options: DiscreetLogOptions): void {
    const cleanUrl = sanitizeUrl(options.url);
    const method = (options.method || "GET").toUpperCase();
    const retryText = options.retryAttempt !== undefined && options.retryAttempt > 0 
      ? ` (Reintento #${options.retryAttempt})` 
      : "";

    const timestamp = new Date().toLocaleTimeString("es-CL", { hour12: false });

    // Estilo sutil y visible sin spam de stack trace
    if (typeof window !== "undefined") {
      console.warn(
        `%c[Aurenis Red] %c${timestamp} %c${method} ${cleanUrl}${retryText} ➔ Fallo de conexión / Sin conexión`,
        "background: #fed7aa; color: #9a3412; font-weight: bold; padding: 2px 5px; border-radius: 4px;",
        "color: #64748b; font-size: 11px;",
        "color: #ea580c; font-weight: 500;"
      );
    } else {
      console.warn(`[Aurenis Red] [${timestamp}] ${method} ${cleanUrl}${retryText} ➔ Fallo de conexión`);
    }
  }

  /**
   * Registro discreto para errores HTTP 500 (Internal Server Error)
   */
  logHttp500(options: DiscreetLogOptions): void {
    const cleanUrl = sanitizeUrl(options.url);
    const method = (options.method || "GET").toUpperCase();
    const timestamp = new Date().toLocaleTimeString("es-CL", { hour12: false });
    const code = options.errorCode ? ` [${options.errorCode}]` : "";
    const msg = options.errorMessage ? `: ${options.errorMessage}` : "";

    if (typeof window !== "undefined") {
      console.error(
        `%c[Aurenis 500 Error] %c${timestamp} %c${method} ${cleanUrl} ➔ Error Interno del Servidor (500)${code}${msg}`,
        "background: #fee2e2; color: #991b1b; font-weight: bold; padding: 2px 5px; border-radius: 4px;",
        "color: #64748b; font-size: 11px;",
        "color: #dc2626; font-weight: 500;"
      );
    } else {
      console.error(`[Aurenis 500 Error] [${timestamp}] ${method} ${cleanUrl} ➔ Error Interno del Servidor (500)${code}${msg}`);
    }
  }

  /**
   * Registro discreto para errores HTTP 503 (Service Unavailable)
   */
  logHttp503(options: DiscreetLogOptions): void {
    const cleanUrl = sanitizeUrl(options.url);
    const method = (options.method || "GET").toUpperCase();
    const timestamp = new Date().toLocaleTimeString("es-CL", { hour12: false });
    const msg = options.errorMessage ? `: ${options.errorMessage}` : " (Servicio temporalmente no disponible / Mantenimiento)";

    if (typeof window !== "undefined") {
      console.warn(
        `%c[Aurenis 503 Servicio] %c${timestamp} %c${method} ${cleanUrl} ➔ 503 No disponible${msg}`,
        "background: #fef3c7; color: #92400e; font-weight: bold; padding: 2px 5px; border-radius: 4px;",
        "color: #64748b; font-size: 11px;",
        "color: #d97706; font-weight: 500;"
      );
    } else {
      console.warn(`[Aurenis 503 Servicio] [${timestamp}] ${method} ${cleanUrl} ➔ 503 No disponible${msg}`);
    }
  }

  /**
   * Registro general para respuestas HTTP con error (4xx / 5xx)
   */
  logHttpError(options: DiscreetLogOptions): void {
    const status = options.status || 0;
    if (status === 500) {
      this.logHttp500(options);
      return;
    }
    if (status === 503) {
      this.logHttp503(options);
      return;
    }

    const cleanUrl = sanitizeUrl(options.url);
    const method = (options.method || "GET").toUpperCase();
    const timestamp = new Date().toLocaleTimeString("es-CL", { hour12: false });

    if (typeof window !== "undefined") {
      console.warn(
        `%c[Aurenis HTTP ${status}] %c${timestamp} %c${method} ${cleanUrl} ➔ ${options.errorMessage || options.statusText || "Error en solicitud"}`,
        "background: #f1f5f9; color: #334155; font-weight: bold; padding: 2px 5px; border-radius: 4px;",
        "color: #64748b; font-size: 11px;",
        "color: #475569; font-weight: 500;"
      );
    } else {
      console.warn(`[Aurenis HTTP ${status}] [${timestamp}] ${method} ${cleanUrl} ➔ ${options.errorMessage || options.statusText || "Error en solicitud"}`);
    }
  }

  /**
   * Registro discreto de reintento exitoso
   */
  logRetrySuccess(options: DiscreetLogOptions): void {
    const cleanUrl = sanitizeUrl(options.url);
    const method = (options.method || "GET").toUpperCase();
    const timestamp = new Date().toLocaleTimeString("es-CL", { hour12: false });

    if (typeof window !== "undefined") {
      console.info(
        `%c[Aurenis Reconectado] %c${timestamp} %c${method} ${cleanUrl} ➔ Solicitud reintentada con éxito`,
        "background: #dcfce7; color: #166534; font-weight: bold; padding: 2px 5px; border-radius: 4px;",
        "color: #64748b; font-size: 11px;",
        "color: #16a34a; font-weight: 500;"
      );
    }
  }
}

export const discreetLogger = new DiscreetLogger();
