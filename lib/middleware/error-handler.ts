import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

/**
 * Clases de error personalizadas para diferentes tipos de errores
 */
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = "INTERNAL_ERROR",
    public details?: any
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = "Recurso") {
    super(`${resource} no encontrado`, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, "CONFLICT_ERROR");
    this.name = "ConflictError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "No autorizado") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Acceso denegado") {
    super(message, 403, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfter: number) {
    super(
      "Demasiadas solicitudes. Por favor espera antes de intentar nuevamente.",
      429,
      "RATE_LIMIT_EXCEEDED",
      { retryAfter }
    );
    this.name = "RateLimitError";
  }
}

/**
 * Formatea errores de Zod para respuestas consistentes
 */
function formatZodError(error: ZodError): any {
  return {
    issues: error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
      code: issue.code,
    })),
  };
}

/**
 * Formatea errores de Prisma para respuestas consistentes
 */
function formatPrismaError(error: Prisma.PrismaClientKnownRequestError): any {
  // Error de registro único duplicado
  if (error.code === "P2002") {
    const field = error.meta?.target as string[];
    return {
      field: field?.[0] || "unknown",
      message: `El valor para ${field?.[0] || "este campo"} ya existe`,
    };
  }

  // Error de registro no encontrado
  if (error.code === "P2025") {
    return {
      message: "Registro no encontrado",
    };
  }

  // Error de relación fallida
  if (error.code === "P2003") {
    const field = error.meta?.field as string;
    return {
      field: field || "unknown",
      message: `Relación inválida: ${field || "campo relacionado"}`,
    };
  }

  return {
    code: error.code,
    message: error.message,
  };
}

/**
 * Maneja errores de manera centralizada y genera respuestas consistentes
 */
export function handleApiError(error: unknown): NextResponse {
  console.error("🔴 Error en API:", error);

  // Errores personalizados de la aplicación
  if (error instanceof AppError) {
    const response: any = {
      error: error.message,
      code: error.code,
    };

    if (error.details) {
      response.details = error.details;
    }

    // Agregar Retry-After header para rate limiting
    if (error instanceof RateLimitError && error.details?.retryAfter) {
      return NextResponse.json(response, {
        status: error.statusCode,
        headers: {
          "Retry-After": error.details.retryAfter.toString(),
        },
      });
    }

    return NextResponse.json(response, { status: error.statusCode });
  }

  // Errores de validación de Zod
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Error de validación",
        code: "VALIDATION_ERROR",
        details: formatZodError(error),
      },
      { status: 400 }
    );
  }

  // Errores de Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaDetails = formatPrismaError(error);

    if (error.code === "P2002") {
      return NextResponse.json(
        {
          error: prismaDetails.message,
          code: "DUPLICATE_ENTRY",
          field: prismaDetails.field,
        },
        { status: 409 }
      );
    }

    if (error.code === "P2025") {
      return NextResponse.json(
        {
          error: prismaDetails.message,
          code: "NOT_FOUND",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: "Error de base de datos",
        code: "DATABASE_ERROR",
        details: prismaDetails,
      },
      { status: 500 }
    );
  }

  // Errores de Prisma desconocidos
  if (error instanceof Prisma.PrismaClientValidationError) {
    return NextResponse.json(
      {
        error: "Error de validación en base de datos",
        code: "DATABASE_VALIDATION_ERROR",
      },
      { status: 400 }
    );
  }

  // Error genérico
  const isDevelopment = process.env.NODE_ENV === "development";

  return NextResponse.json(
    {
      error: isDevelopment ? (error as Error).message : "Error interno del servidor",
      code: "INTERNAL_ERROR",
      ...(isDevelopment && { stack: (error as Error).stack }),
    },
    { status: 500 }
  );
}

/**
 * Wrapper para handlers de API con manejo de errores centralizado
 */
export function withErrorHandler(
  handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse>
) {
  return async (req: NextRequest, ...args: any[]) => {
    try {
      return await handler(req, ...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

/**
 * Logger de errores para monitoreo
 */
export function logError(error: unknown, context?: {
  userId?: string;
  schoolId?: string;
  action?: string;
  endpoint?: string;
}): void {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error,
    context,
  };

  // En desarrollo, imprimir en consola
  if (process.env.NODE_ENV === "development") {
    console.error("🔴 Error registrado:", JSON.stringify(errorInfo, null, 2));
  }

  // En producción, aquí se podría enviar a un servicio de monitoreo
  // como Sentry, DataDog, CloudWatch, etc.
}

/**
 * Wrapper que combina manejo de errores con logging
 */
export function withErrorLogging(
  handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse>,
  context?: {
    action?: string;
    getResource?: (req: NextRequest) => { userId?: string; schoolId?: string };
  }
) {
  return async (req: NextRequest, ...args: any[]) => {
    try {
      return await handler(req, ...args);
    } catch (error) {
      const errorContext = {
        ...context,
        endpoint: req.url,
        ...(context?.getResource && context.getResource(req)),
      };
      
      logError(error, errorContext);
      return handleApiError(error);
    }
  };
}