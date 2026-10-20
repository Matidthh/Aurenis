-- =============================================================
-- ROLLBACK SCRIPT FOR MIGRATION: 20261009120000_add_wp_reviews_tables
-- Description: Reverts tables wp_review_comments and wp_reviews
-- Target Environment: Staging / Production / Testing
-- Autor: Maicol R. (Arquitectura y Base de Datos) & Frank M. (QA & Seguridad)
-- =============================================================

-- 1. Eliminar llaves foráneas y tablas en orden inverso de dependencia
DROP TABLE IF EXISTS "wp_review_comments" CASCADE;
DROP TABLE IF EXISTS "wp_reviews" CASCADE;
