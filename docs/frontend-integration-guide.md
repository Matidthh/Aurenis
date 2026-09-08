# Guía de Integración Frontend - Aurenis API

👋 **Hola Malcom**, esta guía está diseñada específicamente para que puedas integrar el frontend con la API de Aurenis de manera eficiente.

## 📚 Documentación Disponible

1. **Especificación OpenAPI completa**: `docs/api-specification.yaml`
2. **Estructura de respuestas y errores**: `docs/api-responses-and-errors.md`
3. **Colección de Postman**: `docs/postman-collection.json`
4. **Autorización y roles**: `docs/autorizacion-y-roles.md`

## 🚀 Configuración Inicial

### 1. Importar Colección de Postman

```bash
# Importar el archivo docs/postman-collection.json en Postman
# Configurar la variable baseUrl:
# - Desarrollo: http://localhost:3000/api
# - Producción: https://aurenis.com/api
```

### 2. Instalar Dependencias Frontend

```bash
npm install axios  # o usar fetch nativo
npm install swr   # para data fetching (opcional)
npm install react-hook-form # para formularios
npm install zod   # para validación de esquemas
```

## 🔐 Autenticación

### Cookie-based Authentication

La API usa cookies httpOnly para autenticación. **No necesitas manejar tokens manualmente**.

```typescript
// Configuración de axios
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  withCredentials: true, // CRUCIAL: enviar cookies
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Login Flow

```typescript
async function login(email: string, password: string) {
  try {
    const response = await api.post('/auth/login', { email, password });
    
    if (response.data.success) {
      // La cookie se establece automáticamente
      // Redirigir según el caso
      if (response.data.user.multipleSchools) {
        router.push('/select-school');
      } else {
        router.push(response.data.redirectUrl);
      }
    }
  } catch (error) {
    handleApiError(error);
  }
}
```

### Verificar Autenticación

```typescript
async function checkAuth() {
  try {
    const response = await api.get('/auth/me');
    return response.data.user;
  } catch (error) {
    if (error.response?.status === 401) {
      return null; // No autenticado
    }
    throw error;
  }
}
```

### Logout

```typescript
async function logout() {
  await api.post('/auth/logout');
  router.push('/login');
}
```

## 📝 Manejo de Errores Estandarizado

### Hook Personalizado

```typescript
import { useState } from 'react';
import api from './api';

interface ApiState {
  loading: boolean;
  error: string | null;
}

export function useApi() {
  const [state, setState] = useState<ApiState>({
    loading: false,
    error: null,
  });

  const request = async <T = any>(
    url: string,
    options?: RequestInit
  ): Promise<T> => {
    setState({ loading: true, error: null });

    try {
      const response = await api(url, options);
      setState({ loading: false, error: null });
      return response.data;
    } catch (error: any) {
      setState({ loading: false, error: handleApiError(error) });
      throw error;
    }
  };

  return { request, ...state };
}

function handleApiError(error: any): string {
  if (!error.response) {
    return 'Error de conexión';
  }

  const { status, data } = error.response;

  switch (status) {
    case 400:
      if (data.details?.issues) {
        // Manejar errores de validación específicos
        return data.details.issues[0]?.message || 'Datos inválidos';
      }
      return data.error || 'Datos inválidos';
    
    case 401:
      // Redirigir a login
      window.location.href = '/login';
      return 'No autenticado';
    
    case 403:
      return data.error || 'No tienes permisos para esta acción';
    
    case 404:
      return data.error || 'Recurso no encontrado';
    
    case 429:
      const retryAfter = data.details?.retryAfter || 60;
      return `Demasiadas solicitudes. Intenta en ${retryAfter} segundos.`;
    
    default:
      return data.error || 'Error del servidor';
  }
}
```

## 🎯 Ejemplos de Integración por Módulo

### 1. Formulario de Login

```typescript
import { useForm } from 'react-hook-form';
import { useApi } from './hooks/useApi';

