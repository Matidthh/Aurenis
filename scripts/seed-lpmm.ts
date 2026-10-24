import { createSchoolWithOnboarding } from "../lib/services/school.service";
import { SchoolStatus } from "@prisma/client";

async function seed() {
  console.log("Iniciando seed para Liceo Politécnico Marga Marga...");
  try {
    // Importación directa usando rutas relativas para evitar problemas de path mapping
    // Esta es una solución temporal para el script de seed.
    await createSchoolWithOnboarding({
      name: "Liceo Politécnico Marga Marga",
      slug: "lpmm",
      institutionalCode: "LPMM-8921",
      city: "Quilpué / Marga Marga",
      country: "Chile",
      timezone: "America/Santiago",
      termType: "SEMESTER",
      adminEmail: "director.demo@lpmm.cl",
      adminFirstName: "Director",
      adminLastName: "Demo",
      adminPassword: "AdminPassword2026!",
    });
    console.log("LPMM creado exitosamente.");
  } catch (error) {
    console.error("Error al crear LPMM:", error);
  }
}

seed();
