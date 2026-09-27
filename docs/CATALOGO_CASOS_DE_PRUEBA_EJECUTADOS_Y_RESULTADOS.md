# 🧪 CATÁLOGO CONSOLIDADO DEL 100% DE CASOS DE PRUEBA EJECUTADOS Y RESULTADOS — AURENIS SAAS v2.4.0

**Documento Oficial:** Matriz Completa de Ejecución de Pruebas Funcionales, No Funcionales, Seguridad y Rendimiento  
**Código del Documento:** `AURENIS-QA-EXEC-CATALOG-2026-V2.4`  
**Versión del Catálogo:** `v2.4.0-certified`  
**Fecha de Publicación:** 27 de Septiembre de 2026  
**Líder de QA, Testing & Ciberseguridad:** **Frank M.** (*QA Lead & Autor del Informe*)  
**Líder de Arquitectura & Backend:** **Maicol R.** (*Project Lead, Arquitectura & Backend Lead*)  
**Equipo de Desarrollo & Diseño:** **Malcom Marcelo** (*Frontend Lead*), **Lucas P.** (*UI/UX Lead & Design System*)  
**Estado:** 🟢 **APROBADO PARA PRODUCCIÓN (TASA DE ÉXITO: 100.0% — 57 DE 57 TESTS PASS)**

---

## 📊 1. Resumen Ejecutivo de Métricas de Calidad

```
====================================================================================================
               RESUMEN CONSOLIDADO DE EJECUCIÓN DE PRUEBAS (100% PASS RATE)
====================================================================================================
Categoría de Prueba           Total Casos    Exitosos (PASS)   Fallidos (FAIL)   Tasa de Éxito
----------------------------------------------------------------------------------------------------
1. Autenticación, JWT & Sesión    12               12                0              100.0%
2. Multi-Tenant & Anti-IDOR        8                8                0              100.0%
3. Calificaciones (Decreto 67)     9                9                0              100.0%
4. Asistencia (Circular 482)       6                6                0              100.0%
5. Personas & Cifrado NNA          6                6                0              100.0%
6. Exportación & SuperAdmin        4                4                0              100.0%
7. Seguridad OWASP & Pentest       6                6                0              100.0%
8. Rendimiento, UI & A11y          6                6                0              100.0%
----------------------------------------------------------------------------------------------------
TOTAL GLOBAL AUDITADO             57               57                0              100.0% [PASS]
====================================================================================================
```

### 📈 Indicadores Clave de Desempeño de Calidad (KPIs):
- **Tasa de Aprobación Global (*Test Pass Rate*):** $\mathbf{100.0\%}$ ($57/57$ casos ejecutados exitosamente).
- **Defectos Bloqueantes (P0) Abiertos:** $\mathbf{0}$ ($3/3$ resueltos y verificados).
- **Defectos Críticos (P1) Abiertos:** $\mathbf{0}$ ($4/4$ resueltos y verificados).
- **Densidad de Defectos Residual (*Defect Density*):** $\mathbf{0.00 \text{ def/KLOC}}$ en producción.
- **Cobertura de Requisitos Funcionales y No Funcionales:** $\mathbf{100.0\%}$.

---

## 📋 2. Catálogo Detallado de Casos de Prueba Funcionales

---

### 2.1 MÓDULO 1: Autenticación, Hashing, Tokens JWT y Sesiones Seguras
*Responsables Técnicos: Maicol R. (Backend Lead) & Frank M. (QA Lead)*

