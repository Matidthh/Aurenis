# Estructura de Respuestas y Errores - Aurenis API

## 📋 Estructura de Respuestas Exitosas

Todas las respuestas exitosas siguen un formato estandarizado para facilitar la integración frontend.

### Formato Base

```typescript
{
  success: true,
  data?: any,           // Datos principales de la respuesta
  message?: string,     // Mensaje informativo (opcional)
  meta?: {              // Metadatos (opcional)
    page?: number,
    limit?: number,
    total?: number,
    totalPages?: number
  }
}
```

### Ejemplos de Respuestas Exitosas

#### 1. Login Exitoso (200 OK)

```json
{
  "success": true,
  "redirectUrl": "/system/dashboard",
  "user": {
    "id": "clxxxxxxx",
    "email": "admin@aurenis.com",
    "name": "Juan Pérez",
    "isSystemAdmin": true
  }
}
```

#### 2. Creación de Recurso (201 Created)

```json
{
  "success": true,
  "message": "Institución creada e inicializada exitosamente.",
  "school": {
    "id": "clxxxxxxx",
    "name": "Colegio San José",
    "slug": "colegio-san-jose"
  },
  "admin": {
    "id": "usrxxxxxx",
    "email": "director@sanjose.cl"
  }
}
```

#### 3. Listado de Recursos (200 OK)

```json
{
  "success": true,
  "schools": [
    {
      "id": "clxxxxxxx",
      "name": "Colegio San José",
      "slug": "colegio-san-jose",
      "status": "ACTIVE",
      "_count": {
        "memberships": 150,
        "courses": 24
      }
    }
  ]
}
```

#### 4. Actualización de Recurso (200 OK)

```json
{
  "success": true,
  "message": "Configuración actualizada con éxito",
  "settings": {
    "id": "setxxxxxx",
    "schoolId": "clxxxxxxx",
    "termType": "SEMESTER",
    "minPassingGrade": 4.0,
    "primaryColor": "#0284c7"
  }
}
```

## ❌ Estructura de Errores

Todos los errores siguen un formato estandarizado con códigos HTTP apropiados.

### Formato Base de Error

```typescript
{
  error: string,      // Mensaje de error legible para humanos
  code?: string,      // Código de error específico (opcional)
  details?: any       // Detalles adicionales del error (opcional)
}
```

### Códigos HTTP de Error

#### 400 Bad Request

**Uso**: Datos de entrada inválidos, validación fallida

```json
{
  "error": "Credenciales inválidas",
  "code": "VALIDATION_ERROR",
  "details": {
    "issues": [
      {
        "path": "email",
        "message": "Correo electrónico inválido",
        "code": "invalid_string"
      },
      {
        "path": "password",
        "message": "La contraseña debe tener al menos 6 caracteres",
        "code": "too_small"
      }
    ]
  }
}
```

**Casos comunes**:
- Email inválido
- Contraseña muy corta
- Campo requerido faltante
- Formato de datos incorrecto
- Slug en uso

#### 401 Unauthorized

**Uso**: No autenticado, sesión inválida o expirada

```json
{
  "error": "No autenticado",
  "code": "UNAUTHORIZED"
}
```

**Casos comunes**:
- Cookie de sesión no presente
- Token JWT inválido
- Sesión expirada
- Usuario no logueado

#### 403 Forbidden

**Uso**: Autenticado pero sin permisos suficientes

```json
{
  "error": "No tienes permiso para gestionar cursos",
  "code": "FORBIDDEN"
}
```

**Casos comunes**:
- Sin permiso específico (ej: `grades:enter`)
- Sin acceso al colegio solicitado
- Intento de acceder a datos de otro tenant
- Rol sin privilegios suficientes

#### 404 Not Found

**Uso**: Recurso no encontrado

```json
{
  "error": "Colegio no encontrado",
  "code": "NOT_FOUND"
}
```

**Casos comunes**:
- ID de recurso inexistente
- Slug de colegio inválido
- Usuario eliminado

#### 409 Conflict

**Uso**: Conflicto con estado existente

```json
{
  "error": "El valor para email ya existe",
  "code": "DUPLICATE_ENTRY",
  "field": "email"
}
```

**Casos comunes**:
- Email duplicado
- Slug de colegio duplicado
- Código institucional duplicado

#### 429 Too Many Requests

**Uso**: Rate limit excedido

```json
{
  "error": "Demasiadas solicitudes. Por favor espera antes de intentar nuevamente.",
  "code": "RATE_LIMIT_EXCEEDED",
  "details": {
    "retryAfter": 60
  }
}
```

**Headers adicionales**:
```
Retry-After: 60
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1634567890
```

**Casos comunes**:
- Demasiados intentos de login
- Demasiadas solicitudes a un endpoint sensible

#### 500 Internal Server Error

**Uso**: Error del servidor no especificado

```json
{
  "error": "Error interno del servidor",
  "code": "INTERNAL_ERROR"
}
```

**En desarrollo** (puede incluir stack trace):
```json
{
  "error": "Error interno del servidor",
  "code": "INTERNAL_ERROR",
  "stack": "Error: Connection timeout\n    at..."
}
```

## 🔧 Códigos de Error Específicos

### Errores de Validación (VALIDATION_ERROR)

