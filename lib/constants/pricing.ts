/**
 * AURENIS - Configuración Centralizada de Planes, Precios y Comparativa Comercial
 * Valores expresados en Pesos Chilenos (CLP).
 * Refleja exclusivamente funcionalidades reales y verificadas en el sistema.
 */

export interface PricingPlan {
  id: "start" | "professional" | "enterprise";
  name: string;
  tagline: string;
  badge?: string;
  priceMonthly: number | null;
  priceDisplay: string;
  pricePeriod: string;
  studentLimit: string;
  isPopular?: boolean;
  description: string;
  features: string[];
  ctaText: string;
  ctaType: "start" | "professional" | "enterprise";
}

export interface ImplementationService {
  title: string;
  priceDisplay: string;
  priceNote: string;
  description: string;
  items: string[];
  ctaText: string;
}

export interface ComparisonFeature {
  name: string;
  category: "Capacidad y Acceso" | "Gestión Académica" | "Dashboards y Portales" | "Seguridad y Soporte";
  start: string | boolean;
  professional: string | boolean;
  enterprise: string | boolean;
  tooltip?: string;
}

export const AURENIS_PLANS: PricingPlan[] = [
  {
    id: "start",
    name: "Aurenis Start",
    tagline: "Gestión académica esencial para instituciones pequeñas.",
    priceMonthly: 149990,
    priceDisplay: "$149.990",
    pricePeriod: "CLP / mes",
    studentLimit: "Hasta 150 estudiantes",
    isPopular: false,
    description: "Diseñado para colegios y centros educativos que requieren digitalizar su libro de clases, asistencia y registro de calificaciones de forma segura.",
    features: [
      "Hasta 150 estudiantes matriculados",
      "Libro de Clases Digital y Registro de Asistencia",
      "Registro de Calificaciones (Escala 1.0 a 7.0 con notas simples)",
      "Dashboard Académico para Estudiantes y Docentes",
      "Fichas de Estudiantes y Certificados de Alumno Regular",
      "Control de Acceso por Roles (RBAC esencial)",
      "Aislamiento Multi-Tenant y base de datos PostgreSQL",
      "Soporte técnico estándar por correo electrónico",
    ],
    ctaText: "Comenzar con Start",
    ctaType: "start",
  },
  {
    id: "professional",
    name: "Aurenis Professional",
    tagline: "Gestión académica integral para instituciones en crecimiento.",
    badge: "Recomendado",
    priceMonthly: 299990,
    priceDisplay: "$299.990",
    pricePeriod: "CLP / mes",
    studentLimit: "Hasta 500 estudiantes",
    isPopular: true,
    description: "La solución completa para establecimientos que necesitan cálculo ponderado, gestión alineada al Decreto 67 y Sistema de Alerta Temprana.",
    features: [
      "Hasta 500 estudiantes matriculados",
      "Todo lo incluido en el plan Aurenis Start",
      "Sistema de Alerta Temprana (SAT) con detección de riesgo",
      "Matriz de Calificaciones con Promedio Ponderado personalizable",
      "Gestión académica y criterios acordes al Decreto 67",
      "Dashboards diferenciados (Estudiante, Docente, Apoderado y Dirección)",
      "Gestión avanzada de usuarios, cursos y asignaturas",
      "Monitoreo de asistencia crítica y reportes institucionales",
      "Soporte técnico directo y prioritario",
    ],
    ctaText: "Solicitar Professional",
    ctaType: "professional",
  },
  {
    id: "enterprise",
    name: "Aurenis Enterprise",
    tagline: "Una implementación adaptada a las necesidades de su institución.",
    badge: "Institucional",
    priceMonthly: 499990,
    priceDisplay: "Desde $499.990",
    pricePeriod: "CLP / mes",
    studentLimit: "Más de 500 estudiantes",
    isPopular: false,
    description: "Orientado a instituciones de alta matrícula o con requerimientos operacionales particulares que demandan acompañamiento dedicado.",
    features: [
      "Capacidad extendida (más de 500 estudiantes)",
      "Todo lo disponible en Aurenis Professional",
      "Configuración personalizada de parámetros y roles escolares",
      "Acompañamiento y soporte técnico prioritario dedicado",
      "Auditoría y trazabilidad integral de operaciones académicas",
      "Adaptaciones y funcionalidades según requerimientos de la institución (Mediante cotización)",
      "Facturación institucional y documentación para rendición de fondos",
    ],
    ctaText: "Contactar Ventas",
    ctaType: "enterprise",
  },
];

