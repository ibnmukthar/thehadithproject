/**
 * Teacher/student links are stored on both records. When one side names the
 * other by id and the other side lacks the link, this adds the missing
 * reciprocal entry (name, nameAr, id, sigla copied from the side that has
 * it, and a source saying where it was copied from). Run after a batch of
 * new records, then `pnpm check:data` should report no reciprocity warnings.
 *
 *   pnpm tsx scripts/reciprocate.ts          # apply
 *   pnpm tsx scripts/reciprocate.ts --dry    # report only
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

type Link = { id?: string; name: string; nameAr?: string; sigla?: string[]; source?: string };
type Rec = { id: string; name: string; nameAr: string; teachers?: Link[]; students?: Link[]; [k: string]: unknown };

const dir = join(process.cwd(), "data", "narrators");
const dry = process.argv.includes("--dry");
const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
const recs = new Map<string, Rec>();
for (const f of files) recs.set(f.replace(/\.json$/, ""), JSON.parse(readFileSync(join(dir, f), "utf8")));

const touched = new Set<string>();
let added = 0;
function ensure(target: Rec, key: "teachers" | "students", other: Rec, from: Link) {
  const list = (target[key] ??= []);
  if (list.some((l) => l.id === other.id)) return;
  list.push({ name: other.short as string ?? other.name, nameAr: other.shortAr as string ?? other.nameAr, id: other.id, ...(from.sigla ? { sigla: from.sigla } : {}), source: `reciprocal of the entry in ${other.id}'s record${from.source ? ` (${from.source})` : ""}` });
  touched.add(target.id);
  added++;
  console.log(`${dry ? "would add" : "added"} ${key === "teachers" ? "teacher" : "student"} ${other.id} to ${target.id}`);
}

for (const r of recs.values()) {
  for (const t of r.teachers ?? []) if (t.id && recs.has(t.id)) ensure(recs.get(t.id)!, "students", r, t);
  for (const s of r.students ?? []) if (s.id && recs.has(s.id)) ensure(recs.get(s.id)!, "teachers", r, s);
}
if (!dry) for (const id of touched) writeFileSync(join(dir, `${id}.json`), JSON.stringify(recs.get(id), null, 2) + "\n");
console.log(`${added} reciprocal link(s) ${dry ? "missing" : "added"} across ${touched.size} record(s)`);
