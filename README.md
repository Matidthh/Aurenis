# 🏫 AURENIS — Plataforma Integral de Gestión Académica Multi-Tenant

> **AURENIS** es una plataforma SaaS de gestión escolar y académica de alto rendimiento, diseñada para operar entornos multi-institucionales con estricto aislamiento de datos (*Zero-Trust Multi-Tenancy*), autenticación criptográfica robusta, control de acceso basado en roles (**RBAC** granular) y trazabilidad inmutable de auditoría.

[![Next.js 15](https://img.shields.io/badge/Next.js-15.2.1-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.4.1-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![QA Status](https://img.shields.io/badge/QA_Certificaci%C3%B3n-100%25_PASS-success)](./docs/QA_AUDIT_REPORT.md)

---

## 📑 Tabla de Contenidos

0. [Gobernanza del Equipo & Protocolo IA Obligatorio](#-gobernanza-del-equipo--protocolo-ia-obligatorio)
1. [Visión General & Propuesta de Valor](#-visión-general--propuesta-de-valor)
2. [Arquitectura del Sistema](#-arquitectura-del-sistema)
3. [Stack Tecnológico](#-stack-tecnológico)
4. [Credenciales Preconfiguradas para Pruebas (Seed)](#-credenciales-preconfiguradas-para-pruebas-seed)
5. [Puesta en Marcha Rápida (Local & Contenedor)](#-puesta-en-marcha-rápida-local--contenedor)
6. [Estrategia de Pruebas & Calidad (QA)](#-estrategia-de-pruebas--calidad-qa)
7. [Estructura del Proyecto](#-estructura-del-proyecto)
8. [Índice de Documentación Oficial](#-índice-de-documentación-oficial)

---

## 👥 Gobernanza del Equipo & Protocolo IA Obligatorio

Este repositorio cuenta con un protocolo formal de roles, responsabilidades y directivas obligatorias para asistentes de inteligencia artificial:
- **[Protocolo Mandatorio de IA (`AGENTS.md`)](./AGENTS.md):** Reglas operativas que cualquier IA en cualquier entorno (AI Studio, Cursor, Claude, Copilot) debe ejecutar.
- **[Auditoría de Roles y Protocolo Técnico del Equipo (`TEAM_ROLES_AND_AI_PROTOCOL.md`)](./TEAM_ROLES_AND_AI_PROTOCOL.md):** Manual detallado de responsabilidades para **Maicol R.** (Lead / Backend & Arquitectura), **Malcom Marcelo** (Frontend), **Lucas P.** (UI/UX) y **Frank M.** (QA & Seguridad), con el *Definition of Done (DoD)* y el plan de trabajo para el sprint final de 30 días.

---

## 🌟 Visión General & Propuesta de Valor

Aurenis resuelve las necesidades complejas de los centros educativos modernos mediante una arquitectura modular y reactiva:

- **Aislamiento Multi-Tenant Estricto:** Cada colegio opera con su propio espacio lógico (`schoolId`), garantizando que ninguna consulta o mutación pueda leer o modificar datos de otra institución educativa (protección anti-IDOR).
- **Control de Acceso Basado en Roles (RBAC en 3 Capas):** Matriz de permisos normalizada que regula privilegios para SuperAdministradores de la plataforma, Directores escolares, Docentes, Estudiantes y Apoderados/Tutores.
- **Autenticación Segura & Sesiones Criptográficas:** Tokens JWT (HS256) administrados con la librería estándar `jose` en cookies `HttpOnly`, `SameSite=Lax` con protección contra manipulación (*Anti-Tampering*).
- **Gestión Académica Integral:** Registro y ponderación de calificaciones, seguimiento de asistencia en tiempo real, gestión de cursos, niveles educativos y asignaturas.
- **Auditoría Inmutable:** Registro detallado de acciones críticas de configuración y datos (`AuditLog`) con `userId`, `schoolId`, `entityType`, acción y marca temporal.

---

## 🏛 Arquitectura del Sistema

La plataforma implementa un modelo de defensa en profundidad organizado en **3 capas independientes**:

```
                              PETICIÓN DEL USUARIO
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. PERÍMETRO Y SESIÓN (middleware.ts)                                       │
│    • Verifica firma y vigencia del JWT con librería 'jose'.                 │
│    • Resuelve institución activa (slug) y rechaza accesos sin sesión (401). │
│    • Bloquea escalación vertical a /system/* para usuarios no SuperAdmin.   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. AUTORIZACIÓN GRANULAR RBAC (lib/auth/permissions.ts & lib/services/*)    │
│    • Evalúa permisos canónicos (ej. SCHOOL_SETTINGS_UPDATE, GRADES_ENTER).  │
│    • Lanza excepciones tipadas ForbiddenError (HTTP 403).                   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. ORM CON ENFORCEMENT DE TENANT (lib/db/tenant-extension.ts)               │
│    • Inyección automática de `where: { schoolId }` en lecturas.             │
│    • Intercepta y bloquea cualquier intento de escritura con schoolId ajeno │
│      (Anti-Cross-Tenant Tampering).                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 💻 Stack Tecnológico

| Capa | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Framework Web** | Next.js 15 (App Router) | Renderizado híbrido (RSC y Client Components), rutas dinámicas y API Routes. |
| **Biblioteca UI** | React 19 + Tailwind CSS | Componentes reactivos, diseño sobrio de alta legibilidad y CSS utilitario. |
| **Iconografía** | Lucide React | Iconografía SVG coherente y optimizada. |
| **ORM & Base de Datos** | Prisma v6 + PostgreSQL / SQLite | Modelado relacional declarativo, migraciones y tipado estricto extremo a extremo. |
| **Seguridad Criptográfica** | `jose` (JWT) + `bcryptjs` | Firma criptográfica de tokens HS256 y hashing de contraseñas con factor de coste 10. |
| **Validación de Datos** | Zod v3 | Validación de contratos de entrada, esquemas de configuración y parámetros de API. |
| **Testing & QA** | TSX + Script de Certificación de Seguridad | Ejecución automatizada de 38 pruebas de autenticación, RBAC y aislamiento tenant. |

---

## 🔑 Credenciales Preconfiguradas para Pruebas (Seed)

Para facilitar la evaluación y las pruebas del sistema, la base de datos incluye cuentas activas con contraseñas cifradas en Bcrypt.

> **Contraseña unificada para todas las cuentas de prueba:** `Password123!`

| Rol | Correo Electrónico | Contraseña | Institución Asignada | URL de Destino Post-Login |
| :--- | :--- | :--- | :--- | :--- |
| **SuperAdmin Global** | `admin@aurenis.com` | `Password123!` | *Acceso a nivel de plataforma* | `/system/dashboard` |
| **Director / School Admin** | `carlos.mendoza@sanjose.cl` | `Password123!` | Colegio San José | `/colegio-san-jose/dashboard` |
| **Docente (Matemática)** | `profesor.matematica@sanjose.cl` | `Password123!` | Colegio San José | `/colegio-san-jose/dashboard` |
| **Estudiante** | `sofia.valenzuela@sanjose.cl` | `Password123!` | Colegio San José | `/colegio-san-jose/dashboard` |
| **Apoderada / Tutora** | `maria.gonzalez@sanjose.cl` | `Password123!` | Colegio San José | `/colegio-san-jose/dashboard` |

---

## 🚀 Puesta en Marcha Rápida (Local & Contenedor)

### Requisitos Previos
- **Node.js:** Versión 20.x o 22.x LTS.
- **Gestor de Paquetes:** `npm` v10+ o `bun`.

### 1. Clonar el Repositorio e Instalar Dependencias
```bash
git clone <url-del-repositorio>
cd aurenis
npm install
```

### 2. Configurar Variables de Entorno
Copia el archivo de ejemplo y ajusta los valores necesarios:
```bash
cp .env.example .env
```

Variables requeridas (`.env`):
```ini
DATABASE_URL="file:./prisma/dev.db" # O cadena de conexión PostgreSQL
JWT_SECRET="super-secret-master-key-minimum-32-chars-long-for-hs256"
NEXT_PUBLIC_APP_NAME="Aurenis"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
SESSION_COOKIE_NAME="aurenis_session"
```

### 3. Generar Cliente Prisma y Cargar Datos Iniciales (Seed)
```bash
# Generar tipos del ORM
npm run db:generate

# Aplicar migraciones / esquema
npm run db:push

# (Opcional) Poblar con seed preconfigurado
npx tsx prisma/seed.ts
```

### 4. Iniciar Servidor de Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

### 5. Compilación de Producción
```bash
npm run build
npm start
```

---

## 🛡 Estrategia de Pruebas & Calidad (QA)

Aurenis cuenta con un arnés automatizado de certificación de seguridad y control de acceso que valida exhaustivamente los **4 Criterios de Aceptación (Definition of Done)**:

Ejecución del suite de pruebas:
```bash
npm test
```

### Resumen del Test Suite Certificado (38/38 PASS — 100%)
- **Criterio 1 — Matriz de Casos de Prueba de Login Positivo:** Validación con bcrypt, emisión de JWT y redirección para los 5 roles.
- **Criterio 2 — Casos Negativos de Autenticación:** Claves erróneas, emails inexistentes, campos vacíos y rechazo por esquemas Zod (HTTP 400 y 401).
- **Criterio 3 — Expiración de Token y Cierre de Sesión:** Revocación de cookie (`Max-Age=0`), rechazo de tokens expirados o adulterados (*Anti-Tampering*).
- **Criterio 4 — Acceso Indebido a Rutas Protegidas:** Redirección 307 ante accesos directos sin sesión, respuestas 401 en API, y bloqueo 403 a escalación de privilegios no autorizada.
- **Módulos Adicionales:** Aislamiento Multi-Tenant (Anti-IDOR), prevención de escrituras cruzadas y auditoría inmutable (`AuditLog`).

Para ver los reportes detallados:
- [Reporte de Auditoría QA (`docs/QA_AUDIT_REPORT.md`)](./docs/QA_AUDIT_REPORT.md)
- [Estrategia de Testing (`docs/TESTING_STRATEGY.md`)](./docs/TESTING_STRATEGY.md)

---

## 📁 Estructura del Proyecto

```
/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Rutas de autenticación pública (/login, /select-school)
│   ├── [schoolSlug]/           # Espacio institucional multi-tenant
│   │   ├── attendance/         # Módulo de registro y consulta de asistencia
│   │   ├── courses/            # Módulo de cursos y niveles
│   │   ├── dashboard/          # Panel principal del colegio
│   │   ├── grades/             # Módulo de calificaciones y ponderaciones
│   │   ├── settings/           # Configuración institucional (escalas, logo, etc.)
│   │   ├── students/           # Directorio y fichas de estudiantes
│   │   ├── subjects/           # Módulo de asignaturas curriculares
│   │   └── teachers/           # Directorio docente
│   ├── api/                    # Endpoints REST API
│   │   ├── auth/               # /api/auth (login, logout, select-school)
│   │   ├── schools/            # /api/schools/[schoolId] (settings)
│   │   └── system/             # /api/system/schools (gestión global)
│   └── system/                 # Panel SuperAdmin de administración de plataforma
├── components/                 # Componentes React reutilizables (UI, Tablas, Formularios)
├── docs/                       # Documentación técnica, arquitectura y reportes QA
│   ├── API_DOCUMENTATION.md    # Especificación de endpoints REST
│   ├── ARCHITECTURE.md         # Documento de arquitectura técnica detallada
│   ├── QA_AUDIT_REPORT.md      # Reporte formal de auditoría de seguridad
│   ├── RBAC_PERMISSIONS_MATRIX.md # Matriz canónica de roles y permisos
│   ├── TESTING_STRATEGY.md     # Estrategia de pruebas automatizadas
│   └── USER_AND_ROLES_GUIDE.md # Guía de usuario y manual operativo por rol
├── lib/                        # Lógica de negocio y utilidades de backend
│   ├── auth/                   # JWT, sesión en cookies y verificación de credenciales
│   ├── db/                     # Cliente Prisma y mock database de contingencia
│   ├── permissions/            # Funciones de autorización RBAC y catálogo de permisos
│   ├── services/               # Servicios de dominio (School, Grade, Attendance, etc.)
│   └── validations/            # Esquemas de validación Zod
├── prisma/                     # Esquema declarativo de base de datos y seeds
└── scripts/                    # Scripts de testing y verificación automatizada
```

---

## 📚 Índice de Documentación Oficial

| Documento | Descripción |
| :--- | :--- |
| 📚 [**Índice General de Documentación**](./docs/INDEX.md) | Portal maestro con rutas de lectura por perfil (Devs, Seguridad, QA, Colegios). |
| 🏗 [**Arquitectura del Sistema**](./docs/ARCHITECTURE.md) | Detalle de arquitectura técnica, aislamiento de tenant, sesiones criptográficas y modelo de datos. |
| 🛡 [**Modelado de Amenazas STRIDE & Seguridad**](./docs/STRIDE_THREAT_MODELING.md) | Análisis formal de vectores de ataque STRIDE, puntuación DREAD y protección de datos de menores. |
| 📊 [**Evaluación de Riesgos 5x5 & OWASP**](./docs/RISK_ASSESSMENT_MATRIX_5X5.md) | Matriz de riesgos 5x5 (ISO 27005), mapeo OWASP Top 10 y plan de acción de ingeniería. |
| 🔌 [**Documentación de APIs REST**](./docs/API_DOCUMENTATION.md) | Contratos de endpoints, cabeceras, códigos HTTP, validaciones Zod y ejemplos de respuesta. |
| 🛡 [**Matriz de Roles y Permisos (RBAC)**](./docs/RBAC_PERMISSIONS_MATRIX.md) | Especificación de los 25+ permisos canónicos y asignación por roles del sistema. |
| 🧪 [**Estrategia de Pruebas & Calidad**](./docs/TESTING_STRATEGY.md) | Marco metodológico de QA, pruebas unitarias, de integración y aserciones forzadas. |
| 📊 [**Reporte de Auditoría QA**](./docs/QA_AUDIT_REPORT.md) | Certificación formal con evidencias de ejecución de los 57 casos de prueba (100% PASS). |
| ⚙️ [**Guía de Desarrollo & Operaciones (DevOps)**](./docs/DEVELOPER_AND_OPERATIONS_GUIDE.md) | Manual de ingeniería, variables de entorno, migraciones Prisma, Docker y Google Cloud Run. |
| ⚖️ [**Cumplimiento Normativo & Privacidad**](./docs/COMPLIANCE_AND_DATA_PRIVACY_GUIDE.md) | Cumplimiento de la Circular N° 482 Supereduc (Libro Digital), Ley 19.628, 21.430 y GDPR Art. 8. |
| 👥 [**Guía de Usuario y Roles**](./docs/USER_AND_ROLES_GUIDE.md) | Manual operativo de uso para administradores, docentes, estudiantes y familias. |

---

<p align="center">
  <b>Aurenis Academic Suite</b> &bull; Desarrollado con los más altos estándares de calidad, seguridad y resiliencia.
</p>
