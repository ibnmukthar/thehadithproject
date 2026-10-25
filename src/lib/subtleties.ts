/**
 * Lata'if al-isnad: the observations a trained reader makes on sight of a
 * chain. The ones here are computed from the narrator records and are facts a
 * reader can check against those records (kind "check"); inferences that need
 * a scholar's eye are entered by hand in the hadith file (kind "scholar").
 * Nothing here is a grade.
 */
import type { Hadith, Narrator, Subtlety } from "@/data/types";
import { placeFor } from "./places";

const ORDINALS: Record<number, { en: string; ar: string }> = {
  3: { en: "thulathi", ar: "ثلاثي" },
  4: { en: "ruba'i", ar: "رباعي" },
  5: { en: "khumasi", ar: "خماسي" },
  6: { en: "sudasi", ar: "سداسي" },
  7: { en: "suba'i", ar: "سباعي" },
  8: { en: "thumani", ar: "ثماني" },
  9: { en: "tusa'i", ar: "تساعي" },
};

const isSuccessor = (n: Narrator) => n.tabaqa !== undefined && n.tabaqa >= 2 && n.tabaqa <= 5;
const isFollower = (n: Narrator) => n.tabaqa !== undefined && n.tabaqa >= 6 && n.tabaqa <= 9;

export function computeSubtleties(h: Hadith, narrators: Record<string, Narrator>): Subtlety[] {
  const out: Subtlety[] = [];
  const chain = h.primary.chain.map((id) => narrators[id]).filter(Boolean);
  if (chain.length < 2) return out;
  const compiler = chain[0];
  const carriers = chain.slice(1); // everyone after the compiler, down to the Companion
  const src = (fields: string) => `Computed from the narrator records (${fields}).`;

  // Length of the chain.
  const between = carriers.length;
  const ord = ORDINALS[between];
  if (ord) {
    const isBukhari = compiler.id === "al-bukhari";
    out.push({
      kind: "check",
      text: `${capitalise(numberWord(between))} narrators between ${compiler.short} and the Prophet ﷺ: a ${ord.en} (${ord.ar}) chain${isBukhari && between === 4 ? ", one of al-Bukhari's ruba'iyyat, his shortest chains" : ""}.`,
      source: src("chain length"),
    });
  }

  // Formulae.
  const links = h.primary.links;
  const explicit = links.filter((l) => l.kind === "sama" || l.kind === "ikhbar").length;
  const an = links.filter((l) => l.kind === "an").length;
  if (links.length > 0) {
    if (explicit === links.length) out.push({ kind: "check", text: "Every link uses a formula of explicit hearing (حدثنا، أخبرنا، سمعت).", source: src("transmission formulae") });
    else if (an > 0) out.push({ kind: "check", text: `${capitalise(numberWord(an))} of ${links.length} links use the unspecified formula ʿan (“from”), which leaves the manner of transmission open.`, source: src("transmission formulae") });
  }

  // Regional runs.
  const places = carriers.map((n) => placeFor(n.region));
  let i = 0;
  while (i < places.length) {
    let j = i;
    while (j + 1 < places.length && places[j + 1] && places[i] && places[j + 1]!.name === places[i]!.name) j++;
    const run = j - i + 1;
    if (places[i] && run >= 3) {
      const names = carriers.slice(i, j + 1).map((n) => n.short);
      const whole = run === carriers.length;
      out.push({
        kind: "check",
        text: whole
          ? `The whole chain below ${compiler.short} is ${places[i]!.demonym}: ${listWords(names)}.`
          : `${capitalise(numberWord(run))} consecutive narrators are ${places[i]!.demonym}: ${listWords(names)}.`,
        source: src("region"),
      });
    }
    i = j + 1;
  }

  // Successor from Successor; Companion from Companion.
  const succPairs: string[] = [];
  for (let k = 0; k + 1 < carriers.length; k++) {
    const student = carriers[k];
    const teacher = carriers[k + 1];
    if (isSuccessor(student) && isSuccessor(teacher)) succPairs.push(`${student.short} from ${teacher.short}`);
    if (student.band === "sahabi" && teacher.band === "sahabi") out.push({ kind: "check", text: `A Companion narrating from a Companion: ${student.short} from ${teacher.short}.`, source: src("standing") });
    if (isFollower(student) && isFollower(teacher) && student.tabaqa === teacher.tabaqa) {
      out.push({ kind: "check", text: `Two narrators of the same generation, one from the other: ${student.short} from ${teacher.short} (both of the ${ordinalWord(student.tabaqa!)} generation).`, source: src("Taqrib generation") });
    }
  }
  if (succPairs.length === 1) out.push({ kind: "check", text: `A Successor narrating from a Successor: ${succPairs[0]}.`, source: src("Taqrib generation") });
  else if (succPairs.length > 1) out.push({ kind: "check", text: `Successors narrating from Successors: ${succPairs.join("; ")}.`, source: src("Taqrib generation") });

  // All six.
  const withRumuz = carriers.filter((n) => n.rumuz && n.rumuz.length > 0 && n.band !== "sahabi");
  if (withRumuz.length > 0 && withRumuz.length === carriers.filter((n) => n.band !== "sahabi").length) {
    const all = withRumuz.filter((n) => n.rumuz!.includes("ع"));
    if (all.length === withRumuz.length) out.push({ kind: "check", text: "Every narrator in this chain is used by all six compilers (ع).", source: src("rumuz") });
    else {
      const not = withRumuz.filter((n) => !n.rumuz!.includes("ع"));
      out.push({ kind: "check", text: `${all.length} of ${withRumuz.length} narrators are used by all six compilers; ${listWords(not.map((n) => `${n.short} (${n.rumuz!.join(" ")})`))} ${not.length === 1 ? "is" : "are"} not.`, source: src("rumuz") });
    }
  }

  // Tadlis, with the formula actually used here.
  for (const n of carriers) {
    if (!n.tadlis) continue;
    const link = links.find((l) => l.to === n.id);
    const how = link ? (link.kind === "sama" || link.kind === "ikhbar" ? `here he says «${link.sighaAr}», explicit hearing` : `here the formula is «${link.sighaAr}», which does not state hearing`) : "";
    out.push({ kind: "check", text: `${n.short} is listed among the mudallisun (rank ${n.tadlis.rank} of 5 in Ibn Hajar's Tabaqat al-Mudallisin)${how ? `; ${how}` : ""}.`, source: `${n.tadlis.source}; ${src("tadlis, transmission formulae")}` });
  }

  // Names.
  for (const n of carriers) {
    if (n.kunya && n.fatherName) {
      const k = n.kunya.replace(/^Ab[uū]\s+/i, "").trim();
      if (k && k.toLowerCase() === n.fatherName.toLowerCase()) out.push({ kind: "check", text: `${n.short}'s kunya matches his father's name (${n.kunya} ibn ${n.fatherName}).`, source: src("kunya, father's name") });
    }
    if (n.laqab) out.push({ kind: "check", text: `${n.short} is known by a title: ${n.laqab.en}${n.laqab.ar ? ` (${n.laqab.ar})` : ""}.`, source: src("laqab") });
    if (n.mawla) out.push({ kind: "check", text: `${n.short} was a client (mawla) of ${n.mawla}.`, source: src("client status") });
  }
  const qurashi = carriers.filter((n) => n.nisbas?.some((x) => /quraysh|qurashi/i.test(x.en)));
  if (qurashi.length >= 2) out.push({ kind: "check", text: `${capitalise(numberWord(qurashi.length))} narrators are of Quraysh: ${listWords(qurashi.map((n) => n.short))}.`, source: src("tribal nisba") });

  // Hand-entered subtleties follow the computed ones.
  for (const s of h.subtleties ?? []) out.push(s);
  return out;
}

function numberWord(n: number): string {
  return ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"][n] ?? String(n);
}
function ordinalWord(n: number): string {
  return ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"][n] ?? `${n}th`;
}
function capitalise(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function listWords(xs: string[]): string {
  if (xs.length <= 1) return xs.join("");
  return `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`;
}