function LoginForm() {
  const { request, loading, error } = useApi();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const response = await request('/auth/login', {
        method: 'POST',
        data,
      });

      if (response.success) {
        if (response.user.multipleSchools) {
          router.push('/select-school');
        } else {
          router.push(response.redirectUrl);
        }
      }
    } catch (err) {
      // Error ya manejado por el hook
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email', { required: 'Email requerido' })}
        placeholder="Email"
      />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input
        {...register('password', { required: 'Contraseña requerida', minLength: 6 })}
        type="password"
        placeholder="Contraseña"
      />
      {errors.password && <span>{errors.password.message}</span>}
      
      {error && <div className="error">{error}</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}
```

### 2. Selector de Colegio (Multi-tenancy)

```typescript
import { useApi } from './hooks/useApi';

function SchoolSelector() {
  const { request, loading } = useApi();
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      const response = await request('/auth/me');
      // Aquí podrías cargar las instituciones del usuario
      // Por ahora asumimos que vienen en la sesión
    } catch (error) {
      console.error('Error loading schools');
    }
  };

  const selectSchool = async (schoolId: string) => {
    try {
      const response = await request('/auth/select-school', {
        method: 'POST',
        data: { schoolId },
      });

      if (response.success) {
        router.push(response.redirectUrl);
      }
    } catch (error) {
      console.error('Error selecting school');
    }
  };

  return (
    <div>
      <h2>Selecciona tu institución</h2>
      {schools.map((school) => (
        <button
          key={school.id}
          onClick={() => selectSchool(school.id)}
          disabled={loading}
        >
          {school.name}
        </button>
      ))}
    </div>
  );
}
```

### 3. Listado de Cursos

```typescript
import { useApi } from './hooks/useApi';