export const INITIAL_IMPLEMENTATION_SERVICE: ImplementationService = {
  title: "Implementación Inicial y Puesta en Marcha",
  priceDisplay: "Desde $500.000",
  priceNote: "CLP · Pago único por establecimiento",
  description: "Servicio opcional de acompañamiento técnico para asegurar una transición fluida y sin fricción operativa en su comunidad escolar.",
  items: [
    "Configuración inicial de la institución y parámetros académicos",
    "Carga y validación de nóminas de estudiantes, cursos y personal docente",
    "Configuración de asignaturas, ponderaciones y períodos del establecimiento",
    "Preparación del entorno institucional y validación de accesos seguros",
    "Sesión de inducción técnica y puesta en marcha para el equipo directivo y UTP",
  ],
  ctaText: "Solicitar Implementación",
};

export const COMPARISON_FEATURES: ComparisonFeature[] = [
  // Capacidad y Acceso
  {
    category: "Capacidad y Acceso",
    name: "Límite de Estudiantes Matriculados",
    start: "Hasta 150",
    professional: "Hasta 500",
    enterprise: "Personalizado (> 500)",
  },
  {
    category: "Capacidad y Acceso",
    name: "Cursos y Asignaturas Ilimitadas",
    start: true,
    professional: true,
    enterprise: true,
  },
  {
    category: "Capacidad y Acceso",
    name: "Aislamiento Institucional Multi-Tenant",
    start: true,
    professional: true,
    enterprise: true,
  },

  // Gestión Académica
  {
    category: "Gestión Académica",
    name: "Registro de Asistencia y Reporte Mensual",
    start: true,
    professional: true,
    enterprise: true,
  },
  {
    category: "Gestión Académica",
    name: "Calificaciones con Promedio Simple",
    start: true,
    professional: true,
    enterprise: true,
  },
  {
    category: "Gestión Académica",
    name: "Calificaciones con Ponderación Personalizada",
    start: false,
    professional: true,
    enterprise: true,
  },
  {
    category: "Gestión Académica",
    name: "Sistema de Alerta Temprana (SAT) y Riesgo Académico",
    start: false,
    professional: true,
    enterprise: true,
  },
  {
    category: "Gestión Académica",
    name: "Criterios y Lineamientos Decreto 67",
    start: "Básico",
    professional: "Avanzado",
    enterprise: "Integral",
  },
  {
    category: "Gestión Académica",
    name: "Ficha Integral del Estudiante y Certificados",
    start: true,
    professional: true,
    enterprise: true,
  },

  // Dashboards y Portales
  {
    category: "Dashboards y Portales",
    name: "Portal y Dashboard para Estudiantes",
    start: true,
    professional: true,
    enterprise: true,
  },
  {
    category: "Dashboards y Portales",
    name: "Portal y Dashboard para Profesores / Docentes",
    start: true,
    professional: true,
    enterprise: true,
  },
  {
    category: "Dashboards y Portales",
    name: "Portal y Dashboard para Apoderados",
    start: "Básico",
    professional: true,
    enterprise: true,
  },
  {
    category: "Dashboards y Portales",
    name: "Dashboard Directivo y Unidad Técnico-Pedagógica (UTP)",
    start: "Básico",
    professional: true,
    enterprise: true,
  },

  // Seguridad y Soporte
  {
    category: "Seguridad y Soporte",
    name: "Control de Acceso Basado en Roles (RBAC)",
    start: "Roles Estándar",
    professional: "Matriz Completa",
    enterprise: "Personalizado",
  },
  {
    category: "Seguridad y Soporte",
    name: "Base de Datos Relacional PostgreSQL + Prisma",
    start: true,
    professional: true,
    enterprise: true,
  },
  {
    category: "Seguridad y Soporte",
    name: "Nivel de Soporte Técnico",
    start: "Estándar por correo",
    professional: "Directo y prioritario",
    enterprise: "Canal preferencial dedicado",
  },
  {
    category: "Seguridad y Soporte",
    name: "Implementación Inicial y Puesta en Marcha",
    start: "Disponible (Desde $500.000)",
    professional: "Acompañamiento guiado",
    enterprise: "Acompañamiento institucional",
  },
];
