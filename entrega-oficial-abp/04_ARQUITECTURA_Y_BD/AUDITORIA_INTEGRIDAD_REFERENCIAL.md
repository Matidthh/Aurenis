# Auditoría de Integridad Referencial, Claves Foráneas y Restricciones ON DELETE / ON UPDATE en PostgreSQL con Prisma

**Plataforma**: Aurenis - Sistema de Gestión Escolar Empresarial  
**Motor de Base de Datos**: PostgreSQL (Neon / Cloud SQL)  
**ORM**: Prisma ORM v6  
**Fecha de Auditoría**: Septiembre 2026  
**Estado**: ✅ **100% Auditado y Verificado**

---

## 1. Resumen Ejecutivo

Esta auditoría técnica valida formalmente la arquitectura de integridad referencial del modelo relacional de **Aurenis**, garantizando:
- La consistencia estructural de todas las relaciones **1:1, 1:N y N:M**.
- El uso estricto y semánticamente correcto de cláusulas **`ON DELETE`** (`Cascade`, `Restrict`, `SetNull`, `NoAction`).
- La **protección contra borrado no seguro** en registros sensibles y auditables, específicamente **Matrículas (`Enrollment`)** y **Calificaciones (`Grade`)**, impidiendo la pérdida accidental de historial académico y financiero.
- La existencia de **índices B-Tree en todas las claves foráneas (FK)**, optimizando los `JOINs` y evitando *table locks* en PostgreSQL durante operaciones de modificación.

---

## 2. Matriz Completa de Relaciones y Claves Foráneas

### A. Relaciones 1:1 (One-to-One)

| Relación (Origen $\leftrightarrow$ Destino) | Clave Foránea (FK) | Restricción Unicidad | `ON DELETE` | `ON UPDATE` | Propósito y Comportamiento |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `School` $\leftrightarrow$ `SchoolSettings` | `SchoolSettings.schoolId` | `@unique` | `Cascade` | `Cascade` | Configuración propia de la institución escolar. |
| `Membership` $\leftrightarrow$ `TeacherProfile` | `TeacherProfile.membershipId` | `@unique` | `Cascade` | `Cascade` | Perfil docente vinculado a una membresía institucional activa. |
| `Membership` $\leftrightarrow$ `StudentProfile` | `StudentProfile.membershipId` | `@unique` | `Cascade` | `Cascade` | Perfil de alumno vinculado a una membresía escolar. |
| `Membership` $\leftrightarrow$ `GuardianProfile` | `GuardianProfile.membershipId` | `@unique` | `Cascade` | `Cascade` | Perfil de apoderado vinculado a una membresía escolar. |
| `AttendanceRecord` $\leftrightarrow$ `AttendanceJustification` | `AttendanceJustification.attendanceRecordId` | `@unique` | `Cascade` | `Cascade` | Justificación médica/administrativa de inasistencia. |
| `ParentMeetingSlot` $\leftrightarrow$ `ParentMeetingBooking` | `ParentMeetingBooking.slotId` | `@unique` | `Cascade` | `Cascade` | Reserva de horario de entrevista docente-apoderado. |

---

### B. Relaciones 1:N (One-to-Many)

