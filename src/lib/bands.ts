import type { Band } from "@/data/types";

export interface BandStyle {
  label: string;
  labelAr: string;
  color: string; // CSS var
  tint: string; // CSS var
  glyph: "solid" | "half" | "hollow" | "crossed" | "dotted" | "ring" | "star";
  meaning: string;
}

export const BANDS: Record<Band, BandStyle> = {
  prophet: {
    label: "The Prophet ﷺ",
    labelAr: "النبي ﷺ",
    color: "var(--gold)",
    tint: "var(--gold-tint)",
    glyph: "star",
    meaning: "The source of the report.",
  },
  sahabi: {
    label: "Companion",
    labelAr: "صحابي",
    color: "var(--lapis)",
    tint: "var(--lapis-tint)",
    glyph: "ring",
    meaning: "A Companion of the Prophet ﷺ. Not graded: the discipline treats all Companions as upright.",
  },
  thiqa: {
    label: "Reliable",
    labelAr: "ثقة",
    color: "var(--g-thiqa)",
    tint: "var(--g-thiqa-tint)",
    glyph: "solid",
    meaning: "Upright and precise. Critics accept their reports.",
  },
  saduq: {
    label: "Truthful, lesser precision",
    labelAr: "صدوق",
    color: "var(--g-saduq)",
    tint: "var(--g-saduq-tint)",
    glyph: "half",
    meaning: "Honest, but with recorded lapses of memory or precision. Reports are usable with care, often raised by corroboration.",
  },
  daif: {
    label: "Weak",
    labelAr: "ضعيف",
    color: "var(--g-daif)",
    tint: "var(--g-daif-tint)",
    glyph: "hollow",
    meaning: "Critics documented enough error that reports through this narrator do not stand on their own.",
  },
  matruk: {
    label: "Abandoned",
    labelAr: "متروك",
    color: "var(--g-daif)",
    tint: "var(--g-daif-tint)",
    glyph: "crossed",
    meaning: "Accused of serious error or dishonesty. Reports through this narrator are set aside.",
  },
  unknown: {
    label: "Unassessed",
    labelAr: "غير مقيَّم",
    color: "var(--g-unknown)",
    tint: "var(--g-unknown-tint)",
    glyph: "dotted",
    meaning: "No critic's assessment has been entered in this record yet. This is a state of our data, not a verdict: the discipline's own terms for an unvouched narrator (majhul, mastur) are shown only when a critic used them.",
  },
};

export type HadithBand = "sahih" | "hasan" | "daif" | "mawdu" | "disputed" | "note";

export const HADITH_BANDS: Record<HadithBand, { label: string; labelAr: string; color: string; tint: string; glyph: BandStyle["glyph"]; meaning: string }> = {
  sahih: { label: "Sahih", labelAr: "صحيح", color: "var(--g-thiqa)", tint: "var(--g-thiqa-tint)", glyph: "solid", meaning: "Authentic: an unbroken chain of reliable, precise narrators, free of anomaly and hidden defect." },
  hasan: { label: "Hasan", labelAr: "حسن", color: "var(--g-thiqa)", tint: "var(--g-thiqa-tint)", glyph: "half", meaning: "Sound: meets the conditions of sahih except that a narrator's precision is somewhat lesser, or the chain is weak on its own but corroborated." },
  daif: { label: "Da'if", labelAr: "ضعيف", color: "var(--g-saduq)", tint: "var(--g-saduq-tint)", glyph: "hollow", meaning: "Weak: fails one or more conditions. Weak does not mean false; it means unproven by this chain." },
  mawdu: { label: "Fabricated", labelAr: "موضوع", color: "var(--g-daif)", tint: "var(--g-daif-tint)", glyph: "crossed", meaning: "Judged a fabrication: attributed to the Prophet ﷺ without any sound basis." },
  disputed: { label: "Disputed", labelAr: "مختلف فيه", color: "var(--g-unknown)", tint: "var(--g-unknown-tint)", glyph: "dotted", meaning: "Scholars reached different verdicts. All are shown." },
  note: { label: "Note", labelAr: "تنبيه", color: "var(--g-unknown)", tint: "var(--g-unknown-tint)", glyph: "dotted", meaning: "A remark rather than a grade." },
};
