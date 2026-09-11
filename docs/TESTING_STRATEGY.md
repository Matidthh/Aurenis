# ESTRATEGIA INTEGRAL DE TESTING Y ASEGURAMIENTO DE CALIDAD (QA) — AURENIS v1.0
**Documento Técnico Oficial y Normativo de Control de Calidad, Pruebas y Seguridad**  
**Versión:** 1.0.0  
**Fecha de Publicación:** 10 de Septiembre de 2026  
**Estado:** 🟢 **APROBADO Y CERTIFICADO COMO GUÍA OFICIAL DEL EQUIPO**  
**Líderes Técnicos Responsables:**  
- **Frank M** — QA, Testing, Seguridad & Documentación  
- **Maicol R** — Backend Lead & Arquitectura Técnica  

---

## 1. Resumen Ejecutivo y Objetivos

El presente documento establece el marco normativo y metodológico de **Aseguramiento de Calidad (QA)** para el ciclo de vida completo del desarrollo de **AURENIS** (plataforma SaaS multi-tenant de gestión académica y escolar).

### 1.1 Objetivos de Calidad
1. **Garantizar la Tolerancia Cero a Fugas Multi-Tenant:** Asegurar que ningún usuario o proceso bajo ningún supuesto pueda acceder o mutar datos de una institución ajena (*Cross-Tenant Isolation*).
2. **Validar la Integridad RBAC:** Probar rigurosamente que cada uno de los 5 roles del sistema opere exclusivamente dentro de sus atribuciones autorizadas.
3. **Asegurar la Experiencia de Usuario Multi-Dispositivo:** Certificar la funcionalidad y legibilidad en entornos móviles, tablets y escritorios de alta densidad.
4. **Verificar la Alta Disponibilidad y Rendimiento:** Mantener tiempos de respuesta de API inferiores a 200 ms (p95) y compilaciones limpias con 0 errores TypeScript/ESLint.

---

## 2. Estrategia Integral de Testing por Capas (Pirámide de Calidad)

La estrategia de pruebas de AURENIS se articula sobre una arquitectura de 5 dimensiones que cubren todo el ciclo de desarrollo (desde el commit local hasta el despliegue en producción):

```
                                ┌─────────────────────────┐
                                │   E2E & Pruebas Humano  │
                                │   (Flujos Críticos UI)  │
                                ├─────────────────────────┤
                                │ Pruebas de Rendimiento  │
                                │  (Latencia API / Carga) │
                                ├─────────────────────────┤
                                │   Pruebas Responsive    │
                                │  (Mobile, Tablet, Desk) │
                                ├─────────────────────────┤
                                │  Pruebas de Seguridad   │
                                │ (Tenant/RBAC/Anti-Tamper│
                                ├─────────────────────────┤
                                │ Pruebas de Integración  │
                                │ (Servicios/APIs/Prisma) │
                                ├─────────────────────────┤
                                │    Pruebas Unitarias    │
                                │ (Zod/Cripto/Validadores)│
                                └─────────────────────────┘
```

---

### 2.1 Pruebas Unitarias (Lógica Pura y Validaciones)
* **Validadores Zod:** Verificación exhaustiva de rangos de notas (mínimo 1.0, máximo 7.0, aprobación 4.0, precisión a 1 decimal) y esquemas de entrada.
* **Criptografía:** Generación y validación de hashes Bcrypt con factor de costo 10 en `lib/auth/password.ts`.
* **Motor de Permisos:** Evaluación determinista de `assertPermission`, resolución de comodín `*` para `SYSTEM_ADMIN` y control de excepciones `ForbiddenError`.

---

### 2.2 Pruebas de Integración y Servicios
* **Onboarding Atómico:** Transacciones ACID completas en `school.service.ts` (colegio, configuración, roles, usuario admin y membresía inicial con reversión automática ante fallos).
* **Flujos Académicos:** Enrolamiento de estudiantes en cursos, asignación horaria de docentes y persistencia de notas con promedios ponderados.

---

### 2.3 Pruebas de Seguridad y Autorización (RBAC & Multi-Tenant)
* **Aislamiento Multi-Tenant (Anti-IDOR):** Comprobación mediante interceptor ORM `createTenantPrisma(schoolId)` inyectando filtros obligatorios y bloqueando activamente intentos de mutación foránea.
* **Protección de Sesión (Anti-Tampering):** Verificación de firma criptográfica HS256 en cookies JWT HttpOnly/Secure y rechazo inmediato ante tokens alterados.

