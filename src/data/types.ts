/** Reliability band shown as colour + glyph + label (never colour alone). */
export type Band =
  | "prophet"
  | "sahabi"
  | "thiqa" // reliable
  | "saduq" // truthful, lesser precision
  | "daif" // weak
  | "matruk" // abandoned / very weak
  | "unknown"; // majhul / unassessed

export interface CriticVerdict {
  critic: string;
  criticDied?: number; // AH
  ar?: string;
  en: string;
  source: string;
  url?: string;
}

export interface Narrator {
  id: string;
  name: string; // transliterated full name
  nameAr: string;
  short: string; // display name for nodes
  shortAr: string;
  kunya?: string;
  born?: number | null; // AH, when known
  died?: number | null; // AH
  diedNote?: string;
  region: string;
  tabaqa?: number; // generation in Ibn Hajar's Taqrib (1–12)
  band: Band;
  taqrib?: { ar: string; en: string; number?: string };
  verdicts: CriticVerdict[];
  flags?: { label: string; detail: string }[];
  role?: string;
  bio: string;
  sources: { label: string; url: string }[];
}

export type LinkKind = "sama" | "ikhbar" | "an" | "qala";

export interface Transmission {
  from: string; // teacher (earlier) narrator id
  to: string; // student (later) narrator id
  sighaAr: string;
  sighaEn: string;
  kind: LinkKind;
  note?: string;
}

export interface Narration {
  cite: string; // canonical cite e.g. "bukhari:1"
  collection: string;
  collectionAr: string;
  numbering: string; // which numbering scheme the cite uses
  number: string;
  bookChapter?: string;
  chain: string[]; // narrator ids, compiler first, companion last
  links: Transmission[];
  isnadAr: string;
  matnAr: string;
  matnEn: string;
  url?: string;
}

export interface ScholarVerdict {
  scholar: string;
  died?: number | string; // AH; "living" for contemporaries
  era: "classical" | "contemporary";
  grade: string;
  gradeAr?: string;
  band: "sahih" | "hasan" | "daif" | "mawdu" | "note";
  scope?: string; // which narration, route, or sentence the verdict applies to
  source: string;
  quoteAr?: string;
  reason: string;
  url?: string;
}

export interface RouteNode {
  name: string;
  band?: Band | "gap";
  flag?: string; // why this node is the problem, if it is
}

export interface RouteComparison {
  title: string;
  intro: string;
  routes: {
    label: string;
    verdict: string;
    band: "sahih" | "hasan" | "daif" | "mawdu" | "disputed" | "note";
    nodes: RouteNode[]; // from the Prophet ﷺ downward
    note: string;
  }[];
}

export interface Hadith {
  slug: string;
  title: string;
  titleAr: string;
  takeaway: string; // plain-language meaning for Layman mode
  status: {
    band: "sahih" | "hasan" | "daif" | "disputed";
    label: string;
    line: string; // one line summary of the scholarly position
  };
  primary: Narration;
  also: { cite: string; label: string; note?: string; url?: string }[];
  verdicts: ScholarVerdict[];
  fanOut?: {
    afterId: string;
    headline: string;
    detail: string;
    named: string[];
    source: string;
  };
  lessons: { title: string; body: string }[];
  comparison?: RouteComparison;
  context?: string;
  vocabulary?: { term: string; ar: string; meaning: string }[];
  sources: { label: string; url: string }[];
}
