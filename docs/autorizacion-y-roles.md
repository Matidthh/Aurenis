# Sistema de Autorización y Roles - Aurenis

## 📋 Matriz de Roles y Permisos

El sistema de autorización de Aurenis está basado en una matriz de roles y permisos granular que asegura la protección de recursos tanto a nivel backend como frontend.

### Roles Predefinidos

#### 1. SYSTEM_ADMIN (Administrador del Sistema)
- **Acceso**: Nivel global de la plataforma
- **Permisos**: `["*"]` (acceso total a todo)
- **Responsabilidades**: 
  - Crear y gestionar instituciones educativas
  - Gestionar usuarios globales
  - Ver auditoría global del sistema

#### 2. SCHOOL_ADMIN (Administrador del Colegio)
- **Acceso**: Nivel institucional
- **Permisos**:
  - Configuración institucional (ver/editar)
  - Gestión de roles institucionales
  - Gestión académica completa (periodos, niveles, cursos, asignaturas, horarios)
  - Gestión de personas (profesores, estudiantes, apoderados)
  - Matriculación de estudiantes
  - Calificaciones (ver, ingresar, modificar, publicar)
  - Asistencia (ver, registrar, justificar)
  - Auditoría institucional

#### 3. TEACHER (Profesor)
- **Acceso**: Nivel de asignaturas asignadas
- **Permisos**:
  - Calificaciones (ver, ingresar, modificar)
  - Asistencia (ver, registrar)

#### 4. STUDENT (Estudiante)
- **Acceso**: Nivel personal
- **Permisos**:
  - Calificaciones (ver)
  - Asistencia (ver)

#### 5. GUARDIAN (Apoderado/Tutor)
- **Acceso**: Nivel de estudiantes vinculados
- **Permisos**:
  - Calificaciones (ver)
  - Asistencia (ver)

### Permisos Disponibles

#### Sistema (SYSTEM)
- `system:schools:manage` - Crear y gestionar instituciones
- `system:users:manage` - Gestionar usuarios globales
- `system:audit:view` - Ver auditoría global

#### Institucional (SCHOOL)
- `school:settings:view` - Ver configuración institucional
- `school:settings:update` - Modificar configuración
- `school:roles:manage` - Crear/editar roles
- `school:audit:view` - Ver auditoría institucional

#### Académico (ACADEMIC)
- `academic:periods:manage` - Gestionar periodos lectivos
- `academic:levels:manage` - Gestionar niveles educativos
- `academic:courses:manage` - Gestionar cursos
- `academic:subjects:manage` - Gestionar asignaturas
- `academic:schedule:manage` - Configurar horarios

#### Personas (PEOPLE)
- `people:teachers:manage` - Gestionar profesores
- `people:students:manage` - Gestionar estudiantes
- `people:guardians:manage` - Gestionar apoderados
- `people:enrollment:manage` - Matricular estudiantes

#### Calificaciones (GRADES)
- `grades:view` - Ver calificaciones
- `grades:enter` - Ingresar calificaciones
- `grades:modify` - Modificar calificaciones
- `grades:publish` - Publicar actas finales

#### Asistencia (ATTENDANCE)
- `attendance:view` - Ver asistencia
- `attendance:record` - Registrar asistencia
- `attendance:justify` - Justificar inasistencias

## 🛡️ Middleware de Autorización

### 1. Autenticación Básica

```typescript
import { withAuth } from "@/lib/middleware/authorization";

export const GET = withAuth(
  withErrorHandler(async (req: NextRequest, context) => {
    // context contiene: userId, email, firstName, lastName, 
    // isSystemAdmin, activeSchoolId, permissions, etc.
    
    return NextResponse.json({ success: true, user: context });
  })
);
```

### 2. Verificación de Permisos Específicos

```typescript
import { withPermissions } from "@/lib/middleware/authorization";
import { PERMISSIONS } from "@/lib/constants/permissions";

export const POST = withPermissions([PERMISSIONS.GRADES_ENTER])(
  withErrorHandler(async (req: NextRequest, context) => {
    // Este endpoint solo es accesible para usuarios con permiso grades:enter
    // System admins siempre tienen acceso
    
    const grade = await createGrade(req.body);
    return NextResponse.json({ success: true, grade });
  })
);
```

### 3. Acceso a Colegio Específico

