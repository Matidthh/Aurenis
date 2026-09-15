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
  StatCard,
  StatCardSkeleton,
  TableSkeleton,
  TableRowSkeleton,
  Skeleton,
  CardSkeleton,
  SmoothTransition,
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
  Loader2,
  Sparkles,
  Layers,
  RefreshCw,
  Zap,
} from "lucide-react";

export default function DesignSystemShowcasePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [testInput, setTestInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isSimulatingHttp, setIsSimulatingHttp] = useState(false);
  const [skeletonVariant, setSkeletonVariant] = useState<"shimmer" | "pulse">("shimmer");

  const simulateHttpRequest = () => {
    setIsSimulatingHttp(true);
    setTimeout(() => {
      setIsSimulatingHttp(false);
    }, 2400);
  };

  // Muestra amplia de datos para demostrar paginación y selector de filas
  const sampleStudents = [
    { id: 1, name: "Lucas Muñoz", rut: "22.678.901-4", course: "1° Medio A", status: "Activo", grade: 6.8 },
    { id: 2, name: "Valentina Silva", rut: "23.456.789-0", course: "1° Medio A", status: "Activo", grade: 6.5 },
    { id: 3, name: "Sebastián Reyes", rut: "22.987.654-1", course: "1° Medio B", status: "Condicional", grade: 4.2 },
    { id: 4, name: "Camila Morales", rut: "23.111.222-3", course: "2° Medio A", status: "Inactivo", grade: 5.4 },
    { id: 5, name: "Ignacio Tapia", rut: "23.234.567-8", course: "2° Medio B", status: "Activo", grade: 6.1 },
    { id: 6, name: "Florencia Castro", rut: "22.345.678-9", course: "3° Medio A", status: "Activo", grade: 6.9 },
    { id: 7, name: "Mateo Fernández", rut: "23.456.123-k", course: "3° Medio B", status: "Condicional", grade: 4.5 },
    { id: 8, name: "Isidora Valenzuela", rut: "22.567.890-2", course: "4° Medio A", status: "Activo", grade: 6.3 },
    { id: 9, name: "Agustín Soto", rut: "23.678.901-3", course: "4° Medio B", status: "Inactivo", grade: 5.1 },
    { id: 10, name: "Martina González", rut: "22.789.012-4", course: "1° Medio A", status: "Activo", grade: 6.7 },
    { id: 11, name: "Tomás Araya", rut: "23.890.123-5", course: "1° Medio B", status: "Activo", grade: 5.8 },
    { id: 12, name: "Sofía Vargas", rut: "22.901.234-6", course: "2° Medio A", status: "Activo", grade: 6.4 },
    { id: 13, name: "Benjamín Romero", rut: "23.012.345-7", course: "2° Medio B", status: "Condicional", grade: 4.8 },
    { id: 14, name: "Antonia Medina", rut: "22.123.456-8", course: "3° Medio A", status: "Activo", grade: 6.2 },
    { id: 15, name: "Vicente Espinoza", rut: "23.234.567-9", course: "3° Medio B", status: "Inactivo", grade: 3.9 },
    { id: 16, name: "Catalina Paredes", rut: "22.345.678-0", course: "4° Medio A", status: "Activo", grade: 6.6 },
    { id: 17, name: "Emilio Bravo", rut: "23.456.789-1", course: "4° Medio B", status: "Activo", grade: 5.9 },
    { id: 18, name: "Javiera Herrera", rut: "22.567.890-3", course: "1° Medio A", status: "Activo", grade: 6.0 },
    { id: 19, name: "Maximiliano Fuentes", rut: "23.678.901-5", course: "1° Medio B", status: "Condicional", grade: 4.4 },
    { id: 20, name: "Francisca Cárdenas", rut: "22.789.012-6", course: "2° Medio A", status: "Activo", grade: 6.5 },
    { id: 21, name: "Rodrigo Navarro", rut: "23.890.123-7", course: "2° Medio B", status: "Activo", grade: 5.7 },
    { id: 22, name: "Constanza Rivas", rut: "22.901.234-8", course: "3° Medio A", status: "Activo", grade: 6.3 },
    { id: 23, name: "Cristóbal Vega", rut: "23.012.345-9", course: "3° Medio B", status: "Inactivo", grade: 4.9 },
    { id: 24, name: "Fernanda Carrasco", rut: "22.123.456-1", course: "4° Medio A", status: "Activo", grade: 6.7 },
    { id: 25, name: "Diego Miranda", rut: "23.234.567-2", course: "4° Medio B", status: "Condicional", grade: 4.3 },
    { id: 26, name: "Paz Godoy", rut: "22.345.678-4", course: "1° Medio A", status: "Activo", grade: 6.8 },
    { id: 27, name: "Gabriel Bustamante", rut: "23.456.789-5", course: "1° Medio B", status: "Activo", grade: 6.1 },
    { id: 28, name: "Renata Salazar", rut: "22.567.890-6", course: "2° Medio A", status: "Activo", grade: 6.4 },
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

        {/* Tabla tradicional con TablePagination */}
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
            {sampleStudents
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((st) => (
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
          totalPages={Math.ceil(sampleStudents.length / itemsPerPage)}
          totalItems={sampleStudents.length}
          itemsPerPage={itemsPerPage}
          pageSizeOptions={[10, 25, 50]}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(newSize) => {
            setItemsPerPage(newSize);
            setCurrentPage(1);
          }}
        />
      </section>

      {/* SECCIÓN 6: SKELETON LOADERS ANIMADOS & TRANSICIONES VISUALES SUAVES (ANTI-CLS) */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                6. Componentes Skeleton Loaders Animados & Transiciones Suaves
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Eliminan los saltos de layout (CLS = 0) durante peticiones HTTP, reemplazando spinners genéricos por esqueletos dimensionales exactos con animación shimmer.
            </p>
          </div>

          {/* Controles interactivos de prueba */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSkeletonVariant(skeletonVariant === "shimmer" ? "pulse" : "shimmer")}
              className="text-xs"
              title="Cambiar tipo de animación"
            >
              Animación: <strong className="ml-1 uppercase text-brand-600">{skeletonVariant}</strong>
            </Button>
            <Button
              variant={isSimulatingHttp ? "secondary" : "primary"}
              size="sm"
              leftIcon={
                isSimulatingHttp ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-600" />
                ) : (
                  <Zap className="w-3.5 h-3.5" />
                )
              }
              onClick={simulateHttpRequest}
            >
              {isSimulatingHttp ? "Cargando (2.5s)..." : "Simular Petición HTTP"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSimulatingHttp(!isSimulatingHttp)}
              className="text-xs"
            >
              {isSimulatingHttp ? "Fijar Datos Reales" : "Fijar Skeleton"}
            </Button>
          </div>
        </div>

        {/* Comparativa Visual: Spinner Genérico vs Skeleton Shimmer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50/40 dark:bg-red-950/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-red-700 dark:text-red-400">
              <XCircle className="w-4 h-4" />
              <span>Patrón Obsoleto: Spinners Genéricos Centrados</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Dejan la pantalla en blanco con un ícono circular en rotación, provocando un salto brusco de layout (Cumulative Layout Shift) cuando los datos finalmente se renderizan.
            </p>
            <div className="h-20 bg-white/70 dark:bg-slate-900/70 rounded-xl border border-dashed border-red-200 dark:border-red-900/60 flex items-center justify-center gap-2 text-slate-400 text-xs">
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              <span>Cargando datos... (Layout shift alto)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Patrón Moderno: Esqueletos Dimensionales Exactos</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Reservan el espacio físico exacto de tarjetas, filas y botones mediante un gradiente animado suave (shimmer), ofreciendo percepción de carga instantánea sin saltos.
            </p>
            <div className="h-20 bg-white/70 dark:bg-slate-900/70 rounded-xl border border-emerald-200 dark:border-emerald-900/60 p-3 flex flex-col justify-center gap-2">
              <Skeleton variant={skeletonVariant} className="h-3.5 w-1/3 rounded-md" />
              <Skeleton variant={skeletonVariant} className="h-5 w-2/3 rounded-lg" />
            </div>
          </div>
        </div>

        {/* SUBSECCIÓN A: TARJETAS DE RESUMEN Y MÉTRICAS (STAT CARDS) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" />
              A. Skeletons de Tarjetas de Resumen & Métricas (Stat Cards)
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Estado: {isSimulatingHttp ? "Cargando con Skeleton" : "Renderizando Datos Reales"}
            </span>
          </div>

          <SmoothTransition
            isLoading={isSimulatingHttp}
            skeleton={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCardSkeleton variant={skeletonVariant} />
                <StatCardSkeleton variant={skeletonVariant} />
                <StatCardSkeleton variant={skeletonVariant} />
                <StatCardSkeleton variant={skeletonVariant} />
              </div>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Estudiantes Activos"
                value="1,248"
                subtitle="+12% vs ciclo anterior"
                icon={<User className="w-5 h-5 text-brand-600" />}
              />
              <StatCard
                title="Tasa de Asistencia"
                value="94.2%"
                subtitle="Promedio últimos 30 días"
                icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              />
              <StatCard
                title="Matrículas en Trámite"
                value="34"
                subtitle="Pendientes de validación"
                icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
              />
              <StatCard
                title="Colegios Conectados"
                value="18"
                subtitle="En 3 comunas activas"
                icon={<ShieldCheck className="w-5 h-5 text-purple-600" />}
              />
            </div>
          </SmoothTransition>
        </div>

        {/* SUBSECCIÓN B: SKELETON PARA TABLAS COMPLETAS CON PAGINACIÓN */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" />
              B. Skeletons para Tablas y Paginación (DataTable Skeleton)
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Mantiene cabecera, anchos de columna y paginador
            </span>
          </div>

          <SmoothTransition
            isLoading={isSimulatingHttp}
            skeleton={
              <TableSkeleton
                variant={skeletonVariant}
                rows={5}
                showToolbar
                showPagination
                columns={[
                  { header: "Estudiante", width: "35%", align: "left" },
                  { header: "RUN", width: "20%", align: "left" },
                  { header: "Curso", width: "20%", align: "left" },
                  { header: "Estado", width: "15%", align: "left" },
                  { header: "Acciones", width: "10%", align: "right" },
                ]}
              />
            }
          >
            <div className="space-y-4">
              {/* Barra de herramientas activa de ejemplo */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3 flex-1">
                  <Input
                    placeholder="Buscar estudiante por nombre o RUN..."
                    leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                    containerClassName="w-full sm:w-80"
                  />
                  <Badge variant="neutral">28 Estudiantes</Badge>
                </div>
                <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                  Nuevo Alumno
                </Button>
              </div>

              {/* Tabla con datos reales */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estudiante</TableHead>
                    <TableHead>RUN</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleStudents.slice(0, 5).map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-semibold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 font-bold flex items-center justify-center text-xs border border-brand-200 dark:border-brand-800">
                            {student.name.split(" ")[0][0]}
                            {student.name.split(" ")[1]?.[0] || ""}
                          </div>
                          <div>
                            <div>{student.name}</div>
                            <div className="text-xs text-slate-400 font-normal">alumno@aurenis.edu</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{student.rut}</TableCell>
                      <TableCell>{student.course}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student.status === "Activo"
                              ? "success"
                              : student.status === "Condicional"
                              ? "warning"
                              : "neutral"
                          }
                        >
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Ver Ficha
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SmoothTransition>
        </div>

        {/* SUBSECCIÓN C: TARJETAS DE CONTENIDO & AVISOS (CARD SKELETON) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" />
              C. Skeletons para Fichas y Módulos de Contenido (CardSkeleton)
            </h3>
          </div>

          <SmoothTransition
            isLoading={isSimulatingHttp}
            skeleton={
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CardSkeleton variant={skeletonVariant} lines={3} />
                <CardSkeleton variant={skeletonVariant} lines={3} />
                <CardSkeleton variant={skeletonVariant} lines={3} />
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    Reunión de Apoderados
                  </span>
                  <Badge variant="brand">Académico</Badge>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Convocatoria oficial para revisión del informe trimestral y calificaciones parciales de la cohorte 2026.
                </p>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Jueves 19:00 hrs</span>
                  <span className="text-brand-600 font-semibold">Gimnasio Central</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    Cierre de Notas Semestrales
                  </span>
                  <Badge variant="warning">Importante</Badge>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Último plazo para que los docentes registren evaluaciones pendientes en la plataforma Aurenis.
                </p>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Viernes 23:59 hrs</span>
                  <span className="text-amber-600 font-semibold">Portal Docente</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    Jornada Deportiva Interescolar
                  </span>
                  <Badge variant="success">Extracurricular</Badge>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Participación de selecciones de fútbol, voleibol y atletismo representando al establecimiento.
                </p>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Sábado 09:00 hrs</span>
                  <span className="text-emerald-600 font-semibold">Canchas Club</span>
                </div>
              </div>
            </div>
          </SmoothTransition>
        </div>
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
