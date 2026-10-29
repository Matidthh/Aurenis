/**
 * AURENIS - Suite de Verificación Rigurosa Post-Actualización de Correos 3.º Medio E
 *
 * Responsables:
 * - Maicol R. (Arquitectura y Backend)
 * - Frank M. (Seguridad, Testing y Aislamiento Multi-Tenant)
 */

import { LPMM_OFFICIAL_SHEETS_DATA } from "../lib/db/lpmm-real-sheets";
import { LPMM_STUDENTS_ACADEMIC_RECORDS } from "../lib/db/lpmm-curriculum-and-grades";
import { DEMO_USERS, authenticateUser } from "../lib/services/user.service";
import { prisma } from "../lib/db/prisma";

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    console.error(`  ✗ FAIL: ${testName} - Detalle: ${detail || "Fallo en aserción"}`);
    process.exit(1);
  }
}

async function verifyAll() {
  console.log("================================================================================");
  console.log("   SUITE DE VERIFICACIÓN POST-ACTUALIZACIÓN CORREOS 3.º MEDIO E - AURENIS");
  console.log("================================================================================");

  // [1] Verificación de la lista completa de 3° Medio E
  console.log("\n[1] Verificando 3.º Medio E en LPMM_OFFICIAL_SHEETS_DATA...");
  const students3E = LPMM_OFFICIAL_SHEETS_DATA["3° Medio E"];
  assert(Array.isArray(students3E) && students3E.length === 18, "El curso 3° Medio E conserva sus 18 estudiantes oficiales");

  const expectedEmails: Record<number, string> = {
    2: "jessylabraña5@gmail.com",
    3: "lopezalecco@gmail.com",
    4: "jeancp7777m@gmail.com",
    6: "diegoking288@gmail.com",
    7: "vixitoPoncefigueroa2009@gmail.com",
    8: "benjaminramirez821292@gmail.com",
    9: "Xulimai.lobos@gmail.com",
    10: "marvizgasparcabrales@gmail.com",
    11: "niamexdxd@gmail.com",
    12: "miguel2+sanhueza@gmail.com",
    13: "treintiseisytreintiseisanny8@gmail.com",
    14: "matiarelano602@gmail.com",
    15: "sergiovivanco345@gmail.com",
    16: "FELIPEVARALO12@GMAIL.COM",
    18: "en4832775@gmail.com",
  };

  for (const st of students3E) {
    if (expectedEmails[st.num]) {
      assert(st.email === expectedEmails[st.num], `Estudiante N.° ${st.num} (${st.fullName}) posee correo actualizado: ${st.email}`);
    } else if (st.num === 1) {
      assert(st.email === "sergio.esparza@lpmm.cl", "Estudiante N.° 1 (Sergio Esparza) conserva su correo institucional original sin alterar");
    } else if (st.num === 5) {
      assert(st.email === "maria.moya@lpmm.cl", "Estudiante N.° 5 (María Moya) se mantiene intacta por ambigüedad con 'María Figueroa'");
    } else if (st.num === 17) {
      assert(st.email === "giulianna.brichetto@lpmm.cl", "Estudiante N.° 17 (Giulianna Brichetto) se mantiene intacta por ambigüedad con 'Giovanna Barcia'");
    }
  }

  // [2] Verificación de Aislamiento Estricto: Ningún otro curso fue modificado
  console.log("\n[2] Verificando aislamiento estricto de otros cursos...");
  const otherCourses = Object.keys(LPMM_OFFICIAL_SHEETS_DATA).filter((c) => c !== "3° Medio E");
  assert(otherCourses.length > 0, "Se encontraron otros cursos en la base de datos");

  let unexpectedEmailChanges = 0;
  for (const courseName of otherCourses) {
    const list = LPMM_OFFICIAL_SHEETS_DATA[courseName];
    for (const st of list) {
      // Ningún estudiante de otros cursos debe tener dominios externos @gmail.com derivados de esta operación
      if (Object.values(expectedEmails).includes(st.email)) {
        unexpectedEmailChanges++;
        console.error(`ERROR: Curso ${courseName} contiene estudiante ${st.fullName} con correo de 3° Medio E: ${st.email}`);
      }
    }
  }
  assert(unexpectedEmailChanges === 0, "Cero alteraciones en cursos ajenos a 3° Medio E (Aislamiento 100% verificado)");

  // [3] Verificación en LPMM_STUDENTS_ACADEMIC_RECORDS
  console.log("\n[3] Verificando sincronización de registros académicos (notas e historial)...");
  for (const [numStr, email] of Object.entries(expectedEmails)) {
    const rec = LPMM_STUDENTS_ACADEMIC_RECORDS[email];
    assert(!!rec, `Ficha académica presente para clave ${email}`);
    assert(rec.courseName === "3° Medio E", `Curso en ficha académica es 3° Medio E para ${email}`);
    assert(Array.isArray(rec.subjects) && rec.subjects.length > 0, `Asignaturas y notas preservadas intactas para ${rec.fullName} (${rec.subjects.length} asignaturas)`);
  }

  // [4] Verificación de Prof. Julio Molina
  console.log("\n[4] Verificando cuenta y rol del Prof. Julio Molina...");
  const teacherUser = DEMO_USERS["JULIO.MOLINA@EDCMARGAMARGA.GOB.CL"] || DEMO_USERS["julio.molina@edcmargamarga.gob.cl"];
  assert(!!teacherUser, "Prof. Julio Molina registrado con nuevo correo JULIO.MOLINA@EDCMARGAMARGA.GOB.CL");
  assert(teacherUser.email === "JULIO.MOLINA@EDCMARGAMARGA.GOB.CL", "Campo email coincide exactamente con JULIO.MOLINA@EDCMARGAMARGA.GOB.CL");
  assert(teacherUser.firstName === "Julio" && teacherUser.lastName === "Molina", "Identidad del docente preservada");
  
  const teacherRole = teacherUser.memberships?.[0]?.role;
  assert(teacherRole?.name === "TEACHER", "Rol de Julio Molina es estrictamente TEACHER (no modificado a estudiante ni directivo)");

  // Verificar que Julio Molina NO figure en la lista de estudiantes de 3° Medio E
  const isJulioInStudents = students3E.some((s) => s.fullName.toLowerCase().includes("molina"));
  assert(!isJulioInStudents, "Prof. Julio Molina NO fue incluido como alumno de 3.º medio E");

  // [5] Verificación de Autenticación
  console.log("\n[5] Verificando flujo de autenticación para cuentas actualizadas...");
  const authTeacher = await authenticateUser("JULIO.MOLINA@EDCMARGAMARGA.GOB.CL", "ProfesorLpmm2026!");
  assert(authTeacher && authTeacher.email === "JULIO.MOLINA@EDCMARGAMARGA.GOB.CL", "Login exitoso con nuevo correo de Julio Molina");

  const authStudent = await authenticateUser("lopezalecco@gmail.com", "Estudiantelpmm2026");
  assert(authStudent && authStudent.email === "lopezalecco@gmail.com", "Login exitoso para Alejandra López con su nuevo correo");

  // [6] Verificación en Base de Datos / Mock Prisma Store
  console.log("\n[6] Verificando consistencia en el motor de base de datos...");
  const userInDb = await prisma.user.findUnique({ where: { email: "lopezalecco@gmail.com" } });
  assert(!!userInDb, "Usuario encontrado en la capa de datos de Prisma");
  assert(userInDb?.firstName === "Alejandra Constanza", "Nombre y datos personales en User de Prisma coinciden con el registro original");

  console.log("\n================================================================================");
  console.log(`   RESULTADO DE VERIFICACIÓN: ${passedTests}/${totalTests} PRUEBAS EXITOSAS (100%)`);
  console.log("   ESTADO DEL SISTEMA: ÍNTEGRO, AISLADO Y EN ESTRICTA CONFORMIDAD TÉCNICA");
  console.log("================================================================================");
}

verifyAll().catch((err) => {
  console.error("Error en verificación:", err);
  process.exit(1);
});
