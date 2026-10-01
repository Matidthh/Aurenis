import fs from "fs";
import path from "path";

const SPREADSHEET_ID = "17BifUPMYr-sxb76AM9iDp1pHC639sphvRwfQzsDe4XU";

const SHEETS = [
  { courseCode: "1A", gradeLevel: 1, section: "A", name: "1° Medio A", gid: "1329672806" },
  { courseCode: "1B", gradeLevel: 1, section: "B", name: "1° Medio B", gid: "437015979" },
  { courseCode: "1C", gradeLevel: 1, section: "C", name: "1° Medio C", gid: "664540817" },
  { courseCode: "2A", gradeLevel: 2, section: "A", name: "2° Medio A", gid: "1362247606" },
  { courseCode: "2B", gradeLevel: 2, section: "B", name: "2° Medio B", gid: "604877310" },
  { courseCode: "2C", gradeLevel: 2, section: "C", name: "2° Medio C", gid: "964316673" },
  { courseCode: "3A", gradeLevel: 3, section: "A", name: "3° Medio A", gid: "174334186" },
  { courseCode: "3C", gradeLevel: 3, section: "C", name: "3° Medio C", gid: "341221371" },
  { courseCode: "3D", gradeLevel: 3, section: "D", name: "3° Medio D", gid: "1038326600" },
  { courseCode: "3E", gradeLevel: 3, section: "E", name: "3° Medio E", gid: "1620326807" },
  { courseCode: "4A", gradeLevel: 4, section: "A", name: "4° Medio A", gid: "1699414989" },
  { courseCode: "4C", gradeLevel: 4, section: "C", name: "4° Medio C", gid: "1905992605" },
  { courseCode: "4D", gradeLevel: 4, section: "D", name: "4° Medio D", gid: "2098405345" },
  { courseCode: "4E", gradeLevel: 4, section: "E", name: "4° Medio E", gid: "290032122" },
];

async function fetchCsv(gid: string): Promise<string> {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${gid}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch sheet gid ${gid}: ${res.statusText}`);
  }
  return await res.text();
}

// Simple CSV parser supporting quotes
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

interface ParsedSubjectCol {
  name: string;
  semester: 1 | 2;
  gradeCols: number[];
  avgCol?: number;
}

async function main() {
  const outputDir = path.join(process.cwd(), "scripts/sheets-data");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const allCoursesData: any[] = [];

  for (const sheet of SHEETS) {
    console.log(`Downloading ${sheet.courseCode} (gid: ${sheet.gid})...`);
    const rawCsv = await fetchCsv(sheet.gid);
    fs.writeFileSync(path.join(outputDir, `${sheet.courseCode}.csv`), rawCsv);

    const lines = rawCsv.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length < 3) {
      console.warn(`Warning: ${sheet.courseCode} has less than 3 lines`);
      continue;
    }

    const headerRow1 = parseCSVLine(lines[0]);
    const headerRow2 = parseCSVLine(lines[1]);

    // Parse subjects from headerRow1 and headerRow2
    const subjectsMap = new Map<string, { name: string; cols: { index: number; label: string }[] }>();
    let currentSubject = "";
    for (let c = 2; c < headerRow1.length; c++) {
      const sName = headerRow1[c]?.trim();
      if (sName) {
        currentSubject = sName;
      }
      if (currentSubject) {
        if (!subjectsMap.has(currentSubject)) {
          subjectsMap.set(currentSubject, { name: currentSubject, cols: [] });
        }
        const label = headerRow2[c]?.trim() || `Col_${c}`;
        subjectsMap.get(currentSubject)!.cols.push({ index: c, label });
      }
    }

    const students: any[] = [];
    for (let r = 2; r < lines.length; r++) {
      const row = parseCSVLine(lines[r]);
      const listNumStr = row[0]?.trim();
      const rawName = row[1]?.trim();
      if (!rawName || rawName.length < 2) continue;
      // Filter out total/average rows if any
      if (/^(promedio|total|alumnos|asistencia)/i.test(rawName)) continue;

      const num = parseInt(listNumStr, 10) || students.length + 1;
      const cleanName = capitalizeWords(rawName);

      // Extract subject grades
      const subjectGrades: Record<string, number[]> = {};
      const subjectAverages: Record<string, number | null> = {};

      subjectsMap.forEach((sub, subName) => {
        const grades: number[] = [];
        sub.cols.forEach(col => {
          const val = row[col.index]?.trim().replace(",", ".");
          const numVal = parseFloat(val);
          if (!isNaN(numVal) && numVal > 0) {
            if (col.label.toUpperCase().includes("PROMEDIO")) {
              subjectAverages[subName] = numVal;
            } else if (/^N\d+$/i.test(col.label)) {
              grades.push(numVal);
            }
          }
        });
        if (grades.length > 0) {
          subjectGrades[subName] = grades;
        }
      });

      students.push({
        listNumber: num,
        fullName: cleanName,
        subjectGrades,
        subjectAverages
      });
    }

    console.log(`Parsed ${sheet.courseCode}: ${students.length} students found.`);
    allCoursesData.push({
      courseCode: sheet.courseCode,
      gradeLevel: sheet.gradeLevel,
      section: sheet.section,
      name: sheet.name,
      subjects: Array.from(subjectsMap.keys()),
      students
    });
  }

  fs.writeFileSync(
    path.join(process.cwd(), "lib/db/all-lpmm-sheets.json"),
    JSON.stringify(allCoursesData, null, 2)
  );
  console.log(`All courses written to lib/db/all-lpmm-sheets.json (${allCoursesData.length} courses, total students: ${allCoursesData.reduce((acc, c) => acc + c.students.length, 0)})`);
}

main().catch(err => {
  console.error("Error fetching sheets:", err);
  process.exit(1);
});
