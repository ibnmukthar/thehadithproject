/**
 * Machine isnad/matn split and chain parse.
 *
 * Pure, isomorphic helpers (no Node imports) shared by the ingestion scripts
 * and, later, by the site. Everything here is a *proposal*: the output is
 * labelled "machine" in the data and must be reviewed by a human before it is
 * treated as a reading of the text. The rules are deliberately simple and
 * documented inline so that a reviewer can predict what the machine did.
 *
 * Two public functions:
 *
 *   splitIsnadMatn(textAr)  → { at } | null
 *     Index in textAr where the matn (the reported words) begins, found by
 *     locating the last speech marker ("the Messenger of God ﷺ said", "I
 *     heard the Prophet ﷺ say", ...) in the diacritic-free skeleton of the
 *     text and mapping that position back into the original string.
 *
 *   parseIsnad(isnadAr)     → { names, sighas }
 *     The chain of names in the isnad, compiler's teacher first and Companion
 *     last, with the transmission formula (sigha) that introduced each name.
 *
 * The skeleton: Arabic text with diacritics, tatweel and bidi marks removed
 * and the letter variants unified the same way as normalizeArabic in text.ts
 * (آأإٱ → ا, ة → ه, ى → ي). Unlike normalizeArabic it is index-preserving:
 * every skeleton character corresponds to exactly one character of the
 * original, so a match in the skeleton can be mapped back to the original.
 */

/** Diacritics, Qur'anic annotation marks, tatweel, zero-width and bidi marks: dropped from the skeleton. */
const MARK = /[ؐ-ًؚ-ٰٟۖ-ۭـ​-‏﻿]/;
/** Arabic letters proper (hamza … ya, plus alif wasla). Everything else that is not a mark becomes a space. */
const LETTER = /[ء-يٱ]/;

export interface Skeleton {
  /** The normalised, diacritic-free text. */
  text: string;
  /** map[k] is the index in the original string of skeleton character k. */
  map: number[];
}

/** Unify letter variants one-to-one, as normalizeArabic does. */
function unifyLetter(ch: string): string {
  switch (ch) {
    case "آ":
    case "أ":
    case "إ":
    case "ٱ":
      return "ا";
    case "ة":
      return "ه";
    case "ى":
      return "ي";
    default:
      return ch;
  }
}

/** Build the index-preserving skeleton of an Arabic string. */
export function skeleton(textAr: string): Skeleton {
  const chars: string[] = [];
  const map: number[] = [];
  for (let i = 0; i < textAr.length; i++) {
    const ch = textAr[i];
    if (MARK.test(ch)) continue; // marks vanish without leaving a space
    chars.push(LETTER.test(ch) ? unifyLetter(ch) : " "); // punctuation, digits, Latin → space
    map.push(i);
  }
  return { text: chars.join(""), map };
}

// ----------------------------------------------------------------- the split

/**
 * A speech marker is the Prophet's name with the eulogy, carrying a verb of
 * speech before it (قال/فقال/قالت/يقول/سمعت) or after it (قال/فقال/يقول,
 * optionally preceded by أنه). Written in skeleton spelling (صلي, النبي).
 * Examples matched: «قال رسول الله صلى الله عليه وسلم», «أن رسول الله صلى
 * الله عليه وسلم قال», «عن النبي صلى الله عليه وسلم قال», «قال النبي صلى
 * الله عليه وسلم», «سمعت رسول الله صلى الله عليه وسلم يقول». The bare «عن
 * النبي صلى الله عليه وسلم» without a verb is not a speech marker.
 */
// After the eulogy only a masculine verb can be the Prophet's own speech; «قالت»
// there is a woman narrating («زوج النبي ﷺ قالت»), so it is not a marker. The
// verb must end at a word boundary, or «قال» would match inside «قالت».
const SPEECH_MARKER =
  /(?:(?:و|ف)?(?:قالت|قال|يقول|سمعت)\s+)?(?:رسول\s+الله|النبي|نبي\s+الله)\s+صلي\s+الله\s+عليه\s+وسلم(?:\s+(?:انه\s+)?(?:فقال|قال|يقول)(?=\s|$))?/g;

const VERB_BEFORE = /^(?:و|ف)?(?:قالت|قال|يقول|سمعت)\s/;
const VERB_AFTER = /(?:قال|فقال|يقول)$/;

/**
 * Proportion of the text within which the marker must end for the split to be
 * proposed. A "marker" later than this is almost always the Prophet quoted
 * inside a story that began earlier, not the isnad/matn boundary.
 */
export const SPLIT_MAX_POSITION = 0.85;

/**
 * Propose where the matn begins. Returns the index in textAr of the first
 * letter after the last speech marker, or null when no marker with a verb
 * lies in the first 85% of the text.
 */
