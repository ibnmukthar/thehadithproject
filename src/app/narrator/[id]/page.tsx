import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NARRATORS, getNarrator, hadithFor } from "@/data";
import { NarratorCard } from "@/components/NarratorCard";
import { NarratorNetwork } from "@/components/NarratorNetwork";

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
  const appearsIn = hadithFor(n.id);
  const hasNetwork = (n.teachers?.length ?? 0) + (n.students?.length ?? 0) > 0;
  return (
    <div className="container pt-10 pb-16">
      <div className="small text-muted mb-3"><Link href="/narrators/" className="link">Narrators</Link> · record</div>
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div>
          <NarratorCard narrator={n} full showArabicQuotes />
        </div>
        <div className="grid gap-8 content-start">
          {hasNetwork && (
            <section>
              <h3 className="mb-1">Teachers and students</h3>
              <p className="small text-ink-2 mb-3" style={{ maxWidth: "none" }}>Who he narrated from (above) and who narrated from him (below), as the classical entry lists them. Click a name with a record to walk the network.</p>
              <NarratorNetwork narrator={n} narrators={NARRATORS} />
            </section>
          )}
          <section>
            <h3 className="mb-3">Appears in these studied chains</h3>
            {appearsIn.length === 0 ? (
              <p className="small text-ink-2">Not yet part of a studied chain.</p>
            ) : (
              <ul className="grid gap-2 small">
                {appearsIn.map((h) => (
                  <li key={h.slug}>
                    <Link className="link" href={`/h/${h.slug}/`}>{h.title}</Link>
                    <span className="text-muted"> · {h.primary.collection} {h.primary.number}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
          {n.provenance && n.provenance.length > 0 && (
            <section>
              <h3 className="mb-2">Where each line comes from</h3>
              <ul className="grid gap-1 tiny text-muted">
                {n.provenance.map((p, i) => (
                  <li key={i}><span className="text-ink-2">{p.field}</span>: {p.layer} · {p.ref}</li>
                ))}
              </ul>
            </section>
          )}
          {n.review && (
            <p className="tiny text-muted">
              Review status: {n.review.status}
              {n.review.signoffs.length > 0 && <> · {n.review.signoffs.map((s) => `${s.decision} by ${s.who} (${s.role}, ${s.date})`).join("; ")}</>}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
