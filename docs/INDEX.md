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

### 1. 🏛️ [Arquitectura Técnica del Sistema](./ARCHITECTURE.md)
*Visión global, diseño en capas, aislamiento multi-tenant y persistencia.*
- Principios de diseño (*Zero-Trust Multi-Tenancy*, Defensa en Profundidad).
- Diagrama de flujo de peticiones (Middleware ➔ RSC/API Handlers ➔ Dominio RBAC ➔ Scoped ORM).
- Modelo de base de datos relacional y estrategia de discriminador lógico (`schoolId`).
- Manejo centralizado de excepciones y códigos de estado RFC estándar.

### 2. 🛡️ [Modelado de Amenazas STRIDE & Seguridad Escolar](./STRIDE_THREAT_MODELING.md)
*Análisis riguroso de vectores de ataque y protección de datos de menores.*
- Descomposición de 8 módulos críticos y matriz STRIDE completa con puntuación DREAD y CVSS.
- Evaluación de riesgos específicos en datos de niños, niñas y adolescentes (NNA):
  - Fichas médicas, diagnósticos PIE/NEE y notas de salud (`medicalNotes`).
  - Restricciones de retiro físico y medidas cautelares de custodia (`canPickUp`).
  - Trazabilidad y seguimiento de horarios físicos (`ScheduleBlock`, `AttendanceRecord`).
- Estrategias de mitigación técnica (Criptografía, Scoped ORM, Bitácora *Append-Only*).
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

### 4. 🔌 [Documentación de la API REST](./API_DOCUMENTATION.md)
*Especificación técnica de endpoints, contratos JSON y códigos de respuesta.*
- Autenticación (`POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`).
- Control Plane (`GET/POST /api/system/schools`).
- Gestión Institucional (`PATCH /api/schools/[id]/settings`).
- Calificaciones y Asistencia (`POST/PATCH/DELETE /api/schools/[id]/grades`, `/api/schools/[id]/attendance`).
- Manejo de cabeceras, cookies seguras y respuestas de error tipadas (`400`, `401`, `403`, `404`, `500`).

### 5. 🧪 [Estrategia de Pruebas & Calidad (Testing Strategy)](./TESTING_STRATEGY.md)
*Metodología de testing, pirámide de pruebas y criterios de aceptación.*
- Clasificación de severidad de defectos (Bloqueante, Crítico, Mayor, Menor).
- Datasets de prueba multi-tenant preconfigurados (Colegio San José vs. Colegio Santa María).
- Pruebas de integración, aserciones de seguridad y simulación de ataques forzados.

### 6. 📊 [Informe de Aseguramiento de Calidad y Auditoría (QA Audit Report)](./QA_AUDIT_REPORT.md)
*Resultados y evidencias de la suite automatizada de pruebas.*
- Certificación del 100% de pruebas superadas (57 de 57 tests exitosos).
- Verificación formal de los Criterios de Aceptación (Definition of Done 4/4):
  - DoD 1: Rol Estudiante no puede crear ni editar calificaciones.
  - DoD 2: Rol Profesor no puede alterar cursos ni colegios ajenos.
  - DoD 3: Evasión forzada mediante peticiones HTTP interceptada.
  - DoD 4: Respuestas `403 Forbidden` estructuradas en endpoints protegidos.

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

---

## 🛠️ Comando Rápido de Ejecución de Pruebas

Para ejecutar la suite automatizada de verificación de seguridad y QA:

```bash
npm test
# Ejecuta el test runner con 57 aserciones de seguridad y RBAC
```