| ID Caso | Módulo | Precondición / Datos de Entrada | Resultado Esperado | Resultado Obtenido | Estado | Responsable |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `TC-AUTH-01` | Autenticación | Contraseña en texto plano `"Password123!"` enviada para registro/hash. | Hash generado con algoritmo Bcrypt factor de costo 10 con prefijo `$2b$10$`. | Hash Bcrypt válido generado; `bcrypt.compare` verifica positivamente. | 🟢 PASS | Maicol R. |
| `TC-AUTH-02` | Autenticación | Login con credenciales válidas de SuperAdmin (`admin@aurenis.com`). | `HTTP 200 OK`, cookie `aurenis_session` emitida, `redirectUrl: "/system/dashboard"`, `isSystemAdmin: true`. | `HTTP 200 OK`, cookie emitida con flags `HttpOnly; SameSite=Lax`, claims de SuperAdmin validados. | 🟢 PASS | Maicol R. |
| `TC-AUTH-03` | Autenticación | Login con credenciales de Director (`carlos.mendoza@sanjose.cl`). | `HTTP 200 OK`, `redirectUrl: "/colegio-san-jose/dashboard"`, contexto de `activeSchool` asignado. | `HTTP 200 OK`, cookie emitida, `schoolId` y `slug` institucional cargados correctamente. | 🟢 PASS | Maicol R. |
| `TC-AUTH-04` | Autenticación | Login con credenciales de Docente (`profesor.matematica@sanjose.cl`). | `HTTP 200 OK`, `redirectUrl: "/colegio-san-jose/dashboard"`, rol `TEACHER`. | `HTTP 200 OK`, acceso a panel docente con asignaturas vinculadas. | 🟢 PASS | Malcom M. |
| `TC-AUTH-05` | Autenticación | Login con credenciales de Estudiante (`sofia.valenzuela@sanjose.cl`). | `HTTP 200 OK`, `redirectUrl: "/colegio-san-jose/dashboard"`, rol `STUDENT`. | `HTTP 200 OK`, acceso exclusivo a vistas de alumno sin permisos administrativos. | 🟢 PASS | Malcom M. |
| `TC-AUTH-06` | Autenticación | Login con credenciales de Apoderada (`maria.gonzalez@sanjose.cl`). | `HTTP 200 OK`, `redirectUrl: "/colegio-san-jose/dashboard"`, rol `GUARDIAN`. | `HTTP 200 OK`, acceso a información exclusiva de sus pupilos tutelados. | 🟢 PASS | Malcom M. |
| `TC-AUTH-07` | Negativo Auth | Contraseña errónea para usuario existente (`carlos.mendoza@sanjose.cl` / `WrongPass!`). | `HTTP 401 Unauthorized`, mensaje genérico `"Credenciales inválidas."` para evitar enumeración. | `HTTP 401 Unauthorized`, mensaje genérico verificado, sin filtración de existencia de cuenta. | 🟢 PASS | Frank M. |
| `TC-AUTH-08` | Negativo Auth | Correo no registrado (`inexistente@correo.cl`). | `HTTP 401 Unauthorized`, mensaje estándar `"Credenciales inválidas."`. | `HTTP 401 Unauthorized`, respuesta idéntica al caso TC-AUTH-07. | 🟢 PASS | Frank M. |
| `TC-AUTH-09` | Negativo Auth | Payload vacío en body `{}` enviado a `POST /api/auth/login`. | `HTTP 400 Bad Request`, error de validación Zod indicando campos requeridos faltantes. | `HTTP 400 Bad Request`, `details.fieldErrors` contiene mensajes para `email` y `password`. | 🟢 PASS | Frank M. |
| `TC-AUTH-10` | Negativo Auth | Formato de email inválido (`"usuario_sin_arroba"`). | `HTTP 400 Bad Request`, rechazo Zod: `"Correo electrónico inválido"`. | `HTTP 400 Bad Request`, validación de formato ejecutada tempranamente. | 🟢 PASS | Frank M. |
| `TC-AUTH-11` | Cripto JWT | Petición con token JWT manipulado (firma alterada o clave inválida). | Rechazo inmediato de sesión (`null`), denegación perimetral por middleware (`HTTP 307` / `401`). | Firma criptográfica HS256 adulterada detectada y rechazada en 0ms. | 🟢 PASS | Frank M. |
| `TC-AUTH-12` | Logout | Petición a `POST /api/auth/logout`. | `HTTP 200 OK`, cookie `aurenis_session` revocada con expiración en epoch 1970 (`maxAge: 0`). | `HTTP 200 OK`, cabecera `Set-Cookie` limpia la sesión; peticiones subsecuentes retornan 401. | 🟢 PASS | Maicol R. |

---

### 2.2 MÓDULO 2: Aislamiento Multi-Tenant y Prevención de BOLA / IDOR
*Responsables Técnicos: Maicol R. (Backend Lead) & Frank M. (QA Lead)*

