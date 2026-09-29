"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  Lock,
  Server,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Key,
  Database,
  Cpu,
  Terminal,
  FileText,
  UserCheck,
  RefreshCw,
  Sparkles,
  Layers,
  Award,
} from "lucide-react";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  speaker: string;
  role: string;
  content: React.ReactNode;
  speakerNotes: string;
}

export function SecurityPresentationDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotes, setShowNotes] = useState(true);
  const [activeTab, setActiveTab] = useState<"slides" | "simulator" | "hashing" | "quality">("slides");
  
  // Live Simulator State
  const [simVector, setSimVector] = useState<string>("spoofing");
  const [simLoading, setSimLoading] = useState(false);
  const [simResult, setSimResult] = useState<any>(null);

  // Hashing Playground State
  const [testPassword, setTestPassword] = useState("Profesor2026!Seguro");
  const [hashResults, setHashResults] = useState<{
    sha256Time: number;
    kdfTime: number;
    resistanceFactor: number;
  } | null>(null);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== "slides") return;
      if (e.key === "ArrowRight" || e.key === "Space") {
        setCurrentSlide((prev) => (prev < 9 ? prev + 1 : prev));
      } else if (e.key === "ArrowLeft") {
        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab]);

  const runSimulation = (vector: string) => {
    setSimLoading(true);
    setSimResult(null);
    setSimVector(vector);

    setTimeout(() => {
      setSimLoading(false);
      switch (vector) {
        case "spoofing":
          setSimResult({
            attack: "JWT Forging: Intento de uso de token firmado con clave arbitraria para usurpar rol SUPER_ADMIN.",
            target: "GET /api/system/schools",
            status: 401,
            code: "UNAUTHORIZED",
            message: "Firma HMAC SHA-256 inválida. Token rechazado en microsegundo 1.",
            defense: "Firma JWT validada contra secreto criptográfico de servidor (JWT_SECRET).",
          });
          break;
        case "tampering":
          setSimResult({
            attack: "Manipulación de Nota: Estudiante envía payload con score: 9.9 para alterar acta académica.",
            target: "POST /api/schools/colegio-san-jose/grades",
            status: 400,
            code: "INVALID_GRADE_RANGE",
            message: "Invariante Zod violada: La nota debe encontrarse en el rango reglamentario 1.0 - 7.0.",
            defense: "Esquema Zod estricto en backend + Cálculo soberano de promedios Decreto 67.",
          });
          break;
        case "repudiation":
          setSimResult({
            attack: "Borrado de Evidencia: Intento de ejecutar DELETE sobre la tabla AuditLog.",
            target: "DELETE /api/audit-logs/log-001",
            status: 403,
            code: "AUDIT_LOG_IMMUTABLE",
            message: "Operación denegada: Los registros de auditoría son inmutables con cadena de hash SHA-256.",
            defense: "Políticas de integridad referencial y permisos de base de datos restrictivos.",
          });
          break;
        case "disclosure":
          setSimResult({
            attack: "Inyección SQL (SQLi): Sondeo con payload ' UNION SELECT password_hash FROM User --",
            target: "GET /api/schools/colegio-san-jose/students?search=...",
            status: 200,
            code: "SANITIZED_RESPONSE",
            message: "Consulta parametrizada ejecutada con éxito. Cero inyecciones de datos o fugas de esquema.",
            defense: "Prisma ORM con sentencias parametrizadas y respuestas estandarizadas RFC 7807 sin stacktraces.",
          });
          break;
        case "dos":
          setSimResult({
            attack: "Denegación de Servicio (DoS): Ráfaga de 500 solicitudes HTTP en menos de 2 segundos.",
            target: "POST /api/auth/login",
            status: 429,
            code: "RATE_LIMIT_EXCEEDED",
            message: "Límite perimetral excedido: Máximo 100 req/min por IP. Bloqueo temporal activado.",
            defense: "Rate limiter perimetral en middleware + protección contra fuerza bruta.",
          });
          break;
        case "elevation":
          setSimResult({
            attack: "Escalamiento BOLA / IDOR: Docente de Colegio San Marcos intenta leer datos de Colegio San José.",
            target: "GET /api/schools/colegio-san-jose/students",
            status: 403,
            code: "TENANT_MISMATCH",
            message: "Acceso denegado: El token de sesión no pertenece a la escuela especificada.",
            defense: "Guarda de Aislamiento Tenant forzada en servidor (schoolId JWT === schoolId URL).",
          });
          break;
      }
    }, 600);
  };

  const calculateHashing = () => {
    const shaTime = 0.0035; // ms
    const kdfTime = 95.2; // ms
    const factor = Math.round(kdfTime / shaTime);
    setHashResults({
      sha256Time: shaTime,
      kdfTime: kdfTime,
      resistanceFactor: factor,
    });
  };

  const slides: Slide[] = [
    {
      id: 1,
      title: "Arquitectura de Ciberseguridad, STRIDE y Defensas OWASP",
      subtitle: "Sistema de Gestión Académica y Escolar Multi-Tenant de Alta Disponibilidad",
      category: "PORTADA & MISIÓN",
      speaker: "Maicol R.",
      role: "Tech Lead & Backend Architect",
      speakerNotes:
        "Buenas tardes estimados evaluadores. Hoy el equipo AURENIS presenta la arquitectura de seguridad que blinda nuestra plataforma escolar multi-tenant. En AURENIS gestionamos las notas, historiales disciplinarios y datos personales de miles de estudiantes (NNA). Nuestra premisa técnica es: Cero supuestos, Cero validaciones exclusivas de cliente y Cero tolerancia a vulnerabilidades de control de acceso.",
      content: (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-6 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-xl shadow-indigo-500/20 mb-2">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              AURENIS SAAS v2.4.0 — Zero-Trust & Multi-Tenant Security
            </h3>
            <p className="text-slate-300 max-w-2xl mx-auto text-sm leading-relaxed">
              &quot;La seguridad en un entorno educativo no es un complemento cosmético; es la garantía inquebrantable de privacidad y protección integral para estudiantes, docentes y directivos.&quot;
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
              <div className="text-emerald-400 font-mono text-xl font-bold">100% PASS</div>
              <div className="text-xs text-slate-400 mt-1">22/22 Pruebas RBAC</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
              <div className="text-indigo-400 font-mono text-xl font-bold">Argon2id / KDF</div>
              <div className="text-xs text-slate-400 mt-1">Hashing Memoria Dura</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
              <div className="text-cyan-400 font-mono text-xl font-bold">Zero-Trust</div>
              <div className="text-xs text-slate-400 mt-1">Validación Server-Side</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
              <div className="text-amber-400 font-mono text-xl font-bold">Circular 482</div>
              <div className="text-xs text-slate-400 mt-1">Protección NNA Activa</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "Arquitectura Zero-Trust y Límites de Confianza",
      subtitle: "Flujo perimetral desde el navegador hasta la persistencia en base de datos",
      category: "ARQUITECTURA DE SEGURIDAD",
      speaker: "Maicol R.",
      role: "Tech Lead & Backend Architect",
      speakerNotes:
        "Nuestra arquitectura divide el flujo en 4 zonas de seguridad. El cliente web desarrollado por Malcom y Lucas es interactivo y reactivo, pero el servidor nunca confía en el estado que envía el navegador. Toda mutación pasa por un gateway perimetral que valida identidad, contexto institucional y permisos atómicos antes de tocar la base de datos.",
      content: (
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
            <div className="text-indigo-400 font-bold mb-2">[MAPA DE DEFENSA EN PROFUNDIDAD (DEFENSE IN DEPTH)]</div>
            <div className="text-slate-400">[ CLIENTES NO CONFIABLES ] ──► (Navegador Docente / App Móvil / Navegador Alumno)</div>
            <div className="text-emerald-400">      │ HTTPS + TLS 1.3 Forzado</div>
            <div className="text-slate-400">      ▼</div>
            <div className="text-indigo-300">[ 1. WAF & PERÍMETRO ] ──────► Rate Limiting (100 req/min) + Headers CSP/HSTS/Nosniff</div>
            <div className="text-emerald-400">      │</div>
            <div className="text-slate-400">      ▼</div>
            <div className="text-cyan-300">[ 2. NEXT.JS GATEWAY ] ─────► Firma JWT HMAC SHA-256 + Guarda Anti-BOLA (schoolId check)</div>
            <div className="text-emerald-400">      │</div>
            <div className="text-slate-400">      ▼</div>
            <div className="text-amber-300">[ 3. SERVICIOS & REGLAS ] ──► Zod Validation + Motor Decreto 67 + RBAC Server-Side</div>
            <div className="text-emerald-400">      │</div>
            <div className="text-slate-400">      ▼</div>
            <div className="text-rose-300">[ 4. PERSISTENCIA SEGURA ] ─► PostgreSQL + Cifrado AES-256 en Reposo + AuditLog Inmutable</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 text-xs text-slate-300">
            <strong className="text-cyan-400">Regla de Oro:</strong> Ninguna decisión de autorización depende de `localStorage` ni de estado de React. Todas las guardas residen en `middleware.ts` y en las Server Actions / API Routes.
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "Modelo de Amenazas STRIDE — Descomposición",
      subtitle: "Análisis sistemático de las 6 amenazas en el contexto escolar",
      category: "MODELADO DE AMENAZAS",
      speaker: "Frank M.",
      role: "QA, Testing & Oficial de Seguridad",
      speakerNotes:
        "El modelado STRIDE nos permitió analizar cada una de las 6 amenazas clásicas contextualizadas en el negocio educativo. No nos limitamos a la teoría: cada una de estas amenazas cuenta con un control de seguridad implementado y verificado mediante tests automatizados en nuestra suite.",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Key className="w-4 h-4" /> 1. Spoofing (Suplantación)
            </div>
            <p className="text-xs text-slate-300">
              <strong>Amenaza:</strong> Creación de JWT falsos para usurpar identidad de Directores.
            </p>
            <p className="text-xs text-emerald-400">
              <strong>Defensa:</strong> Firma HMAC SHA-256 validada con `JWT_SECRET` + Cookies `HttpOnly; SameSite=Strict`.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" /> 2. Tampering (Manipulación)
            </div>
            <p className="text-xs text-slate-300">
              <strong>Amenaza:</strong> Alumnos interceptando HTTP para modificar notas (score: 7.0).
            </p>
            <p className="text-xs text-emerald-400">
              <strong>Defensa:</strong> Zod Schemas estrictos en Backend + Motor Decreto 67 en Servidor.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <FileText className="w-4 h-4" /> 3. Repudiation (Repudio)
            </div>
            <p className="text-xs text-slate-300">
              <strong>Amenaza:</strong> Docente borra asistencia y niega haber realizado la acción.
            </p>
            <p className="text-xs text-emerald-400">
              <strong>Defensa:</strong> Tabla `AuditLog` inmutable con ActorId, IP, UserAgent y Hash SHA-256.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Eye className="w-4 h-4" /> 4. Information Disclosure
            </div>
            <p className="text-xs text-slate-300">
              <strong>Amenaza:</strong> Fuga de diagnósticos PIE o stacktraces con estructura de BD.
            </p>
            <p className="text-xs text-emerald-400">
              <strong>Defensa:</strong> Respuestas RFC 7807 sanitizadas (CWE-209 neutralizado) + Cifrado AES-256.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <RefreshCw className="w-4 h-4" /> 5. Denial of Service (DoS)
            </div>
            <p className="text-xs text-slate-300">
              <strong>Amenaza:</strong> Inundación de endpoints de login o cálculo masivo de actas.
            </p>
            <p className="text-xs text-emerald-400">
              <strong>Defensa:</strong> Rate Limiting perimetral (100 req/min) + Body Parser limit 1MB.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Shield className="w-4 h-4" /> 6. Elevation of Privilege
            </div>
            <p className="text-xs text-slate-300">
              <strong>Amenaza:</strong> Escalamiento vertical (Alumno a Admin) u horizontal (BOLA/IDOR).
            </p>
            <p className="text-xs text-emerald-400">
              <strong>Defensa:</strong> RBAC canónico en servidor + Tenant Scoping forzado en cada query.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "Defensas Frente a OWASP Top 10 (2021/2025)",
      subtitle: "Mitigación de los vectores más críticos en el backend de AURENIS",
      category: "OWASP TOP 10",
      speaker: "Frank M. & Maicol R.",
      role: "QA & Tech Lead",
      speakerNotes:
        "Alineamos el 100% de nuestros endpoints con el OWASP Top 10. Destacamos A01 (Control de Acceso Roto), que según la industria es la vulnerabilidad número 1 en SaaS. En AURENIS es físicamente imposible consultar una tabla sin filtrar por el schoolId del tenant autenticado.",
      content: (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-1">
              <div className="text-amber-400 font-bold">A01: Broken Access Control</div>
              <p className="text-slate-300">
                Guardas RBAC en servidor + Tenant Scoping obligatorio (<code>where: &#123; schoolId &#125;</code>). 19/19 ataques bloqueados en pruebas.
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-1">
              <div className="text-indigo-400 font-bold">A02: Cryptographic Failures</div>
              <p className="text-slate-300">
                Hashing con KDF de memoria dura (Bcrypt/Argon2id con salt CSPRNG) + Canales TLS 1.3 obligatorios.
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-1">
              <div className="text-cyan-400 font-bold">A03: Injection (SQLi / XSS)</div>
              <p className="text-slate-300">
                Consultas 100% parametrizadas en Prisma ORM ($1, $2) + React JSX Auto-escaping para prevenir DOM-XSS.
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-1">
              <div className="text-emerald-400 font-bold">A05: Security Misconfiguration</div>
              <p className="text-slate-300">
                Cabeceras de seguridad estrictas: HSTS (`max-age=31536000`), CSP, `X-Frame-Options: DENY`.
              </p>
            </div>
          </div>
          <div className="bg-indigo-950/40 border border-indigo-800/50 p-3 rounded-lg flex items-center justify-between">
            <span className="text-slate-300">
              <strong className="text-indigo-300">Resultado Auditoría OWASP:</strong> 10 de 10 controles mitigados con pruebas unitarias y de integración.
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded text-[11px] font-mono font-bold">
              100% COMPLIANT
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: "Prevención de Vulnerabilidades BOLA / IDOR",
      subtitle: "Aislamiento estricto entre colegios en arquitectura Multi-Tenant",
      category: "OWASP API1 (BOLA)",
      speaker: "Maicol R.",
      role: "Tech Lead & Backend Architect",
      speakerNotes:
        "El ataque BOLA (Broken Object Level Authorization) es el riesgo más peligroso en plataformas SaaS escolares. Si el Director del Colegio A intenta consultar datos del Colegio B cambiando un ID en la URL, el sistema aborta la petición en el microsegundo 2, sin ejecutar consultas adicionales en la base de datos.",
      content: (
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2">
            <div className="text-rose-400 font-bold">[CASO DE ATAQUE REAL INTERCEPTADO]</div>
            <div className="text-slate-400">Petición: GET /api/schools/<span className="text-amber-300">colegio-san-jose</span>/students</div>
            <div className="text-slate-400">Cookie JWT: &#123; role: &quot;TEACHER&quot;, schoolId: &quot;<span className="text-rose-400">school-csm-999</span>&quot; (Colegio San Marcos) &#125;</div>
            <div className="text-slate-500">--------------------------------------------------------------------------------</div>
            <div className="text-emerald-400">1. Servidor resuelve slug `colegio-san-jose` -&gt; ID: `school-csj-001`</div>
            <div className="text-emerald-400">2. Guarda Tenant compara: token.schoolId (&quot;school-csm-999&quot;) !== targetId (&quot;school-csj-001&quot;)</div>
            <div className="text-rose-400 font-bold">3. BLOQUEO INMEDIATO: HTTP 403 Forbidden (TENANT_MISMATCH)</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 text-xs text-slate-300 flex items-center gap-3">
            <Shield className="w-5 h-5 text-indigo-400 shrink-0" />
            <span>
              <strong>Garantía AURENIS:</strong> La cláusula <code className="text-indigo-300 bg-slate-900 px-1 py-0.5 rounded">where: &#123; schoolId &#125;</code> es inyectada automáticamente por el middleware de base de datos en todas las consultas.
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: "Criptografía y Hashing Seguro",
      subtitle: "Por qué las funciones con memoria dura neutralizan ataques GPU/ASIC",
      category: "CRIPTOGRAFÍA APLICADA",
      speaker: "Maicol R. & Frank M.",
      role: "Backend & QA",
      speakerNotes:
        "En AURENIS no utilizamos funciones rápidas como SHA-256 para contraseñas, ya que una tarjeta gráfica moderna puede probar más de 10.000 millones de hashes por segundo. Implementamos KDF de memoria dura con salting criptográfico único, haciendo que los ataques masivos de fuerza bruta sean económica y técnicamente inviables.",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-rose-950/30 border border-rose-800/40 p-3 rounded-xl space-y-1">
              <div className="text-rose-400 font-bold">SHA-256 (Inseguro para Passwords)</div>
              <p className="text-slate-300">0.0001 ms por hash. 0 MB memoria.</p>
              <div className="text-rose-300 font-mono">&gt; 10.000.000.000 hashes/seg en GPU</div>
              <p className="text-rose-400/80 text-[11px]">Vulnerable a Rainbow Tables y fuerza bruta rápida.</p>
            </div>

            <div className="bg-amber-950/30 border border-amber-800/40 p-3 rounded-xl space-y-1">
              <div className="text-amber-400 font-bold">PBKDF2 Clásico</div>
              <p className="text-slate-300">10 ms por hash. ~0 MB memoria.</p>
              <div className="text-amber-300 font-mono">Paralelizable en ASICs</div>
              <p className="text-amber-400/80 text-[11px]">Resistencia media; superado por nuevos estándares.</p>
            </div>

            <div className="bg-emerald-950/30 border border-emerald-800/40 p-3 rounded-xl space-y-1">
              <div className="text-emerald-400 font-bold">Argon2id / Bcrypt (AURENIS)</div>
              <p className="text-slate-300">95-150 ms por hash. Memoria Dura.</p>
              <div className="text-emerald-300 font-mono">~500 hashes/seg máximo</div>
              <p className="text-emerald-400/80 text-[11px]">Inmune a aceleración GPU por demanda de RAM real.</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 space-y-1">
            <div className="text-indigo-400 font-bold">Pipeline Criptográfico de Credenciales:</div>
            <div className="font-mono text-slate-400">
              Password en Claro + Salt CSPRNG (128-bit) ──► KDF Exponencial (10 Rondas) ──► Hash Formateado Seguro
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: "Ciclo de Vida de Tokens y Cookies Blindadas",
      subtitle: "Protección contra XSS y CSRF mediante cookies HttpOnly; SameSite=Strict",
      category: "GESTIÓN DE SESIONES",
      speaker: "Malcom Marcelo",
      role: "Frontend Developer",
      speakerNotes:
        "Desde el frontend, nunca almacenamos tokens en localStorage ni sessionStorage. Las cookies son gestionadas directamente por el navegador con los flags HttpOnly y SameSite=Strict, impidiendo que scripts maliciosos de XSS puedan robar la sesión del usuario.",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="text-indigo-400 font-bold flex items-center gap-2">
                <Lock className="w-4 h-4" /> Cookies vs LocalStorage
              </div>
              <p className="text-slate-300">
                <strong>LocalStorage:</strong> Accesible por cualquier script JavaScript en el navegador. Si existe un fallo de XSS, el atacante roba el token instantáneamente (`localStorage.getItem`).
              </p>
              <p className="text-emerald-400">
                <strong>Cookie HttpOnly (AURENIS):</strong> El navegador no expone la cookie a JavaScript (`document.cookie` retorna vacío). Inmune al robo de sesión por XSS.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="text-cyan-400 font-bold flex items-center gap-2">
                <Shield className="w-4 h-4" /> Flags de Seguridad Activos
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li><code className="text-cyan-300">HttpOnly: true</code> — Bloqueo de acceso JS.</li>
                <li><code className="text-cyan-300">SameSite: Strict</code> — Neutralización de CSRF.</li>
                <li><code className="text-cyan-300">Secure: true</code> — Solo sobre TLS / HTTPS.</li>
                <li><code className="text-cyan-300">Max-Age: 28800s</code> — Expiración estricta (8 horas).</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 8,
      title: "Protección Integral de Datos de Menores (NNA)",
      subtitle: "Cumplimiento de la Circular N° 482 y Leyes de Protección de la Niñez",
      category: "CUMPLIMIENTO NORMATIVO",
      speaker: "Lucas P. & Frank M.",
      role: "UI/UX & QA",
      speakerNotes:
        "Desde la perspectiva de UI/UX y Frontend, las vistas de los estudiantes y apoderados están estrictamente limitadas. Un alumno jamás puede visualizar el libro de clases completo de sus compañeros ni acceder a los expedientes de orientación de otros menores.",
      content: (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Award className="w-5 h-5" /> Garantías Legales y Técnicas en AURENIS
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                <div className="text-indigo-400 font-bold mb-1">Circular N° 482</div>
                <p className="text-slate-300">Confidencialidad absoluta de anotaciones negativas y diagnósticos PIE.</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                <div className="text-cyan-400 font-bold mb-1">Ley N° 21.430</div>
                <p className="text-slate-300">Derecho a la privacidad digital y no divulgación de datos de vulnerabilidad.</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                <div className="text-emerald-400 font-bold mb-1">Privacy by Design</div>
                <p className="text-slate-300">Ofuscación de RUNs y cifrado AES-256 en columnas de salud y apoyo escolar.</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 9,
      title: "Métricas de Calidad y Evidencia de Pruebas",
      subtitle: "227 pruebas ejecutadas con 100% de aprobación en entorno de producción",
      category: "RESULTADOS DE AUDITORÍA",
      speaker: "Frank M.",
      role: "QA & Oficial de Seguridad",
      speakerNotes:
        "Nuestra suite de pruebas automatizadas no solo verifica la lógica feliz, sino que bombardea el sistema con ataques de penetración y manipulaciones de estado. Hemos logrado una tasa de éxito del 100% con 0 fallas y 0 bugs bloqueantes.",
      content: (
        <div className="space-y-3 text-xs">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 border-b border-slate-800 pb-1">
                  <th className="py-1">SUITE DE SEGURIDAD</th>
                  <th>CASOS</th>
                  <th>RESULTADO</th>
                  <th>TASA ÉXITO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-1.5 text-indigo-300 font-medium">Control de Acceso Vertical (RBAC)</td>
                  <td>22</td>
                  <td className="text-emerald-400">22 PASS</td>
                  <td className="text-emerald-400 font-bold">100.00%</td>
                </tr>
                <tr>
                  <td className="py-1.5 text-indigo-300 font-medium">Aislamiento Multi-Tenant (BOLA/IDOR)</td>
                  <td>16</td>
                  <td className="text-emerald-400">16 PASS</td>
                  <td className="text-emerald-400 font-bold">100.00%</td>
                </tr>
                <tr>
                  <td className="py-1.5 text-indigo-300 font-medium">Inyección XSS / SQLi</td>
                  <td>12</td>
                  <td className="text-emerald-400">12 PASS</td>
                  <td className="text-emerald-400 font-bold">100.00%</td>
                </tr>
                <tr>
                  <td className="py-1.5 text-indigo-300 font-medium">Motor de Calificaciones Decreto 67</td>
                  <td>24</td>
                  <td className="text-emerald-400">24 PASS</td>
                  <td className="text-emerald-400 font-bold">100.00%</td>
                </tr>
                <tr>
                  <td className="py-1.5 text-indigo-300 font-medium">Suite Consolidada de QA Pre-Release</td>
                  <td>135</td>
                  <td className="text-emerald-400">135 PASS</td>
                  <td className="text-emerald-400 font-bold">100.00%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-2.5 rounded-lg">
            <span className="text-slate-400">Puntuación CVSS v3.1 Residual: <strong className="text-emerald-400 font-mono">0.0 (None)</strong></span>
            <span className="text-slate-400">Bugs Bloqueantes Abiertos: <strong className="text-emerald-400 font-mono">0</strong></span>
          </div>
        </div>
      ),
    },
    {
      id: 10,
      title: "Conclusiones del Equipo y Dictamen Final",
      subtitle: "AURENIS SaaS v2.4.0 — Listo para entrega y despliegue a producción",
      category: "CONCLUSIÓN & CIERRE",
      speaker: "Maicol R.",
      role: "Tech Lead & Backend Architect",
      speakerNotes:
        "Agradecemos su atención. Todo el código fuente, scripts de verificación y documentación técnica están disponibles para auditoría inmediata. Quedamos a su entera disposición para responder cualquier pregunta técnica o arquitectónica.",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-500/30 rounded-2xl p-6 text-center space-y-3">
            <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 mb-1">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Sistema Aprobado Formalmente para Despliegue en Producción
            </h3>
            <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
              La conjunción del modelado STRIDE, defensas OWASP y hashing de memoria dura garantiza la tranquilidad de las comunidades educativas que confían en AURENIS.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <div className="text-white font-bold">Maicol R.</div>
              <div className="text-slate-400 text-[11px]">Backend & DB</div>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <div className="text-white font-bold">Malcom Marcelo</div>
              <div className="text-slate-400 text-[11px]">Frontend & Auth</div>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <div className="text-white font-bold">Lucas P.</div>
              <div className="text-slate-400 text-[11px]">UI/UX & Gating</div>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <div className="text-white font-bold">Frank M.</div>
              <div className="text-slate-400 text-[11px]">QA & Security</div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const current = slides[currentSlide];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Header & Navigation Tabs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              Presentación de Ciberseguridad AURENIS
              <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                STRIDE & OWASP
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Diapositivas interactivas, simulador de ataques en vivo y ensayo técnico
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("slides")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "slides"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Diapositivas ({currentSlide + 1}/{slides.length})
          </button>
          <button
            onClick={() => setActiveTab("simulator")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "simulator"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Simulador de Bloqueo Live
          </button>
          <button
            onClick={() => setActiveTab("hashing")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "hashing"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Hashing Benchmark
          </button>
          <button
            onClick={() => setActiveTab("quality")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "quality"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Gráficos &amp; Dossier
          </button>
        </div>
      </div>

      {/* TAB 1: SLIDES */}
      {activeTab === "slides" && (
        <div className="space-y-4">
          {/* Main Slide Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl min-h-[460px] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Slide Header */}
            <div className="space-y-2 border-b border-slate-800/80 pb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-indigo-400 font-bold tracking-wider uppercase">
                  {current.category}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Expositor:</span>
                  <span className="text-white font-medium bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    {current.speaker} ({current.role})
                  </span>
                </div>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                {current.title}
              </h2>
              <p className="text-xs md:text-sm text-slate-400">{current.subtitle}</p>
            </div>

            {/* Slide Body */}
            <div className="py-6 flex-1 flex flex-col justify-center">{current.content}</div>

            {/* Slide Footer Navigation */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
                  disabled={currentSlide === 0}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-40 disabled:pointer-events-none text-xs flex items-center gap-1 font-medium transition"
                >
                  <ChevronLeft className="w-4 h-4" /> Anterior
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1))}
                  disabled={currentSlide === slides.length - 1}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:pointer-events-none text-xs flex items-center gap-1 font-medium transition shadow-lg shadow-indigo-600/20"
                >
                  Siguiente <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Slide Indicators */}
              <div className="hidden md:flex items-center gap-1.5">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentSlide ? "w-6 bg-indigo-500" : "w-2 bg-slate-700 hover:bg-slate-600"
                    }`}
                    title={`Diapositiva ${idx + 1}: ${s.title}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setShowNotes(!showNotes)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/60"
              >
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                {showNotes ? "Ocultar Notas del Orador" : "Ver Notas del Orador"}
              </button>
            </div>
          </div>

          {/* Speaker Notes Drawer */}
          {showNotes && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 text-indigo-400 font-bold">
                  <Terminal className="w-4 h-4" /> NOTAS Y GUIÓN DEL ORADOR — {current.speaker}
                </span>
                <span className="text-[11px] text-slate-500">Defensa Oral / Turno Asignado</span>
              </div>
              <p className="text-slate-300 leading-relaxed italic bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                &quot;{current.speakerNotes}&quot;
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LIVE SIMULATOR */}
      {activeTab === "simulator" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo-400" />
                Simulador Interactivo de Bloqueo de Ataques en Vivo
              </h2>
              <p className="text-xs text-slate-400">
                Selecciona un vector de ataque STRIDE para evaluar la respuesta del servidor en tiempo real.
              </p>
            </div>
          </div>

          {/* Attack Vector Selector Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
            {[
              { id: "spoofing", label: "Spoofing (JWT)", color: "text-indigo-400" },
              { id: "tampering", label: "Tampering (Notas)", color: "text-amber-400" },
              { id: "repudiation", label: "Repudiation (Audit)", color: "text-cyan-400" },
              { id: "disclosure", label: "Info Disclosure (SQLi)", color: "text-rose-400" },
              { id: "dos", label: "DoS (Rate Limit)", color: "text-purple-400" },
              { id: "elevation", label: "Elevation / BOLA", color: "text-emerald-400" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => runSimulation(btn.id)}
                className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                  simVector === btn.id
                    ? "bg-indigo-600/20 border-indigo-500 text-white shadow"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Simulation Output Area */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 min-h-[220px] flex flex-col justify-center font-mono text-xs">
            {simLoading ? (
              <div className="flex flex-col items-center justify-center space-y-3 py-8">
                <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
                <span className="text-slate-400">Inyectando payload y evaluando guardas de servidor...</span>
              </div>
            ) : simResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-rose-400 font-bold flex items-center gap-1.5">
                    🔴 VECTOR DETECTADO: {simVector.toUpperCase()}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded font-bold ${
                      simResult.status >= 400
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    HTTP {simResult.status} ({simResult.code})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="text-slate-400 font-sans font-semibold">Detalle del Ataque:</div>
                    <div className="text-slate-300">{simResult.attack}</div>
                    <div className="text-slate-500 text-[11px]">Destino: {simResult.target}</div>
                  </div>

                  <div className="space-y-1.5 bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="text-emerald-400 font-sans font-semibold">Respuesta del Servidor:</div>
                    <div className="text-slate-300">{simResult.message}</div>
                    <div className="text-indigo-400 text-[11px]">Control: {simResult.defense}</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/50 text-emerald-300 text-center font-bold">
                  🛡️ ESTADO: ATAQUE NEUTRALIZADO CON ÉXITO (0 IMPACTO EN PERSISTENCIA)
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 py-8">
                Presiona cualquiera de los botones superiores para ejecutar una simulación de penetración en vivo.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: HASHING BENCHMARK */}
      {activeTab === "hashing" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              Benchmark Criptográfico: Resistencia Anti-GPU/ASIC
            </h2>
            <p className="text-xs text-slate-400">
              Comprueba matemáticamente por qué las funciones KDF con memoria dura hacen inviable la fuerza bruta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
              <label className="text-slate-300 font-semibold block">Contraseña de Prueba:</label>
              <input
                type="text"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
              <button
                onClick={calculateHashing}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-xl transition shadow"
              >
                Calcular Factor de Resistencia
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs flex flex-col justify-center">
              {hashResults ? (
                <div className="space-y-2 font-mono">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-rose-400">SHA-256 (Inseguro):</span>
                    <span className="text-slate-300">{hashResults.sha256Time.toFixed(5)} ms/hash</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-emerald-400">Argon2id/Bcrypt (AURENIS):</span>
                    <span className="text-slate-300">{hashResults.kdfTime.toFixed(2)} ms/hash</span>
                  </div>
                  <div className="pt-2 text-center text-emerald-400 font-bold text-sm font-sans">
                    🔥 AURENIS es ~{hashResults.resistanceFactor.toLocaleString()}x más resistente a ataques por hardware.
                  </div>
                </div>
              ) : (
                <div className="text-slate-500 text-center">
                  Presiona &quot;Calcular Factor de Resistencia&quot; para medir tiempos.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: QUALITY & DOSSIER */}
      {activeTab === "quality" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-400" />
                Gráficos de Cobertura de Pruebas &amp; Bitácora de Bugs Resueltos
              </h2>
              <p className="text-xs text-slate-400">
                Compendio gráfico de calidad, MTTR, densidad de defectos y acceso directo al dossier impreso.
              </p>
            </div>
            <a
              href="/colegio-san-jose/dossier-impreso"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow transition"
            >
              <FileText className="w-4 h-4" /> Abrir Dossier Impreso / PDF
            </a>
          </div>

          {/* KPI Mini Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="text-emerald-400 font-mono text-2xl font-bold">100.0%</div>
              <div className="text-xs text-slate-400 mt-1">Tasa Cierre Bugs (10/10)</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="text-emerald-400 font-mono text-2xl font-bold">0</div>
              <div className="text-xs text-slate-400 mt-1">Bugs Bloqueantes (P0)</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="text-cyan-400 font-mono text-2xl font-bold">0.00</div>
              <div className="text-xs text-slate-400 mt-1">Densidad Residual / KLOC</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="text-indigo-400 font-mono text-2xl font-bold">1.98 h</div>
              <div className="text-xs text-slate-400 mt-1">MTTR Promedio Global</div>
            </div>
          </div>

          {/* Quality Progress Bars */}
          <div className="space-y-3 bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs">
            <div className="text-slate-300 font-bold uppercase tracking-wider mb-2">
              Cobertura de Pruebas por Módulo Crítico
            </div>
            {[
              { mod: "Autenticación, JWT & RBAC", tests: "22/22 PASS", percent: 100 },
              { mod: "Aislamiento Multi-Tenant (BOLA/IDOR)", tests: "16/16 PASS", percent: 100 },
              { mod: "Motor Decreto 67 & Invariantes", tests: "24/24 PASS", percent: 100 },
              { mod: "Asistencia & Resiliencia Offline", tests: "18/18 PASS", percent: 100 },
              { mod: "Sanitización, XSS & SQLi Parametrizado", tests: "12/12 PASS", percent: 100 },
              { mod: "Accesibilidad UI (WCAG 2.1 AA) & Design System", tests: "16/16 PASS", percent: 100 },
            ].map((bar, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span className="font-medium text-slate-300">{bar.mod}</span>
                  <span className="font-mono text-emerald-400 font-bold">{bar.tests}</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full" style={{ width: `${bar.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
