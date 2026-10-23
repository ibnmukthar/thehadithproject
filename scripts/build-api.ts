/**
 * Emits the static JSON API under public/api/v0 so that the same data the
 * pages render is available to machines. Run before `next build`.
 */
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { HADITH, NARRATORS, narratorsFor, fingerprintOf } from "../src/data";

const root = join(process.cwd(), "public", "api", "v0");
rmSync(root, { recursive: true, force: true });
mkdirSync(join(root, "hadith"), { recursive: true });
mkdirSync(join(root, "narrator"), { recursive: true });

const meta = {
  api: "thehadithproject.com/api/v0",
  status: "prototype",
  licence: "CC BY 4.0 (data); see /blueprint#licensing",
  generated: new Date().toISOString(),
};

const index = HADITH.map((h) => ({
  id: `thp:${h.primary.cite}`,
  slug: h.slug,
  title: h.title,
  titleAr: h.titleAr,
  status: h.status,
  fingerprint: `sha256:${fingerprintOf(h)}`,
  url: `https://thehadithproject.com/h/${h.slug}/`,
  json: `https://thehadithproject.com/api/v0/hadith/${h.slug}.json`,
}));
writeFileSync(join(root, "hadith.json"), JSON.stringify({ meta, hadith: index }, null, 2));

for (const h of HADITH) {
  const payload = {
    meta,
    id: `thp:${h.primary.cite}`,
    fingerprint: `sha256:${fingerprintOf(h)}`,
    ...h,
    narrators: narratorsFor(h),
  };
  writeFileSync(join(root, "hadith", `${h.slug}.json`), JSON.stringify(payload, null, 2));
}

writeFileSync(join(root, "narrators.json"), JSON.stringify({ meta, narrators: Object.values(NARRATORS) }, null, 2));
for (const n of Object.values(NARRATORS)) {
  writeFileSync(join(root, "narrator", `${n.id}.json`), JSON.stringify({ meta, ...n }, null, 2));
}
console.log(`API: ${HADITH.length} hadith, ${Object.keys(NARRATORS).length} narrators → public/api/v0`);
