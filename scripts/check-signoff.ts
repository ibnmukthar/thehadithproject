/**
 * Pull-request guard: a change to the substance of a record needs a sign-off
 * from a member of the editorial board (data/board.json). Usage:
 *
 *   tsx scripts/check-signoff.ts <base-ref>
 *
 * Compares the working tree against <base-ref> (default origin/main), finds
 * changed files under data/, and for each one whose guarded fields changed
 * requires review.signoffs to contain an "approved" decision by a board member
 * whose `reviews` covers that kind of record. Exit 1 when a sign-off is missing.
 */
import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";

const base = process.argv[2] ?? "origin/main";
const board = JSON.parse(readFileSync("data/board.json", "utf8")) as { members: { who: string; role: string; reviews: string[] }[] };

const GUARDED: Record<string, string[]> = {
  narrators: ["band", "taqrib", "verdicts", "tadlis", "ikhtilat", "notHeardFrom", "rumuz", "teachers", "students"],
  hadith: ["status", "verdicts", "primary", "also", "subtleties", "explanation"],
  collections: ["chain", "split"],
};

function kindOf(path: string): keyof typeof GUARDED | null {
  if (path.startsWith("data/narrators/")) return "narrators";
  if (path.startsWith("data/hadith/")) return "hadith";
  if (path.startsWith("data/collections/") && path.includes("/books/")) return "collections";
  return null;
}

function readAt(ref: string, path: string): unknown | null {
  try {
    return JSON.parse(execSync(`git show ${ref}:${path}`, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));
  } catch {
    return null;
  }
}

const changed = execSync(`git diff --name-only ${base} -- data/`, { encoding: "utf8" }).split("\n").filter(Boolean);
let failures = 0;
for (const path of changed) {
  const kind = kindOf(path);
  if (!kind || !existsSync(path)) continue;
  const now = JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>;
  const before = (readAt(base, path) as Record<string, unknown> | null) ?? {};
  const fields = GUARDED[kind];
  const touched = (obj: Record<string, unknown>, prev: Record<string, unknown>) => fields.filter((f) => JSON.stringify(obj[f]) !== JSON.stringify(prev[f]));

  // Collection books hold many narrations; compare each narration by number.
  let changedFields: string[] = [];
  if (kind === "collections") {
    const prevByN = new Map(((before.narrations as { n: string }[]) ?? []).map((x) => [x.n, x as Record<string, unknown>]));
    for (const n of (now.narrations as Record<string, unknown>[]) ?? []) {
      const p = prevByN.get(n.n as string) ?? {};
      const t = touched(n, p);
      if (t.length && (n.chain as { status?: string } | undefined)?.status === "reviewed") changedFields.push(`${n.n}:${t.join(",")}`);
    }
  } else {
    changedFields = touched(now, before);
  }
  if (changedFields.length === 0) continue;

  const review = (now.review as { signoffs?: { who: string; decision: string }[] } | undefined) ?? {};
  const ok = (review.signoffs ?? []).some((s) => s.decision === "approved" && board.members.some((m) => m.who === s.who && m.reviews.includes(kind)));
  if (!ok) {
    failures++;
    console.error(`sign-off missing: ${path} changes ${changedFields.join(", ")} and has no "approved" sign-off from a board member who reviews ${kind}`);
  } else {
    console.log(`ok  ${path}`);
  }
}
console.log(`${changed.length} data file(s) changed against ${base}; ${failures} missing sign-off(s)`);
if (failures) process.exit(1);
