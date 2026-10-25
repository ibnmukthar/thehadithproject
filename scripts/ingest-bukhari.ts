/**
 * Ingest Sahih al-Bukhari (7,563 numbered narrations) into
 * data/collections/bukhari/.
 *
 *   pnpm tsx scripts/ingest-bukhari.ts
 *
 * Sources (downloaded into sources/bukhari/ when absent; that folder is
 * gitignored):
 *
 *   1. Open-Hadith-Data (ODbL 1.0 + DbCL 1.0) — the licensed text spine. Its
 *      diacritised file has 7,008 rows in book order, numbered 1…7008 in its
 *      own sequence (NOT the standard numbering), with narrator names wrapped
 *      in U+200F marks.
 *   2. fawazahmed0/hadith-api `ara-bukhari.json` (Unlicense) — a mirror of the
 *      sunnah.com text and numbering: 7,589 records (7,563 integers plus 26
 *      sub-numbers such as 402.2, which sunnah.com shows as "402b"), each with
 *      a book index. Used as the numbering and book-boundary crosswalk, and as
 *      the text of last resort when no Open-Hadith-Data row can be aligned.
 *
 * The standard (Muhammad Fu'ad Abd al-Baqi) number is the primary key. Each
 * record is aligned to an Open-Hadith-Data row by a monotonic alignment
 * (exact anchors, then order-preserving prefix/fuzzy matching inside the gaps
 * between anchors), given a machine isnad/matn split and a machine chain
 * parse (src/lib/isnad.ts), and a fingerprint of its matn (src/lib/text.ts).
 *
 * Nothing produced here is a verdict. Splits and chains are labelled
 * "machine"; the README in the output folder says so and lists the limits.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { CollectionBookSchema, CollectionSchema } from "../src/data/schema";
import type { Collection, CollectionBook, CollectionNarration } from "../src/data/types";
import { parseIsnad, skeleton, splitIsnadMatn } from "../src/lib/isnad";
import { fingerprint, normalizeArabic } from "../src/lib/text";

const ROOT = process.cwd();
const SRC = join(ROOT, "sources", "bukhari");
const OUT = join(ROOT, "data", "collections", "bukhari");

// --------------------------------------------------------------------- sources

const SOURCES = {
  ohdPlain: {
    file: "sahih_al-bukhari_ahadith.utf8.csv",
    url: "https://raw.githubusercontent.com/mhashim6/Open-Hadith-Data/master/Sahih_Al-Bukhari/sahih_al-bukhari_ahadith.utf8.csv",
  },
  ohdTashkil: {
    file: "sahih_al-bukhari_ahadith_mushakkala_mufassala.utf8.csv",
    url: "https://raw.githubusercontent.com/mhashim6/Open-Hadith-Data/master/Sahih_Al-Bukhari/sahih_al-bukhari_ahadith_mushakkala_mufassala.utf8.csv",
  },
  faw: {
    file: "ara-bukhari.json",
    url: "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-bukhari.json",
  },
} as const;

async function ensureSources(): Promise<void> {
  mkdirSync(SRC, { recursive: true });
  for (const s of Object.values(SOURCES)) {
    const path = join(SRC, s.file);
    if (existsSync(path)) continue;
    console.log(`downloading ${s.url}`);
    const res = await fetch(s.url);
    if (!res.ok) throw new Error(`download failed (${res.status}): ${s.url}`);
    writeFileSync(path, Buffer.from(await res.arrayBuffer()));
  }
}

/** Minimal RFC 4180 parser: quoted fields, doubled quotes, embedded newlines. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += ch;
      continue;
    }
    if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((f) => f !== "")) rows.push(row);
      row = [];
    } else field += ch;
  }
  if (field !== "" || row.length) {
    row.push(field);
    if (row.some((f) => f !== "")) rows.push(row);
  }
  return rows;
}

interface OhdRow {
  n: number;
  text: string; // diacritised, with U+200F marks
}

interface FawRecord {
  hadithnumber: number;
  arabicnumber: number;
  text: string;
  reference: { book: number; hadith: number };
}

interface FawFile {
  metadata: {
    sections: Record<string, string>;
    section_details: Record<string, { hadithnumber_first: number; hadithnumber_last: number }>;
  };
  hadiths: FawRecord[];
}

// ----------------------------------------------------------------- the books

/**
 * The 97 books with their Arabic names and number ranges, transcribed from the
 * table of contents at https://sunnah.com/bukhari (read 2026-10-24). The
 * ranges are used only to place the records that fawazahmed0 ships with
 * `reference.book: 0`. sunnah.com spells final ya as ى in some titles (الوحى,
 * فى, النبى, المغازى, التمنى); here they are written with ي.
 */
