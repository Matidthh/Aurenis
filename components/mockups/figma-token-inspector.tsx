"use client";

import React, { useState } from "react";
import { X, Sliders, Check, Copy, Palette, Type, Layout, ShieldCheck } from "lucide-react";
import { DESIGN_TOKENS } from "./mockup-data";

interface FigmaTokenInspectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FigmaTokenInspector({ isOpen, onClose }: FigmaTokenInspectorProps) {
  const [activeTab, setActiveTab] = useState<"colors" | "typography" | "spacing" | "rules">("colors");
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  if (!isOpen) return null;

  function handleCopy(hex: string) {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  }

  return (
    <aside className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-500" />
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Tokens de Diseño Figma
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 px-3 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("colors")}
          className={`py-2.5 px-2 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === "colors"
              ? "border-brand-600 text-brand-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Colores</span>
        </button>

        <button
          onClick={() => setActiveTab("typography")}
          className={`py-2.5 px-2 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === "typography"
              ? "border-brand-600 text-brand-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Tipografía</span>
        </button>

        <button
          onClick={() => setActiveTab("spacing")}
          className={`py-2.5 px-2 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === "spacing"
              ? "border-brand-600 text-brand-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span>Espaciado</span>
        </button>

        <button
          onClick={() => setActiveTab("rules")}
          className={`py-2.5 px-2 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === "rules"
              ? "border-brand-600 text-brand-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Carga Cognitiva</span>
        </button>
      </div>

      {/* Contenido */}
      <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
        {activeTab === "colors" && (
          <div className="space-y-3">
            {DESIGN_TOKENS.colors.map((c, i) => (
              <div
                key={i}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 hover:border-slate-300 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-md border border-slate-300 shadow-xs"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="font-bold text-slate-900 dark:text-white">{c.name}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(c.hex)}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 flex items-center gap-1 font-mono text-[10px]"
                    title="Copiar HEX"
                  >
                    {copiedHex === c.hex ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{c.hex}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{c.use}</p>
                <div className="text-[10px] text-slate-400 font-mono">Contraste: {c.contrast}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "typography" && (
          <div className="space-y-3">
            {DESIGN_TOKENS.typography.map((t, i) => (
              <div
                key={i}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">{t.level}</span>
                  <span className="text-[10px] font-mono text-brand-600 bg-brand-50 dark:bg-brand-950/60 px-1.5 py-0.5 rounded">
                    {t.size}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Weight: {t.weight} • Line-Height: {t.line} • Tracking: {t.tracking}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">{t.use}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "spacing" && (
          <div className="space-y-3">
            {DESIGN_TOKENS.spacing.map((s, i) => (
              <div
                key={i}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{s.name}</span>
                  <p className="text-[11px] text-slate-500">{s.use}</p>
                </div>
                <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "rules" && (
          <div className="space-y-3">
            {DESIGN_TOKENS.cognitiveRules.map((rule, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed"
              >
                {rule}
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
