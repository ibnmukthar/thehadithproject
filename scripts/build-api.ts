/**
 * Emits the static JSON API under public/api/v0 so that the same data the
 * pages render is available to machines, plus the two indexes verify-a-quote
 * uses in the browser. Run before `next build`.
 */
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { HADITH, NARRATORS, narratorsFor, fingerprintOf, listCollections, getBook } from "../src/data";
import { normalizeArabic } from "../src/lib/text";

const root = join(process.cwd(), "public", "api", "v0");
rmSync(root, { recursive: true, force: true });
mkdirSync(join(root, "hadith"), { recursive: true });
mkdirSync(join(root, "narrator"), { recursive: true });
mkdirSync(join(root, "collection"), { recursive: true });

const meta = {
  api: "thehadithproject.com/api/v0",
  status: "prototype",
  licence: "CC BY 4.0 (data); see /blueprint#licensing. Collection texts: see each collection's sources.",
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
  const payload = { meta, id: `thp:${h.primary.cite}`, fingerprint: `sha256:${fingerprintOf(h)}`, ...h, narrators: narratorsFor(h) };
  writeFileSync(join(root, "hadith", `${h.slug}.json`), JSON.stringify(payload, null, 2));
}

writeFileSync(join(root, "narrators.json"), JSON.stringify({ meta, narrators: Object.values(NARRATORS) }, null, 2));
for (const n of Object.values(NARRATORS)) {
  writeFileSync(join(root, "narrator", `${n.id}.json`), JSON.stringify({ meta, ...n }, null, 2));
}

// Collections: one JSON per book (not per narration, to keep the static asset count low).
const fingerprints: { fp: string; cite: string; url: string; label: string; study?: string }[] = [];
const texts: Record<string, string> = {};
const collections = listCollections();
for (const c of collections) {
  mkdirSync(join(root, "collection", c.id), { recursive: true });
  writeFileSync(join(root, "collection", `${c.id}.json`), JSON.stringify({ meta, ...c }, null, 2));
  for (const b of c.books) {
    const book = getBook(c.id, b.book);
    if (!book) continue;
    writeFileSync(join(root, "collection", c.id, `${String(b.book).padStart(3, "0")}.json`), JSON.stringify({ meta, collection: c.id, ...book }));
    for (const n of book.narrations) {
      const cite = `${c.id}:${n.n}`;
      fingerprints.push({ fp: n.fingerprint, cite, url: `/n/${c.id}/${n.n}/`, label: `${c.nameEn} ${n.n}`, study: n.study });
      const matn = n.split ? n.textAr.slice(n.split.at) : n.textAr;
      texts[cite] = normalizeArabic(matn);
    }
  }
}
writeFileSync(join(root, "collections.json"), JSON.stringify({ meta, collections: collections.map((c) => ({ id: c.id, nameEn: c.nameEn, nameAr: c.nameAr, total: c.total, books: c.books.length, json: `/api/v0/collection/${c.id}.json` })) }, null, 2));

// Studied hadith from collections not yet ingested still take part in verification.
for (const h of HADITH) {
  const cite = h.primary.cite;
  if (!fingerprints.some((f) => f.cite === cite)) {
    fingerprints.push({ fp: fingerprintOf(h), cite, url: `/h/${h.slug}/`, label: `${h.primary.collection} ${h.primary.number}`, study: h.slug });
    texts[cite] = normalizeArabic(h.primary.matnAr);
  } else {
    const f = fingerprints.find((x) => x.cite === cite)!;
    f.study = h.slug;
  }
}
writeFileSync(join(root, "fingerprints.json"), JSON.stringify({ generated: meta.generated, entries: fingerprints }));
writeFileSync(join(root, "texts.json"), JSON.stringify({ texts }));

console.log(`API: ${HADITH.length} hadith, ${Object.keys(NARRATORS).length} narrators, ${collections.length} collections (${fingerprints.length} fingerprints) → public/api/v0`);
