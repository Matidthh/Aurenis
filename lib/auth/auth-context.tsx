"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { UserSession } from "@/types/auth";
import { sessionSync } from "./session-sync";

export const AUTH_STORAGE_KEYS = {
  USER: "aurenis_user_session",
  TOKEN: "aurenis_session_token",
  REMEMBER: "aurenis_remember_me",
  INTENDED_ROUTE: "aurenis_intended_route",
  SESSION_EXPIRED: "aurenis_session_expired",
} as const;

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponseData {
  success: boolean;
  user: any;
  token?: string;
  redirectUrl?: string;
}

export interface AuthContextType {
  user: UserSession | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<LoginResponseData>;
  setSessionData: (user: UserSession | null, token?: string | null) => void;
  checkAuth: () => Promise<UserSession | null>;
  refreshToken: (simulateExpired?: boolean) => Promise<boolean>;
  triggerSessionExpired: (reason?: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Inicialización inmediata desde memoria o localStorage para evitar parpadeos (FOUC)
  const [user, setUser] = useState<UserSession | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    try {
      return !localStorage.getItem(AUTH_STORAGE_KEYS.USER);
    } catch {
      return true;
    }
  });

  // Función para persistir o limpiar en memoria y localStorage de forma atómica
  const setSessionData = useCallback((newUser: UserSession | null, newToken?: string | null) => {
    setUser(newUser);
    if (newToken !== undefined) {
      setToken(newToken);
    }

    if (typeof window === "undefined") return;

    try {
      if (newUser) {
        localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(newUser));
        if (newToken) {
          localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, newToken);
        }
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
        localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
        localStorage.removeItem(AUTH_STORAGE_KEYS.REMEMBER);
      }
    } catch {
      // Manejar posibles excepciones de cuotas de storage en iframes
    }
  }, []);

  // Verificar la sesión con el backend autoritativo
  const checkAuth = useCallback(async (): Promise<UserSession | null> => {
    try {
      const headers: Record<string, string> = { "Cache-Control": "no-cache" };
      const currentToken =
        token || (typeof window !== "undefined" ? localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN) : null);
      if (currentToken) {
        headers["Authorization"] = `Bearer ${currentToken}`;
      }

      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers,
      });

      if (!res.ok) {
        setSessionData(null, null);
        return null;
      }

      const data = await res.json();
      if (data?.authenticated && data?.user) {
        setSessionData(data.user);
        return data.user;
      } else {
        setSessionData(null, null);
        return null;
      }
    } catch {
      return user;
    } finally {
      setIsLoading(false);
    }
  }, [token, user, setSessionData]);

  // Disparar expiración de sesión y redirección segura al login
  const triggerSessionExpired = useCallback((reason = "Sesión expirada por inactividad") => {
    setUser(null);
    setToken(null);

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
        localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
        localStorage.removeItem(AUTH_STORAGE_KEYS.REMEMBER);
        sessionStorage.setItem(AUTH_STORAGE_KEYS.SESSION_EXPIRED, "true");
        sessionStorage.setItem("aurenis_session_expired_reason", reason);
      } catch {
        // Ignorar
      }

      // Notificar a las demás pestañas abiertas para que cierren sesión en sincronía
      sessionSync.broadcast("SESSION_EXPIRED", { reason });

      // Redirección segura evitando bucles si ya estamos en /login
      if (!window.location.pathname.startsWith("/login")) {
        const currentPath = window.location.pathname + window.location.search;
        sessionStorage.setItem(AUTH_STORAGE_KEYS.INTENDED_ROUTE, currentPath);
        window.location.href = `/login?expired=true&reason=${encodeURIComponent(reason)}`;
      }
    }
  }, []);

  // Refresco silencioso de token JWT contra el backend
  const refreshToken = useCallback(
    async (simulateExpired = false): Promise<boolean> => {
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        const currentToken =
          token || (typeof window !== "undefined" ? localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN) : null);
        if (currentToken) {
          headers["Authorization"] = `Bearer ${currentToken}`;
        }

        const res = await fetch("/api/auth/refresh", {
          method: "POST",
          headers,
          body: JSON.stringify({ simulateExpired }),
        });

        const data = await res.json();

        if (res.ok && data?.success && data?.token) {
          setSessionData(data.user, data.token);
          sessionSync.broadcast("TOKEN_REFRESHED", { token: data.token });
          return true;
        } else {
          // Si el refresh falla (ej: 401 sesión expirada), invocar redirección
          triggerSessionExpired(data?.error || "Token de refresco revocado o expirado");
          return false;
        }
      } catch {
        triggerSessionExpired("Error de conexión al renovar sesión");
        return false;
      }
    },
    [token, setSessionData, triggerSessionExpired]
  );

  // Iniciar sesión conectando formulario con backend, contexto en memoria y almacenamiento local
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<LoginResponseData> => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.email.trim(),
          password: credentials.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Credenciales incorrectas o usuario no encontrado.");
      }

      // Normalizar la entidad de sesión del usuario
      const rawUser = data.user || {};
      const sessionUser: UserSession = {
        userId: rawUser.id || rawUser.userId || "user-" + Date.now(),
        email: rawUser.email || credentials.email.trim(),
        firstName: rawUser.firstName || rawUser.name?.split(" ")[0] || "Usuario",
        lastName: rawUser.lastName || rawUser.name?.split(" ").slice(1).join(" ") || "",
        isSystemAdmin: !!rawUser.isSystemAdmin,
        activeSchoolId: rawUser.schoolId || rawUser.activeSchool?.id,
        activeSchoolSlug: rawUser.schoolSlug || rawUser.activeSchool?.slug,
        activeMembershipId: rawUser.membershipId,
        roleName: rawUser.roleName || (rawUser.isSystemAdmin ? "SYSTEM_ADMIN" : "USER"),
        permissions: rawUser.permissions || (rawUser.isSystemAdmin ? ["*"] : []),
      };

      // Guardar en memoria de React y en localStorage
      setSessionData(sessionUser, data.token || null);

      if (typeof window !== "undefined") {
        try {
          sessionStorage.removeItem(AUTH_STORAGE_KEYS.SESSION_EXPIRED);
          sessionStorage.removeItem("aurenis_session_expired_reason");
          if (credentials.rememberMe !== undefined) {
            localStorage.setItem(AUTH_STORAGE_KEYS.REMEMBER, String(credentials.rememberMe));
          }
        } catch {
          // Ignorar
        }
        // Notificar a las demás pestañas abiertas
        sessionSync.broadcast("LOGIN", {
          userId: sessionUser.userId,
          token: data.token,
        });
      }

      return data;
    },
    [setSessionData]
  );

  // Cierre de sesión seguro deshaciendo estado en memoria, storage y cookies del servidor
  const logout = useCallback(async () => {
    setUser(null);
    setToken(null);

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
        localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
        localStorage.removeItem(AUTH_STORAGE_KEYS.REMEMBER);
        sessionStorage.removeItem(AUTH_STORAGE_KEYS.INTENDED_ROUTE);
        sessionStorage.removeItem(AUTH_STORAGE_KEYS.SESSION_EXPIRED);
      } catch {
        // Ignorar
      }
      // Notificar a otras pestañas
      sessionSync.broadcast("LOGOUT");
    }

    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignorar fallos de red durante el logout
    } finally {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }, []);

  // Sincronización multi-pestaña limpia: escuchar eventos de otras ventanas
  useEffect(() => {
    const unsubscribe = sessionSync.subscribe((msg) => {
      if (msg.type === "LOGOUT") {
        setUser(null);
        setToken(null);
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      } else if (msg.type === "SESSION_EXPIRED") {
        setUser(null);
        setToken(null);
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem(AUTH_STORAGE_KEYS.SESSION_EXPIRED, "true");
            if (msg.reason) {
              sessionStorage.setItem("aurenis_session_expired_reason", msg.reason);
            }
          } catch {
            // Ignorar
          }
          if (!window.location.pathname.startsWith("/login")) {
            const reasonParam = msg.reason ? `&reason=${encodeURIComponent(msg.reason)}` : "";
            window.location.href = `/login?expired=true${reasonParam}`;
          }
        }
      } else if (msg.type === "LOGIN") {
        // Otra pestaña inició sesión: sincronizar datos
        checkAuth();
      } else if (msg.type === "TOKEN_REFRESHED" && msg.token) {
        setToken(msg.token);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [checkAuth]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        setSessionData,
        checkAuth,
        refreshToken,
        triggerSessionExpired,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      login: async () => {
        throw new Error("useAuth debe usarse dentro de AuthProvider");
      },
      setSessionData: () => {},
      checkAuth: async () => null,
      refreshToken: async () => false,
      triggerSessionExpired: () => {
        if (typeof window !== "undefined") {
          window.location.href = "/login?expired=true";
        }
      },
      logout: async () => {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      },
    };
  }
  return context;
}
