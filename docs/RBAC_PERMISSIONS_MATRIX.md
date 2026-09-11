# GUÍA MAESTRA DE CONTROL DE ACCESO (RBAC), PERMISOS CRUD Y MATRIZ DE AUTORIZACIÓN — AURENIS v1.0
**Documento Técnico Oficial y Normativo de Desarrollo, Seguridad y Calidad (QA)**  
**Versión:** 1.0.0  
**Fecha de Publicación:** 10 de Septiembre de 2026  
**Estado:** 🟢 **VIGENTE Y CERTIFICADO PARA PRODUCCIÓN (100% PASS)**  
**Líderes Técnicos Responsables:**  
- **Maicol R** — Backend Lead & Arquitectura Técnica  
- **Frank M** — QA / Testing / Seguridad / Documentación  

---

## 1. Propósito, Marco Normativo y Alcance

Este documento constituye el **manual técnico definitivo y la fuente de verdad canónica** sobre el modelo de Control de Acceso Basado en Roles (**RBAC**), el aislamiento Multi-Tenant y las operaciones **CRUD** (Crear, Leer, Actualizar, Eliminar) dentro del ecosistema **AURENIS**.

### 1.1 Objetivos de este Documento
1. **Para Desarrolladores (Frontend & Backend):** Servir como especificación obligatoria para proteger endpoints HTTP (`app/api/*`), inyectar comprobaciones de permisos en la capa de servicios (`lib/services/*`), restringir consultas ORM con `createTenantPrisma` y gobernar el renderizado condicional en interfaces de usuario.
2. **Para Ingenieros de QA y Seguridad:** Establecer la base formal para diseñar, ejecutar y auditar casos de prueba de autorización (positivos, negativos, escalación de privilegios y ataques de manipulación cruzada IDOR). Documento complementario: [`docs/TESTING_STRATEGY.md`](./TESTING_STRATEGY.md).
3. **Para Dirección de Proyecto y Auditoría:** Garantizar el cumplimiento del principio de menor privilegio (*Principle of Least Privilege*), trazabilidad inmutable de eventos y confidencialidad entre instituciones educativas independientes.

---

## 2. Arquitectura de Seguridad Multi-Tenant y RBAC

La seguridad en AURENIS descansa sobre un modelo de **confianza cero (*Zero-Trust*) implementado en 3 capas desacopladas**:

