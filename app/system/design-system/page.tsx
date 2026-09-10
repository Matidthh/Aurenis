"use client";

import React, { useState } from "react";
import {
  Button,
  Input,
  Textarea,
  Badge,
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TablePagination,
  PageHeader,
} from "@/components/ui";
import {
  Palette,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Trash2,
  Search,
  Mail,
  User,
  ExternalLink,
  ShieldCheck,
  Eye,
} from "lucide-react";

export default function DesignSystemShowcasePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [testInput, setTestInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Muestra de datos para la tabla
  const sampleStudents = [
    { id: 1, name: "Lucas Muñoz", rut: "22.678.901-4", course: "1° Medio A", status: "Activo", grade: 6.8 },
    { id: 2, name: "Valentina Silva", rut: "23.456.789-0", course: "1° Medio A", status: "Activo", grade: 6.5 },
    { id: 3, name: "Sebastián Reyes", rut: "22.987.654-1", course: "1° Medio B", status: "Condicional", grade: 4.2 },
    { id: 4, name: "Camila Morales", rut: "23.111.222-3", course: "2° Medio A", status: "Inactivo", grade: 5.4 },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* Cabecera Principal */}
      <PageHeader
        title="Design System de Lucas — Catálogo & Tokens"
        description="Tokens de accesibilidad WCAG AA, componentes base reutilizables y especificación de interfaz para Aurenis."
        badge="v1.0 Lucas Spec"
        action={
          <Button
            variant="outline"
            leftIcon={<Eye className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Abrir Modal de Prueba
          </Button>
        }
      />

      {/* SECCIÓN 1: PALETA CROMÁTICA & VALIDACIÓN WCAG */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
          <Palette className="w-5 h-5 text-brand-600" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            1. Paleta Cromática Institucional & Contrastes WCAG AA
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-xl bg-brand-50 border border-brand-200 space-y-1">
            <span className="text-xs font-bold text-brand-900">brand-50</span>
            <p className="text-[11px] text-brand-700 font-mono">#f0f7ff</p>
            <span className="inline-block text-[10px] px-1.5 py-0.5 rounded font-semibold bg-brand-200 text-brand-800">
              Sup. Suave
            </span>
          </div>
          <div className="p-4 rounded-xl bg-brand-100 border border-brand-200 space-y-1">
            <span className="text-xs font-bold text-brand-900">brand-100</span>
            <p className="text-[11px] text-brand-700 font-mono">#e0effe</p>
            <span className="inline-block text-[10px] px-1.5 py-0.5 rounded font-semibold bg-brand-200 text-brand-800">
              Iconos / Hover
            </span>
          </div>
          <div className="p-4 rounded-xl bg-brand-500 text-white space-y-1 shadow-sm">
            <span className="text-xs font-bold">brand-500</span>
            <p className="text-[11px] font-mono opacity-90">#0c8ee9</p>
            <span className="inline-block text-[10px] px-1.5 py-0.5 rounded font-semibold bg-black/20 text-white">
              Foco & Acentos
            </span>
          </div>
          <div className="p-4 rounded-xl bg-brand-600 text-white space-y-1 shadow-md">
            <span className="text-xs font-bold">brand-600</span>
            <p className="text-[11px] font-mono opacity-90">#016fc7</p>
            <span className="inline-block text-[10px] px-1.5 py-0.5 rounded font-semibold bg-white/20 text-white">
              Botón Primario (4.8:1)
            </span>
          </div>
          <div className="p-4 rounded-xl bg-brand-700 text-white space-y-1 shadow-sm">
            <span className="text-xs font-bold">brand-700</span>
            <p className="text-[11px] font-mono opacity-90">#0258a1</p>
            <span className="inline-block text-[10px] px-1.5 py-0.5 rounded font-semibold bg-white/20 text-white">
              Hover Primario (6.7:1)
            </span>
          </div>
          <div className="p-4 rounded-xl bg-brand-950 text-white space-y-1">
            <span className="text-xs font-bold">brand-950</span>
            <p className="text-[11px] font-mono opacity-90">#07284a</p>
            <span className="inline-block text-[10px] px-1.5 py-0.5 rounded font-semibold bg-white/20 text-white">
              Deep Dark
            </span>
          </div>
        </div>

        {/* Semáforos de Estado WCAG AA */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Éxito / Aprobado</p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">Ratio 4.8:1 (WCAG AA Pass)</p>
              </div>
            </div>
            <Badge variant="success" dot>Activo</Badge>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="text-xs font-bold text-amber-900 dark:text-amber-200">Alerta / Pendiente</p>
                <p className="text-[11px] text-amber-700 dark:text-amber-400">Ratio 4.7:1 (WCAG AA Pass)</p>
              </div>
            </div>
            <Badge variant="warning" dot dotPulse>Revisar</Badge>
          </div>

          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <div>
                <p className="text-xs font-bold text-red-900 dark:text-red-200">Peligro / Rechazo</p>
                <p className="text-[11px] text-red-700 dark:text-red-400">Ratio 5.2:1 (WCAG AA Pass)</p>
              </div>
            </div>
            <Badge variant="danger" dot>Ausente</Badge>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: BOTONES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            2. Botones Accesibles (`Button`)
          </h2>
          <span className="text-xs text-slate-500 font-mono">Touch target ≥ 44px</span>
        </div>

        {/* Variantes */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Variantes de Acción</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Primary (Brand)
            </Button>
            <Button variant="secondary">
              Secondary (Neutral)
            </Button>
            <Button variant="outline">
              Outline Border
            </Button>
            <Button variant="ghost">
              Ghost Button
            </Button>
            <Button variant="success" leftIcon={<CheckCircle2 className="w-4 h-4" />}>
              Success
            </Button>
            <Button variant="danger" leftIcon={<Trash2 className="w-4 h-4" />}>
              Danger
            </Button>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              isLoading={isLoadingBtn}
              onClick={() => {
                setIsLoadingBtn(true);
                setTimeout(() => setIsLoadingBtn(false), 1500);
              }}
            >
              {isLoadingBtn ? "Procesando..." : "Clic para Probar Estado de Carga"}
            </Button>
            <Button variant="primary" disabled>
              Deshabilitado (Disabled)
            </Button>
          </div>

          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-2">Tamaños</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Tamaño Small (sm)</Button>
            <Button size="md">Tamaño Medium (md)</Button>
            <Button size="lg">Tamaño Large (lg)</Button>
            <Button size="icon" aria-label="Buscar"><Search className="w-4 h-4" /></Button>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: FORMULARIOS & INPUTS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            3. Inputs y Formularios Accesibles (`Input`, `Textarea`)
          </h2>
          <span className="text-xs text-slate-500 font-mono">aria-invalid + label htmlFor</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Input
            label="Nombre Completo del Estudiante"
            required
            placeholder="Ej. Lucas Marcelo"
            leftIcon={<User className="w-4 h-4" />}
            helperText="Ingrese ambos apellidos para el registro oficial."
          />

          <Input
            label="Correo Electrónico Institucional"
            type="email"
            placeholder="apoderado@sanjose.cl"
            leftIcon={<Mail className="w-4 h-4" />}
            value={testInput}
            onChange={(e) => {
              const val = e.target.value;
              setTestInput(val);
              if (val && !val.includes("@")) {
                setInputError("Debe ingresar un formato de correo válido (@).");
              } else {
                setInputError("");
              }
            }}
            error={inputError}
            helperText={!inputError ? "Escriba un texto sin @ para simular error en vivo." : undefined}
          />

          <div className="md:col-span-2">
            <Textarea
              label="Observaciones Pedagógicas"
              placeholder="Describa antecedentes o adaptaciones curriculares..."
              rows={3}
              helperText="Visible para el equipo de orientación y profesores jefes."
            />
          </div>
        </div>
      </section>

      {/* SECCIÓN 4: TABLAS & DATOS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            4. Tablas Accesibles (`Table`)
          </h2>
          <span className="text-xs text-slate-500 font-mono">scope=&quot;col&quot; + paginación</span>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Estudiante</TableHead>
              <TableHead>RUT</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead align="right">Promedio General</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleStudents.map((st) => (
              <TableRow key={st.id}>
                <TableCell className="font-semibold text-slate-900 dark:text-white">
                  {st.name}
                </TableCell>
                <TableCell className="font-mono text-xs">{st.rut}</TableCell>
                <TableCell>{st.course}</TableCell>
                <TableCell>
                  <Badge
                    variant={st.status === "Activo" ? "success" : st.status === "Condicional" ? "warning" : "danger"}
                    dot
                  >
                    {st.status}
                  </Badge>
                </TableCell>
                <TableCell align="right" className="font-bold text-brand-600 dark:text-brand-400">
                  {st.grade.toFixed(1)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          currentPage={currentPage}
          totalPages={3}
          totalItems={12}
          itemsPerPage={4}
          onPageChange={setCurrentPage}
        />
      </section>

      {/* MODAL DE PRUEBA */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="md">
        <ModalHeader>
          <ModalTitle>Componente Modal Accesible</ModalTitle>
          <ModalDescription>
            Cumple con WCAG 2.1 (role=&quot;dialog&quot;, aria-modal, foco visible y tecla Escape).
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 text-xs text-brand-800 dark:text-brand-200 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0" />
              <span>
                Este diálogo bloquea el scroll del fondo y se cierra al presionar la tecla <strong>Escape</strong> o pulsar fuera del panel.
              </span>
            </div>
            <Input label="Nombre de Campo" placeholder="Prueba de foco dentro del modal" />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Cerrar (Esc)
          </Button>
          <Button variant="primary" onClick={() => setIsModalOpen(false)}>
            Aceptar
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