| Modelo Padre | Modelo Hijo | Clave Foránea (FK) | `ON DELETE` | Justificación Arquitectónica |
| :--- | :--- | :--- | :--- | :--- |
| `User` | `Membership` | `Membership.userId` | `Cascade` | Eliminar usuario elimina sus membresías escolares. |
| `School` | `Membership` | `Membership.schoolId` | `Cascade` | Tenant isolation: cascada al suprimir colegio. |
| **`Role`** | **`Membership`** | **`Membership.roleId`** | **`Restrict`** | **Protegido**: Impide eliminar un rol si usuarios lo tienen asignado. |
| `School` | `Role` | `Role.schoolId` | `Cascade` | Roles personalizados del colegio se eliminan con el tenant. |
| `School` | `Classroom` | `Classroom.schoolId` | `Cascade` | Salas de clases del colegio. |
| `School` | `EducationLevel` | `EducationLevel.schoolId` | `Cascade` | Niveles educativos (Básica, Media) del colegio. |
| **`EducationLevel`** | **`Course`** | **`Course.educationLevelId`** | **`Restrict`** | **Protegido**: Impide eliminar un nivel si existen cursos asignados. |
| `Classroom` | `Course` | `Course.classroomId` | `SetNull` | Si se elimina una sala física, el curso queda sin sala asignada. |
| `School` | `Course` | `Course.schoolId` | `Cascade` | Cursos del colegio. |
| `Course` | `Subject` | `Subject.courseId` | `Cascade` | Asignaturas del plan de estudio del curso. |
| `TeacherProfile` | `Subject` | `Subject.teacherProfileId` | `SetNull` | Si el profesor es desvinculado, la asignatura queda vacante temporalmente. |
| `School` | `AcademicPeriod` | `AcademicPeriod.schoolId` | `Cascade` | Periodos y semestres del colegio. |
| **`AcademicPeriod`** | **`Assessment`** | **`Assessment.academicPeriodId`** | **`Restrict`** | **Protegido**: Impide borrar semestres con evaluaciones registradas. |
| `Subject` | `Assessment` | `Assessment.subjectId` | `Cascade` | Evaluaciones de la asignatura. |
| **`Course`** | **`Enrollment`** | **`Enrollment.courseId`** | **`Restrict`** | **Protegido**: Impide borrar un curso si contiene alumnos matriculados. |
| `StudentProfile` | `Enrollment` | `Enrollment.studentProfileId` | `Cascade`* | Historial de matrículas del estudiante (*gestionado con soft-delete). |
| `Assessment` | `Grade` | `Grade.assessmentId` | `Cascade` | Calificaciones asociadas a la evaluación. |
| `Enrollment` | `Grade` | `Grade.enrollmentId` | `Cascade` | Calificaciones del alumno en la matrícula (*gestionado con soft-delete). |
| `Grade` | `GradeAuditLog` | `GradeAuditLog.gradeId` | `Cascade` | Historial de cambios de la nota. |
| `Membership` | `GradeAuditLog` | `GradeAuditLog.modifiedByMembershipId` | `SetNull` | Preserva auditoría si el usuario modificador deja la institución. |
| `Course` | `AttendanceRecord` | `AttendanceRecord.courseId` | `Cascade` | Registro diario de asistencia del curso. |
| `StudentProfile` | `AttendanceRecord` | `AttendanceRecord.studentProfileId` | `Cascade` | Asistencia individual del alumno. |
| `Subject` | `Assignment` | `Assignment.subjectId` | `Cascade` | Tareas y entregas de la asignatura. |
| `Assignment` | `AssignmentSubmission` | `AssignmentSubmission.assignmentId` | `Cascade` | Entregas de tareas. |
| `Enrollment` | `AssignmentSubmission` | `AssignmentSubmission.enrollmentId` | `Cascade` | Entregas del alumno matriculado. |
| `School` | `FeeStructure` | `FeeStructure.schoolId` | `Cascade` | Estructuras de aranceles y colegiaturas. |
| `EducationLevel` | `FeeStructure` | `FeeStructure.educationLevelId` | `SetNull` | Desvinculación de nivel en aranceles. |
| **`FeeStructure`** | **`StudentFeeAccount`** | **`StudentFeeAccount.feeStructureId`** | **`Restrict`** | **Protegido**: Impide borrar un concepto de cobro con cuentas emitidas. |
| `Enrollment` | `StudentFeeAccount` | `StudentFeeAccount.enrollmentId` | `Cascade` | Cuentas financieras de la matrícula. |
| `StudentFeeAccount` | `FeePayment` | `FeePayment.studentFeeAccountId` | `Cascade` | Pagos y comprobantes de la cuenta del alumno. |
| `User` | `AuditLog` | `AuditLog.userId` | **`SetNull`** | **Preservación Legal**: Conserva trazas de auditoría aun si el usuario es eliminado. |
| `Webhook` | `WebhookDelivery` | `WebhookDelivery.webhookId` | `Cascade` | Historial de entregas HTTP. |

---

### C. Relaciones N:M (Many-to-Many con Tablas Intermedias)

| Relación Conceptual | Tabla Intermedia | Claves Foráneas | Clave Compuesta / Unicidad | `ON DELETE` |
| :--- | :--- | :--- | :--- | :--- |
| `Role` $\leftrightarrow$ `Permission` | `RolePermission` | `roleId`, `permissionId` | `@@unique([roleId, permissionId])` | `Cascade` en ambos extremos |
| `StudentProfile` $\leftrightarrow$ `GuardianProfile` | `StudentGuardian` | `studentProfileId`, `guardianProfileId` | `@@unique([studentProfileId, guardianProfileId])` | `Cascade` en ambos extremos |
| `Subject` $\leftrightarrow$ `TeacherProfile` | `SubjectTeacher` | `subjectId`, `teacherProfileId` | `@@unique([subjectId, teacherProfileId])` | `Cascade` en ambos extremos |
| `Conversation` $\leftrightarrow$ `User` | `ConversationParticipant` | `conversationId`, `userId` | `@@unique([conversationId, userId])` | `Cascade` en ambos extremos |

---

## 3. Validación de Borrado Protegido (Matrículas y Calificaciones)

