#!/usr/bin/env bash
# ==============================================================================
# SCRIPT DE RESPALDO Y CONTINGENCIA AUTOMATIZADA DE BASE DE DATOS POSTGRESQL
# Plataforma: AURENIS SaaS Multi-Tenant v2.4.0
# Responsables: Maicol R. (Backend/Arquitectura) & Frank M. (Seguridad/QA)
# ==============================================================================

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/aurenis}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILENAME="aurenis_db_backup_${TIMESTAMP}.dump"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_FILENAME}"
RETENTION_DAYS=30

echo "================================================================================"
echo "📦 [AURENIS OPS] INICIANDO PROCEDIMIENTO DE RESPALDO DE BASE DE DATOS"
echo "Fecha y Hora: $(date)"
echo "Destino: ${BACKUP_PATH}"
echo "================================================================================"

# Crear directorio si no existe
mkdir -p "${BACKUP_DIR}"

if [ -z "${DATABASE_URL:-}" ]; then
  echo "⚠️ DATABASE_URL no definida en el entorno. Utilizando parámetros estándar de PG..."
  PGHOST="${PGHOST:-localhost}"
  PGPORT="${PGPORT:-5432}"
  PGUSER="${PGUSER:-postgres}"
  PGDATABASE="${PGDATABASE:-aurenis_db}"

  echo "Ejecutando pg_dump con compresión y formato custom..."
  pg_dump -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -Fc -b -v -f "${BACKUP_PATH}" "${PGDATABASE}"
else
  echo "Ejecutando pg_dump utilizando la cadena de conexión DATABASE_URL..."
  pg_dump -Fc -b -v -f "${BACKUP_PATH}" "${DATABASE_URL}"
fi

# Generar Checksum SHA-256 para validación de integridad
echo "Generando checksum SHA-256 de verificación..."
sha256sum "${BACKUP_PATH}" > "${BACKUP_PATH}.sha256"

# Política de retención: Eliminar respaldos mayores a RETENTION_DAYS días
echo "Aplicando política de retención (${RETENTION_DAYS} días)..."
find "${BACKUP_DIR}" -type f -name "aurenis_db_backup_*.dump*" -mtime +${RETENTION_DAYS} -exec rm -f {} \;

echo "================================================================================"
echo "✅ [AURENIS OPS] RESPALDO FINALIZADO SATISFACTORIAMENTE"
echo "Archivo: ${BACKUP_PATH}"
echo "Checksum: $(cat "${BACKUP_PATH}.sha256")"
echo "================================================================================"
