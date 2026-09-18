"use client";

import { FileSpreadsheet, Server, Video, ArrowRight, ShieldCheck, CheckCircle2, Clock } from "lucide-react";
import { getBookingUrl } from "@/lib/booking";

export function HowWeMigrateSection() {
  const steps = [
    {
      number: "01",
      stepBadge: "Paso 1",
      title: "Nos envías la nómina de estudiantes y cursos en Excel",
      description:
        "No requieres formatos complejos ni reingresar datos a mano. Recibimos la lista de alumnos y cursos en tus planillas actuales.",
      details: [
        "Acepta planillas Excel (.xlsx o .csv)",
        "Nómina de cursos, alumnos y apoderados",
        "Sin pérdida de registros ni duplicados",
      ],
      icon: FileSpreadsheet,
      badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
      iconColor: "text-blue-600 bg-blue-50",
    },
    {
      number: "02",
      stepBadge: "Paso 2",
      title: "Cargamos asignaturas, profesores y estructura del colegio",
      description:
        "Nuestro equipo configura los periodos lectivos (semestres/trimestres), ponderaciones de evaluación y cuentas de acceso de tu equipo docente.",
      details: [
        "Parametrización de escalas y ponderaciones (%)",
        "Asignación de asignaturas a profesores",
        "Roles de Director, UTP y Docente listos",
      ],
      icon: Server,
      badgeColor: "bg-indigo-50 text-indigo-800 border-indigo-200",
      iconColor: "text-indigo-600 bg-indigo-50",
    },
    {
      number: "03",
      stepBadge: "Paso 3",
      title: "Capacitación breve por videollamada y comienzo de uso",
      description:
        "Una sesión guiada de 30 minutos con tu equipo directivo y docentes para resolver dudas prácticas y empezar a registrar notas y asistencia de inmediato.",
      details: [
        "Demostración guiada en vivo de 30 minutos",
        "Acompañamiento directo durante los primeros días",
        "Soporte prioritario por correo y videollamada",
      ],
      icon: Video,
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      iconColor: "text-emerald-600 bg-emerald-50",
    },
  ];

  const bookingHref = getBookingUrl("Cómo migramos tu colegio");

  return (
    <section id="migracion" className="py-20 sm:py-28 bg-[#F5F5F0] border-y border-slate-200/90">
      <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-14">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14 sm:mb-18">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-slate-900 text-white shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Transición sin Fricción
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Cómo migramos tu colegio en 3 simples pasos
          </h2>
          
          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            Cambiar de sistema o digitalizar tus planillas no tiene que interrumpir el año escolar. Nos encargamos del trabajo pesado para que tu equipo empiece a operar sin estrés.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 p-7 sm:p-8 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className={`inline-flex items-center text-xs font-black px-3 py-1 rounded-full border ${s.badgeColor}`}>
                      {s.stepBadge}
                    </span>
                    <span className="text-3xl font-black text-slate-200 select-none">
                      {s.number}
                    </span>
                  </div>

                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${s.iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-3">
                    {s.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6 font-medium">
                    {s.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 space-y-2.5">
                  {s.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner Call to Action */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-emerald-700">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Tiempo de puesta en marcha: menos de 72 horas</span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-slate-900">
              ¿Listo para coordinar la migración de tu establecimiento?
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Agendamos una breve videollamada para revisar tus planillas y resolver dudas técnicas.
            </p>
          </div>

          <a
            href={bookingHref}
            target={bookingHref.startsWith("mailto:") ? undefined : "_blank"}
            rel={bookingHref.startsWith("mailto:") ? undefined : "noopener noreferrer"}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition-all shrink-0 w-full sm:w-auto"
          >
            <span>Agendar Reunión de Inicio</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}
