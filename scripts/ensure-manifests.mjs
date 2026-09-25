import fs from "fs";
import path from "path";

const root = process.cwd();
const dirsToEnsure = [path.join(root, ".next"), path.join(root, ".next-dev")];

for (const targetDir of dirsToEnsure) {
  const serverDir = path.join(targetDir, "server");
  const pagesDir = path.join(serverDir, "pages");

  try {
    fs.mkdirSync(targetDir, { recursive: true });
    fs.mkdirSync(serverDir, { recursive: true });
    fs.mkdirSync(pagesDir, { recursive: true });
    fs.mkdirSync(path.join(targetDir, "cache", "webpack", "server-development"), { recursive: true });
    fs.mkdirSync(path.join(targetDir, "cache", "webpack", "client-development"), { recursive: true });

    function ensureJson(filePath, defaultContent) {
      if (!fs.existsSync(filePath)) {
        try {
          fs.writeFileSync(filePath, JSON.stringify(defaultContent, null, 2), "utf-8");
        } catch (e) {
          // Silently ignore if cannot write
        }
      }
    }

    ensureJson(path.join(targetDir, "routes-manifest.json"), {
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
    });

    ensureJson(path.join(serverDir, "app-paths-manifest.json"), {});
    ensureJson(path.join(serverDir, "pages-manifest.json"), {});
    ensureJson(path.join(targetDir, "build-manifest.json"), {
      polyfillFiles: [],
      devFiles: [],
      ampDevFiles: [],
      lowPriorityFiles: [],
      rootMainFiles: [],
      pages: {},
      ampFirstPages: [],
    });
    ensureJson(path.join(targetDir, "app-build-manifest.json"), {
      pages: {},
    });
  } catch (err) {
    // Graceful fallback
  }
}
