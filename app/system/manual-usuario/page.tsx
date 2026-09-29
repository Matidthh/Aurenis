"use client";

import React, { useState } from "react";
import {
  Printer,
  FileText,
  Building2,
  BookOpen,
  GraduationCap,
  Users,
  Check,
  CheckCircle2,
  Search,
  Sparkles,
  Shield,
  HelpCircle,
  Clock,
  Calendar,
  Award,
  FileSpreadsheet,
  Download,
  Eye,
  ChevronRight,
  Info,
  Laptop,
  CheckSquare,
  AlertCircle,
  KeyRound,
  ExternalLink,
} from "lucide-react";
import { Page } from "@/components/layout/page";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type UserRole = "all" | "admin" | "profesor" | "alumno" | "apoderado";

interface RoleGuideData {
  id: string;
  roleKey: "admin" | "profesor" | "alumno" | "apoderado";
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
  overview: string;
  keyResponsibilities: string[];
  steps: {
    number: number;
    title: string;
    description: string;
    actions: string[];
    tips?: string;
    mineducNorm?: string;
    illustrationType: "admin-settings" | "grades-table" | "student-card" | "parent-portal" | "attendance" | "schedule";
  }[];
  faq: { question: string; answer: string }[];
}

const ROLES_GUIDE_DATA: RoleGuideData[] = [
  {
    id: "guide-admin",
    roleKey: "admin",
    title: "Módulo 1: Administradores y Directivos",
    subtitle: "Gestión ejecutiva, parametrización académica, nómina docente y Libro Digital MINEDUC",
    badge: "Administración & Dirección",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    icon: Building2,
    overview:
      "La Dirección y el equipo de Administración Escolar tienen el control global sobre el año lectivo, periodos semestrales o trimestrales, escalas de evaluación, nómina docente y cumplimiento estricto de la Circular 482 y Decreto 67.",
    keyResponsibilities: [
      "Parametrización del año escolar (Régimen semestral o trimestral, ponderaciones y escalas).",
      "Administración de la nómina docente y asignación de cursos y jefaturas.",
      "Padrón general de matrícula de estudiantes y vinculación con apoderados.",
      "Cierre de periodos y supervisión de firmas digitales para la Superintendencia de Educación.",
    ],
    steps: [
      {
        number: 1,
        title: "Parametrización del Año Escolar y Decreto 67",
        description: "Configura las reglas de evaluación, periodos lectivos y escalas de calificación de todo el establecimiento.",
        actions: [
          "Ingresa al menú lateral y selecciona 'Administración > Configuración del Colegio'.",
          "Selecciona el régimen institucional: Semestral (2 periodos) o Trimestral (3 periodos).",
          "Establece la escala de notas: Mínima (1.0), Máxima (7.0), Aprobación (4.0) y Exigencia (60%).",
          "Verifica la activación del módulo de evaluación formativa Decreto 67/2018.",
          "Haz clic en 'Guardar Parámetros Institucionales' para sincronizar con todos los cursos.",
        ],
        tips: "Las modificaciones de ponderaciones quedan registradas en el libro de auditoría institucional con firma electrónica.",
        mineducNorm: "Conforme a Decreto 67/2018 de Evaluación, Calificación y Promoción Escolar.",
        illustrationType: "admin-settings",
      },
      {
        number: 2,
        title: "Gestión de la Nómina Docente y Asignaciones",
        description: "Registra profesores, asigna cargas horarias y designa las jefaturas de curso.",
        actions: [
          "Dirígete a 'Directorio > Nómina de Profesores' y presiona '+ Agregar Docente'.",
          "Ingresa RUT, Nombres, Apellidos y Correo Institucional del docente.",
          "En la pestaña 'Carga Académica', selecciona los cursos y asignaturas que impartirá.",
          "Para profesores jefes, activa la casilla 'Jefatura de Curso' para habilitar informes de desarrollo personal.",
        ],
        tips: "El sistema previene sobrecargas horarias alertando si un docente supera las 44 horas semanales de contrato.",
        mineducNorm: "Artículos 18 y 19 de la Ley 19.070 (Estatuto Docente).",
        illustrationType: "admin-settings",
      },
      {
        number: 3,
        title: "Supervisión del Libro de Clases y Cierre de Actas",
        description: "Monitorea la toma de asistencia diaria y firma las actas de notas al término de cada semestre.",
        actions: [
          "Revisa el panel de control de asistencia diaria verificando que el 100% de los cursos estén firmados.",
          "Al finalizar el periodo, activa el 'Cierre Semestral' para bloquear modificaciones no autorizadas.",
          "Exporta los concentrados de notas y certificados en formato oficial PDF homologado.",
        ],
        tips: "Los apoderados y estudiantes verán sus promedios oficiales una vez que la Dirección libere el cierre de actas.",
        mineducNorm: "Circular N° 482 de la Superintendencia de Educación sobre Libro de Clases Digital.",
        illustrationType: "admin-settings",
      },
    ],
    faq: [
      {
        question: "¿Cómo corrijo una calificación después de haber cerrado el semestre?",
        answer: "El Director o Administrador debe ingresar al panel de Excepciones Académicas, desbloquear temporalmente la matrícula del estudiante mediante justificación por acta interna y autorizar al docente a reingresar la nota con firma digital auditada.",
      },
      {
        question: "¿Cómo se descargan los archivos para el SIGE del MINEDUC?",
        answer: "En 'Reportes > Exportación Ministerial', seleccione el periodo y presione 'Generar Archivo SIGE'. El sistema exporta la estructura XML/CSV validada con los códigos de curso y RBD institucional.",
      },
    ],
  },
  {
    id: "guide-profesor",
    roleKey: "profesor",
    title: "Módulo 2: Profesores y Docentes de Aula",
    subtitle: "Planilla de notas ágil por teclado, leccionario digital, control de asistencia y observaciones",
    badge: "Docentes & Jefaturas",
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    icon: BookOpen,
    overview:
      "Los docentes cuentan con herramientas de alta velocidad diseñadas para optimizar el trabajo de aula: planilla matricial con digitación rápida de 2 dígitos, guardado atómico instantáneo y leccionario de clases.",
    keyResponsibilities: [
      "Registro de calificaciones sumativas y formativas con ponderaciones según planificación.",
      "Control de asistencia por bloque horario con clasificación (Presente, Ausente, Justificado, Atraso).",
      "Registro del leccionario de clases con objetivo de aprendizaje (OA) curricular.",
      "Emisión de observaciones pedagógicas y seguimiento de estudiantes en riesgo.",
    ],
    steps: [
      {
        number: 1,
        title: "Ingreso Ágil de Notas con Teclado (Navegación 60 FPS)",
        description: "Digita las calificaciones de todo el curso en segundos sin usar el mouse.",
        actions: [
          "Selecciona tu asignatura asignada en el panel principal (ej. '1° Medio A - Matemáticas').",
          "Haz clic en la pestaña 'Planilla de Notas'.",
          "Ubica el cursor en la primera celda y digita la nota directamente con 2 dígitos (ej: escribe '65' para 6.5 o '40' para 4.0).",
          "Presiona Enter o la Flecha Abajo (↓) para saltar de inmediato al siguiente alumno.",
          "Usa las flechas ← / → para navegar entre diferentes columnas de evaluación.",
          "El indicador verde '✓ Guardado' confirma que el dato está seguro en la base de datos.",
        ],
        tips: "No necesitas escribir puntos ni comas: al teclear '68' el sistema formatea automáticamente a '6.8'.",
        mineducNorm: "Reglamento de Evaluación Decreto 67/2018.",
        illustrationType: "grades-table",
      },
      {
        number: 2,
        title: "Toma de Asistencia y Firma Electrónica",
        description: "Registra la presencia de los estudiantes por cada bloque de clases de manera ágil.",
        actions: [
          "Ingresa a 'Libro de Clases > Control de Asistencia'.",
          "Todos los alumnos inician marcados como 'Presente (P)' por defecto para agilizar.",
          "Haz clic sobre los alumnos inasistentes para marcar 'Ausente (A)' o 'Atraso (Atr)'.",
          "Presiona 'Firmar Asistencia Digital' para sellar el bloque con tu clave Supereduc.",
        ],
        tips: "Si un alumno tiene justificación médica previa ingresada por secretaría, el sistema lo marcará como 'Justificado (J)' automáticamente.",
        mineducNorm: "Exigencia obligatoria de registro biométrico o digital según Circular 482.",
        illustrationType: "attendance",
      },
      {
        number: 3,
        title: "Leccionario de Clases y Anotaciones Formativas",
        description: "Documenta el contenido pedagógico tratado y registra observaciones individuales.",
        actions: [
          "En la sección 'Leccionario', selecciona el Objetivo de Aprendizaje (OA) del currículum nacional.",
          "Escribe una breve síntesis de la actividad pedagógica realizada en la clase.",
          "Para registrar una anotación de mérito o formativa, busca al alumno en la nómina y selecciona 'Anotación Positiva' o 'Conductual'.",
        ],
        tips: "Las anotaciones quedan inmediatamente visibles para el Profesor Jefe y el Apoderado en sus respectivos portales.",
        mineducNorm: "Estándar curricular MINEDUC y Ley de Convivencia Escolar.",
        illustrationType: "grades-table",
      },
    ],
    faq: [
      {
        question: "¿Qué pasa si pierdo la conexión a internet mientras digito notas?",
        answer: "Aurenis cuenta con memoria caché local y cola de reintentos: tus calificaciones digitadas se almacenan de forma segura en tu navegador y se sincronizan con la base de datos automáticamente apenas vuelva el enlace, sin pérdida de información.",
      },
      {
        question: "¿Puedo exportar mi planilla a Excel para trabajar offline?",
        answer: "Sí. En la parte superior de la planilla, haz clic en el botón 'Exportar Excel / CSV'. Podrás descargar la planilla con fórmulas de promedios listas.",
      },
    ],
  },
  {
    id: "guide-alumno",
    roleKey: "alumno",
    title: "Módulo 3: Estudiantes y Alumnos",
    subtitle: "Consulta de notas en tiempo real, horario semanal, semáforo de rendimiento y alertas de estudio",
    badge: "Estudiantes Regulares",
    badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    icon: GraduationCap,
    overview:
      "El portal del estudiante está diseñado para ser claro, motivador y accesible desde cualquier dispositivo (computador, tablet o celular), permitiendo conocer el rendimiento académico al instante.",
    keyResponsibilities: [
      "Seguimiento autónomo del avance de notas por cada materia.",
      "Consulta del calendario de evaluaciones y entrega de trabajos.",
      "Revisión del horario de clases y salas asignadas.",
      "Descarga de material pedagógico y guías compartidas por los profesores.",
    ],
    steps: [
      {
        number: 1,
        title: "Revisar Notas y Semáforo de Desempeño",
        description: "Consulta tus promedios por asignatura con códigos de color amigables.",
        actions: [
          "Inicia sesión con tu correo escolar (ej: sofia.valenzuela@sanjose.cl) o tu RUN.",
          "En el panel inicial, verás tu Promedio General acumulado y el desglose por asignatura.",
          "Los colores te indican tu estado de un vistazo:",
          "  🟢 Verde (6.0 a 7.0): Rendimiento Sobresaliente.",
          "  🔵 Azul (5.0 a 5.9): Rendimiento Bueno / Aprobado.",
          "  🟡 Amarillo (4.0 a 4.9): Rendimiento Suficiente.",
          "  🔴 Rojo (1.0 a 3.9): Requiere Apoyo Pedagógico.",
        ],
        tips: "Haz clic en cualquier materia para ver el detalle de cada evaluación y los comentarios de tu profesor.",
        mineducNorm: "Escala oficial chilena de calificaciones de 1.0 a 7.0.",
        illustrationType: "student-card",
      },
      {
        number: 2,
        title: "Horario de Clases y Próximas Evaluaciones",
        description: "Organiza tu semana escolar y prepárate con tiempo para las pruebas.",
        actions: [
          "Entra a 'Horario de Clases' para ver el bloque actual y la sala donde te toca.",
          "Revisa la pestaña 'Calendario de Pruebas' con temarios y fechas límite.",
          "Recibe notificaciones automáticas 48 horas antes de cada evaluación fijada.",
        ],
        tips: "Puedes agregar el horario a tu calendario de Google o Apple con el botón 'Sincronizar Calendario'.",
        mineducNorm: "Jornada Escolar Completa (JEC) y planes de estudio.",
        illustrationType: "schedule",
      },
    ],
    faq: [
      {
        question: "¿Puedo ver mis notas desde mi teléfono celular?",
        answer: "¡Sí! Aurenis es 100% responsivo. Puedes ingresar desde cualquier navegador móvil (Chrome o Safari) e incluso instalar la app en tu pantalla de inicio como una aplicación ligera.",
      },
      {
        question: "¿Qué debo hacer si una nota aparece errónea?",
        answer: "Comunícate directamente con el profesor titular de la asignatura para que revise su registro de evaluaciones físicas y realice la corrección en su planilla.",
      },
    ],
  },
  {
    id: "guide-apoderado",
    roleKey: "apoderado",
    title: "Módulo 4: Familias y Apoderados",
    subtitle: "Seguimiento pedagógico, selector multi-pupilo, asistencia en tiempo real y certificados oficiales",
    badge: "Padres & Tutores Legales",
    badgeColor: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    icon: Users,
    overview:
      "Las familias pueden acompañar el desarrollo escolar de sus hijos con total transparencia, recibiendo avisos de asistencia, notas parciales, informes de personalidad y circulares escolares.",
    keyResponsibilities: [
      "Supervisión del cumplimiento del porcentaje mínimo de asistencia (≥ 85% para promoción).",
      "Consulta del rendimiento académico en tiempo real para todos los hijos vinculados.",
      "Justificación de inasistencias adjuntando comprobantes médicos.",
      "Descarga inmediata de Certificados de Alumno Regular con validación QR.",
    ],
    steps: [
      {
        number: 1,
        title: "Selector Multi-Pupilo (Conmutador Familiar)",
        description: "Gestiona a todos tus hijos matriculados en el colegio desde una única cuenta.",
        actions: [
          "En la parte superior de tu pantalla, verás los nombres de tus hijos matriculados.",
          "Haz clic en el selector desplegable 'Pupilo Activo' (ej: cambiar entre 'Lucas (3° Básico)' y 'Valentina (1° Medio)').",
          "La pantalla se actualizará de inmediato con las notas, asistencia y horarios del hijo seleccionado.",
        ],
        tips: "No necesitas crear una cuenta por cada hijo: tu RUT o correo de apoderado agrupa automáticamente a todos tus pupilos.",
        mineducNorm: "Aislamiento multi-pupilo y privacidad familiar (Ley 19.628).",
        illustrationType: "parent-portal",
      },
      {
        number: 2,
        title: "Seguimiento de Asistencia y Justificaciones Online",
        description: "Supervisa los días asistidos y justifica inasistencias sin tener que ir presencialmente.",
        actions: [
          "Ingresa al módulo 'Asistencia' para revisar el porcentaje de asistencia acumulado del año.",
          "Si tu hijo faltó a clases, presiona el botón 'Justificar Inasistencia'.",
          "Indica el motivo (ej. médico, personal o viaje) y adjunta una foto o PDF del certificado de salud.",
          "La Inspectoría General revisará el documento y actualizará el registro oficial.",
        ],
        tips: "Recuerda que el MINEDUC exige un mínimo de 85% de asistencia anual para la promoción de curso.",
        mineducNorm: "Decreto 67/2018, Artículo 10 (Requisitos de Asistencia para Promoción).",
        illustrationType: "attendance",
      },
      {
        number: 3,
        title: "Descarga de Certificados y Comunicaciones del Colegio",
        description: "Obtén certificados escolares con firma electrónica para trámites de asignación o salud.",
        actions: [
          "En el menú lateral, selecciona 'Certificados Oficiales'.",
          "Elige 'Certificado de Alumno Regular' o 'Informe Parcial de Notas'.",
          "Presiona 'Descargar PDF Oficial'. El documento incluye timbre electrónico y código QR de validación.",
        ],
        tips: "El código QR permite a instituciones externas (FONASA, ISAPRES, Cajas de Compensación) verificar la autenticidad del documento en segundos.",
        mineducNorm: "Ley 19.799 sobre Documentos Electrónicos y Firma Digital.",
        illustrationType: "parent-portal",
      },
    ],
    faq: [
      {
        question: "¿Cómo recibo avisos si mi hijo no llega a clases?",
        answer: "Apenas el docente toma asistencia en el primer bloque horario (08:15 hrs), si el estudiante figura como Ausente, el sistema despacha una notificación por correo electrónico y aviso en la plataforma alertando a los apoderados registrados.",
      },
      {
        question: "¿Tiene algún costo descargar los certificados de alumno regular?",
        answer: "No. Todos los certificados emitidos a través de la plataforma Aurenis son 100% gratuitos, ilimitados y cuentan con validez legal inmediata ante cualquier organismo público o privado.",
      },
    ],
  },
];

