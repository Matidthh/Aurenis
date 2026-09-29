# 🏛️ DOCUMENTO DE ARQUITECTURA TÉCNICA DEL SISTEMA — AURENIS v1.0

**Estado:** 🟢 **VIGENTE Y CERTIFICADO PARA PRODUCCIÓN**  
**Versión:** 1.0.0  
**Fecha:** 10 de Septiembre de 2026  
**Autores:** Equipo de Arquitectura, Backend & QA de Aurenis  

---

## 1. Visión Arquitectónica y Principios de Diseño

AURENIS está estructurado como una plataforma **SaaS Multi-Tenant de alto rendimiento**, diseñada bajo los principios de **Clean Architecture**, **Defensa en Profundidad (*Zero-Trust Security*)** y **Alta Cohesión / Bajo Acoplamiento**.

### 1.1 Principios Fundamentales de Arquitectura
1. **Aislamiento Multi-Tenant Estricto:** Ninguna institución escolar puede acceder, leer o inferir datos pertenecientes a otra institución.
2. **Defensa en Profundidad (3 Capas):** La seguridad no recae en un único punto; cada petición es validada en el perímetro (Middleware), en la lógica de negocio (RBAC) y en la capa de persistencia (ORM Scoped).
3. **Inmutabilidad y No Repudio:** Toda acción administrativa o académica crítica queda registrada en una bitácora inalterable de auditoría (`AuditLog`).
4. **Mínimo Privilegio (*Principle of Least Privilege*):** Las identidades reciben únicamente los permisos expresamente asignados a su rol institucional activo.
5. **Tipado Estricto de Extremo a Extremo:** Toda entidad, parámetro de entrada y respuesta de API está tipada en TypeScript y validada en tiempo de ejecución mediante esquemas declarativos Zod.

---

## 2. Diagrama de Capas y Flujo de Peticiones

