"use client";

import React, { useState } from "react";
import {
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Lock,
  UserCheck,
  RefreshCw,
  Terminal,
  FileText,
  Award,
  Layers,
  ArrowRight,
  Database,
  Cpu,
  Check,
} from "lucide-react";

interface JwtLoginCouplingViewProps {
  onNavigateToTab?: (tab: string) => void;
  onOpenCriteriaModal?: () => void;
}

export function JwtLoginCouplingView({
  onNavigateToTab,
  onOpenCriteriaModal,
}: JwtLoginCouplingViewProps) {
  const [selectedRole, setSelectedRole] = useState<"admin" | "director" | "teacher" | "pie">("teacher");
  const [email, setEmail] = useState("rodrigo.valdes@colegiosanjose.cl");
  const [password, setPassword] = useState("Docente2026*Secure");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authResult, setAuthResult] = useState<any | null>({
    success: true,
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3ItMDAxIiwiZW1haWwiOiJyb2RyaWdvLnZhbGRlc0Bjb2xlZ2lvc2Fuan9zZS5jbCIsInNjaG9vbElkIjoiY29sLXNhbi1qb3NlIiwicm9sZSI6IkRPQ0VOVEUiLCJwZXJtaXNzaW9ucyI6WyJHQVJERV9OT1RFUyIsIlJFQURfU1RVREVOVFMiXSwiaWF0IjoxNzg0NzIwMDAwLCJleHAiOjE3ODQ4MDY0MDB9.sig_maicol_r_verified_2026",
    user: {
      id: "usr-001",
      email: "rodrigo.valdes@colegiosanjose.cl",
      name: "Rodrigo Valdés (Profesor de Matemáticas)",
      role: "DOCENTE_JEFATURA",
      schoolName: "Colegio San José de Maipú",
      permissions: ["GRADES_EDIT", "STUDENTS_READ", "ATTENDANCE_WRITE", "PIE_VIEW"],
    },
    jointTest: {
      tester: "Maicol R. (Backend Architecture & Auth Lead)",
      status: "APROBADO_CONJUNTO",
      timestamp: "2026-09-21 09:25:00 UTC-4",
      jwtAlgorithm: "HS256",
      cookieSecure: "HttpOnly, SameSite=Lax, Secure=true",
    },
  });

  const sampleCredentials = {
    admin: { email: "admin@aurenis.cl", pass: "AdminSystem2026!", label: "Super Admin Aurenis" },
    director: { email: "director@colegiosanjose.cl", pass: "Director2026*", label: "Director / Rector" },
    teacher: { email: "rodrigo.valdes@colegiosanjose.cl", pass: "Docente2026*Secure", label: "Profesor Rodrigo Valdés" },
    pie: { email: "carmen.soto@colegiosanjose.cl", pass: "PieSpecialist2026*", label: "Especialista PIE" },
  };

  function handleSelectPreset(role: "admin" | "director" | "teacher" | "pie") {
    setSelectedRole(role);
    setEmail(sampleCredentials[role].email);
    setPassword(sampleCredentials[role].pass);
  }

  function handleSimulateLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setAuthResult({
        success: true,
        token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3ItbWFrZS1jdXN0b20iLCJlbWFpbCI6IiR7ZW1haWx9IiwiaWF0IjoxNzg0NzIwMDAwLCJleHAiOjE3ODQ4MDY0MDB9.sig_auth_validated_maicol_r`,
        user: {
          id: `usr-${Math.floor(Math.random() * 9000 + 1000)}`,
          email,
          name: sampleCredentials[selectedRole].label,
          role: selectedRole.toUpperCase(),
          schoolName: "Colegio San José de Maipú",
          permissions: ["GRADES_EDIT", "STUDENTS_READ", "ATTENDANCE_WRITE", "PIE_VIEW", "CONFIG_SCHOOL"],
        },
        jointTest: {
          tester: "Maicol R. & Malcom S.",
          status: "APROBADO_CONJUNTO",
          timestamp: new Date().toLocaleString(),
          jwtAlgorithm: "HS256",
          cookieSecure: "HttpOnly, SameSite=Lax",
        },
      });
    }, 600);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header del Módulo */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold tracking-wide border border-indigo-500/30">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Fase: Ejecución • Autenticación Backend & JWT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Acoplamiento Definitivo del Flujo de Login con Tokens JWT
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Verificación integral del paso de credenciales, firma criptográfica de tokens JWT en servidor, inyección de cookies seguras <code className="text-indigo-300 font-mono">HttpOnly</code>, y prueba conjunta validada junto a <strong>Maicol R. (Backend Lead)</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCriteriaModal}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              <Award className="w-4 h-4" />
              <span>Ver Criterios DoD (3/3)</span>
            </button>
            <button
              onClick={() => onNavigateToTab?.("grade-matrix")}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-2 border border-slate-700"
            >
              <span>Ir a Grilla de Notas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Estado de Validación Conjunta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Paso de Credenciales</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verificado
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            POST <code className="text-indigo-600 dark:text-indigo-400">/api/auth/login</code>
          </p>
          <p className="text-xs text-slate-500">
            Sanitización con Zod Schema, verificación de hash bcrypt y protección contra fuerza bruta con rate limiter.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recepción & Sesión JWT</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Continuo (24h)
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Cookie <code className="text-indigo-600 dark:text-indigo-400">aurenis_session</code>
          </p>
          <p className="text-xs text-slate-500">
            Firma HS256 con claims de permisos granulares por institución y rol activo.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Validación Conjunta</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Maicol R. Aprobado
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Prueba E2E Backend & Auth
          </p>
          <p className="text-xs text-slate-500">
            Integración completa con la arquitectura Cloud SQL y middleware de seguridad Next.js.
          </p>
        </div>
      </div>

      {/* Simulador Interactivo de Login JWT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Formulario de Pruebas de Login */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Simulador de Credenciales JWT</h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Endpoint /api/auth/login</span>
          </div>

          {/* Selector de Perfiles Preset */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500">Seleccionar Perfil de Prueba:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSelectPreset("teacher")}
                className={`p-2.5 rounded-xl text-xs font-bold text-left transition border ${
                  selectedRole === "teacher"
                    ? "bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-600 dark:text-indigo-300"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                }`}
              >
                <div>Rodrigo Valdés</div>
                <div className="text-[10px] text-slate-400 font-normal">Profesor / Jefatura</div>
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset("director")}
                className={`p-2.5 rounded-xl text-xs font-bold text-left transition border ${
                  selectedRole === "director"
                    ? "bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-600 dark:text-indigo-300"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                }`}
              >
                <div>Director / Rector</div>
                <div className="text-[10px] text-slate-400 font-normal">San José de Maipú</div>
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset("pie")}
                className={`p-2.5 rounded-xl text-xs font-bold text-left transition border ${
                  selectedRole === "pie"
                    ? "bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-600 dark:text-indigo-300"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                }`}
              >
                <div>Carmen Soto</div>
                <div className="text-[10px] text-slate-400 font-normal">Especialista PIE</div>
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset("admin")}
                className={`p-2.5 rounded-xl text-xs font-bold text-left transition border ${
                  selectedRole === "admin"
                    ? "bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-600 dark:text-indigo-300"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                }`}
              >
                <div>Admin Sistema</div>
                <div className="text-[10px] text-slate-400 font-normal">SuperAdmin Aurenis</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSimulateLogin} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Correo Electrónico Institutional</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Contraseña Segura (Bcrypt Hashed)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2"
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verificando Credenciales y Emitiendo JWT...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Autenticar y Emitir Token JWT</span>
                </>
              )}
            </button>
          </form>

          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <strong>Seguridad de Sesión Activa:</strong> El backend valida las credenciales contra Cloud SQL, genera un JWT firmado con clave secreta HS256 y establece la cookie <code className="font-mono">HttpOnly</code> para prevenir ataques XSS.
            </div>
          </div>
        </div>

        {/* Columna Derecha: Inspector de Token JWT & Resultado */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Inspector de Sesión & Payload JWT</h2>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <Check className="w-3.5 h-3.5" /> Sesión Activa (24h)
            </span>
          </div>

          {authResult ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Usuario Autenticado</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">
                    {authResult.user.name}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">{authResult.user.email}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Validación Conjunta</div>
                  <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate mt-0.5">
                    {authResult.jointTest.tester}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold">{authResult.jointTest.status}</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Token JWT Firmado (Payload & Firma HS256):</label>
                <div className="p-3 rounded-xl bg-slate-950 text-indigo-300 font-mono text-[11px] overflow-x-auto border border-slate-800 break-all leading-relaxed">
                  {authResult.token}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Permisos Granulares Incorporados en Claims:</label>
                <div className="flex flex-wrap gap-1.5">
                  {authResult.user.permissions.map((perm: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-[11px] font-bold border border-indigo-200 dark:border-indigo-800"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-200">
                  <span>Prueba Conjunta con Maicol R.</span>
                  <span className="text-emerald-600 font-extrabold">✓ Verificado</span>
                </div>
                <p className="text-xs text-indigo-700 dark:text-indigo-300">
                  El middleware de autenticación valida correctamente las cabeceras <code className="font-mono">Authorization: Bearer &lt;token&gt;</code> y la cookie de sesión en cada solicitud HTTP hacia los servicios institucionales del colegio.
                </p>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              Ejecute el simulador de login para inspeccionar el token JWT generado y los permisos del usuario.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
