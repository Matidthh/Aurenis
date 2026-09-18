"use client";

import React, { useState } from "react";
import { ChevronDown, Sparkles, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: "Multi-Colegio & RBD",
      question: "¿Cómo funciona Aurenis para múltiples colegios o liceos?",
      answer:
        "Aurenis opera bajo una arquitectura Multi-Tenant de última generación. Cada colegio, liceo o corporación municipal (SLEP) posee un espacio totalmente aislado, con su propio RBD oficial, reglamento de evaluación Decreto 67, logotipo institucional y base de datos protegida. Los usuarios ingresan directamente al portal de su propio establecimiento o mediante el buscador global.",
    },
    {
      category: "Apoderados & Alumnos",
      question: "¿Cómo acceden los estudiantes y apoderados a sus calificaciones y asistencia?",
      answer:
        "Tanto estudiantes como apoderados pueden ingresar con su RUN o correo institucional desde cualquier dispositivo (smartphone, tablet o computador). Tienen acceso instantáneo a la planilla de calificaciones semestrales, porcentaje de asistencia en vivo, comunicaciones del colegio y justificaciones en línea sin costo adicional.",
    },
    {
      category: "Normativa & Superintendencia",
      question: "¿Cumple la plataforma con la Circular 30 de la Superintendencia de Educación?",
      answer:
        "AURENIS está diseñado y estructurado conforme a los requerimientos técnicos y pedagógicos de la Circular N° 30 de la Superintendencia de Educación para el Libro de Clases Digital, incorporando registro de firmas de clase, leccionario con Objetivos de Aprendizaje Mineduc, trazabilidad de notas y reportes estructurados compatibles con los requerimientos de inspección.",
    },
    {
      category: "Docentes & Evaluación",
      question: "¿Cómo se implementa la planilla matricial de notas con Decreto 67?",
      answer:
        "La planilla matricial está diseñada para maximizar la velocidad de los docentes: permite el tipeo rápido con teclado numérico (escribir '65' guarda automáticamente '6.5' y avanza a la siguiente celda), asignación de ponderaciones porcentuales por evaluación o promedio simple, y semaforización cromática automática según los tramos de rendimiento.",
    },
    {
      category: "Sostenedores & SLEP",
      question: "¿Puede una red de colegios o sostenedor consolidar la información de todas sus sedes?",
      answer:
        "Absolutamente. Los sostenedores y equipos directivos de redes escolares o SLEP disponen de un panel de control corporativo que consolida asistencia, cobertura curricular y alertas de deserción escolar de todos sus colegios en un solo cuadro de mando.",
    },
    {
      category: "Resiliencia & Sin Internet",
      question: "¿Qué pasa si un docente no tiene conexión a internet temporalmente en el aula?",
      answer:
        "La plataforma incluye almacenamiento local resiliente que permite continuar pasando lista o registrando calificaciones en memoria del navegador y se sincroniza automáticamente en cuanto se restablece la conexión.",
    },
  ];

  return (
    <section id="faq" className="relative w-full py-20 sm:py-28 bg-[#F8F8F5] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
        
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-14 sm:mb-18">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Preguntas Frecuentes
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Respuestas claras para tu comunidad escolar
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Resolvemos las dudas más habituales sobre migración, cumplimiento ministerial Decreto 67 y seguridad de datos.
          </p>
        </div>

        {/* Lista de Acordeón con animación Motion */}
        <div className="max-w-3xl mx-auto space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={false}
                animate={{
                  borderColor: isOpen ? "rgb(96, 165, 250)" : "rgba(226, 232, 240, 0.9)",
                }}
                className={`bg-white rounded-2xl border transition-colors duration-200 overflow-hidden shadow-2xs ${
                  isOpen ? "ring-1 ring-blue-400/30" : "hover:border-slate-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 sm:p-6 text-left flex items-start sm:items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-blue-600 transition cursor-pointer select-none"
                >
                  <div className="space-y-1">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60 mb-1">
                      {faq.category}
                    </span>
                    <span className="block leading-snug">{faq.question}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="shrink-0 mt-1 sm:mt-0"
                  >
                    <ChevronDown
                      className={`w-5 h-5 transition-colors ${
                        isOpen ? "text-blue-600" : "text-slate-400"
                      }`}
                    />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        transition: {
                          height: { duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] },
                          opacity: { duration: 0.2, delay: 0.05 },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.22, ease: [0.04, 0.62, 0.23, 0.98] },
                          opacity: { duration: 0.15 },
                        },
                      }}
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Support Help Card */}
        <div className="max-w-xl mx-auto mt-12 text-center p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm font-black text-slate-900">
            <MessageCircle className="w-4 h-4 text-blue-600" />
            <span>¿Tienes otra consulta institucional?</span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Nuestro equipo de consultores pedagógicos responde en menos de 2 horas hábiles.
          </p>
          <div className="pt-2">
            <a
              href="#contacto"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 underline underline-offset-4"
            >
              <span>Escríbenos directamente aquí</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
