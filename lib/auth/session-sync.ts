"use client";

/**
 * Utilidad de Sincronización Multi-Pestaña y Control de Expiración de Sesión
 * Responsable de autoría: Maicol R. (Manejo de Sesión Activa Continuo) & Malcom Marcelo (Arquitectura de Tokens)
 */

export type AuthSyncEventType = "LOGIN" | "LOGOUT" | "SESSION_EXPIRED" | "TOKEN_REFRESHED";

export interface AuthSyncMessage {
  type: AuthSyncEventType;
  timestamp: number;
  userId?: string;
  reason?: string;
  token?: string;
}

const BROADCAST_CHANNEL_NAME = "aurenis_auth_sync_channel";
const STORAGE_SYNC_KEY = "aurenis_auth_sync_event";

class SessionSyncManager {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<(msg: AuthSyncMessage) => void> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      try {
        if ("BroadcastChannel" in window) {
          this.channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
          this.channel.onmessage = (event) => {
            if (event.data && typeof event.data === "object") {
              this.notifyListeners(event.data);
            }
          };
        }
      } catch {
        this.channel = null;
      }

      // Fallback con storage event para navegadores o contextos donde BroadcastChannel no esté disponible
      window.addEventListener("storage", (e) => {
        if (e.key === STORAGE_SYNC_KEY && e.newValue) {
          try {
            const data: AuthSyncMessage = JSON.parse(e.newValue);
            this.notifyListeners(data);
          } catch {
            // Ignorar errores de parseo
          }
        }
      });
    }
  }

  public subscribe(listener: (msg: AuthSyncMessage) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(msg: AuthSyncMessage): void {
    this.listeners.forEach((listener) => {
      try {
        listener(msg);
      } catch (err) {
        console.error("Error en listener de sincronización de sesión:", err);
      }
    });
  }

  public broadcast(type: AuthSyncEventType, payload: Partial<AuthSyncMessage> = {}): void {
    const message: AuthSyncMessage = {
      type,
      timestamp: Date.now(),
      ...payload,
    };

    // 1. Notificar por BroadcastChannel
    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch {
        // Fallback a storage si el canal falla
      }
    }

    // 2. Notificar por storage event para pestañas en segundo plano
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_SYNC_KEY, JSON.stringify(message));
      } catch {
        // Ignorar excepciones de storage
      }
    }
  }
}

export const sessionSync = new SessionSyncManager();