const BOOKS: { book: number; nameAr: string; first: number; last: number }[] = [
  { book: 1, nameAr: "كتاب بدء الوحي", first: 1, last: 7 },
  { book: 2, nameAr: "كتاب الإيمان", first: 8, last: 58 },
  { book: 3, nameAr: "كتاب العلم", first: 59, last: 134 },
  { book: 4, nameAr: "كتاب الوضوء", first: 135, last: 247 },
  { book: 5, nameAr: "كتاب الغسل", first: 248, last: 293 },
  { book: 6, nameAr: "كتاب الحيض", first: 294, last: 333 },
  { book: 7, nameAr: "كتاب التيمم", first: 334, last: 348 },
  { book: 8, nameAr: "كتاب الصلاة", first: 349, last: 520 },
  { book: 9, nameAr: "كتاب مواقيت الصلاة", first: 521, last: 602 },
  { book: 10, nameAr: "كتاب الأذان", first: 603, last: 875 },
  { book: 11, nameAr: "كتاب الجمعة", first: 876, last: 941 },
  { book: 12, nameAr: "كتاب صلاة الخوف", first: 942, last: 947 },
  { book: 13, nameAr: "كتاب العيدين", first: 948, last: 989 },
  { book: 14, nameAr: "كتاب الوتر", first: 990, last: 1004 },
  { book: 15, nameAr: "كتاب الاستسقاء", first: 1005, last: 1039 },
  { book: 16, nameAr: "كتاب الكسوف", first: 1040, last: 1065 },
  { book: 17, nameAr: "كتاب سجود القرآن", first: 1067, last: 1079 },
  { book: 18, nameAr: "كتاب التقصير", first: 1080, last: 1119 },
  { book: 19, nameAr: "كتاب التهجد", first: 1120, last: 1187 },
  { book: 20, nameAr: "كتاب فضل الصلاة في مسجد مكة والمدينة", first: 1188, last: 1197 },
  { book: 21, nameAr: "كتاب العمل في الصلاة", first: 1198, last: 1223 },
  { book: 22, nameAr: "كتاب السهو", first: 1224, last: 1236 },
  { book: 23, nameAr: "كتاب الجنائز", first: 1237, last: 1394 },
  { book: 24, nameAr: "كتاب الزكاة", first: 1395, last: 1512 },
  { book: 25, nameAr: "كتاب الحج", first: 1513, last: 1771 },
  { book: 26, nameAr: "كتاب العمرة", first: 1773, last: 1805 },
  { book: 27, nameAr: "كتاب المحصر", first: 1806, last: 1820 },
  { book: 28, nameAr: "كتاب جزاء الصيد", first: 1821, last: 1866 },
  { book: 29, nameAr: "كتاب فضائل المدينة", first: 1867, last: 1890 },
  { book: 30, nameAr: "كتاب الصوم", first: 1891, last: 2007 },
  { book: 31, nameAr: "كتاب صلاة التراويح", first: 2008, last: 2013 },
  { book: 32, nameAr: "كتاب فضل ليلة القدر", first: 2014, last: 2024 },
  { book: 33, nameAr: "كتاب الاعتكاف", first: 2025, last: 2046 },
  { book: 34, nameAr: "كتاب البيوع", first: 2047, last: 2238 },
  { book: 35, nameAr: "كتاب السلم", first: 2239, last: 2256 },
  { book: 36, nameAr: "كتاب الشفعة", first: 2257, last: 2259 },
  { book: 37, nameAr: "كتاب الإجارة", first: 2260, last: 2285 },
  { book: 38, nameAr: "كتاب الحوالات", first: 2287, last: 2289 },
  { book: 39, nameAr: "كتاب الكفالة", first: 2290, last: 2298 },
  { book: 40, nameAr: "كتاب الوكالة", first: 2299, last: 2319 },
  { book: 41, nameAr: "كتاب المزارعة", first: 2320, last: 2350 },
  { book: 42, nameAr: "كتاب المساقاة", first: 2351, last: 2383 },
  { book: 43, nameAr: "كتاب في الاستقراض", first: 2385, last: 2409 },
  { book: 44, nameAr: "كتاب الخصومات", first: 2410, last: 2425 },
  { book: 45, nameAr: "كتاب في اللقطة", first: 2426, last: 2439 },
  { book: 46, nameAr: "كتاب المظالم", first: 2440, last: 2482 },
  { book: 47, nameAr: "كتاب الشركة", first: 2483, last: 2507 },
  { book: 48, nameAr: "كتاب الرهن", first: 2508, last: 2515 },
  { book: 49, nameAr: "كتاب العتق", first: 2517, last: 2559 },
  { book: 50, nameAr: "كتاب المكاتب", first: 2560, last: 2565 },
  { book: 51, nameAr: "كتاب الهبة وفضلها والتحريض عليها", first: 2566, last: 2636 },
  { book: 52, nameAr: "كتاب الشهادات", first: 2637, last: 2689 },
  { book: 53, nameAr: "كتاب الصلح", first: 2690, last: 2710 },
  { book: 54, nameAr: "كتاب الشروط", first: 2711, last: 2737 },
  { book: 55, nameAr: "كتاب الوصايا", first: 2738, last: 2781 },
  { book: 56, nameAr: "كتاب الجهاد والسير", first: 2782, last: 3090 },
  { book: 57, nameAr: "كتاب فرض الخمس", first: 3091, last: 3155 },
  { book: 58, nameAr: "كتاب الجزية والموادعة", first: 3156, last: 3189 },
  { book: 59, nameAr: "كتاب بدء الخلق", first: 3190, last: 3325 },
  { book: 60, nameAr: "كتاب أحاديث الأنبياء", first: 3326, last: 3488 },
  { book: 61, nameAr: "كتاب المناقب", first: 3489, last: 3648 },
  { book: 62, nameAr: "كتاب فضائل أصحاب النبي صلى الله عليه وسلم", first: 3649, last: 3775 },
  { book: 63, nameAr: "كتاب مناقب الأنصار", first: 3776, last: 3948 },
  { book: 64, nameAr: "كتاب المغازي", first: 3949, last: 4473 },
  { book: 65, nameAr: "كتاب التفسير", first: 4474, last: 4977 },
  { book: 66, nameAr: "كتاب فضائل القرآن", first: 4978, last: 5062 },
  { book: 67, nameAr: "كتاب النكاح", first: 5063, last: 5250 },
  { book: 68, nameAr: "كتاب الطلاق", first: 5251, last: 5350 },
  { book: 69, nameAr: "كتاب النفقات", first: 5351, last: 5372 },
  { book: 70, nameAr: "كتاب الأطعمة", first: 5373, last: 5466 },
  { book: 71, nameAr: "كتاب العقيقة", first: 5467, last: 5474 },
  { book: 72, nameAr: "كتاب الذبائح والصيد", first: 5475, last: 5544 },
  { book: 73, nameAr: "كتاب الأضاحي", first: 5545, last: 5574 },
  { book: 74, nameAr: "كتاب الأشربة", first: 5575, last: 5639 },
  { book: 75, nameAr: "كتاب المرضى", first: 5640, last: 5677 },
  { book: 76, nameAr: "كتاب الطب", first: 5678, last: 5782 },
  { book: 77, nameAr: "كتاب اللباس", first: 5783, last: 5969 },
  { book: 78, nameAr: "كتاب الأدب", first: 5970, last: 6226 },
  { book: 79, nameAr: "كتاب الاستئذان", first: 6227, last: 6303 },
  { book: 80, nameAr: "كتاب الدعوات", first: 6304, last: 6411 },
  { book: 81, nameAr: "كتاب الرقاق", first: 6412, last: 6593 },
  { book: 82, nameAr: "كتاب القدر", first: 6594, last: 6620 },
  { book: 83, nameAr: "كتاب الأيمان والنذور", first: 6621, last: 6707 },
  { book: 84, nameAr: "كتاب كفارات الأيمان", first: 6708, last: 6722 },
  { book: 85, nameAr: "كتاب الفرائض", first: 6723, last: 6771 },
  { book: 86, nameAr: "كتاب الحدود", first: 6772, last: 6859 },
  { book: 87, nameAr: "كتاب الديات", first: 6861, last: 6917 },
  { book: 88, nameAr: "كتاب استتابة المرتدين والمعاندين وقتالهم", first: 6918, last: 6939 },
  { book: 89, nameAr: "كتاب الإكراه", first: 6940, last: 6952 },
  { book: 90, nameAr: "كتاب الحيل", first: 6953, last: 6981 },
  { book: 91, nameAr: "كتاب التعبير", first: 6982, last: 7047 },
  { book: 92, nameAr: "كتاب الفتن", first: 7048, last: 7136 },
  { book: 93, nameAr: "كتاب الأحكام", first: 7137, last: 7225 },
  { book: 94, nameAr: "كتاب التمني", first: 7226, last: 7245 },
  { book: 95, nameAr: "كتاب أخبار الآحاد", first: 7246, last: 7267 },
  { book: 96, nameAr: "كتاب الاعتصام بالكتاب والسنة", first: 7268, last: 7370 },
  { book: 97, nameAr: "كتاب التوحيد", first: 7371, last: 7563 },
];