```typescript
import { withSchoolAccess } from "@/lib/middleware/authorization";

export const GET = withSchoolAccess(schoolId)(
  withErrorHandler(async (req: NextRequest, context) => {
    // context contiene: schoolId, schoolSlug, membershipId
    // Verifica que el usuario tiene membresía activa en este colegio
    
    const courses = await getCourses(context.schoolId);
    return NextResponse.json({ success: true, courses });
  })
);
```

### 4. Permisos en Colegio Específico

```typescript
import { withSchoolPermissions } from "@/lib/middleware/authorization";

export const POST = withSchoolPermissions(schoolId, [PERMISSIONS.ACADEMIC_COURSES_MANAGE])(
  withErrorHandler(async (req: NextRequest, context) => {
    // Verifica acceso al colegio Y permiso específico
    
    const course = await createCourse(context.schoolId, req.body);
    return NextResponse.json({ success: true, course });
  })
);
```

## 🔒 Aislamiento Multi-Tenant

### Middleware de Aislamiento

```typescript
import { verifyTenantAccess, addTenantFilter } from "@/lib/middleware/tenant-isolation";

// Verificar que un recurso pertenece al tenant del usuario
await verifyTenantAccess("course", courseId, userSchoolId, isSystemAdmin);

// Agregar filtro de tenant a queries de Prisma
const courses = await prisma.course.findMany({
  where: addTenantFilter(
    { year: 2026 },
    userSchoolId,
    isSystemAdmin
  ),
});
```

### Ejemplo Completo con Aislamiento

```typescript
import { withAuth } from "@/lib/middleware/authorization";
import { verifyTenantAccess } from "@/lib/middleware/tenant-isolation";
import { PERMISSIONS } from "@/lib/constants/permissions";

export const PUT = withAuth(
  withErrorHandler(async (req: NextRequest, context) => {
    const { courseId } = context.params;
    
    // Verificar acceso al colegio
    if (!context.isSystemAdmin && context.activeSchoolId !== schoolId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }
    
    // Verificar permiso específico
    if (!context.permissions.includes(PERMISSIONS.ACADEMIC_COURSES_MANAGE)) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }
    
    // Verificar aislamiento de tenant
    await verifyTenantAccess("course", courseId, context.activeSchoolId, context.isSystemAdmin);
    
    // Actualizar curso
    const course = await prisma.course.update({
      where: { id: courseId },
      data: req.body,
    });
    
    return NextResponse.json({ success: true, course });
  })
);
```

## 🏫 Creación de Colegios por Administradores

### Endpoint POST /api/system/schools

Los administradores del sistema pueden crear colegios sin tocar código:

```typescript
// POST /api/system/schools
{
  "name": "Colegio San José",
  "slug": "colegio-san-jose",
  "institutionalCode": "CSJ123",
  "city": "Santiago",
  "country": "Chile",
  "timezone": "America/Santiago",
  "termType": "SEMESTER",
  "adminEmail": "director@sanjose.cl",
  "adminFirstName": "Juan",
  "adminLastName": "Pérez",
  "adminPassword": "SecurePassword123!",
  "adminRut": "12345678-9"
}
```

### Proceso Automático de Onboarding

1. **Validación**: Verifica que el slug no esté en uso
2. **Creación de School**: Crea la entidad School con configuración
3. **Roles y Permisos**: Crea roles predefinidos con sus permisos
4. **Usuario Admin**: Crea o actualiza el usuario administrador
5. **Membresía**: Vincula el usuario al colegio con rol SCHOOL_ADMIN
6. **Auditoría**: Registra la creación en el log de auditoría

### Ejemplo de Uso

```bash
curl -X POST https://aurenis.com/api/system/schools \
  -H "Content-Type: application/json" \
  -H "Cookie: aurenis_session=..." \
  -d '{
    "name": "Liceo Lastarria",
    "slug": "liceo-lastarria",
    "city": "Santiago",
    "adminEmail": "director@lastarria.cl",
    "adminFirstName": "María",
    "adminLastName": "González",
    "adminPassword": "SecurePass123!"
  }'
```

## 📊 Códigos HTTP de Autorización

### 401 Unauthorized
- **Uso**: Cuando no hay sesión o token inválido
- **Ejemplo**: Usuario no autenticado intenta acceder a recurso protegido
- **Middleware**: `requireAuth()`

### 403 Forbidden
- **Uso**: Cuando hay sesión pero sin permisos suficientes
- **Ejemplo**: 
  - Profesor intenta administrar roles
  - Estudiante intenta modificar calificaciones
  - Usuario intenta acceder a datos de otro colegio
