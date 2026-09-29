# ⚙️ GUÍA TÉCNICA Y MANUAL DE OPERACIONES, MANTENIMIENTO Y DESARROLLO — AURENIS SAAS v2.4.0

```
====================================================================================================
               REPÚBLICA DE CHILE — ECOSISTEMA DE GESTIÓN ESCOLAR MULTI-TENANT
                        MANUAL TÉCNICO OFICIAL PARA DEVOPS, SYSADMINS Y DESARROLLADORES
                           ESTÁNDAR ISO/IEC/IEEE 26514 & ISO/IEC 25010
====================================================================================================
```

---

## 📑 1. FICHA TÉCNICA Y CONTROL DE VERSIONES DEL DOCUMENTO

| Atributo | Especificación Técnica |
| :--- | :--- |
| **Código del Documento** | `AUR-MAN-OPS-2026-v2.4` |
| **Título del Manual** | Manual Técnico de Mantenimiento de Software, Operaciones y DevOps |
| **Plataforma Objetivo** | AURENIS — Educational Cloud Platform (Multi-Tenant SaaS) |
| **Versión del Sistema** | v2.4.0-PROD (Build ID: `aur-core-20260928-release`) |
| **Fecha de Publicación** | Septiembre de 2026 |
| **Clasificación de Seguridad** | Confidencial / Nivel 3 — Uso Restringido a SysAdmins y Equipo de Ingeniería |
| **Normativa de Cumplimiento** | Circular 482 / Ley 19.628 / OWASP Top 10:2021 / ISO/IEC 27001 |
| **Estado de Homologación** | **APROBADO Y CERTIFICADO PARA PRODUCCIÓN (LUZ VERDE ✅)** |

### 👥 Firmas de Responsabilidad del Equipo Técnico AURENIS

| Integrante | Rol en el Proyecto | Responsabilidad Técnica en el Manual |
| :--- | :--- | :--- |
| **👑 Maicol R.** | **Lead del Proyecto & Arquitectura** | Arquitectura general, esquemas de BD PostgreSQL, migraciones, aislamiento multi-tenant, APIs y runtime de servidor. |
| **💻 Malcom Marcelo** | **Frontend Developer** | Arquitectura cliente React 19 / Next.js App Router, estados reactivos, sincronización SSR y manejo de red. |
| **🎨 Lucas P.** | **UI / UX Designer & Design System** | Tokens de diseño, accesibilidad WCAG 2.1 AA, maquetación responsiva, layouts de impresión y ergonomía visual. |
| **🛡️ Frank M.** | **QA, Testing & Seguridad** | Auditoría OWASP, pentesting de APIs, verificación de scripts de mantenimiento, plan de contingencias y runbooks. |

---

## 🏛️ 2. ARQUITECTURA GENERAL DEL SISTEMA Y TOPOLOGÍA DE DESPLIEGUE

### 2.1 Stack Tecnológico Homologado

- **Runtime de Ejecución:** Node.js v20.x LTS / Alpine Linux en contenedores OCI.
- **Framework de Aplicación:** Next.js 15.2.x (App Router, Server Actions, API Routes con React 19).
- **Capa de Persistencia y ORM:** PostgreSQL 14+ con Prisma ORM v6.4.x (Cliente tipado con pooling optimizado).
- **Gestión de Sesiones & Criptografía:** Tokens JWT con algoritmo HMAC-SHA256 (`jose` / `bcryptjs` con 12 rondas de salt).
- **Validación de Esquemas:** Zod v3.24.x en capas de entrada/salida de servidor.
- **Aislamiento Multi-Tenant:** Cláusulas forzadas `where: { schoolId }` y middleware de autenticación/autorización RBAC server-side.

```
                                    ┌─────────────────────────────────────────┐
                                    │        Cloudflare / Cloud Armor         │
                                    │    (WAF, Anti-DDoS, SSL Termination)    │
                                    └────────────────────┬────────────────────┘
                                                         │ HTTPS (Port 443)
                                                         ▼
                                    ┌─────────────────────────────────────────┐
                                    │     Google Cloud Run / Load Balancer    │
                                    │   Contenedor Node.js 20 LTS (Aurenis)   │
                                    └────────────────────┬────────────────────┘
                                                         │
                                ┌────────────────────────┴────────────────────────┐
                                │                                                 │
                                ▼                                                 ▼
                 ┌─────────────────────────────┐                   ┌─────────────────────────────┐
                 │    Server Actions / APIs    │                   │   Next.js SSR & Static UI   │
                 │   (RBAC, Zod, Tenant Auth)  │                   │    (React 19 / Tailwind)    │
                 └──────────────┬──────────────┘                   └─────────────────────────────┘
                                │ Prisma Pool
                                ▼
                 ┌─────────────────────────────┐
                 │    Cloud SQL / PostgreSQL   │
                 │    (Multi-Tenant B-Tree)    │
                 └─────────────────────────────┘
```

