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

export default function LoginPage() {
  const router = useRouter();

  // Estados de campos
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Estados de interacción y validación
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Estados de carga y error del servidor
  const [isLoading, setIsLoading] = useState(false);
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

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Credenciales incorrectas o usuario no encontrado.");
      }

      if (data.redirectUrl) {
        router.push(data.redirectUrl);
        router.refresh();
      }
    } catch (err: any) {
      setServerError(err.message || "Ocurrió un error inesperado al iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  }

  // Carga rápida de credenciales de prueba
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
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Acceso rápido demo:
              </span>
              <span className="text-[11px] text-slate-400">Autocompleta roles</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials("admin@aurenis.com", "AurenisSuperAdmin2026!")}
                className="px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 hover:bg-brand-50 hover:border-brand-200 dark:hover:bg-brand-950/40 text-slate-700 dark:text-slate-200 text-xs font-semibold transition text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                SuperAdmin
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials("director@sanjose.cl", "AdminCSJ2026!")}
                className="px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 hover:bg-brand-50 hover:border-brand-200 dark:hover:bg-brand-950/40 text-slate-700 dark:text-slate-200 text-xs font-semibold transition text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                Director
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials("profesor.matematica@sanjose.cl", "Profesor2026!")}
                className="px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 hover:bg-brand-50 hover:border-brand-200 dark:hover:bg-brand-950/40 text-slate-700 dark:text-slate-200 text-xs font-semibold transition text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                Profesor
              </button>
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
