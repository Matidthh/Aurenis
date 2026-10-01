# INFORME TÉCNICO DE DEMOSTRACIÓN: INGRESO DE NOTAS, CÁLCULO DE PROMEDIOS Y FICHAS DE ESTUDIANTES
## Proyecto AURENIS — Plataforma Integral de Gestión Escolar Multi-Tenant
**Fase:** Ejecución  
**Fecha de Emisión:** 01 de Octubre de 2026  
**Responsable Técnico del Entregable:** Malcom Marcelo (Frontend Developer & Lógica de Cliente)  
**Co-Responsables de Aprobación:** Frank M. (QA & Gestión Curricular), Lucas P. (UI/UX & Design System), Maicol R. (Arquitectura & Backend)

---

## 1. RESUMEN EJECUTIVO Y ESTADO DE CUMPLIMIENTO (DoD 3/3 - 100%)

El presente informe documenta las pruebas funcionales, de rendimiento y de integración extremo a extremo correspondientes a la demostración en vivo de la **Planilla Matricial de Calificaciones Decreto 67**, el motor reactivo de **Cálculo de Promedios Ponderados** y la **Ficha 360° del Estudiante**.

| # | Criterio de Aceptación (Definition of Done) | Estado | Responsable | Evidencia Técnica / Módulo |
|---|---|---|---|---|
| 1 | **Flujo de carga de notas en directo probado** | ✅ CUMPLIDO | Malcom Marcelo | Grilla matricial interactiva, navegación por flechas/Enter/Tab, auto-avance, conversión `65 -> 6.5` y autoguardado en `<16ms`. |
| 2 | **Cálculo de promedios visualizado en pantalla** | ✅ CUMPLIDO | Frank M. / Malcom M. | Motor aritmético Decreto 67, ponderaciones $N_1 \dots N_5$, semaforización cromática cuádruple, histograma y métricas de aprobación en tiempo real. |
| 3 | **Mapeo completo** | ✅ CUMPLIDO | Lucas P. / Maicol R. | Trazabilidad 360° entre Planilla de Notas (`/grades`), Directorio de Alumnos (`/students`) y Ficha Individual (`student-full-profile-modal.tsx`). |

---

## 2. DETALLE TÉCNICO DE LOS CRITERIOS DE ACEPTACIÓN

### 2.1 Criterio 1: Flujo de Carga de Notas en Directo Probado
- **Navegación Fluida por Teclado:**  
  Soporte completo de navegación bidireccional mediante teclas de dirección (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`), `Tab` / `Shift+Tab` y `Enter`.
- **Digitación Rápida a Dos Dígitos:**  
  El docente puede digitar enteros de dos dígitos (ej. `65`, `54`, `38`) los cuales se convierten de forma automática y transparente a la escala oficial chilena con punto decimal (`6.5`, `5.4`, `3.8`).
- **Auto-Avance Configurable:**  
  Selector de dirección de salto automático tras presionar `Enter` (Hacia Abajo para calificar al siguiente estudiante en la misma evaluación, o Hacia la Derecha para calificar todas las evaluaciones del mismo estudiante).
- **Validación de Rango y Sanitización:**  
  Control estricto que rechaza valores fuera del rango $[1.0, 7.0]$ con retroalimentación visual inmediata.
- **Rendimiento $\mathbf{<16ms}$ (60 FPS):**  
  Implementación modular basada en `React.memo` y `useCallback` en `grade-matrix-row.tsx` y `grade-matrix-cell.tsx`, evitando el re-renderizado innecesario de las filas adyacentes.

### 2.2 Criterio 2: Cálculo de Promedios Visualizado en Pantalla (Decreto 67)
- **Fórmula de Promedio Ponderado Oficial:**  
  $$\text{Promedio} = \frac{\sum (N_i \times \%_i)}{\sum \%_i}$$  
  Con redondeo ministerial estándar a un decimal.
- **Semaforización Cromática Cuádruple de Alto Contraste (WCAG 2.1 AA):**
  - 🔴 **Rojo ($<4.0$):** Alerta crítica / Insuficiente (Riesgo de reprobación).
  - 🟡 **Ámbar ($4.0 - 4.9$):** Suficiente / Límite de aprobación.
  - 🟢 **Verde ($5.0 - 5.9$):** Bueno / Desempeño satisfactorio.
  - 🔵 **Azul / Índigo ($\ge 6.0$):** Muy Bueno / Sobresaliente.
- **Panel Estadístico del Curso en Vivo:**  
  Visualización instantánea de:
  - Promedio General del Curso.
  - Tasa de Aprobación (%) y Alumnos en Riesgo.
  - Desviación Estándar.
  - Histograma cromático de distribución de notas por tramos.

### 2.3 Criterio 3: Mapeo Completo (Planilla $\leftrightarrow$ Ficha 360°)
- **Interconexión Directa:**  
  Al hacer clic en cualquier estudiante de la planilla o del directorio escolar, se despliega la **Ficha 360° del Estudiante** con 6 pestañas auditables:
  1. `General`: Promedio general, % de asistencia anual, hoja de vida (anotaciones) y alertas tempranas UTP.
  2. `Académico`: Historial de asignaturas, notas parciales $N_1 \dots N_4$ y estado de aprobación.
  3. `Asistencia Diaria`: Calendario de presencialidad, inasistencias justificadas y atrasos.
  4. `Apoderados & Contacto`: Titular, suplente, parentesco, teléfono y correo electrónico.
  5. `Salud & JUNAEB`: Ficha médica, alergias, grupo sanguíneo y beneficios de alimentación.
  6. `Conducta`: Anotaciones positivas, llamados de atención y acuerdos pedagógicos.
- **Aislamiento y Consistencia Multi-Tenant:**  
  Garantía de coherencia de datos vinculados al `schoolId` y al `courseId` sin fugas de información.

---

## 3. GUION DE PRUEBA EN VIVO PARA DEMOSTRACIÓN ANTE LA COMISIÓN

1. **Paso 1 (Ingreso de Notas):** Acceder a la vista de Planilla de Notas (`/colegio-los-alerces/grades` o `/prototipo-figma` pestaña Calificaciones). Seleccionar una celda, digitar `68` y verificar la conversión a `6.8` con salto automático a la siguiente fila.
2. **Paso 2 (Recálculo de Promedios):** Modificar la nota de un estudiante en riesgo (ej. cambiar `3.2` a `5.8`) y constatar el cambio cromático en tiempo real de rojo a verde tanto en la fila como en el promedio del curso y en el histograma superior.
3. **Paso 3 (Apertura de Ficha 360°):** Hacer clic sobre el nombre del estudiante para abrir la ficha integral, revisar la pestaña académica con sus notas parciales sincronizadas y verificar la emisión del Certificado de Alumno Regular.

---

## 4. DICTAMEN DE CALIDAD Y APROBACIÓN

- **Compilación (`next build`):** Exitosa sin errores de tipado TypeScript ni fallos de dependencias.
- **Linter (`next lint`):** 0 errores, 0 advertencias.
- **Conformidad Técnica:** 100% aprobada por el equipo de ingeniería de AURENIS.
