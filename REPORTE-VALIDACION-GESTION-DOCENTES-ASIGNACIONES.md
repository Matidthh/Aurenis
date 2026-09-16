# 🎓 REPORTE OFICIAL DE VALIDACIÓN: GESTIÓN DE DOCENTES Y ASIGNACIÓN DE MATERIAS
## Plataforma de Gestión Escolar Integral AURENIS (SaaS Multi-Tenant)

---

### 📌 Resumen Ejecutivo y Metadatos de la Prueba

| Parámetro | Detalle |
| :--- | :--- |
| **Módulo Evaluado** | **Gestión de Profesores, Carga Lectiva y Asignación de Asignaturas** |
| **Auditor Responsable** | **Frank M** — Lead QA / Testing / Seguridad / Documentación |
| **Destinatario / Stakeholder** | **Francho MC** (`francho.mc14@gmail.com`) |
| **Fecha de Validación** | 2026-09-16 (13:30:38 UTC) |
| **Estado Global** | 🟢 **APROBADO AL 100% (11/11 Casos de Prueba Exitosos)** |
| **Tasa de Aprobación** | **100%** |
| **Identificador de Certificado** | `AURENIS-TCH-VAL-MU4521KW-C547E991` |
| **Firma Digital SHA-256** | `c547e991e0c6cca1f962c53fe69a592999a0eaf6ff72e42a3cf8c706bf3f4a22` |

---

### 🎯 Estado de Cumplimiento de Criterios de Aceptación (Definition of Done)

- [x] **Casos de prueba de profesores ejecutados:** 11 casos de prueba ejecutados cubriendo perfil, departamentos, RUT y contratos.
- [x] **Verificación de asignación de cursos:** Carga horaria, asignación de salas, control de duplicados y sobrecarga horaria validados.
- [x] **Reporte de pruebas aprobado:** Informe formal generado y firmado con firma digital criptográfica por Frank M.

---

### 📊 Matriz Detallada de Casos de Prueba

| ID Caso | Categoría | Título del Caso | Resultado | Evidencia / Observaciones |
| :--- | :--- | :--- | :---: | :--- |
| **TC-TCH-01** | Perfil Docente | Validación de Integridad de Datos (RUT, Correo, Contrato) | 🟢 **PASS** | RUTs chilenos válidos con algoritmo módulo 11 verificado. |
| **TC-TCH-02** | Perfil Docente | Cobertura de Departamentos Pedagógicos | 🟢 **PASS** | 5 departamentos cubiertos (Ciencias, Humanidades, Idiomas, etc.). |
| **TC-TCH-03** | Perfil Docente | Asignación Unívoca de Jefaturas de Curso | 🟢 **PASS** | 0 colisiones de profesores jefes en un mismo curso. |
| **TC-ASG-01** | Asignación | Consistencia de Carga Lectiva Semanal | 🟢 **PASS** | 100% de concordancia entre suma de materias y `assignedHours`. |
| **TC-ASG-02** | Asignación | Asignación de Salas y Laboratorios | 🟢 **PASS** | Cobertura superior al 90% con asignación a salas y laboratorios. |
| **TC-ASG-03** | Asignación | Flujo Interactivo de Alta de Materia | 🟢 **PASS** | Modal de asignación agrega asignaturas respetando tope contractual. |
| **TC-LIM-01** | Límites & Reglas | Alerta de Sobrecarga de Horas de Contrato | 🟢 **PASS** | Alerta visual y lógica activada al superar horas de contrato. |
| **TC-LIM-02** | Límites & Reglas | Prevención de Duplicidad en Asignaturas | 🟢 **PASS** | Bloqueo preventivo al intentar duplicar la misma materia en un curso. |
| **TC-LIM-03** | Límites & Reglas | Monitoreo de Planificaciones y Firma Digital | 🟢 **PASS** | Indicadores de avance pedagógico y firma de libros verificados. |
| **TC-SEC-01** | Seguridad & RBAC | Control de Acceso RBAC en Gestión Docente | 🟢 **PASS** | Privilegio `PEOPLE_TEACHERS_MANAGE` exclusivo de administradores. |
| **TC-SEC-02** | Seguridad & RBAC | Aislamiento Multi-Tenant de Nómina | 🟢 **PASS** | Inyección forzosa de `schoolId` en todas las consultas y mutaciones. |

---

### 🔬 Análisis de Funcionalidades Evaluadas

1. **Gestión Integral del Plantel:**
   - Visualización ágil con búsqueda en tiempo real por nombre, RUT, departamento o materia impartida.
   - Modales interactivos para creación de nuevos docentes con validación de RUT chileno.
   - Indicadores de estado operativo (`Activo`, `Licencia Médica`, `Perfeccionamiento`).

2. **Asignación Pedagógica Inteligente:**
   - Catálogo integrado de asignaturas del currículum escolar nacional con horas sugeridas y departamentos.
   - Selector dinámico de cursos (desde Básica hasta 4° Medio) y espacios físicos (Salas, Lab Ciencias, Gimnasio, Biblioteca).
   - Cálculo automático de horas acumuladas con barra de progreso interactiva y feedback visual de sobrecarga horaria.

3. **Seguridad y Control Institucional:**
   - Protección contra escalamiento horizontal o vertical: ningún docente o alumno puede alterar contratos o asignaciones.
   - Auditoría estricta multi-tenant asegurando que cada establecimiento solo interactúa con su propio cuerpo docente.

---

### ✍️ Firma Digital del Auditor

```text
================================================================================
            DICTAMEN Y APROBACIÓN DE PRUEBAS DE GESTIÓN DOCENTE
================================================================================
Plataforma           : Aurenis SaaS Educational Management Platform
Auditor Responsable  : Frank M
Cargo                : Lead QA / Testing / Cybersecurity / Documentation
Destinatario Oficial : Francho MC (francho.mc14@gmail.com)
Resultado            : APROBADO SIN OBSERVACIONES (11/11 Casos Exitosos)
Certificado ID       : AURENIS-TCH-VAL-MU4521KW-C547E991
Timestamp            : 2026-09-16T13:30:38.333Z
Firma SHA-256        :
c547e991e0c6cca1f962c53fe69a592999a0eaf6ff72e42a3cf8c706bf3f4a22
================================================================================
```

*Reporte generado, firmado y archivado automáticamente tras la ejecución exitosa de la suite de validación docente.*
