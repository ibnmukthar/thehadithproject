import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listCollections, getCollection, getNarration, allNarrations, getNarrator, getHadith } from "@/data";
import { ReportLink } from "@/components/ReportLink";
import { Glyph } from "@/components/GradeMark";
import { BANDS } from "@/lib/bands";

export function generateStaticParams() {
  const out: { id: string; n: string }[] = [];
  for (const c of listCollections()) for (const { narration } of allNarrations(c.id)) out.push({ id: c.id, n: narration.n });
  return out.length ? out : [{ id: "none", n: "0" }];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string; n: string }> }): Promise<Metadata> {
  const { id, n } = await params;
  const c = getCollection(id);
  const hit = getNarration(id, n);
  if (!c || !hit) return {};
  const matn = hit.narration.split ? hit.narration.textAr.slice(hit.narration.split.at) : hit.narration.textAr;
  return { title: `${c.nameEn} ${n}`, description: matn.slice(0, 160) };
}

// Narrations sharing a fingerprint within a collection (repeats of the same wording).
const sameTextCache = new Map<string, Map<string, string[]>>();
function sameText(collectionId: string): Map<string, string[]> {
  let m = sameTextCache.get(collectionId);
  if (m) return m;
  m = new Map();
  for (const { narration } of allNarrations(collectionId)) {
    const arr = m.get(narration.fingerprint) ?? [];
    arr.push(narration.n);
    m.set(narration.fingerprint, arr);
  }
  sameTextCache.set(collectionId, m);
  return m;
}

export default async function NarrationPage({ params }: { params: Promise<{ id: string; n: string }> }) {
  const { id, n } = await params;
  const c = getCollection(id);
  const hit = getNarration(id, n);
  if (!c || !hit) notFound();
  const { narration, book } = hit;
  const isnad = narration.split ? narration.textAr.slice(0, narration.split.at) : null;
  const matn = narration.split ? narration.textAr.slice(narration.split.at) : narration.textAr;
  const idx = book.narrations.findIndex((x) => x.n === narration.n);
  const prev = idx > 0 ? book.narrations[idx - 1] : null;
  const next = idx < book.narrations.length - 1 ? book.narrations[idx + 1] : null;
  const repeats = (sameText(c.id).get(narration.fingerprint) ?? []).filter((x) => x !== narration.n);
  const study = narration.study ? getHadith(narration.study) : undefined;
  const record = `thp:${c.id}:${narration.n}`;

  return (
    <div className="container pt-10 pb-16">
      <div className="small text-muted mb-3">
        <Link href={`/collection/${c.id}/`} className="link">{c.nameEn}</Link> · <Link href={`/collection/${c.id}/${book.book}/`} className="link">{book.nameEn}</Link>
      </div>
      <h1 className="text-[1.9rem] sm:text-[2.4rem]">{c.nameEn} {narration.n}</h1>

      {study && (
        <p className="mt-3 small">
          <Link className="link" href={`/h/${study.slug}/`}>This narration is studied in full: {study.title}</Link>
        </p>
      )}

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          {isnad && <p lang="ar" dir="rtl" className="arabic text-[1.2rem] text-ink-2 leading-[1.9]" style={{ maxWidth: "none" }}>{isnad}</p>}
          <p lang="ar" dir="rtl" className="arabic text-[1.6rem] sm:text-[1.8rem] text-ink leading-[1.9] mt-2" style={{ maxWidth: "none" }}>{matn}</p>
          <div className="small text-muted mt-3 flex flex-wrap gap-x-4 gap-y-1">
            {narration.split && <span>Isnad and text separated by machine{narration.split.method === "reviewed" ? ", checked by a reviewer" : ", not yet checked"}.</span>}
            <ReportLink record={record} line={matn.slice(0, 200)} />
          </div>
        </div>

        <div className="grid gap-6 content-start">
          {narration.chain && (
            <section className="rounded-[var(--radius-lg)] border border-hairline p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                <h2 className="text-[1.1rem]">The chain</h2>
                <span className="tiny text-muted">{narration.chain.status === "machine" ? "Parsed by machine · not yet reviewed" : "Reviewed"}</span>
              </div>
              <ol className="grid gap-1.5">
                {narration.chain.names.map((p, i) => {
                  const rec = p.id ? getNarrator(p.id) : undefined;
                  const b = rec ? BANDS[rec.band] : null;
                  return (
                    <li key={i} className="grid grid-cols-[auto_1fr] gap-2 items-start small">
                      <span className="pt-[3px]">{b ? <Glyph glyph={b.glyph} color={b.color} size={12} title={b.label} /> : <Glyph glyph="dotted" color="var(--g-unknown)" size={12} title="No record yet" />}</span>
                      <span>
                        <span lang="ar" dir="rtl" className="arabic text-[1.15rem] text-ink">{p.ar}</span>
                        {rec && <> · <Link className="link" href={`/narrator/${rec.id}/`}>{rec.short}</Link></>}
                        {narration.chain!.sighas[i] && <span lang="ar" className="arabic text-[1rem] text-muted"> · {narration.chain!.sighas[i]}</span>}
                      </span>
                    </li>
                  );
                })}
              </ol>
              <p className="tiny text-muted mt-3">
                Compiler's teacher first, Companion last. A dotted mark means the name has no record on this site yet; a parse is a proposal until a person confirms it. <ReportLink record={`${record} · chain`} line={narration.chain.names.map((p) => p.ar).join(" ← ")}>Correct this chain</ReportLink>
              </p>
            </section>
          )}

          <dl className="sans text-[0.88rem] grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-1.5">
            <dt className="text-muted">Cite</dt><dd className="mono break-all">{record}</dd>
            <dt className="text-muted">Fingerprint</dt><dd className="mono break-all">sha256:{narration.fingerprint}</dd>
            <dt className="text-muted">Numbering</dt><dd>{c.numbering}</dd>
            {narration.sources.ohd !== undefined && (<><dt className="text-muted">Text</dt><dd>Open Hadith Data row {narration.sources.ohd} (ODbL)</dd></>)}
            <dt className="text-muted">Data</dt><dd><Link className="link" href={`/api/v0/collection/${c.id}/${String(book.book).padStart(3, "0")}.json`}>book {book.book} as JSON</Link></dd>
          </dl>

          {repeats.length > 0 && (
            <p className="small text-ink-2">
              Same wording elsewhere in {c.nameEn}: {repeats.map((r, i) => <span key={r}>{i > 0 ? ", " : ""}<Link className="link" href={`/n/${c.id}/${r}/`}>{r}</Link></span>)}.
            </p>
          )}
        </div>
      </div>

      <nav aria-label="Narrations" className="mt-10 flex flex-wrap justify-between gap-4 small rule pt-5">
        <span>{prev && <Link className="link" href={`/n/${c.id}/${prev.n}/`}>← {c.nameEn} {prev.n}</Link>}</span>
        <span>{next && <Link className="link" href={`/n/${c.id}/${next.n}/`}>{c.nameEn} {next.n} →</Link>}</span>
      </nav>
    </div>
  );
}