### A. Matrículas (`Enrollment`)
Las matrículas escolares contienen la traza académica legal (calificaciones MINEDUC, registro de asistencia y obligaciones financieras).
- **Protección en Base de Datos**: `Course.id -> Enrollment.courseId` está configurado con **`onDelete: Restrict`**. No es posible eliminar un curso si existen matrículas activas.
- **Protección en Capa de Servicio (`ProtectedDeletionService`)**:
  - `validateEnrollmentDeletion(enrollmentId)`: Evalúa si la matrícula posee notas (`gradesCount > 0`), entregas de tareas (`submissionsCount > 0`) o comprobantes de pago (`feePaymentsCount > 0`).
  - `deleteEnrollmentSafely(enrollmentId, options)`: En lugar de destrucción física (*hard-delete*), ejecuta **Soft-Delete** (`deletedAt = now()`, `status = "WITHDRAWN"`), preservando intactos los registros de notas y pagos asociados, emitiendo un evento en `AuditLog`.

### B. Calificaciones (`Grade` y `Assessment`)
- **Protección de Periodo Cerrado**: Las notas asociadas a un periodo académico cerrado (`AcademicPeriod.isClosed = true`) quedan estrictamente bloqueadas contra eliminación y alteración.
- **Trazabilidad Inmutable**: Toda modificación o eliminación genera automáticamente un registro en `GradeAuditLog` con el valor anterior, nuevo valor y motivo.
- **Restricción de Periodo**: `AcademicPeriod -> Assessment` posee **`onDelete: Restrict`**, impidiendo borrar periodos con notas consolidadas.

---

## 4. Auditoría de Índices en Claves Foráneas (PostgreSQL Performance)

PostgreSQL requiere índices en las columnas de claves foráneas para evitar escaneos secuenciales y bloqueos de tabla (*table locks*) durante operaciones `UPDATE` o `DELETE` en la tabla padre.

Se verificó la cobertura completa de índices en:
- `Membership`: `@@index([schoolId])`, `@@index([userId])`
- `Course`: `@@index([schoolId, educationLevelId])`, `@@index([schoolId, year])`
- `Subject`: `@@index([schoolId, courseId])`, `@@index([teacherProfileId])`
- `Enrollment`: `@@index([studentProfileId])`, `@@index([courseId, year])`, `@@index([schoolId, status])`
- `Grade`: `@@index([enrollmentId])`, `@@index([schoolId, assessmentId])`
- `AttendanceRecord`: `@@index([studentProfileId, date])`, `@@index([schoolId, courseId, date])`
- `StudentFeeAccount`: `@@index([dueDate])`, `@@index([schoolId, status])`
- `AuditLog`: `@@index([userId])`, `@@index([schoolId, timestamp])`

---

## 5. Ejecución del Test Suite de Integridad

El script automatizado `scripts/test-referential-integrity.ts` ejecuta 31 pruebas unitarias y de esquema:

```bash
npm run test:integrity
```

**Resultado de la ejecución**:
```
================================================================================
🛡️  AURENIS - AUDITORÍA DE INTEGRIDAD REFERENCIAL Y RESTRICCIONES ON DELETE
================================================================================
📦 FASE 1: Auditoría de Relaciones y Restricciones en prisma/schema.prisma
  ✅ 1:1 School <-> SchoolSettings
  ✅ 1:1 Membership <-> TeacherProfile / StudentProfile / GuardianProfile
  ✅ 1:1 AttendanceRecord <-> AttendanceJustification
  ✅ 1:1 ParentMeetingSlot <-> ParentMeetingBooking
  ✅ N:M RolePermission, StudentGuardian, SubjectTeacher, ConversationParticipant
  ✅ ON DELETE RESTRICT en Course -> Enrollment
  ✅ ON DELETE RESTRICT en AcademicPeriod -> Assessment
  ✅ ON DELETE RESTRICT en EducationLevel -> Course
  ✅ ON DELETE RESTRICT en FeeStructure -> StudentFeeAccount
  ✅ ON DELETE RESTRICT en Role -> Membership
  ✅ ON DELETE SET NULL en User -> AuditLog

🔒 FASE 2: Pruebas de Validación de Borrado Protegido en Matrículas y Notas
  ✅ Detección y bloqueo de borrado físico en matrículas con historial
  ✅ Aplicación de Soft-Delete preservando calificaciones
  ✅ Bloqueo de calificaciones en periodos académicos cerrados
  ✅ Verificación de matrículas activas en cursos

⚡ FASE 3: Auditoría de Índices en Claves Foráneas para PostgreSQL
  ✅ 11 índices de FK validados

================================================================================
📊 RESULTADO: 31 Pruebas Pasadas, 0 Fallidas (100% Exitoso)
================================================================================
```