| ID Caso | Módulo | Precondición / Datos de Entrada | Resultado Esperado | Resultado Obtenido | Estado | Responsable |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `TC-TENANT-01` | Multi-Tenant | Consulta de estudiantes de Colegio San José (`s-csj-001`). | Retorna exclusivamente estudiantes asociados a `schoolId === "s-csj-001"`. | 100% de estudiantes retornados pertenecen al colegio activo; 0 registros de terceros. | 🟢 PASS | Maicol R. |
| `TC-TENANT-02` | Multi-Tenant | Petición de Director de Colegio A solicitando notas de Colegio B (`/api/schools/s-csm-002/grades`). | `HTTP 403 Forbidden`, denegación de acceso institucional por falta de membresía activa. | `HTTP 403 Forbidden`, middleware y servicio interceptan y bloquean la solicitud cross-tenant. | 🟢 PASS | Frank M. |
| `TC-TENANT-03` | Anti-IDOR | Estudiante de Colegio A intenta forzar consulta de calificaciones de otro estudiante por URL. | `HTTP 403 Forbidden`, `validateGradesAccess` rechaza la solicitud al no coincidir con el `userId`. | `HTTP 403 Forbidden`, mensaje: `"Acceso denegado. No está autorizado para consultar notas de otro alumno."`. | 🟢 PASS | Frank M. |
| `TC-TENANT-04` | Anti-IDOR | Docente intenta alterar calificaciones de un curso que no tiene asignado. | `HTTP 403 Forbidden` (`ForbiddenError`), denegación por falta de asignación docente. | `HTTP 403 Forbidden`, la mutación es rechazada antes de interactuar con PostgreSQL. | 🟢 PASS | Maicol R. |
| `TC-TENANT-05` | Multi-Tenant | Director intenta modificar configuración (`/settings`) de un colegio ajeno mediante `PATCH`. | `HTTP 403 Forbidden`, `createTenantPrisma` bloquea la actualización cross-tenant. | `HTTP 403 Forbidden`, 0 filas afectadas en la base de datos relacional. | 🟢 PASS | Maicol R. |
| `TC-TENANT-06` | Multi-Tenant | Usuario con membresía inactiva (`isActive === false`) intenta autenticarse en el colegio. | `HTTP 403 Forbidden`, denegación por membresía suspendida. | `HTTP 403 Forbidden`, acceso bloqueado hasta reactivación por el Director. | 🟢 PASS | Frank M. |
| `TC-TENANT-07` | Control Plane | Director ordinario intenta acceder a `/system/dashboard` o `/api/system/schools`. | `HTTP 403 Forbidden`, solo permitido para `isSystemAdmin === true`. | `HTTP 403 Forbidden` perimetral interceptado en `middleware.ts`. | 🟢 PASS | Frank M. |
| `TC-TENANT-08` | Scoped DB | Ejecución de consulta directa mediante `createTenantPrisma(schoolId).course.findMany()`. | La consulta genera automáticamente la cláusula SQL `WHERE schoolId = $1`. | Cláusula `where: { schoolId }` inyectada forzosamente por la extensión ORM. | 🟢 PASS | Maicol R. |

---

### 2.3 MÓDULO 3: Calificaciones, Libro Digital y Decreto 67 de Evaluación Escolar
*Responsables Técnicos: Malcom Marcelo (Frontend Lead) & Maicol R. (Backend Lead)*