---

### 2.4 Pruebas de Diseño Adaptativo (Responsive Testing)
* **Smartphone (375px a 428px):** Menú hamburguesa colapsable, formularios apilados verticalmente, tablas con desplazamiento horizontal suave y áreas táctiles de mínimo 44px.
* **Tablet (768px a 1024px):** Distribución balanceada de paneles, navegación fluida para docentes en aula y soporte táctil para planillas de notas.
* **Desktop (1280px a 1920px):** Uso de contenedores centrados (`max-w-7xl`) con espacio negativo equilibrado, sin estiramientos no intencionados de texto.
* **Accesibilidad Visual:** Cumplimiento de contraste WCAG AA (ratio mínimo 4.5:1).

---

### 2.5 Pruebas de Rendimiento y SLAs de Carga
* **Latencia de API (p95):** Menor a 200 ms en endpoints de lectura y consulta.
* **Autenticación:** Login con hash Bcrypt y emisión de JWT en menos de 150 ms.
* **Renderizado SSR:** Carga inicial de dashboards en menos de 500 ms mediante consultas paralelas `Promise.all`.

---

## 3. Clasificación y Niveles de Severidad de Bugs

Se definió una matriz estandarizada de 4 niveles con tiempos de atención (SLA) claros:

| Nivel de Severidad | Impacto en el Sistema | Ejemplos Representativos | SLA de Respuesta |
| :--- | :--- | :--- | :---: |
| **Bloqueante (Severity 1)** | Fuga de datos multi-tenant, brecha de seguridad en JWT, caída total de la app o falla de compilación. | Un colegio visualiza notas de otra institución; falla crítica en la autenticación que bloquea el login a todos los usuarios. | Inmediato (< 2 horas) |
| **Crítico (Severity 2)** | Funcionalidad nuclear inoperable sin alternativa (*workaround*) viable. | Cálculo erróneo de promedios finales de un curso; falla al guardar actas de notas; imposibilidad de registrar asistencia. | Máximo 8 horas |
| **Medio (Severity 3)** | Falla operativa en flujo secundario o con método alternativo disponible. | Filtro de búsqueda que no responde pero permite ordenar alfabéticamente; defecto menor en vista tablet que no oculta datos. | Máximo 48 horas |
| **Leve (Severity 4)** | Discrepancia cosmética menor o errata tipográfica. | Desalineación de 2px en un padding; falta de acento en texto de ayuda; ajuste visual menor. | Próximo Sprint |

### 3.1 Criterios Detallados por Nivel de Severidad

#### Nivel 1: Bloqueante (Blocker / S1)
* **Definición:** El defecto compromete la seguridad estructural, viola el aislamiento de datos o detiene por completo la operación de la plataforma.
* **Ejemplos Concretos:**
  * Un usuario del Colegio San José logra consultar o mutar datos del Colegio Santa María (violación de aislamiento tenant).
  * El middleware falla en validar la firma JWT y permite llamadas anónimas a `/system/*` o `/api/schools/*`.
  * La aplicación no compila (`npm run build` falla) o arroja error 500 irrecuperable en el inicio.
* **Acción Inmediata:** Detención de releases, freeze de código y asignación prioritaria al Backend Lead y QA Lead.

#### Nivel 2: Crítico (Critical / S2)
* **Definición:** Una funcionalidad nuclear de negocio queda inoperable y no existe ningún método alternativo (*workaround*) para que el usuario cumpla su labor.
* **Ejemplos Concretos:**
  * Los docentes no pueden guardar notas en una evaluación debido a un error de tipado en el endpoint.
  * El cálculo del promedio general de un alumno genera valores inconsistentes fuera de la escala configurada.
  * El formulario de matrícula de nuevos estudiantes no persiste el registro.
* **Acción Inmediata:** Corrección en hotfix durante la jornada laboral.

#### Nivel 3: Medio (Major / S3)
* **Definición:** Un flujo secundario presenta errores, o una funcionalidad principal tiene un fallo, pero el usuario puede completar la tarea mediante una vía alternativa.
* **Ejemplos Concretos:**
  * El filtro de búsqueda por apellido en la nómina de alumnos no responde, pero la ordenación alfabética funciona.
  * Un botón de acción en tablet requiere dos toques debido a un problema de z-index con el menú flotante.
  * Un mensaje de error muestra un código técnico en lugar de un texto traducido amigable.
