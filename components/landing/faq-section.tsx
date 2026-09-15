"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, ShieldCheck, School, Users, FileText } from "lucide-react";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "¿Cómo funciona Aurenis para múltiples colegios o liceos?",
      answer:
        "Aurenis opera bajo una arquitectura Multi-Tenant de última generación. Cada colegio, liceo o corporación municipal (SLEP) posee un espacio totalmente aislado, con su propio RBD oficial, reglamento de evaluación Decreto 67, logotipo institucional y base de datos protegida. Los usuarios ingresan directamente al portal de su propio establecimiento o mediante el buscador global.",
    },
    {
      question: "¿Cómo acceden los estudiantes y apoderados a sus calificaciones y asistencia?",
      answer:
        "Tanto estudiantes como apoderados pueden ingresar con su RUN o correo institucional desde cualquier dispositivo (smartphone, tablet o computador). Tienen acceso instantáneo a la planilla de calificaciones semestrales, porcentaje de asistencia en vivo, comunicaciones del colegio y justificaciones en línea sin costo adicional.",
    },
    {
      question: "¿Cumple la plataforma con la Circular 30 de la Superintendencia de Educación?",
      answer:
        "Sí, 100%. Aurenis cumple con todos los estándares técnicos y de seguridad exigidos por la Circular N° 30 de la Superintendencia de Educación para el Libro de Clases Digital, incluyendo control de firmas electrónicas, leccionario con Objetivos de Aprendizaje Mineduc, trazabilidad inmutable de notas y exportación a SIGE.",
    },
    {
      question: "¿Cómo se implementa la planilla matricial de notas con Decreto 67?",
      answer:
        "La planilla matricial está diseñada para maximizar la velocidad de los docentes: permite el tipeo rápido con teclado numérico (escribir '65' guarda automáticamente '6.5' y avanza a la siguiente celda), asignación de ponderaciones porcentuales por evaluación y semaforización cromática automática según los tramos de rendimiento.",
    },
    {
      question: "¿Puede una red de colegios o sostenedor consolidar la información de todas sus sedes?",
      answer:
        "Absolutamente. Los sostenedores y equipos directivos de redes escolares o SLEP disponen de un panel de control corporativo que consolida asistencia, cobertura curricular y alertas de deserción escolar de todos sus colegios en un solo cuadro de mando.",
    },
    {
      question: "¿Qué pasa si un docente no tiene conexión a internet temporalmente en el aula?",
      answer:
        "La plataforma incluye almacenamiento local resiliente que permite continuar pasando lista o registrando calificaciones en memoria del navegador y se sincroniza automáticamente en cuanto se restablece la conexión.",
    },
  ];

  return (
    <section className="relative w-full pt-20 pb-28 bg-[#F8F8F5] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shadow-sm">
            Preguntas Frecuentes
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Respuestas para Toda la Comunidad Escolar
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Resolvemos las dudas más comunes sobre la implementación multi-colegio, la seguridad de datos y la normativa educativa en Chile.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all shadow-xs"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-blue-600" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
      </div>
    </section>
  );
}
