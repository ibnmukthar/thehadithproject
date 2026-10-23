import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HADITH, NARRATORS, getNarrator } from "@/data";
import { NarratorCard } from "@/components/NarratorCard";

export function generateStaticParams() {
  return Object.keys(NARRATORS).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const n = getNarrator(id);
  if (!n) return {};
  return { title: n.died ? `${n.name} (d. ${n.died} AH)` : n.name, description: n.bio };
}

export default async function NarratorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const n = getNarrator(id);
  if (!n) notFound();
  const appearsIn = HADITH.filter((h) => h.primary.chain.includes(n.id));
  return (
    <div className="container pt-10 pb-16 grid gap-10 lg:grid-cols-[1fr_1fr]">
      <div>
        <div className="small text-muted mb-3"><Link href="/explore/" className="link">Explore</Link> · Narrator record</div>
        <NarratorCard narrator={n} full showArabicQuotes />
      </div>
      <div>
        <h3 className="mb-3">Appears in these chains</h3>
        <ul className="grid gap-2 small">
          {appearsIn.map((h) => (
            <li key={h.slug}>
              <Link className="link" href={`/h/${h.slug}/`}>{h.title}</Link>
              <span className="text-muted"> · {h.primary.collection} {h.primary.number}</span>
            </li>
          ))}
        </ul>
        <p className="small text-ink-2 mt-8">
          In the full dataset this page will list every narration this person carries, their teachers and students as a graph, and every critic's line on them with its source.
        </p>
      </div>
    </div>
  );
}
