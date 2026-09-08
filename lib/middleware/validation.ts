/**
 * Middleware de Validación para APIs
 * Interceptor que valida y sanitiza datos antes de llegar a la base de datos
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { ValidationError, withErrorHandler } from './error-handler';
import { formatZodErrors, getZodErrorMessage } from '../validations';

export interface ValidationOptions {
  // Si es true, sanitiza automáticamente los datos
  sanitize?: boolean;
  // Si es true, retorna el primer error encontrado
  failFast?: boolean;
  // Mensaje personalizado para errores de validación
  errorMessage?: string;
}

/**
 * Clase de error para validación de request
 */
export class RequestValidationError extends ValidationError {
  constructor(
    message: string,
    public details: Record<string, string>
  ) {
    super(message);
    this.name = 'RequestValidationError';
  }
}

/**
 * Middleware de validación genérico
 */
export function validateRequest<T>(
  schema: { safeParse: (data: unknown) => { success: boolean; data?: T; error?: ZodError } },
  options: ValidationOptions = {}
) {
  return (handler: (req: NextRequest, data: T) => Promise<NextResponse>) => {
    return withErrorHandler(async (req: NextRequest) => {
      try {
        const body = await req.json();
        const result = schema.safeParse(body);

        if (!result.success) {
          const formattedErrors = formatZodErrors(result.error || {});
          
          if (options.failFast) {
            const firstError = getZodErrorMessage(result.error || {});
            throw new RequestValidationError(
              options.errorMessage || firstError,
              { validation: firstError }
            );
          }

          throw new RequestValidationError(
            options.errorMessage || 'Error de validación en los datos enviados',
            formattedErrors
          );
        }

        return await handler(req, result.data!);
      } catch (error) {
        // Si ya es un error de validación, relanzarlo
        if (error instanceof RequestValidationError) {
          throw error;
        }
        
        // Si es un error de JSON parse
        if (error instanceof SyntaxError && 'body' in error) {
          throw new RequestValidationError(
            'El formato JSON de la solicitud es inválido',
            { json: 'Formato JSON inválido' }
          );
        }

        throw error;
      }
    });
  };
}

/**
 * Middleware de validación para query parameters
 */
export function validateQuery<T>(
  schema: { safeParse: (data: unknown) => { success: boolean; data?: T; error?: ZodError } },
  options: ValidationOptions = {}
) {
  return (handler: (req: NextRequest, data: T) => Promise<NextResponse>) => {
    return withErrorHandler(async (req: NextRequest) => {
      try {
        const url = new URL(req.url);
        const queryParams = Object.fromEntries(url.searchParams.entries());
        
        const result = schema.safeParse(queryParams);

        if (!result.success) {
          const formattedErrors = formatZodErrors(result.error);
          
          throw new RequestValidationError(
            options.errorMessage || 'Error de validación en los parámetros de consulta',
            formattedErrors
          );
        }

        return await handler(req, result.data!);
      } catch (error) {
        if (error instanceof RequestValidationError) {
          throw error;
        }
        throw error;
      }
    });
  };
}

/**
 * Middleware de validación para parámetros de ruta
 */
export function validateParams<T>(
  schema: { safeParse: (data: unknown) => { success: boolean; data?: T; error?: ZodError } },
  options: ValidationOptions = {}
) {
  return (handler: (req: NextRequest, data: T) => Promise<NextResponse>) => {
    return withErrorHandler(async (req: NextRequest, params: any) => {
      try {
        const result = schema.safeParse(params);

        if (!result.success) {
          const formattedErrors = formatZodErrors(result.error);
          
          throw new RequestValidationError(
            options.errorMessage || 'Error de validación en los parámetros de ruta',
            formattedErrors
          );
        }

        return await handler(req, result.data!);
      } catch (error) {
        if (error instanceof RequestValidationError) {
          throw error;
        }
        throw error;
      }
    });
  };
}

/**
 * Middleware de validación combinada (body + query + params)
 */