---

## 💻 3. REQUISITOS DE HARDWARE, SOFTWARE Y VARIABLES DE ENTORNO

### 3.1 Requisitos Mínimos del Servidor (Entorno Host / VM / Contenedor)

- **CPU:** 2 vCPU (Mínimo recomendado para instancias de Cloud Run o VPS).
- **Memoria RAM:** 2 GB RAM (Producción base) / 4 GB RAM (Tráfico pico > 5.000 req/min).
- **Almacenamiento:** 20 GB SSD con IOPS aprovisionados para base de datos.
- **Conectividad:** Ancho de banda simétrico ≥ 100 Mbps con soporte TLS 1.3.

### 3.2 Matriz Canónica de Variables de Entorno (`.env`)

| Variable | Tipo / Formato | Requerido | Descripción Operativa |
| :--- | :--- | :---: | :--- |
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db?schema=public` | **SÍ** | Cadena de conexión JDBC/PostgreSQL al motor Cloud SQL o clúster local. |
| `JWT_SECRET` | String (Longitud ≥ 32 caracteres) | **SÍ** | Clave criptográfica maestra para firma y verificación de tokens de sesión. |
| `JWT_EXPIRES_IN` | String (ej: `8h`, `24h`) | **SÍ** | Tiempo de vida de los tokens de sesión. Estándar escolar: `8h`. |
| `NEXT_PUBLIC_APP_URL` | URL (`https://app.aurenis.cl`) | **SÍ** | URL canónica base para resolución de callbacks, redirecciones y assets. |
| `NODE_ENV` | `production` \| `development` | **SÍ** | Modo de ejecución del runtime de Node.js. |
| `PORT` | Entero (`3000`) | **SÍ** | Puerto TCP de escucha del servidor HTTP. |

---

## 🚀 4. CATÁLOGO DE COMANDOS DE DESARROLLO, BUILD Y TESTING

### 4.1 Comandos Básicos de Ciclo de Vida
```bash
# 1. Instalación determinista de dependencias
npm ci

# 2. Generación del cliente tipado de Prisma
npm run db:generate

# 3. Inicialización en modo desarrollo local (HMR en puerto 3000)
npm run dev

# 4. Verificación estática de tipos y linter
npm run lint

# 5. Compilación optimizada de producción
npm run build

# 6. Inicio del servidor productivo standalone
npm start
```

### 4.2 Comandos de la Suite de Calidad y Pruebas Automatizadas (QA & Seguridad)
```bash
# Ejecución de la suite completa de pruebas de seguridad y RBAC
npm test

# Verificación de re-test y parches de seguridad
npm run test:retest

# Pruebas específicas de aislamiento multi-tenant y prevención de BOLA/IDOR
npm run test:multitenant
npm run test:bola

# Pruebas de inyección SQL, XSS y sanitización de inputs
npm run test:injection

# Auditoría de dependencias y cálculo de vectores CVSS v3.1
npm run audit:findings
npm run audit:cvss
npm run audit:report
```

---

## 🛠️ 5. SECCIÓN OFICIAL DE SCRIPTS Y COMANDOS DE MANTENCIÓN

A continuación se detalla el conjunto de scripts implementados para la administración y mantenimiento preventivo y correctivo del software.

### 5.1 Comandos Rápidos de Mantención Registrados en `package.json`

| Comando NPM | Script Subyacente | Propósito Operativo |
| :--- | :--- | :--- |
| `npm run maint:healthcheck` | `scripts/maintenance-healthcheck.ts` | Diagnóstico integral en caliente: estado de variables, conexión DB, latencias, entidades y consumo de memoria. |
| `npm run maint:db-ops` | `scripts/maintenance-db-ops.ts` | Rutina de mantenimiento de base de datos: cardinalidad, análisis de registros huérfanos y sugerencias de `VACUUM ANALYZE`. |
| `npm run maint:backup` | `scripts/maintenance-db-backup.sh` | Ejecuta un volcado completo de PostgreSQL (`pg_dump -Fc`), genera checksum SHA-256 y aplica retención de 30 días. |
| `npm run db:migrate:status` | `scripts/migrate-status.ts` | Informa el estado de aplicación de las migraciones de Prisma frente al esquema actual. |
| `npm run db:migrate:deploy` | `scripts/migrate-deploy.ts` | Despliega de forma segura las migraciones pendientes sin interacción en entornos CI/CD. |
| `npm run db:migrate:rollback` | `scripts/migrate-rollback.ts` | Procedimiento guiado de reversión controlada de esquemas ante fallos de migración. |
| `npm run db:migrate:validate` | `scripts/migrate-validate.ts` | Valida la integridad del archivo `prisma/schema.prisma` y sus relaciones. |
| `npm run db:verify:indexes` | `scripts/verify-indexes.ts` | Comprueba que los índices B-Tree en `schoolId`, `email`, `rut` y `createdAt` estén activos. |
| `npm run db:verify:performance` | `scripts/verify-query-performance.ts` | Evalúa los tiempos de respuesta y planes de ejecución de consultas críticas. |

