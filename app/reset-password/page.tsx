"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Loader2,
  KeyRound,
  Sparkles,
} from "lucide-react";
import { AurenisLogo } from "@/components/ui/aurenis-logo";
import { Button } from "@/components/ui/button";
import { PasswordStrengthMeter } from "@/components/auth/password-strength-meter";

/**
 * ============================================================================
 * AURENIS — PÁGINA INTERACTIVA DE RESTABLECIMIENTO DE CONTRASEÑA
 * RUTA: `/reset-password`
 * ============================================================================
 * Autores:
 * - Malcom Marcelo (Frontend & Lógica de Cliente)
 * - Lucas P. (UI/UX Designer & Design System)
 * - Frank M. (Seguridad & QA)
 *
 * Misión:
 * 1. Extrae el `token` desde la URL (`/reset-password?token=...`).
 * 2. Verifica la validez y vigencia del token vía `GET /api/auth/reset-password/verify`.
 * 3. Muestra un formulario seguro con medidor de fortaleza y validación de coincidencia.
 * 4. Actualiza la contraseña mediante `POST /api/auth/reset-password/verify`.
 * ============================================================================
 */

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState("");
  const [targetEmail, setTargetEmail] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // 1. Verificar el token al cargar la página
  useEffect(() => {
    async function verify() {
      if (!token || token.trim().length < 32) {
        setVerifying(false);
        setTokenValid(false);
        setTokenError("El enlace de restablecimiento es inválido o no se proporcionó un token.");
        return;
      }

      try {
        const res = await fetch(`/api/auth/reset-password/verify?token=${encodeURIComponent(token.trim())}`, {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        const data = await res.json();

        if (res.ok && data.success && data.data?.valid) {
          setTokenValid(true);
          setTargetEmail(data.data.email || "");
        } else {
          setTokenValid(false);
          setTokenError(data.error || "El enlace de restablecimiento ha expirado o ya fue utilizado.");
        }
      } catch (err) {
        setTokenValid(false);
        setTokenError("Error de conexión al verificar el token de seguridad.");
      } finally {
        setVerifying(false);
      }
    }

    verify();
  }, [token]);

  // 2. Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (newPassword.length < 8) {
      setErrorMessage("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/reset-password/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token.trim(),
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "No se pudo actualizar la contraseña.");
        setSubmitting(false);
        return;
      }

      setSuccessMessage("¡Contraseña actualizada con éxito! Redirigiendo al inicio de sesión...");
      setTimeout(() => {
        router.push("/login?reset=success");
      }, 2500);
    } catch (err) {
      setErrorMessage("Ocurrió un error al procesar la solicitud. Intente nuevamente.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Fondo decorativo con gradientes suaves */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10"
      >
        {/* Cabecera con Iso-Logo */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-2xl mb-3 text-sky-400">
            <KeyRound className="w-8 h-8" />
          </div>
          <AurenisLogo className="h-7 w-auto mb-2" />
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-400/80">
            Seguridad & Gestión de Identidad
          </p>
        </div>

        {/* Estado 1: Verificando token */}
        {verifying && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="w-10 h-10 text-sky-400 animate-spin" />
            <p className="text-sm text-slate-400">Verificando enlace de seguridad...</p>
          </div>
        )}

        {/* Estado 2: Token inválido o expirado */}
        {!verifying && !tokenValid && (
          <div className="space-y-6 text-center">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-left">
                <span className="font-semibold block text-red-300 mb-1">Enlace No Válido o Expirado</span>
                {tokenError}
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Los enlaces de restablecimiento expiran automáticamente en 15 minutos por políticas de seguridad institucionales.
            </p>
            <div className="pt-2">
              <Link href="/login">
                <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl py-3 border border-slate-700">
                  Volver al inicio de sesión
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Estado 3: Éxito completado */}
        {successMessage && (
          <div className="space-y-6 text-center py-4">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
              <div className="text-left font-medium">{successMessage}</div>
            </div>
            <div className="flex justify-center">
              <Loader2 className="w-6 h-6 text-sky-400 animate-spin" />
            </div>
          </div>
        )}

        {/* Estado 4: Formulario para ingresar nueva contraseña */}
        {!verifying && tokenValid && !successMessage && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center mb-2">
              <h1 className="text-lg font-bold text-white mb-1">Restablecer Contraseña</h1>
              <p className="text-xs text-slate-400">
                {targetEmail ? `Cuenta: ${targetEmail}` : "Ingrese y confirme su nueva clave de acceso."}
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Input Nueva Contraseña */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Nueva Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Medidor de fortaleza */}
              {newPassword && <PasswordStrengthMeter password={newPassword} />}
            </div>

            {/* Input Confirmar Contraseña */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Confirmar Nueva Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Repita la nueva contraseña"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-sky-600/20 flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Guardando nueva clave...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Guardar Nueva Contraseña</span>
                </>
              )}
            </Button>

            <div className="text-center pt-2">
              <Link href="/login" className="text-xs text-slate-400 hover:text-sky-400 transition-colors">
                ← Cancelar y regresar al inicio de sesión
              </Link>
            </div>
          </form>
        )}
      </motion.div>

      <div className="mt-8 text-center text-xs text-slate-500 flex items-center space-x-2">
        <Sparkles className="w-3.5 h-3.5 text-sky-400" />
        <span>AURENIS — Plataforma Integral de Gestión Escolar Multi-Tenant</span>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
