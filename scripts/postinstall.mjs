import { execSync } from "child_process";
import fs from "fs";
import path from "path";

async function runPostinstall() {
  const root = process.cwd();

  // 1. Prisma Client Generation
  try {
    const prismaClientPath = path.join(root, "node_modules", "@prisma", "client", "index.js");
    if (!fs.existsSync(prismaClientPath)) {
      const localPrisma = path.join(root, "node_modules", ".bin", "prisma");
      if (fs.existsSync(localPrisma)) {
        execSync(`"${localPrisma}" generate`, { stdio: "inherit", timeout: 15000 });
      } else {
        execSync("npx prisma generate", { stdio: "inherit", timeout: 15000 });
      }
    }
  } catch (err) {
    console.warn("[postinstall] Notice: prisma generate deferred or handled gracefully:", err?.message || err);
  }

  // 2. Ensure Next.js manifest directories exist to prevent dev/build crashes
  try {
    const nextDir = path.join(root, ".next");
    const serverDir = path.join(nextDir, "server");
    fs.mkdirSync(nextDir, { recursive: true });
    fs.mkdirSync(serverDir, { recursive: true });
    fs.mkdirSync(path.join(serverDir, "vendor-chunks"), { recursive: true });
    fs.mkdirSync(path.join(nextDir, "cache", "webpack", "server-development"), { recursive: true });
    fs.mkdirSync(path.join(nextDir, "cache", "webpack", "client-development"), { recursive: true });

    const routesManifest = path.join(nextDir, "routes-manifest.json");
    if (!fs.existsSync(routesManifest)) {
      fs.writeFileSync(
        routesManifest,
        JSON.stringify(
          {
            version: 3,
            pages404: true,
            caseSensitive: false,
            basePath: "",
            redirects: [],
            headers: [],
            dynamicRoutes: [],
            staticRoutes: [],
            dataRoutes: [],
            rsc: {
              header: "RSC",
              varyHeader: "RSC, Next-Router-State-Tree, Next-Router-Prefetch",
              prefetchHeader: "Next-Router-Prefetch",
              didPostponeHeader: "x-nextjs-postponed",
              contentTypeHeader: "text/x-component",
              suffix: ".rsc",
              prefetchSuffix: ".prefetch.rsc",
            },
            rewrites: [],
          },
          null,
          2
        ),
        "utf-8"
      );
    }
  } catch (err) {
    // Non-fatal
  }

  // 3. Patch Next Devtools if script exists
  try {
    const patchScript = path.join(root, "scripts", "patch-next-devtools.mjs");
    if (fs.existsSync(patchScript)) {
      await import("./patch-next-devtools.mjs");
    }
  } catch (err) {
    // Non-fatal
  }
}

runPostinstall().then(
  () => {
    process.exit(0);
  },
  () => {
    process.exit(0);
  }
);
