# 📚 ÍNDICE GENERAL DE DOCUMENTACIÓN OFICIAL — AURENIS v1.0

**Plataforma:** AURENIS — Sistema de Gestión Académica y Multi-Tenant Escolar  
**Versión:** 1.0.0 (Certificada para Producción)  
**Fecha de Publicación:** Septiembre de 2026  
**Clasificación:** Documentación Técnica, Operativa y de Cumplimiento Normativo  

---

## 🎯 Propósito del Repositorio Documental

Este centro de documentación consolida todas las especificaciones arquitectónicas, matrices de permisos, contratos de API, modelado de amenazas de seguridad, estrategias de aseguramiento de calidad (QA) y manuales operativos de **AURENIS**.

---

## 🧭 Rutas de Lectura por Perfil

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               GUÍAS DE LECTURA POR PERFIL                              │
├──────────────────────────┬─────────────────────────────────────────────────────────────┤
│ 👨‍💻 DESARROLLADORES       │ 1. Arquitectura ➔ 2. RBAC ➔ 3. APIs ➔ 4. Guía Dev & Ops     │
├──────────────────────────┼─────────────────────────────────────────────────────────────┤
│ 🛡️ OFICIAL DE SEGURIDAD  │ 1. STRIDE Threat Model ➔ 2. QA Audit Report ➔ 3. Compliance │
├──────────────────────────┼─────────────────────────────────────────────────────────────┤
│ 🧪 EQUIPO DE QA & TEST   │ 1. Testing Strategy ➔ 2. QA Audit Report ➔ 3. Test Suite    │
├──────────────────────────┼─────────────────────────────────────────────────────────────┤
│ 🏫 DIRECTORES & COLEGIOS │ 1. Guía de Usuarios y Roles ➔ 2. Cumplimiento Circular 482  │
└──────────────────────────┴─────────────────────────────────────────────────────────────┘
```

---

## 📑 Directorio de Documentos

### 0. 👑 [Gobernanza del Equipo, Auditoría de Roles & Protocolo de IA](../TEAM_ROLES_AND_AI_PROTOCOL.md)
*Gobernanza oficial del proyecto, división de responsabilidades y directrices de IA.*
- Matriz de responsabilidades: **Maicol R.** (Lead / Backend & Arquitectura), **Malcom Marcelo** (Frontend), **Lucas P.** (UI/UX) y **Frank M.** (QA & Seguridad).
- Definición de Hecho (Definition of Done - DoD) obligatoria.
- Plan y prioridades para los próximos 30 días de desarrollo.
- Reglas obligatorias para asistentes de IA y agentes en chats paralelos.

### 1. 🏛️ [Arquitectura Técnica del Sistema](./ARCHITECTURE.md) | [Dossier de Entrega - Sección Arquitectura](./DOSSIER_ENTREGA_AURENIS_SECCION_ARQUITECTURA.md) | [Diccionario de Datos & Diagrama ER](./DICCIONARIO_DE_DATOS_Y_DIAGRAMA_ER.md)
*Visión global, diseño en capas, modelo relacional, diccionario de 26 tablas, aislamiento multi-tenant y persistencia.*
- Principios de diseño (*Zero-Trust Multi-Tenancy*, Defensa en Profundidad).
- Diagrama de flujo de peticiones (Middleware ➔ RSC/API Handlers ➔ Dominio RBAC ➔ Scoped ORM).
- Modelo de base de datos relacional y estrategia de discriminador lógico (`schoolId`).
- **Diccionario de datos tabulado completo** (26 tablas, tipos PostgreSQL, restricciones y relaciones) y **Diagrama ER impreso**.
- Manejo centralizado de excepciones y códigos de estado RFC estándar.
- **Sección oficial del Dossier de Entrega** aprobada y firmada por **Maicol R.** (*Project Lead & Arquitectura*).

### 2. 🛡️ [Memoria Técnica de Ciberseguridad](./MEMORIA_CIBERSEGURIDAD_STRIDE_OWASP_RIESGOS.md) | [Modelado STRIDE](./STRIDE_THREAT_MODELING.md)
*Informe formal de ciberseguridad, modelado de amenazas STRIDE, 32 controles OWASP y análisis de riesgos 5x5.*
- Descomposición de 8 módulos críticos y matriz STRIDE completa con puntuación DREAD y CVSS.
- Evaluación de riesgos específicos en datos de niños, niñas y adolescentes (NNA):
  - Fichas médicas, diagnósticos PIE/NEE y notas de salud (`medicalNotes`).
  - Restricciones de retiro físico y medidas cautelares de custodia (`canPickUp`).
  - Trazabilidad y seguimiento de horarios físicos (`ScheduleBlock`, `AttendanceRecord`).
- Estrategias de mitigación técnica (Criptografía AES-256-GCM, Scoped ORM, Bitácora *Append-Only*).
- Panel interactivo en plataforma: `/system/security`.

### 3. 📊 [Evaluación de Riesgos 5x5, OWASP Top 10 & Plan de Acción](./RISK_ASSESSMENT_MATRIX_5X5.md)
*Evaluación cuantitativa/cualitativa de riesgos (ISO 27005 / NIST), mapeo OWASP y acuerdos de ingeniería.*
- Matriz $5 \times 5$ de Probabilidad vs. Impacto con cálculo de Riesgo Inherente vs. Residual.
- Mapeo canónico contra las 10 categorías de OWASP Top 10:2021 y OWASP API Top 10.
- Plan de acción formal acordado con los líderes de desarrollo (Backend, DevOps, QA Lead) con SLAs de remediación obligatorios.

### 4. 🛡️ [Lista de Verificación Técnica de Seguridad OWASP](./OWASP_SECURITY_CHECKLIST.md)
*Checklist técnico de 32 controles específicos para aplicación web, APIs, autenticación y base de datos.*
- 32 controles técnicos categorizados por severidad y dominio (Autenticación, RBAC, APIs, Base de Datos, Criptografía).
- Criterios rigurosos de endpoints, manejo de tokens JWT, cookies seguras y prevención de IDOR / SQLi.
- Protocolo de socialización con el equipo, matriz RACI y checklist obligatorio de Pull Requests.

### 5. 👥 [Matriz de Roles y Permisos RBAC](./RBAC_PERMISSIONS_MATRIX.md)
*Control de acceso granular basado en roles.*
- Catálogo exhaustivo de permisos canónicos (`SCHOOL_SETTINGS_UPDATE`, `GRADES_ENTER`, `ATTENDANCE_RECORD`, etc.).
- Desglose CRUD por módulo y entidad (Colegios, Profesores, Estudiantes, Calificaciones, Asistencia).
- Jerarquía de roles: `SYSTEM_ADMIN`, `SCHOOL_ADMIN` (Director), `TEACHER`, `STUDENT`, `GUARDIAN`.
- Mecanismos de enforcement en servidor y prevención de escalación horizontal/vertical.

### 4. 🔌 [Documentación de la API REST](./API_DOCUMENTATION.md) | [Catálogo Canónico de APIs](./CATALOGO_ENDPOINTS_ESPECIFICACION_APIS.md) | [Suite cURL](./api-curl-examples.md)
*Especificación técnica de 28 endpoints, contratos JSON, esquemas Zod y códigos de respuesta.*
- Autenticación (`POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`, `POST /api/auth/select-school`).
- Control Plane (`GET/POST /api/system/schools`, `PATCH /api/system/schools/[id]/status`).
- Gestión Institucional y Periodos (`PATCH /api/schools/[id]/settings`, `GET/POST /api/schools/[id]/academic-periods`).
- Personas y Docentes (`GET/POST /api/schools/[id]/students`, `GET/POST /api/schools/[id]/teachers`).
- Calificaciones y Libro Digital (`GET/POST /api/schools/[id]/grades`, `GET /api/schools/[id]/grades/matrix`, `POST /api/schools/[id]/grades/bulk`).
- Exportación Segura (`GET /api/schools/[id]/export`).
- Suite ejecutable de ejemplos cURL con validación de cookies seguras y control de BOLA/IDOR.

### 5. 🧪 [Plan de Pruebas IEEE 829 & Pauta ABP](./PLAN_DE_PRUEBAS_OFICIAL_IEEE_829_ABP.md) | [Estrategia de Testing](./TESTING_STRATEGY.md)
*Plan Maestro de Pruebas formal según estándar IEEE 829-2008, pauta ABP, pirámide de calidad y métricas.*
- Alcance detallado (8 módulos bajo prueba, criterios de entrada, suspensión y salida).
- Clasificación de severidad de defectos (Bloqueante, Crítico, Mayor, Menor) y SLAs de remediación.
- Datasets de prueba multi-tenant preconfigurados (Colegio San José vs. Liceo Bicentenario).
- Matriz RACI del equipo y firmas de aprobación técnica de **Frank M.** (QA Lead) y **Maicol R.** (Project Lead).

### 6. 📊 [Catálogo de Casos de Prueba Ejecutados](./CATALOGO_CASOS_DE_PRUEBA_EJECUTADOS_Y_RESULTADOS.md) | [QA Audit Report](./QA_AUDIT_REPORT.md)
*Matriz completa del 100% de casos de prueba funcionales y no funcionales ejecutados (57/57 tests PASS).*
- Casos tabulados: Autenticación, Multi-Tenant, Decreto 67, Circular 482, Cifrado NNA, Pentest OWASP, Latencia y A11y WCAG 2.1 AA.
- Resultados esperados vs. obtenidos y trazabilidad de KPIs de calidad (100.0% tasa de éxito).
- Verificación formal de Criterios de Aceptación y certificación técnica de no-regresión.

### 7. 📖 [Guía de Usuarios y Roles Institucionales](./USER_AND_ROLES_GUIDE.md)
*Manual funcional para usuarios y administradores escolares.*
- Flujos de trabajo diarios por perfil:
  - SuperAdmin: Aprovisionamiento de colegios y supervisión global.
  - Director: Parametrización institucional y gestión de miembros.
  - Profesor: Registro de calificaciones y toma de asistencia diaria.
  - Estudiante / Apoderado: Consulta de avances y libreta de notas.
- Políticas de contraseñas seguras y recuperación de accesos.

### 8. ⚙️ [Guía de Desarrollo y Operaciones (DevOps & Deployment)](./DEVELOPER_AND_OPERATIONS_GUIDE.md)
*Guía de ingeniería, variables de entorno, migraciones y despliegue en producción.*
- Configuración del entorno local (Node.js, PNPM/NPM, Next.js 15).
- Gestión de migraciones Prisma y seeding de base de datos.
- Despliegue en contenedores Docker y Google Cloud Run.
- Procedimientos de monitoreo, respaldo y contingencia.

### 9. ⚖️ [Guía de Cumplimiento Normativo y Privacidad Escolar](./COMPLIANCE_AND_DATA_PRIVACY_GUIDE.md)
*Cumplimiento legal chileno e internacional.*
- **Circular N° 482 de la Superintendencia de Educación (Chile):** Libro de clases digital, inalterabilidad y firmas.
- **Ley N° 19.628 / 21.096:** Protección de datos personales y vida privada.
- **Ley N° 21.430:** Garantías y protección integral de los derechos de la niñez.
- **GDPR Art. 8 & FERPA/COPPA:** Estándares de consentimiento parental y tratamiento de datos de menores.

### 10. 📂 [Guía de Organización de Directorios y Manual de Contribuidores](./GUIA_ORGANIZACION_DIRECTORIOS_Y_CONTRIBUIDORES.md)
*Estructura frontend y backend, catálogo de archivos clave y onboarding para desarrolladores.*
- Árbol jerárquico exhaustivo de carpetas (`/app`, `/components`, `/lib`, `/prisma`, `/scripts`, `/docs`).
- Explicación de módulos de datos, perimetrales, interfaz reactiva y pruebas.
- Catálogo de archivos clave del núcleo con asignación formal de responsabilidades por integrante.
- Flujo de onboarding paso a paso, convenciones de Git, estándares anti-AI slop y checklist pre-PR.

### 11. 🔐 [Documentación Técnica: Hashing Bcrypt, JWT y Manejo de Tokens](./DOCUMENTACION_TECNICA_HASHING_JWT_Y_MANEJO_TOKENS.md)
*Especificación criptográfica, estructura de tokens y esquema de cookies seguras.*
- Hashing de contraseñas con Bcrypt (Salt Rounds = 10) y comparaciones en tiempo constante.
- Estructura de JWT (`jose` / HS256), anatomía de claims (`sub`, `schoolId`, `role`, `permissions`) y ciclo de vida de 7 días.
- Esquema de cookies seguras `aurenis_session` (`HttpOnly`, `Secure`, `SameSite: none/lax`, `Path: /`).
- Mecanismo de revocación Edge-Safe (`jti`), purga en logout y mitigación contra OWASP/STRIDE.

### 12. 🛡️ [Detalle de Perfiles de Usuario, Matriz de Accesos y Guardas de Seguridad](./DETALLE_PERFILES_USUARIO_MATRIZ_ACCESOS_Y_GUARDAS.md)
*Especificación técnica canónica de perfiles, matriz CRUD por módulo y defensa en 3 capas.*
- Detalle exhaustivo de los 5 roles: `SYSTEM_ADMIN`, `SCHOOL_ADMIN`, `TEACHER`, `STUDENT`, `GUARDIAN`.
- Matriz completa de 23 permisos canónicos tipados en `lib/constants/permissions.ts` con descripción y asignación.
- Arquitectura de guardas de seguridad en 3 capas: Perímetro (`middleware.ts`), RBAC Servidor (`lib/auth/permissions.ts`) y Aislamiento ORM (`createTenantPrisma`).
- Verificación perimetral de rutas `/system/*`, saneamiento zero-trust de cabeceras y prevención activa contra BOLA/IDOR.

---

## 🛠️ Comando Rápido de Ejecución de Pruebas

Para ejecutar la suite automatizada de verificación de seguridad y QA:

```bash
npm test
# Ejecuta el test runner con 57 aserciones de seguridad y RBAC
```
