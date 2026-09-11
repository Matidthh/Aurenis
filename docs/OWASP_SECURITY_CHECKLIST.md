# 🛡️ LISTA DE VERIFICACIÓN TÉCNICA DE SEGURIDAD OWASP — AURENIS v1.0
## Controles de Seguridad para Aplicación Web, APIs, Autenticación y Base de Datos

**Proyecto:** AURENIS — Plataforma de Gestión Académica Multi-Tenant  
**Versión:** 1.0.0 (Certificada para Producción)  
**Marco de Referencia:** OWASP Top 10 (2021), OWASP API Security Top 10 (2023), OWASP ASVS v4.0 (Application Security Verification Standard), y Guía de Seguridad de Base de Datos de OWASP.  
**Clasificación:** Documentación Técnica de Seguridad y Criterios de Aceptación (DoD)  
**Fecha de Publicación:** Septiembre de 2026  

---

## 🎯 Resumen Ejecutivo y Alcance

Este documento consolida **32 controles técnicos específicos de seguridad** diseñados e implementados en **AURENIS**. La plataforma opera bajo una arquitectura multi-tenant de Confianza Cero (*Zero-Trust*), gestionando información sensible de menores de edad (calificaciones, asistencias, fichas médicas y custodias legales).

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                           ESTADO GLOBAL DE CONTROLES OWASP AURENIS                             │
├───────────────────────────────┬─────────────────┬────────────────┬──────────────────────────────┤
│ DOMINIO DE SEGURIDAD          │ CONTROLES TOTAL │ ESTADO (PASS)  │ COBERTURA AUTOMATIZADA       │
├───────────────────────────────┼─────────────────┼────────────────┼──────────────────────────────┤
│ 1. Autenticación y Sesiones   │ 7 Controles     │ 🟢 7/7 (100%)  │ `scripts/qa-security-test.ts`│
│ 2. Control de Acceso y RBAC   │ 6 Controles     │ 🟢 6/6 (100%)  │ `scripts/qa-security-test.ts`│
│ 3. Seguridad en APIs y Web    │ 8 Controles     │ 🟢 8/8 (100%)  │ `scripts/qa-routing-test.ts` │
│ 4. Base de Datos & Multi-Ten. │ 6 Controles     │ 🟢 6/6 (100%)  │ `lib/db/tenant-extension.ts` │
│ 5. Criptografía y Privacidad  │ 5 Controles     │ 🟢 5/5 (100%)  │ `lib/auth/session.ts`        │
├───────────────────────────────┼─────────────────┼────────────────┼──────────────────────────────┤
│ TOTAL AUDITADO                │ 32 Controles    │ 🟢 32/32(100%) │ Suite 100% Superada          │
└───────────────────────────────┴─────────────────┴────────────────┴──────────────────────────────┘
```

---

## 📋 Checklist Técnico Exhaustivo (32 Controles OWASP)

### SECCIÓN 1: Autenticación, Gestión de Credenciales y Sesión (OWASP A07:2021 & API2:2023)

| # | Control Técnico | Categoría OWASP / ASVS | Severidad | Estado | Implementación en AURENIS | Método de Verificación / QA |
| :-: | :--- | :--- | :-: | :-: | :--- | :--- |
| **01** | **Hashing Robusto de Contraseñas** | A07:2021 - Identification & Auth Failures (ASVS V2.4) | 🔴 Crítica | ✅ CUMPLE | Bcrypt con factor de costo (salt rounds) = 10 (`lib/auth/password.ts`). Rechazo de texto plano y algoritmos débiles (MD5/SHA1). | Validado en `qa-security-test.ts` (Módulo 1.1). Verificación de prefijo `$2b$10$`. |
| **02** | **Firma y Validación Criptográfica de JWT** | A02:2021 - Cryptographic Failures (ASVS V3.5) | 🔴 Crítica | ✅ CUMPLE | Tokens JWT firmados con algoritmo HS256 vía librería `jose` utilizando clave secreta de mínimo 256 bits (`lib/auth/session.ts`). | Test de Anti-Tampering en `qa-security-test.ts` (rechazo de firmas manipuladas). |
| **03** | **Almacenamiento Seguro de Sesiones en Cookies** | A05:2021 - Security Misconfiguration (ASVS V3.4) | 🟠 Alta | ✅ CUMPLE | Cookie `aurenis_session` emitida con banderas `HttpOnly: true`, `SameSite: "lax"`, `Path: "/"`, y `Secure: true` en producción. | Verificado en `lib/auth/session.ts` y rutas de `app/api/auth/*`. |
| **04** | **Expiración Estricta y Ciclo de Vida de Token** | A07:2021 - Identification & Auth Failures (ASVS V3.3) | 🟡 Media | ✅ CUMPLE | Expiración de sesión fijada en 7 días (`SESSION_EXPIRY = "7d"`). Revalidación en middleware por petición. | Verificación de tiempo `exp` y `iat` en payload de sesión. |
| **05** | **Revocación Segura de Sesión (Logout Completo)** | A07:2021 - Identification & Auth Failures (ASVS V3.6) | 🟡 Media | ✅ CUMPLE | Endpoint `POST /api/auth/logout` que sobrescribe la cookie con `maxAge: 0` y `expires: 1970-01-01` (`app/api/auth/logout/route.ts`). | Validado en Smoke Test de `qa-security-test.ts` (Módulo 6.6, HTTP 200). |
| **06** | **Respuestas Genéricas ante Fallo de Autenticación** | A07:2021 - Identification & Auth Failures (ASVS V2.2) | 🟠 Alta | ✅ CUMPLE | Mensaje estándar `"Credenciales inválidas."` tanto para email inexistente como para contraseña errónea para prevenir enumeración de usuarios. | Inspección de `lib/services/user.service.ts` y test HTTP 401 en login. |
| **07** | **Aislamiento de Sesión Multi-Colegio** | OWASP API3:2023 - Broken Object Property Auth | 🔴 Crítica | ✅ CUMPLE | En usuarios con múltiples colegios, se emite token restringido sin permisos escolares hasta seleccionar el colegio activo (`/api/auth/select-school`). | Validado en `qa-security-test.ts` (Caso B multi-membresía). |

---

### SECCIÓN 2: Control de Acceso, Autorización y RBAC (OWASP A01:2021 & API1/API5:2023)

| # | Control Técnico | Categoría OWASP / ASVS | Severidad | Estado | Implementación en AURENIS | Método de Verificación / QA |
| :-: | :--- | :--- | :-: | :-: | :--- | :--- |
| **08** | **Autorización Basada en Permisos Granulares (RBAC)** | A01:2021 - Broken Access Control (ASVS V4.1) | 🔴 Crítica | ✅ CUMPLE | Matriz de 20+ permisos individuales (`lib/constants/permissions.ts`) evaluados en servidor mediante `assertPermission(ctx, code)`. | Validado en `qa-security-test.ts` para los 4 roles principales. |
| **09** | **Denegación por Defecto (*Deny by Default*)** | A01:2021 - Broken Access Control (ASVS V4.1) | 🔴 Crítica | ✅ CUMPLE | Si el rol del usuario no tiene explícitamente el permiso requerido, la función `hasPermission` retorna `false` y `assertPermission` arroja `ForbiddenError`. | Validado en `qa-security-test.ts` (Módulo 2). |
| **10** | **Protección de Rutas en Middleware Centralizado** | A01:2021 - Broken Access Control (ASVS V4.2) | 🔴 Crítica | ✅ CUMPLE | `middleware.ts` intercepta todas las peticiones, valida JWT de sesión, y deniega acceso no autenticado o no autorizado antes de llegar a los handlers. | Validado en `scripts/qa-routing-test.ts` (16 pruebas). |
| **11** | **Aislamiento de Rutas Globales de SuperAdmin** | A01:2021 - Broken Access Control (ASVS V4.3) | 🔴 Crítica | ✅ CUMPLE | Las rutas `/system/*` y `/api/system/*` exigen estrictamente `session.isSystemAdmin === true`. Bloqueo inmediato para administradores de colegio ordinarios. | Validado en `qa-routing-test.ts` y smoke test HTTP 401. |
| **12** | **Prevención de Escalación de Privilegios Horizontal (IDOR)** | A01:2021 - Broken Access Control (ASVS V4.2) | 🔴 Crítica | ✅ CUMPLE | Todas las consultas y mutaciones validan que el `schoolId` del recurso coincida con el `activeSchoolId` de la sesión del usuario. | Validado en `qa-security-test.ts` (Módulo 3). |
| **13** | **Filtrado Dinámico de Menú de Navegación por Rol** | A01:2021 - Broken Access Control (ASVS V14.4) | 🟡 Media | ✅ CUMPLE | `filterNavItemsByRole` (`lib/navigation/routes.ts`) filtra elementos del sidebar según el rol, evitando exposición de funciones restringidas. | Validado en `scripts/qa-sidebar-roles-test.ts` (15 pruebas). |

---

### SECCIÓN 3: Seguridad en APIs, Validación de Entradas y Web (OWASP A03/A04/A05:2021 & API8/API10:2023)

| # | Control Técnico | Categoría OWASP / ASVS | Severidad | Estado | Implementación en AURENIS | Método de Verificación / QA |
| :-: | :--- | :--- | :-: | :-: | :--- | :--- |
| **14** | **Validación Estricta de Esquemas con Zod** | A03:2021 - Injection (ASVS V5.1) | 🔴 Crítica | ✅ CUMPLE | Todos los payloads de entrada (login, settings, notas, asistencia) se validan contra esquemas Zod con rechazo temprano (`HTTP 400 Bad Request`). | Validado en `qa-security-test.ts` (Módulo 4). |
| **15** | **Sanitización y Validación de Tipos Tipados** | A03:2021 - Injection (ASVS V5.1) | 🟠 Alta | ✅ CUMPLE | Tipado estricto en TypeScript (`tsconfig.json` con `strict: true`). Conversión y recorte de cadenas (`trim()`, `toLowerCase()`). | Compilación limpia sin errores de tipo ni casts inseguros (`npm run lint`). |
| **16** | **Respuestas de Error Estructuradas sin Fuga de Datos** | A05:2021 - Security Misconfiguration (ASVS V7.4) | 🟠 Alta | ✅ CUMPLE | Handlers API devuelven respuestas JSON uniformes (`{ error: string }`). Nunca se exponen trazas de pila (*stack traces*) ni detalles internos del servidor. | Validado en endpoints `/api/auth/*` y `/api/schools/*`. |
| **17** | **Seguridad en Encabezados HTTP (Security Headers)** | A05:2021 - Security Misconfiguration (ASVS V14.4) | 🟠 Alta | ✅ CUMPLE | Cabeceras de seguridad configuradas: `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`. | Verificado en configuración de middleware y Next.js. |
| **18** | **Protección contra Cross-Site Scripting (XSS)** | A03:2021 - Injection (ASVS V5.3) | 🔴 Crítica | ✅ CUMPLE | Renderizado React con escape automático de HTML nativo. Prohibición de `dangerouslySetInnerHTML` en todo el codebase. | Inspección de componentes `components/ui/*`. |
| **19** | **Restricción de Métodos HTTP en Endpoints** | OWASP API8:2023 - Security Misconfiguration | 🟡 Media | ✅ CUMPLE | Cada ruta de Next.js App Router solo exporta los verbos HTTP autorizados (`GET`, `POST`, `PATCH`, `DELETE`). Cualquier otro método devuelve `405 Method Not Allowed`. | Verificado en arquitectura App Router. |
| **20** | **Prevención de Ataques CSRF en Mutaciones de API** | A01:2021 - Broken Access Control (ASVS V4.2) | 🟠 Alta | ✅ CUMPLE | Uso de cookies `SameSite: "lax"` combinado con validación de cabecera `Content-Type: application/json` y token JWT. | Validado en mutaciones POST/PATCH. |
| **21** | **Manejo Centralizado de Excepciones** | A05:2021 - Security Misconfiguration (ASVS V7.4) | 🟡 Media | ✅ CUMPLE | `app/error.tsx` y `app/not-found.tsx` gestionan errores de cliente/servidor sin romper la interfaz ni revelar infraestructura subyacente. | Validado en renderizado de componentes de error. |

---

### SECCIÓN 4: Seguridad de Base de Datos y Aislamiento Multi-Tenant (OWASP A03/A08:2021 & Database Security)

| # | Control Técnico | Categoría OWASP / ASVS | Severidad | Estado | Implementación en AURENIS | Método de Verificación / QA |
| :-: | :--- | :--- | :-: | :-: | :--- | :--- |
| **22** | **Prevención Absoluta de SQL Injection (SQLi)** | A03:2021 - Injection (ASVS V5.3) | 🔴 Crítica | ✅ CUMPLE | Uso exclusivo de Prisma ORM con consultas 100% parametrizadas. Cero concatenación de cadenas SQL crudas en la capa de servicios. | Inspección de `lib/services/*` y `lib/db/prisma.ts`. |
| **23** | **Interceptor Scoped Multi-Tenant (`createTenantPrisma`)** | A01:2021 - Broken Access Control (ASVS V4.2) | 🔴 Crítica | ✅ CUMPLE | Extensión de cliente Prisma que inyecta automáticamente el predicado `where: { schoolId }` en todas las consultas de lectura y valida el scope en escrituras. | Validado en `qa-security-test.ts` (Módulo 3.2 y 3.3). |
| **24** | **Bloqueo Activo de Mutaciones Cruzadas entre Tenants** | A01:2021 - Broken Access Control (ASVS V4.2) | 🔴 Crítica | ✅ CUMPLE | Si una operación de inserción o actualización intenta asignar un `schoolId` diferente al del contexto del tenant, se arroja una excepción de seguridad bloqueante. | Validado en `qa-security-test.ts` (Módulo 3.3 - Prevención escrituras cruzadas). |
| **25** | **Restricciones de Integridad y Claves Foráneas en BD** | A04:2021 - Insecure Design (ASVS V1.4) | 🟠 Alta | ✅ CUMPLE | Esquema relacional con índices únicos compuestos (ej. `@@unique([userId, schoolId])` en membresías, `@@unique([code, schoolId])` en asignaturas). | Definido en `prisma/schema.prisma`. |
| **26** | **Bitácora Inmutable de Auditoría (*Audit Log Append-Only*)** | A09:2021 - Security Logging & Monitoring (ASVS V10.1) | 🟠 Alta | ✅ CUMPLE | Tabla `AuditLog` para registrar inicios de sesión, cambios de configuración, creación/modificación de notas y eventos de administración (`lib/services/audit.service.ts`). | Validado en `qa-security-test.ts` (Módulo 5). |
| **27** | **Principio de Menor Privilegio en Conexión a Base de Datos** | A05:2021 - Security Misconfiguration (ASVS V14.1) | 🟠 Alta | ✅ CUMPLE | Credenciales de base de datos desacopladas mediante variables de entorno (`DATABASE_URL`), sin permisos de superusuario de PostgreSQL en la aplicación. | Verificado en `.env.example` y `prisma/schema.prisma`. |

---

### SECCIÓN 5: Criptografía, Privacidad y Protección de Datos Sensibles (OWASP A02/A04:2021)

| # | Control Técnico | Categoría OWASP / ASVS | Severidad | Estado | Implementación en AURENIS | Método de Verificación / QA |
| :-: | :--- | :--- | :-: | :-: | :--- | :--- |
| **28** | **Cifrado en Tránsito Obligatorio (TLS 1.3 / HTTPS)** | A02:2021 - Cryptographic Failures (ASVS V9.1) | 🔴 Crítica | ✅ CUMPLE | Todo el tráfico HTTP es redirigido a HTTPS con cifrado TLS 1.3 gestionado por el proxy reverso y Cloud Run. | Configuración de despliegue y cookies `Secure`. |
| **29** | **Protección de Datos Sensibles de Menores de Edad** | A04:2021 - Insecure Design (Ley 19.628 / GDPR Art. 8) | 🔴 Crítica | ✅ CUMPLE | Restricción estricta de campos sensibles (fichas médicas, diagnósticos NEE, órdenes judiciales de retiro `canPickUp`) accesibles solo por Director y Apoderado legal. | Documentado en `COMPLIANCE_AND_DATA_PRIVACY_GUIDE.md` y RBAC. |
| **30** | **Gestión Segura de Secretos y Claves Criptográficas** | A05:2021 - Security Misconfiguration (ASVS V14.2) | 🔴 Crítica | ✅ CUMPLE | Secretos (`JWT_SECRET`, `DATABASE_URL`) inyectados por variables de entorno del servidor. Prohibido prefijo `NEXT_PUBLIC_` en claves privadas. | Verificado en `lib/auth/session.ts` y `.env.example`. |
| **31** | **Inmutabilidad y No-Repudio en Libro de Clases Digital** | A08:2021 - Software and Data Integrity (Circular 482) | 🟠 Alta | ✅ CUMPLE | Registros de asistencia y notas asocian `userId` del autor, fecha/hora inmutable y evento en `AuditLog` para cumplimiento legal. | Verificado en `prisma/schema.prisma` y `audit.service.ts`. |
| **32** | **Aislamiento de Entornos de Ejecución (Zero-Trust)** | A04:2021 - Insecure Design (ASVS V1.1) | 🟠 Alta | ✅ CUMPLE | Separación estricta entre entorno de desarrollo, pre-producción y producción con bases de datos y secretos independientes. | Configuración de contenedores y CI/CD. |

---

## 👥 Socialización con el Equipo y Plan de Gobernanza

Para garantizar la adopción efectiva de esta lista de verificación técnica, se establece el siguiente protocolo de socialización, revisión y cumplimiento operativo:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 MATRIZ RACI DE SEGURIDAD OWASP                                  │
├──────────────────────────┬──────────────┬──────────────┬──────────────┬─────────────────────────┤
│ ACTIVIDAD / FASE         │ TECH LEAD    │ BACKEND DEV  │ FRONTEND DEV │ QA & SEGURIDAD          │
├──────────────────────────┼──────────────┼──────────────┼──────────────┼─────────────────────────┤
│ Revisión de PR (Checklist│ A (Aprobador)│ R (Ejecuta)  │ R (Ejecuta)  │ C (Consultado)          │
│ Ejecución Suite QA       │ I (Informado)│ R (Ejecuta)  │ R (Ejecuta)  │ A (Valida y Certifica)  │
│ Auditoría de Dependencias│ A (Aprobador)│ R (Ejecuta)  │ R (Ejecuta)  │ R (Escanea vulnerab.)   │
│ Monitoreo de Audit Logs  │ I (Informado)│ C (Consultado│ I (Informado)│ R (Revisa periódicamente│
│ Capacitación Continua    │ A (Aprobador)│ I (Participa)│ I (Participa)│ R (Facilita sesiones)   │
└──────────────────────────┴──────────────┴──────────────┴──────────────┴─────────────────────────┘
* R = Responsible (Responsable de ejecución) | A = Accountable (Aprobador final) | C = Consulted (Consultado) | I = Informed (Informado)
```

### 1. Checklist Obligatorio para Pull Requests (PRs)
Antes de fusionar código a la rama principal (`main`), los desarrolladores deben verificar:
- [ ] ¿El nuevo endpoint valida la sesión y permisos mediante `assertPermission`?
- [ ] ¿Las consultas de base de datos utilizan `createTenantPrisma` con el `schoolId` contextual?
- [ ] ¿Todos los datos de entrada están validados con esquemas Zod (`safeParse`)?
- [ ] ¿Se registraron eventos de auditoría en `AuditLog` para operaciones de mutación crítica?
- [ ] ¿La suite automatizada de pruebas (`npm test`) se ejecuta con 100% de éxito?

### 2. Ciclo de Capacitación y Sesiones Técnicas
* **Seminario Técnico:** *"Zero-Trust Multi-Tenancy y Prevención de IDOR en Next.js 15"*.
* **Taller Práctico:** *"Manejo Seguro de Cookies, Criptografía JWT y Cumplimiento de la Circular 482"*.
* **Frecuencia de Auditoría:** Revisión bimensual de la lista de controles OWASP y actualización frente a nuevas amenazas.

---

## 🏆 Criterios de Aceptación (Definition of Done)

- [x] **Checklist técnico elaborado:** 32 controles técnicos específicos cubriendo OWASP Top 10, OWASP API Top 10 y Seguridad de Base de Datos con estado, severidad, evidencia y archivo fuente.
- [x] **Criterios para APIs y autenticación incluidos:** Hashing Bcrypt, validación criptográfica JWT, cookies HttpOnly/SameSite/Secure, esquemas Zod, filtrado de errores, y prevención de IDOR.
- [x] **Socialización con el equipo:** Matriz RACI, checklist obligatorio para Pull Requests y plan de sesiones de capacitación técnica documentados.
