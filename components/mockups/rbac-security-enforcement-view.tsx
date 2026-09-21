"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  EyeOff,
  UserCheck,
  KeyRound,
  CheckCircle2,
  XCircle,
  Terminal,
  ArrowRight,
  Award,
  Sliders,
  Layers,
  Database,
} from "lucide-react";
import { ActiveTab } from "./figma-toolbar";

interface RbacSecurityEnforcementViewProps {
  onNavigateToTab?: (tab: ActiveTab) => void;
  onOpenCriteriaModal?: () => void;
}

type UserRole = "SUPER_ADMIN" | "DIRECTOR" | "DOCENTE_JEFATURA" | "ESPECIALISTA_PIE" | "ESTUDIANTE_INVITADO";

interface RoleConfig {
  name: string;
  badgeColor: string;
  description: string;
  canEditGrades: boolean;
  canManageTeachers: boolean;
  canAccessSystemConfig: boolean;
  canViewAuditLogs: boolean;
}

const ROLES_CATALOG: Record<UserRole, RoleConfig> = {
  SUPER_ADMIN: {
    name: "Super Administrador",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    description: "Acceso total a configuración institucional, gestión de usuarios y auditoría global.",
    canEditGrades: true,
    canManageTeachers: true,
    canAccessSystemConfig: true,
    canViewAuditLogs: true,
  },
  DIRECTOR: {
    name: "Director / Rector",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    description: "Visualización de dashboards directivos, aprobación de actas y supervisión docente.",
    canEditGrades: false,
    canManageTeachers: true,
    canAccessSystemConfig: false,
    canViewAuditLogs: true,
  },
  DOCENTE_JEFATURA: {
    name: "Docente de Jefatura",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    description: "Edición de calificaciones Decreto 67, asistencia y fichas de alumnos asignados.",
    canEditGrades: true,
    canManageTeachers: false,
    canAccessSystemConfig: false,
    canViewAuditLogs: false,
  },
  ESPECIALISTA_PIE: {
    name: "Especialista PIE / Psicopedagoga",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    description: "Acceso a informes de integración escolar, adecuaciones curriculares y evaluaciones diferenciales.",
    canEditGrades: false,
    canManageTeachers: false,
    canAccessSystemConfig: false,
    canViewAuditLogs: false,
  },
  ESTUDIANTE_INVITADO: {
    name: "Estudiante / Invitado Externo",
    badgeColor: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    description: "Acceso estrictamente de lectura a sus propias calificaciones y certificados.",
    canEditGrades: false,
    canManageTeachers: false,
    canAccessSystemConfig: false,
    canViewAuditLogs: false,
  },
};

