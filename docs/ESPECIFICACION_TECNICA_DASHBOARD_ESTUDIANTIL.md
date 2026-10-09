# AURENIS — ESPECIFICACIÓN TÉCNICA Y SISTEMA DE DISEÑO DE LA DASHBOARD ESTUDIANTIL

> **Versión:** 1.0.0 Canónica  
> **Fecha:** Octubre 2026  
> **Estado:** APROBADO PARA IMPLEMENTACIÓN  
> **Ámbitos de Autoría:**  
> - 🎨 **Lucas P.** (UI/UX Designer & Design System Lead)  
> - 💻 **Malcom Marcelo** (Frontend Architecture & Client State)  
> - 👑 **Maicol R.** (Project Lead, Architecture & Backend Contracts)  
> - 🛡️ **Frank M.** (QA, Testing & Security Hardening)

---

## 1. OBJETIVO DEL ESPACIO ESTUDIANTIL

La **Dashboard Estudiantil de AURENIS** es el punto neurálgico al que accede un estudiante inmediatamente tras autenticarse con su RUN o correo institucional.

Su misión principal es **reducir la fricción cognitiva**: en menos de 5 segundos, el estudiante debe comprender:
1. **Su situación académica global** (promedio general acumulado y tendencia evaluativa según Decreto 67).
2. **Su estado de asistencia** (porcentaje frente a la exigencia oficial MINEDUC del 85% y registro del día).
3. **Sus compromisos inmediatos** (tareas pendientes con semaforización de vencimiento y próximas evaluaciones programadas).
4. **Su ubicación horaria** (clase actual, bloque siguiente, docente y sala).
5. **Comunicaciones institucionales relevantes** (avisos de jefatura, circulares de inspectoría o citaciones).

> ⚠️ **Principio de Rol:** No sobrecargar al estudiante con métricas administrativas o de gestión docente (planillas de ponderación UTP, coberturas curriculares ministeriales, actas SIGE o estados de subvención). El foco es 100% el progreso formativo del alumno.

---

## 2. PRINCIPIOS GENERALES DE DISEÑO & ANTI-SLOP DISCIPLINE

Conforme al **Design System de AURENIS** (diseñado por Lucas P.) y las directrices anti-AI slop:

1. **Jerarquía Tipográfica Nítida:** Tipografía Inter / Geist sans-serif, con pesos tipográficos marcados (`font-black`, `font-bold`, `font-medium`) y escalado proporcional.
2. **Cero Píldoras Estáticas Innecesarias (Zero-Pill Discipline):** Los metadatos contextuales se presentan como texto nítido con separadores semánticos (`·`, `/`) y cajas con contraste funcional, no "chips" decorativos flotantes sin sentido.
3. **Paleta Cromática Semántica y Sobria:**
   - Fondo de lienzo: `#F8F8F5` (modo claro) / `#0B132B` (modo oscuro institucional).
   - Superficies de tarjetas: `#FFFFFF` / `slate-900` con bordes sutiles `border-slate-200/90`.
   - Acento Principal: Índigo / Azul Real (`#4F46E5` / `#2563EB`).
   - Estados: Éxito (Esmeralda `#059669`), Advertencia (Ámbar `#D97706`), Peligro/Atención (Rojo carmesí `#DC2626`).
4. **Accesibilidad Universal (WCAG 2.1 AA):**
   - Ratios de contraste $\ge 4.5:1$ para texto regular y $\ge 3:1$ para titulares y controles.
   - Touch targets en dispositivos móviles $\ge 44\text{px}$.
   - Focus rings visibles con navegación por teclado (`focus-visible:ring-2 focus-visible:ring-indigo-500`).
   - Ningún estado se comunica exclusivamente por color: siempre va acompañado de iconos de estado, texto explícito o indicadores numéricos.

---

## 3. ARQUITECTURA DE PANTALLA & ESTRUCTURA WIREFRAME

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [SIDEBAR (260px desktop, colapsable / drawer móvil)]                                   │
│  - Logo AURENIS + Slug Institucional ([schoolSlug])                                    │
│  - Menú Principal: Dashboard, Mis Cursos, Calificaciones, Asistencia, Horario, Tareas  │
│  - Menú Comunicación: Comunicaciones, Notificaciones                                   │
│  - Menú Cuenta: Mi Perfil, Configuración, Cerrar Sesión                                │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [HEADER CONTEXTUAL]                                                                    │
│  - Saludo: "Buenos días, [Nombre]" + Contexto de Curso ("1° Medio A - Telecomunicaciones")│
│  - Buscador rápido / Atajo global (Ctrl + K)                                           │
│  - Centro de Notificaciones con Badge de no leídas                                     │
│  - Menú de Perfil (Avatar + Nombre + Dropdown)                                         │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [RESUMEN ACADÉMICO - 4 METRIC CARDS]                                                   │
│  ┌──────────────────┬──────────────────┬──────────────────┬──────────────────┐         │
│  │ Promedio General │ Asistencia Global│ Tareas Pendientes│ Próxima Clase    │         │
│  │ 6.3  (Sobresal.) │ 97.2% (Meta 85%) │ 2 por entregar   │ Redes de Datos   │         │
│  └──────────────────┴──────────────────┴──────────────────┴──────────────────┘         │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [GRID PRINCIPAL 2 COLUMNAS (8 col / 4 col)]                                            │
│                                                                                        │
│ COLUMNA PRINCIPAL (8 Cols):                     COLUMNA LATERAL (4 Cols):             │
│ 1. Horario de Hoy (Bloque actual & siguientes)  1. Resumen de Asistencia Detallada     │
│ 2. Próximas Evaluaciones y Trabajos (Calendario)│    - 46 Presentes / 2 Aus. / 1 Atr.  │
│ 3. Tareas Pendientes con Fecha de Entrega       2. Comunicaciones y Avisos Recientes   │
│ 4. Rendimiento por Asignatura (Notas actuales)  3. QR Asistencia Express (Escáner)     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. ESPECIFICACIÓN DETALLADA DE COMPONENTES

