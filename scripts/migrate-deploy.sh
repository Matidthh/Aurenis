#!/usr/bin/env bash
# ==============================================================================
# Aurenis Database Migration Deployment Script
# Automatización para despliegues CI/CD (Cloud Run, GitHub Actions, Docker)
# ==============================================================================

set -eo pipefail

echo "================================================================================"
echo "🚀 INICIANDO DESPLIEGUE AUTOMATIZADO DE MIGRACIONES - AURENIS"
echo "🕒 $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "================================================================================"

# 1. Comprobar que DATABASE_URL esté presente
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: La variable DATABASE_URL no está configurada."
  exit 1
fi

# 2. Ejecutar el runner TypeScript empresarial
npx tsx scripts/migrate-deploy.ts "$@"

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ Migraciones ejecutadas y verificadas correctamente."
else
  echo "❌ Error en el proceso de migración. Código de salida: $EXIT_CODE"
  exit $EXIT_CODE
fi