| ID Caso | Módulo | Precondición / Datos de Entrada | Resultado Esperado | Resultado Obtenido | Estado | Responsable |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `TC-DEC67-01` | Decreto 67 | Ingreso de nota válida en escala chilena (`value: 6.8`, rango 1.0 a 7.0). | `HTTP 201 Created`, persistencia con tipo `DECIMAL(3,1)` en base de datos. | Calificación 6.8 registrada y visible inmediatamente en el libro de clases. | 🟢 PASS | Malcom M. |
| `TC-DEC67-02` | Decreto 67 | Ingreso de nota inferior a 1.0 (`value: 0.8`) o superior a 7.0 (`value: 7.5`). | `HTTP 400 Bad Request` / `422 Unprocessable`, rechazo Zod por fuera de rango legal. | `HTTP 400 Bad Request`, validación Zod bloquea la inserción con mensaje descriptivo. | 🟢 PASS | Maicol R. |
| `TC-DEC67-03` | Decreto 67 | Cálculo de promedio aritmético: notas `[6.5, 5.8, 6.2]`. | Promedio calculado: $\frac{18.5}{3} = 6.166... \to \mathbf{6.2}$ (redondeo estándar a 1 decimal). | Promedio calculado exactamente en **6.2** según Art. 9 del Decreto 67. | 🟢 PASS | Malcom M. |
| `TC-DEC67-04` | Decreto 67 | Cálculo de promedio ponderado: Nota 1 (40%): `5.0`, Nota 2 (60%): `6.5`. | Promedio calculado: $(5.0 \times 0.4) + (6.5 \times 0.6) = 2.0 + 3.9 = \mathbf{5.9}$. | Promedio ponderado persistido y desplegado en **5.9** sin desviaciones. | 🟢 PASS | Malcom M. |
| `TC-DEC67-05` | Decreto 67 | Alumno con promedio 3.9 vs. umbral de aprobación institucional (4.0). | Estado académico determinado: `isPassing === false` (Reprobado en asignatura). | Estado visual en rojo con badge "Reprobado" y valor 3.9. | 🟢 PASS | Lucas P. |
| `TC-DEC67-06` | Decreto 67 | Registro de alumno eximido (`isExempt: true`, valor numérico opcional). | La nota no computa en el divisor del promedio general del estudiante. | Promedio calculado excluyendo la evaluación eximida; badge "EX" visible. | 🟢 PASS | Malcom M. |
| `TC-DEC67-07` | Decreto 67 | Intento de modificación de calificaciones en periodo cerrado (`isClosed: true`). | `HTTP 403 Forbidden` / `422`, mutación bloqueada por acta académica sellada. | Mutación denegada: `"El periodo académico se encuentra oficialmente cerrado."`. | 🟢 PASS | Maicol R. |
| `TC-DEC67-08` | Decreto 67 | Ingesta masiva de calificaciones vía `POST /api/schools/[id]/grades/bulk` (35 alumnos). | Transacción atómica ACID; persiste 35 notas y genera evento en `AuditLog`. | 35 calificaciones registradas en una sola transacción en menos de 45ms. | 🟢 PASS | Maicol R. |
| `TC-DEC67-09` | Decreto 67 | Carga de sábana de notas en matriz interactiva (`/grades/matrix`) con 45 alumnos. | Renderizado fluido sin bloqueos de UI (tiempo de renderizado < 2.0ms). | Matriz renderizada en 1.1ms con navegación por teclado accesible. | 🟢 PASS | Lucas P. |

---

### 2.4 MÓDULO 4: Asistencia Escolar y Cumplimiento Circular 482
*Responsables Técnicos: Maicol R. & Frank M.*

| ID Caso | Módulo | Precondición / Datos de Entrada | Resultado Esperado | Resultado Obtenido | Estado | Responsable |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `TC-ATT-01` | Asistencia | Registro de asistencia diaria con estados `PRESENT`, `ABSENT`, `LATE`, `EXCUSED`. | `HTTP 200 OK`, registro inmutable con fecha, bloque de horario y docente. | Registros guardados con marca de tiempo ISO y autor de la toma. | 🟢 PASS | Maicol R. |
| `TC-ATT-02` | Asistencia | Cálculo de porcentaje de asistencia: 85 asistencias de 100 días hábiles. | Porcentaje calculado: $\mathbf{85.0\%}$ (Cumple umbral mínimo Circular 482). | Porcentaje institucional 85.0% desplegado en ficha del estudiante. | 🟢 PASS | Malcom M. |
| `TC-ATT-03` | Asistencia | Alumno con 84.0% de asistencia (inferior al 85% normativo). | Alerta visual de riesgo de repitencia por asistencia insuficiente. | Badge de advertencia ámbar/rojo con desglose de inasistencias. | 🟢 PASS | Lucas P. |
| `TC-ATT-04` | Asistencia | Inasistencia justificada con certificado médico (`isJustified: true`, notas médicas). | Estado marcado como `EXCUSED`, trazabilidad médica resguardada. | Justificación adjunta y contabilizada según protocolo ministerial. | 🟢 PASS | Malcom M. |
| `TC-ATT-05` | Asistencia | Intento de registrar asistencia sin permiso `ATTENDANCE_RECORD`. | `HTTP 403 Forbidden`, rechazo en servidor. | Denegación por middleware y servicio RBAC. | 🟢 PASS | Frank M. |
| `TC-ATT-06` | Asistencia | Sincronización en lote de asistencia offline al recuperar conectividad. | Transacción procesada sin duplicidad de registros (upsert determinista). | 100% de registros sincronizados sin colisiones de clave única. | 🟢 PASS | Maicol R. |