```
                                  PETICIÓN HTTP ENTRANTE
                                            │
                                            ▼
┌───────────────────────────────────────────────────────────────────────────────────────┐
│ CAPA 1: PERÍMETRO & SESIÓN (middleware.ts)                                            │
│ • Validación de firma criptográfica JWT (Algoritmo HS256 mediante 'jose').            │
│ • Si no hay token válido -> HTTP 401 Unauthorized (JSON estándar en API).             │
│ • Si la ruta es /system/* y el usuario no es SYSTEM_ADMIN -> HTTP 403 Forbidden.     │
│ • Resuelve el contexto escolar (slug / schoolId) y previene accesos huérfanos.        │
└───────────────────────────────────────────┬───────────────────────────────────────────┘
                                            │
                                            ▼
┌───────────────────────────────────────────────────────────────────────────────────────┐
│ CAPA 2: AUTORIZACIÓN GRANULAR RBAC (lib/auth/permissions.ts & lib/services/*)         │
│ • Comprobación de permisos específicos mediante assertPermission() y hasPermission(). │
│ • Evaluación de comodines (*) exclusivos para administración global.                   │
│ • Si el rol no posee el permiso exigido -> Lanza ForbiddenError (HTTP 403).           │
└───────────────────────────────────────────┬───────────────────────────────────────────┘
                                            │
                                            ▼
┌───────────────────────────────────────────────────────────────────────────────────────┐
│ CAPA 3: AISLAMIENTO ORM MULTI-TENANT (lib/db/tenant-extension.ts)                     │
│ • Cliente Scoped creado vía createTenantPrisma(schoolId).                             │
│ • Inyección forzosa automática de 'where: { schoolId }' en todas las lecturas.        │
│ • Bloqueo activo contra Cross-Tenant Tampering (arroja excepción fatal si el payload  │
│   intenta mutar o insertar registros con un schoolId foráneo).                        │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Catálogo Canónico y Perfiles de Roles en AURENIS

La plataforma distingue cinco roles formales agrupados en dos dimensiones de alcance: **Nivel Plataforma** y **Nivel Institución Escolar**.

---

### 3.1 Super Administrador Global (`SYSTEM_ADMIN`)
* **Nivel de Alcance:** Global (Infraestructura de Plataforma).
* **Propósito:** Operadores de sistemas, DevOps y soporte técnico de Aurenis.

#### Lo que PUEDE hacer:
* Acceso exclusivo al portal y rutas `/system/*` y `/api/system/*`.
* Dar de alta nuevas instituciones educativas mediante el proceso atómico de onboarding (`createSchoolWithOnboarding`).
* Supervisar la telemetría global del sistema: total de colegios, usuarios, membresías activas y estado de servidores.
* Posee el permiso comodín `*`, lo que le permite validar favorablemente ante cualquier verificación de permisos en la plataforma.
* Gestionar parámetros globales de infraestructura y soporte técnico a directores.

#### Lo que NO PUEDE hacer:
* **No debe** alterar calificaciones, notas o asistencias directas de alumnos sin una solicitud de soporte auditada institucionalmente.
* **No debe** realizar operaciones fuera de la bitácora de auditoría global.

---

### 3.2 Administrador del Colegio / Director (`SCHOOL_ADMIN`)
* **Nivel de Alcance:** Institucional (Acotado estrictamente a su `schoolId`).
* **Propósito:** Directores de colegios, coordinadores académicos (UTP) y administradores de la institución.

#### Lo que PUEDE hacer:
* **Configuración del Colegio:** Visualizar y modificar los parámetros institucionales (`school:settings:view`, `school:settings:update`), incluyendo escalas de calificación (nota mínima, máxima, de aprobación y precisión decimal), régimen académico (semestral/trimestral) y colores institucionales.
* **Gestión Académica:** Crear y administrar periodos lectivos (`academic:periods:manage`), niveles educativos, cursos, asignaturas y bloques horarios (`academic:schedule:manage`).
* **Gestión de Personas:** 
  * Dar de alta, editar y suspender profesores (`people:teachers:manage`).
  * Asignar docentes a asignaturas específicas (`academic:subjects:manage`).
  * Matricular alumnos (`people:enrollment:manage`), registrar y actualizar fichas de estudiantes (`people:students:manage`).
  * Vincular y gestionar apoderados/tutores legales (`people:guardians:manage`).
* **Calificaciones y Evaluaciones:** Consultar todas las notas del colegio (`grades:view`), crear o modificar evaluaciones institucionales (`grades:enter`, `grades:modify`), y ejecutar el **cierre y publicación oficial de actas** (`grades:publish`).
* **Asistencia:** Consultar reportes consolidados de asistencia (`attendance:view`), ingresar o rectificar registros (`attendance:record`) e ingresar justificaciones formales médicas/administrativas (`attendance:justify`).
* **Seguridad y Auditoría Escolar:** Administrar roles y permisos locales (`school:roles:manage`) y consultar la bitácora de auditoría inmutable del colegio (`school:audit:view`).

#### Lo que NO PUEDE hacer:
* ⛔ **Tajantemente Denegado:** Acceder al panel global de infraestructura `/system/*` ni consumir `/api/system/*` (retorna HTTP 403 Forbidden).
* ⛔ **Tajantemente Denegado:** Consultar o modificar información, cursos, docentes o alumnos pertenecientes a otro colegio (garantizado por `createTenantPrisma`).

---

### 3.3 Docente / Profesor (`TEACHER`)
* **Nivel de Alcance:** Tenant Escolar, restringido a sus asignaturas y cursos asignados.
* **Propósito:** Profesores titulares, docentes de asignatura y jefes de curso.

#### Lo que PUEDE hacer:
* **Evaluaciones y Calificaciones:**
  * Crear instrumentos de evaluación (pruebas, talleres, tareas, controles) en las asignaturas donde esté formalmente asignado como docente (`grades:enter`).
  * Ingresar y modificar calificaciones numéricas de los alumnos de sus cursos durante el período escolar activo (`grades:modify`).
  * Consultar planillas de notas de sus asignaturas (`grades:view`).
* **Control de Asistencia:**
  * Tomar y registrar la asistencia diaria o por bloque horario de los estudiantes de sus cursos asignados (`attendance:record`).
  * Consultar el historial de asistencia de sus asignaturas (`attendance:view`).
* **Información Académica:**
  * Consultar la nómina y fichas académicas básicas de los estudiantes que integran sus cursos.
  * Consultar su carga horaria semanal y calendario de asignaturas.

#### Lo que NO PUEDE hacer:
* ⛔ **Tajantemente Denegado:** Modificar la configuración institucional, escalas numéricas de evaluación o régimen del colegio (`school:settings:update` -> `ForbiddenError`).
* ⛔ **Tajantemente Denegado:** Crear, editar o eliminar roles y permisos escolares (`school:roles:manage` -> `ForbiddenError`).
* ⛔ **Tajantemente Denegado:** Crear nuevos cursos, asignaturas o matricular nuevos estudiantes en el sistema.
* ⛔ **Tajantemente Denegado:** Ingresar o modificar calificaciones en asignaturas donde no esté asignado.
* ⛔ **Tajantemente Denegado:** Modificar calificaciones de periodos académicos que ya han sido cerrados oficialmente por el Administrador.
* ⛔ **Tajantemente Denegado:** Publicar y cerrar actas finales oficiales (`grades:publish`).
* ⛔ **Tajantemente Denegado:** Consultar la bitácora de auditoría del colegio (`school:audit:view`).

---

### 3.4 Alumno / Estudiante (`STUDENT`)
* **Nivel de Alcance:** Personal (Estrictamente acotado a su propio registro de matrícula).
* **Propósito:** Estudiantes activos matriculados en la institución.

#### Lo que PUEDE hacer (Modo Solo Lectura Personal):
* **Ficha Personal:** Consultar sus datos personales, curso asignado y antecedentes de matrícula.
* **Calificaciones:** Consultar en tiempo real sus notas obtenidas en evaluaciones publicadas, promedios parciales y finales (`grades:view`).
* **Asistencia:** Consultar su porcentaje global de asistencia, detalle de días presentes, atrasos y ausencias justificadas (`attendance:view`).
* **Horarios:** Visualizar el horario de clases semanal de su curso y los profesores titulares de cada materia.

#### Lo que NO PUEDE hacer:
* ⛔ **Tajantemente Denegado:** Ingresar, modificar o alterar cualquier calificación (intento arroja `ForbiddenError`).
* ⛔ **Tajantemente Denegado:** Registrar o manipular la asistencia propia o de sus compañeros (intento arroja `ForbiddenError`).
* ⛔ **Tajantemente Denegado:** Ver calificaciones, asistencias o fichas de otros estudiantes del curso.
* ⛔ **Tajantemente Denegado:** Acceder a cualquier configuración, auditoría o módulo de administración.

---

### 3.5 Apoderado / Tutor Legal (`GUARDIAN`)
* **Nivel de Alcance:** Familiar (Acotado exclusivamente a los estudiantes vinculados mediante `StudentGuardian`).
* **Propósito:** Padres, madres o tutores legales responsables de los educandos.

#### Lo que PUEDE hacer (Modo Solo Lectura Familiar):
* **Fichas de Pupilos:** Consultar la información académica, curso y estado de matrícula de los alumnos bajo su tutela.
* **Monitoreo de Calificaciones:** Consultar las calificaciones, retroalimentaciones de evaluaciones y promedios de sus pupilos vinculados (`grades:view`).
* **Monitoreo de Asistencia:** Consultar en tiempo real el registro diario de asistencia, inasistencias y atrasos de sus pupilos (`attendance:view`).
* **Información Institucional:** Consultar el calendario de evaluaciones, horarios del curso y datos de contacto de los docentes del pupilo.

#### Lo que NO PUEDE hacer:
* ⛔ **Tajantemente Denegado:** Consultar información de estudiantes con los cuales no tenga vínculo de tutela activo.
* ⛔ **Tajantemente Denegado:** Ingresar notas o alterar registros de asistencia (`attendance:record` -> `ForbiddenError`).
* ⛔ **Tajantemente Denegado:** Modificar configuraciones académicas, periodos o roles institucionales.

---

## 4. Matriz Tabular General de Capacidades por Rol

| Módulo / Capacidad | Permiso Técnico Backend (`code`) | Admin (`SCHOOL_ADMIN`) | Docente (`TEACHER`) | Alumno (`STUDENT`) | Apoderado (`GUARDIAN`) |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Panel Global `/system/*`** | `system:schools:manage` | ⛔ Denegado | ⛔ Denegado | ⛔ Denegado | ⛔ Denegado |
| **Configuración Institucional** | `school:settings:view` | ✅ Permitido | ⛔ Denegado | ⛔ Denegado | ⛔ Denegado |
| **Modificar Escalas y Parámetros** | `school:settings:update` | ✅ Permitido | ⛔ Denegado | ⛔ Denegado | ⛔ Denegado |
| **Gestión de Roles y Permisos** | `school:roles:manage` | ✅ Permitido | ⛔ Denegado | ⛔ Denegado | ⛔ Denegado |
| **Consulta de Bitácora de Auditoría** | `school:audit:view` | ✅ Permitido | ⛔ Denegado | ⛔ Denegado | ⛔ Denegado |
| **Periodos y Calendario Académico** | `academic:periods:manage` | ✅ Permitido | ⛔ Denegado | ⛔ Denegado | ⛔ Denegado |
| **Niveles Educativos y Cursos** | `academic:courses:manage` | ✅ Permitido | ⛔ Denegado | ⛔ Denegado | ⛔ Denegado |
| **Malla Curricular y Asignaturas** | `academic:subjects:manage` | ✅ Permitido | ⛔ Denegado | ⛔ Denegado | ⛔ Denegado |
| **Gestión de Horarios Escolares** | `academic:schedule:manage` | ✅ Permitido | ⛔ Denegado | ⛔ Denegado | ⛔ Denegado |
| **Administración de Profesores** | `people:teachers:manage` | ✅ Permitido | ⛔ Denegado | ⛔ Denegado | ⛔ Denegado |
| **Fichas y Registro de Estudiantes** | `people:students:manage` | ✅ Permitido | ⛔ Denegado | ⛔ Denegado | ⛔ Denegado |
| **Vinculación de Apoderados** | `people:guardians:manage` | ✅ Permitido | ⛔ Denegado | ⛔ Denegado | ⛔ Denegado |
| **Matrículas y Enrolamientos** | `people:enrollment:manage` | ✅ Permitido | ⛔ Denegado | ⛔ Denegado | ⛔ Denegado |
| **Consulta de Calificaciones** | `grades:view` | ✅ Toda la escuela | 🟡 Cursos asignados | 🟡 Solo notas propias | 🟡 Solo notas pupilos |
| **Ingreso de Notas en Evaluaciones** | `grades:enter` | ✅ Permitido | 🟡 Asignaturas a cargo | ⛔ Denegado | ⛔ Denegado |
| **Modificación de Notas Registradas** | `grades:modify` | ✅ Permitido | 🟡 Asignaturas a cargo | ⛔ Denegado | ⛔ Denegado |
| **Cierre y Publicación de Actas** | `grades:publish` | ✅ Permitido | ⛔ Denegado | ⛔ Denegado | ⛔ Denegado |
| **Consulta de Asistencia** | `attendance:view` | ✅ Toda la escuela | 🟡 Cursos asignados | 🟡 Asistencia propia | 🟡 Asistencia pupilos |
| **Toma y Registro de Asistencia** | `attendance:record` | ✅ Permitido | 🟡 Cursos asignados | ⛔ Denegado | ⛔ Denegado |
| **Ingreso de Justificaciones** | `attendance:justify` | ✅ Permitido | ⛔ Denegado | ⛔ Denegado | ⛔ Denegado |

*Leyenda:*  
* ✅ **Totalmente Permitido:** Capacidad intrínseca y directa del rol.  
* 🟡 **Condicionado / Alcance Acotado:** Permitido con filtro estricto por pertenencia (asignaturas a cargo, identidad propia o relación familiar activa).  
* ⛔ **Tajantemente Denegado:** Bloqueado en servicio y API con respuesta `HTTP 403 Forbidden` (`ForbiddenError`).

---

## 5. Desglose Exhaustivo de Operaciones CRUD por Módulo

### 5.1 Módulo: Estudiantes (`StudentProfile` & `Enrollment`)
| Operación | Rol Admin (`SCHOOL_ADMIN`) | Rol Docente (`TEACHER`) | Rol Alumno (`STUDENT`) | Rol Apoderado (`GUARDIAN`) | Regla Técnica & Permiso Backend |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Create (C)** | ✅ Permitido | ⛔ Denegado | ⛔ Denegado | ⛔ Denegado | Requiere `people:students:manage` o `people:enrollment:manage`. Crea `User`, `Membership`, `StudentProfile` y matrícula anual. |
| **Read (R)** | ✅ Padrón completo | 🟡 Lista de sus alumnos | 🟡 Ficha propia | 🟡 Ficha de sus pupilos | Admin lee todo el colegio; Docente filtra por cursos que dicta; Alumno y Apoderado acotados a su identidad y pupilos. |
| **Update (U)** | ✅ Permitido | ⛔ Denegado | ⛔ Denegado | ⛔ Denegado | Requiere `people:students:manage`. Modifica ficha médica, curso o antecedentes familiares. |
| **Delete (D)** | ✅ Desactivar | ⛔ Denegado | ⛔ Denegado | ⛔ Denegado | Desactivación lógica (`Membership.isActive = false`). Restricción estricta contra hard-delete si existen notas o asistencias. |

### 5.2 Módulo: Profesores (`TeacherProfile` & `Subject`)
| Operación | Rol Admin (`SCHOOL_ADMIN`) | Rol Docente (`TEACHER`) | Rol Alumno (`STUDENT`) | Rol Apoderado (`GUARDIAN`) | Regla Técnica & Permiso Backend |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Create (C)** | ✅ Permitido | ⛔ Denegado | ⛔ Denegado | ⛔ Denegado | Requiere `people:teachers:manage`. Crea credenciales con hash Bcrypt, rol `TEACHER` y `TeacherProfile`. |
| **Read (R)** | ✅ Planta completa | 🟡 Perfil propio / Colegas | 🟡 Docentes de su curso | 🟡 Docentes del pupilo | Consulta de correo institucional, especialidad y asignaturas que imparte cada profesor. |
| **Update (U)** | ✅ Permitido | 🟡 Contacto personal | ⛔ Denegado | ⛔ Denegado | Admin asigna cargas académicas (`academic:subjects:manage`). El profesor solo actualiza su teléfono o foto. |
| **Delete (D)** | ✅ Desactivar | ⛔ Denegado | ⛔ Denegado | ⛔ Denegado | Requiere `people:teachers:manage`. Suspende al docente y reasigna sus asignaturas para evitar discontinuidad pedagógica. |

### 5.3 Módulo: Notas y Evaluaciones (`Assessment` & `Grade`)
| Operación | Rol Admin (`SCHOOL_ADMIN`) | Rol Docente (`TEACHER`) | Rol Alumno (`STUDENT`) | Rol Apoderado (`GUARDIAN`) | Regla Técnica & Permiso Backend |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Create (C)** *(Evaluaciones)* | ✅ Permitido | 🟡 Asignaturas a cargo | ⛔ Denegado | ⛔ Denegado | Docente define instrumentos de evaluación (título, fecha, ponderación) en sus materias (`grades:enter`). |
| **Create (C)** *(Notas)* | ✅ Permitido | 🟡 Asignaturas a cargo | ⛔ Denegado | ⛔ Denegado | Inserción de calificaciones validadas numéricamente contra la escala institucional (`grades:enter`). |
| **Read (R)** | ✅ Toda la escuela | 🟡 Cursos a cargo | 🟡 Calificaciones propias | 🟡 Calificaciones pupilos | Requiere `grades:view`. Alumnos y apoderados no pueden ver notas de terceros ni borradores no publicados. |
| **Update (U)** *(Notas)* | ✅ Permitido | 🟡 Periodo abierto | ⛔ Denegado | ⛔ Denegado | Requiere `grades:modify`. En periodos cerrados, solo el Admin (UTP) puede rectificar bajo justificación de auditoría. |
| **Delete (D)** | ✅ Permitido | 🟡 Evaluaciones propias | ⛔ Denegado | ⛔ Denegado | Requiere `grades:modify`. Solo permitido en períodos académicos activos y no cerrados. |
| **Publish (P)** *(Actas)* | ✅ Permitido | ⛔ Denegado | ⛔ Denegado | ⛔ Denegado | Requiere `grades:publish`. Sella oficialmente el período académico y genera actas inmutables. |

### 5.4 Módulo: Asistencia Escolar (`AttendanceRecord`)
| Operación | Rol Admin (`SCHOOL_ADMIN`) | Rol Docente (`TEACHER`) | Rol Alumno (`STUDENT`) | Rol Apoderado (`GUARDIAN`) | Regla Técnica & Permiso Backend |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Create (C)** | ✅ Permitido | 🟡 Cursos a cargo | ⛔ Denegado | ⛔ Denegado | Registro diario con estados `PRESENT`, `ABSENT_UNEXCUSED`, `LATE`. Requiere `attendance:record`. |
| **Read (R)** | ✅ Reporte global | 🟡 Cursos a cargo | 🟡 Asistencia propia | 🟡 Asistencia pupilos | Consulta de porcentaje de asistencia y detalle histórico por día y asignatura (`attendance:view`). |
| **Update (U)** | ✅ Permitido | 🟡 Mismo día lectivo | ⛔ Denegado | ⛔ Denegado | Rectificación de marcas erróneas. El docente solo puede editar el registro durante la misma jornada escolar. |
| **Justify (J)** | ✅ Permitido | ⛔ Denegado | ⛔ Denegado | ⛔ Denegado | Requiere `attendance:justify`. Exclusivo de administración escolar tras recibir licencia médica o certificado formal. |
| **Delete (D)** | ✅ Restringido | ⛔ Denegado | ⛔ Denegado | ⛔ Denegado | Solo permitido anular registros duplicados erróneos con log de auditoría. |

### 5.5 Módulo: Configuración Institucional & Académica (`SchoolSettings`, `AcademicPeriod`, `Course`, `Role`)
| Operación | Rol Admin (`SCHOOL_ADMIN`) | Rol Docente (`TEACHER`) | Rol Alumno (`STUDENT`) | Rol Apoderado (`GUARDIAN`) | Regla Técnica & Permiso Backend |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Create (C)** | ✅ Permitido | ⛔ Denegado | ⛔ Denegado | ⛔ Denegado | Creación de periodos, cursos y asignaturas (`academic:*:manage`) y roles (`school:roles:manage`). |
| **Read (R)** | ✅ Completo | 🟡 Calendario y horarios | 🟡 Horarios y cursos | 🟡 Horarios y cursos | Consulta de parámetros del colegio. La auditoría (`school:audit:view`) es exclusiva de Admin. |
| **Update (U)** | ✅ Permitido | ⛔ Denegado | ⛔ Denegado | ⛔ Denegado | `PATCH /api/schools/[schoolId]/settings`. Actualiza notas mínimas/máximas, color institucional y régimen. |
| **Delete (D)** | ✅ Restringido | ⛔ Denegado | ⛔ Denegado | ⛔ Denegado | Restricción por `@relation(onDelete: Restrict)` en Prisma ante la presencia de matrículas o notas activas. |

---

## 6. Guía de Implementación para Desarrolladores

Para mantener la integridad de la matriz en nuevas características, los desarrolladores **deben aplicar las siguientes pautas**:

### 6.1 Protección en Rutas de API (`app/api/*`)
Toda ruta de mutación o consulta protegida debe implementar la verificación canónica:

```typescript
// Ejemplo en app/api/schools/[schoolId]/grades/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { assertPermission } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { createTenantPrisma } from "@/lib/db/tenant-extension";

export async function POST(req: NextRequest, { params }: { params: Promise<{ schoolId: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { schoolId } = await params;

  // 1. Verificación de permiso RBAC
  try {
    assertPermission(
      { roleName: session.roleName, permissions: session.permissions, isSystemAdmin: session.isSystemAdmin },
      PERMISSIONS.GRADES_ENTER
    );
  } catch (error) {
    return NextResponse.json({ error: "No posees permisos para ingresar calificaciones." }, { status: 403 });
  }

  // 2. Uso obligatorio del cliente Scoped por Tenant
  const tenantDb = createTenantPrisma(schoolId);
  
  // 3. Ejecutar lógica de servicio...
}
```

### 6.2 Renderizado Condicional Defensivo en UI
El frontend debe ocultar controles a los cuales el usuario no tiene acceso, pero **nunca confiar únicamente en el frontend**:
* En Server Components: Evaluar `hasPermission` antes de renderizar botones de acción (ej. "Editar Configuración", "Publicar Actas").
* En formularios: Si el backend responde `403 Forbidden`, la interfaz debe atrapar el error y mostrar una notificación visual amigable sin recargar el estado global.

---

## 7. Guía de Pruebas de Autorización para QA y Seguridad

El equipo de QA debe validar cada cambio utilizando el siguiente banco de casos de prueba estandarizados:

### 7.1 Catálogo de Casos de Prueba (Test Cases Matrix)

| ID Caso | Escenario Evaluado | Rol Evaluado | Acción Ejecutada | Resultado Esperado | Código HTTP |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-SEC-01** | Acceso anónimo a API protegida | Ninguno (Sin sesión) | `GET /api/system/schools` | Rechazo inmediato | `401 Unauthorized` |
| **TC-SEC-02** | Acceso anónimo a settings | Ninguno (Sin sesión) | `PATCH /api/schools/csj/settings` | Rechazo inmediato | `401 Unauthorized` |
| **TC-SEC-03** | Escalación de privilegios Admin escolar | `SCHOOL_ADMIN` | `GET /api/system/schools` | Acceso denegado | `403 Forbidden` |
| **TC-SEC-04** | Modificación de configuración por Docente | `TEACHER` | `PATCH /api/schools/csj/settings` | Bloqueo por RBAC (`assertPermission`) | `403 Forbidden` |
| **TC-SEC-05** | Creación de roles por Docente | `TEACHER` | Intento con `school:roles:manage` | Arroja `ForbiddenError` | `403 Forbidden` |
| **TC-SEC-06** | Ingreso de notas por Alumno | `STUDENT` | Intento con `grades:enter` | Arroja `ForbiddenError` | `403 Forbidden` |
| **TC-SEC-07** | Registro de asistencia por Apoderado | `GUARDIAN` | Intento con `attendance:record` | Arroja `ForbiddenError` | `403 Forbidden` |
| **TC-SEC-08** | Fuga de datos entre Colegios (Anti-IDOR) | `SCHOOL_ADMIN` (Col. A) | Query de cursos con `schoolId` (Col. B) | Retorna 0 registros | `200 OK` (Scope vacío) |
| **TC-SEC-09** | Escritura cruzada de Tenant | `SCHOOL_ADMIN` (Col. A) | `createTenantPrisma(Col. A)` creando datos con `schoolId` de Col. B | Excepción de seguridad fatal | Error interceptado |
| **TC-SEC-10** | Manipulación de Token JWT | Atacante | Modificación de firma o payload | Verificación rechaza token (`null`) | `401 Unauthorized` |

---

## 8. Verificación Automatizada en Suite de Certificación

Todas las reglas estipuladas en esta documentación están respaldadas por la suite de pruebas unitarias e integradas en `scripts/qa-security-test.ts`.

Para ejecutar la verificación completa:
```bash
npm test
```

### Resultados de la Certificación:
```
================================================================================
🛡️  AURENIS QA & SEGURIDAD - SUITE DE PRUEBAS DE CERTIFICACIÓN Y EVIDENCIAS
    Responsable QA: Frank M — QA / Testing / Seguridad / Documentación
================================================================================
[AUTH]            ✅ 5/5 Pruebas Criptográficas y de Sesión Superadas
[RBAC]            ✅ 5/5 Pruebas de Roles (SuperAdmin, Admin, Docente, Alumno, Apoderado)
[TENANT_ISOLATION]✅ 3/3 Pruebas de Aislamiento Multi-Tenant y Anti-IDOR
[VALIDATION]      ✅ 1/1 Pruebas de Esquemas Zod y Parámetros Académicos
[AUDIT]           ✅ 1/1 Pruebas de Bitácora Inmutable de Auditoría
[API]             ✅ 2/2 Pruebas de Endpoints HTTP y Protección Perimetral
================================================================================
📊 RESUMEN FINAL: 17/17 Superadas (100% PASS) — 🟢 APROBADO PARA PRODUCCIÓN
================================================================================
```

---

## 9. Criterios de Aceptación (Definition of Done)

* [x] **Matriz tabular elaborada para roles:** Admin (`SCHOOL_ADMIN`), Docente (`TEACHER`), Alumno (`STUDENT`) y Apoderado (`GUARDIAN`).
* [x] **Definición de permisos CRUD por módulo:** Estudiantes, Profesores, Notas, Asistencia, Configuración Institucional y Auditoría.
* [x] **Revisión y firma técnica con Maicol R:** Alineado 100% con `prisma/schema.prisma`, `lib/constants/permissions.ts`, `lib/constants/roles.ts`, `lib/db/tenant-extension.ts` y controladores HTTP.
* [x] **Publicada en el repositorio y en la documentación oficial:** Registrada en `docs/RBAC_PERMISSIONS_MATRIX.md` y referenciada en `docs/QA_AUDIT_REPORT.md`.

---

## 10. Acta de Firma Técnica y Cierre de Especificación

```
══════════════════════════════════════════════════════════════════════════════════
                     ACTA DE CERTIFICACIÓN TÉCNICA OFICIAL RBAC
══════════════════════════════════════════════════════════════════════════════════

Por la presente, certificamos que la especificación de Control de Acceso Basado en
Roles (RBAC), la matriz de permisos CRUD y las pautas de aislamiento multi-tenant
aquí consignadas corresponden fielmente al código fuente en producción de AURENIS,
habiendo superado las 17 pruebas automatizadas de seguridad con tasa de éxito de 100%.

Firmado conjuntamente:

________________________________________        ________________________________________
Maicol R                                        Frank M
Backend Lead & Arquitectura Técnica             QA, Testing, Seguridad & Documentación
AURENIS Core Engineering                        AURENIS Quality Assurance

Fecha: 10 de Septiembre de 2026                 Fecha: 10 de Septiembre de 2026
Versión de Esquema: v1.0.0                      Certificación: 100% PASS / PRODUCTION READY
══════════════════════════════════════════════════════════════════════════════════
```
