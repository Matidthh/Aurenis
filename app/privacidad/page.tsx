import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import {
  Shield,
  Lock,
  FileText,
  Mail,
  Building2,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Scale,
  AlertTriangle,
  UserCheck,
  Server,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidad y Protección de Datos",
  description:
    "Política oficial de privacidad y protección de datos personales de la plataforma AURENIS, desarrollada por Softium Studios. Conforme a la Ley 19.628 y Circular 482.",
  openGraph: {
    title: "Política de Privacidad — AURENIS",
    description:
      "Compromiso de protección de datos escolares y de menores de edad (NNA) en AURENIS y Softium Studios.",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8F8F5] text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Navbar Global */}
      <LandingNavbar />

      {/* Header / Hero */}
      <header className="pt-28 pb-12 sm:pt-36 sm:pb-16 bg-gradient-to-b from-white via-[#F8F8F5] to-[#F0F3F9] border-b border-slate-200/80 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
            <Link href="/" className="hover:text-blue-600 transition">
              Inicio
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-semibold">Política de Privacidad</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-semibold mb-4">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>Marco de Privacidad Institucional · Versión 1.0</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Política de Privacidad y Protección de Datos
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6">
            Compromiso ético, técnico y legal para el resguardo de la información de las comunidades educativas de Chile, cumpliendo con la Ley N° 19.628 y la Circular N° 482 de la Superintendencia de Educación.
          </p>

          {/* Ficha técnica del documento */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Versión &amp; Estado</span>
              <span className="text-slate-800 font-bold">1.0 — Oficial Vigente (2026)</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Desarrollo &amp; Soporte</span>
              <a
                href="https://softium.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1"
              >
                Softium Studios <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Contacto Oficial</span>
              <a
                href="mailto:contact@aurenis.app"
                className="text-slate-800 hover:text-blue-600 font-bold"
              >
                contact@aurenis.app
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal de la Política */}
      <main className="py-12 sm:py-16 bg-white flex-1 border-b border-slate-200/80">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
          
          {/* Alerta Resumen / Marco Ético */}
          <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 text-blue-900 text-xs sm:text-sm flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-blue-950">
                Principio rector: Los datos escolares pertenecen exclusivamente a la comunidad educativa.
              </p>
              <p className="text-blue-900/90 leading-relaxed">
                Ni AURENIS ni Softium Studios comercializan, ceden ni utilizan los datos académicos para publicidad o perfilamiento comercial. La protección de los datos de menores de edad (NNA) es una prioridad incondicional.
              </p>
            </div>
          </div>

          {/* 1. Nuestro compromiso */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">1.</span> Nuestro compromiso
            </h2>
            <p>
              AURENIS es una plataforma de gestión académica diseñada para apoyar y optimizar los procesos de los establecimientos educacionales de Chile.
            </p>
            <p>
              Nos comprometemos a tratar la información personal de manera responsable, transparente y estrictamente limitada a las finalidades autorizadas. La protección de los datos de estudiantes, docentes, apoderados y directivos forma parte indivisible del diseño arquitectónico, desarrollo técnico y operación de la plataforma desde sus cimientos.
            </p>
            <p>
              Esta política explica qué información puede tratarse, para qué se utiliza, cómo se administra y qué mecanismos existen para atender solicitudes relacionadas con la privacidad y la salvaguarda de derechos fundamentales.
            </p>
          </section>

          {/* 2. Información que puede tratarse */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">2.</span> Información que puede tratarse
            </h2>
            <p>
              Según las funcionalidades habilitadas y el acuerdo o contrato suscrito con cada establecimiento educacional, la plataforma podría tratar:
            </p>
            <ul className="space-y-2.5 pl-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-1" />
                <span><strong className="text-slate-900 font-semibold">Datos de identificación:</strong> nombre completo, identificador institucional o RUT, rol educativo y otros datos requeridos para individualizar al usuario.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-1" />
                <span><strong className="text-slate-900 font-semibold">Datos de acceso:</strong> nombre de usuario, credenciales criptográficamente protegidas (hash unidireccional bcryptjs) y datos técnicos de sesión activa.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-1" />
                <span><strong className="text-slate-900 font-semibold">Información académica:</strong> curso, asignaturas, calificaciones formativas y sumativas bajo Decreto 67, asistencias, atrasos y registros pedagógicos gestionados por el colegio.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-1" />
                <span><strong className="text-slate-900 font-semibold">Datos de uso y técnicos:</strong> registros de actividad estrictamente necesarios para operar el servicio, investigar errores de software y prevenir vulnerabilidades o ataques maliciosos.</span>
              </li>
            </ul>
            <p className="text-xs text-slate-500 italic mt-2">
              * AURENIS no solicitará información personal que no resulte estrictamente indispensable para una finalidad legítima y pedagógica definida. Las categorías anteriores describen datos posibles y no implican recopilación obligatoria masiva.
            </p>
          </section>

          {/* 3. Finalidades del tratamiento */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">3.</span> Finalidades del tratamiento
            </h2>
            <p>
              La información podrá utilizarse exclusivamente para las finalidades correspondientes al servicio educativo contratado o autorizado, entre ellas:
            </p>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                <span>Gestionar las cuentas y autenticación segura de los usuarios de cada establecimiento.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                <span>Proporcionar las funcionalidades académicas habilitadas (libro de clases, calificaciones, asistencia).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                <span>Mantener la integridad, inmutabilidad y disponibilidad de los registros escolares oficiales.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                <span>Atender solicitudes de soporte técnico y resolución de dudas institucionales.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                <span>Investigar incidentes de seguridad técnica y subsanar errores en los sistemas.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                <span>Cumplir las obligaciones legales aplicables y los requerimientos del Ministerio de Educación.</span>
              </li>
            </ul>
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium mt-2">
              Queda expresamente prohibido el uso de la información para publicidad personalizada, monetización de datos, venta a intermediarios o cualquier finalidad incompatible con el propósito escolar.
            </div>
          </section>

          {/* 4. Responsabilidades del establecimiento y de AURENIS */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">4.</span> Responsabilidades del establecimiento y de AURENIS
            </h2>
            <p>
              Las responsabilidades concretas se formalizan en el contrato y en el acuerdo de tratamiento de datos correspondiente:
            </p>
            <p>
              El establecimiento educacional actúa como <strong className="text-slate-900 font-semibold">Responsable del Tratamiento</strong>, definiendo las finalidades legítimas y las instrucciones de los datos escolares de su comunidad. AURENIS y su equipo desarrollador (Softium Studios) actúan como <strong className="text-slate-900 font-semibold">Encargados del Tratamiento (Data Processor)</strong>, prestando el servicio informático conforme a esas directrices.
            </p>
            <p>
              AURENIS no asume ni ejercerá derechos de propiedad sobre los datos académicos por el simple hecho de que se encuentren alojados o procesados en su infraestructura.
            </p>
          </section>

          {/* 5. Acceso y confidencialidad */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">5.</span> Acceso y confidencialidad
            </h2>
            <p>
              El acceso a la información se encuentra estrictamente delimitado mediante control de acceso basado en roles (RBAC). Las cuentas de administración, directivos, docentes, apoderados y estudiantes disponen únicamente de los permisos correspondientes a sus funciones pedagógicas.
            </p>
            <p>
              Todas las personas con acceso a información escolar asumen un compromiso indelegable de confidencialidad y deben utilizarla de forma exclusiva en el ejercicio de sus funciones institucionales autorizadas.
            </p>
          </section>

          {/* 6. Seguridad de la información */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">6.</span> Seguridad de la información
            </h2>
            <p>
              AURENIS establece y mantiene salvaguardas técnicas, lógicas y organizativas proporcionadas a la naturaleza de los datos tratados:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                <span className="font-bold text-slate-900 block mb-1">Aislamiento Multi-Tenant</span>
                Prevención de vulnerabilidades BOLA/IDOR mediante validación estricta del identificador institucional en cada petición al servidor.
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                <span className="font-bold text-slate-900 block mb-1">Criptografía de Contraseñas</span>
                Almacenamiento de credenciales utilizando algoritmos de derivación de claves seguros (bcryptjs con salt aleatorio).
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                <span className="font-bold text-slate-900 block mb-1">Comunicaciones Cifradas</span>
                Tránsito obligatorio mediante protocolos TLS/HTTPS modernos para mitigar intercepciones en red.
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                <span className="font-bold text-slate-900 block mb-1">Copias de Respaldo y Auditoría</span>
                Procedimientos continuos de respaldo de base de datos relacional y trazabilidad de eventos críticos.
              </div>
            </div>
          </section>

          {/* 7. Proveedores y terceros */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">7.</span> Proveedores y terceros
            </h2>
            <p>
              Los proveedores tecnológicos que intervengan en el funcionamiento de la infraestructura (servicios cloud, bases de datos PostgreSQL y redes de entrega de contenido) son debidamente evaluados considerando sus certificaciones de seguridad y compromisos contractuales de confidencialidad.
            </p>
            <p>
              Cualquier transferencia internacional de datos requerida para el funcionamiento de servidores cloud se realiza conforme a las salvaguardas exigidas por la normativa chilena vigente.
            </p>
          </section>

          {/* 8. Conservación y eliminación */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">8.</span> Conservación y eliminación
            </h2>
            <p>
              Los datos se conservan durante el período legal y reglamentario exigido por el Ministerio de Educación para la vigencia de los libros de clases y el cumplimiento de las metas del año escolar.
            </p>
            <p>
              Al término del vínculo contractual con un establecimiento, se coordinará la exportación segura de sus registros históricos y la posterior eliminación de las copias operativas conforme al procedimiento pactado.
            </p>
          </section>

          {/* 9. Derechos y solicitudes de privacidad */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">9.</span> Derechos y solicitudes de privacidad
            </h2>
            <p>
              Conforme a la Ley N° 19.628, los titulares de datos o sus representantes legales (apoderados en el caso de menores de edad) pueden ejercer sus derechos de acceso, rectificación, cancelación u oposición dirigiéndose a la dirección del establecimiento escolar respectivo o escribiendo directamente a nuestro canal oficial: <strong className="text-blue-600 font-semibold">contact@aurenis.app</strong>.
            </p>
          </section>

          {/* 10. Incidentes de seguridad */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">10.</span> Incidentes de seguridad
            </h2>
            <p>
              AURENIS cuenta con protocolos de respuesta a incidentes de seguridad para investigar, contener y evaluar cualquier eventualidad técnica que comprometa la confidencialidad de la información. Ante la verificación de un incidente relevante, se informará oportunamente a las instituciones afectadas y a las autoridades competentes según lo dispuesto en la legislación aplicable.
            </p>
          </section>

          {/* 11. Cambios en esta política */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">11.</span> Cambios en esta política
            </h2>
            <p>
              Esta política podrá ser actualizada periódicamente para reflejar mejoras técnicas, nuevas exigencias normativas del Ministerio de Educación o evoluciones en la plataforma. La versión vigente y actualizada estará siempre publicada en esta dirección web con indicación de su fecha de revisión.
            </p>
          </section>

          {/* 12. Contacto Institucional y Tecnológico */}
          <section className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">12.</span> Contacto oficial y responsable
            </h2>
            <p>
              Para cualquier consulta sobre privacidad, protección de datos escolares o requerimientos técnicos, los canales formales son:
            </p>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0C1B33] to-[#081224] text-white space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Softium Studios</h3>
                  <p className="text-xs text-blue-300">Entidad desarrolladora y soporte tecnológico de AURENIS</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-slate-800">
                <div>
                  <span className="text-slate-400 block mb-0.5">Correo de Privacidad:</span>
                  <a
                    href="mailto:contact@aurenis.app"
                    className="text-white hover:text-blue-400 font-semibold flex items-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    contact@aurenis.app
                  </a>
                </div>

                <div>
                  <span className="text-slate-400 block mb-0.5">Plataforma AURENIS:</span>
                  <a
                    href="https://aurenis.app"
                    className="text-white hover:text-blue-400 font-semibold"
                  >
                    https://aurenis.app
                  </a>
                </div>

                <div>
                  <span className="text-slate-400 block mb-0.5">Desarrollo Tecnológico:</span>
                  <a
                    href="https://softium.xyz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1"
                  >
                    https://softium.xyz <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Botones de Navegación Final */}
          <div className="pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/sobre-nosotros"
              className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5"
            >
              <span>Conocer al Equipo Desarrollador</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              className="text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800"
            >
              Volver a la Página de Inicio
            </Link>
          </div>

        </article>
      </main>

      {/* Footer Global */}
      <LandingFooter />
    </div>
  );
}
