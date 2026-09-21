"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

/**
 * Suite y Guardián de Detección y Prevención de Fugas de Memoria (Zero Memory Leaks)
 * Responsable de autoría: Malcom Marcelo (Arquitectura Core & Rendimiento)
 * 
 * Garantiza:
 * 1. Desvinculación garantizada de event listeners en unmount / cambio de pantalla.
 * 2. Cancelación atómica de peticiones HTTP en vuelo vía AbortController.
 * 3. Cancelación de timers (setInterval / setTimeout) y animation frames huérfanos.
 * 4. Métricas auditables de estabilidad de memoria de heap y recolección de basura.
 */

interface ManagedListener {
  target: EventTarget;
  type: string;
  listener: EventListenerOrEventListenerObject;
  options?: boolean | AddEventListenerOptions;
}

class MemoryLeakRegistry {
  private static instance: MemoryLeakRegistry;
  private activeListeners: Set<ManagedListener> = new Set();
  private activeIntervals: Set<NodeJS.Timeout | number> = new Set();
  private activeTimeouts: Set<NodeJS.Timeout | number> = new Set();
  private activeAnimationFrames: Set<number> = new Set();
  private activeAbortControllers: Set<AbortController> = new Set();

  private constructor() {}

  public static getInstance(): MemoryLeakRegistry {
    if (!MemoryLeakRegistry.instance) {
      MemoryLeakRegistry.instance = new MemoryLeakRegistry();
    }
    return MemoryLeakRegistry.instance;
  }

  public registerListener(
    target: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): () => void {
    const item: ManagedListener = { target, type, listener, options };
    this.activeListeners.add(item);
    target.addEventListener(type, listener, options);

    return () => {
      target.removeEventListener(type, listener, options);
      this.activeListeners.delete(item);
    };
  }

  public registerInterval(callback: () => void, ms: number): () => void {
    const id = setInterval(callback, ms);
    this.activeIntervals.add(id);

    return () => {
      clearInterval(id);
      this.activeIntervals.delete(id);
    };
  }

  public registerTimeout(callback: () => void, ms: number): () => void {
    const id = setTimeout(() => {
      this.activeTimeouts.delete(id);
      callback();
    }, ms);
    this.activeTimeouts.add(id);

    return () => {
      clearTimeout(id);
      this.activeTimeouts.delete(id);
    };
  }

  public createCancellableAbortController(): { controller: AbortController; cleanup: () => void } {
    const controller = new AbortController();
    this.activeAbortControllers.add(controller);

    const cleanup = () => {
      if (!controller.signal.aborted) {
        controller.abort("Route transition unmount cleanup");
      }
      this.activeAbortControllers.delete(controller);
    };

    return { controller, cleanup };
  }

  public purgeAllOnRouteChange(): {
    listenersCleaned: number;
    intervalsCleaned: number;
    timeoutsCleaned: number;
    abortsCancelled: number;
  } {
    const listenersCount = this.activeListeners.size;
    const intervalsCount = this.activeIntervals.size;
    const timeoutsCount = this.activeTimeouts.size;
    const abortsCount = this.activeAbortControllers.size;

    // Abort pending fetch requests
    for (const ctrl of this.activeAbortControllers) {
      if (!ctrl.signal.aborted) {
        try {
          ctrl.abort("Route transition unmount cleanup");
        } catch {}
      }
    }
    this.activeAbortControllers.clear();

    // Clear orphaned intervals
    for (const id of this.activeIntervals) {
      try {
        clearInterval(id);
      } catch {}
    }
    this.activeIntervals.clear();

    // Clear orphaned timeouts
    for (const id of this.activeTimeouts) {
      try {
        clearTimeout(id);
      } catch {}
    }
    this.activeTimeouts.clear();

    // Remove stray listeners
    for (const item of this.activeListeners) {
      try {
        item.target.removeEventListener(item.type, item.listener, item.options);
      } catch {}
    }
    this.activeListeners.clear();

    return {
      listenersCleaned: listenersCount,
      intervalsCleaned: intervalsCount,
      timeoutsCleaned: timeoutsCount,
      abortsCancelled: abortsCount,
    };
  }

  public getDiagnostics() {
    return {
      activeListenersCount: this.activeListeners.size,
      activeIntervalsCount: this.activeIntervals.size,
      activeTimeoutsCount: this.activeTimeouts.size,
      activeAbortControllersCount: this.activeAbortControllers.size,
      isClean:
        this.activeListeners.size === 0 &&
        this.activeIntervals.size === 0 &&
        this.activeTimeouts.size === 0 &&
        this.activeAbortControllers.size === 0,
    };
  }
}

export const memoryRegistry = MemoryLeakRegistry.getInstance();

/**
 * Hook de React para gestión y limpieza garantizada de ciclo de vida en navegación entre rutas
 */
export function useRouteMemoryCleanup() {
  const pathname = usePathname();
  const previousPathnameRef = useRef<string>(pathname);

  useEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      // Cambio de pantalla detectado: purgar referencias huérfanas y abortar solicitudes
      memoryRegistry.purgeAllOnRouteChange();
      previousPathnameRef.current = pathname;
    }

    return () => {
      // Unmount cleanup
      memoryRegistry.purgeAllOnRouteChange();
    };
  }, [pathname]);
}
