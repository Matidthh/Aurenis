# Aurenis — Plataforma de Gestión Académica Multi-Institución

**Aurenis** es una plataforma web moderna, modular y escalable para la administración académica de múltiples colegios y liceos independientes (*multi-tenant*) sobre una misma infraestructura centralizada, garantizando un aislamiento estricto de datos en el backend.

---

## 🏗️ 1. Arquitectura General y Backend

La arquitectura está diseñada bajo principios de separación de capas (*Layered Architecture*), donde las interfaces nunca interactúan directamente con la base de datos sin atravesar el perímetro de validación, autorización y contexto institucional:

```
Navegador / Dispositivo
       ↓
Next.js Edge Middleware (Validación JWT, Protección perimetral, Detección de Tenant)
       ↓
Rutas / Server Actions (Validación con esquemas Zod)
       ↓
Tenant Context Enforcer (requireTenantContext: valida membresía y rol activo)
       ↓
PBAC / RBAC Evaluator (assertPermission / hasPermission)
       ↓
Servicios de Dominio Puro (lib/services/*)
       ↓
Prisma Client Scoped (createTenantPrisma: auto-inyección obligatoria de schoolId)
       ↓
PostgreSQL en Neon (Connection Pooling + Direct URL)
```

### Servicios de Backend (`lib/services/`)
* **`school.service.ts`**: Transacción ACID de onboarding institucional, configuración de escalas y periodos.
* **`user.service.ts`**: Autenticación de credenciales y consulta de membresías activas.
* **`student.service.ts`**: Fichas de alumnos, matrículas por curso y contactos de apoderados.
* **`teacher.service.ts`**: Plantel docente, especialidades y cargas académicas.
* **`academic.service.ts`**: Catálogo de cursos, niveles educativos y mallas de asignaturas.
* **`grade.service.ts`**: Libro de actas de notas, evaluaciones y promedios según la escala del colegio.
* **`attendance.service.ts`**: Libro diario de asistencia, justificaciones y tasas de cumplimiento.
* **`audit.service.ts`**: Registro asíncrono y estructurado de bitácora de auditoría.

---

## 🐘 2. Base de Datos (PostgreSQL en Neon)

PostgreSQL gestionado en la nube con arquitectura dual de conexión:
* **`DATABASE_URL`**: Conexión agrupada mediante **Connection Pooling (PgBouncer)** para entornos serverless (evita el error `max_connections exceeded`).
* **`DIRECT_URL`**: Conexión directa no agrupada para migraciones DDL (`prisma db push`, `prisma migrate`).

### Modelo Relacional Canónico (21 Tablas):
* **Core**: `User`, `School`, `Membership`, `Role`, `Permission`, `RolePermission`.
* **Institución**: `SchoolSettings`, `AcademicPeriod`, `EducationLevel`, `Course`, `Subject`.
* **Personas**: `TeacherProfile`, `StudentProfile`, `GuardianProfile`, `StudentGuardian`.
* **Académico**: `Enrollment`, `Assessment`, `Grade`, `AttendanceRecord`, `ScheduleBlock`.
* **Sistema**: `AuditLog`, `FileRecord`.

---

## 💎 3. Prisma ORM & Aislamiento Multi-Tenant

El aislamiento entre instituciones **no depende del frontend**. Se garantiza a nivel de consultas mediante la extensión `createTenantPrisma(schoolId)` ([`lib/db/tenant-extension.ts`](./lib/db/tenant-extension.ts)):

1. Intercepta automáticamente todas las lecturas (`findMany`, `findFirst`, `count`, etc.) e inyecta `where: { schoolId }`.
2. Intercepta escrituras (`create`, `createMany`) y fuerza `data.schoolId = schoolId`. Si el payload intenta escribir en otro `schoolId`, aborta con error fatal de seguridad.
3. Se protegen índices únicos compuestos como `@@unique([schoolId, year, name])` para cursos y matrículas.

---

## 🔌 4. Endpoints y APIs

* `POST /api/auth/login`: Autenticación con email y contraseña, verificación de hash con bcrypt y emisión de cookie de sesión.
* `POST /api/auth/select-school`: Cambio de colegio activo sin reingresar credenciales para usuarios multi-membresía.
* `POST /api/auth/logout`: Revocación y limpieza de cookies de sesión.
* `GET /api/system/schools`: Listado global de colegios (exclusivo para `SYSTEM_ADMIN`).
* `POST /api/system/schools`: Asistente de onboarding de nueva institución con creación del directivo escolar inicial.
* `PATCH /api/schools/[schoolId]/settings`: Modificación de escala de notas, régimen y color corporativo (protegido por permiso `school:settings:update`).

---

## 🔐 5. Autenticación & Membresías

Aurenis desacopla la identidad personal del vínculo institucional:

$$\text{User} \longrightarrow \text{Membership} \longrightarrow \text{School} + \text{Role}$$

