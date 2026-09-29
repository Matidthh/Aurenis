# 📖 MANUAL DE USUARIO OFICIAL E ILUSTRADO POR ROLES — AURENIS SAAS v2.4.0

```
====================================================================================================
               REPÚBLICA DE CHILE — ECOSISTEMA DE GESTIÓN ESCOLAR MULTI-TENANT
          GUÍA PASO A PASO ILUSTRADA PARA ADMINISTRADORES, PROFESORES, ALUMNOS Y APODERADOS
             CONFORME A CIRCULAR 482 SUPEREDUC, DECRETO 67/2018 & ESTÁNDAR ISO/IEC 25010
====================================================================================================
```

---

## 📑 1. FICHA TÉCNICA Y CONTROL DE HOMOLOGACIÓN DEL MANUAL

| Atributo | Especificación Institucional |
| :--- | :--- |
| **Código Documental** | `AUR-MAN-USR-2026-v2.4` |
| **Título del Manual** | Guía Paso a Paso Ilustrada para Usuarios de la Comunidad Escolar |
| **Público Objetivo** | Administradores/Directores, Docentes de Aula, Estudiantes y Padres/Apoderados |
| **Plataforma Objetivo** | AURENIS Cloud School Management (Multi-Tenant SaaS) |
| **Versión del Sistema** | v2.4.0-PROD (Build ID: `aur-core-20260928-release`) |
| **Normativa Legal Aplicada** | Ley 19.628 (Protección de Datos), Circular 482 (Superintendencia de Educación), Decreto 67/2018 (Evaluación y Promoción) |
| **Estado de Homologación** | **DOCUMENTO OFICIAL APROBADO PARA DISTRIBUCIÓN Y ENTREGA (LUZ VERDE ✅)** |

### 👥 Firmas de Responsabilidad Técnica del Equipo AURENIS

| Integrante | Rol | Responsabilidad en la Elaboración de esta Guía |
| :--- | :--- | :--- |
| **👑 Maicol R.** | **Project Lead & Arquitectura** | • Definición de flujos funcionales, esquemas de datos del Libro de Clases y seguridad de perfiles.<br>• Validaciones de acceso en servidor y políticas de privacidad conforme a Circular 482. |
| **💻 Malcom Marcelo** | **Frontend Developer** | • Arquitectura de cliente interactivo, navegación reactiva y soporte de guardado automático.<br>• Sincronización de estados entre vistas de profesores, alumnos y apoderados. |
| **🎨 Lucas P.** | **UI/UX Designer** | • Diseño visual institucional, capturas e ilustraciones de interfaz (*Design System*).<br>• Ergonomía visual, tipografía legible y optimización para impresión/exportación PDF. |
| **🛡️ Frank M.** | **QA, Testing & Seguridad** | • Auditoría de accesibilidad WCAG 2.1 AA y claridad del lenguaje ciudadano.<br>• Verificación de pasos de prueba de usuario y checklist de soporte para cada rol. |

---

## 🧭 2. MAPA DE NAVEGACIÓN Y ACCESO GENERAL A LA PLATAFORMA

### 2.1 Acceso al Sistema y Autenticación Segura
1. Abra su navegador web moderno (Google Chrome, Mozilla Firefox, Microsoft Edge o Safari).
2. Ingrese a la dirección oficial de su establecimiento (ejemplo: `https://aurenis.cl/login` o el subdominio asignado a su colegio).
3. Ingrese su **Correo Electrónico Institucional** o su **RUT Oficial Chileno** y su contraseña segura.
4. Si su institución tiene activado el inicio de sesión único (SSO), presione el botón institucional correspondiente.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 AURENIS CLOUD EDUCATION                                │
│                     Portal Unificado de Gestión Escolar — República de Chile           │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│   [ Correo Electrónico Institucional o RUT ]  ej: profesor@colegio.cl                  │
│   [ Contraseña de Seguridad ]                 ••••••••••••••••                         │
│                                                                                        │
│   [ Recordar mi sesión ]                       [ ¿Olvidaste tu contraseña? ]           │
│                                                                                        │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │                         INICIAR SESIÓN SEGURA (HTTPS)                          │   │
│   └────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                        │
│   🛡️ Acceso protegido mediante cifrado TLS 1.3 y autenticación multi-factor           │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🏛️ 3. MÓDULO 1: GUÍA PASO A PASO PARA ADMINISTRADORES Y DIRECTIVOS

### 3.1 Perfil y Atribuciones del Rol Administrador / Director
El rol **Administrador / Director** es responsable de la configuración institucional, la parametrización de periodos académicos, la nómina docente, el padrón de estudiantes y la supervisión del Libro de Clases Digital exigido por el MINEDUC.