### 4.1. Header Contextual (`StudentHeader`)
- **Responsable:** Malcom Marcelo / Lucas P.
- **Props requeridas:**
  - `studentName: string`
  - `courseName: string`
  - `unreadNotificationsCount: number`
  - `avatarUrl?: string`
  - `onOpenNotifications: () => void`
  - `onLogout: () => void`
- **Comportamiento:**
  - Saludo dependiente de la franja horaria: *Buenos días* (<12:00), *Buenas tardes* (12:00-19:00), *Buenas noches* (>19:00).
  - Badge de notificaciones con contador visual nítido y supresión si es 0.
  - Dropdown accesible de perfil con navegación hacia `/perfil`, `/configuracion` y cierre seguro hacia `/api/auth/logout`.

### 4.2. Tarjetas de Resumen (`AcademicSummarySection`)
- **Métricas:**
  1. **Promedio General:**
     - Valor destacado (ej. `6.3` con escala 1.0 a 7.0 de Chile).
     - Etiqueta reglamentaria `Decreto 67`.
     - Indicador cualitativo: *Sobresaliente* (6.0 - 7.0), *Bueno* (5.0 - 5.9), *Suficiente* (4.0 - 4.9), *Insuficiente* (<4.0).
  2. **Asistencia Semestral:**
     - Porcentaje acumulado (ej. `97.2%`).
     - Contexto legal: *Cumple meta MINEDUC (85%)*.
     - Barra de progreso compacta con límite demarcado en 85%.
  3. **Tareas Pendientes:**
     - Cantidad activa (ej. `2`).
     - Alerta si alguna vence en las próximas 24 horas.
  4. **Próxima Actividad / Clase:**
     - Asignatura, sala y hora de inicio (ej. `Redes de Datos · Sala 302 · 10:15 hrs`).

### 4.3. Horario del Día (`TodaySchedule`)
- Muestra el bloque actual (resaltado con indicador de tiempo restante o *En curso*).
- Listado cronológico de bloques lectivos del día con:
  - Hora de inicio y fin (ej. `08:00 - 09:30`).
  - Nombre de la asignatura.
  - Profesor a cargo.
  - Aula o taller asignado.
  - Botón de acceso a `"Ver horario semanal completo"` hacia `/[schoolSlug]/horario`.

### 4.4. Tareas y Evaluaciones (`UpcomingActivitiesList`)
- Clasificación visual por tipo: `Evaluación Sumativa`, `Guía de Ejercicios`, `Trabajo Práctico`.
- Metadatos esenciales:
  - Fecha límite de entrega o aplicación.
  - Estado: `Pendiente`, `Próxima a vencer (<24h)`, `Entregada`, `Vencida`.
  - Icono distintivo según tipología (Lucide `FileText`, `CheckCircle2`, `AlertTriangle`).
  - Prioridad indicada tipográficamente sin saturar de colores.

### 4.5. Resumen de Asistencia (`AttendanceBreakdownCard`)
- Visualización compacta sin gráficos pesados:
  - Porcentaje global: `97.2%`.
  - Conteo de registros:
    - **Presentes:** `46` días asistidos.
    - **Ausencias:** `2` inasistencias.
    - **Atrasos:** `1` registro de impuntualidad justificado.
  - Acción directa: `"Ver detalle de asistencia"` hacia `/[schoolSlug]/attendance`.

### 4.6. Tablón de Comunicaciones (`StudentCommunicationsFeed`)
- Avisos de Dirección, Unidad Técnica Pedagógica (UTP) o Profesor Jefe.
- Campos visibles: Título, Remitente institucional, Fecha relativa (*Hace 2 horas*, *Ayer*), Etiqueta de lectura (*No leído* con punto de acento índigo).
- Acción directa: `"Ir al centro de comunicaciones"` hacia `/[schoolSlug]/comunicaciones`.

---

## 5. ESTADOS DE LA INTERFAZ & MANEJO ROBUSTO DE DATOS

Conforme al protocolo de **Frank M.** (QA y Robustez) y **Malcom Marcelo** (Frontend):

