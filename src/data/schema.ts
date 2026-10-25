/**
 * The data schema. Every record under /data is validated against these
 * schemas at build time, so a malformed contribution fails the build rather
 * than reaching the site. The TypeScript types in ./types.ts are derived from
 * here; this file is the single source of truth.
 *
 * The narrator record mirrors the anatomy of a classical entry (tarjama) in
 * al-Mizzi's Tahdhib al-Kamal and its abridgements, with the fields that the
 * specialist works add (tadlis, ikhtilat, non-hearing, orthography). See
 * docs/research/rijal-entry-structure.md for the source of each field.
 */
import { z } from "zod";

export const BandSchema = z.enum(["prophet", "sahabi", "thiqa", "saduq", "daif", "matruk", "unknown"]);
export const HadithBandSchema = z.enum(["sahih", "hasan", "daif", "mawdu", "disputed", "note"]);
export const LinkKindSchema = z.enum(["sama", "ikhbar", "an", "qala"]);

/** The sigla (rumuz) al-Mizzi used for the six books and their appended works, as fixed by Ibn Hajar in the Taqrib. */
export const SIGLA = [
  "ع", "٤", // all six; the four Sunan
  "خ", "خت", "بخ", "عخ", "ي", "ر", // al-Bukhari: Sahih; ta'liqan; al-Adab al-Mufrad; Khalq Af'al al-'Ibad; Raf' al-Yadayn; al-Qira'a khalf al-Imam
  "م", "مق", // Muslim: Sahih; the introduction
  "د", "مد", "قد", "خد", "ف", "صد", "ل", "كد", // Abu Dawud: Sunan; al-Marasil; al-Qadar; al-Nasikh wa al-Mansukh; al-Tafarrud; Fada'il al-Ansar; al-Masa'il; Musnad Malik
  "ت", "تم", // al-Tirmidhi: al-Jami'; al-Shama'il
  "س", "سي", "ص", "عس", "كن", // al-Nasa'i: Sunan; 'Amal al-Yawm wa al-Layla; Khasa'is 'Ali; Musnad 'Ali; Musnad Malik
  "ق", "فق", // Ibn Majah: Sunan; al-Tafsir
  "تمييز", // included only to distinguish a homonym; no narration in these books
] as const;
export const SiglumSchema = z.enum(SIGLA);

export const SourceRefSchema = z.object({ label: z.string(), url: z.string().optional() });

export const CriticVerdictSchema = z.object({
  critic: z.string(),
  criticDied: z.number().optional(),
  via: z.string().optional(), // chain of attribution to the critic, e.g. "al-Juzajani, from Ahmad"
  ar: z.string().optional(),
  en: z.string(),
  source: z.string(),
  url: z.string().optional(),
});

export const ReviewSchema = z.object({
  status: z.enum(["draft", "validated", "approved"]),
  signoffs: z
    .array(
      z.object({
        who: z.string(),
        role: z.enum(["contributor", "reviewer", "editor"]),
        date: z.string(), // ISO date
        decision: z.enum(["validated", "approved", "changes-requested"]),
        note: z.string().optional(),
      }),
    )
    .default([]),
});

const PersonLinkSchema = z.object({
  id: z.string().optional(), // narrator id when the person has a record
  name: z.string(),
  nameAr: z.string().optional(),
  sigla: z.array(SiglumSchema).optional(), // in which books this specific link occurs (al-Mizzi's per-link rumuz)
  source: z.string().optional(),
});

