# 📜 Índice Oficial de Migraciones - Aurenis Database Pipeline

Este documento es el registro de verdad (**Source of Truth**) para el historial ordenado, versionado y reproducible de migraciones de la base de datos PostgreSQL en todos los entornos (**Development**, **Testing**, **Staging**, **Production**).

---

## 🧭 Resumen de Versiones y Estado

| Orden | Versión / Timestamp | Nombre de Migración | Tipo | Impacto | Rollback Script | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | `20260907141816` | `init` | DDL Base | Alto (Creación inicial) | `rollback.sql` ✅ | Aplicada |
| **02** | `20260908180000` | `db_optimizations_and_fixes` | DDL / Optimización | Medio (Relaciones y tipos) | `rollback.sql` ✅ | Aplicada |
| **03** | `20260908190000` | `enterprise_expansion` | DDL / Expansión | Alto (Nuevos módulos) | `rollback.sql` ✅ | Aplicada |

---

## 🔍 Detalle Técnico por Migración

### 1. `20260907141816_init`
- **Archivo SQL**: `prisma/migrations/20260907141816_init/migration.sql`
- **Rollback SQL**: `prisma/migrations/20260907141816_init/rollback.sql`
- **Fecha de Registro**: 2026-09-07
- **Objetivo**: Inicializar el esquema relacional multi-tenant básico.
- **Modelos Creados**:
  - `User`, `School`, `SchoolSettings`, `Role`, `Permission`, `RolePermission`, `SchoolMembership`, `MembershipRole`
  - `TeacherProfile`, `StudentProfile`, `GuardianProfile`, `GuardianStudent`
  - `AcademicYear`, `AcademicPeriod`, `Course`, `Subject`, `Enrollment`
  - `AttendanceRecord`, `Assessment`, `Grade`, `Announcement`, `Observation`, `AuditLog`
- **Enums**: `UserStatus`, `SchoolStatus`, `AttendanceStatus`, `AcademicTermType`, `AuditAction`, `ObservationType`, `AnnouncementAudience`
- **Riesgo de Rollback**: 🔴 Crítico (Eliminación completa del esquema inicial).

---

### 2. `20260908180000_db_optimizations_and_fixes`
- **Archivo SQL**: `prisma/migrations/20260908180000_db_optimizations_and_fixes/migration.sql`
- **Rollback SQL**: `prisma/migrations/20260908180000_db_optimizations_and_fixes/rollback.sql`
- **Fecha de Registro**: 2026-09-08
- **Objetivo**: Optimizar aislamiento multi-tenant por colegio y soportar soft-deletes en restricciones únicas.
- **Cambios Principales**:
  - Relación directa `schoolId` en `TeacherProfile`, `StudentProfile`, `GuardianProfile`.
  - Precisión monetaria/académica `DECIMAL(5,2)` en notas y configuraciones escolares.
  - Conversión de índices únicos estándar a **Partial Unique Indexes** (`WHERE "deletedAt" IS NULL`) en `User(email)`, `User(rutOrNationalId)`, `School(slug)`, `School(institutionalCode)` y `Enrollment`.
- **Riesgo de Rollback**: 🟡 Medio (Requiere validar que no existan duplicados antes de recrear índices globales).

---

### 3. `20260908190000_enterprise_expansion`
- **Archivo SQL**: `prisma/migrations/20260908190000_enterprise_expansion/migration.sql`
- **Rollback SQL**: `prisma/migrations/20260908190000_enterprise_expansion/rollback.sql`
- **Fecha de Registro**: 2026-09-08
- **Objetivo**: Incorporar módulos empresariales avanzados de gestión educativa y arquitectura de datos.
- **Modelos Creados**:
  - Infraestructura y Aulas: `Classroom`, `SubjectTeacher`
  - Auditoría y Calificaciones: `GradeAuditLog`
  - Asistencia y Justificaciones: `AttendanceJustification`, `StudentAttendanceSummary`
  - Tareas y Entregas: `Assignment`, `AssignmentSubmission`
  - Comunicación: `ParentTeacherMeeting`, `AnnouncementRecipient`, `Notification`
  - Finanzas Escolares: `StudentPaymentAccount`, `PaymentRecord`
  - Infraestructura de Datos: `ArchivedRecord`, `Webhook`, `WebhookDelivery`, `PartitionMetadata`, `ReplicaLagMetrics`, `PerformanceMetric`
- **Campos Agregados**: `deletedAt` (Soft deletes) y `version` (Optimistic locking) en entidades clave.
- **Riesgo de Rollback**: 🟡 Reversible mediante `rollback.sql` modular.

---

## 🔒 Reglas de Oro para el Versionado en Git

1. **Inmutabilidad**: Nunca modifiques un archivo `migration.sql` que ya haya sido mergeado a la rama `main` o desplegado en Staging/Producción.
2. **Siempre con Rollback**: Toda nueva carpeta de migración generada debe incluir su script complementario `rollback.sql`.
3. **Bloqueo `migration_lock.toml`**: Este archivo es obligatorio en el repositorio para garantizar el motor de base de datos (`provider = "postgresql"`).
4. **Validación CI**: Ningún Pull Request debe integrarse sin pasar el script `npm run db:migrate:validate`.
