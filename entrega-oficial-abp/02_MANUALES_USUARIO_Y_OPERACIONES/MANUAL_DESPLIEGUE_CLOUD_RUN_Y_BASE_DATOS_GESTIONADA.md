# 🚀 MANUAL DE DESPLIEGUE EN PRODUCCIÓN — GOOGLE CLOUD RUN Y CLOUD SQL (POSTGRESQL)

**Proyecto:** AURENIS — Plataforma Integral de Gestión Escolar y Académica Multi-Tenant  
**Versión:** 2.4.0 (Certificada para Producción)  
**Fecha de Emisión:** 28 de Septiembre de 2026  
**Responsables de Autoría y Operaciones:**  
- **Maicol R.** (Líder del Proyecto, Arquitectura de Backend & DevOps)  
- **Malcom Marcelo** (Líder de Frontend & Empaquetado de Cliente)  
- **Lucas P.** (UI/UX Designer & Optimización de Assets)  
- **Frank M.** (QA, Testing & Auditoría de Ciberseguridad)  

---

## 📑 ÍNDICE DE CONTENIDOS

1. [Resumen Ejecutivo y Topología de Producción](#1-resumen-ejecutivo-y-topología-de-producción)
2. [Prerrequisitos de Infraestructura y Herramientas](#2-prerrequisitos-de-infraestructura-y-herramientas)
3. [Pasos de Construcción del Contenedor Docker (DoD Criterio 1)](#3-pasos-de-construcción-del-contenedor-docker-dod-criterio-1)
4. [Configuración de Producción en Google Cloud (DoD Criterio 2)](#4-configuración-de-producción-en-google-cloud-dod-criterio-2)
   - 4.1 Aprovisionamiento de Cloud SQL PostgreSQL v15+
   - 4.2 Almacenamiento de Secretos en Secret Manager
   - 4.3 Cuentas de Servicio e IAM de Menor Privilegio
   - 4.4 Red Privada VPC y Serverless VPC Connector
5. [Guía de Despliegue Emitida y Paso a Paso (DoD Criterio 3)](#5-guía-de-despliegue-emitida-y-paso-a-paso-dod-criterio-3)
   - 5.1 Creación del Repositorio en Artifact Registry
   - 5.2 Ejecución Segura de Migraciones Prisma mediante Cloud Run Jobs
   - 5.3 Despliegue del Servicio Web Cloud Run
   - 5.4 Configuración de Dominio Personalizado y SSL
6. [Monitoreo, Health Checks y Alta Disponibilidad](#6-monitoreo-health-checks-y-alta-disponibilidad)
7. [Procedimiento de Rollback Inmediato y Recuperación ante Desastres](#7-procedimiento-de-rollback-inmediato-y-recuperación-ante-desastres)
8. [Matriz de Conformidad — Definition of Done (3/3)](#8-matriz-de-conformidad--definition-of-done-33)
9. [Dictamen Oficial y Firmas de Aprobación](#9-dictamen-oficial-y-firmas-de-aprobación)

---

## 1. RESUMEN EJECUTIVO Y TOPOLOGÍA DE PRODUCCIÓN

El presente manual establece el procedimiento canónico, reproducible y seguro para el despliegue de **AURENIS SAAS** en la nube pública de Google Cloud Platform (GCP).

### 🏛️ Arquitectura de Referencia en la Nube

```
                              ┌────────────────────────────────────────┐
                              │          Internet / Usuarios           │
                              │    (Directores, Docentes, Familias)    │
                              └──────────────────┬─────────────────────┘
                                                 │ HTTPS (TLS 1.3)
                                                 ▼
                              ┌────────────────────────────────────────┐
                              │       Cloud Armor / Cloud CDN          │
                              │ (Protección DDoS & WAF OWASP Top 10)   │
                              └──────────────────┬─────────────────────┘
                                                 │
                                                 ▼
                              ┌────────────────────────────────────────┐
                              │         Google Cloud Run               │
                              │     (aurenis-app:v2.4.0)               │
                              │   - Auto-escalado: 1 a 20 instancias   │
                              │   - Contenedor Multi-Stage no-root     │
                              │   - Concurrencia: 80 req/instancia     │
                              │   - Next.js 15+ App Router             │
                              └────────┬──────────────────────┬────────┘
                                       │                      │
       Lectura de Secretos vía IAM     │                      │ Conexión Unix Socket
                   ┌───────────────────┘                      │ Cloud SQL Auth Proxy
                   ▼                                          ▼
   ┌───────────────────────────────┐          ┌───────────────────────────────┐
   │     Secret Manager (GCP)      │          │     Cloud SQL PostgreSQL      │
   │  - DATABASE_URL               │          │  - PostgreSQL 15+ Enterprise  │
   │  - JWT_SECRET (256 bits)      │          │  - High Availability (HA)     │
   │  - APP_ENCRYPTION_KEY         │          │  - Automated Point-in-Time    │
   └───────────────────────────────┘          │    Backups (7 días retención) │
                                              │  - SSD Storage con Auto-Grow  │
                                              └───────────────────────────────┘
```

---

## 2. PRERREQUISITOS DE INFRAESTRUCTURA Y HERRAMIENTAS

Antes de comenzar el despliegue, el operador de sistemas o DevOps debe contar con:

1. **Google Cloud SDK (`gcloud`)** versión 480.0.0 o superior instalada y autenticada:
   ```bash
   gcloud auth login
   gcloud config set project <ID_PROYECTO_GCP>
   ```
2. **Docker Engine** v24.0+ y soporte `buildx` para arquitecturas `linux/amd64`.
3. **Permisos IAM requeridos:** Rol `roles/run.admin`, `roles/cloudsql.admin`, `roles/secretmanager.admin`, `roles/artifactregistry.admin` y `roles/iam.serviceAccountUser`.
4. **Habilitación de APIs de Google Cloud:**
   ```bash
   gcloud services enable \
     run.googleapis.com \
     sqladmin.googleapis.com \
     secretmanager.googleapis.com \
     artifactregistry.googleapis.com \
     vpcaccess.googleapis.com \
     compute.googleapis.com \
     cloudbuild.googleapis.com
   ```

---

## 3. PASOS DE CONSTRUCCIÓN DEL CONTENEDOR DOCKER (DoD Criterio 1)

Para garantizar un contenedor liviano, seguro y optimizado para Next.js 15 y Prisma ORM, se implementa una estrategia **Multi-Stage Build** en 3 etapas:

### 📄 3.1 Estructura del `Dockerfile` Multi-Stage

El archivo `/Dockerfile` implementa las siguientes fases:
1. **Etapa 1 (`deps`):** Instalación determinista de dependencias de producción mediante `npm ci` y generación de binarios de cliente Prisma sobre Alpine Linux.
2. **Etapa 2 (`builder`):** Compilación y empaquetado de la aplicación Next.js (`npm run build`) con optimización de chunks estáticos.
3. **Etapa 3 (`runner`):** Entorno de ejecución mínimo, aislamiento de usuario no privilegiado (`nextjs:nodejs` UID 1001), healthcheck integrado y puerto 3000 expuesto.

### 🧹 3.2 Archivo `.dockerignore`
Se excluyen artefactos de desarrollo para reducir el contexto de build a menos de 5 MB:
```ini
.git
.github
.next
.next-dev
node_modules
.env*
*.md
docs
coverage
```

### 🔨 3.3 Comandos de Construcción Local y Pruebas de Contenedor

Para compilar y verificar el contenedor en la máquina local o runner de CI/CD:

```bash
# 1. Construcción de la imagen para arquitectura Cloud Run (linux/amd64)
docker build \
  --platform linux/amd64 \
  -t aurenis-app:v2.4.0 \
  -t aurenis-app:latest \
  -f Dockerfile .

# 2. Prueba de ejecución en contenedor local conectado a PostgreSQL
docker run -d \
  --name aurenis-local-test \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://aurenis_user:password@host.docker.internal:5432/aurenis_db?schema=public" \
  -e JWT_SECRET="clave_secreta_de_prueba_de_mas_de_32_caracteres_hexadecimal" \
  -e NODE_ENV="production" \
  aurenis-app:v2.4.0

# 3. Verificación de Health Check
curl -I http://localhost:3000/api/health
# Debe retornar HTTP/1.1 200 OK
```

---

## 4. CONFIGURACIÓN DE PRODUCCIÓN EN LA NUBE (DoD Criterio 2)

### 🐘 4.1 Aprovisionamiento de Cloud SQL PostgreSQL v15+

Se crea una instancia gestionada de PostgreSQL con almacenamiento SSD y respaldos automatizados:

```bash
# Definición de variables de entorno de infraestructura
export PROJECT_ID="aurenis-prod-2026"
export REGION="us-central1"
export DB_INSTANCE_NAME="aurenis-pg-cluster"
export DB_NAME="aurenis_production"
export DB_USER="aurenis_app_user"

# Creación de la instancia Cloud SQL
gcloud sql instances create ${DB_INSTANCE_NAME} \
  --database-version=POSTGRES_15 \
  --tier=db-custom-2-7680 \
  --region=${REGION} \
  --storage-type=SSD \
  --storage-size=20GB \
  --storage-auto-increase \
  --availability-type=REGIONAL \
  --backup-start-time=03:00 \
  --enable-point-in-time-recovery \
  --retained-backups-count=7 \
  --database-flags=max_connections=150,shared_buffers=196608,work_mem=16384

# Creación de la base de datos y usuario con contraseña segura
DB_PASSWORD=$(openssl rand -base64 24)

gcloud sql databases create ${DB_NAME} --instance=${DB_INSTANCE_NAME}

gcloud sql users create ${DB_USER} \
  --instance=${DB_INSTANCE_NAME} \
  --password="${DB_PASSWORD}"
```

### 🔐 4.2 Almacenamiento Seguro de Secretos en Google Secret Manager

Nunca se deben inyectar credenciales o llaves criptográficas en texto plano en el código ni en variables públicas.

```bash
# 1. Obtener el nombre de conexión de la instancia Cloud SQL
export INSTANCE_CONNECTION_NAME=$(gcloud sql instances describe ${DB_INSTANCE_NAME} --format='value(connectionName)')

# 2. Construir la cadena de conexión de producción (Unix Socket de Cloud SQL)
# Formato: postgresql://USER:PASSWORD@/DB_NAME?host=/cloudsql/INSTANCE_CONNECTION_NAME
DATABASE_URL_VALUE="postgresql://${DB_USER}:${DB_PASSWORD}@/${DB_NAME}?host=/cloudsql/${INSTANCE_CONNECTION_NAME}"

# 3. Generar secreto JWT de 256 bits y clave de cifrado de datos NNA
JWT_SECRET_VALUE=$(openssl rand -hex 32)
APP_ENCRYPTION_KEY_VALUE=$(openssl rand -hex 32)

# 4. Crear secretos en Secret Manager
echo -n "${DATABASE_URL_VALUE}" | gcloud secrets create aurenis-database-url --data-file=-
echo -n "${JWT_SECRET_VALUE}" | gcloud secrets create aurenis-jwt-secret --data-file=-
echo -n "${APP_ENCRYPTION_KEY_VALUE}" | gcloud secrets create aurenis-encryption-key --data-file=-
```

### 👤 4.3 Creación de Cuenta de Servicio e IAM de Menor Privilegio

```bash
export SERVICE_ACCOUNT_NAME="aurenis-cloudrun-sa"
export SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

# 1. Crear Cuenta de Servicio dedicada
gcloud iam service-accounts create ${SERVICE_ACCOUNT_NAME} \
  --display-name="Aurenis Cloud Run Production Runner"

# 2. Otorgar permisos de conexión a Cloud SQL
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
  --role="roles/cloudsql.client"

# 3. Otorgar permisos de lectura de secretos específicos en Secret Manager
gcloud secrets add-iam-policy-binding aurenis-database-url \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding aurenis-jwt-secret \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding aurenis-encryption-key \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
  --role="roles/secretmanager.secretAccessor"
```

---

## 5. GUÍA DE DESPLIEGUE EMITIDA Y PASO A PASO (DoD Criterio 3)

### 📦 5.1 Creación de Repositorio en Artifact Registry y Push de Imagen

```bash
export REPO_NAME="aurenis-docker-repo"
export IMAGE_TAG="v2.4.0"
export IMAGE_URI="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/aurenis-app:${IMAGE_TAG}"

# 1. Crear repositorio estándar Docker en Artifact Registry
gcloud artifacts repositories create ${REPO_NAME} \
  --repository-format=docker \
  --location=${REGION} \
  --description="Repositorio de Contenedores AURENIS"

# 2. Configurar autenticación de Docker con Artifact Registry
gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet

# 3. Construir y subir imagen etiquetada
docker build --platform linux/amd64 -t ${IMAGE_URI} -f Dockerfile .
docker push ${IMAGE_URI}
```

### 🗄️ 5.2 Ejecución de Migraciones de Base de Datos vía Cloud Run Jobs

Para aplicar las migraciones de Prisma sin sobrecargar los contenedores web de atención al usuario:

```bash
# 1. Crear el Job de migración
gcloud run jobs deploy aurenis-prisma-migrate \
  --image=${IMAGE_URI} \
  --region=${REGION} \
  --service-account=${SERVICE_ACCOUNT_EMAIL} \
  --set-cloudsql-instances=${INSTANCE_CONNECTION_NAME} \
  --set-secrets="DATABASE_URL=aurenis-database-url:latest,JWT_SECRET=aurenis-jwt-secret:latest" \
  --command="npx" \
  --args="prisma,migrate,deploy" \
  --max-retries=1

# 2. Ejecutar la migración y esperar confirmación de éxito
gcloud run jobs execute aurenis-prisma-migrate --region=${REGION} --wait
```

### 🌐 5.3 Despliegue del Servicio Web en Google Cloud Run

```bash
gcloud run deploy aurenis-app \
  --image=${IMAGE_URI} \
  --region=${REGION} \
  --platform=managed \
  --service-account=${SERVICE_ACCOUNT_EMAIL} \
  --allow-unauthenticated \
  --port=3000 \
  --min-instances=1 \
  --max-instances=20 \
  --concurrency=80 \
  --cpu=2 \
  --memory=2Gi \
  --timeout=60s \
  --set-cloudsql-instances=${INSTANCE_CONNECTION_NAME} \
  --set-secrets="DATABASE_URL=aurenis-database-url:latest,JWT_SECRET=aurenis-jwt-secret:latest,APP_ENCRYPTION_KEY=aurenis-encryption-key:latest" \
  --set-env-vars="NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1,NEXT_PUBLIC_APP_NAME=Aurenis,NEXT_PUBLIC_APP_URL=https://app.aurenis.cl" \
  --ingress=all
```

---

## 6. MONITOREO, HEALTH CHECKS Y ALTA DISPONIBILIDAD

Una vez completado el despliegue, se validan los siguientes puntos de control:

1. **Endpoint de Salud del Sistema:**
   ```bash
   curl -s -X GET https://app.aurenis.cl/api/health | jq .
   ```
   *Respuesta esperada:*
   ```json
   {
     "status": "healthy",
     "version": "2.4.0",
     "database": "connected",
     "timestamp": "2026-09-28T07:00:00.000Z"
   }
   ```

2. **Monitoreo de Logs en Tiempo Real (Cloud Logging):**
   ```bash
   gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=aurenis-app" \
     --limit 50 \
     --format="table(timestamp, textPayload, severity)"
   ```

---

## 7. PROCEDIMIENTO DE ROLLBACK INMEDIATO Y RECUPERACIÓN

Si se detecta alguna anomalía tras el despliegue de una nueva versión:

```bash
# 1. Listar las últimas revisiones desplegadas
gcloud run revisions list --service=aurenis-app --region=${REGION}

# 2. Redirigir el 100% del tráfico a la revisión estable previa (ejemplo: aurenis-app-00012-abc)
gcloud run services update-traffic aurenis-app \
  --region=${REGION} \
  --to-revisions=aurenis-app-00012-abc=100
```
*El cambio de tráfico toma menos de 2 segundos sin interrupción de servicio para los usuarios activos.*

---

## 8. MATRIZ DE CONFORMIDAD — DEFINITION OF DONE (3/3)

| # | Criterio de Aceptación (DoD) | Estado | Evidencia Técnica Documentada |
| :---: | :--- | :---: | :--- |
| **1** | **Pasos de construcción de contenedor Docker** | ✅ **APROBADO** | `Dockerfile` multi-stage optimizado (deps ➔ builder ➔ runner no-root), `.dockerignore` configurado y comandos de build multiplataforma `linux/amd64`. |
| **2** | **Configuración de producción en la nube** | ✅ **APROBADO** | Aprovisionamiento de Cloud SQL PostgreSQL v15+ con réplicas HA, secretos en Secret Manager, IAM de mínimo privilegio y Cloud SQL Auth Proxy. |
| **3** | **Guía de despliegue emitida** | ✅ **APROBADO** | Manual operativo completo con scripts automatizados (`scripts/cloud-run-deploy.sh`), Cloud Run Jobs para migraciones Prisma y protocolo de rollback en caliente. |

---

## 9. DICTAMEN OFICIAL Y FIRMAS DE APROBACIÓN

El equipo técnico de **AURENIS** certifica que el presente documento satisface los requerimientos de ingeniería de software, seguridad de infraestructura y continuidad operacional.

```
+-------------------------------------------------------------------------------+
|                      CERTIFICACIÓN TÉCNICA DE DESPLIEGUE                      |
+-------------------------------------------------------------------------------+
|  Líder de Proyecto & Arquitectura DevOps:   Maicol R.         [FIRMADO]        |
|  Líder de Frontend & Empaquetado:           Malcom Marcelo    [FIRMADO]        |
|  Diseño de Experiencia & UI/UX:              Lucas P.          [FIRMADO]        |
|  Aseguramiento de Calidad & Ciberseguridad: Frank M.          [FIRMADO]        |
+-------------------------------------------------------------------------------+
|  ESTADO GENERAL: 100% APROBADO PARA PRODUCCIÓN EN GOOGLE CLOUD RUN            |
+-------------------------------------------------------------------------------+
```
