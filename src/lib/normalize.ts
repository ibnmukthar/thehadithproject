/**
 * Normalise Arabic for fingerprinting: strip tashkeel and tatweel, unify alif
 * variants, ta marbuta → ha, alif maqsura → ya, collapse whitespace, drop
 * punctuation. This is a documented, reproducible rule; the fingerprint is a
 * checksum of meaning-bearing letters, not of a particular edition's typing.
 * Pure: safe to run in the browser.
 */
export function normalizeArabic(s: string): string {
  return s
    .normalize("NFC")
    .replace(/[ؐ-ًؚ-ٰٟۖ-ۭ]/g, "") // harakat & marks
    .replace(/[‎‏‪-‮]/g, "") // bidi marks
    .replace(/ـ/g, "") // tatweel
    .replace(/[آأإٱ]/g, "ا") // آ أ إ ٱ → ا
    .replace(/ة/g, "ه") // ة → ه
    .replace(/ى/g, "ي") // ى → ي
    .replace(/[^ء-ي\s]/g, " ") // keep letters only
    .replace(/\s+/g, " ")
    .trim();
}

/** Browser-side fingerprint with the same rule as the build (sha256 of the normalised text, first 12 hex). */
export async function fingerprintInBrowser(matnAr: string): Promise<string> {
  const norm = normalizeArabic(matnAr);
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(norm));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 12);
}