export function RbacSecurityEnforcementView({
  onNavigateToTab,
  onOpenCriteriaModal,
}: RbacSecurityEnforcementViewProps) {
  const [currentRole, setCurrentRole] = useState<UserRole>("ESTUDIANTE_INVITADO");
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("PUT /api/grades/batch-update");
  const [simulationResult, setSimulationResult] = useState<{
    tested: boolean;
    allowed: boolean;
    httpStatus: number;
    responseMessage: string;
    uiBehavior: string;
  }>({
    tested: false,
    allowed: false,
    httpStatus: 403,
    responseMessage: "AccessDeniedError: El rol actual no posee el permiso 'GRADES_EDIT'. Petición rechazada en servidor.",
    uiBehavior: "El botón de guardado y edición masiva se encuentra oculto (display: none / conditional render) en la interfaz de usuario.",
  });

  const activeConfig = ROLES_CATALOG[currentRole];

  function handleTestEndpoint(endpoint: string) {
    setSelectedEndpoint(endpoint);
    let allowed = false;
    let httpStatus = 200;
    let message = "";
    let ui = "";

    if (endpoint.includes("grades")) {
      allowed = activeConfig.canEditGrades;
      httpStatus = allowed ? 200 : 403;
      message = allowed
        ? "HTTP 200 OK: Calificaciones actualizadas y registradas con auditoría."
        : "HTTP 403 Forbidden: Insufficient permissions [GRADES_EDIT required]. Endpoint bloqueado por middleware.";
      ui = allowed
        ? "El usuario puede ver y accionar los controles de edición en la grilla."
        : "El botón 'Guardar Notas' está oculto y los inputs se renderizan en modo sólo lectura (disabled).";
    } else if (endpoint.includes("teachers")) {
      allowed = activeConfig.canManageTeachers;
      httpStatus = allowed ? 200 : 403;
      message = allowed
        ? "HTTP 200 OK: Nómina docente actualizada exitosamente."
        : "HTTP 403 Forbidden: Insufficient permissions [TEACHERS_MANAGE required].";
      ui = allowed
        ? "Los botones de 'Nuevo Profesor' y 'Asignar Horas' están visibles."
        : "Las opciones de administración docente están ocultas en la barra de navegación.";
    } else if (endpoint.includes("config")) {
      allowed = activeConfig.canAccessSystemConfig;
      httpStatus = allowed ? 200 : 403;
      message = allowed
        ? "HTTP 200 OK: Configuración del sistema guardada."
        : "HTTP 403 Forbidden: Restricted to SUPER_ADMIN role only.";
      ui = allowed
        ? "El panel de configuración global está habilitado."
        : "El módulo de configuración global no aparece en el menú del usuario.";
    }

    setSimulationResult({
      tested: true,
      allowed,
      httpStatus,
      responseMessage: message,
      uiBehavior: ui,
    });
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold tracking-wide border border-purple-500/30">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Fase: Ejecución • Control de Acceso Basado en Roles (RBAC)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Ocultamiento en UI y Rechazo de Endpoints por Roles Desautorizados
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Sincronización estricta 100% efectiva entre los permisos del token JWT y el renderizado condicional de componentes en el cliente, combinada con la validación defensiva en cada ruta de API del servidor.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCriteriaModal}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-purple-600/30"
            >
              <Award className="w-4 h-4" />
              <span>Ver Criterios DoD (3/3)</span>
            </button>
            <button
              onClick={() => onNavigateToTab?.("grade-matrix")}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-2 border border-slate-700"
            >
              <span>Probar en Grilla de Notas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Selector de Rol Activo */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Simulador de Rol Activo en Sesión (Contexto RBAC)
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Cambia de rol para observar cómo se ocultan botones en la UI y se rechazan peticiones en el servidor.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {(Object.keys(ROLES_CATALOG) as UserRole[]).map((roleKey) => {
            const cfg = ROLES_CATALOG[roleKey];
            const isSelected = currentRole === roleKey;
            return (
              <button
                key={roleKey}
                onClick={() => {
                  setCurrentRole(roleKey);
                  // Auto test default endpoint for this role
                  handleTestEndpoint(selectedEndpoint);
                }}
                className={`p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between gap-2 ${
                  isSelected
                    ? "bg-purple-50 dark:bg-purple-950/60 border-purple-500 shadow-md ring-1 ring-purple-500/50"
                    : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div>
                  <div className={`text-[10px] px-2 py-0.5 rounded-full font-bold inline-block border mb-1.5 ${cfg.badgeColor}`}>
                    {roleKey}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {cfg.name}
                  </h4>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {cfg.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulador Interactivo: UI Ocultando Opciones & Servidor Rechazando Endpoints */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Comportamiento de la Interfaz (UI Gating) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                1. Interfaz Ocultando Opciones según Rol
              </h3>
            </div>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${activeConfig.badgeColor}`}>
              {activeConfig.name}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Elementos de control visibles e interactivos para el usuario actual:
          </p>

          <div className="space-y-3 pt-1">
            {/* Componente 1: Editar Calificaciones */}
            <div className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
              activeConfig.canEditGrades
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800"
                : "bg-slate-100 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 opacity-60"
            }`}>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Botón &quot;Editar Calificaciones (Decreto 67)&quot;
                </span>
                <span className="text-[11px] text-slate-500">
                  {activeConfig.canEditGrades ? "Visible y habilitado en grilla de notas." : "Oculto de la interfaz (Renderizado condicional desactivado)."}
                </span>
              </div>
              <div>
                {activeConfig.canEditGrades ? (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Visible
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-400 dark:bg-slate-800 text-slate-200 text-[11px] font-bold flex items-center gap-1">
                    <EyeOff className="w-3.5 h-3.5" /> Oculto
                  </span>
                )}
              </div>
            </div>

            {/* Componente 2: Gestión de Profesores */}
            <div className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
              activeConfig.canManageTeachers
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800"
                : "bg-slate-100 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 opacity-60"
            }`}>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Módulo &quot;Nómina y Directorio Docente&quot;
                </span>
                <span className="text-[11px] text-slate-500">
                  {activeConfig.canManageTeachers ? "Pestaña de gestión y alta docente visible." : "Opción removida de la barra de navegación lateral."}
                </span>
              </div>
              <div>
                {activeConfig.canManageTeachers ? (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Visible
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-400 dark:bg-slate-800 text-slate-200 text-[11px] font-bold flex items-center gap-1">
                    <EyeOff className="w-3.5 h-3.5" /> Oculto
                  </span>
                )}
              </div>
            </div>

            {/* Componente 3: Configuración Institucional */}
            <div className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
              activeConfig.canAccessSystemConfig
                ? "bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800"
                : "bg-slate-100 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 opacity-60"
            }`}>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Panel &quot;Configuración Global & Base de Datos&quot;
                </span>
                <span className="text-[11px] text-slate-500">
                  {activeConfig.canAccessSystemConfig ? "Disponible exclusivamente para Super Admin." : "Bloqueado y oculto para este rol."}
                </span>
              </div>
              <div>
                {activeConfig.canAccessSystemConfig ? (
                  <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white text-[11px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Visible
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-400 dark:bg-slate-800 text-slate-200 text-[11px] font-bold flex items-center gap-1">
                    <EyeOff className="w-3.5 h-3.5" /> Oculto
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Servidor Rechazando Peticiones No Permitidas */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-white">
                  2. Backend Rechazando Endpoints No Permitidos
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Middleware RBAC</span>
            </div>

            <p className="text-xs text-slate-300">
              Pruebe simular una solicitud HTTP directa desde el cliente hacia rutas protegidas del servidor:
            </p>

            {/* Selector de Endpoint */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleTestEndpoint("PUT /api/grades/batch-update")}
                className={`p-2.5 rounded-xl text-xs font-bold font-mono transition text-left border ${
                  selectedEndpoint.includes("grades")
                    ? "bg-indigo-900/60 border-indigo-500 text-indigo-200"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"
                }`}
              >
                PUT /api/grades
              </button>
              <button
                type="button"
                onClick={() => handleTestEndpoint("POST /api/teachers/create")}
                className={`p-2.5 rounded-xl text-xs font-bold font-mono transition text-left border ${
                  selectedEndpoint.includes("teachers")
                    ? "bg-indigo-900/60 border-indigo-500 text-indigo-200"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"
                }`}
              >
                POST /api/teachers
              </button>
              <button
                type="button"
                onClick={() => handleTestEndpoint("DELETE /api/system/wipe-db")}
                className={`p-2.5 rounded-xl text-xs font-bold font-mono transition text-left border ${
                  selectedEndpoint.includes("config") || selectedEndpoint.includes("system")
                    ? "bg-indigo-900/60 border-indigo-500 text-indigo-200"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"
                }`}
              >
                DELETE /api/system
              </button>
            </div>

            {/* Resultado de la simulación del servidor */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Endpoint: {selectedEndpoint}</span>
                <span className={`px-2 py-0.5 rounded font-bold ${
                  simulationResult.httpStatus === 200 ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
                }`}>
                  HTTP {simulationResult.httpStatus} {simulationResult.httpStatus === 200 ? "OK" : "FORBIDDEN"}
                </span>
              </div>

              <div className="text-xs font-mono text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800">
                {simulationResult.responseMessage}
              </div>

              <div className="text-[11px] text-slate-400 pt-1">
                <strong>Comportamiento UI sincronizado:</strong> {simulationResult.uiBehavior}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Sincronización de roles: 100% Efectiva</span>
            <span>Seguridad Defensiva en Capas</span>
          </div>
        </div>
      </div>
    </div>
  );
}