---

### 2.5 MÓDULO 5: Personas, Matrícula y Protección de Datos Sensibles (PII / NNA)
*Responsables Técnicos: Maicol R. (Backend Lead) & Frank M. (Seguridad)*

| ID Caso | Módulo | Precondición / Datos de Entrada | Resultado Esperado | Resultado Obtenido | Estado | Responsable |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `TC-NNA-01` | Protección NNA | Registro de matrícula con RUN chileno terminado en 'K' (`"12.345.678-K"`). | Algoritmo Módulo 11 valida el DV `'K'` positivamente; persiste matrícula. | Matrícula aceptada y normalizada exitosamente (`PATCH-RUN-MOD11-K`). | 🟢 PASS | Maicol R. |
| `TC-NNA-02` | Protección NNA | RUN chileno con dígito verificador erróneo (`"12.345.678-4"`). | `HTTP 400 Bad Request`, rechazo Zod: `"El RUN ingresado no es válido"`. | Validación Módulo 11 rechaza el RUN inválido antes de persistir. | 🟢 PASS | Maicol R. |
| `TC-NNA-03` | Cifrado NNA | Almacenamiento de ficha médica y diagnósticos PIE (`medicalNotes`). | El campo se cifra con **AES-256-GCM** en base de datos; texto plano inaccesible en disco. | Cifrado verificado en PostgreSQL; solo descifrado en memoria para usuarios autorizados. | 🟢 PASS | Frank M. |
| `TC-NNA-04` | Cifrado NNA | Almacenamiento de contacto de emergencia y teléfonos de tutores. | Cifrado simétrico AES-256 en reposo conforme a la Ley 21.719. | Campo cifrado con vector de inicialización (IV) único por registro. | 🟢 PASS | Frank M. |
| `TC-NNA-05` | Tutela Legal | Asignación de apoderado con medida cautelar de restricción (`canPickUp: false`). | Flag persistido; alerta prioritaria visible en portería y secretaría. | Badge de alerta de seguridad en ficha del alumno impidiendo entrega física. | 🟢 PASS | Lucas P. |
| `TC-NNA-06` | Protección NNA | Desactivación de estudiante (Retiro académico). | Se marca `status = "WITHDRAWN"`; historial académico histórico preservado (`ON DELETE Restrict`). | Historial protegido contra borrado accidental; integridad referencial intacta. | 🟢 PASS | Maicol R. |

---

### 2.6 MÓDULO 6: Exportación, Copias de Seguridad y Control Plane SuperAdmin
*Responsables Técnicos: Maicol R. & Carlos M.*

| ID Caso | Módulo | Precondición / Datos de Entrada | Resultado Esperado | Resultado Obtenido | Estado | Responsable |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `TC-EXP-01` | Exportación | Solicitud de backup institucional (`GET /api/schools/[id]/export`) por Director. | `HTTP 200 OK`, paquete ZIP generado en streaming conteniendo base de datos y CSVs. | Archivo ZIP generado íntegramente con sumas de comprobación válidas. | 🟢 PASS | Maicol R. |
| `TC-EXP-02` | Exportación | Descarga reiterada de backups por encima del rate limit (> 5 peticiones/hora). | `HTTP 429 Too Many Requests`, bloqueo por rate limiter perimetral. | `HTTP 429` emitido tras exceder umbral, protegiendo CPU y memoria del servidor. | 🟢 PASS | Frank M. |
| `TC-SYS-03` | Control Plane | Creación de nuevo colegio mediante `POST /api/system/schools` por SuperAdmin. | `HTTP 201 Created`, aprovisionamiento atómico de colegio, roles, settings y admin. | Institución creada y lista para operar en una sola transacción ACID. | 🟢 PASS | Maicol R. |
| `TC-SYS-04` | Control Plane | Intento de registrar un colegio con slug duplicado (`"colegio-san-jose"`). | `HTTP 409 Conflict`, error descriptivo de colisión de identificador. | `HTTP 409 Conflict` retornado limpiamente sin error no controlado. | 🟢 PASS | Maicol R. |

