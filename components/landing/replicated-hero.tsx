"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AurenisLogo } from "@/components/ui/aurenis-logo";
import {
  GraduationCap,
  ArrowRight,
  Play,
  Shield,
  Zap,
  Smartphone,
  Check,
  Search,
  Bell,
  ChevronDown,
  LayoutDashboard,
  LayoutGrid,
  Users,
  BookOpen,
  FileText,
  BarChart3,
  UserCheck,
  Star,
  UserPlus,
  FileCheck,
  School,
  X,
  Sparkles,
} from "lucide-react";

interface ReplicatedHeroProps {
  onOpenDemoModal?: () => void;
  onOpenQuoteModal?: () => void;
  hideHeader?: boolean;
}

export function ReplicatedHero({ onOpenDemoModal, onOpenQuoteModal, hideHeader = false }: ReplicatedHeroProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [loggingIn, setLoggingIn] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleDirectLogin(role: string, email: string, pass: string) {
    setLoggingIn(role);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      const redirectUrl = data.data?.redirectUrl || data.redirectUrl || "/lpmm/dashboard";
      router.push(redirectUrl);
    } catch {
      router.push("/lpmm/dashboard");
    } finally {
      setLoggingIn(null);
    }
  }

  return (
    <div
      id="inicio"
      suppressHydrationWarning
      className="relative bg-[#F8F8F5] text-slate-900 selection:bg-indigo-500 selection:text-white font-sans overflow-hidden"
    >
      {/* Background Soft Glow Auras */}
      <div
        className="pointer-events-none absolute -top-20 right-0 w-[650px] sm:w-[950px] h-[650px] sm:h-[950px] bg-indigo-100/40 via-purple-50/30 to-transparent rounded-full blur-3xl -z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 -left-40 w-[550px] h-[550px] bg-blue-50/50 via-indigo-50/30 to-transparent rounded-full blur-3xl -z-10"
        aria-hidden="true"
      />

      {/* ========================================================================= */}
      {/* 🚀 HERO SECTION EXACT REPLICA */}
      {/* ========================================================================= */}
      <main className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* ===================================================================== */}
          {/* LEFT COLUMN: PITCH, HEADLINE, CTAS & 3 VALUE PILLARS */}
          {/* ===================================================================== */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7 z-10">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ebeffd] border border-[#d6defa] text-xs font-semibold text-[#4f46e5]">
              <GraduationCap className="w-4 h-4 text-[#4f46e5]" />
              <span>Plataforma académica integral</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-[#0f172a] tracking-[-0.04em] leading-[1.08]">
                Gestión académica <br />
                más simple, para <br />
                <span className="text-[#6366f1]">mejores resultados.</span>
              </h1>
            </div>

            {/* Subtitle / Description */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg font-normal">
              Aurenis es una plataforma web diseñada para facilitar la gestión académica en colegios, con un sistema intuitivo, seguro y completo para estudiantes, docentes y administradores.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                onClick={() => {
                  if (onOpenDemoModal) onOpenDemoModal();
                  else setShowDemoModal(true);
                }}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm bg-[#5046e5] hover:bg-[#4338ca] text-white shadow-[0_10px_25px_rgba(79,70,229,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Comenzar ahora</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (onOpenQuoteModal) onOpenQuoteModal();
                  else if (onOpenDemoModal) onOpenDemoModal();
                  else setShowDemoModal(true);
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm bg-white border border-[#c7d2fe] hover:border-[#a5b4fc] text-[#0f172a] shadow-xs transition-all hover:bg-slate-50 cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-[#eeeffe] flex items-center justify-center text-[#5046e5]">
                  <Play className="w-2.5 h-2.5 fill-[#5046e5] ml-0.5" />
                </div>
                <span>Ver demostración</span>
              </button>
            </div>

            {/* 3 Pillar Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {/* Pillar 1: Seguro */}
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#5046e5] shrink-0 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-[#0f172a]">Seguro</div>
                  <div className="text-[11px] text-slate-500 leading-snug">
                    Datos protegidos con JWT y sesiones seguras.
                  </div>
                </div>
              </div>

              {/* Pillar 2: Rápido */}
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#5046e5] shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-[#0f172a]">Rápido</div>
                  <div className="text-[11px] text-slate-500 leading-snug">
                    Tecnología moderna (Next.js + PostgreSQL).
                  </div>
                </div>
              </div>

              {/* Pillar 3: Multidispositivo */}
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-[#5046e5] shrink-0 mt-0.5">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-[#0f172a]">Multidispositivo</div>
                  <div className="text-[11px] text-slate-500 leading-snug">
                    Accede desde cualquier lugar y dispositivo.
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ===================================================================== */}
          {/* RIGHT COLUMN: DASHBOARD MOCKUP WITH 2 FLOATING PILL CARDS */}
          {/* ===================================================================== */}
          <div className="lg:col-span-6 relative z-10 pt-4 sm:pt-6">
            <div className="relative max-w-[620px] mx-auto lg:mr-0">

              {/* --------------------------------------------------------------- */}
              {/* ORGANIC CURVED DESIGN BEHIND THE DASHBOARD (EXACT REPLICA OF ATTACHED PHOTO) */}
              {/* --------------------------------------------------------------- */}
              {/* Soft ambient violet-blue radial glow */}
              <div
                className="pointer-events-none absolute -top-16 -right-16 w-[520px] sm:w-[640px] h-[480px] sm:h-[580px] bg-gradient-to-br from-violet-200/40 via-purple-100/30 to-transparent rounded-[50%] blur-3xl -z-30"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute top-6 -right-10 w-[340px] sm:w-[420px] h-[340px] sm:h-[420px] bg-purple-200/30 rounded-full blur-2xl -z-20"
                aria-hidden="true"
              />

              {/* High-fidelity organic curved SVG backdrop matching photo curvature */}
              <div
                className="pointer-events-none absolute -top-10 sm:-top-14 -right-8 sm:-right-16 w-[118%] sm:w-[128%] h-[118%] sm:h-[128%] -z-10 overflow-visible"
                aria-hidden="true"
              >
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 760 620"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="dashboardAuraGradient" x1="160" y1="20" x2="720" y2="520" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#E2D4FD" stopOpacity="0.88" />
                      <stop offset="25%" stopColor="#ECE3FF" stopOpacity="0.82" />
                      <stop offset="60%" stopColor="#F3ECFF" stopOpacity="0.75" />
                      <stop offset="90%" stopColor="#E8DCFC" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#DDD0FA" stopOpacity="0.35" />
                    </linearGradient>
                    <filter id="organicBackdropGlow" x="-15%" y="-15%" width="135%" height="135%" filterUnits="userSpaceOnUse">
                      <feDropShadow dx="0" dy="20" stdDeviation="28" floodColor="#8B5CF6" floodOpacity="0.09" />
                    </filter>
                  </defs>
                  <path
                    d="M 175 120
                       C 230 40, 340 6, 470 6
                       C 600 6, 690 42, 725 125
                       C 755 195, 765 285, 745 370
                       C 725 450, 660 520, 565 558
                       C 475 595, 385 580, 310 538
                       C 240 498, 195 435, 175 365
                       Z"
                    fill="url(#dashboardAuraGradient)"
                    filter="url(#organicBackdropGlow)"
                  />
                </svg>
              </div>

              {/* Secondary smooth organic gradient canvas layer */}
              <div
                className="pointer-events-none absolute -top-8 sm:-top-12 -right-6 sm:-right-12 w-[106%] sm:w-[115%] h-[106%] sm:h-[115%] bg-gradient-to-tr from-[#ebeffe]/85 via-[#e9e4fe]/90 to-[#f3eeff]/75 rounded-[52%_48%_64%_36%_/_44%_54%_46%_56%] -z-10 border border-[#ddd6fe]/60 shadow-[0_20px_50px_rgba(139,92,246,0.06)]"
                aria-hidden="true"
              />

              {/* --------------------------------------------------------------- */}
              {/* FLOATING CARD 1: TOP RIGHT - "Sistema operativo" */}
              {/* --------------------------------------------------------------- */}
              <div className="hidden sm:flex absolute -top-5 sm:-top-7 right-4 sm:right-6 z-30 items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_12px_32px_rgba(15,23,42,0.08)] pointer-events-none">
                <div className="w-8 h-8 rounded-full bg-[#D1FAE5] text-[#059669] flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0f172a]">Sistema operativo</div>
                  <div className="text-[11px] text-slate-500">Todos los servicios funcionando correctamente.</div>
                </div>
              </div>

              {/* --------------------------------------------------------------- */}
              {/* FLOATING CARD 2: BOTTOM LEFT - "Accesos rápidos" */}
              {/* --------------------------------------------------------------- */}
              <div className="hidden sm:block absolute -bottom-5 sm:-bottom-7 -left-3 sm:-left-6 z-30 px-4 py-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_16px_35px_rgba(15,23,42,0.1)] pointer-events-none">
                <div className="text-[11px] font-bold text-[#0f172a] mb-2">Accesos rápidos</div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-9 h-9 rounded-xl bg-[#eef1ff] flex items-center justify-center text-[#5046e5]">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-slate-600 font-medium">Estudiantes</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <div className="w-9 h-9 rounded-xl bg-[#eef1ff] flex items-center justify-center text-[#5046e5]">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-slate-600 font-medium">Cursos</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <div className="w-9 h-9 rounded-xl bg-[#eef1ff] flex items-center justify-center text-[#5046e5]">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-slate-600 font-medium">Notas</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <div className="w-9 h-9 rounded-xl bg-[#eef1ff] flex items-center justify-center text-[#5046e5]">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-slate-600 font-medium">Reportes</span>
                  </div>
                </div>
              </div>

              {/* --------------------------------------------------------------- */}
              {/* MASTER DASHBOARD FRAME CONTAINER */}
              {/* --------------------------------------------------------------- */}
              <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-[0_24px_55px_rgba(15,23,42,0.08)] overflow-hidden">
                
                {/* Window Top Controls Bar */}
                <div className="px-4 py-2.5 bg-[#f8fafc] border-b border-slate-100 flex items-center">
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#CBD5E1]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#CBD5E1]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#CBD5E1]" />
                  </div>
                </div>

                {/* Dashboard Inner App Container (Sidebar + Content) */}
                <div className="grid grid-cols-12 min-h-[390px] sm:min-h-[420px]">
                  
                  {/* Left Mini Sidebar */}
                  <div className="col-span-3 sm:col-span-3 bg-[#0c1322] text-white p-3 sm:p-3.5 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Logo Aurenis Oficial */}
                      <div className="flex items-center gap-2 pt-1 px-1">
                        <AurenisLogo
                          className="w-5 h-5"
                          textClassName="font-bold text-xs tracking-tight text-white"
                          showText={true}
                        />
                      </div>

                      {/* Nav Links */}
                      <nav className="space-y-1">
                        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#5046e5] text-white font-medium text-[11px]">
                          <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Inicio</span>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-400 hover:text-white transition text-[11px]">
                          <Users className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Estudiantes</span>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-400 hover:text-white transition text-[11px]">
                          <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Docentes</span>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-400 hover:text-white transition text-[11px]">
                          <BookOpen className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Cursos</span>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-400 hover:text-white transition text-[11px]">
                          <FileText className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Notas</span>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-400 hover:text-white transition text-[11px]">
                          <BarChart3 className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Reportes</span>
                        </div>
                      </nav>
                    </div>
                  </div>

                  {/* Right Content View */}
                  <div className="col-span-9 sm:col-span-9 p-3 sm:p-4 bg-white flex flex-col justify-between space-y-3">
                    
                    {/* Top Search + Profile Header */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="relative flex-1 max-w-[210px]">
                        <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          readOnly
                          placeholder="Buscar estudiantes, cursos..."
                          className="w-full pl-6 pr-2 py-1 bg-slate-50 border border-slate-200/80 rounded-md text-[10px] text-slate-700 placeholder:text-slate-400 pointer-events-none"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="relative p-1 rounded-full text-slate-500 hover:bg-slate-100">
                          <Bell className="w-3.5 h-3.5" />
                          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                            1
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                            M
                          </div>
                          <div className="hidden sm:block text-left">
                            <div className="text-[10px] font-bold text-slate-900 leading-tight">María González</div>
                            <div className="text-[8px] text-slate-400 leading-tight">Administradora</div>
                          </div>
                          <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    {/* Greeting Header */}
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-[#0f172a]">
                        Bienvenida, María
                      </h3>
                      <p className="text-[10px] text-slate-400">
                        Aquí tienes un resumen de tu institución.
                      </p>
                    </div>

                    {/* 4 Mini KPI Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {/* Card 1: Estudiantes */}
                      <div className="p-2 rounded-xl border border-slate-100 bg-white shadow-2xs space-y-0.5">
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="text-[9px] font-medium text-slate-500">Estudiantes</span>
                          <Users className="w-3 h-3 text-[#5046e5]" />
                        </div>
                        <div className="text-sm font-black text-slate-900">248</div>
                        <div className="text-[9px] font-bold text-emerald-600">↑ 12%</div>
                      </div>

                      {/* Card 2: Docentes */}
                      <div className="p-2 rounded-xl border border-slate-100 bg-white shadow-2xs space-y-0.5">
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="text-[9px] font-medium text-slate-500">Docentes</span>
                          <GraduationCap className="w-3 h-3 text-[#5046e5]" />
                        </div>
                        <div className="text-sm font-black text-slate-900">18</div>
                        <div className="text-[9px] font-bold text-emerald-600">↑ 5%</div>
                      </div>

                      {/* Card 3: Cursos */}
                      <div className="p-2 rounded-xl border border-slate-100 bg-white shadow-2xs space-y-0.5">
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="text-[9px] font-medium text-slate-500">Cursos</span>
                          <BookOpen className="w-3 h-3 text-[#5046e5]" />
                        </div>
                        <div className="text-sm font-black text-slate-900">32</div>
                        <div className="text-[9px] font-bold text-emerald-600">↑ 8%</div>
                      </div>

                      {/* Card 4: Promedio General */}
                      <div className="p-2 rounded-xl border border-slate-100 bg-white shadow-2xs space-y-0.5">
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="text-[9px] font-medium text-slate-500">Promedio general</span>
                          <Star className="w-3 h-3 text-[#5046e5]" />
                        </div>
                        <div className="text-sm font-black text-slate-900">8.7</div>
                        <div className="text-[9px] font-bold text-emerald-600">↑ 3%</div>
                      </div>
                    </div>

                    {/* Bottom Row: Rendimiento Académico & Actividad Reciente */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      
                      {/* Left: Rendimiento Académico Chart */}
                      <div className="p-2.5 rounded-xl border border-slate-100 bg-white space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-900">Rendimiento académico</span>
                          <span className="text-[8px] font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                            Últimos 6 meses ▾
                          </span>
                        </div>

                        {/* Chart Preview SVG */}
                        <div className="pt-1">
                          <div className="flex items-end justify-between h-14 w-full relative">
                            {/* Y-axis ticks */}
                            <div className="absolute -left-1 top-0 bottom-0 flex flex-col justify-between text-[7px] text-slate-300">
                              <span>10.0</span>
                              <span>8.8</span>
                              <span>7.6</span>
                            </div>

                            {/* SVG Line */}
                            <svg className="w-full h-full pl-5 overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                              <path
                                d="M 0 30 Q 15 28 30 20 T 60 22 T 80 14 T 100 8"
                                fill="none"
                                stroke="#5046e5"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                              />
                              <circle cx="0" cy="30" r="2.5" fill="#5046e5" />
                              <circle cx="30" cy="20" r="2.5" fill="#5046e5" />
                              <circle cx="60" cy="22" r="2.5" fill="#5046e5" />
                              <circle cx="80" cy="14" r="2.5" fill="#5046e5" />
                              <circle cx="100" cy="8" r="2.5" fill="#5046e5" />
                            </svg>
                          </div>

                          {/* X-axis months */}
                          <div className="flex justify-between pl-5 text-[7px] text-slate-400 pt-1 font-medium">
                            <span>Mar</span>
                            <span>Abr</span>
                            <span>May</span>
                            <span>Jun</span>
                            <span>Jul</span>
                            <span>Ago</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actividad Reciente */}
                      <div className="p-2.5 rounded-xl border border-slate-100 bg-white space-y-1.5">
                        <div className="text-[10px] font-bold text-slate-900">Actividad reciente</div>
                        
                        <div className="space-y-1.5 text-[9px]">
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5">
                              <div className="w-4 h-4 rounded-md bg-[#eef1ff] text-[#5046e5] flex items-center justify-center shrink-0">
                                <UserPlus className="w-2.5 h-2.5" />
                              </div>
                              <div className="truncate">
                                <div className="font-bold text-slate-800 text-[9px]">Nuevo estudiante</div>
                                <div className="text-slate-400 text-[8px] truncate">Carlos Miranda García</div>
                              </div>
                            </div>
                            <span className="text-[8px] text-slate-400 shrink-0">Hace 2 min</span>
                          </div>

                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5">
                              <div className="w-4 h-4 rounded-md bg-[#eef1ff] text-[#5046e5] flex items-center justify-center shrink-0">
                                <FileText className="w-2.5 h-2.5" />
                              </div>
                              <div className="truncate">
                                <div className="font-bold text-slate-800 text-[9px]">Nota registrada</div>
                                <div className="text-slate-400 text-[8px] truncate">Matemática - 7.0</div>
                              </div>
                            </div>
                            <span className="text-[8px] text-slate-400 shrink-0">Hace 15 min</span>
                          </div>

                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5">
                              <div className="w-4 h-4 rounded-md bg-[#eef1ff] text-[#5046e5] flex items-center justify-center shrink-0">
                                <FileCheck className="w-2.5 h-2.5" />
                              </div>
                              <div className="truncate">
                                <div className="font-bold text-slate-800 text-[9px]">Documento subido</div>
                                <div className="text-slate-400 text-[8px] truncate">Reporte de notas</div>
                              </div>
                            </div>
                            <span className="text-[8px] text-slate-400 shrink-0">Hace 1 h</span>
                          </div>

                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5">
                              <div className="w-4 h-4 rounded-md bg-[#eef1ff] text-[#5046e5] flex items-center justify-center shrink-0">
                                <GraduationCap className="w-2.5 h-2.5" />
                              </div>
                              <div className="truncate">
                                <div className="font-bold text-slate-800 text-[9px]">Nuevo docente</div>
                                <div className="text-slate-400 text-[8px] truncate">Laura Sánchez</div>
                              </div>
                            </div>
                            <span className="text-[8px] text-slate-400 shrink-0">Hace 2 h</span>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* BOTTOM METRICS STRIP: 248+ / 18 / 32 / 8.7 WITH VERTICAL DIVIDERS */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-14 pb-4 border-t border-slate-200/70 mt-12 items-center">
          
          {/* Metric 1 */}
          <div className="flex items-center gap-3.5 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-xl bg-[#eef1ff] text-[#5046e5] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#0f172a] leading-none">248+</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Estudiantes activos</div>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="flex items-center gap-3.5 justify-center sm:justify-start md:border-l md:border-slate-200 md:pl-6">
            <div className="w-10 h-10 rounded-xl bg-[#eef1ff] text-[#5046e5] flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#0f172a] leading-none">18</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Docentes registrados</div>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="flex items-center gap-3.5 justify-center sm:justify-start md:border-l md:border-slate-200 md:pl-6">
            <div className="w-10 h-10 rounded-xl bg-[#eef1ff] text-[#5046e5] flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#0f172a] leading-none">32</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Cursos disponibles</div>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="flex items-center gap-3.5 justify-center sm:justify-start md:border-l md:border-slate-200 md:pl-6">
            <div className="w-10 h-10 rounded-xl bg-[#eef1ff] text-[#5046e5] flex items-center justify-center shrink-0">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#0f172a] leading-none">8.7</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Promedio general</div>
            </div>
          </div>

        </div>

      </main>

      {/* ========================================================================= */}
      {/* DIRECT LOGIN DEMO MODAL */}
      {/* ========================================================================= */}
      {showDemoModal && mounted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-black/[0.08] space-y-6">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-5 right-5 p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-[#5046e5]">
                <Sparkles className="w-3.5 h-3.5" />
                Acceso Rápido Aurenis
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] tracking-tight">
                Selecciona tu perfil de ingreso
              </h3>
              <p className="text-xs text-slate-500">
                Ingresa directamente a la plataforma con credenciales preparadas para cada rol institucional:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => handleDirectLogin("director", "director@sanjose.cl", "AdminCSJ2026!")}
                disabled={loggingIn !== null}
                className="p-4 rounded-xl border border-slate-200 hover:border-[#5046e5] hover:bg-indigo-50/40 text-left transition flex items-center gap-3.5 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-[#5046e5] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0f172a] group-hover:text-[#5046e5]">
                    Administrador Escolar
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Colegio San José
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleDirectLogin("profesor", "profesor@sanjose.cl", "Profesor2026!")}
                disabled={loggingIn !== null}
                className="p-4 rounded-xl border border-slate-200 hover:border-[#5046e5] hover:bg-indigo-50/40 text-left transition flex items-center gap-3.5 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-[#0f172a] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0f172a] group-hover:text-[#5046e5]">
                    Profesor Jefe / Docente
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Libro de clases y notas
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
