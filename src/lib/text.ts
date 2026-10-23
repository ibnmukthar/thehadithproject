import { createHash } from "crypto";

/**
 * Normalise Arabic for fingerprinting: strip tashkeel and tatweel, unify alif
 * variants, ta marbuta → ha, alif maqsura → ya, collapse whitespace, drop
 * punctuation. This is a documented, reproducible rule; the fingerprint is a
 * checksum of meaning-bearing letters, not of a particular edition's typing.
 */
export function normalizeArabic(s: string): string {
  return s
    .normalize("NFC")
    .replace(/[ؐ-ًؚ-ٰٟۖ-ۭ]/g, "") // harakat & marks
    .replace(/ـ/g, "") // tatweel
    .replace(/[آأإٱ]/g, "ا") // آ أ إ ٱ → ا
    .replace(/ة/g, "ه") // ة → ه
    .replace(/ى/g, "ي") // ى → ي
    .replace(/[^ء-ي\s]/g, " ") // keep letters only
    .replace(/\s+/g, " ")
    .trim();
}

export function fingerprint(matnAr: string): string {
  const norm = normalizeArabic(matnAr);
  return createHash("sha256").update(norm, "utf8").digest("hex").slice(0, 12);
}

export function hijriToCE(ah: number): number {
  // Approximate conversion used only for orientation labels.
  return Math.round(ah * 0.970229 + 621.57);
}
