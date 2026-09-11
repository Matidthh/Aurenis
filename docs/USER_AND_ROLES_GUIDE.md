# 👥 MANUAL OPERATIVO DE USUARIOS Y GUÍA POR ROLES — AURENIS v1.0

**Estado:** 🟢 **VIGENTE Y CERTIFICADO**  
**Versión:** 1.0.0  
**Audiencia:** Administradores del Sistema, Equipos Directivos, Docentes, Estudiantes y Familias  

---

## 1. Introducción al Ecosistema Aurenis

Aurenis está diseñado para adaptarse dinámicamente al rol de cada usuario. Al iniciar sesión, la plataforma evalúa la membresía activa y despliega un panel contextualizado con las herramientas específicas que corresponden a sus responsabilidades.

---

## 2. SuperAdministrador Global (`SYSTEM_ADMIN`)

El SuperAdmin es el custodio de la infraestructura SaaS y supervisa todos los colegios registrados.

### 2.1 Acceso al Panel Global
- **Ruta de Acceso:** `/system/dashboard`
- **Credencial de Demostración:** `admin@aurenis.com` / `Password123!`

### 2.2 Funcionalidades Clave
1. **Catálogo de Colegios (`/system/schools`):**
   - Visualización de todas las instituciones con métricas en tiempo real (número de cursos, docentes, alumnos y estado operativo).
   - Alta y provisión de nuevos colegios mediante el formulario de incorporación institucional.
2. **Auditoría Global:**
   - Supervisión de eventos críticos ocurridos a lo largo de toda la plataforma.

---

## 3. Director / Administrador Escolar (`SCHOOL_ADMIN`)

El Director gestiona la vida institucional de su colegio con autonomía total dentro de su tenant.

### 3.1 Acceso al Panel Institucional
- **Ruta de Acceso:** `/[schoolSlug]/dashboard` (ej: `/colegio-san-jose/dashboard`)
- **Credencial de Demostración:** `carlos.mendoza@sanjose.cl` / `Password123!`

### 3.2 Flujos Operativos Principales
1. **Configuración Institucional (`/[schoolSlug]/settings`):**
   - Definición del régimen académico (Semestral, Trimestral, Bimestral o Anual).
   - Configuración de la escala de notas: nota mínima (1.0), nota de aprobación (4.0), nota máxima (7.0) y precisión decimal (0 o 1 decimal).
   - Personalización del color corporativo institucional.
2. **Gestión de Estructura Académica:**
   - **Cursos (`/[schoolSlug]/courses`):** Creación y administración de cursos (ej: "1° Medio A", "2° Medio A").
   - **Asignaturas (`/[schoolSlug]/subjects`):** Asignación de materias curriculares a cursos y profesores responsables.
3. **Comunidad Escolar:**
   - **Docentes (`/[schoolSlug]/teachers`):** Directorio de profesores y especialidades.
   - **Estudiantes (`/[schoolSlug]/students`):** Fichas de estudiantes, estado de matrícula y apoderados vinculados.

---

## 4. Docente / Profesor (`TEACHER`)

El Docente interactúa diariamente con el libro de clases digital para registrar asistencia y calificaciones.

### 4.1 Acceso al Panel de Aula
- **Ruta de Acceso:** `/[schoolSlug]/dashboard`
- **Credencial de Demostración:** `profesor.matematica@sanjose.cl` / `Password123!`

### 4.2 Tareas Diarias del Docente
1. **Registro de Asistencia (`/[schoolSlug]/attendance`):**
   - Selección de curso y fecha del bloque pedagógico.
   - Marcación de estados: **Presente**, **Ausente**, **Atraso** o **Justificado**.
   - Guardado inmediato con validación en tiempo real.
2. **Libro de Calificaciones (`/[schoolSlug]/grades`):**
   - Creación de evaluaciones con ponderación porcentual o coeficiente.
   - Ingreso de notas numéricas dentro de los límites institucionales configurados.
   - Cálculo automático de promedios ponderados por estudiante y estadísticas generales del curso.

---

## 5. Estudiante (`STUDENT`)

El Estudiante dispone de una interfaz limpia y orientada a su progreso académico y cumplimiento formativo.

### 5.1 Acceso a la Ficha del Alumno
- **Ruta de Acceso:** `/[schoolSlug]/dashboard`
- **Credencial de Demostración:** `sofia.valenzuela@sanjose.cl` / `Password123!`

### 5.2 Servicios Disponibles
1. **Boletín de Notas:**
   - Consulta de calificaciones por asignatura, notas parciales e historial de evaluaciones.
   - Cálculo transparente de promedios y visualización del estado de aprobación.
2. **Registro de Asistencia:**
   - Porcentaje acumulado de asistencia y desglose de inasistencias o atrasos.
3. **Materia y Horarios:**
   - Información de contacto de sus profesores y asignaturas inscritas.

---

## 6. Apoderada / Tutor Legal (`GUARDIAN`)

La familia cuenta con visibilidad constante sobre el desempeño y permanencia de sus pupilos.

### 6.1 Acceso al Portal de Familia
- **Ruta de Acceso:** `/[schoolSlug]/dashboard`
- **Credencial de Demostración:** `maria.gonzalez@sanjose.cl` / `Password123!`

### 6.2 Supervisión Pedagógica
1. **Seguimiento Académico Multihijo:**
   - Selector rápido para alternar entre distintos pupilos matriculados en la institución.
2. **Monitoreo de Calificaciones y Asistencia:**
   - Acceso de solo lectura al historial de calificaciones publicadas.
   - Detección temprana de inasistencias para coordinar justificaciones con inspectoría o dirección.

---

## 7. Preguntas Frecuentes y Soporte

- **¿Qué ocurre si ingreso una contraseña errónea?**
  El sistema bloquea el intento con `401 Unauthorized` protegiendo la cuenta contra enumeración de usuarios.
- **¿Cómo cierro mi sesión de forma segura?**
  Haz clic en el botón de usuario en la esquina superior derecha y selecciona **"Cerrar Sesión"**. Esto invalidará la cookie en tu navegador de forma definitiva.
- **¿Puede un profesor cambiar los parámetros de aprobación del colegio?**
  No. La matriz RBAC reserva los permisos de configuración exclusivamente al equipo directivo (`SCHOOL_ADMIN`).