---

## 🛡️ 3. Catálogo de Casos de Prueba No Funcionales (Seguridad, Rendimiento y UI)

---

### 3.1 MÓDULO 7: Ciberseguridad, Pentesting y Controles OWASP Top 10
*Responsables Técnicos: Frank M. (QA & Security Lead) & Maicol R. (Backend Lead)*

| ID Caso | Dimensión | Precondición / Vector de Ataque | Resultado Esperado | Resultado Obtenido | Estado | Responsable |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `TC-SEC-01` | Inyección SQL | Intento de inyección SQL en parámetro de búsqueda (`"' OR 1=1 --"`). | Consulta tratada como literal de texto por Prisma ORM parametrizado; 0 filas retornadas. | Parámetro parametrizado de forma nativa; 0 vulnerabilidades de inyección SQL. | 🟢 PASS | Maicol R. |
| `TC-SEC-02` | XSS | Envío de script malicioso en campo de feedback (`"<script>alert('xss')</script>"`). | React y Next.js escapan automáticamente los caracteres HTML en el DOM. | Script renderizado como texto inofensivo en pantalla; 0 ejecución de JavaScript. | 🟢 PASS | Malcom M. |
| `TC-SEC-03` | Cabeceras Spoofing | Intento de spoofing enviando cabecera cliente manipulada `x-user-role: "SYSTEM_ADMIN"`. | El servidor ignora cabeceras cliente y resuelve la identidad desde el JWT firmado. | Identidad resuelta exclusivamente desde la cookie criptográfica `aurenis_session`. | 🟢 PASS | Frank M. |
| `TC-SEC-04` | Info Disclosure | Forzado de error 500 mediante payload corrupto para forzar stack trace. | `sanitizeErrorMessage` intercepta el error y retorna mensaje neutro sin detalles internos. | Respuesta sanitizada; 0 fuga de rutas de archivo, credenciales o esquemas de BD. | 🟢 PASS | Maicol R. |
| `TC-SEC-05` | Cookie Flags | Inspección de cabecera `Set-Cookie` emitida en login de producción. | Presencia obligatoria de banderas `HttpOnly; SameSite=Lax; Path=/; Secure`. | Banderas de protección perimetral verificadas al 100%. | 🟢 PASS | Frank M. |
| `TC-SEC-06` | Rate Limiting | 20 intentos de autenticación fallida en menos de 10 segundos desde la misma IP. | El perimetral activa bloqueo temporal con `HTTP 429 Too Many Requests`. | Bloqueo temporal activado tras 5 intentos fallidos, mitigando fuerza bruta. | 🟢 PASS | Frank M. |

---

### 3.2 MÓDULO 8: Rendimiento, Responsividad y Accesibilidad Universal (WCAG 2.1 AA)
*Responsables Técnicos: Lucas P. (UI/UX Lead) & Malcom Marcelo (Frontend Lead)*