/**
 * Numbers that fall between two books in the sunnah.com table of contents
 * (the site shows them on a combined page with the preceding number, e.g.
 * "Sahih al-Bukhari 2383, 2384", and the book of that page is given here).
 * Checked by hand on sunnah.com on 2026-10-24.
 */
const GAP_BOOKS: Record<number, number> = { 2384: 42, 2516: 48 };

function bookOf(rec: FawRecord): number {
  if (rec.reference.book > 0) return rec.reference.book;
  const n = Math.floor(rec.hadithnumber);
  const hit = BOOKS.find((b) => n >= b.first && n <= b.last);
  if (hit) return hit.book;
  if (GAP_BOOKS[n]) return GAP_BOOKS[n];
  throw new Error(`cannot place hadith ${rec.hadithnumber} in a book`);
}

// -------------------------------------------------------------- the alignment

type Method = "exact" | "prefix" | "fuzzy" | "fuzzy-shingle" | "shared" | "gap" | "unmatched";

interface Match {
  ohd?: number; // index into the OHD rows (0-based)
  method: Method;
  score?: number;
}

/** How many OHD rows ahead an exact anchor may be sought. */
const ANCHOR_WINDOW = 80;
/** Characters of normalised text compared by the fuzzy ratio. */
const FUZZY_HEAD = 200;
/**
 * Minimum Levenshtein ratio (1 − distance/length) on the first FUZZY_HEAD
 * normalised characters for a fuzzy match. See the README for the
 * justification: accepted scores cluster at 0.9–1.0 while the best score of
 * the records that have no counterpart is almost always below 0.7.
 */
const FUZZY_THRESHOLD = 0.85;
/** Shorter normalised texts are too little evidence for a prefix match. */
const PREFIX_MIN = 40;

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = new Array<number>(b.length + 1);
  let cur = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    cur[0] = i;
    const ca = a.charCodeAt(i - 1);
    for (let j = 1; j <= b.length; j++) {
      const cost = ca === b.charCodeAt(j - 1) ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, cur] = [cur, prev];
  }
  return prev[b.length];
}

function ratio(a: string, b: string): number {
  const x = a.slice(0, FUZZY_HEAD);
  const y = b.slice(0, FUZZY_HEAD);
  const len = Math.max(x.length, y.length);
  return len ? 1 - levenshtein(x, y) / len : 0;
}

/**
 * Minimum word-trigram containment for the second fuzzy criterion. The
 * Levenshtein ratio on a 200-character window fails when one source expands
 * a name in the isnad («مسلم» vs «مسلم بن إبراهيم», «أبي بشر» vs «أبي بشر هو
 * جعفر بن أبي وحشية»): the windows fall out of step. Word trigrams are
 * insensitive to such insertions. Two neighbouring reports that merely share
 * a chain have containment around 0.2–0.4; see the README.
 */
const SHINGLE_THRESHOLD = 0.7;

function shingles(s: string): Set<string> {
  const w = s.split(" ");
  const out = new Set<string>();
  for (let i = 0; i + 2 < w.length; i++) out.add(`${w[i]} ${w[i + 1]} ${w[i + 2]}`);
  return out;
}

/** |T(a) ∩ T(b)| / min(|T(a)|, |T(b)|) over word trigrams; 0 when either has none. */
function shingleContainment(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let n = 0;
  for (const x of a) if (b.has(x)) n++;
  return n / Math.min(a.size, b.size);
}

function isPrefixMatch(a: string, b: string): boolean {
  if (a.length < PREFIX_MIN || b.length < PREFIX_MIN) return false;
  return a.startsWith(b) || b.startsWith(a) || (a.length > 80 && b.includes(a)) || (b.length > 80 && a.includes(b));
}

/**
 * Monotonic alignment of the fawazahmed0 records (F) to the OHD rows (O).
 * Both lists are in book order, so:
 *   1. exact matches on the normalised text are anchors (sought within a
 *      window ahead of the last anchor);
 *   2. inside each gap between anchors, prefix and fuzzy matches are chosen
 *      by an order-preserving maximum-weight matching (dynamic programming),
 *      so that one record cannot jump ahead and steal a later record's row;
 *   3. a record whose text is identical to the previous record's (sunnah.com
 *      shows one text under a combined reference such as "2383, 2384";
 *      fawazahmed0 repeats it under each number) shares that record's row;
 *   4. a record with empty text takes the row left over in its gap when the
 *      gap holds exactly as many leftover rows as empty records (positional).
 */
