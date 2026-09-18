import JSZip from "jszip";
import { prisma } from "@/lib/db/prisma";

/**
 * Escapes and formats an array of values into a standard CSV line (RFC 4180)
 */
function toCsvLine(row: (string | number | boolean | null | undefined)[]): string {
  return row
    .map((val) => {
      if (val === null || val === undefined) return "";
      const str = String(val);
      if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    })
    .join(",");
}

/**
 * Converts headers and rows to CSV with UTF-8 BOM so Excel opens accents correctly
 */
function generateCsv(headers: string[], rows: (string | number | boolean | null | undefined)[][]): string {
  const bom = "\uFEFF";
  const lines = [toCsvLine(headers), ...rows.map(toCsvLine)];
  return bom + lines.join("\r\n");
}

/**
 * Generates a full .ZIP backup of a school tenant data
 * Tables included:
 * 1. Institution & Settings
 * 2. Users and Memberships (WITHOUT passwords or hashes)
 * 3. Courses and Education Levels
 * 4. Students and Matriculation Profiles
 * 5. Subjects and Academic Assessments
 * 6. Historic Grades and Notes
 * 7. Attendance Records
 * 8. Readme manifest
 */
export async function generateSchoolBackupZip(schoolId: string): Promise<{ buffer: Buffer; filename: string }> {
  // 1. Resolve school
  const school = await prisma.school.findFirst({
    where: { OR: [{ id: schoolId }, { slug: schoolId }] },
    include: {
      settings: true,
      academicPeriods: true,
      educationLevels: true,
    },
  });

  if (!school) {
    throw new Error("Institución no encontrada para exportar respaldo.");
  }

  const zip = new JSZip();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const baseFilename = `respaldo_${school.slug}_${timestamp}.zip`;

  // --- Table 1: Colegio y Configuración ---
  const schoolHeaders = [
    "ID_Colegio",
    "Nombre_Colegio",
    "Slug",
    "RBD_Oficial",
    "Direccion",
    "Ciudad",
    "Pais",
    "Zona_Horaria",
    "Regimen_Lectivo",
    "Nota_Minima",
    "Nota_Maxima",
    "Nota_Aprobacion",
  ];
  const schoolRows = [
    [
      school.id,
      school.name,
      school.slug,
      school.institutionalCode || "",
      school.address || "",
      school.city || "",
      school.country || "Chile",
      school.timezone || "America/Santiago",
      school.settings?.termType || "SEMESTER",
      school.settings?.minGrade ? String(school.settings.minGrade) : "1.0",
      school.settings?.maxGrade ? String(school.settings.maxGrade) : "7.0",
      school.settings?.minPassingGrade ? String(school.settings.minPassingGrade) : "4.0",
    ],
  ];
  zip.file("01_colegio_y_configuracion.csv", generateCsv(schoolHeaders, schoolRows));

  // --- Table 2: Usuarios y Miembros (SIN passwords) ---
  const memberships = await prisma.membership.findMany({
    where: { schoolId: school.id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          rutOrNationalId: true,
          status: true,
          createdAt: true,
        },
      },
      role: {
        select: {
          name: true,
          displayName: true,
        },
      },
    },
  });

  const usersHeaders = [
    "ID_Membresia",
    "ID_Usuario",
    "RUT_Identificador",
    "Nombres",
    "Apellidos",
    "Correo_Electronico",
    "Rol_Institucional",
    "Nombre_Rol",
    "Estado",
    "Fecha_Creacion",
  ];
  const usersRows = memberships.map((m) => [
    m.id,
    m.user?.id || "",
    m.user?.rutOrNationalId || "",
    m.user?.firstName || "",
    m.user?.lastName || "",
    m.user?.email || "",
    m.role?.name || "",
    m.role?.displayName || "",
    m.isActive ? "ACTIVO" : "INACTIVO",
    m.createdAt ? new Date(m.createdAt).toLocaleDateString("es-CL") : "",
  ]);
  zip.file("02_usuarios_y_docentes.csv", generateCsv(usersHeaders, usersRows));

  // --- Table 3: Cursos y Niveles ---
  const courses = await prisma.course.findMany({
    where: { schoolId: school.id, deletedAt: null },
    include: {
      educationLevel: true,
    },
  });

  const coursesHeaders = [
    "ID_Curso",
    "Nombre_Curso",
    "Letra",
    "Numero_Grado",
    "Ano_Lectivo",
    "Nivel_Educativo",
    "Codigo_Nivel",
  ];
  const coursesRows = courses.map((c) => [
    c.id,
    c.name,
    c.letter || "",
    c.gradeNumber,
    c.year,
    c.educationLevel?.name || "",
    c.educationLevel?.shortCode || "",
  ]);
  zip.file("03_cursos_y_niveles.csv", generateCsv(coursesHeaders, coursesRows));

  // --- Table 4: Estudiantes y Matrículas ---
  const enrollments = await prisma.enrollment.findMany({
    where: { schoolId: school.id, deletedAt: null },
    include: {
      course: true,
      student: {
        include: {
          membership: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  const studentsHeaders = [
    "ID_Matricula",
    "ID_Estudiante",
    "RUT",
    "Nombres",
    "Apellidos",
    "Curso",
    "Ano_Lectivo",
    "Numero_Matricula",
    "Fecha_Nacimiento",
    "Estado_Matricula",
    "Observaciones_Medicas",
  ];
  const studentsRows = enrollments.map((en) => {
    const studentUser = en.student?.membership?.user;
    return [
      en.id,
      en.studentProfileId,
      studentUser?.rutOrNationalId || "",
      studentUser?.firstName || "",
      studentUser?.lastName || "",
      en.course?.name || "",
      en.year,
      en.student?.enrollmentNumber || "",
      en.student?.birthDate ? new Date(en.student.birthDate).toLocaleDateString("es-CL") : "",
      en.status,
      en.student?.medicalNotes || "",
    ];
  });
  zip.file("04_estudiantes_matricula.csv", generateCsv(studentsHeaders, studentsRows));

  // --- Table 5: Asignaturas y Evaluaciones ---
  const assessments = await prisma.assessment.findMany({
    where: { schoolId: school.id },
    include: {
      subject: {
        include: {
          course: true,
        },
      },
      academicPeriod: true,
    },
  });

  const assessmentsHeaders = [
    "ID_Evaluacion",
    "Asignatura",
    "Curso",
    "Periodo_Lectivo",
    "Titulo_Evaluacion",
    "Ponderacion_Porcentaje",
    "Fecha_Evaluacion",
    "Publicada",
    "Descripcion",
  ];
  const assessmentsRows = assessments.map((a) => [
    a.id,
    a.subject?.name || "",
    a.subject?.course?.name || "",
    a.academicPeriod?.name || "",
    a.title,
    a.weightPercentage ? `${Number(a.weightPercentage)}%` : "100%",
    a.date ? new Date(a.date).toLocaleDateString("es-CL") : "",
    a.isPublished ? "SI" : "NO",
    a.description || "",
  ]);
  zip.file("05_asignaturas_y_evaluaciones.csv", generateCsv(assessmentsHeaders, assessmentsRows));

  // --- Table 6: Calificaciones Históricas ---
  const grades = await prisma.grade.findMany({
    where: { schoolId: school.id },
    include: {
      assessment: {
        include: {
          subject: {
            include: { course: true },
          },
          academicPeriod: true,
        },
      },
      enrollment: {
        include: {
          student: {
            include: {
              membership: {
                include: { user: true },
              },
            },
          },
        },
      },
    },
    take: 10000,
  });

  const gradesHeaders = [
    "ID_Nota",
    "RUT_Estudiante",
    "Estudiante",
    "Curso",
    "Asignatura",
    "Periodo",
    "Evaluacion",
    "Calificacion",
    "Retroalimentacion",
    "Fecha_Registro",
  ];
  const gradesRows = grades.map((g) => {
    const studentUser = g.enrollment?.student?.membership?.user;
    const studentName = studentUser ? `${studentUser.firstName} ${studentUser.lastName}`.trim() : "";
    return [
      g.id,
      studentUser?.rutOrNationalId || "",
      studentName,
      g.assessment?.subject?.course?.name || "",
      g.assessment?.subject?.name || "",
      g.assessment?.academicPeriod?.name || "",
      g.assessment?.title || "",
      g.value ? Number(g.value).toFixed(1) : "",
      g.feedback || "",
      g.updatedAt ? new Date(g.updatedAt).toLocaleDateString("es-CL") : "",
    ];
  });
  zip.file("06_calificaciones_historicas.csv", generateCsv(gradesHeaders, gradesRows));

  // --- Table 7: Registro de Asistencia ---
  const attendances = await prisma.attendanceRecord.findMany({
    where: { schoolId: school.id },
    take: 15000,
  });

  // Map student names for quick lookup
  const studentMap = new Map<string, { name: string; rut: string }>();
  enrollments.forEach((en) => {
    const u = en.student?.membership?.user;
    if (u) {
      studentMap.set(en.studentProfileId, {
        name: `${u.firstName} ${u.lastName}`.trim(),
        rut: u.rutOrNationalId || "",
      });
    }
  });

  const courseMap = new Map<string, string>();
  courses.forEach((c) => courseMap.set(c.id, c.name));

  const attendanceHeaders = [
    "ID_Asistencia",
    "RUT_Estudiante",
    "Estudiante",
    "Curso",
    "Fecha",
    "Estado_Asistencia",
    "Justificacion",
  ];
  const attendanceRows = attendances.map((att) => {
    const st = studentMap.get(att.studentProfileId);
    return [
      att.id,
      st?.rut || "",
      st?.name || "",
      courseMap.get(att.courseId) || "",
      att.date ? new Date(att.date).toLocaleDateString("es-CL") : "",
      att.status,
      att.justification || "",
    ];
  });
  zip.file("07_registro_asistencia.csv", generateCsv(attendanceHeaders, attendanceRows));

  // --- Table 8: Manifiesto Oficial / LEEME ---
  const readmeContent = `====================================================================
AURENIS - RESPALDO OFICIAL DE INFORMACIÓN INSTITUCIONAL
====================================================================
Colegio: ${school.name}
RBD Oficial: ${school.institutionalCode || "No registrado"}
Identificador de Tenant: ${school.slug} (ID: ${school.id})
Fecha y hora de generación: ${new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" })}
Compresión: ZIP con archivos CSV universales (Codificación UTF-8 con BOM)

GARANTÍA DE SOBERANÍA Y PROPIEDAD DE LOS DATOS:
La información contenida en este archivo es de propiedad exclusiva del
establecimiento educacional. Aurenis garantiza la exportabilidad total
y libre de ataduras (Vendor Lock-in) de todos sus registros académicos,
asistencia y matrícula.

CONTENIDO DEL PAQUETE:
1. 01_colegio_y_configuracion.csv  -> Parámetros de escala, régimen y contacto.
2. 02_usuarios_y_docentes.csv       -> Nómina de personal y roles (sin claves).
3. 03_cursos_y_niveles.csv          -> Estructura de cursos y grados lectivos.
4. 04_estudiantes_matricula.csv     -> Matrícula de estudiantes y datos básicos.
5. 05_asignaturas_y_evaluaciones.csv-> Plan de asignaturas y ponderaciones.
6. 06_calificaciones_historicas.csv -> Notas registradas de cada evaluación.
7. 07_registro_asistencia.csv       -> Bitácora diaria y por bloque de asistencia.

INSTRUCCIONES DE USO:
- Puede abrir cualquiera de los archivos CSV directamente en Microsoft Excel,
  Google Sheets o LibreOffice Calc.
- Para importar en otra base de datos o sistema, utilice el estándar CSV (comas
  como delimitador, campos de texto con comillas dobles).
====================================================================
Aurenis Gestión Escolar
Soporte técnico y consultas: contacto@aurenis.cl
`;
  zip.file("LEEME_RESPALDO_OFICIAL.txt", readmeContent);

  // Generate buffer
  const buffer = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  return { buffer, filename: baseFilename };
}
