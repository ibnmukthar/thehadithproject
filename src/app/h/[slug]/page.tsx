import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HADITH, getHadith, narratorsFor, fingerprintOf } from "@/data";
import { HadithView } from "@/components/HadithView";
import { ReferenceCard } from "@/components/ReferenceCard";
import { computeSubtleties } from "@/lib/subtleties";

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
  const subtleties = computeSubtleties(h, narrators);
  const track = HADITH.filter((x) => x.study);
  const idx = track.findIndex((x) => x.slug === h.slug);
  const prev = idx > 0 ? track[idx - 1] : null;
  const next = idx >= 0 && idx < track.length - 1 ? track[idx + 1] : null;
  return (
    <div className="container pt-10 pb-16">
      <HadithView hadith={h} narrators={narrators} fingerprint={fp} subtleties={subtleties} initialMode="reader" />
      {h.study && (
        <nav aria-label="Studied hadith" className="rule pt-6 mt-10 flex flex-wrap items-baseline justify-between gap-3 small">
          <span className="text-muted">
            Study {idx + 1} of {track.length}{h.study.credit ? ` · ${h.study.credit}` : ""} · <Link className="link" href="/studies/">All studies</Link>
          </span>
          <span className="flex gap-4">
            {prev && <Link className="link" href={`/h/${prev.slug}/`}>← {prev.title}</Link>}
            {next && <Link className="link" href={`/h/${next.slug}/`}>{next.title} →</Link>}
          </span>
        </nav>
      )}
      <section className="rule pt-8 mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div>
          <h3 className="mb-2">Share this record</h3>
          <p className="small text-ink-2">The link unfurls into this card wherever it is pasted.</p>
          {h.sources.length > 0 && (
            <div className="mt-6 tiny text-muted">
              Sources for this page: {h.sources.map((s, i) => (
                <span key={s.url ?? s.label}>{i > 0 ? " · " : ""}{s.url ? <a className="link" href={s.url} rel="noopener">{s.label}</a> : s.label}</span>
              ))}
            </div>
          )}
        </div>
        <ReferenceCard hadith={h} narrators={narrators} url={`https://thehadithproject.com/h/${h.slug}/`} />
      </section>
    </div>
  );
}