function align(F: string[], O: string[]): { matches: Match[]; rejected: number[]; rejectedShingle: number[] } {
  const matches: Match[] = F.map(() => ({ method: "unmatched" as Method }));
  const used = new Set<number>();
  const rejected: number[] = []; // best ratio of each unmatched non-empty record (for the README)
  const rejectedShingle: number[] = []; // best trigram containment of each unmatched non-empty record
  const FS = F.map(shingles);
  const OS = O.map(shingles);

  // 1. anchors
  const anchors: [number, number][] = [];
  let j = 0;
  for (let i = 0; i < F.length; i++) {
    if (!F[i]) continue;
    const dup = i > 0 && F[i] === F[i - 1];
    let found = -1;
    for (let k = j; k < Math.min(j + ANCHOR_WINDOW, O.length); k++) {
      if (O[k] === F[i]) {
        found = k;
        break;
      }
    }
    if (dup && found !== j) {
      matches[i] = { method: "shared" };
      continue;
    }
    if (found >= 0) {
      matches[i] = { ohd: found, method: "exact", score: 1 };
      used.add(found);
      anchors.push([i, found]);
      j = found + 1;
    }
  }

  // 1b. Combined pages. sunnah.com prints some consecutive numbers on one page
  // with their texts joined ("958, 959, 960, 961"), and fawazahmed0 repeats
  // the joined text under each number. When that joined text contains, in
  // order, two or more free rows lying between the neighbouring anchors, each
  // number of the run takes the next such row (the last row is shared if the
  // run is longer than the rows).
  for (let i = 0; i < F.length; ) {
    if (!F[i] || matches[i].method !== "unmatched") {
      i++;
      continue;
    }
    let jEnd = i + 1;
    while (jEnd < F.length && matches[jEnd].method === "shared" && F[jEnd] === F[i]) jEnd++;
    const run = jEnd - i;
    if (run >= 2) {
      let lo = -1;
      for (let a = i - 1; a >= 0; a--) if (matches[a].ohd !== undefined) { lo = matches[a].ohd!; break; }
      let hi = O.length;
      for (let b = jEnd; b < F.length; b++) if (matches[b].ohd !== undefined) { hi = matches[b].ohd!; break; }
      const rows: number[] = [];
      let cursor = 0;
      for (let k = lo + 1; k < hi; k++) {
        if (used.has(k) || O[k].length < PREFIX_MIN) continue;
        const p = F[i].indexOf(O[k], cursor);
        if (p >= 0) {
          rows.push(k);
          cursor = p + O[k].length;
        }
      }
      if (rows.length >= 2) {
        for (let x = 0; x < run; x++) {
          const k = rows[Math.min(x, rows.length - 1)];
          matches[i + x] = { ohd: k, method: "prefix", score: 1 };
          used.add(k);
        }
      }
    }
    i = jEnd;
  }

  // Diagnostic: OHD has fewer rows than there are records, so between two
  // anchors the OHD side should never advance much further than the record
  // side. Where it does, an anchor may have jumped to a verbatim repeat.
  for (let a = 1; a < anchors.length; a++) {
    const di = anchors[a][0] - anchors[a - 1][0];
    const dk = anchors[a][1] - anchors[a - 1][1];
    if (dk - di > 3) console.warn(`warn: anchor drift between records ${anchors[a - 1][0]} and ${anchors[a][0]}: OHD advanced ${dk} rows for ${di} records`);
  }

  // 2. gaps between anchors
  const bounds: [number, number][] = [[-1, -1], ...anchors, [F.length, O.length]];
  for (let g = 0; g + 1 < bounds.length; g++) {
    const [ia, ka] = bounds[g];
    const [ib, kb] = bounds[g + 1];
    const fi: number[] = [];
    for (let i = ia + 1; i < ib; i++) if (F[i] && matches[i].method === "unmatched") fi.push(i);
    const ok: number[] = [];
    for (let k = ka + 1; k < kb; k++) if (!used.has(k)) ok.push(k);
    if (!fi.length || !ok.length) continue;

    // Score matrix; -1 means "not acceptable". A prefix/containment match
    // scores 1.5 so that it beats any fuzzy score; the Levenshtein ratio is
    // tried first, then word-trigram containment (kept in [0.7, 1) by scaling
    // so that the two criteria share one scale in the matching).
    const how: Method[][] = fi.map(() => ok.map(() => "unmatched" as Method));
    const score: number[][] = fi.map((i, a) =>
      ok.map((k, b) => {
        if (isPrefixMatch(F[i], O[k])) {
          how[a][b] = "prefix";
          return 1.5;
        }
        const r = ratio(F[i], O[k]);
        if (r >= FUZZY_THRESHOLD) {
          how[a][b] = "fuzzy";
          return r;
        }
        const s = shingleContainment(FS[i], OS[k]);
        if (s >= SHINGLE_THRESHOLD) {
          how[a][b] = "fuzzy-shingle";
          return s * 0.999;
        }
        return -1;
      }),
    );
    // Order-preserving maximum-weight matching.
    const n = fi.length;
    const m = ok.length;
    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
    for (let a = 1; a <= n; a++) {
      for (let b = 1; b <= m; b++) {
        let best = Math.max(dp[a - 1][b], dp[a][b - 1]);
        const s = score[a - 1][b - 1];
        if (s >= 0) best = Math.max(best, dp[a - 1][b - 1] + s);
        dp[a][b] = best;
      }
    }
    let a = n;
    let b = m;
    while (a > 0 && b > 0) {
      const s = score[a - 1][b - 1];
      if (s >= 0 && dp[a][b] === dp[a - 1][b - 1] + s) {
        const i = fi[a - 1];
        const k = ok[b - 1];
        const method = how[a - 1][b - 1];
        matches[i] = method === "prefix" ? { ohd: k, method, score: 1 } : { ohd: k, method, score: Math.round((method === "fuzzy-shingle" ? s / 0.999 : s) * 1000) / 1000 };
        used.add(k);
        a--;
        b--;
      } else if (dp[a][b] === dp[a - 1][b]) a--;
      else b--;
    }
    for (let x = 0; x < n; x++) {
      if (matches[fi[x]].method === "unmatched") {
        let best = 0;
        let bestS = 0;
        for (let y = 0; y < m; y++) {
          best = Math.max(best, ratio(F[fi[x]], O[ok[y]]));
          bestS = Math.max(bestS, shingleContainment(FS[fi[x]], OS[ok[y]]));
        }
        rejected.push(best);
        rejectedShingle.push(bestS);
      }
    }
  }

  // 2b. Portions. sunnah.com numbers a portion of a report separately (101 is
  // the first part of the report that 102 carries in full; 2711 and 2712 are
  // the first part of 2713) where Open-Hadith-Data keeps a single row. A
  // record whose normalised text is contained in the row of its nearest
  // matched neighbour, or in a free row between them, shares that row; its
  // textAr is cut from the row's diacritised text (see portionOf).
  for (let i = 0; i < F.length; i++) {
    if (!F[i] || matches[i].method !== "unmatched" || F[i].length < PREFIX_MIN) continue;
    let lo = -1;
    for (let a = i - 1; a >= 0; a--) if (matches[a].ohd !== undefined) { lo = matches[a].ohd!; break; }
    let hi = -1;
    for (let b = i + 1; b < F.length; b++) if (matches[b].ohd !== undefined) { hi = matches[b].ohd!; break; }
    const cands: number[] = [];
    if (lo >= 0) cands.push(lo);
    for (let k = lo + 1; k < (hi >= 0 ? hi : O.length); k++) cands.push(k);
    if (hi >= 0) cands.push(hi);
    const k = cands.find((c) => O[c].includes(F[i]));
    if (k !== undefined) {
      matches[i] = { ohd: k, method: "prefix", score: 1 };
      used.add(k);
    }
  }

  // 3. shared rows for repeated texts
  for (let i = 1; i < F.length; i++) {
    if (matches[i].method !== "shared") continue;
    const prev = matches[i - 1];
    if (prev.ohd !== undefined) matches[i] = { ohd: prev.ohd, method: "shared", score: prev.score };
    else matches[i] = { method: "unmatched" };
  }

  // 4. positional fill for empty-text records
  const pairs = matches.map((m, i) => [i, m.ohd] as [number, number | undefined]).filter((p) => p[1] !== undefined) as [number, number][];
  // Only the first record using a shared row counts as a boundary.
  const seenRow = new Set<number>();
  const boundaries: [number, number][] = [[-1, -1]];
  for (const [i, k] of pairs) {
    if (seenRow.has(k)) continue;
    seenRow.add(k);
    boundaries.push([i, k]);
  }
  boundaries.push([F.length, O.length]);
  for (let g = 0; g + 1 < boundaries.length; g++) {
    const [ia, ka] = boundaries[g];
    const [ib, kb] = boundaries[g + 1];
    const empties: number[] = [];
    let others = 0;
    for (let i = ia + 1; i < ib; i++) {
      if (matches[i].ohd !== undefined) continue;
      if (F[i]) others++;
      else empties.push(i);
    }
    const rows: number[] = [];
    for (let k = ka + 1; k < kb; k++) if (!used.has(k)) rows.push(k);
    if (empties.length && others === 0 && rows.length === empties.length) {
      empties.forEach((i, x) => {
        matches[i] = { ohd: rows[x], method: "gap" };
        used.add(rows[x]);
      });
    }
  }

  return { matches, rejected, rejectedShingle };
}

