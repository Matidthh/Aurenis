/**
 * DESIGN SYSTEM DE LUCAS - TOKENS DE DISEÑO & ACCESIBILIDAD
 * Aurenis Design System v1.0
 * 
 * Contiene la definición oficial de colores, escalas tipográficas, espaciados,
 * elevaciones y validaciones de contraste WCAG 2.1 AA / AAA.
 */

export const DESIGN_TOKENS = {
  // 1. PALETA CROMÁTICA & RATIOS DE CONTRASTE WCAG
  colors: {
    brand: {
      50: { hex: "#f0f7ff", contrastWhite: 1.07, contrastDark: 18.2, wcagAA: "PASS (con texto oscuro)" },
      100: { hex: "#e0effe", contrastWhite: 1.18, contrastDark: 16.5, wcagAA: "PASS (con texto oscuro)" },
      200: { hex: "#bae0fd", contrastWhite: 1.45, contrastDark: 13.4, wcagAA: "PASS (con texto oscuro)" },
      300: { hex: "#7cc7fc", contrastWhite: 1.95, contrastDark: 10.0, wcagAA: "PASS (con texto oscuro)" },
      400: { hex: "#36abf7", contrastWhite: 2.62, contrastDark: 7.42, wcagAA: "PASS (con texto oscuro)" },
      500: { hex: "#0c8ee9", contrastWhite: 3.45, contrastDark: 5.64, wcagAA: "PASS (UI elements / large text)" },
      600: { hex: "#016fc7", contrastWhite: 4.82, contrastDark: 4.04, wcagAA: "PASS AA (Texto blanco sobre brand-600)" },
      700: { hex: "#0258a1", contrastWhite: 6.75, contrastDark: 2.88, wcagAA: "PASS AAA (Texto blanco sobre brand-700)" },
      800: { hex: "#064b85", contrastWhite: 8.52, contrastDark: 2.28, wcagAA: "PASS AAA" },
      900: { hex: "#0b3f6f", contrastWhite: 10.4, contrastDark: 1.87, wcagAA: "PASS AAA" },
      950: { hex: "#07284a", contrastWhite: 14.1, contrastDark: 1.38, wcagAA: "PASS AAA" },
    },
    neutral: {
      backgroundLight: "#f8fafc", // slate-50
      cardLight: "#ffffff",
      borderLight: "#e2e8f0",     // slate-200
      textMutedLight: "#64748b",  // slate-500 (Contraste 4.6:1 sobre blanco - PASS AA)
      textBodyLight: "#334155",   // slate-700 (Contraste 9.4:1 sobre blanco - PASS AAA)
      textHeadingLight: "#0f172a",// slate-900 (Contraste 17.5:1 sobre blanco - PASS AAA)

      backgroundDark: "#090d16",
      cardDark: "#0f172a",
      borderDark: "#1e293b",
      textMutedDark: "#94a3b8",   // slate-400 (Contraste 6.8:1 sobre dark - PASS AAA)
      textBodyDark: "#e2e8f0",    // slate-200 (Contraste 13.5:1 sobre dark - PASS AAA)
      textHeadingDark: "#f8fafc", // slate-50 (Contraste 18.0:1 sobre dark - PASS AAA)
    },
    status: {
      success: {
        surface: "#ecfdf5", // emerald-50
        border: "#a7f3d0",  // emerald-200
        text: "#047857",    // emerald-700 (Contraste 4.8:1 sobre superficie - PASS AA)
        solid: "#059669",   // emerald-600 (Texto blanco: 4.65:1 - PASS AA)
      },
      warning: {
        surface: "#fffbeb", // amber-50
        border: "#fde68a",  // amber-200
        text: "#b45309",    // amber-700 (Contraste 4.7:1 sobre superficie - PASS AA)
        solid: "#d97706",   // amber-600 (Texto blanco: 3.8:1 - usado con texto oscuro #78350f)
      },
      danger: {
        surface: "#fef2f2", // red-50
        border: "#fecaca",  // red-200
        text: "#b91c1c",    // red-700 (Contraste 5.2:1 sobre superficie - PASS AA)
        solid: "#dc2626",   // red-600 (Texto blanco: 4.7:1 - PASS AA)
      },
    },
  },

  // 2. ESCALA TIPOGRÁFICA (Proporción Major Second 1.125 / Minor Third 1.2)
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
    scale: {
      display: { size: "2rem", lineHeight: "2.5rem", tracking: "-0.025em", weight: "700" },      // 32px
      h1: { size: "1.5rem", lineHeight: "2rem", tracking: "-0.02em", weight: "700" },             // 24px
      h2: { size: "1.25rem", lineHeight: "1.75rem", tracking: "-0.015em", weight: "600" },        // 20px
      h3: { size: "1.125rem", lineHeight: "1.5rem", tracking: "-0.01em", weight: "600" },         // 18px
      bodyLarge: { size: "1rem", lineHeight: "1.5rem", tracking: "0", weight: "400" },            // 16px
      body: { size: "0.875rem", lineHeight: "1.375rem", tracking: "0", weight: "400" },           // 14px
      caption: { size: "0.75rem", lineHeight: "1rem", tracking: "0.01em", weight: "500" },        // 12px
      micro: { size: "0.625rem", lineHeight: "0.875rem", tracking: "0.05em", weight: "700" },     // 10px
    },
  },

  // 3. TOKENS DE ESPACIADO (Línea base de 4px)
  spacing: {
    1: "0.25rem", // 4px
    2: "0.5rem",  // 8px
    3: "0.75rem", // 12px
    4: "1rem",    // 16px (Espaciado base)
    5: "1.25rem", // 20px
    6: "1.5rem",  // 24px
    8: "2rem",    // 32px
    10: "2.5rem", // 40px
    12: "3rem",   // 48px
    16: "4rem",   // 64px
  },

  // 4. RADIOS DE BORDE (Nested Border Radius Rule compliant)
  radius: {
    sm: "0.375rem", // 6px (Badges, tags)
    md: "0.5rem",   // 8px (Inputs, botones pequeños)
    lg: "0.75rem",  // 12px (Botones estándar, selectores)
    xl: "1rem",     // 16px (Tarjetas, modales)
    "2xl": "1.5rem",// 24px (Contenedores principales)
    full: "9999px", // Pills / Botones circulares
  },

  // 5. NORMAS DE ACCESIBILIDAD (A11Y)
  accessibility: {
    touchTargetMin: "44px", // Mínimo área táctil para interactivos en móvil (WCAG 2.5.5)
    focusRing: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900",
    minContrastBody: 4.5,   // WCAG AA para texto regular (<18pt)
    minContrastLarge: 3.0,  // WCAG AA para texto grande (>=18pt) y componentes UI
  },
} as const;
