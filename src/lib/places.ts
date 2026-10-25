/**
 * Places the narrators lived, for the journey map and the regional-cluster
 * checks. Coordinates are approximate modern positions; the map is schematic.
 * `demonym` is the English form used in the subtleties ("Basran", "Kufan").
 */
export interface Place {
  name: string;
  nameAr: string;
  lat: number;
  lon: number;
  demonym: string;
  /** true when the string names a region rather than a city, so the point is representative only */
  approx?: boolean;
}

export const PLACES: Record<string, Place> = {
  Madinah: { name: "Madinah", nameAr: "المدينة", lat: 24.47, lon: 39.61, demonym: "Madinan" },
  Makkah: { name: "Makkah", nameAr: "مكة", lat: 21.42, lon: 39.83, demonym: "Makkan" },
  Taif: { name: "al-Ta'if", nameAr: "الطائف", lat: 21.27, lon: 40.42, demonym: "Ta'ifi" },
  Yemen: { name: "Yemen", nameAr: "اليمن", lat: 15.35, lon: 44.21, demonym: "Yemeni", approx: true },
  Sanaa: { name: "San'a", nameAr: "صنعاء", lat: 15.35, lon: 44.21, demonym: "San'ani" },
  Jerusalem: { name: "Jerusalem", nameAr: "بيت المقدس", lat: 31.78, lon: 35.23, demonym: "of Jerusalem" },
  Damascus: { name: "Damascus", nameAr: "دمشق", lat: 33.51, lon: 36.29, demonym: "Damascene" },
  Syria: { name: "Syria", nameAr: "الشام", lat: 33.51, lon: 36.29, demonym: "Syrian", approx: true },
  Hims: { name: "Hims", nameAr: "حمص", lat: 34.73, lon: 36.72, demonym: "of Hims" },
  Beirut: { name: "Beirut", nameAr: "بيروت", lat: 33.89, lon: 35.5, demonym: "of Beirut" },
  Aleppo: { name: "Aleppo", nameAr: "حلب", lat: 36.2, lon: 37.16, demonym: "of Aleppo" },
  Fustat: { name: "Fustat", nameAr: "الفسطاط", lat: 30.01, lon: 31.23, demonym: "Egyptian" },
  Egypt: { name: "Egypt", nameAr: "مصر", lat: 30.01, lon: 31.23, demonym: "Egyptian", approx: true },
  Alexandria: { name: "Alexandria", nameAr: "الإسكندرية", lat: 31.2, lon: 29.92, demonym: "Alexandrian" },
  Kufa: { name: "Kufa", nameAr: "الكوفة", lat: 32.03, lon: 44.4, demonym: "Kufan" },
  Basra: { name: "Basra", nameAr: "البصرة", lat: 30.5, lon: 47.78, demonym: "Basran" },
  Baghdad: { name: "Baghdad", nameAr: "بغداد", lat: 33.31, lon: 44.37, demonym: "Baghdadi" },
  Wasit: { name: "Wasit", nameAr: "واسط", lat: 32.18, lon: 46.3, demonym: "of Wasit" },
  Mosul: { name: "Mosul", nameAr: "الموصل", lat: 36.34, lon: 43.13, demonym: "of Mosul" },
  Iraq: { name: "Iraq", nameAr: "العراق", lat: 32.03, lon: 44.4, demonym: "Iraqi", approx: true },
  Rayy: { name: "Rayy", nameAr: "الري", lat: 35.6, lon: 51.43, demonym: "Razi" },
  Qazvin: { name: "Qazvin", nameAr: "قزوين", lat: 36.27, lon: 50.0, demonym: "Qazwini" },
  Isfahan: { name: "Isfahan", nameAr: "أصبهان", lat: 32.65, lon: 51.67, demonym: "Isfahani" },
  Hamadan: { name: "Hamadan", nameAr: "همذان", lat: 34.8, lon: 48.5, demonym: "Hamadhani" },
  Jurjan: { name: "Jurjan", nameAr: "جرجان", lat: 36.84, lon: 54.44, demonym: "Jurjani" },
  Nishapur: { name: "Nishapur", nameAr: "نيسابور", lat: 36.21, lon: 58.8, demonym: "Naysaburi" },
  Tus: { name: "Tus", nameAr: "طوس", lat: 36.5, lon: 59.5, demonym: "Tusi" },
  Khurasan: { name: "Khurasan", nameAr: "خراسان", lat: 36.21, lon: 58.8, demonym: "Khurasani", approx: true },
  Marw: { name: "Marw", nameAr: "مرو", lat: 37.66, lon: 62.19, demonym: "Marwazi" },
  Herat: { name: "Herat", nameAr: "هراة", lat: 34.35, lon: 62.2, demonym: "Harawi" },
  Balkh: { name: "Balkh", nameAr: "بلخ", lat: 36.76, lon: 66.9, demonym: "Balkhi" },
  Bukhara: { name: "Bukhara", nameAr: "بخارى", lat: 39.77, lon: 64.42, demonym: "Bukhari" },
  Samarqand: { name: "Samarqand", nameAr: "سمرقند", lat: 39.65, lon: 66.96, demonym: "Samarqandi" },
  Tirmidh: { name: "Tirmidh", nameAr: "ترمذ", lat: 37.22, lon: 67.28, demonym: "Tirmidhi" },
  Khwarazm: { name: "Khwarazm", nameAr: "خوارزم", lat: 41.6, lon: 60.7, demonym: "Khwarazmi", approx: true },
  Yamama: { name: "al-Yamama", nameAr: "اليمامة", lat: 24.1, lon: 47.3, demonym: "of al-Yamama" },
  Bahrain: { name: "Bahrain", nameAr: "البحرين", lat: 26.2, lon: 50.5, demonym: "of Bahrain", approx: true },
};