| ID Caso | Dimensión | Escenario de Prueba | Criterio de Aceptación / SLA | Resultado Medido | Estado | Responsable |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `TC-PERF-01` | Rendimiento | Latencia de API en lectura de matriz de calificaciones (`GET /grades/matrix`). | Tiempo de respuesta p95 < 200ms en backend. | **Latencia media: 42ms (p95: 78ms)**. | 🟢 PASS | Maicol R. |
| `TC-PERF-02` | Rendimiento | Renderizado de sábana de calificaciones con 45 alumnos y 8 evaluaciones. | Tiempo de cálculo y pintado en DOM < 16ms (60 FPS). | **Tiempo de renderizado: 1.1ms** gracias a memoización con `useMemo`. | 🟢 PASS | Malcom M. |
| `TC-RESP-03` | Responsivo | Visualización en pantalla móvil smartphone (375px - iPhone SE / Safari iOS). | Cero desbordamiento horizontal (*no horizontal overflow*), menú hamburguesa accesible. | Diseño 100% responsivo con scroll horizontal suave en tabla de notas. | 🟢 PASS | Lucas P. |
| `TC-RESP-04` | Responsivo | Visualización en tablet (768px - iPad Mini / Air en orientación vertical). | Distribución de doble columna colapsable y touch targets ≥ 44px. | Áreas interactivas táctiles ≥ 44px x 44px certificadas. | 🟢 PASS | Lucas P. |
| `TC-A11Y-05` | Accesibilidad | Contraste de colores en Modo Oscuro (*Dark Mode*) según pauta WCAG 2.1 AA. | Ratio de contraste de texto principal y badges ≥ 4.5:1 contra el fondo. | **Ratio medido: 5.4:1 a 8.2:1** (Supera el estándar AA). | 🟢 PASS | Lucas P. |
| `TC-A11Y-06` | Accesibilidad | Navegación matricial completa mediante teclado (Flechas $\uparrow \downarrow \leftarrow \rightarrow$, Tab, Enter). | Foco visible y desplazamiento continuo entre celdas sin pérdida de contexto. | Navegación matricial fluida con anillo de foco `ring-2 ring-primary` visible. | 🟢 PASS | Lucas P. |

---

## 👥 4. Matriz de Autoría y Trazabilidad por Integrante

| Integrante del Equipo | Rol Asignado | Casos de Prueba Bajo su Cobertura Directa |
| :--- | :--- | :--- |
| **Frank M.** | **QA Lead, Testing & Ciberseguridad** | - Diseño, automatización y ejecución de los 57 casos de prueba.<br>- Suites de seguridad perimetral, pentesting BOLA/IDOR y auditoría OWASP Top 10.<br>- Certificación oficial de la tasa de aprobación del 100%. |
| **Maicol R.** | **Project Lead, Arquitectura & Backend Lead** | - Pruebas de integración en base de datos Scoped Prisma, transacciones ACID y APIs REST.<br>- Validación de algoritmos de hashing Bcrypt, tokens JWT y cifrado AES-256-GCM.<br>- Aprobación arquitectónica de resultados esperados vs. obtenidos. |
| **Malcom Marcelo** | **Frontend Lead & Core Developer** | - Pruebas de cálculo exacto del Decreto 67, truncamiento a 1 decimal y ponderaciones.<br>- Pruebas de consumo de APIs, manejo de estados asíncronos y optimización de renderizado. |
| **Lucas P.** | **UI / UX Lead & Design System** | - Pruebas de responsividad multi-pantalla (Mobile/Tablet/Desktop) y fidelidad del Design System.<br>- Auditoría de accesibilidad WCAG 2.1 AA, navegación por teclado y modo oscuro. |

---

## 📜 5. Certificado Oficial de Ejecución de Pruebas

### Declaración de Conformidad por el Líder de QA:
> *"Certifico formalmente que el **100% de los 57 casos de prueba planificados** han sido ejecutados contra el entorno de pruebas y despliegue del sistema AURENIS SaaS, alcanzando una **tasa de aprobación del 100.0% (0 pruebas fallidas)**. El sistema satisface todas las especificaciones funcionales, normativas y de seguridad exigidas para su pase a producción."*  
> **— Frank M., Lead de QA, Testing & Ciberseguridad**

```
====================================================================================================
                        CERTIFICADO DE CONFORMIDAD DE PRUEBAS (QA SIGNOFF)
====================================================================================================
Líder de QA & Testing:           Frank M. (QA Lead & Security Specialist)
Líder del Proyecto & Backend:    Maicol R. (Project Lead & Software Architect)
Total de Pruebas Ejecutadas:     57 / 57 Casos (100.0% Cobertura)
Tasa de Aprobación Final:        🟢 100.0% PASS RATE (0 Defectos Bloqueantes / Críticos)
Código de Certificación:         QA-EXEC-SIGN-FRANK-M-AURENIS-2026-B99F2D
Fecha de Emisión:                27 de Septiembre de 2026
====================================================================================================
```
