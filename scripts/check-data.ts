/**
 * Validates every record under /data against the schema and runs the
 * integrity checks a reviewer would otherwise do by eye. Run in CI and before
 * every build. Exit code 1 on any failure.
 */
import { HADITH, NARRATORS, listCollections, allNarrations } from "../src/data";

const errors: string[] = [];
const warnings: string[] = [];

// Chains refer to narrators that exist; links refer to chain members.
for (const h of HADITH) {
  for (const id of h.primary.chain) if (!NARRATORS[id]) errors.push(`${h.slug}: chain names unknown narrator "${id}"`);
  const members = new Set(["prophet", ...h.primary.chain]);
  for (const l of h.primary.links) {
    if (!members.has(l.from) || !members.has(l.to)) errors.push(`${h.slug}: link ${l.from}->${l.to} names someone not in the chain`);
  }
  if (h.primary.links.length !== h.primary.chain.length) warnings.push(`${h.slug}: ${h.primary.chain.length} narrators but ${h.primary.links.length} links`);
  if (h.fanOut && !members.has(h.fanOut.afterId)) errors.push(`${h.slug}: fanOut.afterId "${h.fanOut.afterId}" not in chain`);
  for (const v of h.verdicts) if (!v.source) errors.push(`${h.slug}: verdict by ${v.scholar} has no source`);
}

// Narrator graph: teacher/student links are reciprocal when both have records.
for (const n of Object.values(NARRATORS)) {
  for (const t of n.teachers ?? []) {
    if (t.id && NARRATORS[t.id] && !(NARRATORS[t.id].students ?? []).some((s) => s.id === n.id)) warnings.push(`${n.id} lists ${t.id} as teacher but ${t.id} does not list ${n.id} as student`);
    if (t.id && !NARRATORS[t.id]) warnings.push(`${n.id}: teacher id "${t.id}" has no record`);
  }
  for (const s of n.students ?? []) {
    if (s.id && NARRATORS[s.id] && !(NARRATORS[s.id].teachers ?? []).some((t) => t.id === n.id)) warnings.push(`${n.id} lists ${s.id} as student but ${s.id} does not list ${n.id} as teacher`);
  }
  for (const v of n.verdicts) if (!v.source) errors.push(`${n.id}: verdict by ${v.critic} has no source`);
  if (n.born && n.died && n.born > n.died) errors.push(`${n.id}: born after death`);
  if (n.tabaqa && n.taqrib?.rank && n.band === "sahabi" && n.tabaqa !== 1) warnings.push(`${n.id}: a Companion should be tabaqa 1`);
}

// Collections: numbers unique within a collection; fingerprints present.
for (const c of listCollections()) {
  const seen = new Set<string>();
  let count = 0;
  for (const { narration } of allNarrations(c.id)) {
    count++;
    if (seen.has(narration.n)) errors.push(`${c.id}: duplicate number ${narration.n}`);
    seen.add(narration.n);
    if (!narration.fingerprint) errors.push(`${c.id}:${narration.n} missing fingerprint`);
  }
  if (count !== c.total) warnings.push(`${c.id}: collection.json says ${c.total} narrations, books hold ${count}`);
}

for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(`error ${e}`);
console.log(`checked ${Object.keys(NARRATORS).length} narrators, ${HADITH.length} hadith, ${listCollections().length} collections: ${errors.length} errors, ${warnings.length} warnings`);
if (errors.length) process.exit(1);