export const NarratorSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  nameAr: z.string(),
  short: z.string(),
  shortAr: z.string(),

  // Names
  kunya: z.string().optional(),
  kunyaAr: z.string().optional(),
  kunyaVariants: z.array(z.string()).optional(),
  laqab: z.object({ ar: z.string().optional(), en: z.string() }).optional(),
  nisbas: z.array(z.object({ ar: z.string().optional(), en: z.string(), kind: z.enum(["tribal", "geographic", "other"]) })).optional(),
  mawla: z.string().optional(), // client (mawla) of whom
  fatherName: z.string().optional(), // transliterated, for name-pattern checks
  orthography: z.object({ spelled: z.string(), homographs: z.array(z.string()).optional(), source: z.string() }).optional(),

  // Dates and places
  born: z.number().nullable().optional(),
  bornNote: z.string().optional(),
  died: z.number().nullable().optional(),
  diedNote: z.string().optional(),
  deathVariants: z.array(z.object({ year: z.union([z.number(), z.string()]), authority: z.string(), source: z.string().optional() })).optional(),
  region: z.string(),
  origin: z.string().optional(),
  residence: z.array(z.string()).optional(),

  // Standing
  tabaqa: z.number().int().min(1).max(12).optional(),
  taqrib: z.object({ ar: z.string(), en: z.string(), number: z.string().optional(), rank: z.number().int().min(1).max(12).optional() }).optional(),
  band: BandSchema,
  role: z.string().optional(),
  rumuz: z.array(SiglumSchema).optional(),
  external: z
    .object({
      shamela: z.string().optional(),
      sunnah: z.string().optional(),
      tahdhibKamal: z.string().optional(),
      tahdhibTahdhib: z.string().optional(),
      kashif: z.string().optional(),
      mizan: z.string().optional(),
    })
    .optional(),

  // The graph
  teachers: z.array(PersonLinkSchema).optional(),
  students: z.array(PersonLinkSchema).optional(),

  // The critics
  verdicts: z.array(CriticVerdictSchema),
  dhahabi: z.object({ ar: z.string().optional(), en: z.string(), source: z.string() }).optional(),
  tahrir: z.object({ grade: z.string(), note: z.string(), rebuttal: z.string().optional(), source: z.string() }).optional(),

  // Specialist works
  tadlis: z.object({ rank: z.number().int().min(1).max(5), type: z.string().optional(), source: z.string(), note: z.string().optional() }).optional(),
  ikhtilat: z
    .object({
      when: z.string().optional(),
      cause: z.string().optional(),
      heardBefore: z.array(z.string()).optional(),
      heardAfter: z.array(z.string()).optional(),
      heardBoth: z.array(z.string()).optional(),
      disputed: z.array(z.string()).optional(),
      source: z.string(),
    })
    .optional(),
  notHeardFrom: z.array(z.object({ name: z.string(), id: z.string().optional(), authority: z.string(), source: z.string(), counter: z.string().optional() })).optional(),

  // Companions
  sahabaClass: z.number().int().min(1).max(4).optional(), // Ibn Hajar's four classes in al-Isaba
  companionCounts: z
    .object({
      total: z.number().optional(),
      agreed: z.number().optional(),
      bukhariOnly: z.number().optional(),
      muslimOnly: z.number().optional(),
      inBukhari: z.number().optional(),
      source: z.string(),
    })
    .optional(),

  flags: z.array(z.object({ label: z.string(), detail: z.string() })).optional(),
  bio: z.string(),
  provenance: z
    .array(
      z.object({
        field: z.string(),
        layer: z.enum(["tahdhib-kamal", "tahdhib-tahdhib", "taqrib", "kashif", "mizan", "specialist", "isaba", "modern", "class-notes"]),
        ref: z.string(),
      }),
    )
    .optional(),
  sources: z.array(SourceRefSchema),
  review: ReviewSchema.optional(),
});

export const TransmissionSchema = z.object({
  from: z.string(),
  to: z.string(),
  sighaAr: z.string(),
  sighaEn: z.string(),
  kind: LinkKindSchema,
  note: z.string().optional(),
});

export const NarrationSchema = z.object({
  cite: z.string(),
  collection: z.string(),
  collectionAr: z.string(),
  numbering: z.string(),
  number: z.string(),
  bookChapter: z.string().optional(),
  chain: z.array(z.string()),
  links: z.array(TransmissionSchema),
  isnadAr: z.string(),
  matnAr: z.string(),
  matnEn: z.string(),
  url: z.string().optional(),
});

export const ScholarVerdictSchema = z.object({
  scholar: z.string(),
  died: z.union([z.number(), z.string()]).optional(),
  era: z.enum(["classical", "contemporary"]),
  grade: z.string(),
  gradeAr: z.string().optional(),
  band: z.enum(["sahih", "hasan", "daif", "mawdu", "note"]),
  scope: z.string().optional(),
  source: z.string(),
  quoteAr: z.string().optional(),
  reason: z.string(),
  url: z.string().optional(),
});

export const RouteNodeSchema = z.object({ name: z.string(), band: z.union([BandSchema, z.literal("gap")]).optional(), flag: z.string().optional() });

