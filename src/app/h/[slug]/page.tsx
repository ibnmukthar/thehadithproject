import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HADITH, getHadith, narratorsFor, fingerprintOf } from "@/data";
import { HadithView } from "@/components/HadithView";
import { ReferenceCard } from "@/components/ReferenceCard";

export function generateStaticParams() {
  return HADITH.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const h = getHadith(slug);
  if (!h) return {};
  return {
    title: `${h.title} (${h.primary.collection} ${h.primary.number})`,
    description: `${h.primary.matnEn} — ${h.status.label}. ${h.status.line}`,
    openGraph: { title: `${h.title} · ${h.primary.collection} ${h.primary.number}`, description: h.primary.matnEn },
  };
}

export default async function HadithPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const h = getHadith(slug);
  if (!h) notFound();
  const narrators = narratorsFor(h);
  const fp = fingerprintOf(h);
  return (
    <div className="container pt-10 pb-16">
      <HadithView hadith={h} narrators={narrators} fingerprint={fp} initialMode="student" />
      {h.context && (
        <section className="rule pt-8 mt-10">
          <h3 className="mb-2">Context</h3>
          <p className="text-ink-2">{h.context}</p>
        </section>
      )}
      <section className="rule pt-8 mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div>
          <h3 className="mb-2">Share this record</h3>
          <p className="small text-ink-2">The link unfurls into this card wherever it is pasted.</p>
          {h.sources.length > 0 && (
            <div className="mt-6 tiny text-muted">
              Sources for this page: {h.sources.map((s, i) => (
                <span key={s.url}>{i > 0 ? " · " : ""}<a className="link" href={s.url} rel="noopener">{s.label}</a></span>
              ))}
            </div>
          )}
        </div>
        <ReferenceCard hadith={h} narrators={narrators} url={`https://thehadithproject.com/h/${h.slug}/`} />
      </section>
    </div>
  );
}
