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
    console.warn("Could not patch Next.js segment explorer in entry-base:", err);
  }
}

// Also neutralize segment-explorer-node.js itself to remove 'use client' directive
const segmentNodeFiles = [
  path.join(process.cwd(), "node_modules/next/dist/next-devtools/userspace/app/segment-explorer-node.js"),
];

const safeSegmentNodeContent = `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SegmentViewNode = function(props) { return (props && props.children) || null; };
exports.SegmentViewStateNode = function(props) { return (props && props.children) || null; };
exports.SegmentBoundaryTriggerNode = function() { return null; };
exports.SegmentStateProvider = function(props) { return (props && props.children) || null; };
exports.useSegmentState = function() { return { boundaryType: null, setBoundaryType: function() {} }; };
exports.SEGMENT_EXPLORER_SIMULATED_ERROR_MESSAGE = "NEXT_DEVTOOLS_SIMULATED_ERROR";
`;

for (const p of segmentNodeFiles) {
  try {
    if (fs.existsSync(p)) {
      fs.writeFileSync(p, safeSegmentNodeContent, "utf-8");
    }
  } catch (err) {
    console.warn("Could not patch segment-explorer-node.js:", err);
  }
}

const encodeUriFiles = [
  path.join(process.cwd(), "node_modules/next/dist/shared/lib/encode-uri-path.js"),
  path.join(process.cwd(), "node_modules/next/dist/esm/shared/lib/encode-uri-path.js"),
];

const encodeTarget = "return file.split('/').map((p)=>encodeURIComponent(p)).join('/');";
const encodeReplacement = "if (!file || typeof file !== 'string') return file || ''; return file.split('/').map((p)=>encodeURIComponent(p)).join('/');";

for (const p of encodeUriFiles) {
  try {
    if (fs.existsSync(p)) {
      let content = fs.readFileSync(p, "utf-8");
      if (content.includes(encodeTarget)) {
        content = content.replace(encodeTarget, encodeReplacement);
        fs.writeFileSync(p, content, "utf-8");
      }
    }
  } catch (err) {
    console.warn("Could not patch encode-uri-path:", err);
  }
}