### 3.2 Paso a Paso 1: Parametrización del Año Escolar y Decretos Evaluativos
1. **Acceder a Configuración:** En el menú lateral izquierdo, diríjase a **Administración > Configuración del Colegio**.
2. **Definir Periodos Académicos:** Seleccione entre régimen **Semestral** (2 periodos) o **Trimestral** (3 periodos), estableciendo las fechas de inicio y cierre de cada periodo.
3. **Escala de Calificaciones:** Establezca la nota mínima (1.0), nota máxima (7.0), nota mínima de aprobación (4.0) y porcentaje de exigencia (ej. 60%).
4. **Reglamento Decreto 67:** Active las opciones de evaluación formativa, coeficientes ponderados y eximición de asignaturas según el reglamento de evaluación interno.
5. **Guardar Cambios:** Haga clic en **"Guardar Parámetros Institucionales"**. Los cambios se sincronizan en caliente en toda la plataforma.

```
+----------------------------------------------------------------------------------------+
| VISTA DE ADMINISTRACIÓN: PARAMETRIZACIÓN ACADÉMICA                                      |
+----------------------------------------------------------------------------------------+
| Periodo Activo: [ 2026 - Primer Semestre ]            Régimen: (•) Semestral ( ) Trimestral|
|                                                                                        |
| Escala de Evaluación:                                                                  |
|   Nota Mínima: [ 1.0 ]   Nota Máxima: [ 7.0 ]   Aprobación: [ 4.0 ]   Exigencia: [ 60% ]|
|                                                                                        |
| Cumplimiento Normativo:                                                                |
|   [✓] Aplicar Decreto 67/2018 (Evaluación Auténtica y Formativa)                       |
|   [✓] Bloqueo de Modificación de Notas tras Cierre Semestral                           |
|   [✓] Registro de Auditoría de Firmas Digitales para Superintendencia                  |
|                                                                                        |
|   [ GUARDAR Y APLICAR A TODOS LOS CURSOS ]                                            |
+----------------------------------------------------------------------------------------+
```

### 3.3 Paso a Paso 2: Gestión de la Nómina Docente y Asignación de Cursos
1. **Ingresar al Módulo Docentes:** Seleccione **Directorio > Nómina de Profesores**.
2. **Registrar Nuevo Docente:** Presione el botón azul **"+ Agregar Docente"** e ingrese RUT, Nombres, Apellidos, Correo institucional y Título profesional.
3. **Asignar Carga Horaria y Asignaturas:** En la ficha del docente, seleccione los cursos asignados (ej. *1° Medio A - Matemáticas*) y defina las horas pedagógicas semanales.
4. **Designar Jefaturas de Curso:** Active la casilla **"Profesor Jefe"** para asignar la administración integral del curso y la emisión de informes de personalidad.

---

## 👩‍🏫 4. MÓDULO 2: GUÍA PASO A PASO PARA PROFESORES Y DOCENTES

### 4.1 Perfil y Atribuciones del Rol Docente
El **Docente Titular / Profesor Jefe** gestiona el registro de asistencia diaria, el ingreso de calificaciones sumativas y formativas, el leccionario de clases y las observaciones pedagógicas.

### 4.2 Paso a Paso 1: Ingreso Rápido de Calificaciones con Teclado
1. **Seleccionar Curso y Asignatura:** En el panel principal, haga clic en su tarjeta de asignatura asignada (ej. *2° Medio B — Lengua y Literatura*).
2. **Abrir Planilla Matricial:** Seleccione la pestaña **"Planilla de Notas"**.
3. **Ingreso Ágil por Teclado:**
   - Haga clic en la primera casilla de nota.
   - Digite las notas directamente con números enteros (ejemplo: digite `68` para ingresar `6.8`, o `55` para `5.5`). El sistema formatea automáticamente el decimal.
   - Presione la tecla **Enter** o la **Flecha Abajo (↓)** para avanzar al siguiente estudiante de la lista.
   - Use las **Flechas Izquierda/Derecha (← / →)** para cambiar de columna de evaluación.
4. **Auto-Guardado Inteligente:** Cada calificación se guarda de manera atómica e instantánea con indicador verde `✓ Guardado`.
5. **Cálculo de Promedios en Tiempo Real:** El sistema recalcula promedios ponderados y situaciones finales al instante, destacando en rojo las notas inferiores a 4.0.

