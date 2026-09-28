# 🎬 GUION Y DATOS DE PRUEBA PARA DEMO EN VIVO ANTE LA COMISIÓN EVALUADORA
## Plataforma AURENIS — Sistema Integral de Gestión Escolar Multi-Tenant
**Fase:** Ejecución  
**Tiempo Total Estimado:** 15 minutos  
**Fecha de Preparación:** 28 de Septiembre de 2026  
**Responsables del Equipo:**  
- 💻 **Malcom Marcelo:** Demostración de Frontend, UI Interactiva y Planilla Decreto 67  
- 👑 **Maicol R.:** Defensa de Arquitectura Multi-Tenant, Backend y Seguridad RBAC  
- 🎨 **Lucas P.:** Recorrido de UX/UI, Accesibilidad WCAG 2.1 AA y Design System  
- 🛡️ **Frank M.:** Evidencias QA, Pruebas E2E y Resiliencia  

---

## ⏱️ PARTE 1: GUION DE DEMOSTRACIÓN ESTRUCTURADO CON TIEMPOS

```
====================================================================================================
CRONOGRAMA DE DEMOSTRACIÓN EN VIVO (15 MINUTOS)
====================================================================================================
Minuto      Bloque / Hito de la Demo           Acción en Pantalla                  Expositor
----------------------------------------------------------------------------------------------------
00:00-02:00 1. Apertura y Propuesta de Valor   Landing Page & Arquitectura          Maicol R.
02:00-05:00 2. Acceso y Multi-Tenant           Login & Selector de Colegios         Maicol R. & Lucas P.
05:00-09:00 3. Libro Digital & Decreto 67      Planilla Matricial con Autoguardado  Malcom Marcelo
09:00-12:00 4. Roles RBAC y Conmutación 1-Clic Botonera Dev & Vista Estudiante      Malcom Marcelo & Frank M.
12:00-15:00 5. Resiliencia, Auditoría & Q&A    Manejo de Errores & Preguntas        Equipo Completo
====================================================================================================
```

### Bloque 1: Apertura y Propuesta de Valor (Minuto 0:00 - 02:00)
- **URL:** `https://ais-pre-bqv2pznvico2lk54rpqpay-628536854522.us-west2.run.app/`
- **Narrativa:** Presentar AURENIS como la solución integral SaaS para establecimientos educacionales chilenos. Destacar arquitectura cloud-native, cumplimiento normativo MINEDUC (Decreto 67) y aislamiento de datos multi-tenant por colegio.
- **Acción:** Breve paneo por el hero interactivo y métricas de impacto escolar.

### Bloque 2: Acceso Seguro y Aislamiento Multi-Tenant (Minuto 02:00 - 05:00)
- **URL:** `/login` y `/select-school`
- **Narrativa:** Demostrar cómo los usuarios inician sesión con cookies `httpOnly`, cómo se resuelve el slug del colegio y cómo el middleware de autorización impide acceder a datos de otra institución educativa (defensa contra BOLA/IDOR).
- **Acción:** Acceder al Colegio San José (`colegio-san-jose`) y mostrar el Dashboard Directivo con KPIs en tiempo real de asistencia y cobertura curricular.

### Bloque 3: Libro de Clases Digital & Planilla Matricial Decreto 67 (Minuto 05:00 - 09:00)
- **URL:** `/colegio-san-jose/grades`
- **Narrativa:** Demostración del componente estrella desarrollado por Malcom Marcelo: planilla matricial de notas de alto rendimiento (< 16ms por renderizado con `React.memo` y `useCallback`). Explicar el cumplimiento del Decreto 67 (cálculo ponderado vs. promedio simple, evaluaciones formativas y sumativas, y truncamiento oficial Art. 9).
- **Acción en Vivo:** 
  1. Ingresar notas en evaluaciones N1 a N5 usando el teclado numérico.
  2. Activar el botón *"Poblar con Datos Demo"* para simular el curso completo en 1 segundo.
  3. Demostrar el autoguardado y persistencia inmediata en PostgreSQL.
  4. Mostrar el comportamiento táctil responsivo y la columna fija con nombres de alumnos.

### Bloque 4: Roles RBAC y Conmutación Instantánea (Minuto 09:00 - 12:00)
- **URL:** En cabecera de la app (`#header-dev-role-selector-btn`)
- **Narrativa:** Mostrar la flexibilidad del control de acceso basado en roles sin necesidad de cerrar e iniciar sesión manualmente durante la evaluación.
- **Acción en Vivo:**
  1. Abrir la botonera de roles en la cabecera.
  2. Conmutar a **Profesor**: mostrar cómo el menú se adapta al Libro de Clases y Asistencia.
  3. Conmutar a **Estudiante**: mostrar cómo la vista pasa a modo solo lectura y solo se visualizan las asignaturas propias.
  4. Conmutar a **SuperAdmin**: mostrar acceso a la gestión global de colegios.

