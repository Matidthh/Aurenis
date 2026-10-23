# Plan de Implementación: Múltiples Escalas de Calificación

El objetivo es permitir que los administradores definan múltiples escalas de calificación (ej. Primaria, Secundaria) en lugar de una sola configuración global por colegio.

## 1. Cambios en la Base de Datos (Prisma)
- Definir el modelo `GradingScale` vinculado a `School`.
- Migrar las configuraciones de escala actuales de `SchoolSettings` a la nueva tabla `GradingScale` para cada escuela.
- Eliminar los campos de escala de `SchoolSettings` una vez finalizada la migración de datos.

## 2. Cambios en el Backend (API / Servicios)
- Implementar endpoints para:
  - Listar escalas de un colegio (`GET /api/schools/:schoolId/grading-scales`)
  - Crear/Actualizar escala (`POST`, `PUT`)
  - Eliminar escala (`DELETE`)
- Actualizar el servicio de registro de notas para buscar la escala adecuada según el nivel educativo o curso del estudiante.

## 3. Cambios en el Frontend (UI)
- Refactorizar `GradingSettingsForm` para gestionar una lista de escalas en lugar de un solo conjunto de inputs.
- Añadir botones para añadir/editar/eliminar escalas.

---
**¿Desea proceder con este cambio en la estructura de la base de datos?**