```
+----------------------------------------------------------------------------------------+
| PLANILLA MATRICIAL DE NOTAS — 2° MEDIO B (LENGUAJE)                                     |
+----------------------------------------------------------------------------------------+
| N° | Estudiante               | RUN          | N1 (30%) | N2 (30%) | N3 (40%) | PROM   |
+----+--------------------------+--------------+----------+----------+----------+--------+
| 01 | Álvarez Soto, Matías     | 22.104.891-2 |   6.5    |   5.8    |   6.2    |  6.2   |
| 02 | Bravo Castillo, Isidora  | 21.984.321-K |   4.2    |   3.8    |   5.0    |  4.4   |
| 03 | Contreras Vera, Joaquín  | 22.451.782-4 |   7.0    |   6.8    |   [ 6.5] |  6.7   |  <- [Foco Actual]
| 04 | Díaz Muñoz, Valentina    | 22.319.450-8 |   3.5    |   4.0    |   4.5    |  4.1   |
+----+--------------------------+--------------+----------+----------+----------+--------+
| 💡 TIP: Usa las flechas ↑↓←→ y digita '65' para ingresar un 6.5 de inmediato.         |
+----------------------------------------------------------------------------------------+
```

### 4.3 Paso a Paso 2: Registro del Libro de Clases y Asistencia Diaria
1. **Módulo Asistencia:** Diríjase a **Libro de Clases > Control de Asistencia**.
2. **Seleccionar Fecha y Bloque Horario:** El sistema precarga la fecha actual.
3. **Marcar Estados de Asistencia:**
   - **(P)** Presente (Valor predeterminado para agilizar la toma).
   - **(A)** Ausente (El apoderado recibe notificación automática si está configurado).
   - **(J)** Ausente Justificado con certificado médico o carta de apoderado.
   - **(Atr)** Atraso con registro de minutos.
4. **Firmar Registro de Asistencia:** Presione el botón **"Firmar Asistencia Digital"** con su clave o token Supereduc para sellar el bloque conforme a la Circular 482.

---

## 🎒 5. MÓDULO 3: GUÍA PASO A PASO PARA ESTUDIANTES Y ALUMNOS

### 5.1 Perfil y Atribuciones del Rol Estudiante
El **Estudiante** accede a su portal personal para consultar su avance académico, calendario de evaluaciones, anotaciones formativas, horario de clases y material pedagógico compartido.

### 5.2 Paso a Paso 1: Consulta de Calificaciones y Semáforo de Rendimiento
1. **Acceder a "Mis Calificaciones":** En el menú principal, haga clic en la sección **Calificaciones**.
2. **Vista por Asignaturas:** Visualice la tabla completa de materias con sus promedios ponderados actuales.
3. **Semáforo Visual de Desempeño:**
   - 🟢 **Verde (6.0 a 7.0):** Desempeño Sobresaliente.
   - 🔵 **Azul (5.0 a 5.9):** Desempeño Bueno / Aprobado.
   - 🟡 **Amarillo (4.0 a 4.9):** Desempeño Suficiente / En Observación.
   - 🔴 **Rojo (1.0 a 3.9):** Desempeño Insuficiente / Requiere Refuerzo Pedagógico.
4. **Detalle de Evaluaciones:** Haga clic sobre cualquier asignatura para desplegar la rúbrica detallada, fecha de aplicación y comentarios pedagógicos del profesor.

```
+----------------------------------------------------------------------------------------+
| PORTAL DEL ESTUDIANTE: RESUMEN DE NOTAS Y PROMEDIO GENERAL                              |
+----------------------------------------------------------------------------------------+
| Estudiante: Sofía Valenzuela | Curso: 1° Medio A | Promedio General: 6.3 🟢            |
+----------------------------------------------------------------------------------------+
| Asignatura               | Docente Titular       | Evaluaciones Parciales | Promedio   |
+--------------------------+-----------------------+------------------------+------------+
| Matemáticas              | Prof. Roberto Gómez   | 6.5  •  5.8  •  6.2    |    6.2 🟢  |
| Lengua y Literatura      | Prof. María Sepúlveda | 7.0  •  6.8  •  6.5    |    6.8 🟢  |
| Historia y Geografía     | Prof. Carlos Morales  | 5.5  •  6.0  •  5.8    |    5.8 🔵  |
| Ciencias Naturales       | Prof. Andrea Fuentes  | 6.0  •  6.4  •  6.2    |    6.2 🟢  |
| Idioma Extranjero: Inglés| Prof. John Smith      | 6.8  •  7.0  •  6.9    |    6.9 🟢  |
+----------------------------------------------------------------------------------------+
| [ DESCARGAR INFORME PARCIAL EN PDF ]           [ VER HORARIO SEMANAL DE CLASES ]       |
+----------------------------------------------------------------------------------------+
```

### 5.3 Paso a Paso 2: Horario de Clases y Próximas Evaluaciones
1. **Menú Horario:** Haga clic en **Horario de Clases**.
2. **Planificación Semanal:** Revise los bloques horarios del día, la sala asignada y el profesor titular.
3. **Calendario de Pruebas:** Consulte la columna lateral **"Próximas Evaluaciones"** con fechas límite y temarios de estudio.

