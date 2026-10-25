/**
 * Data access. The public record is the set of JSON files under /data, one per
 * narrator, worked hadith, and collection book. They are read and validated at
 * build time; nothing here runs in the browser.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { Collection, CollectionBook, CollectionNarration, Hadith, Narrator } from "./types";
import { CollectionBookSchema, CollectionSchema, HadithSchema, NarratorSchema } from "./schema";
import { fingerprint } from "@/lib/text";

const ROOT = join(process.cwd(), "data");

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, "utf8"));
}

function listJson(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => join(dir, f));
}

function loadNarrators(): Record<string, Narrator> {
  const out: Record<string, Narrator> = {};
  for (const file of listJson(join(ROOT, "narrators"))) {
    const parsed = NarratorSchema.safeParse(readJson(file));
    if (!parsed.success) throw new Error(`Invalid narrator record ${file}:\n${parsed.error.message}`);
    out[parsed.data.id] = parsed.data;
  }
  return out;
}

function loadHadith(): Hadith[] {
  const out: Hadith[] = [];
  for (const file of listJson(join(ROOT, "hadith"))) {
    const parsed = HadithSchema.safeParse(readJson(file));
    if (!parsed.success) throw new Error(`Invalid hadith record ${file}:\n${parsed.error.message}`);
    out.push(parsed.data);
  }
  // Studies first in track order, then the rest alphabetically by title.
  return out.sort((a, b) => {
    const ao = a.study?.order ?? 1e9;
    const bo = b.study?.order ?? 1e9;
    return ao !== bo ? ao - bo : a.title.localeCompare(b.title);
  });
}

export const NARRATORS: Record<string, Narrator> = loadNarrators();
export const HADITH: Hadith[] = loadHadith();

export function getHadith(slug: string): Hadith | undefined {
  return HADITH.find((h) => h.slug === slug);
}

export function getHadithByCite(cite: string): Hadith | undefined {
  return HADITH.find((h) => h.primary.cite === cite);
}

export function getNarrator(id: string): Narrator | undefined {
  return NARRATORS[id];
}

export function narratorsFor(h: Hadith): Record<string, Narrator> {
  const out: Record<string, Narrator> = {};
  for (const id of h.primary.chain) if (NARRATORS[id]) out[id] = NARRATORS[id];
  return out;
}

export function fingerprintOf(h: Hadith): string {
  return fingerprint(h.primary.matnAr);
}

/** Every worked hadith a narrator appears in. */
export function hadithFor(narratorId: string): Hadith[] {
  return HADITH.filter((h) => h.primary.chain.includes(narratorId));
}

// ---------------------------------------------------------------- collections

const collectionCache = new Map<string, Collection | null>();
const bookCache = new Map<string, CollectionBook | null>();

export function listCollections(): Collection[] {
  const dir = join(ROOT, "collections");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((d) => existsSync(join(dir, d, "collection.json")))
    .map((d) => getCollection(d)!)
    .filter(Boolean);
}

export function getCollection(id: string): Collection | undefined {
  if (collectionCache.has(id)) return collectionCache.get(id) ?? undefined;
  const file = join(ROOT, "collections", id, "collection.json");
  if (!existsSync(file)) {
    collectionCache.set(id, null);
    return undefined;
  }
  const parsed = CollectionSchema.safeParse(readJson(file));
  if (!parsed.success) throw new Error(`Invalid collection ${file}:\n${parsed.error.message}`);
  collectionCache.set(id, parsed.data);
  return parsed.data;
}

export function getBook(collectionId: string, book: number): CollectionBook | undefined {
  const key = `${collectionId}/${book}`;
  if (bookCache.has(key)) return bookCache.get(key) ?? undefined;
  const file = join(ROOT, "collections", collectionId, "books", `${String(book).padStart(3, "0")}.json`);
  if (!existsSync(file)) {
    bookCache.set(key, null);
    return undefined;
  }
  const parsed = CollectionBookSchema.safeParse(readJson(file));
  if (!parsed.success) throw new Error(`Invalid book ${file}:\n${parsed.error.message}`);
  bookCache.set(key, parsed.data);
  return parsed.data;
}

export function getNarration(collectionId: string, n: string): { narration: CollectionNarration; book: CollectionBook } | undefined {
  const c = getCollection(collectionId);
  if (!c) return undefined;
  const num = parseFloat(n);
  const b = c.books.find((bk) => num >= parseFloat(bk.first) && num <= parseFloat(bk.last)) ?? c.books.find((bk) => getBook(collectionId, bk.book)?.narrations.some((x) => x.n === n));
  if (!b) return undefined;
  const book = getBook(collectionId, b.book);
  const narration = book?.narrations.find((x) => x.n === n);
  return narration && book ? { narration, book } : undefined;
}

export function* allNarrations(collectionId: string): Generator<{ narration: CollectionNarration; book: CollectionBook }> {
  const c = getCollection(collectionId);
  if (!c) return;
  for (const bk of c.books) {
    const book = getBook(collectionId, bk.book);
    if (!book) continue;
    for (const narration of book.narrations) yield { narration, book };
  }
}
