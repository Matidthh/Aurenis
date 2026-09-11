# 📊 EVALUACIÓN DE RIESGOS EN SEGURIDAD (MATRIZ 5x5), ASOCIACIÓN OWASP TOP 10 Y PLAN DE ACCIÓN — AURENIS v1.0

**Documento:** Evaluación Cuantitativa y Cualitativa de Riesgos, Mapeo OWASP y Acuerdos de Ingeniería  
**Plataforma:** AURENIS — Sistema de Gestión Académica y Multi-Tenant Escolar  
**Fecha de Emisión:** 11 de Septiembre de 2026  
**Clasificación:** Confidencial / Seguridad de la Información, Cumplimiento y DevOps  
**Responsables Técnicos:** 
- **Frank M.** — QA / Testing / Seguridad & Documentación
- **Maicol R.** — Backend Lead & Arquitectura de Datos
- **Carlos M.** — DevOps, Cloud Infrastructure & Release Management

---

## 1. Metodología de Evaluación de Riesgos (Matriz 5x5)

La gestión de riesgos de seguridad en **AURENIS** se fundamenta en una matriz bidimensional de **Impacto (I)** versus **Probabilidad (P)** según los estándares ISO/IEC 27005 y NIST SP 800-30:

$$\text{Nivel de Riesgo} = \text{Probabilidad (1-5)} \times \text{Impacto (1-5)}$$

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              MATRIZ DE RIESGO 5x5 (P x I)                              │
├───────────────────┬──────────────┬──────────────┬──────────────┬──────────────┬────────┤
│ PROBABILIDAD \ IMP│ 1. Insignif. │ 2. Menor     │ 3. Moderado  │ 4. Mayor     │5. Catas│
├───────────────────┼──────────────┼──────────────┼──────────────┼──────────────┼────────┤
│ 5. Casi Segura    │ 5 (Medio)    │ 10 (Medio)   │ 15 (Alto)    │ 20 (Crítico) │25 (Crí)│
│ 4. Probable       │ 4 (Bajo)     │ 8 (Medio)    │ 12 (Medio)   │ 16 (Alto)    │20 (Crí)│
│ 3. Posible        │ 3 (Bajo)     │ 6 (Bajo)     │ 9 (Medio)    │ 12 (Medio)   │15 (Alt)│
│ 2. Improbable     │ 2 (Bajo)     │ 4 (Bajo)     │ 6 (Bajo)     │ 8 (Medio)    │10 (Med)│
│ 1. Rara           │ 1 (Bajo)     │ 2 (Bajo)     │ 3 (Bajo)     │ 4 (Bajo)     │ 5 (Med)│
└───────────────────┴──────────────┴──────────────┴──────────────┴──────────────┴────────┘
```

### 1.1 Escala de Probabilidad (Likelihood)
| Nivel | Categoría | Frecuencia Estimada / Contexto |
| :---: | :--- | :--- |
| **1** | **Rara** | Menos del 5% de probabilidad anual; requiere capacidades de ataque extremadamente complejas. |
| **2** | **Improbable** | Entre 5% y 20%; requiere acceso interno previo o condiciones anómalas. |
| **3** | **Posible** | Entre 21% y 50%; vector documentado y herramientas automatizadas públicas disponibles. |
| **4** | **Probable** | Entre 51% y 80%; escaneos recurrentes en Internet y scripts automatizados de ataque. |
| **5** | **Casi Segura** | Mayor al 80%; intentos constantes en el perímetro web y endpoints públicos. |

### 1.2 Escala de Impacto (Severity / Consequence)
| Nivel | Categoría | Daño Institucional, Académico y a Menores de Edad |
| :---: | :--- | :--- |
| **1** | **Insignificante** | Sin afectación a datos ni interrupción de servicios; logs informativos. |
| **2** | **Menor** | Afectación aislada a un usuario o registro no sensible; resolución inmediata sin impacto público. |
| **3** | **Moderado** | Alteración corregible de notas no cerradas, denegación temporal de servicio sin fuga masiva. |
| **4** | **Mayor** | Fuga de datos de menores, alteración de actas oficiales cerradas, sanciones de la Supereduc. |
| **5** | **Catastrófico** | Fuga masiva cross-tenant de datos médicos/PIE, sustracción de menores por brecha de custodia, pérdida total de fe pública. |

### 1.3 Clasificación de Niveles de Riesgo y SLAs de Remediación
- 🔴 **CRÍTICO (20 - 25):** Riesgo inaceptable. Requiere control bloqueante y remediación inmediata (**SLA < 24 Horas**).
- 🟠 **ALTO (15 - 19):** Riesgo elevado. Prioridad absoluta en el sprint activo (**SLA < 7 Días**).
- 🟡 **MEDIO (8 - 14):** Riesgo moderado. Remediación planificada con monitoreo activo (**SLA < 30 Días**).
- 🟢 **BAJO (1 - 7):** Riesgo tolerable. Monitoreo estándar y buenas prácticas de ingeniería (**SLA < 90 Días**).

---

## 2. Matriz Priorizada de Riesgos, Evaluación Inherente vs. Residual

A continuación se detallan los 12 riesgos principales identificados en la plataforma, ordenados por su nivel de **Riesgo Inherente** y evaluados post-implementación de controles mitigantes (**Riesgo Residual**):

| ID | Riesgo de Seguridad / Escenario de Amenaza | Módulo | Categoría OWASP Top 10 | Riesgo Inherente (P × I) | Controles Mitigantes Asignados | Riesgo Residual (P × I) | Estado / QA | Responsable |
| :--- | :--- | :--- | :--- | :---: | :--- | :---: | :---: | :--- |
| **RSK-01** | **Fuga de datos cross-tenant mediante IDOR / BOLA** (un colegio accede a nóminas o expedientes de otro) | Persistencia & ORM | **A01:2021** (Broken Access Control) | **P: 4, I: 5 = 20 (CRÍTICO)** | Interceptor ORM `createTenantPrisma(schoolId)` inyecta `where: { schoolId }` obligatorio en el 100% de las queries. | **P: 1, I: 4 = 4 (BAJO)** | 🟢 100% PASS | Maicol R. (Backend) |
| **RSK-02** | **Alteración no autorizada de permisos de retiro físico de menores (`canPickUp`)** vulnerando medidas cautelares | Fichas de Estudiantes | **A01:2021** (Broken Access Control) | **P: 3, I: 5 = 15 (ALTO)** | Restricción exclusiva a `SCHOOL_ADMIN` + Validación documental + Registro inmutable en `AuditLog` como `SECURITY_EVENT`. | **P: 1, I: 5 = 5 (BAJO)** | 🟢 100% PASS | Frank M. (Seguridad) |
| **RSK-03** | **Estudiante escala privilegios para alterar notas o actas ministeriales** (`GRADES_ENTER`, `POST /grades`) | Académico & Notas | **A01:2021** (Broken Access Control) | **P: 5, I: 4 = 20 (CRÍTICO)** | Aserción canónica en backend `assertPermission(ctx, GRADES_ENTER)` retornando HTTP 403 Forbidden estructurado. | **P: 1, I: 4 = 4 (BAJO)** | 🟢 100% PASS | Maicol R. (Backend) |
| **RSK-04** | **Falsificación de Tokens JWT / Session Hijacking** por clave secreta predecible o token en LocalStorage | Autenticación & Sesión | **A02:2021** (Cryptographic Failures) / **A07:2021** (Auth Failures) | **P: 4, I: 5 = 20 (CRÍTICO)** | Criptografía HS256 con librería `jose`, tokens efímeros (8h) en cookies `HttpOnly`, `Secure` y `SameSite=Lax`. | **P: 1, I: 5 = 5 (BAJO)** | 🟢 100% PASS | Maicol R. (Backend) |
| **RSK-05** | **Fuga de antecedentes médicos, diagnósticos PIE y NEE (`medicalNotes`)** a docentes o alumnos no facultados | Privacidad de Menores | **A01:2021** (Broken Access Control) / **A04:2021** (Insecure Design) | **P: 4, I: 4 = 16 (ALTO)** | Segregación a nivel de ORM (campo excluido de consultas masivas); visibilidad exclusiva a enfermería y dirección. | **P: 1, I: 4 = 4 (BAJO)** | 🟢 100% PASS | Frank M. (Seguridad) |
| **RSK-06** | **Fraude y adulteración de notas posteriores al cierre del semestre oficial** | Libro de Clases | **A08:2021** (Software & Data Integrity Failures) | **P: 4, I: 4 = 16 (ALTO)** | Bloqueo en backend por estado `AcademicPeriod.isClosed === true` + Auditoría obligatoria de cambios históricos con diff. | **P: 1, I: 4 = 4 (BAJO)** | 🟢 100% PASS | Maicol R. (Backend) |
| **RSK-07** | **Ataque de fuerza bruta / Credential Stuffing contra `/api/auth/login`** | Autenticación | **A07:2021** (Identification & Auth Failures) | **P: 5, I: 3 = 15 (ALTO)** | Hashing con Bcrypt factor 10 + Rate Limiting por IP/usuario + Bloqueo progresivo de cuenta tras 5 intentos fallidos. | **P: 2, I: 3 = 6 (BAJO)** | 🟢 100% PASS | Carlos M. (DevOps) |
| **RSK-08** | **Profesor de un curso modifica asignaturas o evaluaciones de otros docentes** (Escalación Horizontal) | Cursos & Asignaturas | **A01:2021** (Broken Access Control) | **P: 4, I: 3 = 12 (MEDIO)** | Verificación de relación relacional: `subject.teacherProfileId === session.teacherProfileId` previo a mutaciones. | **P: 1, I: 3 = 3 (BAJO)** | 🟢 100% PASS | Maicol R. (Backend) |
| **RSK-09** | **Borrado o adulteración de la bitácora de auditoría forense (`AuditLog`)** | Auditoría & Trazabilidad | **A09:2021** (Security Logging & Monitoring Failures) | **P: 3, I: 5 = 15 (ALTO)** | Modelo de solo inserción (*Append-Only*), sin rutas ni métodos de actualización/borrado en Prisma ORM. | **P: 1, I: 4 = 4 (BAJO)** | 🟢 100% PASS | Carlos M. (DevOps) |
| **RSK-10** | **Inyección de parámetros inválidos o notas fuera de rango (ej: nota 99.0)** | Validación de Negocio | **A03:2021** (Injection / Zod Validation) | **P: 4, I: 3 = 12 (MEDIO)** | Validación declarativa de esquemas Zod con rangos decimales estrictos (`minGrade: 1.0`, `maxGrade: 7.0`, `precision: 1`). | **P: 1, I: 2 = 2 (BAJO)** | 🟢 100% PASS | Maicol R. (Backend) |
| **RSK-11** | **Escalación vertical al Control Plane global `/system/*` desde rol escolar** | Control Plane SaaS | **A01:2021** (Broken Access Control) | **P: 4, I: 5 = 20 (CRÍTICO)** | Doble barrera: `middleware.ts` y handlers `/api/system/*` exigen explícitamente `session.isSystemAdmin === true`. | **P: 1, I: 4 = 4 (BAJO)** | 🟢 100% PASS | Frank M. (Seguridad) |
| **RSK-12** | **Seguimiento físico y acoso a menores mediante correlación de horarios y asistencia diaria** | Asistencia & Horarios | **A01:2021** (Broken Access Control) / Privacidad NNA | **P: 3, I: 4 = 12 (MEDIO)** | Rutas bajo autenticación cerrada por tenant, no indexación web (`robots: noindex`), y visibilidad exclusiva de tutores acreditados. | **P: 1, I: 4 = 4 (BAJO)** | 🟢 100% PASS | Frank M. (Seguridad) |

---

## 3. Mapeo Integral con OWASP Top 10:2021 & OWASP API Top 10

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        MAPEO ESTRATÉGICO OWASP TOP 10 EN AURENIS                       │
├──────────────────────────────────────┬─────────────────────────────────────────────────┤
│ CATEGORÍA OWASP TOP 10 (2021/2025)   │ IMPLEMENTACIÓN DE DEFENSA EN PROFUNDIDAD        │
├──────────────────────────────────────┼─────────────────────────────────────────────────┤
│ A01: Broken Access Control           │ • RBAC canónico en 3 capas (assertPermission)   │
│                                      │ • Interceptor createTenantPrisma(schoolId)      │
│                                      │ • Respuestas estandarizadas RFC HTTP 403        │
├──────────────────────────────────────┼─────────────────────────────────────────────────┤
│ A02: Cryptographic Failures          │ • Firma de tokens JWT HS256 con librería jose   │
│                                      │ • Contraseñas con Bcrypt factor de coste 10     │
│                                      │ • Cookies HttpOnly + Secure + SameSite=Lax      │
├──────────────────────────────────────┼─────────────────────────────────────────────────┤
│ A03: Injection                       │ • Prisma ORM con consultas parametrizadas       │
│                                      │ • Esquemas Zod estrictos en todos los DTOs      │
│                                      │ • Sanitización tipada de contratos de entrada   │
├──────────────────────────────────────┼─────────────────────────────────────────────────┤
│ A04: Insecure Design                 │ • Modelado STRIDE en módulos críticos           │
│                                      │ • Segregación de campos sensibles (medicalNotes)│
│                                      │ • Bloqueo de periodos académicos cerrados       │
├──────────────────────────────────────┼─────────────────────────────────────────────────┤
│ A05: Security Misconfiguration       │ • Cabeceras HSTS, X-Content-Type, CSP estricto  │
│                                      │ • Manejo centralizado de errores sin stacktrace │
│                                      │ • Puerto 3000 acotado con Nginx reverse proxy   │
├──────────────────────────────────────┼─────────────────────────────────────────────────┤
│ A06: Vulnerable & Outdated Comps     │ • Dependencias fijadas y auditadas (npm audit)  │
│                                      │ • Framework moderno: Next.js 15 + React 19      │
├──────────────────────────────────────┼─────────────────────────────────────────────────┤
│ A07: Identification & Auth Failures  │ • Cookies inmunes a XSS (no en LocalStorage)    │
│                                      │ • Invocación forzosa de logout con epoch reset  │
│                                      │ • Protección contra ataques de fuerza bruta     │
├──────────────────────────────────────┼─────────────────────────────────────────────────┤
│ A08: Software & Data Integrity       │ • Inmutabilidad de actas oficiales de notas     │
│                                      │ • Trazabilidad forense con diff estructurado    │
├──────────────────────────────────────┼─────────────────────────────────────────────────┤
│ A09: Security Logging & Monitoring   │ • Tabla AuditLog inmutable de solo inserción    │
│                                      │ • Registro de IP, User-Agent, userId y timestamp│
├──────────────────────────────────────┼─────────────────────────────────────────────────┤
│ A10: Server-Side Request Forgery     │ • Inexistencia de webhooks o fetchs arbitrarios │
│                                      │ • Descargas de archivos acotadas al tenant      │
└──────────────────────────────────────┴─────────────────────────────────────────────────┘
```

---

## 4. Plan de Acción y Acuerdos de Ingeniería (DevSecOps Commitments)

El equipo de ingeniería de AURENIS ha formalizado los siguientes **acuerdos operativos y compromisos de desarrollo seguro** para garantizar que los controles mitigantes se mantengan vigentes durante todo el ciclo de vida del software:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        FLUJO DE GOBERNANZA TÉCNICA Y DEVSECOPS                         │
│                                                                                        │
│   [Pull Request] ──▶ [Linter & Typescript] ──▶ [Suite QA 57 Tests] ──▶ [Code Review]   │
│         │                                             │                      │         │
│   (Zero-Trust PR)                            (100% Pass Obligatorio)   (Security Sign) │
│         │                                             │                      │         │
│         ▼                                             ▼                      ▼         │
│   [Deploy Staging] ──────────────────────────▶ [Pen-Test Dinámico] ──▶ [Deploy Prod]   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.1 Compromisos del Equipo de Backend (Maicol R. - Backend Lead)
1. **Regla de Oro Multi-Tenant:** Queda estrictamente prohibido instanciar `prisma` crudo en servicios académicos de colegio; toda operación de datos debe ejecutarse a través de `createTenantPrisma(schoolId)`.
2. **Validación Zod Obligatoria:** Todo endpoint bajo `/api/*` debe validar el cuerpo (`body`), parámetros de URL (`params`) y consultas (`query`) con esquemas Zod antes de invocar la capa de servicio.
3. **Control de Acceso a Nivel de Atributo (BOLA/BPOA):** Proyección explícita de campos en consultas Prisma; `medicalNotes` y antecedentes sensibles nunca deben seleccionarse en listados masivos.

### 4.2 Compromisos del Equipo de Seguridad y QA (Frank M. - QA Lead)
1. **Gate Bloqueante en CI/CD:** El pipeline de integración continua no compilará ni desplegará si la suite automatizada (`npm test`, 57 tests de seguridad) registra un solo fallo.
2. **Pruebas de Regresión de Evasión Forzada:** Toda nueva funcionalidad que introduzca un endpoint de mutación (`POST/PATCH/DELETE`) debe incluir al menos un test forzado simulando un token de estudiante y verificando la recepción de **HTTP 403 Forbidden**.
3. **Auditoría Semanal de Dependencias:** Ejecución automática de `npm audit` y actualización de parches de seguridad críticos en menos de 48 horas.

### 4.3 Compromisos del Equipo de Infraestructura y DevOps (Carlos M. - Cloud Lead)
1. **Gestión Segura de Secretos:** Las claves `JWT_SECRET` y `DATABASE_URL` nunca se commitean en git; se gestionan mediante Google Secret Manager con rotación programada.
2. **Backups Diarios Inmutables:** Snapshots automatizados de base de datos relacional con retención mínima de 30 días y recuperación punto en el tiempo (*PITR*).
3. **Aislamiento de Red:** Aplicación confinada en Google Cloud Run bajo HTTPS/TLS 1.3 forzado y proxy reverso Nginx en puerto 3000.

---

## 5. Tabla de Firmas y Aprobación de la Evaluación

| Rol de Liderazgo Técnico | Nombre | Fecha de Aprobación | Firma de Compromiso |
| :--- | :--- | :---: | :---: |
| **QA / Testing / Seguridad Lead** | Frank M. | 2026-09-11 | ✍️ *Frank M. — Certified* |
| **Backend & Architecture Lead** | Maicol R. | 2026-09-11 | ✍️ *Maicol R. — Approved* |
| **DevOps & Cloud Infrastructure Lead** | Carlos M. | 2026-09-11 | ✍️ *Carlos M. — Approved* |
| **Director de Tecnología (CTO)** | Aurenis Governance Board | 2026-09-11 | ✍️ *Aurenis Core — Certified* |