* **Acción Inmediata:** Programación para el sprint en curso.

#### Nivel 4: Leve (Minor / S4)
* **Definición:** Inconsistencias cosméticas, tipográficas o de espaciado que no alteran la lógica de negocio ni impiden la interacción del usuario.
* **Ejemplos Concretos:**
  * Desalineación de 2 píxeles en el padding de una tarjeta de información.
  * Falta de un acento en el texto secundario de ayuda de un campo de formulario.
  * Color de hover en un enlace con contraste ligeramente menor al deseado pero legible.
* **Acción Inmediata:** Corrección en backlog general o tareas de pulido de diseño.

---

## 4. Configuración de Datos de Prueba (Datasets Estandarizados)

Para garantizar la reproducibilidad exacta de las pruebas manuales y automatizadas, el sistema dispone de un **conjunto de datos maestro (*Master Test Dataset*)** sincronizado tanto en el sembrado de base de datos (`prisma/seed.ts`) como en el simulador de pruebas de memoria (`lib/db/mock-db.ts`).

---

### 4.1 Dataset de Instituciones Educativas (Tenants)

| Parámetro / Atributo | Institución 1: "Colegio San José" (Principal) | Institución 2: "Colegio Santa María" (Control Aislamiento) |
| :--- | :--- | :--- |
| **ID Interno (`schoolId`)** | `school-csj-001` | `school-csm-999` |
| **Slug de URL** | `colegio-san-jose` | `colegio-santa-maria` |
| **Código Institucional** | `CSJ-001` | `CSM-999` |
| **Ciudad / País** | Santiago, Chile | Concepción, Chile |
| **Zona Horaria** | `America/Santiago` | `America/Santiago` |
| **Régimen Académico** | Semestral (`SEMESTER`) | Trimestral (`TRIMESTER`) |
| **Escala Numérica** | Min: `1.0` / Max: `7.0` / Aprobación: `4.0` | Min: `1.0` / Max: `7.0` / Aprobación: `4.0` |
| **Precisión Decimal** | `1` decimal | `1` decimal |
| **Color Institucional** | `#0284c7` (Azul Escolar) | `#059669` (Verde Esmeralda) |
| **Estado** | `ACTIVE` | `ACTIVE` |

---

### 4.2 Dataset de Cuentas de Usuario y Credenciales de Prueba

> 🔒 **Nota de Seguridad de Testing:** Todas las contraseñas de prueba están cifradas con Bcrypt (costo 10). Las claves planas son para uso exclusivo en entornos locales y de QA.

| Rol en Aurenis | Nombre Completo | Correo Electrónico | Contraseña de Prueba | Contexto / Colegio Asignado |
| :--- | :--- | :--- | :--- | :--- |
| **Super Administrador** | SuperAdmin Aurenis | `admin@aurenis.com` | `AurenisSuperAdmin2026!` | Global (`isSystemAdmin: true`) |
| **Director (School Admin)** | Carlos Mendoza | `director@sanjose.cl` | `AdminCSJ2026!` | Colegio San José (`school-csj-001`) |
| **Docente (Matemáticas)** | Roberto Gómez | `profesor.matematica@sanjose.cl` | `Profesor2026!` | Colegio San José (`tp-roberto`) |
| **Estudiante 1** | Sofía Valenzuela | `sofia.valenzuela@sanjose.cl` | `Estudiante2026!` | Colegio San José — 1° Medio A |
| **Estudiante 2** | Mateo Silva | `mateo.silva@sanjose.cl` | `Estudiante2026!` | Colegio San José — 1° Medio A |
| **Estudiante 3** | Valentina Rojas | `valentina.rojas@sanjose.cl` | `Estudiante2026!` | Colegio San José — 1° Medio A |
| **Estudiante 4** | Lucas Muñoz | `lucas.munoz@sanjose.cl` | `Estudiante2026!` | Colegio San José — 1° Medio A |
| **Estudiante 5** | Isidora Castro | `isidora.castro@sanjose.cl` | `Estudiante2026!` | Colegio San José — 1° Medio A |
| **Apoderada (Tutora)** | María González | `maria.gonzalez@sanjose.cl` | `Apoderado2026!` | Tutora legal de Sofía Valenzuela |

