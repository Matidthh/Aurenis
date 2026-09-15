import React from "react";

export interface DesignToken {
  name: string;
  value: string;
  category: "color" | "typography" | "spacing" | "radius" | "shadow";
  description: string;
}

export const DESIGN_TOKENS = {
  colors: [
    { name: "Brand Primary (Blue 600)", value: "#2563EB", hex: "#2563EB", contrast: "4.8:1 on white", use: "Acciones principales, estados activos, KPI destacados" },
    { name: "Brand Dark (Blue 900)", value: "#1E3A8A", hex: "#1E3A8A", contrast: "12.1:1 on white", use: "Títulos de alto contraste, headers de tarjetas" },
    { name: "Success Green (Emerald 600)", value: "#059669", hex: "#059669", contrast: "4.6:1 on white", use: "Asistencia aprobatoria (>90%), metas cumplidas, notas >= 5.5" },
    { name: "Warning Amber (Amber 500)", value: "#F59E0B", hex: "#F59E0B", contrast: "3.2:1 (con fondo oscuro)", use: "Atención preventiva, asistencia 85-89%, notas 4.0-4.9" },
    { name: "Danger Red (Rose 600)", value: "#E11D48", hex: "#E11D48", contrast: "4.9:1 on white", use: "Riesgo de deserción, ausentismo crítico (<85%), notas < 4.0" },
    { name: "Neutral Slate 900", value: "#0F172A", hex: "#0F172A", contrast: "16.8:1 on white", use: "Texto primario, números de KPIs de alto impacto" },
    { name: "Neutral Slate 500", value: "#64748B", hex: "#64748B", contrast: "4.7:1 on white", use: "Subtítulos, etiquetas secundarias, metadatos" },
    { name: "Surface Background", value: "#F8FAFC", hex: "#F8FAFC", contrast: "Base", use: "Canvas principal de baja fatiga visual (neutral frío <3% sat)" },
    { name: "Card Surface Light", value: "#FFFFFF", hex: "#FFFFFF", contrast: "Base", use: "Contenedores de tarjetas elevadas" },
  ],
  typography: [
    { level: "Display KPI Value", size: "32px / 2.0rem", weight: "800 ExtraBold", tracking: "-0.03em", line: "1.2", use: "Cifras numéricas principales de tarjetas de métrica" },
    { level: "Section Heading (H2)", size: "20px / 1.25rem", weight: "700 Bold", tracking: "-0.02em", line: "1.3", use: "Títulos de módulos y bloques analíticos" },
    { level: "Card Header (H3)", size: "15px / 0.9375rem", weight: "600 SemiBold", tracking: "-0.01em", line: "1.4", use: "Encabezados de tablas y subsecciones" },
    { level: "Body Text", size: "14px / 0.875rem", weight: "400 Regular / 500 Medium", tracking: "0em", line: "1.5", use: "Contenido informativo y listas de datos" },
    { level: "Micro Label / Badge", size: "11px / 0.6875rem", weight: "700 Bold", tracking: "0.05em (Uppercase)", line: "1.1", use: "Pills de estado, chips de tendencia, tags" },
  ],
  spacing: [
    { name: "Micro", value: "4px (0.25rem)", use: "Gap entre icono y texto dentro de badges" },
    { name: "Tight", value: "8px (0.5rem)", use: "Separación interna entre etiqueta y valor KPI" },
    { name: "Compact", value: "12px (0.75rem)", use: "Padding interno de listas y filas de tablas" },
    { name: "Comfortable", value: "16px - 20px", use: "Padding perimetral de tarjetas de resumen" },
    { name: "Section Gap", value: "24px - 32px", use: "Separación entre macro-secciones del dashboard" },
  ],
  cognitiveRules: [
    "Ley de Miller (7±2): Máximo 4-5 tarjetas de métrica primaria visibles simultáneamente en el primer viewport.",
    "Jerarquía Z-Pattern: El ojo escanea primero el estado global superior, luego tendencias comparativas, y finalmente listas de acción.",
    "Semántica de Color Consistente: Verde siempre = Aprobado/Meta, Amarillo = Preventivo, Rojo = Acción requerida.",
    "Micro-tendencias contextualizadas: Cada métrica incluye su delta temporal (+2.4% vs mes anterior) para evitar números aislados sin significado.",
    "Zero-Friction Actions: Botones de acción directa al lado de cada alerta crítica (ej. 'Citar Apoderado', 'Ver Ficha').",
  ]
};

export interface MockupComment {
  id: string;
  author: string;
  role: string;
  avatar: string;
  time: string;
  target: string;
  text: string;
  resolved?: boolean;
}

export const INITIAL_COMMENTS: MockupComment[] = [
  {
    id: "c1",
    author: "Elena Vasquez",
    role: "UX Lead",
    avatar: "EV",
    time: "Hace 15 min",
    target: "Tarjetas de KPI Ejecutivo",
    text: "Excelente balance: 4 tarjetas clave (Matrícula, Asistencia, Promedio y Planificación) evitan la sobrecarga cognitiva que tenían las 12 tarjetas de la versión anterior.",
    resolved: true,
  },
  {
    id: "c2",
    author: "Rodrigo Morales",
    role: "Director de Colegio",
    avatar: "RM",
    time: "Hace 45 min",
    target: "Panel de Alerta Temprana",
    text: "El umbral de asistencia del 85% para alerta roja está perfectamente alineado con la normativa de promoción y subvención MINEDUC.",
    resolved: true,
  },
  {
    id: "c3",
    author: "Camila Henríquez",
    role: "Docente Jefa de UTP",
    avatar: "CH",
    time: "Hace 2 horas",
    target: "Pase de Lista en 1-Clic Docente",
    text: "El modal de pase de lista rápido reduce el tiempo de registro en aula de 5 minutos a menos de 45 segundos por clase.",
    resolved: true,
  },
];
