import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = ["src"];
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".md"]);

const BANNED = [
  { term: "Node", pattern: /\bNode\b/ },
  { term: "Command", pattern: /\bCommand\b/ },
  { term: "Dominate", pattern: /\bDominate\b/i },
  { term: "Autonomous", pattern: /\bAutonomous\b/i },
];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(path)));
    } else if (EXTENSIONS.has(entry.name.slice(entry.name.lastIndexOf(".")))) {
      files.push(path);
    }
  }
  return files;
}

const hits = [];

for (const dir of SCAN_DIRS) {
  const files = await walk(join(ROOT, dir));
  for (const file of files) {
    const text = await readFile(file, "utf8");
    const lines = text.split("\n");
    lines.forEach((line, index) => {
      if (line.includes("banned-terms") || line.includes("BANNED")) return;
      for (const rule of BANNED) {
        if (rule.pattern.test(line)) {
          hits.push(
            `${relative(ROOT, file)}:${index + 1} — "${rule.term}" in: ${line.trim()}`,
          );
        }
      }
    });
  }
}

if (hits.length) {
  console.error("Banned terms found:\n");
  for (const hit of hits) console.error(`  ${hit}`);
  process.exit(1);
}

console.log("Copy lint passed: no banned terms in src/.");
