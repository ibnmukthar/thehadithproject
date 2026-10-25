import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, extname, relative } from "node:path";
const dir = process.argv[2]; const outFile = process.argv[3];
const manifest = {};
function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else {
      const rel = "/" + relative(dir, p).split("\\").join("/");
      if (rel === "/_headers") continue;
      const buf = readFileSync(p);
      const ext = extname(p).slice(1);
      const hash = createHash("sha256").update(buf.toString("base64") + ext).digest("hex").slice(0, 32);
      manifest[rel] = { hash, size: buf.length };
    }
  }
}
walk(dir);
writeFileSync(outFile, JSON.stringify(manifest));
const total = Object.values(manifest).reduce((a, b) => a + b.size, 0);
console.log(`files=${Object.keys(manifest).length} bytes=${total}`);