export function validateCombined<TBody, TQuery, TParams>(
  schemas: {
    body?: { safeParse: (data: unknown) => { success: boolean; data?: TBody; error?: ZodError } };
    query?: { safeParse: (data: unknown) => { success: boolean; data?: TQuery; error?: ZodError } };
    params?: { safeParse: (data: unknown) => { success: boolean; data?: TParams; error?: ZodError } };
  },
  options: ValidationOptions = {}
) {
  return (handler: (req: NextRequest, data: { body?: TBody; query?: TQuery; params?: TParams }) => Promise<NextResponse>) => {
    return withErrorHandler(async (req: NextRequest, params: any) => {
      try {
        const validationResults: {
          body?: TBody;
          query?: TQuery;
          params?: TParams;
          errors: Record<string, string>;
        } = { errors: {} };

        // Validar body
        if (schemas.body) {
          const body = await req.json();
          const bodyResult = schemas.body.safeParse(body);
          
          if (bodyResult.success) {
            validationResults.body = bodyResult.data;
          } else {
            validationResults.errors = {
              ...validationResults.errors,
              ...formatZodErrors(bodyResult.error),
            };
          }
        }

        // Validar query
        if (schemas.query) {
          const url = new URL(req.url);
          const queryParams = Object.fromEntries(url.searchParams.entries());
          const queryResult = schemas.query.safeParse(queryParams);
          
          if (queryResult.success) {
            validationResults.query = queryResult.data;
          } else {
            validationResults.errors = {
              ...validationResults.errors,
              ...formatZodErrors(queryResult.error),
            };
          }
        }

        // Validar params
        if (schemas.params) {
          const paramsResult = schemas.params.safeParse(params);
          
          if (paramsResult.success) {
            validationResults.params = paramsResult.data;
          } else {
            validationResults.errors = {
              ...validationResults.errors,
              ...formatZodErrors(paramsResult.error),
            };
          }
        }

        // Si hay errores, lanzar excepción
        if (Object.keys(validationResults.errors).length > 0) {
          throw new RequestValidationError(
            options.errorMessage || 'Error de validación en la solicitud',
            validationResults.errors
          );
        }

        return await handler(req, validationResults);
      } catch (error) {
        if (error instanceof RequestValidationError) {
          throw error;
        }
        
        if (error instanceof SyntaxError && 'body' in error) {
          throw new RequestValidationError(
            'El formato JSON de la solicitud es inválido',
            { json: 'Formato JSON inválido' }
          );
        }

        throw error;
      }
    });
  };
}

/**
 * Helper para crear respuesta de error de validación
 */
export function createValidationErrorResponse(error: RequestValidationError): NextResponse {
  return NextResponse.json(
    {
      error: error.message,
      details: error.details,
      code: 'VALIDATION_ERROR',
    },
    { status: 400 }
  );
}

/**
 * Sobrescribir el handleApiError para incluir errores de validación
 */
export function handleApiErrorWithValidation(error: unknown): NextResponse {
  if (error instanceof RequestValidationError) {
    return createValidationErrorResponse(error);
  }

  // Usar el manejador de errores existente
  const { handleApiError } = require('./error-handler');
  return handleApiError(error);
}

/**
 * Wrapper para handlers que requiere validación
 */
export function withValidation<T>(
  schema: { safeParse: (data: unknown) => { success: boolean; data?: T; error?: ZodError } },
  options: ValidationOptions = {}
) {
  return (handler: (req: NextRequest, data: T) => Promise<NextResponse>) => {
    return validateRequest(schema, options)(handler);
  };
}

/**
 * Validador de tipos de contenido
 */
export function validateContentType(expectedType: string) {
  return (req: NextRequest): boolean => {
    const contentType = req.headers.get('content-type');
    return contentType === expectedType;
  };
}

/**
 * Validador de tamaño de request
 */
export function validateRequestSize(maxSizeBytes: number) {
  return async (req: NextRequest): Promise<boolean> => {
    const contentLength = req.headers.get('content-length');
    if (!contentLength) return true;
    
    const size = parseInt(contentLength, 10);
    return size <= maxSizeBytes;
  };
}

/**
 * Middleware que combina validación de contenido y tamaño
 */
export function validateRequestConstraints(
  maxBodySize: number = 10 * 1024 * 1024, // 10MB por defecto
  allowedContentTypes: string[] = ['application/json']
) {
  return (handler: (req: NextRequest) => Promise<NextResponse>) => {
    return withErrorHandler(async (req: NextRequest) => {
      // Validar tamaño
      const validSize = await validateRequestSize(maxBodySize)(req);
      if (!validSize) {
        throw new RequestValidationError(
          `El tamaño de la solicitud excede el límite de ${maxBodySize} bytes`,
          { size: 'Tamaño excedido' }
        );
      }

      // Validar tipo de contenido
      const contentType = req.headers.get('content-type');
      if (contentType && !allowedContentTypes.includes(contentType)) {
        throw new RequestValidationError(
          `El tipo de contenido ${contentType} no está permitido`,
          { contentType: 'Tipo no permitido' }
        );
      }

      return await handler(req);
    });
  };
}