function CoursesList({ schoolSlug }: { schoolSlug: string }) {
  const { request, loading, error } = useApi();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    loadCourses();
  }, [schoolSlug]);

  const loadCourses = async () => {
    try {
      const response = await request(`/${schoolSlug}/courses?year=2026`);
      setCourses(response.courses);
    } catch (error) {
      console.error('Error loading courses');
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Cursos</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            {course.name} - {course.gradeNumber}° {course.letter}
            <span>{course._count.enrollments} estudiantes</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 4. Crear Curso

```typescript
import { useForm } from 'react-hook-form';
import { useApi } from './hooks/useApi';

function CreateCourseForm({ schoolSlug }: { schoolSlug: string }) {
  const { request, loading, error } = useApi();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const response = await request(`/${schoolSlug}/courses`, {
        method: 'POST',
        data: {
          ...data,
          year: 2026,
        },
      });

      if (response.success) {
        // Recargar lista o mostrar éxito
        toast.success('Curso creado exitosamente');
      }
    } catch (err) {
      // Error ya manejado por el hook
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('name', { required: 'Nombre requerido' })}
        placeholder="Nombre del curso (ej: 1° Medio A)"
      />
      {errors.name && <span>{errors.name.message}</span>}
      
      <input
        {...register('letter')}
        placeholder="Letra (ej: A)"
      />
      
      <input
        {...register('gradeNumber', { required: 'Grado requerido' })}
        type="number"
        placeholder="Grado (ej: 1)"
      />
      {errors.gradeNumber && <span>{errors.gradeNumber.message}</span>}
      
      <select {...register('educationLevelId', { required: 'Nivel requerido' })}>
        <option value="">Seleccionar nivel</option>
        <option value="level1">Enseñanza Básica</option>
        <option value="level2">Enseñanza Media</option>
      </select>
      {errors.educationLevelId && <span>{errors.educationLevelId.message}</span>}
      
      {error && <div className="error">{error}</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Curso'}
      </button>
    </form>
  );
}
```

### 5. Gestión de Calificaciones

```typescript
import { useApi } from './hooks/useApi';

function GradesList({ schoolSlug, courseId }: { schoolSlug: string; courseId?: string }) {
  const { request, loading, error } = useApi();
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    loadGrades();
  }, [schoolSlug, courseId]);

  const loadGrades = async () => {
    try {
      const params = courseId ? `?courseId=${courseId}` : '';
      const response = await request(`/${schoolSlug}/grades${params}`);
      setGrades(response.grades);
    } catch (error) {
      console.error('Error loading grades');
    }
  };

  if (loading) return <div>Cargando calificaciones...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Calificaciones</h2>
      <table>
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Evaluación</th>
            <th>Nota</th>
            <th>Feedback</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade) => (
            <tr key={grade.id}>
              <td>
                {grade.enrollment.student.membership.user.firstName}{' '}
                {grade.enrollment.student.membership.user.lastName}
              </td>
              <td>{grade.assessment.title}</td>
              <td>{grade.value}</td>
              <td>{grade.feedback || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 6. Crear Colegio (System Admin)

```typescript
import { useForm } from 'react-hook-form';
import { useApi } from './hooks/useApi';

function CreateSchoolForm() {
  const { request, loading, error } = useApi();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const response = await request('/system/schools', {
        method: 'POST',
        data,
      });

      if (response.success) {
        toast.success('Colegio creado exitosamente');
        // Redirigir o mostrar éxito
      }
    } catch (err) {
      // Error ya manejado por el hook
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('name', { required: 'Nombre requerido' })}
        placeholder="Nombre del colegio"
      />
      {errors.name && <span>{errors.name.message}</span>}
      
      <input
        {...register('slug', { required: 'Slug requerido' })}
        placeholder="Slug URL (ej: liceo-lastarria)"
      />
      {errors.slug && <span>{errors.slug.message}</span>}
      
      <input
        {...register('institutionalCode')}
        placeholder="Código institucional (opcional)"
      />
      
      <input
        {...register('city')}
        placeholder="Ciudad"
      />
      
      <input
        {...register('adminEmail', { required: 'Email requerido' })}
        placeholder="Email del administrador"
      />
      {errors.adminEmail && <span>{errors.adminEmail.message}</span>}
      
      <input
        {...register('adminFirstName', { required: 'Nombre requerido' })}
        placeholder="Nombre del administrador"
      />
      {errors.adminFirstName && <span>{errors.adminFirstName.message}</span>}
      
      <input
        {...register('adminLastName', { required: 'Apellido requerido' })}
        placeholder="Apellido del administrador"
      />
      {errors.adminLastName && <span>{errors.adminLastName.message}</span>}
      
      <input
        {...register('adminPassword', { required: 'Contraseña requerida', minLength: 6 })}
        type="password"
        placeholder="Contraseña del administrador"
      />
      {errors.adminPassword && <span>{errors.adminPassword.message}</span>}
      
      {error && <div className="error">{error}</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creando colegio...' : 'Crear Colegio'}
      </button>
    </form>
  );
}
```

## 🔍 Verificación de Permisos en Frontend

### Hook de Permisos

```typescript
import { useEffect, useState } from 'react';
import api from './api';

export function usePermissions() {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPermissions() {
      try {
        const response = await api.get('/auth/me');
        setPermissions(response.data.user.permissions || []);
      } catch (error) {
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    }
    loadPermissions();
  }, []);

  const hasPermission = (permission: string) => {
    return permissions.includes('*') || permissions.includes(permission);
  };

  const hasAnyPermission = (requiredPermissions: string[]) => {
    return requiredPermissions.some(perm => hasPermission(perm));
  };

  return { permissions, loading, hasPermission, hasAnyPermission };
}
```

### Uso en Componentes

```typescript
function CourseManagement({ schoolSlug }: { schoolSlug: string }) {
  const { hasPermission } = usePermissions();

  if (!hasPermission('academic:courses:manage')) {
    return <div>No tienes permisos para gestionar cursos</div>;
  }

  return (
    <div>
      <h2>Gestión de Cursos</h2>
      <CreateCourseForm schoolSlug={schoolSlug} />
      <CoursesList schoolSlug={schoolSlug} />
    </div>
  );
}
```

## 🎨 Componentes UI Reutilizables

### Loading State

```typescript
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}
```

### Error State

```typescript
function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      <p>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 text-red-600 underline"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
```

### Empty State

```typescript
function EmptyState({ message, action }: { message: string; action?: React.ReactNode }) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
```

## 📋 Checklist de Integración

- [ ] Configurar axios con `withCredentials: true`
- [ ] Implementar hook `useApi` para manejo de errores
- [ ] Crear componentes de Loading, Error y Empty states
- [ ] Implementar flujo de login con redirección
- [ ] Implementar selector de colegio para multi-tenancy
- [ ] Crear hook `usePermissions` para control de acceso UI
- [ ] Importar colección de Postman para testing
- [ ] Revisar especificación OpenAPI para detalles de endpoints
- [ ] Implementar manejo de rate limiting (429)
- [ ] Configurar variables de entorno para URLs de API

## 🆘 Soporte

Si tienes dudas durante la integración:

1. **Revisa la especificación OpenAPI**: `docs/api-specification.yaml`
2. **Prueba con Postman**: Usa la colección en `docs/postman-collection.json`
3. **Verifica errores**: Consulta `docs/api-responses-and-errors.md`
4. **Autorización**: Revisa `docs/autorizacion-y-roles.md`

## 🎯 Tips Importantes

1. **Siempre usa `withCredentials: true`** en axios para enviar cookies
2. **Maneja el 401 redirigiendo a login** automáticamente
3. **Verifica permisos en frontend** también (además del backend)
4. **Usa los códigos de error** para mostrar mensajes específicos
5. **Implementa retry** para errores 429 (rate limiting)
6. **Cachea permisos** para evitar llamadas innecesarias a `/auth/me`

¡Éxito con la integración Malcom! 🚀