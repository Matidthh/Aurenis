import * as fs from "fs";
import * as path from "path";

const SHEETS = [
  { courseName: "1° Medio A", grade: 1, letter: "A", gid: "1329672806" },
  { courseName: "1° Medio B", grade: 1, letter: "B", gid: "437015979" },
  { courseName: "1° Medio C", grade: 1, letter: "C", gid: "664540817" },
  { courseName: "2° Medio A", grade: 2, letter: "A", gid: "1362247606" },
  { courseName: "2° Medio B", grade: 2, letter: "B", gid: "604877310" },
  { courseName: "2° Medio C", grade: 2, letter: "C", gid: "964316673" },
];

const DATA_DIR = path.join(process.cwd(), "data", "lpmm-sheets");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

async function downloadAndExtract() {
  const allCoursesData: Record<string, any[]> = {};

  for (const sheet of SHEETS) {
    const url = `https://docs.google.com/spreadsheets/d/17BifUPMYr-sxb76AM9iDp1pHC639sphvRwfQzsDe4XU/export?format=csv&gid=${sheet.gid}`;
    console.log(`📥 Descargando ${sheet.courseName} (gid: ${sheet.gid})...`);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`❌ Error al descargar ${sheet.courseName}: ${response.statusText}`);
        continue;
      }
      const csvText = await response.text();
      const filePath = path.join(DATA_DIR, `${sheet.grade}${sheet.letter}.csv`);
      fs.writeFileSync(filePath, csvText, "utf8");
      console.log(`   ✅ Guardado en ${filePath} (${csvText.length} bytes)`);

      // Parsear líneas de alumnos
      const lines = csvText.split(/\r?\n/);
      const students: Array<{ num: number; fullName: string; rawRow: string }> = [];

      for (const line of lines) {
        const trimmed = line.trim();
        // Regex para capturar filas que empiezan con número de lista y nombre
        const match = trimmed.match(/^([0-9]{1,3})\s*,\s*([a-zA-ZáéíóúñÁÉÍÓÚÑ\s\.\-'\(\)]+?),/i);
        if (match) {
          const num = parseInt(match[1], 10);
          const rawName = match[2].trim().replace(/^["']|["']$/g, "").trim();
          if (rawName && rawName.length > 3 && !rawName.toLowerCase().includes("promedio") && !rawName.toLowerCase().includes("asignatura") && !rawName.toLowerCase().includes("nombre")) {
            // Capitalizar nombre
            const formattedName = rawName
              .toLowerCase()
              .split(/\s+/)
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ");
            students.push({
              num,
              fullName: formattedName,
              rawRow: trimmed,
            });
          }
        }
      }

      console.log(`   🎓 ${sheet.courseName}: ${students.length} estudiantes reales extraídos.`);
      allCoursesData[sheet.courseName] = students;
    } catch (err: any) {
      console.error(`❌ Falló la descarga de ${sheet.courseName}:`, err.message);
    }
  }

  const jsonPath = path.join(DATA_DIR, "lpmm-parsed-courses.json");
  fs.writeFileSync(jsonPath, JSON.stringify(allCoursesData, null, 2), "utf8");
  console.log(`\n🎉 Datos consolidados guardados en: ${jsonPath}`);
}

downloadAndExtract();