### Bloque 5: Resiliencia ante Fallos, Auditoría y Ronda de Preguntas (Minuto 12:00 - 15:00)
- **URL:** `/prototipo-figma` (Suite de Auditoría y Resiliencia)
- **Narrativa:** Demostrar que el sistema no se cae ante errores de red o excepciones HTTP 500/503. Mostrar los Error Boundaries y la suite de pruebas E2E con 100% de criterios DoD aprobados.
- **Acción:** Abrir el modal de Criterios DoD y responder a las preguntas técnicas de la comisión evaluadora.

---

## 📊 PARTE 2: DATOS DE PRUEBA LIMPIOS Y LLAMATIVOS PREPARADOS

### 1. Establecimiento Educacional Principal
- **Nombre:** Colegio San José de las Condes
- **Slug del Tenant:** `colegio-san-jose`
- **RBD MINEDUC:** `10245-8`
- **Periodo Académico:** Año Escolar 2026

### 2. Cuentas de Acceso Demo Precargadas (1 Clic)
| Rol | Nombre | Correo Electrónico | Contraseña | Perfil y Acceso |
| :--- | :--- | :--- | :--- | :--- |
| **Director Escolar** | Carlos Mendoza | `director@sanjose.cl` | `AdminCSJ2026!` | Control directivo total, métricas ejecutivas y gestión de profesores. |
| **Docente Titular** | Roberto Gómez | `profesor.matematica@sanjose.cl` | `Profesor2026!` | Matemáticas 1° Medio A, planilla de notas Decreto 67 y asistencia. |
| **Estudiante** | Sofía Valenzuela | `sofia.valenzuela@sanjose.cl` | `Estudiante2026!` | Ficha del alumno, boletín de notas y registro de asistencia. |
| **Apoderado** | Roberto Morales | `apoderado@sanjose.cl` | `Apoderado2026!` | Portal de apoderados con seguimiento de pupilos. |
| **SuperAdmin Plataforma** | Maicol Ramírez | `superadmin@aurenis.com` | `SuperAdmin2026!` | Administración multi-colegio, tenants y auditoría global. |

### 3. Asignaturas y Evaluaciones Oficiales Decreto 67
- **Curso:** 1° Medio A (Matemática)
- **Evaluaciones Configuradas:**
  - `N1`: Control 1 — Álgebra y Funciones (20% Sumativa)
  - `N2`: Taller Grupal de Geometría (15% Formativa)
  - `N3`: Prueba Parcial — Ecuaciones Cuadráticas (25% Sumativa)
  - `N4`: Laboratorio Computacional Geogebra (15% Formativa)
  - `N5`: Examen Síntesis Semestral Coef 2 (25% Sumativa)

### 4. Muestra de Alumnos de Alta Fidelidad
- **Valentina Álvarez Morales** (RUT: `21.458.912-3`) — Promedio 6.7, Asistencia 96%
- **Matías Bravo Sepúlveda** (RUT: `22.109.843-K`) — Promedio 5.6, Asistencia 91% (Validación Módulo 11 con DV 'K')
- **Isidora Cáceres Muñoz** (RUT: `21.890.342-1`) — Promedio 4.0, Alumna Programa PIE (Asistencia 84%)
- **Joaquín Donoso Fuenzalida** (RUT: `22.341.678-4`) — Promedio 6.2, Asistencia 98%

---

## 🚀 PARTE 3: PRUEBA DE FLUJO EN VIVO (CHECKLIST PREVIO AL EXAMEN)

- [x] **Conectividad Staging Cloud Run:** Servidor activo en `https://ais-pre-bqv2pznvico2lk54rpqpay-628536854522.us-west2.run.app`.
- [x] **Base de Datos PostgreSQL:** Semillas y esquemas Prisma migrados sin inconsistencias.
- [x] **Botonera de Conmutación de Roles:** Probada y funcional en < 300ms por cambio.
- [x] **Planilla de Notas:** Carga en < 16ms y guarda cambios con sincronización en PostgreSQL.
- [x] **Dispositivos Móviles:** Acceso verificado en Safari iOS y Chrome Android con touch-action optimizado.
- [x] **Linter y Compilación:** 0 advertencias, 0 errores, build verificado.

---
*Documento emitido y archivado en:* `/GUION-Y-DATOS-DEMO-EN-VIVO-COMISION.md`  
*Firma de Conformidad:* **Equipo Técnico AURENIS (Malcom Marcelo, Maicol R., Lucas P., Frank M.)**