---

## 👨‍👩‍👧 6. MÓDULO 4: GUÍA PASO A PASO PARA PADRES Y APODERADOS

### 6.1 Perfil y Atribuciones del Rol Apoderado
El **Apoderado / Tutor Legal** realiza el seguimiento formativo de sus pupilos, revisa la asistencia en tiempo real, consulta notas parciales, recibe comunicaciones oficiales y autoriza salidas pedagógicas.

### 6.2 Paso a Paso 1: Selector Multi-Pupilo (Familias con más de un estudiante)
1. **Conmutador de Estudiantes:** En la parte superior de la pantalla, encontrará el selector desplegable **"Pupilo Activo"**.
2. **Seleccionar Hijo/a:** Haga clic sobre el nombre del estudiante para cambiar de ficha escolar de manera instantánea sin tener que cerrar sesión.

```
+----------------------------------------------------------------------------------------+
| PORTAL DE APODERADOS — SEGUIMIENTO FAMILIAR                                            |
+----------------------------------------------------------------------------------------+
| Seleccionar Pupilo: [ (•) Lucas González (3° Básico A)  |  ( ) Valentina González (1° Medio B) ] |
+----------------------------------------------------------------------------------------+
| Resumen de Lucas González:                                                             |
|   • Asistencia Acumulada: 96.5% (Cumple requisito de promoción MINEDUC ≥ 85%)          |
|   • Promedio Parcial: 6.4 (3 evaluaciones registradas este mes)                        |
|   • Anotaciones: 2 Positivas 🌟 / 0 Negativas                                          |
|                                                                                        |
| Últimas Notificaciones del Establecimiento:                                            |
|   ✉️ Citación a Reunión de Apoderados: Jueves 15 de Octubre - 18:30 hrs. (Gimnasio)    |
|   📋 Autorización de Salida Pedagógica a Museo Interactivo Mirador (MIM): [ FIRMAR ]   |
+----------------------------------------------------------------------------------------+
```

### 6.3 Paso a Paso 2: Justificación de Inasistencias y Descarga de Certificados
1. **Módulo Asistencia y Justificaciones:** Vaya a **Asistencia > Mis Pupilos**.
2. **Justificar Inasistencia:** Presione el botón **"Justificar Inasistencia"**, seleccione la fecha y adjunte el comprobante médico (formato PDF o imagen).
3. **Certificados Escolares Oficiales:** Ingrese a **Certificados** para descargar al instante:
   - Certificado de Alumno Regular (con código QR y verificación electrónica).
   - Informe Parcial de Notas para Becas o Beneficios Sociales.

---

## ❓ 7. PREGUNTAS FRECUENTES (FAQ) Y RESOLUCIÓN DE DUDAS

| Pregunta Frecuente | Solución Oficial |
| :--- | :--- |
| **¿Qué hago si olvidé mi contraseña de acceso?** | En la pantalla de inicio de sesión (`/login`), haga clic en *"¿Olvidaste tu contraseña?"* e ingrese su correo institucional. Recibirá un enlace de restablecimiento seguro. Si no tiene correo institucional, solicite el reseteo al Administrador Escolar de su colegio. |
| **¿Cómo ingreso notas con decimales en la planilla?** | Puede ingresar notas escribiendo directamente dos dígitos (ejemplo: `65` para un `6.5`). También puede escribir `6.5` o `6,5` según su teclado. |
| **¿El apoderado puede modificar datos del estudiante?** | No. Por seguridad y normativa MINEDUC, la modificación de RUN, nombres o cursos solo puede ser efectuada por la Dirección o Secretaría del establecimiento. |
| **¿Cómo imprimo el informe oficial en PDF?** | En cualquiera de los módulos, presione el botón institucional **"Imprimir / Guardar como PDF"** o use el atajo de teclado **Ctrl + P** (o **Cmd + P** en Mac). El diseño está preconfigurado para ajustarse a hoja tamaño Carta/A4 con membrete. |

---

## 🟢 8. CERTIFICACIÓN DE ENTREGA Y LUZ VERDE

```
====================================================================================================
                        CERTIFICADO DE CONFORMIDAD Y HOMOLOGACIÓN DE MANUALES
====================================================================================================
  Documento: Manual de Usuario Oficial Ilustrado para Administradores, Profesores, Alumnos y Apoderados
  Versión: v2.4.0-PROD
  Revisión Técnica: APROBADO 100% (Maicol R., Malcom Marcelo, Lucas P., Frank M.)
  Cumplimiento DoD: Manual por Rol (✓) • Lenguaje Accesible (✓) • Listo para Entrega (✓)
====================================================================================================
```
