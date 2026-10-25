import type { Metadata } from "next";
import Link from "next/link";
import { HADITH, narratorsFor } from "@/data";
import { HadithChip } from "@/components/GradeMark";
import { ChainStrip } from "@/components/ChainStrip";

export const metadata: Metadata = {
  title: "Studied hadith",
  description: "Hadith examined link by link, in the four discussions of a hadith class: where it is recorded, who carried it, what the chain shows, what it means.",
};

export default function StudiesPage() {
  const track = HADITH.filter((h) => h.study);
  const rest = HADITH.filter((h) => !h.study);
  return (
    <div className="container pt-10 pb-16">
      <div className="max-w-[60ch] mb-8">
        <h1 className="text-[2.2rem] sm:text-[2.8rem]">Studied hadith</h1>
        <p className="mt-4 text-ink-2">
          Each hadith here is examined the way a hadith class examines it: where it is recorded, who carried it, what the chain shows on sight, and what it means. The point is not the grade; it is that you can see where the grade comes from.
        </p>
      </div>
      {track.length > 0 && (
        <ol className="grid gap-4">
          {track.map((h, i) => <Card key={h.slug} h={h} n={i + 1} />)}
        </ol>
      )}
      {rest.length > 0 && (
        <>
          <h2 className="text-[1.5rem] mt-12 mb-4">Other worked examples</h2>
          <ol className="grid gap-4">
            {rest.map((h) => <Card key={h.slug} h={h} />)}
          </ol>
        </>
      )}
    </div>
  );
}

function Card({ h, n }: { h: (typeof HADITH)[number]; n?: number }) {
  const narrators = narratorsFor(h);
  return (
    <li className="door grid gap-3 md:grid-cols-[1fr_auto] md:items-start">
      <div>
        <div className="flex flex-wrap items-center gap-2 tiny text-muted">
          {n !== undefined && <span>{h.study && h.study.order > 0 ? `Course hadith ${h.study.order}` : "Worked example"}</span>}
          <span>{h.primary.collection} {h.primary.number}</span>
          <HadithChip band={h.status.band} label={h.status.label} size="sm" />
        </div>
        <h3 className="text-[1.3rem] leading-tight mt-1"><Link href={`/h/${h.slug}/`} className="hover:underline underline-offset-4">{h.title}</Link></h3>
        <p lang="ar" dir="rtl" className="arabic text-[1.25rem] text-ink-2 mt-1 text-left line-clamp-2" style={{ direction: "rtl", textAlign: "left", maxWidth: "none" }}>{h.primary.matnAr}</p>
        <p className="small text-ink-2 mt-2" style={{ maxWidth: "70ch" }}>{h.status.line}</p>
      </div>
      <div className="md:min-w-[16rem]">
        <ChainStrip narration={h.primary} narrators={narrators} dense />
      </div>
    </li>
  );
}