export function splitIsnadMatn(textAr: string): { at: number } | null {
  const sk = skeleton(textAr);
  let last: { end: number } | null = null;
  SPEECH_MARKER.lastIndex = 0;
  for (let m = SPEECH_MARKER.exec(sk.text); m; m = SPEECH_MARKER.exec(sk.text)) {
    const s = m[0];
    if (!VERB_BEFORE.test(s) && !VERB_AFTER.test(s)) continue; // the name alone is not a marker
    last = { end: m.index + s.length };
  }
  if (!last) return null;
  if (last.end / sk.text.length > SPLIT_MAX_POSITION) return null;
  // First letter after the marker, mapped back to the original string.
  let k = last.end;
  while (k < sk.text.length && sk.text[k] === " ") k++;
  if (k >= sk.text.length) return null; // marker at the very end: nothing to split off
  return { at: sk.map[k] };
}

// ----------------------------------------------------------------- the chain

/** Transmission formulae and connectives that introduce the next name. Skeleton spelling. */
const FORMULA = new Set([
  "حدثنا", "حدثني", "حدثتنا", "حدثتني",
  "اخبرنا", "اخبرني", "اخبرتنا", "اخبرتني",
  "انبانا", "انباني", "انبا",
  "ثنا", "نا", "ثني",
  "سمعت", "سمع", "سمعنا",
  "عن", "قال", "قالت", "قالا", "قالوا", "يقول", "يقولان",
  "ان", "انه", "انها", "انهما",
  "قرات", "قرئ",
]);
/** Words that may follow a formula as part of it (e.g. قرأت *على* مالك). */
const FORMULA_TAIL = new Set(["علي", "له", "لنا", "لي"]);
/** Verbs that close a name from behind: «أن جابرا أخبره», «حدثاه». */
const CLOSER = new Set(["حدثه", "حدثاه", "حدثته", "حدثهم", "حدثها", "اخبره", "اخبرته", "اخبرها", "اخبراه", "اخبرهم", "سمعه", "سمعها", "سمعهم"]);
/**
 * Words that a name never begins with; meeting one where a name is expected
 * means the matn has begun (used when a text could not be split).
 */
const MATN_START = new Set([
  "كان", "كانت", "كنت", "كنا", "كانوا", "اذا", "اذ", "لما", "لا", "ما", "من", "يا", "انما", "بينما", "بينا",
  "هذا", "هذه", "ذلك", "تلك", "اني", "انا", "انك", "قد", "ثم", "لم", "ليس", "كيف", "اي", "كل", "لو", "لولا",
  "اتي", "اتيت", "جاء", "خرج", "خرجنا", "دخل", "دخلت", "سال", "سالت", "سالنا", "سالته", "سالوا", "قلت", "قلنا",
  "قام", "بعث", "امر", "نهي", "صلي", "صليت", "رايت", "رات", "راي", "سمعتم", "نزلت", "لقد", "والله", "فيما",
  "في", "علي", "الي", "له", "لها", "لهم", "لي", "لنا", "انزل", "انزلت", "كلمتان", "خير", "شر", "مثل", "اول", "اخر",
]);
/**
 * Words that never occur inside a name. A segment containing one of them is
 * running text, not a name: the matn has begun. (علي is absent on purpose:
 * it is both the preposition and the name Ali.)
 */
const MATN_WORDS = new Set([
  "في", "الي", "من", "مع", "ما", "لا", "اذا", "اذ", "لما", "بينما", "كان", "كانت", "كانوا", "كنت", "كنا", "ثم", "حتي", "قد",
  "لم", "لن", "هذا", "هذه", "ذلك", "يا", "انا", "نحن", "له", "لها", "لهم", "كل", "يوم", "ليله", "الناس", "فقالت",
  "فقالوا", "قلت", "قلنا", "جاء", "خرج", "دخل", "اتي", "راي", "رايت",
]);
/** Verbs of speech after which «ان» is the particle إنّ opening the speech, not the formula أنّ introducing a name. */
const SPEECH_VERBS = new Set(["قال", "قالت", "قالا", "قالوا", "يقول", "فقال", "فقالت", "وقال"]);
/** A name segment longer than this is not a name; the matn has begun. */
const MAX_NAME_WORDS = 10;

interface Word {
  w: string; // skeleton form
  start: number; // index in the original string
  end: number; // exclusive, in the original string
}

/** Tokenise the skeleton into words with their original spans. */
function words(textAr: string): Word[] {
  const sk = skeleton(textAr);
  const out: Word[] = [];
  const re = /\S+/g;
  for (let m = re.exec(sk.text); m; m = re.exec(sk.text)) {
    out.push({ w: m[0], start: sk.map[m.index], end: sk.map[m.index + m[0].length - 1] + 1 });
  }
  return out;
}

