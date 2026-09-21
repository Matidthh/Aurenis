"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Sun,
  Moon,
  Sparkles,
  GraduationCap,
  BookOpen,
  UserCog,
  Users,
  Building2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { getSafeReturnUrl } from "@/lib/navigation/routes";
import { useAuth, AUTH_STORAGE_KEYS } from "@/lib/auth/auth-context";

interface DemoAccount {
  id: string;
  roleKey: "director" | "profesor" | "alumno" | "superadmin" | "apoderado";
  roleTitle: string;
  badgeLabel: string;
  name: string;
  email: string;
  pass: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeColor: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: "demo-director",
    roleKey: "director",
    roleTitle: "Director",
    badgeLabel: "Admin Escolar",
    name: "Carlos Mendoza",
    email: "director@sanjose.cl",
    pass: "AdminCSJ2026!",
    description: "Gestión directiva y académica",
    icon: Building2,
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  },
  {
    id: "demo-profesor",
    roleKey: "profesor",
    roleTitle: "Profesor",
    badgeLabel: "Docente",
    name: "Roberto Gómez",
    email: "profesor.matematica@sanjose.cl",
    pass: "Profesor2026!",
    description: "Libro de clases y asistencia",
    icon: BookOpen,
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  },
  {
    id: "demo-alumno",
    roleKey: "alumno",
    roleTitle: "Alumno",
    badgeLabel: "Estudiante",
    name: "Sofía Valenzuela",
    email: "sofia.valenzuela@sanjose.cl",
    pass: "Estudiante2026!",
    description: "Asignaturas, notas y horario",
    icon: GraduationCap,
    badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  },
  {
    id: "demo-superadmin",
    roleKey: "superadmin",
    roleTitle: "SuperAdmin",
    badgeLabel: "Global",
    name: "SuperAdmin Aurenis",
    email: "admin@aurenis.com",
    pass: "AurenisSuperAdmin2026!",
    description: "Configuración global del sistema",
    icon: UserCog,
    badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  },
  {
    id: "demo-apoderado",
    roleKey: "apoderado",
    roleTitle: "Apoderado",
    badgeLabel: "Familia",
    name: "María González",
    email: "maria.gonzalez@sanjose.cl",
    pass: "Apoderado2026!",
    description: "Seguimiento de pupilos",
    icon: Users,
    badgeColor: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  // Estados de campos
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Estados de interacción y validación
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Estados de carga, feedback visual de éxito y error del servidor
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // Estado del modal de recuperación / ayuda
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Estado de tema claro/oscuro
  const [isDark, setIsDark] = useState(false);

  // Referencias para accesibilidad y foco automático
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Sincronizar tema con el documento
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  function toggleTheme() {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  // --- REGLAS DE VALIDACIÓN EN CLIENTE ---
  function validateEmail(val: string): string | undefined {
    const trimmed = val.trim();
    if (!trimmed) {
      return "El correo electrónico es requerido.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return "Ingresa un formato de correo electrónico válido (ej. usuario@colegio.cl).";
    }
    return undefined;
  }

  function validatePassword(val: string): string | undefined {
    if (!val) {
      return "La contraseña es requerida.";
    }
    if (val.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres.";
    }
    return undefined;
  }

  // Validación reactiva al cambiar campos
  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setEmail(value);
    if (serverError) setServerError(null);

    if (touched.email || hasSubmitted) {
      const err = validateEmail(value);
      setErrors((prev) => ({ ...prev, email: err }));
    }
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setPassword(value);
    if (serverError) setServerError(null);

    if (touched.password || hasSubmitted) {
      const err = validatePassword(value);
      setErrors((prev) => ({ ...prev, password: err }));
    }
  }

  function handleBlur(field: "email" | "password") {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "email") {
      setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
    } else {
      setErrors((prev) => ({ ...prev, password: validatePassword(password) }));
    }
  }

  // Envío del formulario con validación estricta previa
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setHasSubmitted(true);
    setServerError(null);

    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    setErrors({
      email: emailErr,
      password: passErr,
    });

    // Si existen errores en cliente, detenemos el flujo y enfocamos el campo correspondiente
    if (emailErr) {
      emailInputRef.current?.focus();
      return;
    }
    if (passErr) {
      passwordInputRef.current?.focus();
      return;
    }

    setIsLoading(true);
    setLoginSuccess(null);

    try {
      const data = await login({
        email: email.trim(),
        password,
        rememberMe,
      });

      setLoginSuccess("¡Credenciales validadas exitosamente! Redirigiendo a tu espacio escolar...");

      const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
      let requestedReturnUrl = searchParams.get("returnUrl");
      if (!requestedReturnUrl && typeof window !== "undefined") {
        try {
          const storedRoute = sessionStorage.getItem("aurenis_intended_route");
          if (storedRoute) {
            requestedReturnUrl = storedRoute;
            sessionStorage.removeItem("aurenis_intended_route");
          }
        } catch {
          // ignore
        }
      }
      const targetUrl = getSafeReturnUrl(requestedReturnUrl, data.redirectUrl || "/select-school");

      // Breve pausa para que el usuario perciba el feedback visual positivo antes de la redirección
      setTimeout(() => {
        if (targetUrl) {
          window.location.href = targetUrl;
        } else {
          router.push("/select-school");
          router.refresh();
        }
      }, 350);
    } catch (err: any) {
      setServerError(err.message || "Ocurrió un error inesperado al iniciar sesión.");
      setIsLoading(false);
      setLoginSuccess(null);
    }
  }

  // Estado para rastrear qué cuenta demo está ingresando actualmente
  const [activeDemoId, setActiveDemoId] = useState<string | null>(null);

  // Acceso rápido instantáneo de un solo clic para cuentas demo
  async function handleQuickLogin(account: DemoAccount) {
    setEmail(account.email);
    setPassword(account.pass);
    setServerError(null);
    setLoginSuccess(null);
    setErrors({});
    setTouched({ email: true, password: true });
    setIsLoading(true);
    setActiveDemoId(account.id);

    try {
      const data = await login({
        email: account.email.trim(),
        password: account.pass,
        rememberMe: true,
      });

      setLoginSuccess(`¡Bienvenido! Sesión iniciada como ${account.roleTitle}. Redirigiendo...`);

      const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
      let requestedReturnUrl = searchParams.get("returnUrl");
      if (!requestedReturnUrl && typeof window !== "undefined") {
        try {
          const storedRoute = sessionStorage.getItem("aurenis_intended_route");
          if (storedRoute) {
            requestedReturnUrl = storedRoute;
            sessionStorage.removeItem("aurenis_intended_route");
          }
        } catch {
          // ignore
        }
      }
      const targetUrl = getSafeReturnUrl(requestedReturnUrl, data.redirectUrl || "/select-school");

      setTimeout(() => {
        if (targetUrl) {
          window.location.href = targetUrl;
        } else {
          router.push("/select-school");
          router.refresh();
        }
      }, 350);
    } catch (err: any) {
      setServerError(err.message || "Error al conectar con la cuenta demo seleccionada.");
      setIsLoading(false);
      setActiveDemoId(null);
      setLoginSuccess(null);
    }
  }

  // Carga rápida de credenciales de prueba sin enviar
  function fillDemoCredentials(demoEmail: string, demoPass: string) {
    setEmail(demoEmail);
    setPassword(demoPass);
    setServerError(null);
    setErrors({});
    setTouched({ email: true, password: true });
  }

  const isEmailValid = email.trim().length > 0 && !errors.email && (touched.email || hasSubmitted);

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-brand-500 selection:text-white overflow-x-hidden">
      {/* Fondo con viñeta de iluminación suave institucional */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-100/50 via-transparent to-transparent dark:from-brand-950/25 dark:via-transparent dark:to-transparent"
        aria-hidden="true"
      />

      {/* Barra de utilidades superior (Alternador de tema Claro / Oscuro) */}
      <header className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {isDark ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Modo Claro</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Modo Oscuro</span>
            </>
          )}
        </button>
      </header>

      {/* Contenedor central de la tarjeta (Centrado visual óptimo) */}
      <main className="w-full max-w-md relative z-10 my-auto">
        <div className="w-full bg-white dark:bg-slate-900 rounded-3xl sm:rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-none border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6 transition-all duration-200">
          {/* Cabecera / Branding del Mockup de Lucas P (#19) */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/30 ring-4 ring-brand-50 dark:ring-brand-950/50">
              <Shield className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <Badge variant="brand" size="sm" dot>
                  Aurenis v1.0
                </Badge>
                <span className="text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                  Acceso Seguro
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Iniciar Sesión
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Ingresa tus credenciales institucionales para acceder a tu plataforma escolar
              </p>
            </div>
          </div>

          {/* Banner de error del servidor (si existe) */}
          {serverError && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-start gap-2.5 animate-in fade-in duration-150"
            >
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{serverError}</div>
            </div>
          )}

          {/* Banner de éxito al validar credenciales con feedback visual inmediato */}
          {loginSuccess && (
            <div
              id="login-success-banner"
              role="status"
              className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2.5 animate-in fade-in duration-150"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 animate-bounce" />
              <div className="flex-1 font-medium">{loginSuccess}</div>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600 dark:text-emerald-400 shrink-0" />
            </div>
          )}

          {/* Formulario de Login */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Campo: Correo Electrónico */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Correo Electrónico o Usuario <span className="text-red-500">*</span>
              </label>

              <div className="relative flex items-center">
                <div
                  className="absolute left-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500"
                  aria-hidden="true"
                >
                  <Mail className="w-4 h-4" />
                </div>

                <input
                  ref={emailInputRef}
                  id="login-email"
                  name="email"
                  type="email"
                  disabled={isLoading}
                  autoComplete="email"
                  placeholder="ej. profesor@colegio.cl"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => handleBlur("email")}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "login-email-error" : undefined}
                  className={`w-full text-sm rounded-xl py-2.5 pl-10 pr-10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border min-h-[44px] transition-all duration-150 ${
                    errors.email
                      ? "border-red-500 text-red-900 dark:text-red-200 focus-visible:ring-2 focus-visible:ring-red-500/20 focus-visible:outline-none"
                      : isEmailValid
                      ? "border-emerald-500 focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500/20 focus-visible:outline-none"
                      : "border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500/20 focus-visible:outline-none"
                  }`}
                />

                {/* Feedback visual de formato de correo válido o icono de error */}
                {isEmailValid && !errors.email && (
                  <div
                    className="absolute right-3 flex items-center text-emerald-600 dark:text-emerald-400 pointer-events-none"
                    aria-hidden="true"
                    title="Formato de correo válido"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}

                {errors.email && (
                  <div
                    className="absolute right-3 flex items-center text-red-500 pointer-events-none"
                    aria-hidden="true"
                  >
                    <AlertCircle className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Mensaje de validación de correo */}
              {errors.email && (
                <p
                  id="login-email-error"
                  role="alert"
                  className="text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1 pt-0.5"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Campo: Contraseña con Toggle de Visualización */}
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsHelpModalOpen(true)}
                  className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <div className="relative flex items-center">
                <div
                  className="absolute left-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500"
                  aria-hidden="true"
                >
                  <Lock className="w-4 h-4" />
                </div>

                <input
                  ref={passwordInputRef}
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  disabled={isLoading}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => handleBlur("password")}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "login-password-error" : undefined}
                  className={`w-full text-sm rounded-xl py-2.5 pl-10 pr-11 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border min-h-[44px] transition-all duration-150 ${
                    errors.password
                      ? "border-red-500 text-red-900 dark:text-red-200 focus-visible:ring-2 focus-visible:ring-red-500/20 focus-visible:outline-none"
                      : "border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500/20 focus-visible:outline-none"
                  }`}
                />

                {/* Botón Toggle de Visualización de Contraseña */}
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                  title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Mensaje de validación de contraseña */}
              {errors.password && (
                <p
                  id="login-password-error"
                  role="alert"
                  className="text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1 pt-0.5"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Opción de persistencia de sesión: Recordar sesión en este equipo */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label
                htmlFor="login-remember-me"
                className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              >
                <input
                  id="login-remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 focus:ring-offset-0 bg-white dark:bg-slate-900 cursor-pointer"
                />
                <span>Recordar sesión en este dispositivo</span>
              </label>
            </div>

            {/* Botón Principal de Envío */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full shadow-md shadow-brand-600/25"
                isLoading={isLoading}
                loadingText="Iniciando sesión..."
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Acceder a la Plataforma
              </Button>
            </div>
          </form>

          {/* Accesos Rápidos para Demostración y Pruebas de Evaluación */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Acceso rápido demo (1 clic):
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                Redirección directa por rol
              </span>
            </div>

            {/* Grid interactivo de roles institucionales */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((acc) => {
                const IconComponent = acc.icon;
                const isThisLoading = isLoading && activeDemoId === acc.id;

                return (
                  <button
                    key={acc.id}
                    id={`demo-login-${acc.roleKey}-btn`}
                    type="button"
                    onClick={() => handleQuickLogin(acc)}
                    disabled={isLoading}
                    title={`Acceder directamente como ${acc.roleTitle} (${acc.name})`}
                    className="flex flex-col text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 hover:bg-brand-50/70 hover:border-brand-300 dark:hover:bg-brand-950/40 dark:hover:border-brand-800 transition-all shadow-2xs group disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {isThisLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-600 dark:text-brand-400" />
                        ) : (
                          <IconComponent className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-600 transition-colors" />
                        )}
                        <span>{acc.roleTitle}</span>
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${acc.badgeColor}`}
                      >
                        {acc.badgeLabel}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {acc.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 dark:text-slate-500">
              <span>Haz clic en un rol para entrar directamente a su vista.</span>
            </div>
          </div>

          {/* Pie de Seguridad y Soporte */}
          <div className="pt-2 text-center space-y-1">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
              <span>Conexión protegida con cifrado TLS 1.3 & Hashing Bcrypt</span>
            </p>
          </div>
        </div>
      </main>

      {/* Modal de Ayuda / Recuperación de Contraseña */}
      <Modal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} size="md">
        <ModalHeader>
          <ModalTitle>Recuperación de Acceso Institucional</ModalTitle>
          <ModalDescription>
            Protocolo de seguridad para el restablecimiento de credenciales escolares.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-3.5 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Por políticas de protección de datos estudiantiles y seguridad de la institución, las contraseñas son administradas de forma centralizada por el equipo directivo de tu colegio.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white">Pasos para recuperar tu clave:</h4>
              <ol className="list-decimal list-inside space-y-1 pl-1 text-slate-600 dark:text-slate-400">
                <li>Comunícate con el <strong>Administrador Escolar</strong> o Unidad Técnica de tu establecimiento.</li>
                <li>Presenta tu correo institucional o RUT para validar tu identidad.</li>
                <li>Recibirás un enlace temporal de restablecimiento seguro en tu casilla oficial.</li>
              </ol>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => setIsHelpModalOpen(false)}>
            Entendido
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
