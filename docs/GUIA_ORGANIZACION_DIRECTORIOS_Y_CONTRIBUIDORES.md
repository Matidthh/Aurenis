# 📂 GUÍA DE ORGANIZACIÓN DE DIRECTORIOS Y MANUAL DE NUEVOS CONTRIBUIDORES — AURENIS SaaS

**Documento:** Manual Técnico de Organización del Código, Archivos Clave y Onboarding de Desarrolladores  
**Plataforma:** AURENIS — Sistema Integral de Gestión Escolar y Académica Multi-Tenant  
**Versión:** 2.0.0 (Release Candidate / 30 Días para Entrega Final)  
**Fecha de Publicación:** 27 de Septiembre de 2026  
**Líder de Arquitectura & Backend:** **Maicol R.** (*Project Lead*)  
**Desarrollador Frontend & Lógica de Cliente:** **Malcom Marcelo** (*Frontend Lead*)  
**Diseño UI/UX & Design System:** **Lucas P.** (*Design Lead*)  
**Aseguramiento de Calidad & Ciberseguridad:** **Frank M.** (*QA & Pentesting Lead*)  

---

## 📑 ÍNDICE GENERAL

1. [Visión General de la Estructura de Software](#1-visión-general-de-la-estructura-de-software)
2. [Árbol de Directorios Exhaustivo (Frontend y Backend)](#2-árbol-de-directorios-exhaustivo-frontend-y-backend)
3. [Explicación Detallada de Carpetas y Módulos](#3-explicación-detallada-de-carpetas-y-módulos)
   - 3.1 Módulo Backend y Capa de Datos (`/lib`, `/prisma`, `/app/api`)
   - 3.2 Módulo Frontend y Capa de Presentación (`/app`, `/components`, `/public`)
   - 3.3 Módulo de QA, Pruebas y Seguridad (`/scripts`, `/docs`)
4. [Catálogo de Archivos Clave del Núcleo y Atribución de Responsabilidades](#4-catálogo-de-archivos-clave-del-núcleo-y-atribución-de-responsabilidades)
5. [Guía de Onboarding para Nuevos Contribuidores](#5-guía-de-onboarding-para-nuevos-contribuidores)
   - 5.1 Requisitos Previos y Configuración del Entorno
   - 5.2 Flujo de Trabajo con Git y Convenciones de Ramas
   - 5.3 Estándares de Código y Políticas "Anti-AI Slop"
   - 5.4 Protocolo de Definición de Terminado (Definition of Done - DoD)
   - 5.5 Checklist Pre-Pull Request y Comandos de Validación
6. [Matriz de Roles y Escalabilidad del Equipo](#6-matriz-de-roles-y-escalabilidad-del-equipo)

---

## 1. VISIÓN GENERAL DE LA ESTRUCTURA DE SOFTWARE

AURENIS está construido bajo una arquitectura **Full-Stack Modular en Next.js 15+ (App Router)** y **TypeScript estricto**, respaldado por una base de datos relacional PostgreSQL modelada en **Prisma ORM**. La arquitectura se rige por tres principios cardinales de diseño:

1. **Aislamiento Multi-Tenant por Diseño:** Cada colegio opera como una entidad lógicamente segregada mediante la clave `schoolId` / `schoolSlug`. La base de datos y la capa de acceso a datos (`Scoped Prisma Client`) garantizan que ninguna consulta o mutación pueda cruzar las fronteras de un tenant (mitigación activa de vulnerabilidades BOLA/IDOR).
2. **Separación Estricta de Responsabilidades:** La lógica de persistencia, cifrado de datos sensibles (RUTs/Diagnósticos NNA) y validación de permisos RBAC reside **exclusivamente en el servidor**. El cliente React consume Server Actions y API Routes tipadas con esquemas Zod.
3. **Cero Mocks y Cero Placeholders:** Todo flujo visible en la plataforma cuenta con una tabla correspondiente en Prisma, endpoints validados, manejo uniforme de errores HTTP (RFC 7807) y auditoría inmutable en `AuditLog`.

---

## 2. ÁRBOL DE DIRECTORIOS EXHAUSTIVO (FRONTEND Y BACKEND)

A continuación se detalla la jerarquía completa de archivos y directorios del repositorio:

```
aurenis/
├── 📁 .github/                      # Workflows de CI/CD, automatizaciones y plantillas
│   └── 📁 workflows/                # Pipelines de GitHub Actions (build, test, lint, sec-scan)
├── 📁 app/                          # Next.js 15 App Router (Rutas de UI, layouts y endpoints de API)
│   ├── 📁 (auth)/                   # Grupo de rutas de autenticación pública
│   │   ├── 📁 login/                # Página de inicio de sesión (/login)
│   │   └── 📁 register/             # Registro inicial institucional (/register)
│   ├── 📁 [schoolSlug]/             # Rutas dinámicas con aislamiento multi-tenant por colegio
│   │   ├── 📁 attendance/           # Módulo de Asistencia Diaria (Circular 482)
│   │   ├── 📁 courses/              # Gestión de Cursos, Niveles y Aulas
│   │   ├── 📁 grades/               # Libro de Calificaciones y Decreto 67
│   │   ├── 📁 settings/             # Configuración Institucional y Roles del Colegio
│   │   ├── 📁 students/             # Fichas de Estudiantes y Expediente Académico
│   │   ├── 📁 teachers/             # Directorio Docente y Asignaciones Académicas
│   │   ├── 📄 layout.tsx            # Layout tenant con inyección de contexto y Sidebar
│   │   └── 📄 page.tsx              # Dashboard del Colegio según rol del usuario
│   ├── 📁 api/                      # Backend REST API Handlers (Validación Zod + Scoped Prisma)
│   │   ├── 📁 auth/                 # Endpoints de autenticación (/login, /logout, /me)
│   │   ├── 📁 contact/              # Endpoint de contacto y soporte institucional
│   │   ├── 📁 schools/              # Endpoints tenant (/api/schools/[id]/*)
│   │   │   └── 📁 [id]/
│   │   │       ├── 📁 attendance/   # Registro y auditoría de asistencia diaria
│   │   │       ├── 📁 grades/       # Inserción y cálculo ponderado de notas
│   │   │       ├── 📁 members/      # Gestión de usuarios del colegio y roles
│   │   │       ├── 📁 settings/     # Actualización de parámetros institucionales
│   │   │       ├── 📁 students/     # CRUD de alumnos y datos protegidos
│   │   │       └── 📁 teachers/     # Asignaciones curriculares de docentes
│   │   └── 📁 system/               # Control Plane para SuperAdmins (/api/system/schools)
│   ├── 📁 system/                   # UI del Panel Global de SuperAdmin (/system)
│   ├── 📁 mockups/                  # Vistas interactivas de demostración de módulos
│   ├── 📁 prototipo-figma/          # Navegación del prototipo de alta fidelidad
│   ├── 📄 error.tsx                 # Error Boundary global de la aplicación
│   ├── 📄 global-error.tsx          # Error Boundary de nivel raíz (HTML/Body)
│   ├── 📄 globals.css               # Estilos globales de Tailwind CSS y variables de diseño
│   ├── 📄 layout.tsx                # Root Layout con fuentes, providers y metadatos
│   ├── 📄 not-found.tsx             # Página 404 personalizada con navegación de rescate
│   └── 📄 page.tsx                  # Landing Page pública institucional con Hero y CTA
│
├── 📁 components/                   # Biblioteca de Componentes React (Modular y Accesible)
│   ├── 📁 academic/                 # Componentes de gestión pedagógica y asignaturas
│   ├── 📁 auth/                     # Formularios de login, selector de tenant y avatar de sesión
│   ├── 📁 features/                 # Módulos funcionales desacoplados (Libro digital, Métricas)
│   ├── 📁 grades/                   # Matriz de calificaciones, selector de periodos y promedios
│   ├── 📁 landing/                  # Secciones de la Landing Page pública (Hero, Features, Pricing)
│   ├── 📁 layout/                   # Sidebar, Navbar, Footer, Breadcrumbs y PageHeader
│   ├── 📁 mockups/                  # Vistas de fidelidad alta para presentación a directivos
│   ├── 📁 school/                   # Formularios de configuración de colegios y periodos
│   ├── 📁 security/                 # Monitores de seguridad, firewall status y audit badges
│   ├── 📁 students/                 # Tarjetas de estudiante, formulario RUN y lista de curso
│   ├── 📁 teachers/                 # Asignación de profesores a asignaturas y carga horaria
│   ├── 📁 ui/                       # Componentes base del Design System (Botones, Modales, Badges, Tabs)
│   └── 📄 chunk-error-handler.tsx   # Manejador preventivo de errores de carga de chunks Webpack
│
├── 📁 lib/                          # Capa de Lógica de Negocio, Dominio, Seguridad y Utilidades
│   ├── 📁 api/                      # Clientes HTTP, wrapper de fetch seguro y tipado de respuestas
│   ├── 📁 auth/                     # Criptografía JWT, cookies de sesión, hashing de contraseñas
│   ├── 📁 constants/                # Constantes globales, límites de carga, códigos de error
│   ├── 📁 db/                       # Inicializador de Prisma y Factory Scoped Tenant Prisma
│   ├── 📁 design-system/            # Tokens de diseño, paleta cromática y utilidades de estilo
│   ├── 📁 hooks/                    # Custom React Hooks (useDebounce, useMediaQuery, useTenant)
│   ├── 📁 navigation/               # Estructura del menú de navegación y permisos por ruta
│   ├── 📁 network/                  # Interceptores de red y lógica de reintentos
│   ├── 📁 permissions/              # Matriz de permisos RBAC (canonical permissions matrix)
│   ├── 📁 security/                 # Algoritmo RUN Módulo 11, cifrado AES-256-GCM, Rate Limiter
│   ├── 📁 services/                 # Servicios de dominio (Decreto 67, Asistencia, Firewall)
│   ├── 📁 tenant/                   # Utilidades de resolución y validación de contexto tenant
│   ├── 📁 utils/                    # Helpers generales (fechas, formateo de moneda, strings)
│   ├── 📁 validations/              # Esquemas de validación Zod (Auth, Estudiantes, Calificaciones)
│   ├── 📄 booking.ts                # Lógica de reservas y agendamiento de demostraciones
│   └── 📄 routes.ts                 # Mapa centralizado de rutas públicas, privadas y de sistema
│
├── 📁 prisma/                       # Capa de Persistencia y Modelado de Datos
│   ├── 📁 migrations/               # Historial de migraciones SQL versionadas
│   ├── 📄 schema.prisma             # Esquema relacional canónico de PostgreSQL
│   └── 📄 seed.ts                   # Semilla de datos multi-tenant de prueba (CSJ y CSM)
│
├── 📁 public/                       # Activos estáticos públicos (Imágenes, SVG, Favicons, Manifest)
│   ├── 📁 branding/                 # Logotipos oficiales de AURENIS e insignias institucionales
│   └── 📁 illustrations/            # Gráficos vectoriales e ilustraciones temáticas
│
├── 📁 scripts/                      # Suites Automatizadas de Calidad, Pentesting y No-Regresión
│   ├── 📄 qa-security-test.ts       # Suite principal de pruebas de certificación QA (npm test)
│   ├── 📄 non-regression-stability-test.ts # Suite de estabilidad y verificación de parches
│   └── 📄 seed-database.ts          # Script auxiliar de inicialización y reseteo de datos
│
├── 📁 types/                        # Definiciones Globales de TypeScript
│   ├── 📄 auth.ts                   # Tipos de sesión, claims JWT y tokens
│   ├── 📄 domain.ts                 # Entidades del dominio escolar (Colegio, Alumno, Nota)
│   ├── 📄 permissions.ts            # Enums y tipos de permisos RBAC
│   └── 📄 api.ts                    # Contratos de petición y respuesta estandarizados
│
├── 📁 docs/                         # Documentación Técnica, Normativa y Arquitectónica Oficial
│   ├── 📄 ARCHITECTURE.md           # Arquitectura sistémica y aislamiento multi-tenant
│   ├── 📄 API_DOCUMENTATION.md      # Especificación técnica de endpoints REST
│   ├── 📄 RBAC_PERMISSIONS_MATRIX.md# Matriz canónica de roles y permisos
│   ├── 📄 DESIGN_SYSTEM_LUCAS.md    # Sistema de diseño de interfaces y accesibilidad
│   ├── 📄 QA_AUDIT_REPORT.md        # Reporte de certificación QA y evidencias
│   ├── 📄 STRIDE_THREAT_MODELING.md # Modelado de amenazas de seguridad
│   ├── 📄 OWASP_SECURITY_CHECKLIST.md # Checklist de controles de seguridad OWASP
│   ├── 📄 COMPLIANCE_AND_DATA_PRIVACY_GUIDE.md # Leyes 19.628, 21.096, 21.430 y Circular 482
│   ├── 📄 DEVELOPER_AND_OPERATIONS_GUIDE.md # Manual de DevOps, despliegue y variables
│   ├── 📄 USER_AND_ROLES_GUIDE.md   # Manual de usuario y flujos de trabajo
│   ├── 📄 DOSSIER_ENTREGA_AURENIS_SECCION_ARQUITECTURA.md # Dossier de entrega institucional
│   └── 📄 INDEX.md                  # Índice maestro de documentación
│
├── 📄 .env.example                  # Plantilla de variables de entorno (sin secretos)
├── 📄 .eslintrc.json                # Configuración de linter ESLint para Next.js y TypeScript
├── 📄 .gitignore                    # Reglas de exclusión de Git (node_modules, .env, build)
├── 📄 AGENTS.md                     # Protocolo obligatorio de IA y directrices del equipo
├── 📄 CONTRIBUTING.md               # Guía general de contribución y gobernanza
├── 📄 middleware.ts                 # Edge Middleware (Autenticación, Tenant, RBAC, WAF Firewall)
├── 📄 next.config.ts                # Configuración de Next.js (optimización de imágenes y compilación)
├── 📄 package.json                  # Dependencias de npm y scripts de automatización
├── 📄 postcss.config.js             # Configuración de PostCSS para Tailwind CSS
├── 📄 tailwind.config.ts            # Configuración de Tailwind CSS y extensiones de tema
└── 📄 tsconfig.json                 # Configuración de TypeScript en modo estricto
```

---

## 3. EXPLICACIÓN DETALLADA DE CARPETAS Y MÓDULOS

### 3.1 Módulo Backend y Capa de Datos

* **`/prisma` (Persistencia Relacional):**
  - Contiene `schema.prisma`, que modela las entidades fundamentales: `School`, `User`, `Membership`, `Course`, `Subject`, `Enrollment`, `Grade`, `AttendanceRecord`, `AuditLog` y `SecurityLog`.
  - Todas las entidades académicas contienen una clave foránea `schoolId` indexada, permitiendo consultas ultrarrápidas y aislamiento estricto.
* **`/lib/db` (Capa de Acceso a Datos):**
  - Aloja el cliente singleton `prisma` y la función fábrica `createTenantPrisma(schoolId)`.
  - `createTenantPrisma` intercepta todas las operaciones (`findMany`, `findFirst`, `create`, `update`, `delete`) inyectando automáticamente la condición `schoolId`, evitando que cualquier desarrollador olvide filtrar por tenant.
* **`/lib/auth` (Autenticación y Sesiones):**
  - Implementa la emisión y verificación criptográfica de JSON Web Tokens (JWT) utilizando el algoritmo `HS256`.
  - Manejo de cookies `HttpOnly`, `SameSite=Lax`, `Secure` con un tiempo de expiración configurable de 8 horas.
  - Funciones de hashing con `bcryptjs` (salt rounds = 10).
* **`/lib/permissions` (Control de Acceso Basado en Roles - RBAC):**
  - Define la matriz canónica de 5 roles (`SUPER_ADMIN`, `SCHOOL_ADMIN`, `TEACHER`, `STUDENT`, `GUARDIAN`) y más de 20 permisos granulares (`GRADES_ENTER`, `GRADES_VIEW`, `ATTENDANCE_REGISTER`, `SCHOOL_SETTINGS_UPDATE`, etc.).
  - Exporta la función `hasPermission(userRole, requiredPermission)` y `assertPermission(...)` que arroja excepciones tipadas `ForbiddenError` si la acción no está permitida.
* **`/lib/security` (Ciberseguridad y Criptografía):**
  - `encryption.ts`: Cifrado y descifrado autenticado `AES-256-GCM` para datos sensibles (RUN de estudiantes y diagnósticos de necesidades educativas especiales).
  - `rut-validator.ts`: Implementación formal del algoritmo **Módulo 11** para validación del RUN chileno, con soporte total para dígito verificador numérico y `K`.
  - `rate-limiter.ts`: Limitador de tasa distribuido compatible con Upstash Redis y fallback en memoria para entornos de desarrollo.
* **`/lib/validations` (Validación de Esquemas Zod):**
  - Esquemas declarativos para cada payload recibido por la API (`loginSchema`, `createStudentSchema`, `gradeEntrySchema`, `schoolSettingsSchema`).
* **`/app/api` (Controladores REST):**
  - API Route Handlers de Next.js. Cada endpoint ejecuta 4 pasos mandatorios:
    1. Extracción y verificación de la sesión (`getSessionFromRequest`).
    2. Validación de permisos RBAC en el servidor (`assertPermission`).
    3. Validación del cuerpo/parámetros con Zod (`schema.parse`).
    4. Ejecución en base de datos mediante `createTenantPrisma(schoolId)` y registro en `AuditLog`.

---

### 3.2 Módulo Frontend y Capa de Presentación

* **`/app/[schoolSlug]` (Enrutamiento Multi-Tenant):**
  - `[schoolSlug]/layout.tsx`: Resuelve la identidad del colegio a partir del slug en la URL, valida que el usuario pertenezca al colegio y renderiza el contenedor maestro con el Sidebar contextual y selector de año escolar.
  - `[schoolSlug]/grades/page.tsx`: Módulo interactivo del Libro de Calificaciones con cálculo ponderado en tiempo real según Decreto 67.
  - `[schoolSlug]/attendance/page.tsx`: Registro de asistencia diaria conforme a los requisitos de la Circular 482 de la Superintendencia de Educación.
* **`/components/ui` (Design System Base):**
  - Componentes atómicos creados según las directrices del diseñador **Lucas P.**: `button.tsx`, `card.tsx`, `modal.tsx`, `badge.tsx`, `input.tsx`, `table.tsx`, `tabs.tsx`.
  - Diseñados con Tailwind CSS, respetando WCAG 2.1 AA (contraste de color ≥ 4.5:1, áreas de toque ≥ 44px, navegación completa por teclado y soporte de modo oscuro).
* **`/components/features` (Componentes de Alto Nivel):**
  - Componentes complejos con lógica de interacción: `GradeMatrixTable`, `AttendanceSheet`, `StudentProfileCard`, `TeacherAssignmentDrawer`.
* **`/lib/hooks` (React Custom Hooks):**
  - `useTenant()`: Proporciona la información del colegio activo, año escolar y rol actual del usuario.
  - `usePermissions()`: Helper para ocultar o deshabilitar elementos visuales de la UI según los permisos del usuario (nota: la seguridad real siempre se valida en backend).
  - `useDebounce()`: Optimización de búsquedas y filtros en tiempo real sin saturar el servidor.

---

### 3.3 Módulo de QA, Pruebas y Seguridad

* **`/scripts/qa-security-test.ts` (Suite de Certificación QA):**
  - Ejecutable con `npm test`. Ejecuta 16 pruebas automatizadas de extremo a extremo que cubren autenticación criptográfica, RBAC, aislamiento multi-tenant, validaciones Zod, trazabilidad en AuditLog y smoke tests de endpoints HTTP.
* **`/scripts/non-regression-stability-test.ts` (Suite de No-Regresión):**
  - Ejecutable con `npm run test:regression`. Valida la no-reaparición de bugs históricos (`REG-SEC-001`, `REG-AUTH-002`, `REG-ACAD-003`, etc.).
* **`/docs` (Documentación Técnica y Normativa):**
  - 14 documentos exhaustivos que respaldan la arquitectura, manual de usuarios, auditoría de seguridad y cumplimiento legal.

---

## 4. CATÁLOGO DE ARCHIVOS CLAVE DEL NÚCLEO Y ATRIBUCIÓN DE RESPONSABILIDADES

En concordancia con el protocolo del equipo AURENIS, cada archivo clave del núcleo cuenta con un responsable técnico asignado:

| Archivo Clave | Capa / Módulo | Descripción Funcional | Responsable Principal |
| :--- | :--- | :--- | :--- |
| `middleware.ts` | Perímetro / Edge | Inspección de rutas, validación de JWT, resolución de tenant, firewall WAF y protección de rutas `/system/*`. | **Maicol R.** & **Frank M.** |
| `prisma/schema.prisma` | Persistencia | Modelo de datos relacional PostgreSQL con relaciones de integridad, índices y auditoría. | **Maicol R.** |
| `lib/db/prisma.ts` | Capa de Datos | Instancia global de Prisma y Factory `createTenantPrisma` para inyección obligatoria de `schoolId`. | **Maicol R.** |
| `lib/auth/session.ts` | Autenticación | Criptografía HS256, firma y decodificación de JWT, gestión de cookies HttpOnly y verificación de sesiones. | **Maicol R.** |
| `lib/permissions/index.ts` | Autorización | Matriz canónica RBAC, evaluación de permisos jerárquicos y excepciones `ForbiddenError`. | **Maicol R.** |
| `lib/security/encryption.ts` | Ciberseguridad | Cifrado/Descifrado `AES-256-GCM` para datos confidenciales de NNA según Ley 19.628. | **Maicol R.** & **Frank M.** |
| `lib/security/rut-validator.ts`| Dominio / Seguridad| Algoritmo oficial de validación Módulo 11 de RUN chileno con soporte para 'K'. | **Maicol R.** |
| `lib/services/grading.service.ts`| Dominio Académico| Motor de cálculo de promedios, ponderaciones y reglas de aprobación según Decreto 67. | **Maicol R.** & **Malcom Marcelo** |
| `components/grades/GradeMatrix.tsx`| UI / Frontend | Matriz reactiva de notas con validación de rango (1.0 a 7.0), cálculo en caliente y feedback visual. | **Malcom Marcelo** |
| `components/ui/` | Design System | Componentes base accesibles (WCAG 2.1 AA) con tokens de espaciado, colores y tipografía. | **Lucas P.** |
| `docs/DESIGN_SYSTEM_LUCAS.md` | Diseño UI/UX | Manual de identidad visual, componentes, paleta de colores y micro-interacciones. | **Lucas P.** |
| `scripts/qa-security-test.ts` | QA & Pentesting | Suite principal de pruebas de certificación, ataque BOLA simulado y validación de seguridad. | **Frank M.** |
| `SECURITY-FINDINGS-LOG.md` | Auditoría de Seguridad| Bitácora formal de vulnerabilidades detectadas, puntuación CVSS v3.1 y estado de mitigación. | **Frank M.** |

---

## 5. GUÍA DE ONBOARDING PARA NUEVOS CONTRIBUIDORES

### 5.1 Requisitos Previos y Configuración del Entorno

1. **Software Requerido:**
   - **Node.js:** Versión 18.18.0 o superior (Node.js 20 LTS recomendado).
   - **Gestor de Paquetes:** `npm` v10+ o `bun` / `pnpm`.
   - **PostgreSQL:** Versión 14 o superior (o base de datos en la nube como Neon / Supabase / Cloud SQL).
   - **Git:** Versión 2.30+.

2. **Paso a Paso de Instalación:**

```bash
# 1. Clonar el repositorio oficial
git clone https://github.com/aurenis-org/aurenis.git
cd aurenis

# 2. Instalar dependencias del proyecto
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Generar el cliente de Prisma
npx prisma generate

# 5. Ejecutar migraciones de base de datos
npx prisma migrate dev --name init

# 6. Sembrar la base de datos con los colegios de prueba (CSJ y CSM)
npm run seed

# 7. Iniciar el servidor de desarrollo
npm run dev
```

El servidor estará accesible en `http://localhost:3000`.

---

### 5.2 Flujo de Trabajo con Git y Convenciones de Ramas

AURENIS utiliza una variación del modelo **GitFlow Adaptado** con ramas temáticas cortas:

* **Ramas Principales:**
  - `main`: Código en producción, 100% probado y desplegable.
  - `develop`: Rama de integración continua de features aprobadas.
* **Convención de Nombres de Ramas:**
  - `feat/<rol>-<descripcion-corta>` (Ejemplo: `feat/malcom-grade-matrix-memoization`, `feat/maicol-attendance-audit-log`).
  - `fix/<rol>-<ticket-o-cve>` (Ejemplo: `fix/frank-cve-session-fix`, `fix/lucas-contrast-wcag`).
  - `docs/<descripcion>` (Ejemplo: `docs/contributor-directory-guide`).
* **Mensajes de Commit (Conventional Commits):**
  - `feat(grades): implement decree 67 weighted average calculation [Maicol R.]`
  - `fix(ui): improve button contrast ratio for wcag 2.1 aa compliance [Lucas P.]`
  - `test(security): add test suite for tenant data isolation [Frank M.]`
  - `refactor(client): memoize student list render hooks [Malcom Marcelo]`

---

### 5.3 Estándares de Código y Políticas "Anti-AI Slop"

Todo contribuidor (humano o agente de IA) debe acatar las siguientes reglas inmutables:

1. **Prohibición de Placeholders y TODOs:**
   - ❌ **Prohibido:** `// TODO: Conectar con la base de datos más adelante` o `return { success: true, mockData: [] }`.
   - ✅ **Obligatorio:** Escribir la consulta real en Prisma, validar la entrada con Zod y manejar los errores HTTP formalmente.
2. **Tipado Estricto de TypeScript:**
   - Queda estrictamente prohibido el uso de `any`. Se deben utilizar tipos explícitos, genéricos y enums de `/types`.
3. **Validación en el Servidor:**
   - Nunca confiar en validaciones hechas en el navegador. Toda regla de negocio, permiso RBAC o restricción de tenant debe verificarse dentro del Route Handler o Server Action.
4. **Respeto al Design System:**
   - No crear estilos CSS en línea ni archivos `.module.css` ad-hoc. Utilizar las clases utilitarias de Tailwind CSS y los componentes de `@/components/ui`.

---

### 5.4 Protocolo de Definición de Terminado (Definition of Done - DoD)

Una tarea sólo se considerará **terminada (DONE)** cuando cumpla la totalidad del ciclo:

```
  1. Diseño & Especificación UX (Lucas P.)
                  ↓
  2. Implementación Frontend (Malcom Marcelo)
                  ↓
  3. Contrato API, Backend & Persistencia en DB (Maicol R.)
                  ↓
  4. Ataque / Validación QA & Pentesting (Frank M.)
                  ↓
  5. Responsive (Móvil/Tablet/Desktop) & Accesibilidad WCAG 2.1 AA
                  ↓
  6. Corrección de Hallazgos y Re-Testing
                  ↓
  7. Evidencia, Documentación y Suite de Pruebas Exitosa
                  ↓
               ✅ DONE (Listo para Git Push)
```

---

### 5.5 Checklist Pre-Pull Request y Comandos de Validación

Antes de solicitar una revisión de código o abrir un Pull Request, ejecute los siguientes comandos en su terminal:

```bash
# 1. Validar el tipado de TypeScript y la compilación de Next.js
npm run build

# 2. Ejecutar el análisis estático de código (ESLint)
npm run lint

# 3. Ejecutar la suite completa de pruebas de certificación QA y seguridad
npm test

# 4. Ejecutar la suite de pruebas de no-regresión
npm run test:regression
```

**Checklist de Auto-Revisión del Desarrollador:**
- [ ] ¿El código compila limpiamente sin errores ni advertencias de compilación?
- [ ] ¿El linter (`npm run lint`) pasa sin warnings?
- [ ] ¿Todas las pruebas de `npm test` y `npm run test:regression` están en verde (100% PASS)?
- [ ] ¿Se inyectó `createTenantPrisma(schoolId)` en todas las consultas a la base de datos?
- [ ] ¿Se validó el permiso RBAC con `assertPermission` en todos los endpoints nuevos?
- [ ] ¿Se registraron las acciones críticas en `AuditLog`?
- [ ] ¿Se respetó el contraste de color WCAG 2.1 AA en los nuevos componentes de interfaz?

---

## 6. MATRIZ DE ROLES Y ESCALABILIDAD DEL EQUIPO

| Integrante | Rol Principal | Áreas de Decisión Técnica |
| :--- | :--- | :--- |
| 👑 **Maicol R.** | **Project Lead & Arquitectura** | - Aprobación final de cambios en `prisma/schema.prisma`.<br>- Definición de contratos de API REST y esquemas Zod.<br>- Arquitectura de seguridad perimetral y middleware.<br>- Autorización RBAC y directrices de despliegue. |
| 💻 **Malcom Marcelo** | **Frontend Lead & Developer** | - Gestión de estado y hooks en componentes React.<br>- Consumo de APIs y Server Actions con manejo de estados.<br>- Optimización de renderizado y paridad SSR/Cliente.<br>- Construcción interactiva del Libro Digital de Clases. |
| 🎨 **Lucas P.** | **UI / UX Lead & Design System** | - Diseño de interfaces, flujos y componentes de `@/components/ui`.<br>- Supervisión de accesibilidad visual WCAG 2.1 AA.<br>- Definición de tokens de Tailwind CSS y animaciones `motion`.<br>- Consistencia estética y maquetación responsive. |
| 🛡️ **Frank M.** | **QA & Ciberseguridad Lead** | - Autoría y mantenimiento de las suites de prueba (`scripts/`).<br>- Auditorías de seguridad periódicas contra OWASP Top 10.<br>- Modelado de amenazas STRIDE y bitácora de hallazgos.<br>- Validación obligatoria antes de autorizar pases a producción. |

---

> **Aprobado formalmente por el Equipo de Ingeniería de AURENIS**  
> *Maicol R. (Project Lead) • Malcom Marcelo (Frontend Lead) • Lucas P. (Design Lead) • Frank M. (QA Lead)*