/** Strip a leading conjunction (و/ف) when the remainder is a known formula. */
function asFormula(w: string): string | null {
  if (FORMULA.has(w)) return w;
  if (w.length > 2 && (w[0] === "و" || w[0] === "ف") && FORMULA.has(w.slice(1))) return w;
  return null;
}

/** «رضي الله عنه/عنها/عنهم/عنهما» starting at words[i]; returns the number of words it spans, or 0. */
function honorificAt(ws: Word[], i: number): number {
  if (ws[i]?.w === "رضي" && ws[i + 1]?.w === "الله" && /^عنه(?:ا|م|ما)?$/.test(ws[i + 2]?.w ?? "")) return 3;
  return 0;
}

/** The Prophet's name or eulogy, or the chain switch ح: the chain is complete. */
function terminatorAt(ws: Word[], i: number): boolean {
  const w = ws[i]?.w;
  if (!w) return false;
  if (w === "ح") return true;
  if (w === "النبي") return true;
  if (w === "رسول" && ws[i + 1]?.w === "الله") return true;
  if (w === "نبي" && ws[i + 1]?.w === "الله") return true;
  if (w === "صلي" && ws[i + 1]?.w === "الله" && ws[i + 2]?.w === "عليه") return true;
  return false;
}

/** Trim punctuation and whitespace from the edges of an original-text slice. */
function clean(s: string): string {
  return s.replace(/^[\s​-‏ـ.,:;"'«»()\-ـ]+|[\s​-‏ـ.,:;"'«»()\-ـ]+$/g, "");
}

/**
 * Parse the chain of transmission. Pass the isnad part of the text (or the
 * whole text when it could not be split); the parser stops on its own at the
 * Prophet's name, at a chain switch (ح), at a word that cannot begin a name,
 * or at a segment too long to be a name.
 *
 * names[i] is the diacritised name as it appears in the text (honorifics
 * stripped); sighas[i] is the formula that introduced it, in skeleton
 * spelling, e.g. "قال حدثنا", "عن", "انه سمع". The two arrays are the same
 * length. Compiler's teacher first, Companion last.
 */
export function parseIsnad(isnadAr: string): { names: string[]; sighas: string[] } {
  const ws = words(isnadAr);
  const names: string[] = [];
  const sighas: string[] = [];
  let sigha: string[] = [];
  let expectName = false; // true right after a formula
  let i = 0;
  while (i < ws.length) {
    if (terminatorAt(ws, i)) break;
    const h = honorificAt(ws, i);
    if (h) {
      i += h;
      expectName = false;
      continue;
    }
    const w = ws[i].w;
    const f = asFormula(w);
    if (f) {
      // «قال إن …», «يقول إن …»: the speech itself has begun.
      if ((f === "ان" || f === "وان") && sigha.length && SPEECH_VERBS.has(sigha[sigha.length - 1])) break;
      sigha.push(f);
      expectName = true;
      i++;
      // «قرأت على», «قال له»: swallow the tail word into the formula.
      if (i < ws.length && FORMULA_TAIL.has(ws[i].w) && (f === "قرات" || f === "قرئ" || f === "قال" || f === "قالت")) {
        sigha.push(ws[i].w);
        i++;
      }
      continue;
    }
    if (CLOSER.has(w) || w === "و") {
      i++;
      continue;
    }
    // A run of non-formula words: a name if we were expecting one.
    if (expectName && MATN_START.has(w)) break;
    const segStart = i;
    while (i < ws.length && !asFormula(ws[i].w) && !honorificAt(ws, i) && !terminatorAt(ws, i) && !CLOSER.has(ws[i].w)) i++;
    const seg = ws.slice(segStart, i);
    if (expectName) {
      if (seg.length > MAX_NAME_WORDS) break; // too long for a name: the matn has begun
      if (seg.some((x) => MATN_WORDS.has(x.w))) break; // running text, not a name
      // «قال غزوت مع النبي ﷺ»: words between a bare verb of speech and the
      // Prophet's name are the opening of the report, not a narrator. A name
      // introduced by a bare «قال» («قال ابن شهاب») is followed by a formula,
      // an honorific or the end of the chain instead.
      if (terminatorAt(ws, i) && sigha.every((s) => SPEECH_VERBS.has(s))) break;
      const name = clean(isnadAr.slice(seg[0].start, seg[seg.length - 1].end));
      if (name) {
        names.push(name);
        sighas.push(sigha.join(" "));
      }
      sigha = [];
      expectName = false;
    }
    // Otherwise stray words after a closed name («على المنبر»): ignored.
  }
  return { names, sighas };
}
