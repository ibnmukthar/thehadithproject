import type { Metadata } from "next";
import { VerifyQuote } from "@/components/VerifyQuote";
import { listCollections, HADITH } from "@/data";

export const metadata: Metadata = {
  title: "Verify a quote",
  description: "Paste any Arabic hadith text and check it against the record: the site normalises it, fingerprints it and tells you which narration it matches.",
};

export default function VerifyPage() {
  const collections = listCollections();
  const scope = [
    ...collections.map((c) => `${c.nameEn} (${c.total.toLocaleString()} narrations)`),
    `${HADITH.length} studied hadith from other collections`,
  ].join(", ");
  return (
    <div className="container pt-10 pb-16">
      <div className="max-w-[60ch] mb-8">
        <h1 className="text-[2.2rem] sm:text-[2.8rem]">Verify a quote</h1>
        <p className="mt-4 text-ink-2">
          Paste the Arabic text of a hadith as you found it: with or without vowel marks, from any edition. The site strips the marks, unifies the spelling variants, and compares the result against every narration on record. Currently on record: {scope}.
        </p>
      </div>
      <VerifyQuote />
    </div>
  );
}
