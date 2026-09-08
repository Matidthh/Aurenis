# Diagrama Entidad-Relación y Diccionario de Datos - Aurenis

## 📊 Diagrama Entidad-Relación (ER)

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     User        │       │     School      │       │    Membership   │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │◄──────│ id (PK)         │◄──────│ id (PK)         │
│ email (UNIQUE)  │       │ slug (UNIQUE)   │       │ userId (FK)     │
│ passwordHash    │       │ name            │       │ schoolId (FK)   │
│ firstName       │       │ institutionalCode│     │ roleId (FK)     │
│ lastName        │       │ status          │       │ isActive        │
│ rutOrNationalId │       │ deletedAt       │       │                │
│ status          │       │ version         │       └─────────────────┘
│ isSystemAdmin   │       └─────────────────┘               │
│ deletedAt       │                    │                    │
│ version         │                    │                    ▼
└─────────────────┘                    │         ┌─────────────────┐
         │                            │         │      Role       │
         │                            │         ├─────────────────┤
         │                            │         │ id (PK)         │
         │                            │         │ schoolId (FK)   │
         │                            │         │ name (UNIQUE)   │
         │                            │         │ displayName     │
         │                            │         │ isSystem        │
         │                            │         └─────────────────┘
         │                            │                    │
         │                            │                    │
         │                            │                    ▼
         │                            │         ┌─────────────────┐
         │                            │         │ RolePermission  │
         │                            │         ├─────────────────┤
         │                            │         │ roleId (FK)     │
         │                            │         │ permissionId(FK)│
         │                            │         └─────────────────┘
         │                            │                    │
         │                            │                    ▼
         │                            │         ┌─────────────────┐
         │                            │         │   Permission    │
         │                            │         ├─────────────────┤
         │                            │         │ id (PK)         │
         │                            │         │ code (UNIQUE)   │
         │                            │         │ module          │
         │                            │         │ description     │
         │                            │         └─────────────────┘
         │                            │
         │                            │
         ▼                            ▼
┌─────────────────┐       ┌─────────────────┐
│   AuditLog      │       │ SchoolSettings  │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ schoolId (FK)   │       │ schoolId (FK)   │
│ userId (FK)     │       │ termType        │
│ action          │       │ minPassingGrade │
│ entityType      │       │ minGrade        │
│ entityId        │       │ maxGrade        │
│ details         │       │ gradeScalePrecision│
│ timestamp       │       │ primaryColor    │
└─────────────────┘       └─────────────────┘

┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ TeacherProfile  │       │ StudentProfile  │       │ GuardianProfile │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ membershipId(FK)│       │ membershipId(FK)│       │ membershipId(FK)│
│ specialty       │       │ enrollmentNumber│       │ occupation      │
└─────────────────┘       │ birthDate       │       └─────────────────┘
         │                │ medicalNotes    │
         │                └─────────────────┘
         │                         │
         │                         │
         │                         ▼
         │                ┌─────────────────┐
         │                │ StudentGuardian │
         │                ├─────────────────┤
         │                │ id (PK)         │
         │                │ studentProfileId(FK)│
         │                │ guardianProfileId(FK)│
         │                │ relationship    │
         │                │ isEmergencyContact│
         │                └─────────────────┘
         │
         ▼
┌─────────────────┐
│    Subject      │
├─────────────────┤
│ id (PK)         │
│ schoolId (FK)   │
│ courseId (FK)   │
│ teacherProfileId(FK)│
│ name            │
│ code            │
│ hoursPerWeek    │
└─────────────────┘
         │
         │
         ▼
┌─────────────────┐       ┌─────────────────┐
│   Assessment    │       │      Grade      │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ schoolId (FK)   │       │ schoolId (FK)   │
│ subjectId (FK)  │       │ assessmentId(FK)│
│ academicPeriodId(FK)│   │ enrollmentId(FK)│
│ title           │       │ value           │
│ description     │       │ feedback        │
│ date            │       └─────────────────┘
│ weightPercentage│
│ isPublished     │
└─────────────────┘

┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    Course       │       │   Enrollment    │       │AttendanceRecord │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ schoolId (FK)   │       │ schoolId (FK)   │       │ schoolId (FK)   │
│ educationLevelId(FK)│   │ courseId (FK)   │       │ courseId (FK)   │
│ name            │       │ studentProfileId(FK)│  │ studentProfileId(FK)│
│ letter          │       │ year            │       │ date            │
│ gradeNumber     │       │ status          │       │ status          │
│ year            │       │ deletedAt       │       │ justification   │
└─────────────────┘       │ version         │       └─────────────────┘
         │                └─────────────────┘
         │
         ▼
┌─────────────────┐
│ EducationLevel  │
├─────────────────┤
│ id (PK)         │
│ schoolId (FK)   │
│ name            │
│ shortCode       │
│ orderIndex      │
└─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│ AcademicPeriod  │       │ ScheduleBlock   │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ schoolId (FK)   │       │ schoolId (FK)   │
│ name            │       │ courseId (FK)   │
│ year            │       │ subjectId (FK)  │
│ startDate       │       │ dayOfWeek       │
│ endDate         │       │ startTime       │
│ isCurrent       │       │ endTime         │
│ isClosed        │       │ classroom       │
└─────────────────┘       └─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│StudentObservation│      │ InstitutionAnnouncement│
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ schoolId (FK)   │       │ schoolId (FK)   │
│ studentProfileId(FK)│   │ authorUserId(FK)│
│ authorMembershipId(FK)│ │ title           │
│ type            │       │ content         │
│ title           │       │ targetAudience  │
│ content         │       │ isPinned        │
│ date            │       │ publishDate     │
└─────────────────┘       └─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│   Webhook       │       │WebhookDelivery  │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ tenantId        │       │ webhookId (FK)  │
│ url             │       │ eventId         │
│ events          │       │ eventType       │
│ secret          │       │ payload         │
│ headers         │       │ success         │
│ active          │       │ statusCode      │
└─────────────────┘       └─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│ ArchivedRecord  │       │   FileRecord    │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ modelName       │       │ schoolId (FK)   │
│ originalId      │       │ fileName        │
│ data            │       │ fileUrl         │
│ archivedAt      │       │ fileSize        │
│ retentionUntil  │       │ mimeType        │
│ compressed      │       │ purpose         │
└─────────────────┘       └─────────────────┘
```

## 📚 Diccionario de Datos

### 1. Identidad y Usuarios

#### User
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String (CUID) | Identificador único del usuario | PK |
| email | String | Correo electrónico del usuario | UNIQUE |
| passwordHash | String | Hash de la contraseña | Required |
| firstName | String | Primer nombre | Required |
| lastName | String | Apellido | Required |
| rutOrNationalId | String | RUT o identificación nacional | UNIQUE, Optional |
| avatarUrl | String | URL del avatar | Optional |
| phone | String | Teléfono de contacto | Optional |
| status | UserStatus | Estado del usuario (ACTIVE, SUSPENDED, PENDING_PASSWORD_RESET) | Default: ACTIVE |
| isSystemAdmin | Boolean | Indica si es administrador del sistema | Default: false |
| deletedAt | DateTime | Fecha de eliminación suave | Optional (Soft delete) |
| version | Int | Versión para optimistic locking | Default: 1 |
| searchableText | String | Campo generado para búsqueda de texto completo | Optional |
| createdAt | DateTime | Fecha de creación | Auto |
| updatedAt | DateTime | Fecha de última actualización | Auto |

#### School
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String (CUID) | Identificador único del colegio | PK |
| slug | String | Slug URL único | UNIQUE |
| name | String | Nombre del colegio | Required |
| institutionalCode | String | Código institucional | UNIQUE, Optional |
| logoUrl | String | URL del logo | Optional |
| address | String | Dirección física | Optional |
| city | String | Ciudad | Optional |
| country | String | País | Default: "Chile" |
| timezone | String | Zona horaria | Default: "America/Santiago" |
| status | SchoolStatus | Estado del colegio (ACTIVE, INACTIVE, TRIAL, SUSPENDED) | Default: ACTIVE |
| deletedAt | DateTime | Fecha de eliminación suave | Optional (Soft delete) |
| version | Int | Versión para optimistic locking | Default: 1 |
| createdAt | DateTime | Fecha de creación | Auto |
| updatedAt | DateTime | Fecha de última actualización | Auto |

#### Membership
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String (CUID) | Identificador único de la membresía | PK |
| userId | String | ID del usuario | FK (User), UNIQUE constraint with schoolId |
| schoolId | String | ID del colegio | FK (School), UNIQUE constraint with userId |
| roleId | String | ID del rol | FK (Role) |
| isActive | Boolean | Indica si la membresía está activa | Default: true |
| createdAt | DateTime | Fecha de creación | Auto |
| updatedAt | DateTime | Fecha de última actualización | Auto |

#### Role
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String (CUID) | Identificador único del rol | PK |
| schoolId | String | ID del colegio (null para roles globales) | FK (School), Optional |
| name | String | Nombre del rol (ej: SCHOOL_ADMIN, TEACHER) | UNIQUE with schoolId |
| displayName | String | Nombre para mostrar | Required |
| description | String | Descripción del rol | Optional |
| isSystem | Boolean | Indica si es rol del sistema | Default: false |
| createdAt | DateTime | Fecha de creación | Auto |
| updatedAt | DateTime | Fecha de última actualización | Auto |

#### Permission
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String (CUID) | Identificador único del permiso | PK |
| code | String | Código del permiso (ej: grades:enter) | UNIQUE |
| module | String | Módulo al que pertenece (ACADEMIC, STUDENTS, etc.) | Required |
| description | String | Descripción del permiso | Required |
| createdAt | DateTime | Fecha de creación | Auto |

#### RolePermission
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String (CUID) | Identificador único | PK |
| roleId | String | ID del rol | FK (Role), UNIQUE with permissionId |
| permissionId | String | ID del permiso | FK (Permission), UNIQUE with roleId |

### 2. Configuración Institucional

#### SchoolSettings
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String (CUID) | Identificador único | PK |
| schoolId | String | ID del colegio | FK (School), UNIQUE |
| termType | AcademicTermType | Tipo de periodo académico (SEMESTER, TRIMESTER, BIMESTER, ANNUAL) | Default: SEMESTER |
| minPassingGrade | Decimal | Nota mínima de aprobación | Default: 4.0 |
| minGrade | Decimal | Nota mínima posible | Default: 1.0 |
| maxGrade | Decimal | Nota máxima posible | Default: 7.0 |
| gradeScalePrecision | Int | Precisión de la escala de notas | Default: 1 |
| primaryColor | String | Color primario del tema | Default: "#0c8ee9" |
| requireAttendanceNote | Boolean | Requiere nota de asistencia | Default: false |
| customConfig | Json | Configuración personalizada | Optional |
| createdAt | DateTime | Fecha de creación | Auto |
| updatedAt | DateTime | Fecha de última actualización | Auto |

#### AcademicPeriod
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String (CUID) | Identificador único | PK |
| schoolId | String | ID del colegio | FK (School) |
| name | String | Nombre del periodo (ej: "Primer Semestre 2026") | Required |
| year | Int | Año académico | Required |
| startDate | DateTime | Fecha de inicio | Required |
| endDate | DateTime | Fecha de fin | Required |
| isCurrent | Boolean | Indica si es el periodo actual | Default: false |
| isClosed | Boolean | Indica si está cerrado | Default: false |
| createdAt | DateTime | Fecha de creación | Auto |
| updatedAt | DateTime | Fecha de última actualización | Auto |

#### EducationLevel
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String (CUID) | Identificador único | PK |
| schoolId | String | ID del colegio | FK (School), UNIQUE with name |
| name | String | Nombre del nivel (ej: "Enseñanza Básica") | Required |
| shortCode | String | Código corto (ej: "EB") | Required |
| orderIndex | Int | Orden de visualización | Default: 0 |
| createdAt | DateTime | Fecha de creación | Auto |
| updatedAt | DateTime | Fecha de última actualización | Auto |

### 3. Personas y Perfiles

#### TeacherProfile
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String (CUID) | Identificador único | PK |
| membershipId | String | ID de la membresía | FK (Membership), UNIQUE |
| specialty | String | Especialidad del profesor | Optional |
| createdAt | DateTime | Fecha de creación | Auto |
| updatedAt | DateTime | Fecha de última actualización | Auto |

#### StudentProfile
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String (CUID) | Identificador único | PK |
| membershipId | String | ID de la membresía | FK (Membership), UNIQUE |
| enrollmentNumber | String | Número de matrícula | Optional |
| birthDate | DateTime | Fecha de nacimiento | Optional |
| medicalNotes | String | Notas médicas | Optional |
| createdAt | DateTime | Fecha de creación | Auto |
| updatedAt | DateTime | Fecha de última actualización | Auto |

#### GuardianProfile
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String (CUID) | Identificador único | PK |
| membershipId | String | ID de la membresía | FK (Membership), UNIQUE |
| occupation | String | Ocupación | Optional |
| createdAt | DateTime | Fecha de creación | Auto |
| updatedAt | DateTime | Fecha de última actualización | Auto |

#### StudentGuardian
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String (CUID) | Identificador único | PK |
| studentProfileId | String | ID del perfil del estudiante | FK (StudentProfile), UNIQUE with guardianProfileId |
| guardianProfileId | String | ID del perfil del apoderado | FK (GuardianProfile), UNIQUE with studentProfileId |
| relationship | String | Relación (Padre, Madre, Tutor, etc.) | Required |
| isEmergencyContact | Boolean | Es contacto de emergencia | Default: false |
| canPickUp | Boolean | Puede recoger al estudiante | Default: true |

### 4. Académico

#### Course
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String (CUID) | Identificador único | PK |
| schoolId | String | ID del colegio | FK (School) |
| educationLevelId | String | ID del nivel educativo | FK (EducationLevel) |
| name | String | Nombre del curso (ej: "1° Medio A") | Required |
| letter | String | Letra del curso | Optional |
| gradeNumber | Int | Número de grado | Required |
| year | Int | Año del curso | Required |
| createdAt | DateTime | Fecha de creación | Auto |
| updatedAt | DateTime | Fecha de última actualización | Auto |

#### Subject
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String (CUID) | Identificador único | PK |
| schoolId | String | ID del colegio | FK (School) |
| courseId | String | ID del curso | FK (Course) |
| teacherProfileId | String | ID del perfil del profesor | FK (TeacherProfile), Optional |
| name | String | Nombre de la asignatura (ej: "Matemáticas") | Required |
| code | String | Código de la asignatura | Optional |
| hoursPerWeek | Int | Horas semanales | Default: 4 |
| createdAt | DateTime | Fecha de creación | Auto |
| updatedAt | DateTime | Fecha de última actualización | Auto |

#### Enrollment
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String (CUID) | Identificador único | PK |
| schoolId | String | ID del colegio | FK (School) |
| courseId | String | ID del curso | FK (Course) |
| studentProfileId | String | ID del perfil del estudiante | FK (StudentProfile) |
| year | Int | Año de matrícula | Required |
| status | String | Estado de la matrícula | Default: "ACTIVE" |
| deletedAt | DateTime | Fecha de eliminación suave | Optional (Soft delete) |
| version | Int | Versión para optimistic locking | Default: 1 |
| createdAt | DateTime | Fecha de creación | Auto |
| updatedAt | DateTime | Fecha de última actualización | Auto |

#### Assessment
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String (CUID) | Identificador único | PK |
| schoolId | String | ID del colegio | FK (School) |
| subjectId | String | ID de la asignatura | FK (Subject) |
| academicPeriodId | String | ID del periodo académico | FK (AcademicPeriod) |
| title | String | Título de la evaluación | Required |
| description | String | Descripción | Optional |
| date | DateTime | Fecha de la evaluación | Required |
| weightPercentage | Decimal | Porcentaje de peso | Default: 100.0 |
| isPublished | Boolean | Indica si está publicada | Default: false |
| createdAt | DateTime | Fecha de creación | Auto |
| updatedAt | DateTime | Fecha de última actualización | Auto |

#### Grade
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String (CUID) | Identificador único | PK |
| schoolId | String | ID del colegio | FK (School) |
| assessmentId | String | ID de la evaluación | FK (Assessment), UNIQUE with enrollmentId |
| enrollmentId | String | ID de la matrícula | FK (Enrollment), UNIQUE with assessmentId |
| value | Decimal | Valor de la nota | Required |
| feedback | String | Retroalimentación | Optional |
| createdAt | DateTime | Fecha de creación | Auto |
| updatedAt | DateTime | Fecha de última actualización | Auto |

#### AttendanceRecord
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String (CUID) | Identificador único | PK |
| schoolId | String | ID del colegio | FK (School) |
| courseId | String | ID del curso | FK (Course) |
| studentProfileId | String | ID del perfil del estudiante | FK (StudentProfile) |
| date | DateTime | Fecha de asistencia | Required |
| status | AttendanceStatus | Estado (PRESENT, ABSENT_JUSTIFIED, ABSENT_UNJUSTIFIED, LATE) | Default: PRESENT |
| justification | String | Justificación | Optional |
| createdAt | DateTime | Fecha de creación | Auto |
| updatedAt | DateTime | Fecha de última actualización | Auto |

#### ScheduleBlock
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String (CUID) | Identificador único | PK |
| schoolId | String | ID del colegio | FK (School) |
| courseId | String | ID del curso | FK (Course) |
| subjectId | String | ID de la asignatura | FK (Subject) |
| dayOfWeek | Int | Día de la semana (1 = Lunes ... 5 = Viernes) | Required |
| startTime | String | Hora de inicio (ej: "08:00") | Required |
| endTime | String | Hora de fin (ej: "09:30") | Required |
| classroom | String | Sala de clase | Optional |
| createdAt | DateTime | Fecha de creación | Auto |
| updatedAt | DateTime | Fecha de última actualización | Auto |

### 5. Sistema y Auditoría

#### AuditLog
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String (CUID) | Identificador único | PK |
| schoolId | String | ID del colegio | FK (School), Optional |
| userId | String | ID del usuario | FK (User), Optional |
| action | AuditAction | Acción realizada (CREATE, UPDATE, DELETE, LOGIN, STATUS_CHANGE, SECURITY_EVENT) | Required |
| entityType | String | Tipo de entidad afectada | Required |
| entityId | String | ID de la entidad afectada | Optional |
| details | Json | Detalles adicionales | Optional |
| ipAddress | String | Dirección IP | Optional |
| userAgent | String | User agent del navegador | Optional |
| timestamp | DateTime | Timestamp del evento | Auto |

#### FileRecord
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String (CUID) | Identificador único | PK |
| schoolId | String | ID del colegio | FK (School) |
| fileName | String | Nombre del archivo | Required |
| fileUrl | String | URL del archivo | Required |
| fileSize | Int | Tamaño en bytes | Required |
| mimeType | String | Tipo MIME | Required |
| purpose | String | Propósito del archivo | Required |
| createdAt | DateTime | Fecha de creación | Auto |

### 6. Observaciones y Comunicados

#### StudentObservation
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String (CUID) | Identificador único | PK |
| schoolId | String | ID del colegio | FK (School) |
| studentProfileId | String | ID del perfil del estudiante | FK (StudentProfile) |
| authorMembershipId | String | ID de la membresía del autor | FK (Membership) |
| type | ObservationType | Tipo (POSITIVE, NEGATIVE_MILD, NEGATIVE_GRAVE, INTERVIEW_CITATION) | Required |
| title | String | Título de la observación | Required |
| content | String | Contenido de la observación | Required |
| date | DateTime | Fecha de la observación | Auto |
| requiresGuardianSignature | Boolean | Requiere firma del apoderado | Default: false |
| createdAt | DateTime | Fecha de creación | Auto |
| updatedAt | DateTime | Fecha de última actualización | Auto |

#### InstitutionAnnouncement
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String (CUID) | Identificador único | PK |
| schoolId | String | ID del colegio | FK (School) |
| authorUserId | String | ID del usuario autor | FK (User) |
| title | String | Título del comunicado | Required |
| content | String | Contenido del comunicado | Required |
| targetAudience | AnnouncementAudience | Audiencia objetivo (ALL, TEACHERS_ONLY, GUARDIANS_AND_STUDENTS) | Default: ALL |
| isPinned | Boolean | Indica si está fijado | Default: false |
| publishDate | DateTime | Fecha de publicación | Auto |
| expiryDate | DateTime | Fecha de expiración | Optional |
| createdAt | DateTime | Fecha de creación | Auto |
| updatedAt | DateTime | Fecha de última actualización | Auto |

#### InvitationToken
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String (CUID) | Identificador único | PK |
| schoolId | String | ID del colegio | FK (School) |
| email | String | Email del invitado | Required |
| token | String | Token de invitación | UNIQUE |
| roleId | String | ID del rol asignado | FK (Role) |
| expiresAt | DateTime | Fecha de expiración | Required |
| usedAt | DateTime | Fecha de uso | Optional |
| createdAt | DateTime | Fecha de creación | Auto |

### 7. Webhooks e Integraciones

#### Webhook
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String (CUID) | Identificador único | PK |
| tenantId | String | ID del tenant (colegio) | Required |
| url | String | URL del webhook | Required |
| events | String[] | Eventos suscritos | Required |
| secret | String | Secreto para verificación | Required |
| headers | Json | Headers adicionales | Optional |
| active | Boolean | Indica si está activo | Default: true |
| createdAt | DateTime | Fecha de creación | Auto |
| updatedAt | DateTime | Fecha de última actualización | Auto |

#### WebhookDelivery
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String (CUID) | Identificador único | PK |
| webhookId | String | ID del webhook | FK (Webhook) |
| eventId | String | ID del evento | Required |
| eventType | String | Tipo de evento | Optional |
| payload | Json | Payload enviado | Optional |
| success | Boolean | Indica si fue exitoso | Required |
| statusCode | Int | Código de respuesta HTTP | Optional |
| error | String | Error si falló | Optional |
| deliveredAt | DateTime | Fecha de entrega | Auto |

### 8. Archivado

#### ArchivedRecord
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String (CUID) | Identificador único | PK |
| modelName | String | Nombre del modelo original | Required |
| originalId | String | ID del registro original | Required |
| data | Json | Datos archivados | Required |
| archivedAt | DateTime | Fecha de archivado | Auto |
| retentionUntil | DateTime | Fecha de retención hasta | Required |
| compressed | Boolean | Indica si está comprimido | Default: false |
| dataSize | Int | Tamaño de los datos | Default: 0 |
| createdAt | DateTime | Fecha de creación | Auto |

## 🎯 ENUMS

### UserStatus
- `ACTIVE`: Usuario activo
- `SUSPENDED`: Usuario suspendido
- `PENDING_PASSWORD_RESET`: Pendiente de reset de contraseña

### SchoolStatus
- `ACTIVE`: Colegio activo
- `INACTIVE`: Colegio inactivo
- `TRIAL`: En período de prueba
- `SUSPENDED`: Colegio suspendido

### AttendanceStatus
- `PRESENT`: Presente
- `ABSENT_JUSTIFIED`: Ausencia justificada
- `ABSENT_UNJUSTIFIED`: Ausencia injustificada
- `LATE`: Tarde

### AcademicTermType
- `SEMESTER`: Sistema semestral
- `TRIMESTER`: Sistema trimestral
- `BIMESTER`: Sistema bimestral
- `ANNUAL`: Sistema anual

### AuditAction
- `CREATE`: Creación de registro
- `UPDATE`: Actualización de registro
- `DELETE`: Eliminación de registro
- `LOGIN`: Inicio de sesión
- `STATUS_CHANGE`: Cambio de estado
- `SECURITY_EVENT`: Evento de seguridad

### ObservationType
- `POSITIVE`: Observación positiva
- `NEGATIVE_MILD`: Observación negativa leve
- `NEGATIVE_GRAVE`: Observación negativa grave
- `INTERVIEW_CITATION`: Citación a entrevista

### AnnouncementAudience
- `ALL`: Todos los usuarios
- `TEACHERS_ONLY`: Solo profesores
- `GUARDIANS_AND_STUDENTS`: Apoderados y estudiantes

## 🔑 Índices y Optimizaciones

### Índices Compuestos Principales
- `Membership`: `[userId, schoolId]` (UNIQUE)
- `Role`: `[schoolId, name]` (UNIQUE)
- `RolePermission`: `[roleId, permissionId]` (UNIQUE)
- `EducationLevel`: `[schoolId, name]` (UNIQUE)
- `Course`: `[schoolId, year, name]` (UNIQUE)
- `Enrollment`: `[schoolId, courseId, studentProfileId, year]` (UNIQUE)
- `Grade`: `[assessmentId, enrollmentId]` (UNIQUE)
- `AttendanceRecord`: `[schoolId, courseId, studentProfileId, date]` (UNIQUE)
- `StudentGuardian`: `[studentProfileId, guardianProfileId]` (UNIQUE)

### Índices schoolId (Multi-tenancy)
Todos los modelos relacionados con colegios tienen índices en `schoolId` para optimizar consultas por tenant.

### Índices de Performance
- `User`: `[email]`, `[status]`, `[isSystemAdmin]`, `[deletedAt]`
- `School`: `[slug]`, `[status]`, `[deletedAt]`
- `AcademicPeriod`: `[schoolId, year]`, `[schoolId, isCurrent]`
- `Course`: `[schoolId, year]`, `[schoolId, educationLevelId]`, `[gradeNumber, year]`
- `Subject`: `[schoolId, courseId]`, `[teacherProfileId]`, `[schoolId, code]`
- `Enrollment`: `[schoolId, year]`, `[studentProfileId]`, `[courseId, year]`, `[schoolId, status]`, `[deletedAt]`
- `Assessment`: `[schoolId, subjectId]`, `[academicPeriodId]`
- `Grade`: `[schoolId, assessmentId]`, `[enrollmentId]`, `[schoolId, enrollmentId]`
- `AttendanceRecord`: `[schoolId, courseId, date]`, `[studentProfileId, date]`, `[schoolId, date]`
- `AuditLog`: `[schoolId, timestamp]`, `[schoolId, entityType]`, `[userId]`, `[action]`, `[timestamp]`

## 🛡️ Características de Nivel Empresarial

### Soft Deletes
Modelos con soft delete: `User`, `School`, `Enrollment`
- Campo `deletedAt` opcional
- Índices en `deletedAt` para filtrar registros activos

### Optimistic Locking
Modelos con version control: `User`, `School`, `Enrollment`
- Campo `version` con valor por defecto 1
- Previene conflictos de concurrencia

### Full-Text Search
- Campo `searchableText` en `User` para búsquedas nativas de PostgreSQL

### Referencias de Integridad
- `onDelete: Cascade` para relaciones principales
- `onDelete: Restrict` para relaciones críticas
- `onDelete: SetNull` para relaciones opcionales