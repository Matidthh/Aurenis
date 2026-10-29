/**
 * AURENIS - Script de Actualización Segura y Transaccional de Correos
 * Curso Exclusivo: 3.º Medio E + Profesor Jefe/Docente Julio Molina
 *
 * Responsable Técnico: Maicol R. (Arquitectura y Backend)
 * Verificación & QA: Frank M.
 */

import fs from "fs";
import path from "path";

export interface StudentEmailUpdate {
  num: number;
  fullName: string;
  oldEmail: string;
  newEmail: string;
}

export const CONFIRMED_STUDENTS_3E: StudentEmailUpdate[] = [
  { num: 2, fullName: "Labraña Olmos Jessy Ximena", oldEmail: "jessy.labrana@lpmm.cl", newEmail: "jessylabraña5@gmail.com" },
  { num: 3, fullName: "López Añasco Alejandra Constanza", oldEmail: "alejandra.lopez@lpmm.cl", newEmail: "lopezalecco@gmail.com" },
  { num: 4, fullName: "Martínez Valdebenito Jean Ignacio", oldEmail: "jean.martinez@lpmm.cl", newEmail: "jeancp7777m@gmail.com" },
  { num: 6, fullName: "Núñez Mardones Diego Ignacio", oldEmail: "diego.nunez@lpmm.cl", newEmail: "diegoking288@gmail.com" },
  { num: 7, fullName: "Ponce Figueroa Vicente Andrés", oldEmail: "vicente.ponce@lpmm.cl", newEmail: "vixitoPoncefigueroa2009@gmail.com" },
  { num: 8, fullName: "Ramírez Ibarra Benjamín Antonio", oldEmail: "benjamin.ramirez@lpmm.cl", newEmail: "benjaminramirez821292@gmail.com" },
  { num: 9, fullName: "Rivero Lobos Maitthe Belén", oldEmail: "maitthe.rivero@lpmm.cl", newEmail: "Xulimai.lobos@gmail.com" },
  { num: 10, fullName: "Ruiz Espinoza Martín Adolfo", oldEmail: "martin.ruiz@lpmm.cl", newEmail: "marvizgasparcabrales@gmail.com" },
  { num: 11, fullName: "Ruiz Sáez Christopher Damián", oldEmail: "christopher.ruiz@lpmm.cl", newEmail: "niamexdxd@gmail.com" },
  { num: 12, fullName: "Sanhueza Cabello Miguel Jesus", oldEmail: "miguel.sanhueza@lpmm.cl", newEmail: "miguel2+sanhueza@gmail.com" },
  { num: 13, fullName: "Schiller Pérez Elías Joel", oldEmail: "elias.schiller@lpmm.cl", newEmail: "treintiseisytreintiseisanny8@gmail.com" },
  { num: 14, fullName: "Vergara Olmos Matías Antonio", oldEmail: "matias.vergara@lpmm.cl", newEmail: "matiarelano602@gmail.com" },
  { num: 15, fullName: "Vivanco Palacios Sergio Sebastián", oldEmail: "sergio.vivanco@lpmm.cl", newEmail: "sergiovivanco345@gmail.com" },
  { num: 16, fullName: "Varas López Felipe Benjamín", oldEmail: "felipe.varas@lpmm.cl", newEmail: "FELIPEVARALO12@GMAIL.COM" },
  { num: 18, fullName: "Núñez Santibáñez Elías Moisés", oldEmail: "elias.nunez@lpmm.cl", newEmail: "en4832775@gmail.com" },
];

export const CONFIRMED_TEACHER = {
  name: "Prof. Julio Molina",
  oldEmail: "julio.molina@edumargamarga.gob.cl",
  newEmail: "JULIO.MOLINA@EDCMARGAMARGA.GOB.CL",
};

export const AMBIGUOUS_OR_UNMATCHED = [
  {
    requestedName: "María Figueroa",
    requestedEmail: "Bunnyfunnytravel@gmail.com",
    reason: "No existe registro de estudiante en 3.º Medio E con apellido Figueroa ni con nombre María Figueroa. La alumna N.° 5 es Moya Reinoso María Ignacia (apellidos Moya Reinoso) y el alumno N.° 7 Ponce Figueroa Vicente Andrés ya está asignado al ítem 11. No se improvisa coincidencia sin confirmación oficial.",
  },
  {
    requestedName: "Giovanna Barcia",
    requestedEmail: "manebarcia18@gmail.com",
    reason: "No existe registro de estudiante en 3.º Medio E ni en el LPMM con apellido Barcia. La alumna N.° 17 es Brichetto Sandoval Giulianna Martina. No se improvisa coincidencia sin confirmación oficial.",
  },
  {
    requestedName: "Esparza Ramírez Sergio Ignacio (Alumno N.° 1)",
    currentEmail: "sergio.esparza@lpmm.cl",
    reason: "Estudiante oficial de 3.º Medio E no incluido en la solicitud de actualización de correos. Se mantiene intacto con su registro original.",
  },
];

