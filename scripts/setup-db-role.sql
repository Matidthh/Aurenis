-- scripts/setup-db-role.sql
-- Autor: Malcom Marcelo (Arquitectura de Base de Datos y Seguridad SaaS K-12)
-- Propósito: Creación de rol PostgreSQL con privilegios mínimos para la aplicación en producción (Principio de Menor Privilegio).

DO
$do$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'aurenis_app_user') THEN
      CREATE ROLE aurenis_app_user WITH LOGIN PASSWORD 'CambiarEstaContrasenaPorUnaDeAltaEntropia2026!';
   END IF
END
$do$;

-- Conceder permisos de uso sobre el esquema public y tablas
GRANT USAGE ON SCHEMA public TO aurenis_app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO aurenis_app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO aurenis_app_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO aurenis_app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO aurenis_app_user;
