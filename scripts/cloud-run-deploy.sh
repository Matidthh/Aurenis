#!/usr/bin/env bash
# ==============================================================================
# SCRIPT DE DESPLIEGUE AUTOMATIZADO A GOOGLE CLOUD RUN — AURENIS SAAS
# Responsable de Autoría: Maicol R. (Tech Lead & DevOps) | Revisión: Frank M. (QA)
# ==============================================================================

set -euo pipefail

# Colores de consola
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}====================================================================${NC}"
echo -e "${BLUE}🚀 AURENIS SAAS — PIPELINE DE DESPLIEGUE EN GOOGLE CLOUD RUN${NC}"
echo -e "${BLUE}====================================================================${NC}"

# Variables de Configuración con valores por defecto
PROJECT_ID="${GCP_PROJECT_ID:-aurenis-prod-2026}"
REGION="${GCP_REGION:-us-central1}"
SERVICE_NAME="${CLOUD_RUN_SERVICE:-aurenis-app}"
JOB_NAME="${CLOUD_RUN_JOB:-aurenis-prisma-migrate}"
REPO_NAME="${ARTIFACT_REPO:-aurenis-docker-repo}"
IMAGE_TAG="${IMAGE_TAG:-$(git rev-parse --short HEAD 2>/dev/null || echo "v2.4.0")}"
IMAGE_URI="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:${IMAGE_TAG}"
DB_INSTANCE_CONNECTION_NAME="${CLOUD_SQL_CONNECTION_NAME:-${PROJECT_ID}:${REGION}:aurenis-pg-cluster}"

echo -e "${YELLOW}📌 Configuración del despliegue:${NC}"
echo "   - Proyecto GCP:        ${PROJECT_ID}"
echo "   - Región:              ${REGION}"
echo "   - Servicio Cloud Run:  ${SERVICE_NAME}"
echo "   - Imagen Destino:      ${IMAGE_URI}"
echo "   - Cloud SQL Instancia: ${DB_INSTANCE_CONNECTION_NAME}"
echo ""

# 1. Validación de Prerrequisitos de CLI
echo -e "${BLUE}🔍 [Paso 1/6] Verificando herramientas de CLI...${NC}"
command -v gcloud >/dev/null 2>&1 || { echo -e "${RED}❌ Error: Google Cloud SDK (gcloud) no está instalado.${NC}" >&2; exit 1; }
command -v docker >/dev/null 2>&1 || { echo -e "${RED}❌ Error: Docker CLI no está instalado.${NC}" >&2; exit 1; }

# 2. Configuración de Proyecto y Autenticación Docker
echo -e "${BLUE}🔑 [Paso 2/6] Configurando autenticación en Artifact Registry...${NC}"
gcloud config set project "${PROJECT_ID}" --quiet
gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet

# 3. Construcción y Empaquetado del Contenedor Multi-Stage
echo -e "${BLUE}📦 [Paso 3/6] Construyendo imagen de contenedor Docker (Linux/amd64)...${NC}"
docker build \
  --platform linux/amd64 \
  -t "${IMAGE_URI}" \
  -t "${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:latest" \
  -f Dockerfile .

echo -e "${BLUE}📤 [Paso 4/6] Subiendo imagen a Google Artifact Registry...${NC}"
docker push "${IMAGE_URI}"
docker push "${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:latest"

# 4. Ejecución de Migraciones de Base de Datos mediante Cloud Run Job
echo -e "${BLUE}🗄️ [Paso 5/6] Ejecutando migraciones de Prisma en Cloud SQL...${NC}"
# Crear o actualizar Cloud Run Job para migraciones
gcloud run jobs deploy "${JOB_NAME}" \
  --image="${IMAGE_URI}" \
  --region="${REGION}" \
  --set-cloudsql-instances="${DB_INSTANCE_CONNECTION_NAME}" \
  --set-secrets="DATABASE_URL=aurenis-database-url:latest,JWT_SECRET=aurenis-jwt-secret:latest" \
  --command="npx" \
  --args="prisma,migrate,deploy" \
  --max-retries=1 \
  --quiet || true

# Ejecutar Job de migración y esperar término
echo "   Ejecutando Job de migración..."
gcloud run jobs execute "${JOB_NAME}" --region="${REGION}" --wait

# 5. Despliegue del Servicio Web Cloud Run con Conexión a Cloud SQL
echo -e "${BLUE}🌐 [Paso 6/6] Desplegando servicio en Cloud Run con escalado y Cloud SQL...${NC}"
gcloud run deploy "${SERVICE_NAME}" \
  --image="${IMAGE_URI}" \
  --region="${REGION}" \
  --platform=managed \
  --allow-unauthenticated \
  --port=3000 \
  --min-instances=1 \
  --max-instances=20 \
  --concurrency=80 \
  --cpu=2 \
  --memory=2Gi \
  --timeout=60s \
  --set-cloudsql-instances="${DB_INSTANCE_CONNECTION_NAME}" \
  --set-secrets="DATABASE_URL=aurenis-database-url:latest,JWT_SECRET=aurenis-jwt-secret:latest,APP_ENCRYPTION_KEY=aurenis-encryption-key:latest" \
  --set-env-vars="NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1,NEXT_PUBLIC_APP_NAME=Aurenis,NEXT_PUBLIC_APP_URL=https://${SERVICE_NAME}-${PROJECT_ID}.${REGION}.run.app" \
  --ingress=all \
  --quiet

echo ""
echo -e "${GREEN}====================================================================${NC}"
echo -e "${GREEN}✅ ¡DESPLIEGUE EXITOSO EN GOOGLE CLOUD RUN!${NC}"
echo -e "${GREEN}====================================================================${NC}"
SERVICE_URL=$(gcloud run services describe "${SERVICE_NAME}" --region="${REGION}" --format='value(status.url)')
echo -e "🔗 URL Pública de Producción: ${BLUE}${SERVICE_URL}${NC}"
echo -e "🩺 Health Check Endpoint:     ${BLUE}${SERVICE_URL}/api/health${NC}"
