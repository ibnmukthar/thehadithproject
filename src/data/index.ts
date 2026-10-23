import type { Hadith, Narrator } from "./types";
import { NARRATORS as N1 } from "./narrators";
import { NARRATORS_TIRMIDHI_2317 } from "./narrators-tirmidhi";
import { NARRATORS_KHATIB_RIHLA_1 } from "./narrators-khatib";
import { actionsByIntentions } from "./hadith/actions-by-intentions";
import { leavingWhatDoesNotConcern } from "./hadith/leaving-what-does-not-concern";
import { seekKnowledgeEvenInChina } from "./hadith/seek-knowledge-even-in-china";
import { fingerprint } from "@/lib/text";

export const NARRATORS: Record<string, Narrator> = { ...N1, ...NARRATORS_TIRMIDHI_2317, ...NARRATORS_KHATIB_RIHLA_1 };

export const HADITH: Hadith[] = [actionsByIntentions, leavingWhatDoesNotConcern, seekKnowledgeEvenInChina];

export function getHadith(slug: string): Hadith | undefined {
  return HADITH.find((h) => h.slug === slug);
}

export function getNarrator(id: string): Narrator | undefined {
  return NARRATORS[id];
}

export function narratorsFor(h: Hadith): Record<string, Narrator> {
  const out: Record<string, Narrator> = {};
  for (const id of h.primary.chain) if (NARRATORS[id]) out[id] = NARRATORS[id];
  return out;
}

export function fingerprintOf(h: Hadith): string {
  return fingerprint(h.primary.matnAr);
}