1. **Estado de Carga (`Loading State`):**
   - Implementación de Skeletons con Tailwind (`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl`).
   - Las dimensiones de los skeletons deben coincidir exactamente con las tarjetas finales para garantizar **Cumulative Layout Shift = 0 (CLS = 0)**.
2. **Estado Vacío (`Empty State`):**
   - Si no hay tareas pendientes: ilustración sobria Lucide `CheckCircle2` + texto *"¡Estás al día! No tienes tareas pendientes para los próximos días"*.
   - Si no hay evaluaciones en los próximos 14 días: *"No hay evaluaciones programadas para este periodo"*.
   - Si no hay comunicaciones: *"Bandeja de avisos al día"*.
3. **Estado de Error Resiliente (`Error Boundary`):**
   - Cada módulo opera con aislamiento de fallos: si falla la API de horario, las calificaciones y tareas continúan visibles.
   - Mensajes amigables para el usuario: *"No pudimos sincronizar el horario en este momento. [Reintentar]"*. Cero stack traces ni cadenas JSON expuestas.
4. **Datos Nulos o Pendientes de Definición:**
   - Si un promedio aún no tiene notas asentadas, se muestra `"—"` con texto de apoyo *"Sin calificaciones registradas todavía"*, nunca `NaN`, `null` o `undefined`.

---

## 6. CONTRATOS DE DATOS & INTEGRACIÓN CON BACKEND (MAICOL R.)

La Dashboard Estudiantil se alimenta del contrato de agregación optimizado:

```typescript
// GET /api/[schoolSlug]/student/dashboard-summary
export interface StudentDashboardSummaryResponse {
  student: {
    id: string;
    fullName: string;
    run: string;
    course: {
      id: string;
      name: string; // ej. "1° Medio A"
      specialty?: string; // ej. "Telecomunicaciones TP"
    };
  };
  academic: {
    overallAverage: number | null; // Escala chilena 1.0 a 7.0
    averageTrend: number; // Variación respecto al mes anterior (+0.2)
    attendancePercentage: number; // 0 a 100
    presentDays: number;
    absentDays: number;
    lateDays: number;
  };
  scheduleToday: Array<{
    periodId: string;
    startTime: string; // "08:00"
    endTime: string;   // "09:30"
    subjectName: string;
    teacherName: string;
    classroom: string;
    isCurrent: boolean;
  }>;
  upcomingActivities: Array<{
    id: string;
    title: string;
    subjectName: string;
    dueDate: string; // ISO 8601
    type: "EXAM" | "HOMEWORK" | "WORKSHOP";
    status: "PENDIENTE" | "ENTREGADA" | "PROXIMA_A_VENCER" | "VENCIDA";
  }>;
  recentSubjects: Array<{
    subjectId: string;
    subjectName: string;
    teacherName: string;
    currentAverage: number | null;
    attendanceRate: number;
  }>;
  communications: Array<{
    id: string;
    title: string;
    senderName: string;
    senderRole: string;
    date: string;
    isUnread: boolean;
  }>;
}
```

---

## 7. MATRIZ DE AUTORIZACIÓN Y PROTECCIÓN BOLA/IDOR (FRANK M. & MAICOL R.)

1. **Aislamiento Multi-Tenant Estricto:**
   - La petición valida el token JWT del estudiante (`membershipId`, `schoolId`, `role: STUDENT`).
   - El estudiante **únicamente** puede consultar sus propios datos (`WHERE studentId = token.userId AND schoolId = token.schoolId`).
   - Cualquier intento de manipular parámetros de ruta o IDs ajenos retorna inmediatamente `403 Forbidden` / `404 Not Found` sin filtrar información.
2. **Protección de Datos NNA (Niños, Niñas y Adolescentes):**
   - Cumplimiento de la Circular N° 482 de la Superintendencia de Educación.
   - La pantalla no expone domicilios personales, diagnósticos PIE médicos ni datos financieros o socioeconómicos en la vista del alumno.

---

## 8. ELEMENTOS PENDIENTES DE DEFINICIÓN (ROADMAP)

Siguiendo la regla de no inventar funcionalidades no consensuadas:
* `[PENDIENTE DE DEFINICIÓN]`: Sistema de justificación de inasistencias en línea por parte de estudiantes (requiere validación si la normativa de cada colegio exige firma exclusiva del apoderado).
* `[PENDIENTE DE DEFINICIÓN]`: Módulo de descarga de certificado de alumno regular en 1 clic (pendiente de integración con firma digital avanzada).
* `[PENDIENTE DE DEFINICIÓN]`: Integración con casillero de entregas tipo Google Drive / Microsoft Teams para adjuntos pesados (>25MB).

---

```text
================================================================================
  ✅ ESPECIFICACIÓN APROBADA POR EL EQUIPO AURENIS
  🎨 UI/UX DESIGN SYSTEM: AVALADO (LUCAS P.)
  💻 CONTRATOS DE CLIENTE: VERIFICADOS (MALCOM MARCELO)
  👑 ARQUITECTURA & AUTORIZACIÓN: CERTIFICADA (MAICOL R.)
  🛡️ AUDITORÍA DE SEGURIDAD & WCAG: APROBADA (FRANK M.)
================================================================================
```
