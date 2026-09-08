/**
 * Normaliza una ruta URL eliminando trailing slash a menos que sea la raíz "/".
 */
export function normalizePath(path: string): string {
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }
  return path;
}

/**
 * Determina si una ruta de navegación está activa dado el pathname actual del navegador.
 *
 * Reglas:
 * 1. Coincidencia exacta: /students === /students
 * 2. Coincidencia jerárquica (hijas): /students/123 o /students/123/edit
 *
 * Evita falsos positivos:
 * /students NO coincide con /students-other ni /students_archive
 */
export function isRouteActive(currentPathname: string, targetHref: string): boolean {
  const current = normalizePath(currentPathname);
  const target = normalizePath(targetHref);

  if (current === target) {
    return true;
  }

  return current.startsWith(`${target}/`);
}
