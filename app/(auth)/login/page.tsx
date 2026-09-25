"use client";

import React, { useState, useEffect, useRef, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
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
  Building2,
  Search,
  School,
  MapPin,
  ChevronRight,
  KeyRound,
  Loader2,
  GraduationCap,
  BookOpen,
  UserCog,
  Users,
  Globe2,
  X,
  FileCheck2,
  ArrowLeft,
  Server,
  Activity,
  Award,
  Check,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";

interface Institution {
  id: string;
  name: string;
  slug: string;
  institutionalCode: string | null;
  city: string | null;
  status: string;
  color: string;
  initials: string;
}

interface DemoAccount {
  id: string;
  roleKey: "director" | "profesor" | "alumno" | "superadmin" | "apoderado";
  roleTitle: string;
  institutionName: string;
  institutionCode: string;
  name: string;
  identifier: string; // Email or RUT
  pass: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeColor: string;
  description: string;
}

const FEATURED_SCHOOLS: Institution[] = [
  {
    id: "sch_sanjose_demo",
    name: "Colegio San José",
    slug: "colegio-san-jose",
    institutionalCode: "CSJ-001",
    city: "Providencia, Santiago",
    status: "ACTIVE",
    color: "from-blue-600 to-indigo-700",
    initials: "CSJ",
  },
  {
    id: "sch_santa_maria_demo",
    name: "Instituto Santa María",
    slug: "instituto-santa-maria",
    institutionalCode: "ISM-002",
    city: "Viña del Mar",
    status: "ACTIVE",
    color: "from-emerald-600 to-teal-700",
    initials: "ISM",
  },
  {
    id: "sch_cordillera_demo",
    name: "Liceo Bicentenario Cordillera",
    slug: "liceo-cordillera",
    institutionalCode: "LBC-042",
    city: "San Bernardo, RM",
    status: "ACTIVE",
    color: "from-indigo-600 to-purple-700",
    initials: "LBC",
  },
  {
    id: "sch_los_robles_demo",
    name: "Colegio Los Robles",
    slug: "colegio-los-robles",
    institutionalCode: "CLR-099",
    city: "Concepción, Biobío",
    status: "ACTIVE",
    color: "from-amber-600 to-orange-700",
    initials: "CLR",
  },
  {
    id: "sch_lpmm_demo",
    name: "Liceo Polivalente Manuel Montt",
    slug: "lpmm",
    institutionalCode: "LPMM-001",
    city: "Santiago Centro, RM",
    status: "ACTIVE",
    color: "from-blue-600 to-indigo-700",
    initials: "LPMM",
  },
];

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: "demo-director",
    roleKey: "director",
    roleTitle: "Director de Establecimiento",
    institutionName: "Colegio San José",
    institutionCode: "RBD 10423",
    name: "Carlos Mendoza",
    identifier: "director@sanjose.cl",
    pass: "AdminCSJ2026!",
    icon: Building2,
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    description: "Gestión ejecutiva, libro digital de clases, supervisión y métricas ministeriales.",
  },
  {
    id: "demo-profesor",
    roleKey: "profesor",
    roleTitle: "Docente Titular",
    institutionName: "Colegio San José",
    institutionCode: "RBD 10423",
    name: "Roberto Gómez",
    identifier: "profesor.matematica@sanjose.cl",
    pass: "Profesor2026!",
    icon: BookOpen,
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    description: "Registro de calificaciones, asistencia diaria por curso y planificación curricular.",
  },
  {
    id: "demo-alumno",
    roleKey: "alumno",
    roleTitle: "Estudiante Regular",
    institutionName: "Colegio San José",
    institutionCode: "RBD 10423",
    name: "Sofía Valenzuela",
    identifier: "sofia.valenzuela@sanjose.cl",
    pass: "Estudiante2026!",
    icon: GraduationCap,
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    description: "Portal de notas personales, horario de clases, asistencia y anotaciones.",
  },
  {
    id: "demo-apoderado",
    roleKey: "apoderado",
    roleTitle: "Apoderada / Familia",
    institutionName: "Colegio San José",
    institutionCode: "RBD 10423",
    name: "María González",
    identifier: "maria.gonzalez@sanjose.cl",
    pass: "Apoderado2026!",
    icon: Users,
    badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    description: "Seguimiento pedagógico de pupilos, citaciones, comunicaciones y reportes.",
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
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    description: "Gestión central de colegios, licenciamiento, auditoría general e integraciones.",
  },
];

