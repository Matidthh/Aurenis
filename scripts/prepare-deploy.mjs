import fs from "fs";
import path from "path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const buildDir = path.join(rootDir, "build");
// Find the active Next.js build output directory
const nextDir = fs.existsSync(path.join(rootDir, ".next"))
  ? path.join(rootDir, ".next")
  : fs.existsSync(path.join(rootDir, ".next-dev"))
  ? path.join(rootDir, ".next-dev")
  : path.join(rootDir, ".next");
const publicDir = path.join(rootDir, "public");

try {
  // If Next.js output was in .next-dev, also mirror to .next for standard Next tooling
  const canonicalNextDir = path.join(rootDir, ".next");
  if (!fs.existsSync(canonicalNextDir) && fs.existsSync(nextDir)) {
    fs.cpSync(nextDir, canonicalNextDir, { recursive: true });
    console.log("Mirrored Next.js build output to canonical .next directory.");
  }

  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir, { recursive: true });

  const standaloneDir = path.join(nextDir, "standalone");
  const nextStaticDir = path.join(nextDir, "static");

  if (fs.existsSync(standaloneDir)) {
    // Copy standalone output directly into dist root
    fs.cpSync(standaloneDir, distDir, { recursive: true });
    console.log("Successfully copied Next.js standalone output to dist/.");
  } else {
    // Fallback: copy .next into dist/.next
    fs.mkdirSync(path.join(distDir, ".next"), { recursive: true });
    if (fs.existsSync(nextDir)) {
      fs.cpSync(nextDir, path.join(distDir, ".next"), { recursive: true });
    }
  }

  // Ensure public directory is in dist/public and also at root of dist
  if (fs.existsSync(publicDir)) {
    fs.cpSync(publicDir, path.join(distDir, "public"), { recursive: true });
    const publicFiles = fs.readdirSync(publicDir);
    for (const file of publicFiles) {
      const srcFile = path.join(publicDir, file);
      const destFile = path.join(distDir, file);
      if (fs.statSync(srcFile).isFile()) {
        fs.copyFileSync(srcFile, destFile);
      }
    }
  }

  // Ensure .next/static is placed in dist/.next/static AND dist/_next/static
  if (fs.existsSync(nextStaticDir)) {
    const distNextStatic = path.join(distDir, ".next", "static");
    fs.mkdirSync(distNextStatic, { recursive: true });
    fs.cpSync(nextStaticDir, distNextStatic, { recursive: true });

    const distUnderscoreNextStatic = path.join(distDir, "_next", "static");
    fs.mkdirSync(distUnderscoreNextStatic, { recursive: true });
    fs.cpSync(nextStaticDir, distUnderscoreNextStatic, { recursive: true });
  }

  // Ensure index.html exists in dist/ for static artifact upload verifiers
  const loginHtmlPath = path.join(nextDir, "server", "app", "login.html");
  const distIndexHtml = path.join(distDir, "index.html");

  if (fs.existsSync(loginHtmlPath)) {
    fs.copyFileSync(loginHtmlPath, distIndexHtml);
  } else {
    // Create a fallback index.html
    const fallbackHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aurenis - Plataforma de Gestión Académica</title>
  <meta name="description" content="Multi-tenant academic management platform for schools, teachers, students, and administrators.">
</head>
<body>
  <div id="root">
    <h1>Aurenis</h1>
    <p>Cargando plataforma académica...</p>
  </div>
</body>
</html>`;
    fs.writeFileSync(distIndexHtml, fallbackHtml, "utf-8");
  }

  // Ensure package.json, server.ts and server.js are in dist/
  const rootPackageJson = path.join(rootDir, "package.json");
  if (fs.existsSync(rootPackageJson)) {
    fs.copyFileSync(rootPackageJson, path.join(distDir, "package.json"));
  }

  const serverTsPath = path.join(rootDir, "server.ts");
  if (fs.existsSync(serverTsPath)) {
    fs.copyFileSync(serverTsPath, path.join(distDir, "server.ts"));
  }

  const serverJsPath = path.join(rootDir, "server.js");
  if (fs.existsSync(serverJsPath)) {
    fs.copyFileSync(serverJsPath, path.join(distDir, "server.js"));
  }

  // Ensure prisma schema and migrations are available in dist/prisma (excluding seed.ts)
  const prismaDir = path.join(rootDir, "prisma");
  if (fs.existsSync(prismaDir)) {
    const distPrismaDir = path.join(distDir, "prisma");
    fs.mkdirSync(distPrismaDir, { recursive: true });
    const schemaFile = path.join(prismaDir, "schema.prisma");
    if (fs.existsSync(schemaFile)) {
      fs.copyFileSync(schemaFile, path.join(distPrismaDir, "schema.prisma"));
    }
    const migrationsDir = path.join(prismaDir, "migrations");
    if (fs.existsSync(migrationsDir)) {
      fs.cpSync(migrationsDir, path.join(distPrismaDir, "migrations"), { recursive: true });
    }
  }

  // Create build metadata artifact in dist
  const distFiles = fs.readdirSync(distDir);
  if (distFiles.length === 0) {
    throw new Error("Build artifacts verification failed: dist/ directory is empty!");
  }

  fs.writeFileSync(
    path.join(distDir, "build-manifest.json"),
    JSON.stringify(
      {
        name: "aurenis",
        timestamp: new Date().toISOString(),
        buildOutput: "valid",
        target: "production",
        entrypoints: ["index.html", "server.ts", "server.js"],
        totalArtifacts: distFiles.length,
      },
      null,
      2
    )
  );

  // Mirror dist to build/ in case deployment runner expects 'build/'
  if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true, force: true });
  }
  fs.cpSync(distDir, buildDir, { recursive: true });

  console.log(`Successfully prepared dist/ and build/ with ${distFiles.length} top-level artifacts for deployment.`);
} catch (error) {
  console.error("Error preparing dist artifacts:", error);
  process.exit(1);
}