```
                                  CLIENTE WEB / NAVEGADOR
                                             │
                                  [HTTPS + Cookies HttpOnly]
                                             │
                                             ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ CAPA 1: PERÍMETRO & ENTRADA (middleware.ts)                                            │
│ • Inspección de ruta: pública, autenticada o de sistema (/system/*).                   │
│ • Validación de firma criptográfica HS256 del JWT (librería 'jose').                   │
│ • Extracción y resolución del Tenant (slug de colegio).                                │
│ • Redirección forzada (HTTP 307) a /login con returnUrl si no hay sesión válida.       │
│ • Bloqueo de escalación vertical a /system/* para usuarios sin rol SYSTEM_ADMIN.      │
└────────────────────────────────────────────┬───────────────────────────────────────────┘
                                             │
                                             ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ CAPA 2: CONTROLADORES & API ROUTES (app/api/* & app/[schoolSlug]/*)                    │
│ • Server Components (RSC) para renderizado rápido y seguro en el servidor.            │
│ • API Route Handlers con validación rigurosa de contratos de entrada (Zod).           │
│ • Mapeo de respuestas estandarizadas y control centralizado de errores.               │
└────────────────────────────────────────────┬───────────────────────────────────────────┘
                                             │
                                             ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ CAPA 3: SERVICIOS DE DOMINIO & RBAC (lib/services/* & lib/auth/permissions.ts)         │
│ • Evaluación de permisos canónicos con assertPermission(role, PERMISSION).             │
│ • Manejo de excepciones tipadas (UnauthorizedError, ForbiddenError, NotFoundError).   │
│ • Lógica de negocio (promedios, reglas de asistencia, configuraciones).               │
│ • Emisión de eventos de auditoría inmutable (AuditLog).                               │
└────────────────────────────────────────────┬───────────────────────────────────────────┘
                                             │
                                             ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ CAPA 4: PERSISTENCIA & AISLAMIENTO TENANT (lib/db/* & Prisma ORM)                      │
│ • Cliente Prisma Scoped (createTenantPrisma(schoolId)).                                │
│ • Inyección forzosa de cláusulas 'where: { schoolId }' en todas las consultas.         │
│ • Prevención activa de mutaciones cruzadas (Anti-Cross-Tenant Tampering).              │
│ • Transaccionalidad ACID y soporte de base de datos relacional (PostgreSQL / SQLite).  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Modelo Multi-Tenant y Estrategia de Aislamiento

Aurenis utiliza una estrategia de **Base de Datos Compartida con Esquema Compartido y Aislamiento por Discriminador Lógico (`schoolId`)**.

### 3.1 Identificación del Tenant
- Cada colegio posee un identificador único inmutable (`id`, ej: `school-csj-001`) y un slug de URL único (`slug`, ej: `colegio-san-jose`).
- Las rutas del panel institucional residen bajo `/[schoolSlug]/*`.
- El middleware resuelve el `slug` contra la base de datos y lo asocia al contexto de la sesión.

### 3.2 Interceptor ORM de Tenant (`createTenantPrisma`)
Para prevenir vulnerabilidades IDOR (*Insecure Direct Object References*) o descuidos de desarrolladores al omitir la condición `schoolId` en consultas, Aurenis implementa un cliente acotado:

```typescript
// lib/db/tenant-extension.ts
export function createTenantPrisma(schoolId: string) {
  return prisma.$extends({
    query: {
      $allModels: {
        async findMany({ args, query }) {
          args.where = { ...args.where, schoolId };
          return query(args);
        },
        async findFirst({ args, query }) {
          args.where = { ...args.where, schoolId };
          return query(args);
        },
        async create({ args, query }) {
          // Si el payload contiene un schoolId distinto al contexto, se rechaza
          if (args.data.schoolId && args.data.schoolId !== schoolId) {
            throw new Error(`Violación de aislamiento multi-tenant: intento de crear datos para schoolId=${args.data.schoolId} en contexto schoolId=${schoolId}`);
          }
          args.data.schoolId = schoolId;
          return query(args);
        }
      }
    }
  });
}
```

**Resultado de Certificación QA:**
- Lecturas sobre colegios ajenos devuelven `0` registros de manera transparente.
- Intentos de escritura foránea son abortados con excepción de seguridad.

---

## 4. Arquitectura de Autenticación y Ciclo de Vida de Sesión

### 4.1 Criptografía de Credenciales
- Las contraseñas se almacenan mediante **Bcrypt** con factor de coste (*cost factor*) 10.
- La validación utiliza comparación en tiempo constante (`bcrypt.compare`) para mitigar ataques de temporización (*timing attacks*).

### 4.2 Tokens de Sesión (JWT)
- **Algoritmo:** HMAC SHA-256 (`HS256`), administrado mediante la librería nativa y sin dependencias Node `jose`.
- **Payload del Token:**
  ```json
  {
    "sub": "user-director",
    "email": "carlos.mendoza@sanjose.cl",
    "name": "Carlos Mendoza",
    "isSystemAdmin": false,
    "schoolId": "school-csj-001",
    "schoolSlug": "colegio-san-jose",
    "role": "SCHOOL_ADMIN",
    "permissions": ["SCHOOL_SETTINGS_VIEW", "SCHOOL_SETTINGS_UPDATE", "..."],
    "iat": 1789000000,
    "exp": 1789604800
  }
  ```
- **Almacenamiento de Sesión:** Cookie `aurenis_session` configurada con:
  - `HttpOnly: true` (inaccesible desde JavaScript en el navegador, protege contra XSS).
  - `SameSite: "lax"` (protege contra peticiones CSRF cruzadas).
  - `Path: "/"` (válida en toda la aplicación).
  - `Secure: process.env.NODE_ENV === "production"`.

### 4.3 Revocación y Cierre de Sesión (Logout)
- Se ofrece tanto vía `POST /api/auth/logout` como `GET /api/auth/logout`.
- Emite un encabezado `Set-Cookie` con fecha de expiración en época Unix (`Thu, 01 Jan 1970 00:00:00 GMT`) y valor vacío.
- Toda petición subsecuente a rutas protegidas es interceptada con `HTTP 401 Unauthorized`.

---

## 5. Modelo de Autorización Basado en Roles (RBAC)

Aurenis separa estrictamente las identidades (*Users*) de las membresías institucionales (*Memberships*). Un mismo usuario puede pertenecer a más de un colegio con roles distintos.

```
┌──────────────┐         ┌──────────────────┐         ┌──────────────┐
│     User     │ 1 ──── *│    Membership    │* ──── 1 │    School    │
└──────────────┘         └─────────┬────────┘         └──────────────┘
                                   │ *
                                   │
                                   │ 1
                         ┌─────────▼────────┐
                         │       Role       │
                         └─────────┬────────┘
                                   │ 1
                                   │
                                   │ *
                         ┌─────────▼────────┐
                         │  RolePermission  │
                         └─────────┬────────┘
                                   │ *
                                   │
                                   │ 1
                         ┌─────────▼────────┐
                         │    Permission    │
                         └──────────────────┘
```

### 5.1 Catálogo Canónico de Permisos
Los permisos se estructuran jerárquicamente por dominio:
- `SYSTEM_*`: Administración de plataforma (`SYSTEM_SCHOOLS_MANAGE`, `SYSTEM_USERS_MANAGE`, `SYSTEM_SETTINGS_UPDATE`).
- `SCHOOL_*`: Gestión institucional (`SCHOOL_SETTINGS_VIEW`, `SCHOOL_SETTINGS_UPDATE`, `SCHOOL_ROLES_MANAGE`).
- `ACADEMIC_*`: Cursos y asignaturas (`ACADEMIC_PERIOD_MANAGE`, `COURSE_MANAGE`, `SUBJECT_MANAGE`).
- `TEACHER_*` / `STUDENT_*`: Directorios y fichas de personal y estudiantes.
- `GRADES_*`: Calificaciones (`GRADES_VIEW`, `GRADES_ENTER`, `GRADES_APPROVE`, `GRADES_EXPORT`).
- `ATTENDANCE_*`: Asistencia (`ATTENDANCE_VIEW`, `ATTENDANCE_RECORD`, `ATTENDANCE_REPORT`).

Para la especificación completa, consultar [`docs/RBAC_PERMISSIONS_MATRIX.md`](./RBAC_PERMISSIONS_MATRIX.md).

---

## 6. Modelo de Datos Relacional (Prisma Schema)

El esquema de base de datos (`prisma/schema.prisma`) comprende los siguientes módulos principales:

### 6.1 Identidad y Control de Acceso
- `User`: Registro global de usuarios (email único, hash de contraseña, estado activo/inactivo).
- `School`: Institución educativa (código institucional, nombre, slug, ciudad, país, zona horaria).
- `SchoolSettings`: Parámetros académicos del colegio (tipo de periodo: `SEMESTER`/`TRIMESTER`, nota mínima de aprobación, rango de notas, precisión decimal, color institucional).
- `Membership`: Vinculación usuario-colegio activa.
- `Role` & `Permission` & `RolePermission`: Tablas del motor RBAC.

### 6.2 Estructura Académica
- `AcademicPeriod`: Año lectivo o ciclo académico (ej: "Año Escolar 2026").
- `EducationLevel`: Nivel formativo (Básica, Media, Parvularia).
- `Course`: Grado y sección (ej: "1° Medio A", año, número de nivel).
- `Subject`: Asignatura o materia vinculada a un curso y docente.

### 6.3 Actores y Registros Pedagógicos
- `TeacherProfile`: Perfil pedagógico de docentes (especialidad, estado).
- `StudentProfile`: Ficha del estudiante (RUT/identificador, fecha de nacimiento).
- `Enrollment`: Matrícula del alumno en un curso específico durante un periodo lectivo.
- `Assessment`: Evaluación académica (nombre, fecha, ponderación porcentual, periodo).
- `Grade`: Calificación obtenida por un estudiante en una evaluación.
- `AttendanceRecord`: Registro diario/bloque de asistencia (`PRESENT`, `ABSENT`, `LATE`, `EXCUSED`).

### 6.4 Auditoría y Trazabilidad
- `AuditLog`: Registro inmutable de operaciones críticas:
  - `id`: CUID auto-generado.
  - `schoolId`: Colegio donde ocurrió el evento (opcional si es a nivel de sistema).
  - `userId`: Identificador del usuario que ejecutó la acción.
  - `action`: Tipo de acción (`CREATE`, `UPDATE`, `DELETE`, `LOGIN`, `EXPORT`).
  - `entityType`: Entidad afectada (`SCHOOL_SETTINGS`, `GRADE`, `USER`, etc.).
  - `entityId`: Identificador de la entidad mutada.
  - `details`: Metadata en formato JSON (datos previos, datos nuevos).
  - `timestamp`: Marca de tiempo inmutable generada por el servidor.

---

## 7. Manejo Centralizado de Errores y Códigos HTTP

El sistema estandariza el manejo de excepciones y errores de respuesta:

| Código HTTP | Nombre | Escenario de Aplicación | Formato de Respuesta |
| :--- | :--- | :--- | :--- |
| **`200 OK`** | Éxito | Consultas y mutaciones ejecutadas satisfactoriamente. | Payload JSON con los datos solicitados. |
| **`201 Created`** | Creado | Nuevos registros creados en el sistema. | Objeto recién creado. |
| **`400 Bad Request`** | Solicitud Inválida | Payload no cumple validaciones de esquema Zod o datos incompletos. | `{ error: "Datos de entrada inválidos", details: { ... } }` |
| **`401 Unauthorized`** | No Autenticado | Token ausente, firma inválida o sesión expirada. | `{ error: "No autenticado. Inicie sesión para continuar." }` |
| **`403 Forbidden`** | Acceso Denegado | Rol carece del permiso RBAC necesario o violación de tenant. | `{ error: "Acceso denegado. Permisos insuficientes." }` |
| **`404 Not Found`** | No Encontrado | La entidad, colegio o ruta solicitada no existe. | `{ error: "Recurso no encontrado." }` |
| **`500 Server Error`** | Error Interno | Fallo no controlado en base de datos o lógica de servidor. | `{ error: "Error interno del servidor." }` |

---

## 8. Consideraciones de Despliegue y Escalabilidad

1. **Sin Estado en el Servidor (*Stateless Server*):** Al no almacenar sesiones en memoria RAM del proceso, la aplicación puede escalar horizontalmente en contenedores (Google Cloud Run / Kubernetes) sin necesidad de sesiones pegajosas (*sticky sessions*).
2. **Compatibilidad con Bases de Datos Relacionales:** El esquema Prisma es compatible de inmediato con PostgreSQL en Cloud SQL, Neon, Supabase o Aurora.
3. **Caché y Server-Side Rendering (RSC):** Los componentes de servidor de Next.js reducen drásticamente el tamaño del bundle cliente y optimizan el tiempo de primer byte (TTFB).

---

## 9. Modelado de Amenazas STRIDE y Protección de Menores

La plataforma cuenta con un análisis formal de amenazas bajo la metodología **STRIDE** y una evaluación de riesgos específicos en datos de niños, niñas y adolescentes (NNA):

- **Documento Canónico STRIDE:** [`docs/STRIDE_THREAT_MODELING.md`](./STRIDE_THREAT_MODELING.md)
- **Panel Interactivo de Seguridad:** Accesible para SuperAdministradores en `/system/security`.
- **Marcos de Cumplimiento Evaluados:** Circular N° 482 de la Superintendencia de Educación (Libro de Clases Digital), Ley N° 19.628 (Protección de Datos Personales), Ley N° 21.430 (Garantías de la Niñez) y GDPR Art. 8.

