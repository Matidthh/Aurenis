"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  School,
  Shield,
  GraduationCap,
  BookOpen,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Loader2,
  Layers,
  Award,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const demoAccounts = [
    {
      roleKey: "director",
      title: "Administrador Escolar",
      schoolName: "Colegio San José",
      email: "director@sanjose.cl",
      password: "AdminCSJ2026!",
      description: "Control total de cursos, matrículas, profesores y configuración institucional.",
      icon: School,
      color: "bg-blue-600 text-white",
      badge: "Rol Principal",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      roleKey: "profesor",
      title: "Profesor Jefe / Docente",
      schoolName: "Colegio San José",
      email: "profesor@sanjose.cl",
      password: "Profesor2026!",
      description: "Libro de clases, registro de calificaciones, evaluaciones y control de asistencia.",
      icon: BookOpen,
      color: "bg-indigo-600 text-white",
      badge: "Docencia",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    {
      roleKey: "estudiante",
      title: "Estudiante / Alumno",
      schoolName: "Colegio San José",
      email: "estudiante@sanjose.cl",
      password: "Estudiante2026!",
      description: "Consulta de calificaciones, porcentaje de asistencia y asignaturas del curso.",
      icon: GraduationCap,
      color: "bg-emerald-600 text-white",
      badge: "Académico",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      roleKey: "admin",
      title: "Super Administrador",
      schoolName: "Panel Global Aurenis",
      email: "admin@aurenis.com",
      password: "AurenisSuperAdmin2026!",
      description: "Gestión global de colegios, licencias, auditoría de seguridad y telemetría.",
      icon: Shield,
      color: "bg-slate-900 text-white",
      badge: "System Admin",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
    },
  ];

  async function handleQuickLogin(account: (typeof demoAccounts)[0]) {
    setLoadingRole(account.roleKey);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: account.email, password: account.password }),
      });

      const resData = await res.json();
      const redirectUrl = resData.data?.redirectUrl || resData.redirectUrl;
      if (redirectUrl) {
        router.push(redirectUrl);
        router.refresh();
      } else {
        router.push("/colegio-san-jose/dashboard");
      }
    } catch {
      router.push("/colegio-san-jose/dashboard");
    } finally {
      setLoadingRole(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      {/* Barra de navegación superior */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md shadow-brand-600/20">
              A
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">Aurenis</span>
              <span className="text-xs text-slate-500 block leading-none font-medium">
                Gestión Escolar Multi-Institución
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/colegio-san-jose/students"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-brand-600 hover:bg-slate-100 transition"
            >
              <Users className="w-3.5 h-3.5 text-brand-600" />
              <span>Ver Estudiantes</span>
            </Link>
            <Link
              href="/system/design-system"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-brand-600 hover:bg-slate-100 transition"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Design System</span>
            </Link>
            <button
              onClick={() => handleQuickLogin(demoAccounts[0])}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition"
            >
              {loadingRole === "director" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>Ingresar Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full space-y-12">
        {/* Banner principal */}
        <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
            <Sparkles className="w-3.5 h-3.5" />
            Aurenis Core • Plataforma Escolar Activa
          </div>

          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Sistema de Gestión Académica, Calificaciones y Asistencia
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Plataforma multi-institución con aislamiento de datos, control de libro de clases, seguimiento
              curricular, gestión de matrículas y roles personalizados.
            </p>
          </div>

          {/* Estadísticas rápidas en vivo */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Colegios</span>
              <span className="text-2xl font-extrabold text-slate-900">2 Activos</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Cursos</span>
              <span className="text-2xl font-extrabold text-slate-900">8 Cursos</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Asignaturas</span>
              <span className="text-2xl font-extrabold text-slate-900">24 Materias</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Asistencia Media</span>
              <span className="text-2xl font-extrabold text-emerald-600">96.5%</span>
            </div>
          </div>
        </div>

        {/* Acceso Rápido Directo a Vistas del Sistema */}
        <div className="bg-gradient-to-r from-brand-50 via-white to-slate-50 rounded-2xl border border-brand-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Listado de Estudiantes & Control de Paginación</h3>
              <p className="text-xs text-slate-500">
                Tabla con selector de 10, 25, 50 filas por página, contador total y buscador reactivo.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              href="/colegio-san-jose/students"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition"
            >
              <span>Ver Estudiantes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/system/design-system"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition"
            >
              <span>Design System</span>
            </Link>
          </div>
        </div>

        {/* Acceso directo por Rol (1-Click Login) */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Acceso Inmediato por Perfil
              </h2>
              <p className="text-sm text-slate-500">
                Selecciona un rol para entrar directamente al portal escolar sin configuraciones adicionales:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {demoAccounts.map((account) => {
              const Icon = account.icon;
              const isLoading = loadingRole === account.roleKey;

              return (
                <div
                  key={account.roleKey}
                  className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-brand-500 hover:shadow-md transition-all group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${account.color} shadow-sm`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${account.badgeColor}`}>
                        {account.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-brand-600 transition">
                        {account.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500">{account.schoolName}</p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {account.description}
                    </p>

                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 text-xs space-y-1">
                      <div className="text-slate-500 truncate">
                        <span className="font-semibold text-slate-700">Email: </span>
                        {account.email}
                      </div>
                      <div className="text-slate-500">
                        <span className="font-semibold text-slate-700">Clave: </span>
                        ••••••••
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleQuickLogin(account)}
                    disabled={isLoading}
                    className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-brand-600 text-white transition shadow-xs disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Entrando...</span>
                      </>
                    ) : (
                      <>
                        <span>Ingresar como {account.title.split(" ")[0]}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Institución Destacada */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-brand-500/20">
                <School className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900">Colegio San José</h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Activo
                  </span>
                </div>
                <p className="text-sm text-slate-500">Slug: colegio-san-jose • Régimen Semestral</p>
              </div>
            </div>

            <button
              onClick={() => handleQuickLogin(demoAccounts[0])}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition"
            >
              <span>Abrir Panel del Colegio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase">
                <Users className="w-4 h-4 text-brand-600" />
                <span>Estudiantes</span>
              </div>
              <p className="text-xl font-bold text-slate-900">145 Alumnos</p>
              <p className="text-xs text-slate-500">Matrícula 2026 activa</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Cursos</span>
              </div>
              <p className="text-xl font-bold text-slate-900">8 Cursos</p>
              <p className="text-xs text-slate-500">1° Básico a 4° Medio</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Escala de Notas</span>
              </div>
              <p className="text-xl font-bold text-slate-900">1.0 a 7.0</p>
              <p className="text-xs text-slate-500">Aprobación mínima: 4.0</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Periodo Actual</span>
              </div>
              <p className="text-xl font-bold text-slate-900">1er Semestre</p>
              <p className="text-xs text-slate-500">Marzo - Julio 2026</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          Aurenis v1.0 • Plataforma Empresarial de Gestión Escolar Multi-Tenant
        </div>
      </footer>
    </div>
  );
}

