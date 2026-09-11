import { PermissionCode } from "@/lib/constants/permissions";

export class ForbiddenError extends Error {
  constructor(message = "No tienes los permisos necesarios para realizar esta acción.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export function hasPermission(
  context: { permissions?: string[]; roleName?: string },
  permission: PermissionCode | string
): boolean {
  if (context.roleName === "SYSTEM_ADMIN") return true;
  if (!context.permissions) return false;
  if (context.permissions.includes("*")) return true;
  return context.permissions.includes(permission);
}

export function hasAnyPermission(
  context: { permissions?: string[]; roleName?: string },
  permissions: (PermissionCode | string)[]
): boolean {
  if (context.roleName === "SYSTEM_ADMIN") return true;
  if (!context.permissions) return false;
  if (context.permissions.includes("*")) return true;
  return permissions.some((p) => context.permissions!.includes(p));
}

export function hasAllPermissions(
  context: { permissions?: string[]; roleName?: string },
  permissions: (PermissionCode | string)[]
): boolean {
  if (context.roleName === "SYSTEM_ADMIN") return true;
  if (!context.permissions) return false;
  if (context.permissions.includes("*")) return true;
  return permissions.every((p) => context.permissions!.includes(p));
}

export function assertPermission(
  context: { permissions?: string[]; roleName?: string },
  permission: PermissionCode | string
): void {
  if (!hasPermission(context, permission)) {
    throw new ForbiddenError(`Permiso requerido no encontrado: ${permission}`);
  }
}