// ------------------------------------------------------------------ the text

/** OHD: drop the U+200F/U+200E wrappers and collapse whitespace; keep diacritics (in NFC order). */
function cleanOhd(s: string): string {
  return s.normalize("NFC").replace(/[‎‏]/g, " ").replace(/\s+/g, " ").trim();
}

const MARKS = /[ؐ-ًؚ-ٰٟۖ-ۭ]/;

/**
 * The diacritised slice of an OHD row that corresponds to a record's
 * normalised text (used when the record is a portion of the row). Finds the
 * record's words in the row's index-preserving skeleton and maps the span
 * back, extending the end over the trailing diacritics of the last letter.
 * Returns null when the words cannot be located (the caller then keeps the
 * whole row).
 */
function portionOf(rowAr: string, norm: string): string | null {
  const sk = skeleton(rowAr);
  const re = new RegExp(norm.split(" ").map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("\\s+"));
  const m = re.exec(sk.text);
  if (!m) return null;
  const start = sk.map[m.index];
  let end = sk.map[m.index + m[0].length - 1] + 1;
  while (end < rowAr.length && MARKS.test(rowAr[end])) end++;
  return rowAr.slice(start, end).trim();
}

/** fawazahmed0 (sunnah.com): drop bidi marks, the ‏"‏ quote artefacts and the dash-like tatweel, tidy spacing. */
function cleanFaw(s: string): string {
  return s
    .normalize("NFC")
    .replace(/[‎‏]/g, "")
    .replace(/\s*"\s*/g, " ") // the matn is wrapped in straight quotes; drop them
    .replace(/(^|\s)ـ(\s|$)/g, " ") // a tatweel used as a dash around رضى الله عنه
    .replace(/\s+([.,،:;؟!])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

// ------------------------------------------------------------ narrator aliases

interface NarratorRecord {
  id: string;
  nameAr: string;
  shortAr: string;
}

/** Strip the honorific and spacing differences for alias comparison. */
function aliasKey(s: string): string {
  return normalizeArabic(s.replace(/رضي الله عنه(?:ا|م|ما)?/g, " ").replace(/رضى الله عنه(?:ا|م|ما)?/g, " "));
}

/** Genitive/accusative forms of a kunya: أبو → أبي, أبا. */
function kunyaVariants(name: string): string[] {
  const out = [name];
  if (/^أبو\s/.test(name)) out.push(name.replace(/^أبو\s/, "أبي "), name.replace(/^أبو\s/, "أبا "));
  return out;
}

/**
 * Alias → narrator id, built from every narrator record's nameAr and shortAr
 * (plus their أبي/أبا forms) and from the name forms in the worked studies'
 * isnads. Aliases that map to more than one id are dropped as ambiguous.
 * Single-word aliases are kept in a separate map that is only consulted for
 * the narration the study is about (Bukhari 1): a bare «سفيان» or «يحيى»
 * elsewhere is never linked.
 */
function buildAliases(): { full: Map<string, string>; bareFor: Map<string, Map<string, string>> } {
  const dir = join(ROOT, "data", "narrators");
  const records: NarratorRecord[] = readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")) as NarratorRecord);
  const candidates = new Map<string, Set<string>>();
  const add = (alias: string, id: string) => {
    const key = aliasKey(alias);
    if (!key) return;
    if (!candidates.has(key)) candidates.set(key, new Set());
    candidates.get(key)!.add(id);
  };
  for (const r of records) {
    for (const v of kunyaVariants(r.nameAr)) add(v, r.id);
    for (const v of kunyaVariants(r.shortAr)) add(v, r.id);
  }
  // Name forms as they stand in the worked isnads. These are the hand-written
  // few: the isnad of Bukhari 1 names its narrators thus.
  const studyForms: Record<string, Record<string, string>> = {
    "bukhari:1": {
      "الحميدي عبد الله بن الزبير": "al-humaydi",
      "سفيان": "sufyan-ibn-uyaynah",
      "يحيى بن سعيد الأنصاري": "yahya-ibn-said",
      "محمد بن إبراهيم التيمي": "muhammad-ibn-ibrahim-al-taymi",
      "علقمة بن وقاص الليثي": "alqama-ibn-waqqas",
      "عمر بن الخطاب": "umar-ibn-al-khattab",
    },
    "tirmidhi:2317": {
      "أحمد بن نصر النيسابوري": "ahmad-ibn-nasr-al-naysaburi",
      "أبو مسهر": "abu-mushir",
      "إسماعيل بن عبد الله بن سماعة": "ismail-ibn-samaa",
      "الأوزاعي": "al-awzai",
      "الزهري": "al-zuhri",
      "ابن شهاب": "al-zuhri",
      "أبو سلمة بن عبد الرحمن": "abu-salama",
      "أبو هريرة": "abu-hurayra",
    },
    "khatib-rihla:1": {
      "أبو عاتكة": "abu-atika",
      "أنس بن مالك": "anas-ibn-malik",
    },
  };
  const bareFor = new Map<string, Map<string, string>>();
  for (const [cite, forms] of Object.entries(studyForms)) {
    for (const [form, id] of Object.entries(forms)) {
      const isBare = !/\s/.test(form.trim()) && !form.startsWith("ال"); // «سفيان», not «الزهري»
      if (isBare) {
        const n = cite.split(":")[1];
        if (!bareFor.has(n)) bareFor.set(n, new Map());
        bareFor.get(n)!.set(aliasKey(form), id);
      } else {
        for (const v of kunyaVariants(form)) add(v, id);
      }
    }
  }
  const full = new Map<string, string>();
  for (const [key, ids] of candidates) if (ids.size === 1) full.set(key, [...ids][0]);
  return { full, bareFor };
}

// ------------------------------------------------------------------- main

async function main(): Promise<void> {
  await ensureSources();

  const ohdRows: OhdRow[] = parseCsv(readFileSync(join(SRC, SOURCES.ohdTashkil.file), "utf8"))
    .filter((r) => /^\d+$/.test(r[0]))
    .map((r) => ({ n: Number(r[0]), text: r[1] }));
  const plainRows = parseCsv(readFileSync(join(SRC, SOURCES.ohdPlain.file), "utf8")).filter((r) => /^\d+$/.test(r[0]));
  if (plainRows.length !== ohdRows.length) console.warn(`warn: OHD plain has ${plainRows.length} rows, diacritised ${ohdRows.length}`);
  const faw = JSON.parse(readFileSync(join(SRC, SOURCES.faw.file), "utf8")) as FawFile;
  const recs = faw.hadiths;
  console.log(`OHD rows: ${ohdRows.length}; fawazahmed0 records: ${recs.length}`);

  // Alignment on normalised text.
  const F = recs.map((r) => normalizeArabic(r.text));
  const O = ohdRows.map((r) => normalizeArabic(r.text));
  const { matches, rejected, rejectedShingle } = align(F, O);

  const counts: Record<Method, number> = { exact: 0, prefix: 0, fuzzy: 0, "fuzzy-shingle": 0, shared: 0, gap: 0, unmatched: 0 };
  for (const m of matches) counts[m.method]++;
  const emptyUnmatched = recs.filter((r, i) => !F[i] && matches[i].ohd === undefined).length;
  const usedRows = new Set(matches.map((m) => m.ohd).filter((x) => x !== undefined));
  console.log("alignment:", counts, `OHD rows unused: ${ohdRows.length - usedRows.size}`, `empty-text records left without text: ${emptyUnmatched}`);
  const fuzzyScores = matches.filter((m) => m.method === "fuzzy").map((m) => m.score!);
  const hist = (xs: number[]) => {
    const h: Record<string, number> = {};
    for (const x of xs) {
      const b = (Math.floor(x * 20) / 20).toFixed(2);
      h[b] = (h[b] ?? 0) + 1;
    }
    return Object.entries(h)
      .sort()
      .map(([k, v]) => `${k}:${v}`)
      .join(" ");
  };
  console.log("fuzzy accepted scores (0.05 bins):", hist(fuzzyScores));
  console.log("fuzzy-shingle accepted scores (0.05 bins):", hist(matches.filter((m) => m.method === "fuzzy-shingle").map((m) => m.score!)));
  console.log("best ratio of unmatched records (0.05 bins):", hist(rejected));
  console.log("best trigram containment of unmatched records (0.05 bins):", hist(rejectedShingle));

  if (process.env.INGEST_DEBUG) {
    // Who holds each row, and the nearest matched rows around each record.
    const holder = new Map<number, number[]>();
    matches.forEach((m, i) => {
      if (m.ohd !== undefined) holder.set(m.ohd, [...(holder.get(m.ohd) ?? []), i]);
    });
    const head = (s: string, n = 90) => s.slice(0, n);
    console.log("\n--- unmatched records with a candidate row scoring ≥ 0.85 (the row went elsewhere)");
    for (let i = 0; i < recs.length; i++) {
      if (!F[i] || matches[i].method !== "unmatched") continue;
      let lo = -1;
      for (let a = i - 1; a >= 0; a--) if (matches[a].ohd !== undefined) { lo = matches[a].ohd!; break; }
      let hi = O.length;
      for (let b = i + 1; b < recs.length; b++) if (matches[b].ohd !== undefined) { hi = matches[b].ohd!; break; }
      let best = -1;
      let bestK = -1;
      for (let k = Math.max(0, lo - 2); k <= Math.min(O.length - 1, hi + 2); k++) {
        const r = ratio(F[i], O[k]);
        if (r > best) { best = r; bestK = k; }
      }
      if (best >= 0.85) {
        const takers = (holder.get(bestK) ?? []).map((x) => recs[x].hadithnumber);
        console.log(`${recs[i].hadithnumber} best row ${bestK + 1} (${best.toFixed(2)}) held by ${JSON.stringify(takers)} | len ${F[i].length} vs ${O[bestK].length}\n   rec: ${head(F[i])}\n   row: ${head(O[bestK])}`);
      }
    }
    console.log("\n--- prefix matches where the OHD row is the shorter text (record has a tail the row lacks)");
    let rowShorter = 0;
    for (let i = 0; i < recs.length; i++) {
      const m = matches[i];
      if (m.method !== "prefix" || m.ohd === undefined || O[m.ohd].length >= F[i].length) continue;
      rowShorter++;
      if (rowShorter <= 8) console.log(`${recs[i].hadithnumber} row ${m.ohd + 1}: record ${F[i].length} chars, row ${O[m.ohd].length}; record tail: ${head(F[i].slice(O[m.ohd].length), 120)}`);
    }
    console.log(`(${rowShorter} such records)`);
    console.log("\n--- records 2295..2298");
    for (let i = 0; i < recs.length; i++) {
      const n = recs[i].hadithnumber;
      if (n < 2295 || n > 2298) continue;
      console.log(`${n} ${matches[i].method} row ${matches[i].ohd !== undefined ? matches[i].ohd! + 1 : "-"} len ${F[i].length} same-as-prev ${i > 0 && F[i] === F[i - 1]}: ${head(F[i], 70)}`);
    }
    console.log("\n--- unused OHD rows");
    for (let k = 0; k < O.length; k++) {
      if (usedRows.has(k)) continue;
      const prev = holder.get(k - 1)?.map((x) => recs[x].hadithnumber);
      const next = holder.get(k + 1)?.map((x) => recs[x].hadithnumber);
      console.log(`row ${k + 1} (len ${O[k].length}) between ${JSON.stringify(prev)} and ${JSON.stringify(next)}: ${head(O[k])}`);
    }
    console.log("\n--- empty-text records");
    for (let i = 0; i < recs.length; i++) {
      if (F[i]) continue;
      let lo = -1;
      for (let a = i - 1; a >= 0; a--) if (matches[a].ohd !== undefined) { lo = matches[a].ohd!; break; }
      let hi = O.length;
      for (let b = i + 1; b < recs.length; b++) if (matches[b].ohd !== undefined) { hi = matches[b].ohd!; break; }
      console.log(`${recs[i].hadithnumber}: rows between neighbours ${lo + 1}..${hi + 1}: ${hi - lo - 1} free row(s)`);
      for (let k = lo + 1; k < hi; k++) console.log(`   row ${k + 1}: ${head(O[k])}`);
    }
  }

  // Build the narrations.
  const { full: aliases, bareFor } = buildAliases();
  // Every studied hadith whose primary narration is in this collection links back to its study.
  const studies: Record<string, string> = {};
  for (const f of readdirSync(join(ROOT, "data", "hadith")).filter((x) => x.endsWith(".json"))) {
    const h = JSON.parse(readFileSync(join(ROOT, "data", "hadith", f), "utf8")) as { slug: string; primary: { cite: string } };
    const m = /^bukhari:(.+)$/.exec(h.primary.cite);
    if (m) studies[m[1]] = h.slug;
  }
  const byBook = new Map<number, CollectionNarration[]>();
  let splitCount = 0;
  let chainCount = 0;
  let linkedNames = 0;
  let totalNames = 0;
  let fromFaw = 0;
  let portions = 0;
  const dropped: string[] = [];
  const linkedIds = new Map<string, number>();
  const nameLengths: number[] = [];

  for (let i = 0; i < recs.length; i++) {
    const rec = recs[i];
    const m = matches[i];
    const n = String(rec.hadithnumber);
    const book = bookOf(rec);
    let textAr: string;
    if (m.ohd !== undefined) {
      const row = cleanOhd(ohdRows[m.ohd].text);
      // A record that is a proper portion of its row gets that portion.
      const isPortion = F[i] !== "" && O[m.ohd] !== F[i] && O[m.ohd].includes(F[i]);
      const portion = isPortion ? portionOf(row, F[i]) : null;
      if (portion) portions++;
      else if (isPortion) console.warn(`warn: ${n}: could not cut its portion from OHD row ${ohdRows[m.ohd].n}; whole row kept`);
      textAr = portion ?? row;
    } else {
      textAr = cleanFaw(rec.text);
      fromFaw++;
    }
    if (normalizeArabic(textAr) === "") {
      // A number with no text in either source is a gap in the standard numbering
      // (sunnah.com reports 5710 as "not available"); it is not emitted.
      dropped.push(n);
      continue;
    }
    const split = splitIsnadMatn(textAr);
    const isnadPart = split ? textAr.slice(0, split.at) : textAr;
    const parsed = parseIsnad(isnadPart);
    const names = parsed.names.map((ar) => {
      const key = aliasKey(ar);
      const id = aliases.get(key) ?? bareFor.get(n)?.get(key);
      if (id) {
        linkedNames++;
        linkedIds.set(id, (linkedIds.get(id) ?? 0) + 1);
      }
      return id ? { ar, id } : { ar };
    });
    if (split) splitCount++;
    if (names.length) chainCount++;
    totalNames += names.length;
    nameLengths.push(names.length);
    const matn = split ? textAr.slice(split.at) : textAr;
    const narration: CollectionNarration = {
      n,
      book,
      textAr,
      ...(split ? { split: { at: split.at, method: "machine" as const } } : {}),
      ...(names.length ? { chain: { status: "machine" as const, names, sighas: parsed.sighas } } : {}),
      fingerprint: fingerprint(matn),
      sources: {
        ...(m.ohd !== undefined ? { ohd: ohdRows[m.ohd].n } : {}),
        ref: rec.hadithnumber,
      },
      ...(studies[n] ? { study: studies[n] } : {}),
    };
    if (!byBook.has(book)) byBook.set(book, []);
    byBook.get(book)!.push(narration);
  }

  // ------------------------------------------------------------ assertions
  // Unit-style checks on Bukhari 1, 2 and 7563; the run fails if the parser regresses.
  const get = (n: string) => [...byBook.values()].flat().find((x) => x.n === n)!;
  const assert = (cond: unknown, msg: string) => {
    if (!cond) throw new Error(`assertion failed: ${msg}`);
  };
  {
    const h1 = get("1");
    assert(h1.split, "Bukhari 1 splits");
    assert(normalizeArabic(h1.textAr.slice(h1.split!.at)).startsWith("انما الاعمال"), `Bukhari 1 matn begins with إنما (got ${h1.textAr.slice(h1.split!.at, h1.split!.at + 30)})`);
    const study = JSON.parse(readFileSync(join(ROOT, "data", "hadith", "actions-by-intentions.json"), "utf8")) as { primary: { matnAr: string } };
    assert(h1.fingerprint === fingerprint(study.primary.matnAr), `Bukhari 1 fingerprint ${h1.fingerprint} equals the worked study's ${fingerprint(study.primary.matnAr)}`);
    assert(h1.chain && h1.chain.names.length === 6, `Bukhari 1 chain has 6 names (got ${h1.chain?.names.length})`);
    const ids = h1.chain!.names.map((x) => x.id);
    assert(
      JSON.stringify(ids) === JSON.stringify(["al-humaydi", "sufyan-ibn-uyaynah", "yahya-ibn-said", "muhammad-ibn-ibrahim-al-taymi", "alqama-ibn-waqqas", "umar-ibn-al-khattab"]),
      `Bukhari 1 chain links all six narrators (got ${JSON.stringify(ids)})`,
    );
    assert(h1.chain!.sighas[0] === "حدثنا" && h1.chain!.sighas[1] === "قال حدثنا" && h1.chain!.sighas[3] === "قال اخبرني", `Bukhari 1 sighas (got ${JSON.stringify(h1.chain!.sighas)})`);
    assert(h1.study === "actions-by-intentions", "Bukhari 1 carries its study slug");
    assert(h1.sources.ohd === 1, "Bukhari 1 aligned to OHD row 1");
  }
  {
    const h2 = get("2");
    assert(h2.split, "Bukhari 2 splits");
    assert(normalizeArabic(h2.textAr.slice(h2.split!.at)).startsWith("احيانا"), `Bukhari 2 matn begins with أحيانا (got ${h2.textAr.slice(h2.split!.at, h2.split!.at + 20)})`);
    const names = h2.chain!.names.map((x) => normalizeArabic(x.ar));
    assert(names[0] === "عبد الله بن يوسف" && names[1] === "مالك" && names[2] === "هشام بن عروه" && names[3] === "ابيه", `Bukhari 2 chain (got ${JSON.stringify(names)})`);
    assert(h2.chain!.sighas[1] === "قال اخبرنا" && h2.chain!.sighas[2] === "عن", `Bukhari 2 sighas (got ${JSON.stringify(h2.chain!.sighas)})`);
    assert(names[4] === "عائشه ام المؤمنين", `Bukhari 2 Companion is Aisha (got ${names[4]})`);
  }
  {
    const h = get("7563");
    assert(h.split, "Bukhari 7563 splits");
    assert(normalizeArabic(h.textAr.slice(h.split!.at)).startsWith("كلمتان"), `Bukhari 7563 matn begins with كلمتان (got ${h.textAr.slice(h.split!.at, h.split!.at + 20)})`);
    const names = h.chain!.names.map((x) => normalizeArabic(x.ar));
    assert(JSON.stringify(names) === JSON.stringify(["احمد بن اشكاب", "محمد بن فضيل", "عماره بن القعقاع", "ابي زرعه", "ابي هريره"]), `Bukhari 7563 chain (got ${JSON.stringify(names)})`);
    assert(JSON.stringify(h.chain!.sighas) === JSON.stringify(["حدثني", "حدثنا", "عن", "عن", "عن"]), `Bukhari 7563 sighas (got ${JSON.stringify(h.chain!.sighas)})`);
    assert(h.chain!.names[4].id === "abu-hurayra", "Bukhari 7563 links Abu Hurayra");
  }
  assert(!matches.some((m, i) => F[i] && m.ohd === undefined && m.method !== "unmatched"), "every matched record has a row");
  // Monotonic: OHD row numbers never decrease along the record order.
  let lastRow = -1;
  for (const m of matches) {
    if (m.ohd === undefined) continue;
    assert(m.ohd >= lastRow, "alignment is monotonic");
    lastRow = m.ohd;
  }

  // ------------------------------------------------------------ write out
  mkdirSync(join(OUT, "books"), { recursive: true });
  const books: Collection["books"] = [];
  const total = recs.length - dropped.length; // numbers with no text in either source are gaps, not narrations
  for (const b of BOOKS) {
    const narrations = byBook.get(b.book) ?? [];
    if (!narrations.length) throw new Error(`book ${b.book} has no narrations`);
    const file: CollectionBook = { book: b.book, nameAr: b.nameAr, nameEn: faw.metadata.sections[String(b.book)], narrations };
    const parsed = CollectionBookSchema.safeParse(file);
    if (!parsed.success) throw new Error(`book ${b.book} fails the schema:\n${parsed.error.message}`);
    writeFileSync(join(OUT, "books", `${String(b.book).padStart(3, "0")}.json`), JSON.stringify(file, null, 2) + "\n");
    books.push({ book: b.book, nameAr: b.nameAr, nameEn: file.nameEn, first: narrations[0].n, last: narrations[narrations.length - 1].n, count: narrations.length });
  }
  for (const k of byBook.keys()) if (!BOOKS.some((b) => b.book === k)) throw new Error(`unexpected book index ${k}`);

  const pct = (x: number, of = total) => `${((100 * x) / of).toFixed(1)}%`;
  const matched = counts.exact + counts.prefix + counts.fuzzy + counts["fuzzy-shingle"] + counts.shared + counts.gap;
  const collection: Collection = {
    id: "bukhari",
    nameEn: "Sahih al-Bukhari",
    nameAr: "صحيح البخاري",
    compiler: "Muhammad ibn Isma'il al-Bukhari",
    compilerId: "al-bukhari",
    numbering: "Muhammad Fu'ad Abd al-Baqi numbering, as used in Fath al-Bari and on sunnah.com",
    total,
    books,
    sources: [
      {
        label: "Open-Hadith-Data, Sahih al-Bukhari (diacritised, with elaboration)",
        url: SOURCES.ohdTashkil.url,
        licence: "ODbL 1.0 (database) + DbCL 1.0 (contents)",
        role: "Text spine: textAr is taken from this file wherever a row could be aligned to the standard number. Its own 1–7008 numbering is kept in sources.ohd.",
      },
      {
        label: "fawazahmed0/hadith-api, ara-bukhari.json (mirror of the sunnah.com Arabic text and numbering)",
        url: SOURCES.faw.url,
        licence: "Unlicense (repository); the Arabic text itself is the public-domain text of the Sahih as published on sunnah.com",
        role: "Numbering and book-boundary crosswalk (the n of every record and its book), and text of last resort for the records with no aligned Open-Hadith-Data row.",
      },
    ],
    notes: [
      `${total} narrations: the standard numbering runs to 7,563, with ${recs.filter((r) => !Number.isInteger(r.hadithnumber)).length} sub-numbered narrations (e.g. 402.2, shown on sunnah.com as 402b) and ${dropped.length} numbers that carry no text in any source and are not emitted (${dropped.join(", ")}).`,
      `Alignment of the standard numbering to Open-Hadith-Data rows: ${counts.exact} exact (${pct(counts.exact)}), ${counts.prefix} prefix/containment (${pct(counts.prefix)}; ${portions} of them are portions cut from a row shared with a neighbouring number), ${counts.fuzzy} fuzzy at Levenshtein ratio ≥ ${FUZZY_THRESHOLD} on the first ${FUZZY_HEAD} normalised characters (${pct(counts.fuzzy)}), ${counts["fuzzy-shingle"]} fuzzy at word-trigram containment ≥ ${SHINGLE_THRESHOLD} (${pct(counts["fuzzy-shingle"])}), ${counts.shared} sharing the row of an identical preceding record (${pct(counts.shared)}), ${counts.gap} placed positionally for records whose sunnah.com text is empty (${pct(counts.gap)}); ${counts.unmatched} unmatched (${pct(counts.unmatched)}), whose textAr comes from fawazahmed0/sunnah.com instead. ${ohdRows.length - usedRows.size} of the ${ohdRows.length} Open-Hadith-Data rows were not used.`,
      `Machine isnad/matn split proposed for ${splitCount} records (${pct(splitCount)}); machine chain parsed for ${chainCount} (${pct(chainCount)}), ${totalNames} names in all, of which ${linkedNames} are linked to one of the ${linkedIds.size} narrator records on the site. Splits and chains are labelled "machine": they are proposals for review, not readings of the text.`,
      "Book index and English book names follow sunnah.com (via fawazahmed0). 311 fawazahmed0 records carry book 0; they were placed by the sunnah.com table-of-contents ranges, and the two numbers that fall between books there (2384, 2516) were placed by hand from their sunnah.com pages (books 42 and 48). Arabic book names were transcribed from the sunnah.com table of contents.",
      "Open-Hadith-Data's own numbering (1–7008) differs from the standard numbering because it merges some repeated and suspended (mu'allaq) reports; it is kept in sources.ohd for traceability.",
    ],
  };
  const parsedCollection = CollectionSchema.safeParse(collection);
  if (!parsedCollection.success) throw new Error(`collection.json fails the schema:\n${parsedCollection.error.message}`);
  writeFileSync(join(OUT, "collection.json"), JSON.stringify(collection, null, 2) + "\n");

  // ------------------------------------------------------------ report
  const multi = nameLengths.filter((x) => x >= 3).length;
  console.log(`wrote ${books.length} book files and collection.json to ${OUT}`);
  console.log(`records ${total}; matched ${matched} (${pct(matched)}); text from fawazahmed0 ${fromFaw}; portions cut from a shared row ${portions}`);
  console.log(`split ${splitCount} (${pct(splitCount)}); chain ${chainCount} (${pct(chainCount)}), chains with ≥3 names ${multi}; names ${totalNames}, linked ${linkedNames}`);
  console.log("linked ids:", Object.fromEntries([...linkedIds.entries()].sort((a, b) => b[1] - a[1])));
  const unmatchedList = recs.filter((r, i) => matches[i].method === "unmatched").map((r) => r.hadithnumber);
  console.log(`unmatched numbers (${unmatchedList.length}): ${unmatchedList.slice(0, 60).join(", ")}${unmatchedList.length > 60 ? ", …" : ""}`);
  const emptyLeft = recs.filter((r, i) => !F[i] && matches[i].ohd === undefined).map((r) => r.hadithnumber);
  if (emptyLeft.length) console.warn(`note: records with no text in either source, not emitted: ${emptyLeft.join(", ")}`);
  if (dropped.length) console.log(`dropped ${dropped.length} empty record(s): ${dropped.join(", ")}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