const DOMAIN_MAP: Record<string, { name: string; code: string; city: string; initials: string }> = {
  "lpmm.cl": { name: "Liceo Polivalente Manuel Montt", code: "LPMM-001 (RBD 10240)", city: "Santiago Centro", initials: "LPMM" },
  "sanjose.cl": { name: "Colegio San José", code: "CSJ-001 (RBD 10423)", city: "Santiago", initials: "CSJ" },
  "santamaria.cl": { name: "Instituto Santa María", code: "ISM-002 (RBD 10842)", city: "Viña del Mar", initials: "ISM" },
  "cordillera.cl": { name: "Liceo Bicentenario Cordillera", code: "LBC-042 (RBD 11204)", city: "San Bernardo", initials: "LBC" },
  "losrobles.cl": { name: "Colegio Los Robles", code: "CLR-099 (RBD 12055)", city: "Concepción", initials: "CLR" },
  "aurenis.com": { name: "Aurenis Cloud Global", code: "PLATAFORMA CENTRAL", city: "Nacional", initials: "AUR" },
};

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const schoolParam = searchParams.get("school") || searchParams.get("slug");

  // Inputs
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [capsLockActive, setCapsLockActive] = useState(false);

  // Institución fijada manualmente o detectada por URL
  const [selectedSchool, setSelectedSchool] = useState<Institution | null>(null);

  // Detectar colegio desde el parámetro URL (/login?school=lpmm)
  useEffect(() => {
    if (schoolParam) {
      const match = FEATURED_SCHOOLS.find(
        (s) => s.slug.toLowerCase() === schoolParam.toLowerCase() || s.id === schoolParam
      );
      if (match) {
        setSelectedSchool(match);
      } else {
        const formattedName = (schoolParam || "")
          .split(/[-_]/)
          .filter(Boolean)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        setSelectedSchool({
          id: `sch_${schoolParam}`,
          name: formattedName.length > 2 ? formattedName : schoolParam.toUpperCase(),
          slug: schoolParam.toLowerCase(),
          institutionalCode: `RBD-${schoolParam.substring(0, 4).toUpperCase()}`,
          city: "Chile",
          status: "ACTIVE",
          color: "from-blue-600 to-indigo-700",
          initials: schoolParam.substring(0, 4).toUpperCase(),
        });
      }
    }
  }, [schoolParam]);

  // Estados de validación
  const [touched, setTouched] = useState({ identifier: false, password: false });
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Estados de llamada
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [activeDemoId, setActiveDemoId] = useState<string | null>(null);

  // Modales
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Búsqueda en el spotlight
  const [searchQuery, setSearchQuery] = useState("");
  const [schoolsList, setSchoolsList] = useState<Institution[]>(FEATURED_SCHOOLS);
  const [isSearchingSchools, setIsSearchingSchools] = useState(false);

  // Tema claro/oscuro
  const [isDark, setIsDark] = useState(false);

  const identifierInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  // Shortcut ⌘K / Ctrl+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isSpotlightOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSpotlightOpen]);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  // Búsqueda de colegios en la API
  async function handleSearchSchools(q: string) {
    setSearchQuery(q);
    if (!q.trim()) {
      setSchoolsList(FEATURED_SCHOOLS);
      return;
    }
    try {
      setIsSearchingSchools(true);
      const res = await fetch(`/api/schools/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.schools)) {
        setSchoolsList(
          data.schools.map((s: any) => ({
            id: s.id,
            name: s.name,
            slug: s.slug,
            institutionalCode: s.institutionalCode,
            city: s.city,
            status: s.status,
            color: "from-blue-600 to-indigo-700",
            initials: s.name.substring(0, 3).toUpperCase(),
          }))
        );
      }
    } catch (err) {
      console.warn("Error searching schools:", err);
    } finally {
      setIsSearchingSchools(false);
    }
  }

  // Detección en tiempo real del colegio según correo o selección
  const detectedInstitution = useMemo(() => {
    if (selectedSchool) {
      return {
        name: selectedSchool.name,
        code: selectedSchool.institutionalCode || selectedSchool.slug,
        city: selectedSchool.city || "Chile",
        initials: selectedSchool.initials,
        isManual: true,
      };
    }

    const trimmed = identifier.trim().toLowerCase();
    if (!trimmed.includes("@")) return null;

    const parts = trimmed.split("@");
    const domain = parts[1];
    if (!domain) return null;

    if (DOMAIN_MAP[domain]) {
      return {
        ...DOMAIN_MAP[domain],
        isManual: false,
      };
    }

    if (
      domain.includes(".cl") ||
      domain.includes(".edu") ||
      domain.includes(".org") ||
      domain.includes(".com")
    ) {
      const schoolPart = (domain || "").split(".")[0] || "";
      const prettyName = schoolPart ? schoolPart.charAt(0).toUpperCase() + schoolPart.slice(1) : "";
      return {
        name: `Colegio / Red ${prettyName}`,
        code: "RED NACIONAL",
        city: "Establecimiento Asociado",
        initials: prettyName.substring(0, 3).toUpperCase(),
        isManual: false,
      };
    }

    return null;
  }, [identifier, selectedSchool]);

  function handleCapsLock(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState("CapsLock"));
    }
  }

  function validateIdentifier(val: string): string | undefined {
    const trimmed = val.trim();
    if (!trimmed) {
      return "Ingresa tu correo institucional o RUT.";
    }
    // Si contiene @, validar formato de correo
    if (trimmed.includes("@")) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) {
        return "El formato del correo institucional es inválido.";
      }
      return undefined;
    }
    // Si no contiene @, es un RUT o usuario: debe tener al menos 3 caracteres
    if (trimmed.length < 3) {
      return "El identificador o RUT ingresado es demasiado corto.";
    }
    return undefined;
  }

  function validatePassword(val: string): string | undefined {
    if (!val) {
      return "La contraseña de acceso es requerida.";
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

  // Envío tradicional del formulario
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setHasSubmitted(true);
    setServerError(null);

    const idErr = validateIdentifier(identifier);
    const passErr = validatePassword(password);

    setErrors({
      identifier: idErr,
      password: passErr,
    });

    if (idErr) {
      identifierInputRef.current?.focus();
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
        body: JSON.stringify({
          email: identifier.trim(),
          password,
          schoolSlug: selectedSchool?.slug || schoolParam || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Credenciales incorrectas o usuario no registrado.");
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        router.push("/select-school");
        router.refresh();
      }
    } catch (err: any) {
      setServerError(err.message || "Error al autenticar con el servidor escolar.");
      setIsLoading(false);
    }
  }

  // Selección de colegio en spotlight o barra
  function handleSelectSchool(school: Institution) {
    setSelectedSchool(school);
    setIsSpotlightOpen(false);

    // Si no hay correo, pre-llenamos con el dominio del colegio para acelerar la entrada
    if (!identifier || identifier.includes("@")) {
      const domainSlug = school.slug.replace(/[^a-z0-9]/g, "");
      setIdentifier(`@${domainSlug}.cl`);
      setTimeout(() => {
        if (identifierInputRef.current) {
          identifierInputRef.current.focus();
          identifierInputRef.current.setSelectionRange(0, 0);
        }
      }, 50);
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

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: account.identifier.trim(),
          password: account.pass,
          schoolSlug: selectedSchool?.slug || schoolParam || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No fue posible iniciar sesión con la cuenta de prueba.");
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        router.push("/select-school");
        router.refresh();
      }
    } catch (err: any) {
      setServerError(err.message || "Error al iniciar sesión con la cuenta seleccionada.");
      setIsLoading(false);
      setActiveDemoId(null);
    }
  }

  const isIdentifierValid =
    identifier.trim().length > 2 &&
    !errors.identifier &&
    (touched.identifier || hasSubmitted);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070B14] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white transition-colors duration-200">
      
      {/* =========================================================================
          BARRA DE NAVEGACIÓN SUPERIOR
          ========================================================================= */}
      <header className="w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#0A0F1D]/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Portal Principal</span>
          </Link>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          {/* Logo y Nombre */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-sm shadow-blue-500/20">
              <div className="w-full h-full bg-white dark:bg-[#0A0F1D] rounded-[10px] flex items-center justify-center overflow-hidden">
                <Image
                  src="/logonuevo.png"
                  alt="Aurenis"
                  width={22}
                  height={22}
                  className="object-contain"
                  referrerPolicy="no-referrer"
                  priority
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                Aurenis
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800 tracking-wide uppercase">
                Cloud
              </span>
            </div>
          </Link>
        </div>

        {/* Acciones de Cabecera */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Indicador de Estado de Conexión */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-600 dark:text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Servidores MINEDUC Sincronizados</span>
          </div>

          {/* Botón Explorador de Colegios (⌘K) */}
          <button
            type="button"
            onClick={() => setIsSpotlightOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-600 transition cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Buscar Colegio</span>
            <kbd className="hidden lg:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700 ml-1">
              ⌘K
            </kbd>
          </button>

          {/* Selector de Modo Oscuro */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label={isDark ? "Modo Claro" : "Modo Oscuro"}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </header>

      {/* =========================================================================
          CONTENIDO PRINCIPAL: LAYOUT EJECUTIVO SPLIT-SCREEN
          ========================================================================= */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* =====================================================================
            COLUMNA IZQUIERDA: SHOWCASE DE LA RED NACIONAL EDUCATIVA
            ===================================================================== */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-between space-y-8 pr-4">
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs font-semibold">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Red Nacional de Establecimientos Conectados</span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              El entorno unificado de gestión escolar de Chile.
            </h1>

            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
              Libro de clases digital, asistencia en tiempo real, decretos evaluativos y comunicación integral para directivos, docentes, estudiantes y familias.
            </p>
          </div>

          {/* Tarjeta Interactiva de Métricas de la Red */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1120] border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-200 dark:border-blue-800">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Monitoreo en Tiempo Real
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Infraestructura Cloud de Alta Disponibilidad
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                99.98% Uptime
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                  Establecimientos
                </span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  480+
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                  Asistencia Promedio
                </span>
                <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                  98.4%
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                  Decreto 67
                </span>
                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  100%
                </span>
              </div>
            </div>

            {/* Selector de Colegios de la Red */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span>Acceso Directo por Colegio Asociado:</span>
                <button
                  type="button"
                  onClick={() => setIsSpotlightOpen(true)}
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer text-xs"
                >
                  <span>Explorar red</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {FEATURED_SCHOOLS.map((school) => {
                  const isSelected = selectedSchool?.id === school.id;
                  return (
                    <button
                      key={school.id}
                      type="button"
                      onClick={() => handleSelectSchool(school)}
                      className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer flex items-center gap-2.5 ${
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/20"
                          : "bg-slate-50 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        {school.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {school.name}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {school.city}
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sellos de Confianza al Pie */}
          <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Multi-Tenant Blindado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-blue-500" />
              <span>Firma Electrónica MINEDUC</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-slate-400" />
              <span>Cifrado AES-256</span>
            </div>
          </div>
        </div>

        {/* =====================================================================
            COLUMNA DERECHA: FORMULARIO DE ACCESO PRÉMIUM
            ===================================================================== */}
        <div className="col-span-12 lg:col-span-6 flex justify-center">
          <div className="w-full max-w-[480px] bg-white dark:bg-[#0B1120] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-slate-200/60 dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] p-6 sm:p-9 space-y-6">
            
            {/* Cabecera Adaptativa: Red o Colegio Seleccionado */}
            <div className="space-y-3">
              {detectedInstitution ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0">
                      {detectedInstitution.initials || "COL"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                          {detectedInstitution.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 font-bold shrink-0">
                          {detectedInstitution.code}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {detectedInstitution.city} • Servidor Institucional Activo
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSchool(null);
                      setIdentifier("");
                    }}
                    className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/60 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                    title="Cambiar colegio"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ) : (
                <div className="flex items-center justify-between pb-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                    <Globe2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Portal Nacional Aurenis</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsSpotlightOpen(true)}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Buscar mi colegio</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Iniciar Sesión
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Ingresa con tu correo institucional o tu RUT oficial chileno.
                </p>
              </div>
            </div>

            {/* Mensaje de Error del Servidor */}
            <AnimatePresence>
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  role="alert"
                  className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{serverError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Formulario Principal */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">

              {/* Selector Rápido de Rol: Estudiante, Director, Profesor, Apoderado */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Ingresar directamente como:
                  </label>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold truncate max-w-[170px]">
                    {selectedSchool ? selectedSchool.name : "Colegio San José"}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    {
                      key: "estudiante",
                      label: "Estudiante",
                      desc: "Notas y asistencia",
                      icon: BookOpen,
                      email: selectedSchool ? `estudiante@${selectedSchool.slug.replace(/[^a-z0-9]/g, "")}.cl` : "estudiante@sanjose.cl",
                      pass: "Estudiante2026!",
                    },
                    {
                      key: "director",
                      label: "Director",
                      desc: "Gestión ejecutiva",
                      icon: Building2,
                      email: selectedSchool ? `director@${selectedSchool.slug.replace(/[^a-z0-9]/g, "")}.cl` : "director@sanjose.cl",
                      pass: "AdminCSJ2026!",
                    },
                    {
                      key: "profesor",
                      label: "Profesor",
                      desc: "Libro de clases",
                      icon: GraduationCap,
                      email: selectedSchool ? `profesor@${selectedSchool.slug.replace(/[^a-z0-9]/g, "")}.cl` : "profesor@sanjose.cl",
                      pass: "Profesor2026!",
                    },
                    {
                      key: "apoderado",
                      label: "Apoderado",
                      desc: "Seguimiento pupilo",
                      icon: Users,
                      email: selectedSchool ? `apoderado@${selectedSchool.slug.replace(/[^a-z0-9]/g, "")}.cl` : "apoderado@sanjose.cl",
                      pass: "Apoderado2026!",
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isMatch = identifier.toLowerCase().includes(item.key) ||
                      (item.key === "estudiante" && identifier.toLowerCase().includes("alumno"));
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => {
                          setIdentifier(item.email);
                          setPassword(item.pass);
                          setErrors({});
                          if (serverError) setServerError(null);
                        }}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                          isMatch
                            ? "bg-blue-50/80 dark:bg-blue-950/50 border-blue-500 ring-2 ring-blue-500/20 shadow-xs"
                            : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-white dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Icon className={`w-3.5 h-3.5 ${isMatch ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"}`} />
                          {isMatch && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                          )}
                        </div>
                        <div className="mt-1">
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                            {item.label}
                          </div>
                          <div className="text-[9px] text-slate-400 truncate">
                            {item.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Campo: Correo o RUT */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="auth-identifier"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Correo Institucional o RUT <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">
                    ej. docente@colegio.cl o 12.345.678-9
                  </span>
                </div>

                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    ref={identifierInputRef}
                    id="auth-identifier"
                    name="identifier"
                    type="text"
                    autoComplete="username"
                    placeholder={
                      selectedSchool
                        ? `usuario@${selectedSchool.slug.replace(/[^a-z0-9]/g, "")}.cl`
                        : "ej. profesor@sanjose.cl o 12345678-9"
                    }
                    value={identifier}
                    onChange={handleIdentifierChange}
                    onBlur={() => handleBlur("identifier")}
                    aria-invalid={!!errors.identifier}
                    className={`w-full text-sm rounded-2xl py-3 pl-10 pr-10 bg-slate-50/70 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 border min-h-[48px] transition-all focus-visible:outline-none ${
                      errors.identifier
                        ? "border-rose-500 focus-visible:ring-2 focus-visible:ring-rose-500/20"
                        : isIdentifierValid
                        ? "border-emerald-500 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600/20"
                    }`}
                  />
                  {isIdentifierValid && (
                    <div className="absolute right-3.5 text-emerald-600 dark:text-emerald-400 pointer-events-none">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                  {errors.identifier && (
                    <div className="absolute right-3.5 text-rose-500 pointer-events-none">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {errors.identifier && (
                  <p role="alert" className="text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1 pt-0.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.identifier}</span>
                  </p>
                )}
              </div>

              {/* Campo: Contraseña */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="auth-password"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Contraseña de Acceso <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsHelpModalOpen(true)}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    ref={passwordInputRef}
                    id="auth-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={handlePasswordChange}
                    onKeyDown={handleCapsLock}
                    onBlur={() => handleBlur("password")}
                    aria-invalid={!!errors.password}
                    className={`w-full text-sm rounded-2xl py-3 pl-10 pr-11 bg-slate-50/70 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 border min-h-[48px] transition-all focus-visible:outline-none ${
                      errors.password
                        ? "border-rose-500 focus-visible:ring-2 focus-visible:ring-rose-500/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    aria-label={showPassword ? "Ocultar clave" : "Mostrar clave"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {capsLockActive && (
                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-700 dark:text-amber-300 font-medium flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Bloqueo de mayúsculas activo</span>
                  </div>
                )}

                {errors.password && (
                  <p role="alert" className="text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1 pt-0.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Recordar sesión */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 dark:bg-slate-800 transition cursor-pointer"
                  />
                  <span>Recordar sesión en este equipo</span>
                </label>
              </div>

              {/* Botón Principal de Ingreso */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  {isLoading && !activeDemoId ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Conectando con el servidor escolar...</span>
                    </>
                  ) : (
                    <>
                      <span>Ingresar a la Plataforma</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* =========================================================================
                ACCESO RÁPIDO DE EVALUACIÓN MULTI-ROL (ELEGIBLE & MODAL)
                ========================================================================= */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Acceso de Evaluación y Pruebas</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsDemoModalOpen(true)}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Ver todos los roles
                </button>
              </div>

              {/* Chips rápidos de 1 clic */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {DEMO_ACCOUNTS.map((acc) => {
                  const IconComp = acc.icon;
                  const isThisLoading = isLoading && activeDemoId === acc.id;

                  return (
                    <button
                      key={acc.id}
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleQuickLogin(acc)}
                      className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-all flex flex-col items-center justify-center gap-1 group text-center cursor-pointer disabled:opacity-50"
                      title={`Ingresar inmediatamente como ${acc.roleTitle}`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        {isThisLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <IconComp className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 block truncate w-full">
                        {acc.roleKey === "director"
                          ? "Director"
                          : acc.roleKey === "profesor"
                          ? "Docente"
                          : acc.roleKey === "alumno"
                          ? "Alumno"
                          : acc.roleKey === "apoderado"
                          ? "Familia"
                          : "SuperAdmin"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sello de Seguridad Criptográfica */}
            <div className="text-center pt-1">
              <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>Protocolo de autenticación validado según estándares MINEDUC</span>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* =========================================================================
          PIE DE PÁGINA
          ========================================================================= */}
      <footer className="w-full border-t border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-[#070B14]/40 py-4 px-4 sm:px-8 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsSpotlightOpen(true)}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
            >
              Directorio Nacional Escolar
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsHelpModalOpen(true)}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
            >
              Protocolo de Recuperación
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsDemoModalOpen(true)}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
            >
              Cuentas Demostrativas
            </button>
          </div>

          <p>© 2026 Aurenis Cloud Education. Plataforma Educativa Nacional de Chile.</p>
        </div>
      </footer>

      {/* =========================================================================
          SPOTLIGHT COMMAND PALETTE: BUSCADOR DE INSTITUCIONES (⌘K)
          ========================================================================= */}
      <Modal isOpen={isSpotlightOpen} onClose={() => setIsSpotlightOpen(false)} size="lg">
        <ModalHeader>
          <div className="flex items-center justify-between w-full pr-6">
            <div>
              <ModalTitle>Directorio Nacional de Colegios e Instituciones</ModalTitle>
              <ModalDescription>
                Localiza tu colegio por nombre, comuna o código oficial RBD para ingresar a su servidor.
              </ModalDescription>
            </div>
            <kbd className="hidden sm:inline-block text-[11px] font-mono px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
              ESC
            </kbd>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
                <Search className="w-4 h-4" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Escribe el nombre del colegio, comuna o código RBD..."
                value={searchQuery}
                onChange={(e) => handleSearchSchools(e.target.value)}
                className="w-full text-sm rounded-2xl py-3 pl-10 pr-10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200 dark:border-slate-800 focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600/20 transition-all focus-visible:outline-none"
              />
              {isSearchingSchools ? (
                <div className="absolute right-3.5">
                  <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                </div>
              ) : searchQuery ? (
                <button
                  type="button"
                  onClick={() => handleSearchSchools("")}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null}
            </div>

            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {schoolsList.length === 0 && !isSearchingSchools && (
                <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-dashed border-slate-200 dark:border-slate-800">
                  No se encontraron colegios registrados con el término &quot;{searchQuery}&quot;.
                </div>
              )}

              {schoolsList.map((school) => (
                <div
                  key={school.id}
                  onClick={() => handleSelectSchool(school)}
                  className="group p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-blue-50/70 dark:hover:bg-blue-950/40 hover:border-blue-400 dark:hover:border-blue-700 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0 font-bold text-xs shadow-2xs">
                      {school.initials || "COL"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {school.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold shrink-0">
                          En línea
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {school.city || "Chile"}
                        </span>
                        <span>•</span>
                        <span>RBD: {school.institutionalCode || school.slug}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0 shadow-2xs"
                  >
                    Seleccionar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setIsSpotlightOpen(false)}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>

      {/* =========================================================================
          MODAL DE ROLES DE DEMOSTRACIÓN Y PRUEBA
          ========================================================================= */}
      <Modal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} size="lg">
        <ModalHeader>
          <ModalTitle>Cuentas Demostrativas de la Red Aurenis</ModalTitle>
          <ModalDescription>
            Explora la plataforma desde la perspectiva de cada perfil escolar con 1 solo clic.
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
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-blue-400 dark:hover:border-blue-700 transition flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {acc.name}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${acc.badgeColor}`}>
                          {acc.roleTitle}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {acc.description}
                      </p>
                      <p className="text-[11px] font-mono text-slate-400 mt-1">
                        {acc.identifier} • {acc.institutionName}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleQuickLogin(acc)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50 shadow-xs"
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

      {/* =========================================================================
          MODAL DE RECUPERACIÓN DE CONTRASEÑA
          ========================================================================= */}
      <Modal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} size="md">
        <ModalHeader>
          <ModalTitle>Recuperación de Contraseña y Acceso</ModalTitle>
          <ModalDescription>
            Protocolo de seguridad escolar para resguardo del Libro de Clases Digital.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Por normativa del Ministerio de Educación de Chile (MINEDUC) y seguridad del Libro Digital, las contraseñas son custodiadas y administradas internamente por la dirección de cada establecimiento.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white">
                ¿A quién debes contactar según tu perfil?
              </h4>
              <ul className="space-y-2 list-disc list-inside text-slate-600 dark:text-slate-400 pl-1">
                <li>
                  <strong>Docentes y Profesores:</strong> Acércate a la Inspectoría General o al Administrador Escolar de tu colegio para regenerar tu clave temporal.
                </li>
                <li>
                  <strong>Alumnos y Familias:</strong> Solicita la reconfiguración en la Secretaría Docente presentando el RUT del estudiante.
                </li>
                <li>
                  <strong>Equipos Directivos:</strong> Comunícate a través de la mesa de ayuda oficial de Aurenis Cloud.
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
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#070B14]">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