---

## 🗄️ 6. OPERACIONES AVANZADAS DE BASE DE DATOS POSTGRESQL

### 6.1 Procedimiento de Respaldo Manual y Automatizado

#### A. Volcado Completo con Compresión Custom (`pg_dump`)
```bash
# Respaldo completo binario con compresión y blobs
pg_dump -h [HOST] -p 5432 -U [USER] -Fc -b -v -f /var/backups/aurenis/aurenis_full_$(date +%Y%m%d_%H%M%S).dump [DATABASE_NAME]

# Generación del Checksum de Integridad
sha256sum /var/backups/aurenis/aurenis_full_*.dump > /var/backups/aurenis/checksums.sha256
```

#### B. Restauración de Base de Datos ante Contingencia (`pg_restore`)
```bash
# 1. Crear la base de datos limpia de destino (si aplica)
createdb -h [HOST] -U [USER] aurenis_db_restored

# 2. Restauración con limpieza previa de esquemas (-c) y multi-hilo (-j 4)
pg_restore -h [HOST] -U [USER] -d aurenis_db_restored -c -v -j 4 /var/backups/aurenis/aurenis_full_20260928_120000.dump
```

### 6.2 Rutina de Mantenimiento Preventivo de Índices y Espacio en Disco

Ejecutar semanalmente en ventanas de bajo tráfico (ej. Domingos 03:00 UTC-3):

```sql
-- 1. Actualización de estadísticas del optimizador de consultas
ANALYZE VERBOSE;

-- 2. Limpieza de tuplas muertas y compactación de espacio sin bloqueo de lectura
VACUUM (VERBOSE, ANALYZE);

-- 3. Reconstrucción concurrente de índices críticos para evitar fragmentación
REINDEX TABLE CONCURRENTLY "User";
REINDEX TABLE CONCURRENTLY "Membership";
REINDEX TABLE CONCURRENTLY "Student";
REINDEX TABLE CONCURRENTLY "Grade";
REINDEX TABLE CONCURRENTLY "AttendanceRecord";
REINDEX TABLE CONCURRENTLY "AuditLog";
```

### 6.3 Verificación de Conexiones Activas y Bloqueos (Locks)
```sql
-- Consultar consultas activas de larga duración (> 5 segundos)
SELECT pid, now() - pg_stat_activity.query_start AS duration, query, state
FROM pg_stat_activity
WHERE (now() - pg_stat_activity.query_start) > interval '5 seconds'
AND state != 'idle';

-- Terminación de proceso bloqueante (si fuese estrictamente necesario)
-- SELECT pg_terminate_backend([PID]);
```

---

## 🔐 7. PROTOCOLOS DE SEGURIDAD OPERATIVA Y ROTACIÓN DE SECRETOS

### 7.1 Protocolo de Rotación de Clave Maestra `JWT_SECRET` (Zero-Downtime)

Para rotar la clave secreta de sesiones sin interrumpir la operación de los usuarios:

1. **Paso 1: Generar Nueva Clave Segura:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
2. **Paso 2: Configurar Clave Secundaria de Verificación:**
   - En el gestor de secretos (Cloud Secret Manager / Vault), actualizar la variable `JWT_SECRET_PREVIOUS` con el valor antiguo y `JWT_SECRET` con el nuevo.
   - El módulo `lib/auth/session.ts` validará contra la clave principal y fallback a la previa durante una ventana de gracia de 8 horas.
3. **Paso 3: Purgar Clave Anterior:**
   - Cumplido el ciclo de expiración de 8 horas, retirar `JWT_SECRET_PREVIOUS`.

### 7.2 Sanitización y Purga de Registros de Auditoría (`AuditLog`)

Conforme a la **Circular 482** y normativas de protección de datos de NNA:
- Los registros de `AuditLog` deben conservarse por un período mínimo de 1 año escolar (365 días).
- Para archivar registros históricos a almacenamiento frío (Cold Storage / Google Cloud Storage):

