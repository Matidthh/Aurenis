# Plan de Rediseño de Dashboard de Alumnos (Revisado)

## 1. Objetivo
Rediseñar la interfaz de la Dashboard de Alumnos de AURENIS para mejorar la claridad visual, reducir la redundancia y mejorar la experiencia de usuario, manteniendo todas las funcionalidades existentes.

## 2. Cambios Principales

### A. Eliminación de Elementos Redundantes
- Nota: Algunas redundancias ya han sido eliminadas por el equipo. Se procederá a verificar y completar la limpieza según los requisitos si queda algún vestigio.
- Verificar y eliminar cualquier selector de roles/estamentos restante.
- Verificar y eliminar cualquier insignia de rol redundante.

### B. Reorganización de la Interfaz
- **Header:** Simplificar dejando solo identidad, buscador, notificaciones y perfil.
- **Bienvenida:** Sección compacta con saludo y saludo personalizado.
- **Accesos Rápidos:** Tarjetas uniformes con iconos y descripciones cortas para las funcionalidades académicas principales.
- **Resumen Académico:** Sección compacta con métricas reales (promedio, asistencia, ramos, etc.).
- **Información Reciente:** Tablas compactas para últimas notas y próximas evaluaciones.
- **Apoyo Escolar:** Mantener accesible como tarjeta de ayuda.

## 3. Sistema Visual
- Usar paleta corporativa (#0c8ee9).
- Fondo claro, superficies blancas, bordes sutiles, sombras ligeras.
- Iconos de `lucide-react`.

## 4. Pasos de Implementación
1. Modificar `/components/dashboard/estudiante-dashboard.tsx`:
    - Identificar y eliminar cualquier elemento redundante de la lista de requisitos original (selector de rol, insignia de rol).
    - Reestructurar el grid de la dashboard.
    - Implementar los nuevos componentes de sección siguiendo el diseño proporcionado.
2. Validar cambios en `app/[schoolSlug]/dashboard/estudiante/page.tsx` si es necesario.
3. Asegurar comportamiento responsivo.
4. Verificación técnica (TypeScript, lint, compilación).

## 5. Verificación
- Comprobar que todas las funcionalidades (notas, asistencia, apoyo escolar, etc.) sigan activas.
- Verificar cumplimiento responsive.
