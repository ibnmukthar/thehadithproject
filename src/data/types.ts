/**
 * TypeScript types for the data layer, derived from the zod schemas in
 * ./schema.ts so that the validator and the types cannot drift apart.
 */
import type { z } from "zod";
import type {
  BandSchema,
  HadithBandSchema,
  LinkKindSchema,
  SiglumSchema,
  CriticVerdictSchema,
  NarratorSchema,
  TransmissionSchema,
  NarrationSchema,
  ScholarVerdictSchema,
  RouteNodeSchema,
  RouteComparisonSchema,
  ParallelSchema,
  SubtletySchema,
  ExplanationSchema,
  HadithSchema,
  CollectionNarrationSchema,
  CollectionBookSchema,
  CollectionSchema,
  ReviewSchema,
} from "./schema";

/** Reliability band shown as colour + glyph + label (never colour alone). */
export type Band = z.infer<typeof BandSchema>;
export type HadithBand = z.infer<typeof HadithBandSchema>;
export type LinkKind = z.infer<typeof LinkKindSchema>;
export type Siglum = z.infer<typeof SiglumSchema>;
export type CriticVerdict = z.infer<typeof CriticVerdictSchema>;
export type Narrator = z.infer<typeof NarratorSchema>;
export type Transmission = z.infer<typeof TransmissionSchema>;
export type Narration = z.infer<typeof NarrationSchema>;
export type ScholarVerdict = z.infer<typeof ScholarVerdictSchema>;
export type RouteNode = z.infer<typeof RouteNodeSchema>;
export type RouteComparison = z.infer<typeof RouteComparisonSchema>;
export type Parallel = z.infer<typeof ParallelSchema>;
export type Subtlety = z.infer<typeof SubtletySchema>;
export type Explanation = z.infer<typeof ExplanationSchema>;
export type Hadith = z.infer<typeof HadithSchema>;
export type CollectionNarration = z.infer<typeof CollectionNarrationSchema>;
export type CollectionBook = z.infer<typeof CollectionBookSchema>;
export type Collection = z.infer<typeof CollectionSchema>;
export type Review = z.infer<typeof ReviewSchema>;
