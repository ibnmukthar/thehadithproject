import type { Metadata } from "next";
import Link from "next/link";
import { HADITH, NARRATORS, listCollections } from "@/data";
import { HadithChip } from "@/components/GradeMark";

export const metadata: Metadata = {
  title: "Explore",
  description: "The collections, the studied hadith, the narrators, and a way to check any quoted text against the record.",
};

export default function ExplorePage() {
  const collections = listCollections();
  const studies = HADITH.filter((h) => h.study);
  const narrators = Object.values(NARRATORS).filter((n) => n.band !== "prophet");
  return (
    <div className="container pt-10 pb-16">
      <div className="max-w-[60ch] mb-10">
        <h1 className="text-[2.2rem] sm:text-[2.8rem]">Explore</h1>
        <p className="mt-4 text-ink-2">Everything on the site is one of three things: a narration in a collection, a narrator's record, or a scholar's verdict. Start from any of them.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Link href="/studies/" className="door">
          <div className="tiny text-muted">Studied hadith</div>
          <h2 className="text-[1.5rem] leading-tight mt-1">{studies.length} hadith, examined link by link</h2>
          <p className="small text-ink-2 mt-2" style={{ maxWidth: "none" }}>Where each is recorded, who carried it, what the chain shows, what it means. Start here if you want to see the method at work.</p>
          <div className="mt-4 flex flex-wrap gap-2">{studies.slice(0, 4).map((s) => <HadithChip key={s.slug} band={s.status.band} label={s.status.label} size="sm" />)}</div>
        </Link>

        {collections.length > 0 ? (
          collections.map((c) => (
            <Link key={c.id} href={`/collection/${c.id}/`} className="door">
              <div className="tiny text-muted">Collection</div>
              <h2 className="text-[1.5rem] leading-tight mt-1">{c.nameEn} <span lang="ar" className="arabic text-[1.4rem] text-ink-2">{c.nameAr}</span></h2>
              <p className="small text-ink-2 mt-2" style={{ maxWidth: "none" }}>{c.total.toLocaleString()} narrations in {c.books.length} books, with the {c.numbering.split(",")[0]}. Every narration has a stable cite, a text fingerprint and a machine-parsed chain awaiting review.</p>
            </Link>
          ))
        ) : (
          <div className="door opacity-80">
            <div className="tiny text-muted">Collections</div>
            <h2 className="text-[1.5rem] leading-tight mt-1">Sahih al-Bukhari, in preparation</h2>
            <p className="small text-ink-2 mt-2" style={{ maxWidth: "none" }}>Every narration with the standard numbering, a stable cite and a text fingerprint.</p>
          </div>
        )}

        <Link href="/narrators/" className="door">
          <div className="tiny text-muted">Narrators</div>
          <h2 className="text-[1.5rem] leading-tight mt-1">{narrators.length} records</h2>
          <p className="small text-ink-2 mt-2" style={{ maxWidth: "none" }}>Each in the shape of the classical entry: names, dates, teachers and students, the Taqrib line, the sigla of the books that used him, and the critics in their own words.</p>
        </Link>

        <Link href="/verify/" className="door">
          <div className="tiny text-muted">Verify a quote</div>
          <h2 className="text-[1.5rem] leading-tight mt-1">Paste any Arabic text</h2>
          <p className="small text-ink-2 mt-2" style={{ maxWidth: "none" }}>The site normalises it, fingerprints it and tells you whether it matches a narration on record, and which.</p>
        </Link>
      </div>
    </div>
  );
}
