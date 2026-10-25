/**
 * After `next build` (static export): remove the per-page segment-prefetch
 * files (`__next.*.txt`). Next 16 writes four of them beside every page; with
 * a whole collection of narration pages that multiplies the file count past
 * the hosting plan's static-asset limit. Each page keeps its HTML and its RSC
 * payload (`index.txt`), which client-side navigation falls back to.
 */
import { readdirSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), "out");
let removed = 0;
let kept = 0;
function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (/^__next\..*\.txt$/.test(e)) {
      rmSync(p);
      removed++;
    } else kept++;
  }
}
walk(root);
console.log(`prune-export: removed ${removed} segment-prefetch files, ${kept} files remain in out/`);
