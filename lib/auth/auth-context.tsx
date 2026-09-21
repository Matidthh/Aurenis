"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { UserSession } from "@/types/auth";

export const AUTH_STORAGE_KEYS = {
  USER: "aurenis_user_session",
  TOKEN: "aurenis_session_token",
  REMEMBER: "aurenis_remember_me",
  INTENDED_ROUTE: "aurenis_intended_route",
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
      // Si ya hay usuario en localStorage, podemos considerarlo hidratado mientras se valida en background
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
      // En caso de fallo de red, conservamos la sesión local si ya existe en memoria
      return user;
    } finally {
      setIsLoading(false);
    }
  }, [token, user, setSessionData]);

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

      if (typeof window !== "undefined" && credentials.rememberMe !== undefined) {
        try {
          localStorage.setItem(AUTH_STORAGE_KEYS.REMEMBER, String(credentials.rememberMe));
        } catch {
          // Ignorar
        }
      }

      return data;
    },
    [setSessionData]
  );

  // Cierre de sesión seguro deshaciendo estado en memoria, storage y cookies del servidor
  const logout = useCallback(async () => {
    // 1. Limpiar estado en memoria inmediatamente
    setUser(null);
    setToken(null);

    // 2. Limpiar almacenamiento local y temporal
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
        localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
        localStorage.removeItem(AUTH_STORAGE_KEYS.REMEMBER);
        sessionStorage.removeItem(AUTH_STORAGE_KEYS.INTENDED_ROUTE);
      } catch {
        // Ignorar
      }
    }

    // 3. Notificar al servidor para invalidar cookie HTTP-only
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignorar fallos de red durante el logout
    } finally {
      // 4. Redirección segura a /login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }, []);

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
      logout: async () => {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      },
    };
  }
  return context;
}