* **Criptografía**: Contraseñas cifradas con algoritmo de hashing seguro `bcryptjs` (salt rounds: 10).
* **Sesiones Seguras**: Tokens JWT generados con `jose`, firmados criptográficamente y encapsulados en cookies `HTTP-Only`, `SameSite: Lax` y `Secure`. Inmunes a ataques de inyección XSS.
* **Selector de Colegio**: Si un usuario (ej. un profesor o apoderado) pertenece a más de una escuela, puede alternar entre ellas desde `/select-school` sin cerrar sesión.

---

## 🛡️ 6. Roles y Permisos Granulares (RBAC + PBAC)

Los permisos no están codificados como un condicional rígido (`if role === 'admin'`). Se utiliza **PBAC (Permission-Based Access Control)** con un catálogo de 17 permisos atómicos:

| Módulo | Códigos de Permiso |
| :--- | :--- |
| **Sistema** | `system:schools:manage`, `system:users:manage`, `system:audit:view` |
| **Colegio** | `school:settings:view`, `school:settings:update`, `school:roles:manage`, `school:audit:view` |
| **Académico** | `academic:periods:manage`, `academic:levels:manage`, `academic:courses:manage`, `academic:subjects:manage`, `academic:schedule:manage` |
| **Personas** | `people:teachers:manage`, `people:students:manage`, `people:guardians:manage`, `people:enrollment:manage` |
| **Calificaciones** | `grades:view`, `grades:enter`, `grades:modify`, `grades:publish` |
| **Asistencia** | `attendance:view`, `attendance:record`, `attendance:justify` |

**Presets de Roles Disponibles**: `SYSTEM_ADMIN`, `SCHOOL_ADMIN`, `TEACHER`, `STUDENT`, `GUARDIAN`.

---

## 🔒 7. Seguridad Integral

1. **Aislamiento a nivel de datos**: Inyección obligatoria de `schoolId` en la capa de persistencia.
2. **Validación estricta de entradas**: Esquemas declarativos con **Zod** para prevenir payloads maliciosos.
3. **Protección en el Edge**: [`middleware.ts`](./middleware.ts) valida tokens JWT antes de alcanzar las rutas del servidor.
4. **Auditoría inmutable (`AuditLog`)**: Registro de cambios de notas, asistencia, accesos y configuraciones.

---

## 💻 8. Estructura de Vistas y Paneles

```
app/
├── (auth)/
│   ├── login/                     # Inicio de sesión
│   └── select-school/             # Selector de institución activa
├── system/                        # PANEL GLOBAL (SYSTEM_ADMIN)
│   ├── dashboard/                 # Métricas globales de la plataforma
│   └── schools/                   # Lista de colegios y nuevo onboarding
└── [schoolSlug]/                  # PANEL INSTITUCIONAL DEL COLEGIO
    ├── dashboard/                 # Métricas académicas del año lectivo
    ├── students/                  # Fichas de estudiantes y matrículas
    ├── teachers/                  # Plantel docente y especialidades
    ├── courses/                   # Catálogo de cursos por nivel y división
    ├── subjects/                  # Malla de asignaturas y horas pedagógicas
    ├── grades/                    # Actas de calificaciones y promedios
    ├── attendance/                # Libro de asistencia diaria y tasas %
    └── settings/                  # Configuración institucional y escalas
```

---

## 🚀 9. Despliegue en Vercel

1. **Subir el repositorio a GitHub**.
2. **Importar el proyecto en [Vercel](https://vercel.com)**:
   * Framework Preset: **Next.js**
   * Root Directory: `./`
3. **Variables de Entorno en Vercel**:
   * `DATABASE_URL`: Tu cadena de conexión Neon con pooler.
   * `DIRECT_URL`: Tu cadena de conexión Neon directa.
   * `JWT_SECRET`: Llave secreta aleatoria de al menos 32 caracteres.
   * `SESSION_COOKIE_NAME`: `aurenis_session`
   * `NEXT_PUBLIC_APP_NAME`: `Aurenis`
   * `NEXT_PUBLIC_APP_URL`: URL de tu dominio (ej: `https://aurenis.vercel.app`).
4. **Build & Deployment**:
   * El script `"build": "prisma generate && next build"` genera automáticamente el cliente de Prisma antes de compilar Next.js.

---

## 📦 Comandos de Desarrollo

```bash
# Iniciar servidor de desarrollo
npm.cmd run dev

# Sincronizar esquema de Prisma a PostgreSQL
npm.cmd run db:push

# Ejecutar seed de datos iniciales
npm.cmd run db:seed

# Abrir Prisma Studio (explorador gráfico de la BBDD)
npm.cmd run db:studio

# Compilación de producción
npm.cmd run build
```

### Cuentas de Acceso Iniciales (Sembradas):
* **SuperAdministrador**: `admin@aurenis.com` / `AurenisSuperAdmin2026!`
* **Director Colegio San José**: `director@sanjose.cl` / `AdminCSJ2026!`
* **Profesor Matemáticas**: `profesor.matematica@sanjose.cl` / `Profesor2026!`