---

### 4.3 Dataset Académico: Cursos, Asignaturas y Evaluaciones

* **Periodo Lectivo Actual:** `Primer Semestre 2026` (`period-csj-2026-s1`), Año 2026, Estado: `isCurrent: true`, `isClosed: false`.
* **Nivel Educativo:** `Enseñanza Media` (`EM`), Orden: 2.
* **Cursos Registrados:**
  1. `1° Medio A` (`course-1ma`): Año 2026, Grado 1, Letra A. (5 alumnos matriculados).
  2. `2° Medio A` (`course-2ma`): Año 2026, Grado 2, Letra A.
* **Asignaturas y Carga Docente en 1° Medio A:**
  * **Matemáticas** (`subj-csj-1ma-mat`): Código `MAT-1MA`, 6 hrs/sem. Docente titular: *Roberto Gómez*.
  * **Lenguaje y Comunicación** (`subj-csj-1ma-len`): Código `LEN-1MA`, 6 hrs/sem.
  * **Historia y Geografía** (`subj-csj-1ma-his`): Código `HIS-1MA`, 4 hrs/sem.
* **Evaluaciones de Prueba en Matemáticas:**
  1. *Control 1: Álgebra y Ecuaciones Lineales* (Ponderación 25%).
  2. *Prueba Parcial: Funciones y Gráficos* (Ponderación 35%).
  3. *Taller Grupal: Geometría Analítica* (Ponderación 40%).

---

### 4.4 Comando de Sembrado e Inicialización de Datos

Para inicializar o reiniciar los datos de prueba en el entorno local o de CI/CD:
```bash
# Sembrado en base de datos relacional
npm run db:seed

# Verificación de integridad en memoria (17 pruebas automatizadas)
npm test
```

---

## 5. Ciclo de Vida de Ejecución de Pruebas (Gates de Calidad CI/CD)

Todo cambio de código en el repositorio debe atravesar los siguientes filtros automáticos e irrevocables antes de fusionarse a la rama principal (`main`):

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PIPELINE DE CALIDAD CI/CD                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. VALIDACIÓN ESTÁTICA:                                                     │
│    $ npm run lint                                                           │
│    • 0 errores de ESLint.                                                   │
│    • 0 advertencias críticas.                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. CERTIFICACIÓN DE SEGURIDAD, RBAC & TENANTS:                              │
│    $ npm test (scripts/qa-security-test.ts)                                 │
│    • 38 de 38 pruebas aprobadas (100% PASS).                                │
│    • Matriz de Login Positivo, Casos Negativos, Sesiones/Logout y Rutas     │
│      Protegidas (DoD 4/4), RBAC, Multi-Tenant, Zod y Audit Trail.           │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. COMPILACIÓN DE PRODUCCIÓN:                                               │
│    $ npm run build                                                          │
│    • Tipado TypeScript estricto verificado sin errores.                     │
│    • Generación correcta de Server Components y rutas estáticas/dinámicas.  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Aprobación y Acta de Conformidad Técnica

Este plan de pruebas y aseguramiento de calidad ha sido revisado, contrastado con la arquitectura backend y formalmente aprobado por el equipo líder de AURENIS.

```
══════════════════════════════════════════════════════════════════════════════════
               ACTA DE APROBACIÓN TÉCNICA — ESTRATEGIA DE QA AURENIS
══════════════════════════════════════════════════════════════════════════════════

Por medio de la presente, el equipo técnico certifica que la Estrategia Integral
de Testing, la Matriz de Severidad de Defectos y los Datasets de Prueba aquí
documentados representan el estándar normativo vigente para la plataforma AURENIS.

Aprobado conjuntamente por:

________________________________________        ________________________________________
Frank M                                         Maicol R
QA, Testing, Seguridad & Documentación          Backend Lead & Arquitectura Técnica
AURENIS Quality & Assurance                     AURENIS Core Engineering

Fecha de Aprobación: 10 de Septiembre de 2026   Fecha de Aprobación: 10 de Septiembre de 2026
Estado del Build: 100% PASS (17/17 Superadas)   Vigencia: Ciclo de Desarrollo v1.0
══════════════════════════════════════════════════════════════════════════════════
```
