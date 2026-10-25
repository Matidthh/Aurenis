"use client";

import React from "react";
import { motion } from "motion/react";

/**
 * ============================================================================
 * ILUSTRACIÓN 3D ISOMÉTRICA DE GRADUACIÓN Y LIBROS — AURENIS
 * ============================================================================
 * Equipo Responsable:
 * - 🎨 Lucas P. (Diseño UI/UX, Arte Vectorial SVG con Sombras Suaves y Gradientes)
 * - 💻 Malcom Marcelo (Micro-interacción, Animación Flotante Motion, Rendimiento)
 * ============================================================================
 */
export function GraduationHeroIllustration({ className = "w-64 h-48" }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`relative select-none pointer-events-none flex items-center justify-center shrink-0 ${className}`}
    >
      {/* Resplandor suave de fondo */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-blue-300/25 via-sky-200/20 to-indigo-300/20 rounded-full blur-2xl" />

      {/* Partículas y Hojas Flotantes Animadas */}
      <motion.div
        animate={{ y: [-4, 4, -4], rotate: [-2, 2, -2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="w-full h-full relative"
      >
        <svg
          viewBox="0 0 320 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          <defs>
            {/* Sombras y Filtros */}
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Gradientes del Birrete (Gorra de Graduación) */}
            <linearGradient id="capTopGrad" x1="160" y1="40" x2="240" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1e293b" />
              <stop offset="0.6" stopColor="#0f172a" />
              <stop offset="1" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="capRimGrad" x1="120" y1="95" x2="200" y2="135" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0f172a" />
              <stop offset="1" stopColor="#1e3a8a" />
            </linearGradient>

            {/* Borla Dorada */}
            <linearGradient id="tasselGrad" x1="170" y1="70" x2="225" y2="140" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fbbf24" />
              <stop offset="0.7" stopColor="#f59e0b" />
              <stop offset="1" stopColor="#d97706" />
            </linearGradient>

            {/* Libro Superior (Celeste / Azul) */}
            <linearGradient id="topBookCover" x1="70" y1="130" x2="250" y2="175" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38bdf8" />
              <stop offset="0.7" stopColor="#0284c7" />
              <stop offset="1" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id="topBookPages" x1="85" y1="145" x2="235" y2="185" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" />
              <stop offset="1" stopColor="#f1f5f9" />
            </linearGradient>

            {/* Libro Inferior (Naranja / Coral y Azul Marino) */}
            <linearGradient id="bottomBookCover" x1="50" y1="175" x2="230" y2="215" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fb923c" />
              <stop offset="1" stopColor="#ea580c" />
            </linearGradient>
            <linearGradient id="bottomBookSpine" x1="50" y1="180" x2="70" y2="215" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1d4ed8" />
              <stop offset="1" stopColor="#1e3a8a" />
            </linearGradient>

            {/* Partículas flotantes */}
            <linearGradient id="petalGrad1" x1="40" y1="70" x2="65" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#93c5fd" stopOpacity="0.8" />
              <stop offset="1" stopColor="#3b82f6" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="petalGrad2" x1="260" y1="60" x2="290" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#60a5fa" stopOpacity="0.8" />
              <stop offset="1" stopColor="#2563eb" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Sombra base sobre la superficie */}
          <ellipse cx="160" cy="216" rx="95" ry="14" fill="#94a3b8" fillOpacity="0.25" />

          {/* ======================================================== */}
          {/* 1. LIBRO INFERIOR (CUBIERTA NARANJA / LOMO AZUL) */}
          {/* ======================================================== */}
          <g id="bottom-book">
            {/* Páginas */}
            <path
              d="M 68 188 L 228 178 L 246 194 L 86 206 Z"
              fill="#e2e8f0"
              stroke="#cbd5e1"
              strokeWidth="0.5"
            />
            {/* Cubierta inferior */}
            <path
              d="M 65 204 L 84 218 L 245 204 L 230 192 Z"
              fill="url(#bottomBookCover)"
            />
            {/* Lomo izquierdo azul marino */}
            <path
              d="M 50 192 C 50 188 56 182 66 182 L 86 195 L 84 218 L 65 205 C 55 205 50 199 50 192 Z"
              fill="url(#bottomBookSpine)"
            />
          </g>

          {/* ======================================================== */}
          {/* 2. LIBRO SUPERIOR (CELESTE / BLANCO) */}
          {/* ======================================================== */}
          <g id="top-book">
            {/* Sombra del libro superior sobre el inferior */}
            <path
              d="M 78 175 L 220 162 L 236 178 L 94 192 Z"
              fill="#0f172a"
              fillOpacity="0.12"
            />
            {/* Páginas blancas */}
            <path
              d="M 80 156 L 226 142 L 244 160 L 98 174 Z"
              fill="url(#topBookPages)"
              stroke="#cbd5e1"
              strokeWidth="0.5"
            />
            {/* Líneas de textura de páginas */}
            <line x1="228" y1="147" x2="242" y2="162" stroke="#94a3b8" strokeWidth="0.8" opacity="0.6" />
            <line x1="229" y1="152" x2="243" y2="167" stroke="#94a3b8" strokeWidth="0.8" opacity="0.6" />

            {/* Cubierta celeste */}
            <path
              d="M 66 148 L 216 134 L 235 152 L 84 166 Z"
              fill="url(#topBookCover)"
            />
            {/* Lomo celeste curvado */}
            <path
              d="M 66 148 C 60 152 60 164 66 168 L 84 166 L 84 146 Z"
              fill="#0284c7"
            />
          </g>

          {/* ======================================================== */}
          {/* 3. BIRRETE DE GRADUACIÓN EN 3D (MORTARBOARD) */}
          {/* ======================================================== */}
          <g id="mortarboard">
            {/* Sombra del birrete sobre los libros */}
            <ellipse cx="166" cy="142" rx="48" ry="14" fill="#0f172a" fillOpacity="0.18" />

            {/* Casquete o base circular del birrete */}
            <path
              d="M 132 100 C 132 118 190 126 200 110 C 205 102 196 90 166 85 C 144 82 132 90 132 100 Z"
              fill="url(#capRimGrad)"
            />

            {/* Rombo superior del birrete (Perspectiva isométrica) */}
            <path
              d="M 166 46 L 248 84 L 166 122 L 84 84 Z"
              fill="url(#capTopGrad)"
              stroke="#38bdf8"
              strokeWidth="0.8"
              strokeOpacity="0.4"
            />

            {/* Botón central del birrete */}
            <ellipse cx="166" cy="84" rx="5.5" ry="3.5" fill="#f59e0b" />

            {/* Cinta de la borla dorada colgando hacia la derecha */}
            <path
              d="M 166 84 C 182 86 210 100 216 116 L 222 134"
              stroke="url(#tasselGrad)"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Mechón/flecos de la borla */}
            <path
              d="M 218 132 L 228 152 C 228 155 224 156 220 155 L 214 136 Z"
              fill="#fbbf24"
            />
            <circle cx="218" cy="134" r="3" fill="#d97706" />
          </g>

          {/* ======================================================== */}
          {/* 4. PARTÍCULAS Y PÉTALOS FLOTANTES EN EL AIRE */}
          {/* ======================================================== */}
          {/* Pétalo flotante superior izquierdo */}
          <path
            d="M 46 82 C 40 70 52 64 60 72 C 68 80 54 94 46 82 Z"
            fill="url(#petalGrad1)"
          />
          {/* Pétalo flotante superior derecho */}
          <path
            d="M 270 66 C 262 56 274 48 282 56 C 290 64 278 76 270 66 Z"
            fill="url(#petalGrad2)"
          />
          {/* Destello de estrella flotante */}
          <path
            d="M 276 108 L 278 114 L 284 116 L 278 118 L 276 124 L 274 118 L 268 116 L 274 114 Z"
            fill="#38bdf8"
            fillOpacity="0.75"
          />
          <path
            d="M 72 118 L 73 122 L 77 123 L 73 124 L 72 128 L 71 124 L 67 123 L 71 122 Z"
            fill="#60a5fa"
            fillOpacity="0.6"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