const ALIASES: Record<string, string> = {
  medina: "Madinah",
  "al-madinah": "Madinah",
  "al-madina": "Madinah",
  madina: "Madinah",
  mecca: "Makkah",
  "al-makkah": "Makkah",
  makka: "Makkah",
  "al-sham": "Syria",
  sham: "Syria",
  levant: "Syria",
  misr: "Egypt",
  cairo: "Fustat",
  "al-fustat": "Fustat",
  kufah: "Kufa",
  "al-kufa": "Kufa",
  "al-basra": "Basra",
  basrah: "Basra",
  bagdad: "Baghdad",
  naysabur: "Nishapur",
  nisabur: "Nishapur",
  nishapour: "Nishapur",
  merv: "Marw",
  marv: "Marw",
  bukhoro: "Bukhara",
  termez: "Tirmidh",
  tirmiz: "Tirmidh",
  "al-rayy": "Rayy",
  rey: "Rayy",
  "al-yaman": "Yemen",
  sanaa: "Sanaa",
  "san'a": "Sanaa",
  "sana'a": "Sanaa",
  homs: "Hims",
  "al-quds": "Jerusalem",
  "bayt al-maqdis": "Jerusalem",
  hirat: "Herat",
  asbahan: "Isfahan",
  esfahan: "Isfahan",
  hamadhan: "Hamadan",
  jurjan: "Jurjan",
  gorgan: "Jurjan",
};

/** Resolve a free-text region ("Makkah", "Kufa, then Baghdad", "Egypt; later Damascus") to its first place. */
export function placeFor(region: string | undefined): Place | undefined {
  if (!region) return undefined;
  const first = region.split(/[,;(]| then | later | and /i)[0].trim();
  const key = first.replace(/^al-/i, "").replace(/['’`]/g, "'").toLowerCase();
  for (const k of Object.keys(PLACES)) if (k.toLowerCase() === key || PLACES[k].name.toLowerCase().replace(/^al-/, "") === key) return PLACES[k];
  const alias = ALIASES[key] ?? ALIASES[first.toLowerCase()];
  return alias ? PLACES[alias] : undefined;
}

/** Every place named in a region string, in order ("Kufa, then Makkah" → [Kufa, Makkah]). */
export function placesFor(region: string | undefined): Place[] {
  if (!region) return [];
  const parts = region.split(/[,;]| then | later | and /i).map((p) => p.replace(/^\s*(then|later|or|and)\s+/i, "").trim()).filter(Boolean);
  const out: Place[] = [];
  for (const part of parts) {
    const p = placeFor(part);
    if (p && !out.some((x) => x.name === p.name)) out.push(p);
  }
  return out;
}

/** Equirectangular projection tuned for the map's frame (lon 26–70, lat 12–46). */
export const MAP = { lon0: 26, lat0: 46, lon1: 70, lat1: 12, k: 14, cos: 0.87 };
export function project(lat: number, lon: number): { x: number; y: number } {
  return { x: (lon - MAP.lon0) * MAP.k * MAP.cos, y: (MAP.lat0 - lat) * MAP.k };
}
export const MAP_W = (MAP.lon1 - MAP.lon0) * MAP.k * MAP.cos; // ≈ 536
export const MAP_H = (MAP.lat0 - MAP.lat1) * MAP.k; // 476