```json
{
  "error": "Error de validación",
  "code": "VALIDATION_ERROR",
  "details": {
    "issues": [
      {
        "path": "email",
        "message": "Correo electrónico inválido",
        "code": "invalid_string"
      }
    ]
  }
}
```

### Errores de Duplicados (DUPLICATE_ENTRY)

```json
{
  "error": "El valor para email ya existe",
  "code": "DUPLICATE_ENTRY",
  "field": "email"
}
```

### Errores de Base de Datos (DATABASE_ERROR)

```json
{
  "error": "Error de base de datos",
  "code": "DATABASE_ERROR",
  "details": {
    "code": "P2002",
    "message": "Unique constraint failed"
  }
}
```

### Errores de Servicio (SERVICE_ERROR)

```json
{
  "error": "El identificador de URL (slug) 'colegio-san-jose' ya está registrado.",
  "code": "SCHOOL_SERVICE_ERROR"
}
```

## 📊 Headers de Respuesta

### Headers Informativos

```
Content-Type: application/json
X-Powered-By: Next.js
X-Response-Time: 123ms
```

### Headers de Rate Limiting

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1634567890
Retry-After: 60 (solo en 429)
```

### Headers de Seguridad

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

## 🎯 Guía para el Frontend

### Manejo de Errores en React

```typescript
async function apiCall(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      // Manejar errores basado en código HTTP
      switch (response.status) {
        case 400:
          // Error de validación - mostrar detalles específicos
          if (data.details?.issues) {
            data.details.issues.forEach((issue: any) => {
              // Mostrar error en campo específico
              showFieldError(issue.path, issue.message);
            });
          }
          break;
        case 401:
          // Redirigir a login
          router.push('/login');
          break;
        case 403:
          // Mostrar mensaje de permisos insuficientes
          showError(data.error || 'No tienes permisos para esta acción');
          break;
        case 404:
          // Mostrar recurso no encontrado
          showError(data.error || 'Recurso no encontrado');
          break;
        case 429:
          // Mostrar mensaje de rate limit con retry after
          const retryAfter = data.details?.retryAfter || 60;
          showError(`Demasiadas solicitudes. Intenta en ${retryAfter} segundos.`);
          break;
        default:
          // Error genérico
          showError(data.error || 'Error del servidor');
      }
      throw new Error(data.error || 'Error en la petición');
    }

    return data;
  } catch (error) {
    // Manejar errores de red o JSON parsing
    console.error('API Error:', error);
    throw error;
  }
}
```

### Hook Personalizado para API Calls

```typescript
function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async (url: string, options?: RequestInit) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include', // Importante para cookies
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        handleApiError(response.status, data);
        setError(data.error || 'Error en la petición');
        throw new Error(data.error);
      }

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { request, loading, error };
}

function handleApiError(status: number, data: any) {
  switch (status) {
    case 401:
      // Redirigir a login
      window.location.href = '/login';
      break;
    case 403:
      toast.error('No tienes permisos para esta acción');
      break;
    case 429:
      const retryAfter = data.details?.retryAfter || 60;
      toast.error(`Demasiadas solicitudes. Intenta en ${retryAfter} segundos.`);
      break;
    default:
      toast.error(data.error || 'Error del servidor');
  }
}
```

### Ejemplo de Uso en Componente

```typescript
function LoginForm() {
  const { request, loading, error } = useApi();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      const data = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: formState.email,
          password: formState.password,
        }),
      });

      if (data.success) {
        // Redirigir según el caso
        if (data.user.multipleSchools) {
          router.push('/select-school');
        } else {
          router.push(data.redirectUrl);
        }
      }
    } catch (err) {
      // El error ya fue manejado por el hook
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}
```

## 📝 Resumen de Códigos de Respuesta

| Código | Significado | Acción Frontend Sugerida |
|--------|-------------|-------------------------|
| 200 | OK | Procesar respuesta exitosa |
| 201 | Created | Mostrar mensaje de éxito, redirigir si es necesario |
| 204 | No Content | Operación exitosa sin datos adicionales |
| 400 | Bad Request | Mostrar errores de validación en campos específicos |
| 401 | Unauthorized | Redirigir a login |
| 403 | Forbidden | Mostrar mensaje de permisos insuficientes |
| 404 | Not Found | Mostrar mensaje de recurso no encontrado |
| 409 | Conflict | Mostrar mensaje de duplicado/conflicto |
| 429 | Too Many Requests | Mostrar mensaje con tiempo de espera |
| 500 | Internal Server Error | Mostrar mensaje de error genérico |

## 🔐 Autenticación

### Cookie de Sesión

La API usa cookies httpOnly para autenticación. No es necesario enviar headers manualmente:

```typescript
// Correcto - navegador maneja cookies automáticamente
fetch('/api/auth/me', {
  credentials: 'include', // Importante
});

// Incorrecto - no usar Authorization header
fetch('/api/auth/me', {
  headers: {
    'Authorization': 'Bearer xxx' // No usar esto
  }
});
```

### Verificar Autenticación

```typescript
async function checkAuth() {
  try {
    const response = await fetch('/api/auth/me', {
      credentials: 'include',
    });
    
    if (response.status === 401) {
      // No autenticado
      return null;
    }
    
    const data = await response.json();
    return data.user;
  } catch (error) {
    return null;
  }
}
```

Esta estructura estandarizada facilita la integración frontend y asegura un manejo de errores consistente en toda la aplicación.