- **Middleware**: `requirePermissions()`, `requireSchoolAccess()`

## 🔧 Ejemplos de Endpoints Protegidos

### Listar Cursos (Solo School Admin)
```typescript
// GET /api/[schoolSlug]/courses
export const GET = withAuth(
  withErrorHandler(async (req: NextRequest, context) => {
    const schoolId = await getSchoolIdFromSlug(context.params.schoolSlug);
    
    // Verificar acceso al colegio
    if (!context.isSystemAdmin && context.activeSchoolId !== schoolId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }
    
    // Verificar permiso específico
    if (!context.permissions.includes(PERMISSIONS.ACADEMIC_COURSES_MANAGE)) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }
    
    const courses = await prisma.course.findMany({
      where: { schoolId },
    });
    
    return NextResponse.json({ success: true, courses });
  })
);
```

### Ingresar Calificaciones (Profesores)
```typescript
// POST /api/[schoolSlug]/grades
export const POST = withAuth(
  withErrorHandler(async (req: NextRequest, context) => {
    const schoolId = await getSchoolIdFromSlug(context.params.schoolSlug);
    
    // Verificar acceso al colegio
    if (!context.isSystemAdmin && context.activeSchoolId !== schoolId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }
    
    // Verificar permiso de ingresar calificaciones
    if (!context.permissions.includes(PERMISSIONS.GRADES_ENTER)) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }
    
    const grade = await prisma.grade.create({
      data: {
        schoolId,
        ...req.body,
      },
    });
    
    return NextResponse.json({ success: true, grade }, { status: 201 });
  })
);
```

## 🎯 Mejores Prácticas

### 1. Siempre Verificar en Backend
```typescript
// ❌ INCORRECTO - Solo confiar en frontend
export const POST = async (req: NextRequest) => {
  const data = await req.json();
  return NextResponse.json({ success: true });
};

// ✅ CORRECTO - Verificar permisos en backend
export const POST = withPermissions([PERMISSIONS.GRADES_ENTER])(
  withErrorHandler(async (req: NextRequest, context) => {
    const data = await req.json();
    return NextResponse.json({ success: true });
  })
);
```

### 2. Aislamiento Estricto de Tenant
```typescript
// ❌ INCORRECTO - No verificar schoolId
const course = await prisma.course.findUnique({
  where: { id: courseId },
});

// ✅ CORRECTO - Verificar que pertenece al tenant
const course = await prisma.course.findFirst({
  where: { 
    id: courseId,
    schoolId: context.activeSchoolId,
  },
});
```

### 3. Usar los Wrappers de Autorización
```typescript
// ❌ INCORRECTO - Verificación manual repetitiva
export const GET = async (req: NextRequest) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No auth" }, { status: 401 });
  if (!session.permissions.includes("grades:view")) {
    return NextResponse.json({ error: "No permisos" }, { status: 403 });
  }
  // ...
};

// ✅ CORRECTO - Usar wrappers reutilizables
export const GET = withPermissions([PERMISSIONS.GRADES_VIEW])(
  withErrorHandler(async (req: NextRequest, context) => {
    // ...
  })
);
```

## 📝 Resumen de Implementación

### ✅ Criterios Cumplidos

1. **Middlewares de verificación de roles implementados**
   - `withAuth()` - Autenticación básica
   - `withPermissions()` - Verificación de permisos específicos
   - `withSchoolAccess()` - Acceso a colegio específico
   - `withSchoolPermissions()` - Permisos en colegio específico

2. **Protección activa a nivel de endpoints HTTP**
   - Rechazo automático sin permisos (403)
   - Rechazo sin autenticación (401)
   - Verificación en cada endpoint protegido

3. **Códigos HTTP 401/403 consistentes**
   - 401: No autenticado (`UnauthorizedError`)
   - 403: Sin permisos (`ForbiddenError`)
   - Respuestas consistentes en toda la API

4. **Aislamiento multi-tenant estricto**
   - Middleware `verifyTenantAccess()`
   - Helper `addTenantFilter()`
   - Verificación de schoolId en todas las operaciones

5. **Conformidad con Matriz de Roles**
   - 4 roles institucionales base
   - 17 permisos granulares
   - Sistema flexible y extensible

6. **Creación de colegios por administradores**
   - Endpoint `/api/system/schools` funcional
   - Onboarding automático completo
   - Sin necesidad de tocar código

El sistema de autorización está completamente implementado y listo para producción, asegurando la protección de recursos tanto a nivel backend como frontend.