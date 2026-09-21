"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { getSafeReturnUrl } from "@/lib/navigation/routes";
import { ShieldAlert, Loader2, Lock } from "lucide-react";
import { UserSession } from "@/types/auth";

export interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * Ruta a la cual redirigir si no está autenticado (por defecto "/login")
   */
  redirectTo?: string;
  /**
   * Rol o roles requeridos opcionales para acceso (RBAC)
   */
  requiredRole?: string | string[];
  /**
   * Permiso o permisos requeridos opcionales
   */
  requiredPermissions?: string | string[];
  /**
   * Fallback visual opcional mientras se verifica la sesión
   */
  fallback?: React.ReactNode;
  /**
   * Fallback visual opcional en caso de rol o permiso insuficiente
   */
  unauthorizedFallback?: React.ReactNode;
  /**
   * Sesión inicial opcional provista por Server Components
   */
  initialUser?: UserSession | null;
  /**
   * Estado de autenticación inicial explícito
   */
  initialAuthenticated?: boolean;
}

export function ProtectedRoute({
  children,
  redirectTo = "/login",
  requiredRole,
  requiredPermissions,
  fallback,
  unauthorizedFallback,
  initialUser,
  initialAuthenticated,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Calcular estado efectivo considerando propiedades de SSR si fueron provistas
  const effectiveUser = initialUser !== undefined ? initialUser : user;
  const effectiveIsAuthenticated =
    initialAuthenticated !== undefined
      ? initialAuthenticated
      : initialUser !== undefined
      ? !!initialUser
      : isAuthenticated;
  const effectiveIsLoading =
    initialAuthenticated !== undefined || initialUser !== undefined ? false : isLoading;

  // Obtener la ruta completa intentada con sus query params
  const fullAttemptedPath = React.useMemo(() => {
    const query = searchParams?.toString();
    const current = pathname || "/";
    return query ? `${current}?${query}` : current;
  }, [pathname, searchParams]);

  useEffect(() => {
    // Si terminó de cargar y no está autenticado, ejecutar la redirección automática con memoria de ruta
    if (!effectiveIsLoading && !effectiveIsAuthenticated && !isRedirecting) {
      setIsRedirecting(true);

      const safePath = getSafeReturnUrl(fullAttemptedPath, "/");

      // Guardar en sessionStorage para persistencia adicional ante recargas o flujos multi-paso
      try {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("aurenis_intended_route", safePath);
        }
      } catch {
        // Ignorar excepciones de cuotas o restricciones de iframe
      }

      // Redirección automática hacia /login con parámetro returnUrl sanitizado
      const targetLoginUrl = `${redirectTo}?returnUrl=${encodeURIComponent(safePath)}`;
      try {
        router.replace(targetLoginUrl);
      } catch {
        if (typeof window !== "undefined") {
          window.location.href = targetLoginUrl;
        }
      }
    }
  }, [effectiveIsLoading, effectiveIsAuthenticated, isRedirecting, fullAttemptedPath, redirectTo, router]);

  // 1. BLOQUEO DE RENDERIZADO NO AUTORIZADO: Mientras se verifica el estado de autenticación
  if (effectiveIsLoading || isRedirecting) {
    if (fallback) return <>{fallback}</>;

    return (
      <div
        id="protected-route-loading"
        className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mb-4 animate-pulse">
          <Lock className="w-6 h-6" />
        </div>
        <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-medium text-sm">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
          <span>Verificando autorización y credenciales...</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Protegiendo vistas y recursos privados.
        </p>
      </div>
    );
  }

  // 2. BLOQUEO DE RENDERIZADO NO AUTORIZADO: Si no está autenticado, nunca renderizar `children`
  if (!effectiveIsAuthenticated || !effectiveUser) {
    return null;
  }

  // 3. Verificación de Roles requeridos (RBAC)
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const userRole = effectiveUser.roleName?.toUpperCase();
    const hasRole = effectiveUser.isSystemAdmin || (userRole && roles.map((r) => r.toUpperCase()).includes(userRole));

    if (!hasRole) {
      if (unauthorizedFallback) return <>{unauthorizedFallback}</>;

      return (
        <div
          id="protected-route-forbidden-role"
          className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Acceso Restringido por Rol
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Tu perfil actual no cuenta con el nivel de acceso requerido para visualizar este módulo.
          </p>
        </div>
      );
    }
  }

  // 4. Verificación de Permisos requeridos
  if (requiredPermissions) {
    const requiredList = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
    const userPermissions = effectiveUser.permissions || [];
    const hasAllPermissions =
      effectiveUser.isSystemAdmin ||
      userPermissions.includes("*") ||
      requiredList.every((perm) => userPermissions.includes(perm));

    if (!hasAllPermissions) {
      if (unauthorizedFallback) return <>{unauthorizedFallback}</>;

      return (
        <div
          id="protected-route-forbidden-permission"
          className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Permisos Insuficientes
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            No tienes los permisos asignados necesarios para realizar acciones o ver este contenido.
          </p>
        </div>
      );
    }
  }

  // 5. Usuario autenticado y autorizado: Renderizado seguro
  return <>{children}</>;
}

export default ProtectedRoute;
