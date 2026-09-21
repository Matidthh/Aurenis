"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AurenisLogo } from "@/components/ui/aurenis-logo";
import {
  GraduationCap,
  ArrowRight,
  Play,
  Shield,
  Zap,
  Laptop,
  Users,
  Check,
  Search,
  Bell,
  ChevronDown,
  LayoutDashboard,
  UserCheck,
  BookOpen,
  FileText,
  BarChart2,
  Settings,
  TrendingUp,
  FileCheck,
  School,
  X,
  Sparkles,
  Loader2,
} from "lucide-react";

interface ReplicatedHeroProps {
  onOpenDemoModal?: () => void;
  onOpenQuoteModal?: () => void;
  hideHeader?: boolean;
}

export function ReplicatedHero({ onOpenDemoModal, onOpenQuoteModal, hideHeader = false }: ReplicatedHeroProps) {
  const router = useRouter();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [activeNav, setActiveNav] = useState("inicio");
  const [loggingIn, setLoggingIn] = useState<string | null>(null);

  async function handleDirectLogin(role: string, email: string, pass: string) {
    setLoggingIn(role);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      const redirectUrl = data.data?.redirectUrl || data.redirectUrl || "/colegio-san-jose/dashboard";
      router.push(redirectUrl);
    } catch {
      router.push("/colegio-san-jose/dashboard");
    } finally {
      setLoggingIn(null);
    }
  }

  return (
    <div className="relative min-h-screen bg-[#F8F8F5] text-slate-900 overflow-hidden selection:bg-blue-500 selection:text-white font-sans">
      {/* Soft atmospheric blue radial glow in background */}
      <div
        className="pointer-events-none absolute -top-24 right-0 w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] bg-gradient-to-bl from-blue-100/70 via-blue-50/40 to-transparent rounded-full blur-3xl -z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 -left-48 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -z-10"
        aria-hidden="true"
      />

      {/* 1. Header / Navbar */}
      {!hideHeader && (
      <header className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 pt-6 pb-4 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/">
          <AurenisLogo className="w-10 h-10" textClassName="text-slate-900 text-xl font-black tracking-tight" />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          <button
            onClick={() => setActiveNav("inicio")}
            className="relative py-1 text-sm font-semibold text-blue-600 transition"
          >
            Inicio
            {activeNav === "inicio" && (
              <span className="absolute -bottom-1.5 left-0 right-0 h-[2.5px] bg-blue-600 rounded-full mx-auto" />
            )}
          </button>
          <a
            href="/mockups"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
          >
            Características
          </a>
          <button
            onClick={() => setShowDemoModal(true)}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
          >
            Planes
          </button>
          <button
            onClick={() => setShowDemoModal(true)}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
          >
            Contacto
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleDirectLogin("director", "director@sanjose.cl", "AdminCSJ2026!")}
            className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-semibold neumo-button transition shadow-xs"
          >
            {loggingIn === "director" ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
            ) : (
              "Iniciar sesión"
            )}
          </button>

          <button
            onClick={() => {
              if (onOpenDemoModal) onOpenDemoModal();
              else setShowDemoModal(true);
            }}
            className="inline-flex items-center justify-center px-6 sm:px-7 py-2.5 rounded-full text-sm font-semibold neumo-button text-blue-600 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Comenzar ahora
          </button>
        </div>
      </header>
      )}

      {/* 2. Main Hero Content Grid */}
      <main className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 pt-8 lg:pt-14 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column (Hero Text & Value Props) */}
          <div className="lg:col-span-6 space-y-7 sm:space-y-8 z-10">
            {/* Top Multi-Tenant Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-100/80 text-blue-700 text-xs font-semibold shadow-xs">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>Plataforma de Gestión Académica Multi-Tenant</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-slate-900 tracking-tight leading-[1.12]">
                La educación, más
                <br />
                <span className="text-blue-600">simple</span>,{" "}
                <span className="text-blue-600 relative inline-block">
                  organizada
                  {/* Exact double curved blue wave stroke under 'organizada' */}
                  <svg
                    className="absolute -bottom-2.5 left-0 w-full overflow-visible pointer-events-none"
                    height="12"
                    viewBox="0 0 200 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 7.5C45 2.5 155 2.5 198 7.5"
                      stroke="#2563eb"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8 10C50 6 150 6 192 10"
                      stroke="#2563eb"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeOpacity="0.75"
                    />
                  </svg>
                </span>
                <br />
                y conectada.
              </h1>
            </div>

            {/* Subtitle / Paragraph */}
            <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              Aurenis es una plataforma moderna que centraliza la gestión académica de tu
              institución, optimizando procesos, mejorando la comunicación y brindando una
              experiencia excepcional para estudiantes, docentes y administradores.
            </p>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={() => {
                  if (onOpenDemoModal) onOpenDemoModal();
                  else setShowDemoModal(true);
                }}
                className="inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 transition hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Comenzar ahora</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDirectLogin("profesor", "profesor@sanjose.cl", "Profesor2026!")}
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base bg-white border border-slate-200 hover:border-slate-300 text-slate-800 hover:bg-slate-50 transition shadow-xs"
              >
                <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-blue-600 ml-0.5" />
                </div>
                <span>Ver demo</span>
              </button>
            </div>

            {/* 4 Feature Props Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 pt-8 sm:pt-10 border-t border-slate-100">
              {/* Seguro */}
              <div className="space-y-2">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Seguro</h4>
                  <p className="text-xs text-slate-500 leading-snug mt-0.5">
                    Protección de datos y acceso por roles.
                  </p>
                </div>
              </div>

              {/* Rápido */}
              <div className="space-y-2">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                  <Zap className="w-5 h-5 fill-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Rápido</h4>
                  <p className="text-xs text-slate-500 leading-snug mt-0.5">
                    Rendimiento optimizado y sin interrupciones.
                  </p>
                </div>
              </div>

              {/* Multidispositivo */}
              <div className="space-y-2">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Multidispositivo</h4>
                  <p className="text-xs text-slate-500 leading-snug mt-0.5">
                    Accede desde cualquier lugar y dispositivo.
                  </p>
                </div>
              </div>

              {/* Escalable */}
              <div className="space-y-2">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Escalable</h4>
                  <p className="text-xs text-slate-500 leading-snug mt-0.5">
                    Crece con tu institución, sin límites.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Hero App Mockup & Floating Cards) */}
          <div className="lg:col-span-6 relative mt-4 lg:mt-0">
            
            {/* Top-Right Floating Card: Sistema Multi-Tenant */}
            <div className="absolute -top-6 right-0 sm:-right-4 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-xl border border-slate-100 flex items-center gap-3.5 animate-in fade-in slide-in-from-top-4 duration-700">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">
                  Sistema multi-tenant
                </h4>
                <p className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">
                  Varias instituciones, una misma plataforma.
                </p>
              </div>
            </div>

            {/* Main Application Window Container */}
            <div className="relative rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-300/40 overflow-hidden">
              
              {/* Window Header with 3 control dots */}
              <div className="px-4 py-2.5 bg-slate-100/80 border-b border-slate-200/80 flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              </div>

              {/* Window Interior: Left Sidebar + Right Dashboard Area */}
              <div className="grid grid-cols-12 min-h-[460px] sm:min-h-[500px]">
                
                {/* Dark Left Sidebar */}
                <div className="col-span-3 sm:col-span-3 bg-[#0c1527] text-slate-300 p-3 sm:p-4 flex flex-col justify-between select-none">
                  <div className="space-y-4 sm:space-y-5">
                    {/* Sidebar Brand Logo */}
                    <div className="flex items-center gap-2 px-1 pt-1">
                      <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center">
                        A
                      </div>
                      <span className="hidden sm:inline font-extrabold text-xs tracking-wider text-white">
                        AURENIS
                      </span>
                    </div>

                    {/* Navigation Items List */}
                    <div className="space-y-1 text-xs">
                      {/* Dashboard (Active) */}
                      <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow-xs">
                        <LayoutDashboard className="w-4 h-4 shrink-0" />
                        <span className="hidden sm:inline">Dashboard</span>
                      </div>

                      {/* Estudiantes */}
                      <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition">
                        <Users className="w-4 h-4 shrink-0" />
                        <span className="hidden sm:inline">Estudiantes</span>
                      </div>

                      {/* Docentes */}
                      <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition">
                        <UserCheck className="w-4 h-4 shrink-0" />
                        <span className="hidden sm:inline">Docentes</span>
                      </div>

                      {/* Cursos */}
                      <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition">
                        <BookOpen className="w-4 h-4 shrink-0" />
                        <span className="hidden sm:inline">Cursos</span>
                      </div>

                      {/* Notas */}
                      <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition">
                        <FileText className="w-4 h-4 shrink-0" />
                        <span className="hidden sm:inline">Notas</span>
                      </div>

                      {/* Reportes */}
                      <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition">
                        <BarChart2 className="w-4 h-4 shrink-0" />
                        <span className="hidden sm:inline">Reportes</span>
                      </div>
                    </div>
                  </div>

                  {/* Configuración at bottom */}
                  <div className="pt-3 border-t border-slate-800/80">
                    <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-slate-400 hover:text-white transition text-xs">
                      <Settings className="w-4 h-4 shrink-0" />
                      <span className="hidden sm:inline">Configuración</span>
                    </div>
                  </div>
                </div>

                {/* Light Main Dashboard Workspace */}
                <div className="col-span-9 sm:col-span-9 bg-[#f8fafc] p-3 sm:p-5 space-y-4 select-none">
                  
                  {/* Top Bar: Search + Notification + User */}
                  <div className="flex items-center justify-between gap-2 pb-1">
                    {/* Search Input Box */}
                    <div className="relative flex-1 max-w-[240px]">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        readOnly
                        placeholder="Buscar estudiantes, cursos..."
                        className="w-full pl-8 pr-2 py-1.5 rounded-xl bg-white border border-slate-200/80 text-[11px] text-slate-600 placeholder:text-slate-400 focus:outline-none"
                      />
                    </div>

                    {/* Right User Bar */}
                    <div className="flex items-center gap-2.5">
                      <button className="relative p-1.5 rounded-lg text-slate-500 hover:bg-white transition">
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-rose-500 rounded-full" />
                      </button>

                      <div className="flex items-center gap-2 pl-1">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-rose-400 text-white font-bold text-xs flex items-center justify-center ring-2 ring-white">
                          M
                        </div>
                        <div className="hidden sm:block text-left leading-tight">
                          <div className="text-[11px] font-bold text-slate-800">
                            María González
                          </div>
                          <div className="text-[9px] text-slate-400">
                            Administradora
                          </div>
                        </div>
                        <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
                      </div>
                    </div>
                  </div>

                  {/* Welcome Greeting */}
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      Bienvenida, María
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Aquí tienes un resumen de tu institución.
                    </p>
                  </div>

                  {/* 4 Metric KPI Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                    {/* Estudiantes */}
                    <div className="p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200/70 shadow-2xs space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-medium block">
                        Estudiantes
                      </span>
                      <div className="text-base sm:text-lg font-black text-slate-900">
                        248
                      </div>
                      <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                        <span>↑ 12%</span>
                      </div>
                    </div>

                    {/* Docentes */}
                    <div className="p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200/70 shadow-2xs space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-medium block">
                        Docentes
                      </span>
                      <div className="text-base sm:text-lg font-black text-slate-900">
                        18
                      </div>
                      <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                        <span>↑ 5%</span>
                      </div>
                    </div>

                    {/* Cursos */}
                    <div className="p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200/70 shadow-2xs space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-medium block">
                        Cursos
                      </span>
                      <div className="text-base sm:text-lg font-black text-blue-600">
                        32
                      </div>
                      <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                        <span>↑ 8%</span>
                      </div>
                    </div>

                    {/* Promedio general */}
                    <div className="p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200/70 shadow-2xs space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-medium block">
                        Promedio general
                      </span>
                      <div className="text-base sm:text-lg font-black text-slate-900">
                        8.7
                      </div>
                      <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                        <span>↑ 3%</span>
                      </div>
                    </div>
                  </div>

                  {/* 2 Bottom Columns: Chart + Recent Activity */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-1">
                    
                    {/* Left: Rendimiento Académico (Chart) */}
                    <div className="sm:col-span-7 p-3 rounded-xl bg-white border border-slate-200/70 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-900">
                          Rendimiento académico
                        </span>
                        <div className="text-[9px] text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                          <span>Últimos 6 meses</span>
                          <ChevronDown className="w-2.5 h-2.5" />
                        </div>
                      </div>

                      {/* SVG Line Chart */}
                      <div className="h-28 w-full pt-1 flex items-end">
                        <div className="w-7 text-[8px] text-slate-400 flex flex-col justify-between h-full py-0.5 font-mono">
                          <span>10.0</span>
                          <span>9.0</span>
                          <span>8.0</span>
                          <span>7.0</span>
                          <span>6.0</span>
                        </div>
                        <div className="flex-1 h-full relative">
                          <svg className="w-full h-full overflow-visible" viewBox="0 0 160 80">
                            {/* Horizontal guide lines */}
                            <line x1="0" y1="5" x2="160" y2="5" stroke="#f1f5f9" strokeDasharray="3 3" />
                            <line x1="0" y1="25" x2="160" y2="25" stroke="#f1f5f9" strokeDasharray="3 3" />
                            <line x1="0" y1="45" x2="160" y2="45" stroke="#f1f5f9" strokeDasharray="3 3" />
                            <line x1="0" y1="65" x2="160" y2="65" stroke="#f1f5f9" strokeDasharray="3 3" />

                            {/* Chart Line Path */}
                            <path
                              d="M 10 50 L 35 43 L 60 47 L 85 36 L 110 40 L 135 25 L 155 18"
                              fill="none"
                              stroke="#2563eb"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            {/* Blue Dots */}
                            <circle cx="10" cy="50" r="2.5" fill="#2563eb" />
                            <circle cx="35" cy="43" r="2.5" fill="#2563eb" />
                            <circle cx="60" cy="47" r="2.5" fill="#2563eb" />
                            <circle cx="85" cy="36" r="2.5" fill="#2563eb" />
                            <circle cx="110" cy="40" r="2.5" fill="#2563eb" />
                            <circle cx="135" cy="25" r="2.5" fill="#2563eb" />
                            <circle cx="155" cy="18" r="3" fill="#2563eb" className="ring-2 ring-blue-200" />
                          </svg>
                          <div className="flex justify-between text-[8px] text-slate-400 pt-1 font-mono px-2">
                            <span>Jul</span>
                            <span>Ago</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actividad Reciente */}
                    <div className="sm:col-span-5 p-3 rounded-xl bg-white border border-slate-200/70 shadow-2xs space-y-2">
                      <span className="text-[11px] font-bold text-slate-900 block">
                        Actividad reciente
                      </span>

                      <div className="space-y-2 text-[10px]">
                        {/* 1. Nuevo estudiante */}
                        <div className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Users className="w-3 h-3" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-800 truncate">Nuevo estudiante inscrito</div>
                            <div className="text-slate-400 truncate">Carlos Méndez</div>
                          </div>
                          <span className="text-[9px] text-slate-400 shrink-0">Hace 2 min</span>
                        </div>

                        {/* 2. Nota registrada */}
                        <div className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                            <FileCheck className="w-3 h-3" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-800 truncate">Nota registrada</div>
                            <div className="text-slate-400 truncate">Matemáticas - 10°A</div>
                          </div>
                          <span className="text-[9px] text-slate-400 shrink-0">Hace 15 min</span>
                        </div>

                        {/* 3. Documento subido */}
                        <div className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                            <FileText className="w-3 h-3" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-800 truncate">Documento subido</div>
                            <div className="text-slate-400 truncate">Reporte de notas</div>
                          </div>
                          <span className="text-[9px] text-slate-400 shrink-0">Hace 1 h</span>
                        </div>

                        {/* 4. Nuevo docente */}
                        <div className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                            <UserCheck className="w-3 h-3" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-800 truncate">Nuevo docente</div>
                            <div className="text-slate-400 truncate">Laura Sánchez</div>
                          </div>
                          <span className="text-[9px] text-slate-400 shrink-0">Hace 2 h</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Bottom-Left Floating Card: Acceso Rápido (Overlapping the window) */}
            <div className="absolute -bottom-6 -left-4 sm:-left-6 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-2xl border border-slate-100 space-y-2.5 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="text-xs font-bold text-slate-900 block">
                Acceso rápido
              </span>
              <div className="flex items-center gap-3">
                {/* Estudiantes */}
                <button
                  onClick={() => router.push("/colegio-san-jose/students")}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition shadow-2xs">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 group-hover:text-blue-600">
                    Estudiantes
                  </span>
                </button>

                {/* Cursos */}
                <button
                  onClick={() => router.push("/colegio-san-jose/courses")}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition shadow-2xs">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 group-hover:text-blue-600">
                    Cursos
                  </span>
                </button>

                {/* Notas */}
                <button
                  onClick={() => router.push("/colegio-san-jose/grades")}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 group-hover:bg-purple-600 text-purple-600 group-hover:text-white flex items-center justify-center transition shadow-2xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 group-hover:text-purple-600">
                    Notas
                  </span>
                </button>

                {/* Reportes */}
                <button
                  onClick={() => router.push("/colegio-san-jose/analytics")}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-50 group-hover:bg-sky-600 text-sky-600 group-hover:text-white flex items-center justify-center transition shadow-2xs">
                    <BarChart2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 group-hover:text-sky-600">
                    Reportes
                  </span>
                </button>
              </div>
            </div>

            {/* Bottom-Right Handwritten Arrow and Note */}
            <div className="absolute -bottom-10 right-4 sm:right-8 flex items-start gap-2 select-none pointer-events-none z-20">
              {/* Handwritten curved blue arrow */}
              <svg
                className="w-12 h-12 text-blue-600 stroke-blue-600 fill-none overflow-visible -rotate-12"
                viewBox="0 0 50 50"
              >
                <path
                  d="M10 40 C 5 20, 20 10, 38 12"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M30 6 L 40 12 L 32 20"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Handwritten Script Text */}
              <div className="font-handwriting text-2xl sm:text-3xl text-blue-600 font-bold -rotate-6 leading-none pt-1">
                Tu institución
                <br />
                en un solo lugar
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Interactive Modal for Direct Role Login & Demo Selection */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                <Sparkles className="w-3.5 h-3.5" />
                Acceso Rápido Aurenis
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Selecciona tu perfil de ingreso
              </h3>
              <p className="text-xs text-slate-500">
                Ingresa directamente a la plataforma con credenciales preparadas para cada rol institucional:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Director */}
              <button
                onClick={() => handleDirectLogin("director", "director@sanjose.cl", "AdminCSJ2026!")}
                disabled={loggingIn !== null}
                className="p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-left transition flex items-center gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                    Administrador Escolar
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Colegio San José
                  </div>
                </div>
              </button>

              {/* Docente */}
              <button
                onClick={() => handleDirectLogin("profesor", "profesor@sanjose.cl", "Profesor2026!")}
                disabled={loggingIn !== null}
                className="p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-left transition flex items-center gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                    Profesor Jefe / Docente
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Libro de clases y notas
                  </div>
                </div>
              </button>

              {/* Estudiante */}
              <button
                onClick={() => handleDirectLogin("estudiante", "estudiante@sanjose.cl", "Estudiante2026!")}
                disabled={loggingIn !== null}
                className="p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-left transition flex items-center gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                    Estudiante / Alumno
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Portal académico
                  </div>
                </div>
              </button>

              {/* Prototipo Figma */}
              <button
                onClick={() => router.push("/mockups")}
                className="p-4 rounded-2xl border border-slate-800 bg-slate-900 text-white hover:bg-slate-800 text-left transition flex items-center gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-pink-300">
                    Prototipo Figma Hi-Fi
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Entregables de diseño & DoD
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
