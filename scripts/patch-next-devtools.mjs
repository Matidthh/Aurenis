import fs from "fs";
import path from "path";

const files = [
  path.join(process.cwd(), "node_modules/next/dist/server/app-render/entry-base.js"),
  path.join(process.cwd(), "node_modules/next/dist/esm/server/app-render/entry-base.js"),
];

const target = `let SegmentViewNode = ()=>null;
let SegmentViewStateNode = ()=>null;
if (process.env.NODE_ENV === 'development') {
    const mod = require('../../next-devtools/userspace/app/segment-explorer-node');
    SegmentViewNode = mod.SegmentViewNode;
    SegmentViewStateNode = mod.SegmentViewStateNode;
}`;

const replacement = `let SegmentViewNode = ({ children })=>children || null;
let SegmentViewStateNode = ({ children })=>children || null;`;

for (const p of files) {
  try {
    if (fs.existsSync(p)) {
      let content = fs.readFileSync(p, "utf-8");
      if (content.includes(target)) {
        content = content.replace(target, replacement);
        fs.writeFileSync(p, content, "utf-8");
      }
    }
  } catch (err) {
    console.warn("Could not patch Next.js segment explorer:", err);
  }
}
