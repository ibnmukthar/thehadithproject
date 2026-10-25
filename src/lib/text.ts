import { createHash } from "crypto";
import { normalizeArabic } from "./normalize";

export { normalizeArabic };

export function fingerprint(matnAr: string): string {
  const norm = normalizeArabic(matnAr);
  return createHash("sha256").update(norm, "utf8").digest("hex").slice(0, 12);
}

export function hijriToCE(ah: number): number {
  // Approximate conversion used only for orientation labels.
  return Math.round(ah * 0.970229 + 621.57);
}