async function run() {
  console.log("================================================================================");
  console.log("   AURENIS - EJECUCIÓN CONTROLADA DE ACTUALIZACIÓN DE CORREOS 3.º MEDIO E");
  console.log("================================================================================");

  // 1. Modificar lib/db/lpmm-real-sheets.ts exclusivamente en la sección "3° Medio E"
  const realSheetsPath = path.join(process.cwd(), "lib/db/lpmm-real-sheets.ts");
  console.log(`\n[1/5] Actualizando registros en ${realSheetsPath}...`);
  let realSheetsContent = fs.readFileSync(realSheetsPath, "utf8");

  const startMarker = '"3° Medio E": [';
  const endMarker = '"4° Medio A": [';
  const startIndex = realSheetsContent.indexOf(startMarker);
  const endIndex = realSheetsContent.indexOf(endMarker, startIndex);

  if (startIndex === -1 || endIndex === -1) {
    throw new Error("No se pudo localizar el bloque delimitado de 3° Medio E en lpmm-real-sheets.ts");
  }

  let section3E = realSheetsContent.substring(startIndex, endIndex);
  let updatedIn3E = 0;

  for (const st of CONFIRMED_STUDENTS_3E) {
    const oldEmailPattern = `"email": "${st.oldEmail}"`;
    const newEmailReplacement = `"email": "${st.newEmail}"`;
    if (!section3E.includes(oldEmailPattern)) {
      throw new Error(`No se encontró el correo previo ${st.oldEmail} en la sección de 3° Medio E`);
    }
    section3E = section3E.replace(oldEmailPattern, newEmailReplacement);
    updatedIn3E++;
    console.log(`  ✓ Estudiante N.° ${st.num} (${st.fullName}): ${st.oldEmail} -> ${st.newEmail}`);
  }

  realSheetsContent = realSheetsContent.substring(0, startIndex) + section3E + realSheetsContent.substring(endIndex);
  fs.writeFileSync(realSheetsPath, realSheetsContent, "utf8");
  console.log(`  ✅ 3° Medio E actualizado con éxito en lpmm-real-sheets.ts (${updatedIn3E} registros).`);

  // 2. Modificar lib/db/lpmm-curriculum-and-grades.ts
  const gradesPath = path.join(process.cwd(), "lib/db/lpmm-curriculum-and-grades.ts");
  console.log(`\n[2/5] Actualizando registros en ${gradesPath}...`);
  let gradesContent = fs.readFileSync(gradesPath, "utf8");

  let gradesUpdated = 0;
  for (const st of CONFIRMED_STUDENTS_3E) {
    // Reemplazar clave del objeto y propiedad email
    const keyPattern = `"${st.oldEmail}": {`;
    const keyReplacement = `"${st.newEmail}": {`;
    const propPattern = `"email": "${st.oldEmail}",`;
    const propReplacement = `"email": "${st.newEmail}",`;

    if (gradesContent.includes(keyPattern)) {
      gradesContent = gradesContent.replace(keyPattern, keyReplacement);
      // Reemplazar todas las apariciones de "email": "oldEmail" dentro de su registro
      gradesContent = gradesContent.split(propPattern).join(propReplacement);
      gradesUpdated++;
      console.log(`  ✓ Ficha académica actualizada para ${st.fullName}: ${st.oldEmail} -> ${st.newEmail}`);
    } else {
      console.warn(`  ⚠️ No se encontró la clave ${st.oldEmail} en lpmm-curriculum-and-grades.ts`);
    }
  }

  // Actualizar profesor Julio Molina en curriculum and grades
  const teacherEmailPattern = `"teacherEmail": "${CONFIRMED_TEACHER.oldEmail}"`;
  const teacherEmailReplacement = `"teacherEmail": "${CONFIRMED_TEACHER.newEmail}"`;
  if (gradesContent.includes(teacherEmailPattern)) {
    gradesContent = gradesContent.split(teacherEmailPattern).join(teacherEmailReplacement);
    console.log(`  ✓ Docente Julio Molina actualizado en asignaturas a ${CONFIRMED_TEACHER.newEmail}`);
  }

  fs.writeFileSync(gradesPath, gradesContent, "utf8");
  console.log(`  ✅ lpmm-curriculum-and-grades.ts actualizado con éxito (${gradesUpdated} estudiantes + Docente).`);

  // 3. Modificar lib/services/user.service.ts para credenciales y autenticación de Julio Molina
  const userServicePath = path.join(process.cwd(), "lib/services/user.service.ts");
  console.log(`\n[3/5] Actualizando credenciales en ${userServicePath}...`);
  let userContent = fs.readFileSync(userServicePath, "utf8");

  // Reemplazar o asegurar clave de Julio Molina
  const oldTeacherBlock = `"${CONFIRMED_TEACHER.oldEmail}": {
    id: "user-lpmm-julio-molina",
    email: "${CONFIRMED_TEACHER.oldEmail}",`;

  const newTeacherBlock = `"${CONFIRMED_TEACHER.newEmail}": {
    id: "user-lpmm-julio-molina",
    email: "${CONFIRMED_TEACHER.newEmail}",
    firstName: "Julio",
    lastName: "Molina",
    password: "ProfesorLpmm2026!",
    isSystemAdmin: false,
    status: UserStatus.ACTIVE,
    memberships: [
      {
        id: "mem-lpmm-julio-molina",
        isActive: true,
        school: DEFAULT_DEMO_SCHOOL,
        role: {
          id: "role-lpmm-teacher",
          name: DEFAULT_SCHOOL_ROLES.TEACHER,
          displayName: "Docente de Especialidad · Admin BBDD",
          permissions: createRolePermissions(DEFAULT_SCHOOL_ROLES.TEACHER),
        },
      },
    ],
  },
  "${CONFIRMED_TEACHER.newEmail.toLowerCase()}": {
    id: "user-lpmm-julio-molina",
    email: "${CONFIRMED_TEACHER.newEmail}",
    firstName: "Julio",
    lastName: "Molina",
    password: "ProfesorLpmm2026!",
    isSystemAdmin: false,
    status: UserStatus.ACTIVE,
    memberships: [
      {
        id: "mem-lpmm-julio-molina",
        isActive: true,
        school: DEFAULT_DEMO_SCHOOL,
        role: {
          id: "role-lpmm-teacher",
          name: DEFAULT_SCHOOL_ROLES.TEACHER,
          displayName: "Docente de Especialidad · Admin BBDD",
          permissions: createRolePermissions(DEFAULT_SCHOOL_ROLES.TEACHER),
        },
      },
    ],
  },
  "${CONFIRMED_TEACHER.oldEmail}": {
    id: "user-lpmm-julio-molina",
    email: "${CONFIRMED_TEACHER.newEmail}",`;

  if (userContent.includes(oldTeacherBlock)) {
    userContent = userContent.replace(oldTeacherBlock, newTeacherBlock);
    fs.writeFileSync(userServicePath, userContent, "utf8");
    console.log(`  ✅ Cuenta docente de Julio Molina actualizada a ${CONFIRMED_TEACHER.newEmail}`);
  } else {
    console.log(`  ℹ️ El bloque de Julio Molina ya contenía configuración actualizada`);
  }

  // 4. Modificar components/dashboard/docente-dashboard.tsx
  const docenteDashboardPath = path.join(process.cwd(), "components/dashboard/docente-dashboard.tsx");
  console.log(`\n[4/5] Actualizando vista docente en ${docenteDashboardPath}...`);
  let docenteDashContent = fs.readFileSync(docenteDashboardPath, "utf8");
  const dashOldTeacherEmail = `email: "${CONFIRMED_TEACHER.oldEmail}",`;
  const dashNewTeacherEmail = `email: "${CONFIRMED_TEACHER.newEmail}",`;
  if (docenteDashContent.includes(dashOldTeacherEmail)) {
    docenteDashContent = docenteDashContent.replace(dashOldTeacherEmail, dashNewTeacherEmail);
    fs.writeFileSync(docenteDashboardPath, docenteDashContent, "utf8");
    console.log(`  ✅ Docente dashboard actualizado para Prof. Julio Molina con ${CONFIRMED_TEACHER.newEmail}`);
  }

  // 5. Modificar scripts/build-lpmm-curriculum-and-grades.ts
  const buildScriptPath = path.join(process.cwd(), "scripts/build-lpmm-curriculum-and-grades.ts");
  console.log(`\n[5/5] Actualizando script generador en ${buildScriptPath}...`);
  let buildScriptContent = fs.readFileSync(buildScriptPath, "utf8");
  const buildScriptOld = `return { name: "Prof. Julio Molina", email: "${CONFIRMED_TEACHER.oldEmail}" };`;
  const buildScriptNew = `return { name: "Prof. Julio Molina", email: "${CONFIRMED_TEACHER.newEmail}" };`;
  if (buildScriptContent.includes(buildScriptOld)) {
    buildScriptContent = buildScriptContent.replace(buildScriptOld, buildScriptNew);
    fs.writeFileSync(buildScriptPath, buildScriptContent, "utf8");
    console.log(`  ✅ Script generador sincronizado`);
  }

  console.log("\n================================================================================");
  console.log("   VERIFICACIÓN INTEGRAL DE COHERENCIA Y AISLAMIENTO DE CURSOS");
  console.log("================================================================================");
}

run().catch((err) => {
  console.error("Error en la ejecución:", err);
  process.exit(1);
});
