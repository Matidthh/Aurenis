"use client";

import React, { useState, useEffect, useRef, useId, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Building2,
  GraduationCap,
  BookOpen,
  UserCog,
  Users,
  ShieldCheck,
  TrendingUp,
  X,
  Loader2,
  KeyRound,
  Phone,
  School,
  CheckCircle2,
} from "lucide-react";
import { AurenisLogo } from "@/components/ui/aurenis-logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";
import { LoginFormSchema } from "@/lib/validations/auth.schema";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { cn } from "@/lib/utils/cn";
import { PasswordStrengthMeter } from "@/components/auth/password-strength-meter";

interface DemoAccount {
  id: string;
  roleKey: "director" | "profesor" | "alumno" | "superadmin" | "apoderado";
  roleTitle: string;
  institutionName: string;
  institutionCode: string;
  name: string;
  identifier: string;
  pass: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeColor: string;
  description: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: "demo-lpmm-director",
    roleKey: "director",
    roleTitle: "Director de Establecimiento",
    institutionName: "Liceo Politécnico Marga Marga",
    institutionCode: "LPMM-001 (RBD 10240)",
    name: "Dirección Liceo Marga Marga",
    identifier: "director@lpmm.cl",
    pass: "AdminLPMM2026!",
    icon: Building2,
    badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    description: "Gestión ejecutiva, libro digital de clases, supervisión y métricas ministeriales LPMM.",
  },
  {
    id: "demo-lpmm-profesor",
    roleKey: "profesor",
    roleTitle: "Docente Jefatura 1° Medio A",
    institutionName: "Liceo Politécnico Marga Marga",
    institutionCode: "LPMM-001 (RBD 10240)",
    name: "Rodrigo Castro Díaz",
    identifier: "profesor.rodrigo@lpmm.cl",
    pass: "ProfesorLpmm2026!",
    icon: BookOpen,
    badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    description: "Libro de clases oficial LPMM, notas, asignaturas TP y control de asistencia mensual.",
  },
  {
    id: "demo-lpmm-alumno",
    roleKey: "alumno",
    roleTitle: "Estudiante 1° Medio A",
    institutionName: "Liceo Politécnico Marga Marga",
    institutionCode: "LPMM-001 (RBD 10240)",
    name: "Yamir Alonso Ahumada",
    identifier: "yamir.ahumada@lpmm.cl",
    pass: "Estudiantelpmm2026",
    icon: GraduationCap,
    badgeColor: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    description: "Portal de calificaciones y asistencia sincronizadas desde planilla ministerial.",
  },
  {
    id: "demo-lpmm-apoderado",
    roleKey: "apoderado",
    roleTitle: "Apoderada / Familia",
    institutionName: "Liceo Politécnico Marga Marga",
    institutionCode: "LPMM-001 (RBD 10240)",
    name: "María Belén Ahumada",
    identifier: "apoderado.1@lpmm.cl",
    pass: "ApoderadoLpmm2026!",
    icon: Users,
    badgeColor: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    description: "Seguimiento pedagógico del estudiante, citaciones, comunicaciones y reportes.",
  },
  {
    id: "demo-superadmin",
    roleKey: "superadmin",
    roleTitle: "Administrador Global de Red",
    institutionName: "Aurenis Central",
    institutionCode: "PLATFORM",
    name: "SuperAdmin Aurenis",
    identifier: "admin@aurenis.com",
    pass: "AurenisSuperAdmin2026!",
    icon: UserCog,
    badgeColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    description: "Gestión central de colegios, licenciamiento, auditoría general e integraciones.",
  },
];

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.88c2.28-2.09 3.665-5.17 3.665-9.14z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.04c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.25 21.37 7.32 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.28c-.25-.72-.38-1.49-.38-2.28s.13-1.56.38-2.28V6.59H1.26C.46 8.19 0 9.99 0 12s.46 3.81 1.26 5.41l4.02-3.13z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.32 0 3.25 2.63 1.26 6.59l4.02 3.13c.95-2.83 3.6-4.97 6.72-4.97z"
      />
    </svg>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSessionData } = useAuth();
  const schoolParam = searchParams.get("school") || searchParams.get("slug");

  // Form states
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [capsLockActive, setCapsLockActive] = useState(false);

  // Validation states
  const [touched, setTouched] = useState({ identifier: false, password: false });
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Network and server call states
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [activeDemoId, setActiveDemoId] = useState<string | null>(null);

  // Modals
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Google OAuth states
  const [googleEmailInput, setGoogleEmailInput] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  const identifierInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Detección de Bloqueo de Mayúsculas
  function handleCapsLock(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState("CapsLock"));
    }
  }

  // Validación con Zod Schema
  function validateIdentifier(val: string): string | undefined {
    const res = LoginFormSchema.shape.identifier.safeParse(val);
    if (!res.success) {
      return res.error.issues[0]?.message || "El correo electrónico es obligatorio.";
    }
    return undefined;
  }

  function validatePassword(val: string): string | undefined {
    const res = LoginFormSchema.shape.password.safeParse(val);
    if (!res.success) {
      return res.error.issues[0]?.message || "La contraseña es requerida.";
    }
    return undefined;
  }

  function handleIdentifierChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setIdentifier(val);
    if (serverError) setServerError(null);

    if (touched.identifier || hasSubmitted) {
      setErrors((prev) => ({ ...prev, identifier: validateIdentifier(val) }));
    }
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setPassword(val);
    if (serverError) setServerError(null);

    if (touched.password || hasSubmitted) {
      setErrors((prev) => ({ ...prev, password: validatePassword(val) }));
    }
  }

  function handleBlur(field: "identifier" | "password") {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "identifier") {
      setErrors((prev) => ({ ...prev, identifier: validateIdentifier(identifier) }));
    } else {
      setErrors((prev) => ({ ...prev, password: validatePassword(password) }));
    }
  }

  // Envío del formulario
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setHasSubmitted(true);
    setServerError(null);

    // Validación completa con Zod
    const validation = LoginFormSchema.safeParse({
      identifier,
      password,
      schoolSlug: schoolParam || undefined,
      rememberMe,
    });

    if (!validation.success) {
      const fieldErrors: { identifier?: string; password?: string } = {};
      for (const issue of validation.error.issues) {
        if (issue.path[0] === "identifier" && !fieldErrors.identifier) {
          fieldErrors.identifier = issue.message;
        }
        if (issue.path[0] === "password" && !fieldErrors.password) {
          fieldErrors.password = issue.message;
        }
      }
      setErrors(fieldErrors);
      if (fieldErrors.identifier) {
        identifierInputRef.current?.focus();
      } else if (fieldErrors.password) {
        passwordInputRef.current?.focus();
      }
      return;
    }

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setServerError("Sin conexión a Internet. Por favor verifica tu conectividad de red e intenta nuevamente.");
      return;
    }

    setIsLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: identifier.trim(),
          password,
          schoolSlug: schoolParam || undefined,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 429) {
          const retryMsg = data?.retryAfter ? ` en ${data.retryAfter} segundos` : " en unos instantes";
          throw new Error(`Demasiados intentos fallidos. Por protección escolar reintenta${retryMsg}.`);
        }
        if (res.status === 401) {
          throw new Error(data?.error || "Credenciales incorrectas o usuario no registrado en el establecimiento.");
        }
        if (res.status === 400) {
          throw new Error(data?.error || "Los datos de acceso no cumplen con el formato institucional.");
        }
        if (res.status >= 500) {
          throw new Error("El servidor institucional de Aurenis no se encuentra disponible momentáneamente. Intenta nuevamente.");
        }
        throw new Error(data?.error || "No fue posible iniciar sesión con las credenciales provistas.");
      }

      if (!data) {
        throw new Error("Respuesta inválida o vacía del servidor.");
      }

      if (data.user) {
        const rawUser = data.user;
        const sessionUser: any = {
          userId: rawUser.id || rawUser.userId || "user-" + Date.now(),
          email: rawUser.email || identifier.trim(),
          firstName: rawUser.firstName || rawUser.name?.split(" ")[0] || "Usuario",
          lastName: rawUser.lastName || rawUser.name?.split(" ").slice(1).join(" ") || "",
          isSystemAdmin: !!rawUser.isSystemAdmin,
          activeSchoolId: rawUser.activeSchool?.id,
          activeSchoolSlug: rawUser.activeSchool?.slug,
          activeMembershipId: rawUser.membershipId,
          roleName: rawUser.roleName || (rawUser.isSystemAdmin ? "SYSTEM_ADMIN" : "SCHOOL_ADMIN"),
          permissions: rawUser.permissions || ["*"],
        };
        setSessionData(sessionUser, data.token || null);
      }

      const targetUrl = data.redirectUrl || "/select-school";
      router.push(targetUrl);
      setTimeout(() => {
        if (typeof window !== "undefined" && window.location.pathname !== targetUrl) {
          window.location.assign(targetUrl);
        }
      }, 150);
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      let message = "Error al autenticar con el servidor escolar.";
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          message = "El servidor institucional tardó demasiado en responder (tiempo de espera agotado). Verifica tu conexión.";
        } else {
          message = err.message;
        }
      }
      setServerError(message);
      setIsLoading(false);
    }
  }

  // Ingreso directo en 1 clic para cuentas demo
  async function handleQuickLogin(account: DemoAccount) {
    setIdentifier(account.identifier);
    setPassword(account.pass);
    setServerError(null);
    setErrors({});
    setIsLoading(true);
    setActiveDemoId(account.id);
    setIsDemoModalOpen(false);

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setServerError("Sin conexión a Internet para iniciar sesión de demostración.");
      setIsLoading(false);
      setActiveDemoId(null);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: account.identifier.trim(),
          password: account.pass,
          schoolSlug: schoolParam || undefined,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 429) {
          throw new Error("Límite de peticiones alcanzado. Por favor espera unos momentos antes de reintentar.");
        }
        throw new Error(data?.error || "No fue posible iniciar sesión con la cuenta de prueba.");
      }

      if (data?.user) {
        const rawUser = data.user;
        const sessionUser: any = {
          userId: rawUser.id || rawUser.userId || "user-" + Date.now(),
          email: rawUser.email || account.identifier.trim(),
          firstName: rawUser.firstName || rawUser.name?.split(" ")[0] || "Usuario",
          lastName: rawUser.lastName || rawUser.name?.split(" ").slice(1).join(" ") || "",
          isSystemAdmin: !!rawUser.isSystemAdmin,
          activeSchoolId: rawUser.activeSchool?.id,
          activeSchoolSlug: rawUser.activeSchool?.slug,
          activeMembershipId: rawUser.membershipId,
          roleName: rawUser.roleName || (rawUser.isSystemAdmin ? "SYSTEM_ADMIN" : "SCHOOL_ADMIN"),
          permissions: rawUser.permissions || ["*"],
        };
        setSessionData(sessionUser, data.token || null);
      }

      const targetUrl = data.redirectUrl || "/select-school";
      router.push(targetUrl);
      setTimeout(() => {
        if (typeof window !== "undefined" && window.location.pathname !== targetUrl) {
          window.location.assign(targetUrl);
        }
      }, 150);
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      let message = "Error al iniciar sesión con la cuenta seleccionada.";
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          message = "Tiempo de espera agotado al conectar con la cuenta demo. Intenta de nuevo.";
        } else {
          message = err.message;
        }
      }
      setServerError(message);
      setIsLoading(false);
      setActiveDemoId(null);
    }
  }

  async function handleExecuteGoogleLogin(emailToUse: string) {
    if (!emailToUse || !emailToUse.includes("@")) {
      setGoogleError("Por favor ingresa un correo electrónico institucional de Google válido.");
      return;
    }
    setGoogleLoading(true);
    setGoogleError(null);
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToUse.trim() }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || "Error al autenticar con Google Workspace for Education.");
      }

      if (data?.user) {
        const rawUser = data.user;
        const sessionUser: any = {
          userId: rawUser.id || "user-" + Date.now(),
          email: rawUser.email || emailToUse,
          firstName: rawUser.name?.split(" ")[0] || "Google",
          lastName: rawUser.name?.split(" ").slice(1).join(" ") || "User",
          isSystemAdmin: !!rawUser.isSystemAdmin,
          activeSchoolId: rawUser.activeSchool?.id,
          activeSchoolSlug: rawUser.activeSchool?.slug,
          roleName: rawUser.roleName || "SCHOOL_ADMIN",
          permissions: rawUser.permissions || ["*"],
        };
        setSessionData(sessionUser, data.token || null);
      }

      const targetUrl = data.redirectUrl || "/select-school";
      router.push(targetUrl);
      setTimeout(() => {
        if (typeof window !== "undefined" && window.location.pathname !== targetUrl) {
          window.location.assign(targetUrl);
        }
      }, 150);
    } catch (err: unknown) {
      setGoogleError(err instanceof Error ? err.message : "Error al iniciar sesión con Google Workspace.");
      setGoogleLoading(false);
    }
  }

  function handleGoogleLogin() {
    setIsGoogleModalOpen(true);
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#F8FAFC] text-[#0F172A] selection:bg-[#3B82F6] selection:text-white font-sans antialiased">
      {/* =========================================================================
          COLUMNA IZQUIERDA: HERO PANEL INSTITUCIONAL (Desktop 1280px+ & Tablet 768px-1024px)
          ========================================================================= */}
      <section className="hidden md:flex md:w-5/12 lg:w-1/2 xl:w-5/12 relative overflow-hidden bg-[#0A1128] text-white flex-col justify-between p-8 sm:p-10 lg:p-14 xl:p-16 select-none shrink-0">
        {/* Imagen de fondo de campus moderno con gradiente azul nocturno */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/campus-building.jpg"
            alt="Campus Educativo Moderno Aurenis"
            fill
            className="object-cover object-center opacity-35"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080E20]/95 via-[#0A1638]/90 to-[#060B1A]/98" />
        </div>

        {/* Cabecera Izquierda: Logotipo Aurenis Blanco */}
        <header className="relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-xl"
            aria-label="Volver a la página principal de Aurenis"
          >
            <AurenisLogo
              className="w-9 h-9"
              textClassName="text-white text-xl font-bold tracking-tight"
              showText={true}
              preferSvg={true}
            />
          </Link>
        </header>

        {/* Bloque Central de Contenido y Características */}
        <div className="relative z-10 my-auto py-8">
          <span className="block uppercase tracking-[0.2em] text-[11px] font-semibold text-[#93C5FD] mb-3">
            Plataforma Académica
          </span>

          <h1 className="text-3xl lg:text-4xl xl:text-[44px] font-bold tracking-tight text-white leading-[1.15]">
            El futuro de la educación <br />
            <span className="text-[#38BDF8]">comienza aquí</span>
          </h1>

          <p className="text-slate-300 text-sm lg:text-base leading-relaxed mt-4 max-w-md font-normal">
            Gestiona, organiza y potencia el aprendizaje en un solo lugar. AURENIS te acompaña en cada paso del camino.
          </p>

          {/* Lista de Características con Iconografía Oficial */}
          <div className="space-y-4 mt-8 lg:mt-10">
            {[
              {
                icon: BookOpen,
                text: "Gestión académica integral",
              },
              {
                icon: Users,
                text: "Seguimiento de estudiantes",
              },
              {
                icon: TrendingUp,
                text: "Reportes y estadísticas",
              },
              {
                icon: ShieldCheck,
                text: "Acceso seguro y personalizado",
              },
            ].map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div key={idx} className="flex items-center gap-3.5 group">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center text-blue-400 shrink-0 shadow-sm backdrop-blur-xs transition-colors group-hover:bg-white/[0.12] group-hover:border-blue-400/40">
                    <IconComp className="w-5 h-5 text-[#38BDF8]" />
                  </div>
                  <span className="text-sm font-medium text-slate-200">
                    {feat.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pie de Página Izquierdo */}
        <footer className="relative z-10 pt-4 border-t border-white/10">
          <p className="text-xs text-slate-400/80 font-normal">
            AURENIS • Innovación educativa para un mejor mañana
          </p>
        </footer>
      </section>

      {/* =========================================================================
          COLUMNA DERECHA: FORMULARIO DE ACCESO (Móvil 320px-767px, Tablet & Desktop)
          ========================================================================= */}
      <main className="w-full md:w-7/12 lg:w-1/2 xl:w-7/12 flex flex-col justify-between min-h-screen bg-[#F8FAFC] p-6 sm:p-10 lg:p-12 xl:p-16 overflow-y-auto">
        {/* Barra Superior con Botón para Regresar al Inicio */}
        <div className="w-full max-w-[420px] mx-auto flex items-center justify-between mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Volver al inicio</span>
          </Link>

          <Link
            href="/select-school"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#3B82F6] hover:underline"
          >
            <span>Ver Colegios</span>
          </Link>
        </div>

        <div className="w-full max-w-[420px] mx-auto my-auto py-6">
          {/* 1. Logotipo Superior (Centrado en Móvil y Desktop) */}
          <div className="flex items-center justify-center mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] rounded-xl"
              aria-label="Ir al portal principal de Aurenis"
            >
              <AurenisLogo
                className="w-9 h-9"
                textClassName="text-[#0F172A] text-2xl font-bold tracking-tight"
                showText={true}
              />
            </Link>
          </div>

          {/* 2. Títulos de Bienvenida */}
          <div className="text-left mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-[28px] font-bold text-[#0F172A] tracking-tight">
              Iniciar sesión
            </h2>
            <p className="text-sm text-[#64748B] mt-1.5 font-normal">
              Accede a tu cuenta para continuar
            </p>
          </div>

          {/* 3. Mensaje de Error del Servidor o Red */}
          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                role="alert"
                aria-live="assertive"
                className="mb-5 p-3.5 rounded-xl bg-red-50 border border-[#EF4444]/30 text-xs text-[#EF4444] flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" aria-hidden="true" />
                <span className="leading-relaxed font-medium">{serverError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 4. Formulario de Credenciales */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
            {/* Campo: Correo electrónico */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="auth-email"
                className="block text-xs sm:text-sm font-medium text-[#0F172A]"
              >
                Correo electrónico
              </label>

              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-[#64748B] pointer-events-none" aria-hidden="true">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  ref={identifierInputRef}
                  id="auth-email"
                  name="email"
                  type="text"
                  autoComplete="username"
                  required
                  aria-required="true"
                  placeholder="usuario@ejemplo.com"
                  value={identifier}
                  onChange={handleIdentifierChange}
                  onBlur={() => handleBlur("identifier")}
                  aria-invalid={!!errors.identifier}
                  aria-describedby={errors.identifier ? "auth-email-error" : undefined}
                  className={cn(
                    "w-full h-11 sm:h-12 rounded-xl border bg-white px-3.5 pl-10 text-sm text-[#0F172A] placeholder:text-[#94A3B8] transition-all focus:outline-none",
                    errors.identifier
                      ? "border-[#EF4444] text-[#0F172A] focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20"
                      : "border-[#E2E8F0] hover:border-slate-300 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20"
                  )}
                />
              </div>

              {errors.identifier && (
                <p id="auth-email-error" role="alert" className="text-xs text-[#EF4444] mt-1 font-normal flex items-center gap-1">
                  <span>{errors.identifier}</span>
                </p>
              )}
            </div>

            {/* Campo: Contraseña */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="auth-password"
                className="block text-xs sm:text-sm font-medium text-[#0F172A]"
              >
                Contraseña
              </label>

              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-[#64748B] pointer-events-none" aria-hidden="true">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  ref={passwordInputRef}
                  id="auth-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  aria-required="true"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={handlePasswordChange}
                  onKeyDown={handleCapsLock}
                  onBlur={() => handleBlur("password")}
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password
                      ? "auth-password-error"
                      : capsLockActive
                      ? "auth-capslock-warning"
                      : undefined
                  }
                  className={cn(
                    "w-full h-11 sm:h-12 rounded-xl border bg-white px-3.5 pl-10 pr-10 text-sm text-[#0F172A] placeholder:text-[#94A3B8] transition-all focus:outline-none",
                    errors.password
                      ? "border-[#EF4444] text-[#0F172A] focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20"
                      : "border-[#E2E8F0] hover:border-slate-300 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1 text-[#64748B] hover:text-[#0F172A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] rounded-md cursor-pointer"
                  aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {capsLockActive && (
                <div
                  id="auth-capslock-warning"
                  role="status"
                  aria-live="polite"
                  className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-700 font-medium flex items-center gap-1.5 mt-1"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-600 shrink-0" aria-hidden="true" />
                  <span>Bloqueo de mayúsculas activo</span>
                </div>
              )}

              {errors.password && (
                <p id="auth-password-error" role="alert" className="text-xs text-[#EF4444] mt-1 font-normal flex items-center gap-1">
                  <span>{errors.password}</span>
                </p>
              )}

              {/* Medidor de fortaleza de contraseña en tiempo real */}
              <PasswordStrengthMeter password={password} />
            </div>

            {/* Opciones: Recordarme & ¿Olvidaste tu contraseña? */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs sm:text-sm text-[#64748B]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#CBD5E1] text-[#3B82F6] focus:ring-[#3B82F6] transition cursor-pointer"
                />
                <span>Recordarme</span>
              </label>

              <button
                type="button"
                onClick={() => setIsHelpModalOpen(true)}
                className="text-xs sm:text-sm font-medium text-[#3B82F6] hover:text-[#2563EB] hover:underline transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] rounded"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Botón Primario: Iniciar sesión */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 sm:h-12 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] active:bg-[#1D4ED8] text-white font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2"
              >
                {isLoading && !activeDemoId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <>
                    <span>Iniciar sesión</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Separador "o" */}
          <div className="relative my-5 sm:my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2E8F0]" />
            </div>
            <span className="relative bg-[#F8FAFC] px-3 text-xs text-[#94A3B8] font-normal">
              o
            </span>
          </div>

          {/* Botón SSO: Continuar con Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full h-11 sm:h-12 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 active:bg-slate-100 text-[#0F172A] font-medium text-sm transition-all flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
          >
            <GoogleIcon className="w-4 h-4" />
            <span>Continuar con Google</span>
          </button>

          {/* Enlace de Contacto Institucional */}
          <p className="text-center text-xs sm:text-sm text-[#64748B] mt-6 sm:mt-8">
            ¿No tienes una cuenta?{" "}
            <button
              type="button"
              onClick={() => setIsContactModalOpen(true)}
              className="font-medium text-[#3B82F6] hover:text-[#2563EB] hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3B82F6] rounded"
            >
              Contacta con tu institución
            </button>
          </p>

          {/* Acceso Rápido de Evaluación para la Comisión / Pruebas */}
          <div className="text-center mt-6 pt-5 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setIsDemoModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-500 hover:text-[#3B82F6] hover:bg-blue-50/80 transition-colors cursor-pointer border border-transparent hover:border-blue-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Modo Demostración y Cuentas de Prueba</span>
            </button>
          </div>
        </div>

        {/* Pie Móvil Discreto */}
        <div className="md:hidden text-center text-xs text-slate-400 py-2">
          © 2026 Aurenis Cloud Education
        </div>
      </main>

      {/* =========================================================================
          MODAL: RECUPERACIÓN DE CONTRASEÑA (MINEDUC PROTOCOL)
          ========================================================================= */}
      <Modal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} size="md">
        <ModalHeader>
          <ModalTitle>Recuperación de Contraseña y Acceso</ModalTitle>
          <ModalDescription>
            Protocolo de seguridad escolar para resguardo del Libro de Clases Digital.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4 text-xs sm:text-sm text-slate-600">
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-start gap-2.5">
              <HelpCircle className="w-5 h-5 text-[#3B82F6] shrink-0 mt-0.5" />
              <p className="leading-relaxed text-xs">
                Por normativa del Ministerio de Educación de Chile (Circular 482) y estándares de resguardo de datos de estudiantes, la regeneración de credenciales se realiza de forma presencial o validada institucionalmente.
              </p>
            </div>

            <div className="space-y-2.5">
              <h4 className="font-semibold text-[#0F172A] text-xs uppercase tracking-wide">
                Canales de Atención según tu rol:
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside">
                <li>
                  <strong className="text-slate-800">Docentes y Profesores:</strong> Acércate a Inspectoría General o al Administrador Escolar de tu colegio para recibir tu clave temporal.
                </li>
                <li>
                  <strong className="text-slate-800">Estudiantes y Familias:</strong> Solicita la reconfiguración en la Secretaría del colegio presentando el RUT del alumno.
                </li>
                <li>
                  <strong className="text-slate-800">Directivos y Soporte:</strong> Contacta directamente a la mesa de ayuda central de Aurenis.
                </li>
              </ul>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => setIsHelpModalOpen(false)}>
            Entendido
          </Button>
        </ModalFooter>
      </Modal>

      {/* =========================================================================
          MODAL: CONTACTA CON TU INSTITUCIÓN
          ========================================================================= */}
      <Modal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} size="md">
        <ModalHeader>
          <ModalTitle>Afiliación y Contacto Institucional</ModalTitle>
          <ModalDescription>
            Información para establecimientos y nuevos usuarios escolares.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4 text-xs sm:text-sm text-slate-600">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
                <School className="w-4 h-4 text-[#3B82F6]" />
                <span>¿Tu colegio ya utiliza Aurenis?</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Si tu establecimiento educativo cuenta con convenio activo, tu cuenta es creada de forma automática con la matrícula oficial del MINEDUC. Solicita tu acceso en secretaría o con tu profesor jefe.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
                <Phone className="w-4 h-4 text-[#3B82F6]" />
                <span>¿Deseas incorporar Aurenis a tu colegio?</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Los equipos directivos pueden solicitar una demostración guiada o cotización institucional compatible con financiamiento SEP.
              </p>
              <div className="pt-2">
                <Link
                  href="/#planes"
                  onClick={() => setIsContactModalOpen(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3B82F6] hover:underline"
                >
                  <span>Ver Planes y Financiamiento SEP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setIsContactModalOpen(false)}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>

      {/* =========================================================================
          MODAL: ACCESO GOOGLE WORKSPACE SSO (OAUTH2 INTEGRATION)
          ========================================================================= */}
      <Modal isOpen={isGoogleModalOpen} onClose={() => setIsGoogleModalOpen(false)} size="md">
        <ModalHeader>
          <ModalTitle>Acceso Google Workspace for Education</ModalTitle>
          <ModalDescription>
            Autenticación federada oficial para establecimientos asociados.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4 text-xs sm:text-sm text-slate-600">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0">
                <GoogleIcon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-[#0F172A] text-sm">
                  Federación de Identidad Google OAuth2
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ingresa con tu cuenta institucional Google Workspace (ej. @lpmm.cl) para acceder de forma segura a tu portal educativo.
                </p>
              </div>
            </div>

            {googleError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{googleError}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">
                Correo institucional Google Workspace
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="usuario@lpmm.cl"
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  className="flex-1 h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  disabled={googleLoading || !googleEmailInput}
                  onClick={() => handleExecuteGoogleLogin(googleEmailInput)}
                  className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {googleLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Conectando...</span>
                    </>
                  ) : (
                    <span>Continuar</span>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-medium text-slate-700 mb-2">Acceso rápido con cuentas institucionales demo:</p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { label: "Director (director@lpmm.cl)", email: "director@lpmm.cl" },
                  { label: "Profesor (profesor.rodrigo@lpmm.cl)", email: "profesor.rodrigo@lpmm.cl" },
                  { label: "Estudiante (yamir.ahumada@lpmm.cl)", email: "yamir.ahumada@lpmm.cl" },
                ].map((acc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={googleLoading}
                    onClick={() => {
                      setGoogleEmailInput(acc.email);
                      handleExecuteGoogleLogin(acc.email);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition text-xs flex items-center justify-between text-slate-700 font-medium cursor-pointer"
                  >
                    <span>{acc.label}</span>
                    <GoogleIcon className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setIsGoogleModalOpen(false)}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>

      {/* =========================================================================
          MODAL: CUENTAS DEMOSTRATIVAS PARA EVALUACIÓN
          ========================================================================= */}
      <Modal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} size="lg">
        <ModalHeader>
          <ModalTitle>Cuentas de Prueba y Evaluación Multi-Rol</ModalTitle>
          <ModalDescription>
            Prueba la plataforma seleccionando cualquier perfil escolar con 1 solo clic.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-3">
            {DEMO_ACCOUNTS.map((acc) => {
              const IconComp = acc.icon;
              const isThisLoading = isLoading && activeDemoId === acc.id;

              return (
                <div
                  key={acc.id}
                  className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 bg-white hover:border-[#3B82F6] hover:shadow-xs transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-50 border border-blue-100 text-[#3B82F6] flex items-center justify-center shrink-0">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#0F172A] truncate">
                          {acc.name}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${acc.badgeColor} shrink-0`}>
                          {acc.roleTitle}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5 line-clamp-1 sm:line-clamp-none">
                        {acc.description}
                      </p>
                      <p className="text-[11px] font-mono text-slate-400 mt-1">
                        {acc.identifier}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleQuickLogin(acc)}
                    className="px-3.5 sm:px-4 py-2 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold transition flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50 shadow-xs"
                  >
                    {isThisLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Entrando...</span>
                      </>
                    ) : (
                      <>
                        <span>Ingresar</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setIsDemoModalOpen(false)}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
          <div className="w-8 h-8 border-3 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
