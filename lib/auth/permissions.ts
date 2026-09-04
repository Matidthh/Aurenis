import { PermissionCode } from "@/lib/constants/permissions";

export class ForbiddenError extends Error {
  constructor(message = "No tienes los permisos necesarios para realizar esta acción.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export function hasPermission(
  context: { permissions?: string[] },
  permission: PermissionCode | string
): boolean {
  if (!context.permissions) return false;
  return context.permissions.includes(permission);
}

export function hasAnyPermission(
  context: { permissions?: string[] },
  permissions: (PermissionCode | string)[]
): boolean {
  if (!context.permissions) return false;
  return permissions.some((p) => context.permissions!.includes(p));
}

export function hasAllPermissions(
  context: { permissions?: string[] },
  permissions: (PermissionCode | string)[]
): boolean {
  if (!context.permissions) return false;
  return permissions.every((p) => context.permissions!.includes(p));
}

export function assertPermission(
  context: { permissions?: string[] },
  permission: PermissionCode | string
): void {
  if (!hasPermission(context, permission)) {
    throw new ForbiddenError(`Permiso requerido no encontrado: ${permission}`);
  }
}
