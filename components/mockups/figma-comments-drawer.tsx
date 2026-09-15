"use client";

import React, { useState } from "react";
import { X, MessageSquare, Send, CheckCircle2, User, Sparkles } from "lucide-react";
import { MockupComment, INITIAL_COMMENTS } from "./mockup-data";

interface FigmaCommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  comments: MockupComment[];
  onAddComment: (comment: { author: string; role: string; target: string; text: string }) => void;
}

export function FigmaCommentsDrawer({
  isOpen,
  onClose,
  comments,
  onAddComment,
}: FigmaCommentsDrawerProps) {
  const [newText, setNewText] = useState("");
  const [newTarget, setNewTarget] = useState("Dashboard General");

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newText.trim()) return;
    onAddComment({
      author: "Diseñador / Revisor",
      role: "Product Designer",
      target: newTarget,
      text: newText.trim(),
    });
    setNewText("");
  }

  return (
    <aside className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-emerald-500" />
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Notas de Diseño & UX ({comments.length})
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Lista de comentarios */}
      <div className="p-4 overflow-y-auto flex-1 space-y-3 text-xs">
        {comments.map((c) => (
          <div
            key={c.id}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/50 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-[10px]">
                  {c.avatar}
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block leading-tight">
                    {c.author}
                  </span>
                  <span className="text-[10px] text-slate-400">{c.role} • {c.time}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {c.target}
              </span>
            </div>

            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">{c.text}</p>
          </div>
        ))}
      </div>

      {/* Formulario nuevo comentario */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-2"
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 font-semibold">Zona:</span>
          <select
            value={newTarget}
            onChange={(e) => setNewTarget(e.target.value)}
            className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 flex-1 text-slate-800 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="Dashboard General">Dashboard General</option>
            <option value="Tarjetas de KPI">Tarjetas de KPI</option>
            <option value="Alerta Temprana">Alerta Temprana</option>
            <option value="Pase de Lista">Pase de Lista</option>
            <option value="Jerarquía Visual">Jerarquía Visual</option>
          </select>
        </div>

        <textarea
          rows={2}
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Escribe una observación de diseño o usabilidad..."
          className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!newText.trim()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white transition shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publicar Nota</span>
          </button>
        </div>
      </form>
    </aside>
  );
}