export const RouteComparisonSchema = z.object({
  title: z.string(),
  intro: z.string(),
  routes: z.array(
    z.object({
      label: z.string(),
      verdict: z.string(),
      band: HadithBandSchema,
      nodes: z.array(RouteNodeSchema),
      note: z.string(),
    }),
  ),
});

/** A parallel narration (takhrij entry). */
export const ParallelSchema = z.object({
  cite: z.string(),
  label: z.string(),
  note: z.string().optional(),
  url: z.string().optional(),
  chainNote: z.string().optional(), // where the chain diverges or converges, e.g. "shares the chain from Yahya ibn Sa'id upward"
  wordingNote: z.string().optional(), // differences in wording; whose lafz is used
});

/** A subtlety of the chain (latifa) entered by hand; computed ones are generated from the narrator records at render time. */
export const SubtletySchema = z.object({
  text: z.string(),
  kind: z.enum(["scholar", "check"]), // "check": a fact a reader can verify from the records; "scholar": an inference that needs a trained eye
  source: z.string().optional(),
});

export const ExplanationSchema = z.object({
  status: z.enum(["sourced", "coming-soon"]),
  note: z.string().optional(),
  commentaries: z.array(z.object({ work: z.string(), author: z.string(), point: z.string(), url: z.string().optional() })).optional(),
  rulings: z.array(z.object({ text: z.string(), source: z.string() })).optional(),
});

export const HadithSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  titleAr: z.string(),
  takeaway: z.string(),
  status: z.object({ band: z.enum(["sahih", "hasan", "daif", "disputed"]), label: z.string(), line: z.string() }),
  primary: NarrationSchema,
  also: z.array(ParallelSchema),
  verdicts: z.array(ScholarVerdictSchema),
  fanOut: z.object({ afterId: z.string(), headline: z.string(), detail: z.string(), named: z.array(z.string()), source: z.string() }).optional(),
  lessons: z.array(z.object({ title: z.string(), body: z.string() })),
  subtleties: z.array(SubtletySchema).optional(),
  explanation: ExplanationSchema.optional(),
  comparison: RouteComparisonSchema.optional(),
  context: z.string().optional(),
  vocabulary: z.array(z.object({ term: z.string(), ar: z.string(), meaning: z.string() })).optional(),
  family: z.string().optional(), // family id, e.g. "tuhfa:10612" (al-Mizzi's Tuhfat al-Ashraf entry) or a curated id
  study: z.object({ track: z.string(), order: z.number(), credit: z.string().optional() }).optional(),
  sources: z.array(SourceRefSchema),
  review: ReviewSchema.optional(),
});

/** A narration of a whole collection, ingested from a licensed text spine. */
export const CollectionNarrationSchema = z.object({
  n: z.string(), // number in the declared numbering, as a string ("402", "402.2")
  book: z.number().int(),
  textAr: z.string(), // full text with diacritics
  split: z.object({ at: z.number().int(), method: z.enum(["machine", "reviewed"]) }).optional(), // index in textAr where the matn begins
  chain: z
    .object({
      status: z.enum(["machine", "reviewed"]),
      names: z.array(z.object({ ar: z.string(), id: z.string().optional() })), // compiler's teacher first, Companion last
      sighas: z.array(z.string()),
    })
    .optional(),
  fingerprint: z.string(), // sha256 prefix of the normalised matn (or whole text when no split)
  sources: z.object({ ohd: z.number().optional(), ref: z.union([z.number(), z.string()]).optional() }),
  study: z.string().optional(), // slug of a worked study of this narration, if any
});

export const CollectionBookSchema = z.object({
  book: z.number().int(),
  nameAr: z.string().optional(),
  nameEn: z.string(),
  narrations: z.array(CollectionNarrationSchema),
});

export const CollectionSchema = z.object({
  id: z.string(),
  nameEn: z.string(),
  nameAr: z.string(),
  compiler: z.string(),
  compilerId: z.string().optional(),
  numbering: z.string(),
  total: z.number().int(),
  books: z.array(z.object({ book: z.number().int(), nameAr: z.string().optional(), nameEn: z.string(), first: z.string(), last: z.string(), count: z.number().int() })),
  sources: z.array(z.object({ label: z.string(), url: z.string(), licence: z.string(), role: z.string() })),
  notes: z.array(z.string()).optional(),
});