```sql
-- Exportar registros con antigüedad superior a 365 días
COPY (
  SELECT * FROM "AuditLog"
  WHERE "createdAt" < NOW() - INTERVAL '365 days'
) TO '/var/backups/aurenis/audit_logs_archive_2025.csv' WITH CSV HEADER;

-- Purgar tuplas archivadas de la tabla principal
DELETE FROM "AuditLog"
WHERE "createdAt" < NOW() - INTERVAL '365 days';
```

---

## 📈 8. MONITOREO, OBSERVABILIDAD Y ALERTAS OPERATIVAS

### 8.1 Indicadores Clave de Rendimiento (SLIs / SLOs)

| Métrica Operativa | Umbral Óptimo (SLO) | Umbral de Alerta (Warning) | Acción Requerida |
| :--- | :--- | :--- | :--- |
| **Tiempo de Respuesta (p95)** | < 120 ms | > 350 ms | Inspeccionar consultas lentas (`pg_stat_statements`) y memoria RAM. |
| **Tasa de Errores HTTP 5xx** | < 0.01% | > 0.5% | Revisar logs de excepciones no controladas y conexión a BD. |
| **Uso de CPU en Servidor** | < 45% | > 80% sostenido | Escalar instancias horizontales en Cloud Run. |
| **Uso de Memoria Heap Node.js**| < 512 MB | > 1.2 GB | Verificar posibles fugas de memoria o retención de buffers. |
| **Conexiones a BD en Pool** | < 60% capacidad | > 85% capacidad | Incrementar tamaño de pool o habilitar PgBouncer. |

### 8.2 Comando de Monitoreo de Logs en Tiempo Real
```bash
# Monitoreo de logs en Google Cloud Run
gcloud beta run services logs tail aurenis --region us-west2 --format "table(timestamp, textPayload, severity)"

# Monitoreo en servidor local / contenedor Docker
docker logs -f --tail 100 [CONTAINER_ID]
```

---

## 🚨 9. RUNBOOK DE CONTINGENCIAS Y RESOLUCIÓN DE INCIDENTES

### 9.1 Incidente 1: Falla de Conexión a Base de Datos (`P1001 / P1002`)
- **Síntoma:** Errores `PrismaClientInitializationError: Can't reach database server`.
- **Procedimiento:**
  1. Ejecutar `npm run maint:healthcheck` para verificar latencia y visibilidad de red.
  2. Verificar que la instancia de Cloud SQL esté en estado `RUNNABLE`.
  3. Validar cuota de conexiones activas con `SELECT count(*) FROM pg_stat_activity;`.
  4. Si se agotó el pool, reiniciar temporalmente las instancias de Cloud Run para liberar conexiones ociosas.

### 9.2 Incidente 2: Despliegue Fallido o Regresión en Producción
- **Procedimiento de Rollback Inmediato:**
  ```bash
  # En Google Cloud Run: Revertir tráfico a la revisión anterior
  gcloud run services update-traffic aurenis --to-revisions=[PREVIOUS_STABLE_REVISION]=100 --region us-west2

  # Revertir migraciones si el esquema no era retrocompatible
  npm run db:migrate:rollback
  ```

---

## 📦 10. PROCEDIMIENTO DE DESPLIEGUE CONTINUO (CI/CD) CON DOCKER MULTI-STAGE

### 10.1 Dockerfile Oficial para Producción
```dockerfile
# ==============================================================================
# ETAPA 1: Dependencias y Compilación
# ==============================================================================
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

# ==============================================================================
# ETAPA 2: Runner de Producción de Alto Rendimiento
# ==============================================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
```

---

## 🏁 11. DICTAMEN DE REVISIÓN FINAL Y CIERRE TÉCNICO

> ### 🟢 **DICTAMEN OFICIAL: GUÍA TÉCNICA APROBADA PARA USO OPERATIVO**
> La presente Guía Técnica y Manual de Operaciones de **AURENIS v2.4.0** ha sido revisada, validada y certificada por los 4 integrantes del equipo técnico:
> - **Maicol R. (Lead de Arquitectura y Backend):** Esquemas, scripts y comandos de mantención verificados.
> - **Malcom Marcelo (Frontend Developer):** Paridad de entorno de ejecución y scripts de build auditados.
> - **Lucas P. (UI / UX Designer):** Formato visual, tokens y compatibilidad de salida lista para impresión certificada.
> - **Frank M. (QA, Testing & Seguridad):** Procedimientos de contingencia, auditoría y seguridad operacional aprobados.
>
> **ESTADO DE DESPLIEGUE: LUZ VERDE PARA PUSH A GITHUB Y PASE A PRODUCCIÓN ✅**