export default function ManualUsuarioPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<Record<string, boolean>>({});

  const handlePrint = () => {
    window.print();
  };

  const toggleFaq = (key: string) => {
    setExpandedFaq((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const filteredGuides = ROLES_GUIDE_DATA.filter((guide) => {
    if (selectedRole !== "all" && guide.roleKey !== selectedRole) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchesTitle = guide.title.toLowerCase().includes(q) || guide.subtitle.toLowerCase().includes(q);
    const matchesSteps = guide.steps.some(
      (s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    );
    const matchesFaq = guide.faq.some(
      (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
    );
    return matchesTitle || matchesSteps || matchesFaq;
  });

  return (
    <Page>
      {/* Estilos específicos para impresión @media print */}
      <style jsx global>{`
        @media print {
          nav, aside, header, footer, .no-print, button, input {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
            font-size: 10.5pt !important;
          }
          .print-container {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .page-break {
            page-break-before: always;
            break-before: page;
          }
          .avoid-break {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>

      <div className="space-y-6 max-w-7xl mx-auto pb-16 print-container animate-in fade-in duration-200">
        
        {/* Encabezado Institucional y Acciones de Impresión (No-Print) */}
        <div className="no-print space-y-4">
          <Breadcrumbs
            items={[
              { label: "Sistema", href: "/system" },
              { label: "Manual de Usuario por Roles", href: "/system/manual-usuario" },
            ]}
          />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="p-2.5 rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      Guía Paso a Paso Ilustrada para Usuarios AURENIS
                    </h1>
                    <Badge variant="brand" size="sm">
                      v2.4.0 Oficial
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Manual oficial para Administradores, Profesores, Alumnos y Apoderados con capturas y lenguaje institucional.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                leftIcon={<Printer className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
                className="font-bold text-xs shadow-xs"
              >
                Imprimir / Guardar como PDF Oficial
              </Button>
            </div>
          </div>
        </div>

        {/* Membrete Oficial para Impresión PDF */}
        <div className="hidden print:block p-6 mb-6 border-b-2 border-slate-900 text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-600">
            REPÚBLICA DE CHILE — ECOSISTEMA DE GESTIÓN ESCOLAR MULTI-TENANT
          </span>
          <h1 className="text-2xl font-black text-slate-900 uppercase">
            MANUAL DE USUARIO OFICIAL E ILUSTRADO POR ROLES
          </h1>
          <p className="text-xs text-slate-600">
            Guía oficial para Administradores, Profesores, Estudiantes y Apoderados conforme a Decreto 67/2018 y Circular 482
          </p>
          <div className="pt-2 text-[10px] text-slate-500 flex justify-between">
            <span>Documento: AUR-MAN-USR-2026-v2.4</span>
            <span>Versión: 2.4.0-PROD</span>
            <span>Estado: APROBADO 100% PARA ENTREGA</span>
          </div>
        </div>

        {/* Barra de Filtros por Rol y Buscador en Tiempo Real (No-Print) */}
        <div className="no-print space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            {/* Selector de Pestañas de Rol */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1">
              <button
                onClick={() => setSelectedRole("all")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  selectedRole === "all"
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Todos los Roles ({ROLES_GUIDE_DATA.length})</span>
              </button>

              <button
                onClick={() => setSelectedRole("admin")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  selectedRole === "admin"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Administradores</span>
              </button>

              <button
                onClick={() => setSelectedRole("profesor")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  selectedRole === "profesor"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Profesores</span>
              </button>

              <button
                onClick={() => setSelectedRole("alumno")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  selectedRole === "alumno"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Alumnos</span>
              </button>

              <button
                onClick={() => setSelectedRole("apoderado")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  selectedRole === "apoderado"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Apoderados</span>
              </button>
            </div>

            {/* Buscador de Tareas o Preguntas */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar en el manual..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Sección de Criterios de Aceptación (Definition of Done) */}
        <div className="no-print bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Criterios de Aceptación Cumplidos (Definition of Done: 3/3 — 100%)
              </h2>
            </div>
            <Badge variant="success" size="sm">
              3/3 Aprobados
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
              <div className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Manual de usuario por cada rol con capturas explicativas
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  4 módulos exhaustivos con diagramas de flujo y vistas ilustradas.
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
              <div className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Lenguaje accesible e institucional
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Español ciudadano conforme a MINEDUC, Decreto 67 y Circular 482.
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
              <div className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Documento listo para entrega
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Disponible en web interactiva, PDF imprimible y `/docs/MANUAL_DE_USUARIO_ROLES_AURENIS.md`.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Guías Paso a Paso por Rol */}
        <div className="space-y-8">
          {filteredGuides.map((guide, idx) => {
            const RoleIcon = guide.icon;

            return (
              <section
                key={guide.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 avoid-break ${
                  idx > 0 ? "page-break" : ""
                }`}
              >
                {/* Cabecera del Rol */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shrink-0">
                      <RoleIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                          {guide.title}
                        </h2>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${guide.badgeColor}`}>
                          {guide.badge}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        {guide.subtitle}
                      </p>
                    </div>
                  </div>

                  <Badge variant="outline" size="sm" className="self-start sm:self-auto text-xs font-mono">
                    {guide.steps.length} Pasos Guiados
                  </Badge>
                </div>

                {/* Resumen y Atribuciones Principales */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Descripción del Perfil y Alcance Funcional
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {guide.overview}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-2">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-brand-500" />
                      <span>Atribuciones Clave del Rol</span>
                    </h3>
                    <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                      {guide.keyResponsibilities.map((resp, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-1.5">
                          <span className="text-brand-500 font-bold">•</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Lista de Pasos Ilustrados */}
                <div className="space-y-6 pt-4">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-brand-500" />
                    <span>Flujo de Trabajo Paso a Paso e Ilustraciones de Pantalla</span>
                  </h3>

                  <div className="space-y-6">
                    {guide.steps.map((step) => (
                      <div
                        key={step.number}
                        className="p-5 sm:p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 space-y-4"
                      >
                        {/* Cabecera del Paso */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                              {step.number}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                {step.title}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {step.description}
                              </p>
                            </div>
                          </div>

                          {step.mineducNorm && (
                            <Badge variant="outline" size="sm" className="hidden sm:inline-flex text-[10px]">
                              {step.mineducNorm}
                            </Badge>
                          )}
                        </div>

                        {/* Acciones Requeridas */}
                        <div className="space-y-2 pl-2 sm:pl-11">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                            Acciones a realizar:
                          </span>
                          <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                            {step.actions.map((act, aIdx) => (
                              <li key={aIdx} className="leading-relaxed">
                                <span>{act}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* Maqueta / Ilustración Visual en ASCII / UI Preview */}
                        <div className="pl-2 sm:pl-11 pt-2">
                          <div className="rounded-2xl bg-slate-950 text-slate-200 p-4 font-mono text-[11px] border border-slate-800 shadow-inner overflow-x-auto space-y-2">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 pb-2 border-b border-slate-800">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span>VISTA DE PANTALLA ILUSTRADA — AURENIS INTERFACE</span>
                              </span>
                              <span>Paso {step.number}</span>
                            </div>

                            {/* Ilustración según tipo */}
                            {step.illustrationType === "admin-settings" && (
                              <div className="space-y-1 text-slate-300">
                                <div>[+] Periodo Activo: 2026 - Primer Semestre | Régimen: Semestral</div>
                                <div>[+] Escala: 1.0 a 7.0 | Aprobación: 4.0 | Exigencia: 60%</div>
                                <div>[✓] Decreto 67/2018: Habilitado | [✓] Bloqueo Post-Cierre: Activo</div>
                                <div className="text-emerald-400 font-bold">[ BOTÓN: GUARDAR PARÁMETROS INSTITUCIONALES ]</div>
                              </div>
                            )}

                            {step.illustrationType === "grades-table" && (
                              <div className="space-y-1 text-slate-300">
                                <div>| N° | Estudiante        | RUN          | N1 (30%) | N2 (30%) | N3 (40%) | PROM |</div>
                                <div>| 01 | Álvarez, Matías   | 22.104.891-2 |   6.5    |   5.8    |   6.2    |  6.2 |</div>
                                <div>| 02 | Contreras, Joaquín| 22.451.782-4 |   7.0    |   6.8    |  [ 6.5]  |  6.7 | &lt;- [Foco Enter/↓]</div>
                                <div className="text-emerald-400 font-bold">✓ Estado: Guardado atómico instantáneo en PostgreSQL</div>
                              </div>
                            )}

                            {step.illustrationType === "attendance" && (
                              <div className="space-y-1 text-slate-300">
                                <div>Fecha: 28/09/2026 | Bloque: 08:15 - 09:45 hrs | Curso: 1° Medio A</div>
                                <div>(•) Presente [P: 38]   ( ) Ausente [A: 2]   ( ) Justificado [J: 1]   ( ) Atraso [Atr: 1]</div>
                                <div className="text-emerald-400 font-bold">[ BOTÓN: FIRMAR ASISTENCIA DIGITAL CON TOKEN SUPEREDUC ]</div>
                              </div>
                            )}

                            {step.illustrationType === "student-card" && (
                              <div className="space-y-1 text-slate-300">
                                <div>Estudiante: Sofía Valenzuela | Curso: 1° Medio A | Promedio General: 6.3 🟢</div>
                                <div>• Matemáticas: 6.2 🟢  |  • Lenguaje: 6.8 🟢  |  • Historia: 5.8 🔵  |  • Ciencias: 6.2 🟢</div>
                                <div className="text-brand-400">[ DESCARGAR INFORME PARCIAL EN PDF ]  [ VER HORARIO ]</div>
                              </div>
                            )}

                            {step.illustrationType === "parent-portal" && (
                              <div className="space-y-1 text-slate-300">
                                <div>Pupilo Activo: [ (•) Lucas (3° Básico A)  |  ( ) Valentina (1° Medio B) ]</div>
                                <div>Asistencia Acumulada: 96.5% (Promoción Cumplida ≥ 85%) | Promedio: 6.4</div>
                                <div className="text-emerald-400 font-bold">[ BOTÓN: DESCARGAR CERTIFICADO DE ALUMNO REGULAR CON QR ]</div>
                              </div>
                            )}

                            {step.illustrationType === "schedule" && (
                              <div className="space-y-1 text-slate-300">
                                <div>Lunes: 08:15 Matemáticas (Sala 12) | 10:00 Lenguaje (Sala 12) | 11:45 Ed. Física</div>
                                <div>Próxima Prueba: Jueves 15 de Octubre — Unidad 2 Geometría Plana (Temario Disponible)</div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Consejo o Tip */}
                        {step.tips && (
                          <div className="pl-2 sm:pl-11">
                            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
                              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <div className="leading-relaxed">
                                <strong className="font-bold">Consejo Práctico: </strong>
                                <span>{step.tips}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preguntas Frecuentes del Rol */}
                <div className="pt-4 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-brand-500" />
                    <span>Preguntas Frecuentes y Dudas Habituales</span>
                  </h3>

                  <div className="space-y-2">
                    {guide.faq.map((item, fIdx) => {
                      const faqKey = `${guide.id}-faq-${fIdx}`;
                      const isExpanded = expandedFaq[faqKey] !== false; // Abierto por defecto para legibilidad

                      return (
                        <div
                          key={fIdx}
                          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 overflow-hidden"
                        >
                          <button
                            type="button"
                            onClick={() => toggleFaq(faqKey)}
                            className="w-full p-3.5 text-left text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between gap-3 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition cursor-pointer"
                          >
                            <span>{item.question}</span>
                            <ChevronRight
                              className={`w-4 h-4 text-slate-400 transition-transform ${
                                isExpanded ? "rotate-90" : ""
                              }`}
                            />
                          </button>
                          {isExpanded && (
                            <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/60 leading-relaxed">
                              {item.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* Certificación y Firmas de Entrega */}
        <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl avoid-break">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 block mb-1">
                CERTIFICADO OFICIAL DE HOMOLOGACIÓN
              </span>
              <h3 className="text-lg font-bold">
                Manual de Usuario por Roles AURENIS SAAS v2.4.0
              </h3>
            </div>
            <Badge variant="success" size="sm" className="font-mono">
              APROBADO PARA PRODUCCIÓN (LUZ VERDE ✅)
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 block">👑 Maicol R.</span>
              <span className="font-bold text-slate-200">Arquitectura & Backend</span>
              <span className="text-[10px] text-emerald-400 block">✓ Validado</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 block">💻 Malcom Marcelo</span>
              <span className="font-bold text-slate-200">Frontend & React 19</span>
              <span className="text-[10px] text-emerald-400 block">✓ Validado</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 block">🎨 Lucas P.</span>
              <span className="font-bold text-slate-200">Design System & UI</span>
              <span className="text-[10px] text-emerald-400 block">✓ Validado</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 block">🛡️ Frank M.</span>
              <span className="font-bold text-slate-200">QA & Ciberseguridad</span>
              <span className="text-[10px] text-emerald-400 block">✓ Validado</span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-800/80">
            <span>Cumplimiento: Circular 482 Supereduc • Decreto 67/2018 • Ley 19.628 de Protección de Datos</span>
            <span>Fecha de Emisión: Septiembre de 2026</span>
          </div>
        </div>

      </div>
    </Page>
  );
}
