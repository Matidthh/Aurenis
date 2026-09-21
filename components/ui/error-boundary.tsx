"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { ServerCrash, RotateCcw, AlertTriangle, ShieldAlert } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { discreetLogger } from "@/lib/api/discreet-logger";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  title?: string;
  description?: string;
  boundaryName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  isRetrying: boolean;
}

/**
 * Error Boundary para capturar excepciones en el árbol de componentes de React.
 * Previene pantallas blancas en el cliente ("No White Screens"), mostrando
 * un banner/estado de contingencia amigable con opción de reintento funcional.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      isRetrying: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Registrar discretamente sin exponer stack traces técnicos sensibles al usuario
    discreetLogger.logHttp500({
      url: typeof window !== "undefined" ? window.location.pathname : undefined,
      errorMessage: error.message,
      errorCode: `REACT_BOUNDARY_${this.props.boundaryName || "ROOT"}`,
    });
    console.error("[Aurenis Error Boundary Caught]", error, errorInfo);
  }

  handleRetry = async () => {
    this.setState({ isRetrying: true });
    try {
      if (this.props.onReset) {
        await this.props.onReset();
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      this.setState({ hasError: false, error: null, isRetrying: false });
    } catch {
      this.setState({ isRetrying: false });
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="w-full min-h-[360px] p-6 sm:p-10 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-white dark:bg-slate-900 shadow-sm flex flex-col items-center justify-center text-center my-4 animate-in fade-in duration-200"
        >
          <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 shadow-xs">
            <ServerCrash className="w-7 h-7" />
          </div>

          <div className="max-w-md space-y-2 mb-6">
            <div className="flex justify-center">
              <Badge variant="danger" size="sm">
                CONTINGENCIA EN CLIENTE · ERROR CAPTURADO
              </Badge>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {this.props.title || "No fue posible cargar este módulo"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {this.props.description ||
                "Se produjo una excepción inesperada al renderizar la interfaz. El sistema protegió la navegación para evitar el bloqueo de la sesión."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={this.handleRetry}
              isLoading={this.state.isRetrying}
              loadingText="Reintentando..."
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Reintentar módulo
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => window.location.reload()}
            >
              Recargar página
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
