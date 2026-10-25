import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listCollections, getCollection, getNarrator } from "@/data";

export function generateStaticParams() {
  const ids = listCollections().map((c) => ({ id: c.id }));
  // A static export needs at least one path; with no collection ingested the placeholder renders the 404 page.
  return ids.length ? ids : [{ id: "none" }];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const c = getCollection(id);
  if (!c) return {};
  return { title: c.nameEn, description: `${c.total.toLocaleString()} narrations in ${c.books.length} books, with the ${c.numbering}.` };
}

export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = getCollection(id);
  if (!c) notFound();
  const compiler = c.compilerId ? getNarrator(c.compilerId) : undefined;
  return (
    <div className="container pt-10 pb-16">
      <div className="small text-muted mb-3"><Link href="/explore/" className="link">Explore</Link> · collection</div>
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <div>
          <h1 className="text-[2.2rem] sm:text-[2.8rem]">{c.nameEn}</h1>
          <p lang="ar" dir="rtl" className="arabic text-[2rem] text-ink-2 mt-1 text-left" style={{ direction: "rtl", textAlign: "left" }}>{c.nameAr}</p>
          <p className="mt-4 text-ink-2" style={{ maxWidth: "60ch" }}>
            Compiled by {compiler ? <Link className="link" href={`/narrator/${compiler.id}/`}>{c.compiler}</Link> : c.compiler}. {c.total.toLocaleString()} narrations in {c.books.length} books, numbered by the {c.numbering}. Every narration has a stable cite, a fingerprint of its text, and a chain parsed by machine and labelled as such until a person has checked it.
          </p>
        </div>
        <dl className="sans text-[0.88rem] grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-1.5 content-end">
          <dt className="text-muted">Cite form</dt><dd className="mono">thp:{c.id}:&lt;number&gt;</dd>
          <dt className="text-muted">Data</dt><dd><Link className="link" href={`/api/v0/collection/${c.id}.json`}>/api/v0/collection/{c.id}.json</Link></dd>
          <dt className="text-muted">Text sources</dt>
          <dd>
            <ul className="grid gap-1">
              {c.sources.map((s) => (
                <li key={s.url}>
                  <a className="link" href={s.url} rel="noopener">{s.label}</a> <span className="text-muted">· {s.licence}</span>
                </li>
              ))}
            </ul>
          </dd>
        </dl>
      </div>

      {(c.notes?.length || c.sources.length) ? (
        <details className="small mt-6">
          <summary className="cursor-pointer text-ink-2">How this text was prepared</summary>
          <ul className="mt-2 grid gap-2 text-ink-2 list-disc pl-5" style={{ maxWidth: "70ch" }}>
            {c.sources.map((s) => (
              <li key={`role-${s.url}`}><span className="text-ink">{s.label}:</span> {s.role}</li>
            ))}
            {c.notes?.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        </details>
      ) : null}

      <h2 className="text-[1.5rem] mt-10 mb-4">Books</h2>
      <div className="overflow-x-auto">
        <table className="data">
          <thead><tr><th className="w-12">#</th><th>Book</th><th className="hidden sm:table-cell">Arabic</th><th>Narrations</th></tr></thead>
          <tbody>
            {c.books.map((b) => (
              <tr key={b.book}>
                <td className="tabular-nums text-muted">{b.book}</td>
                <td><Link className="link" href={`/collection/${c.id}/${b.book}/`}>{b.nameEn}</Link></td>
                <td lang="ar" dir="rtl" className="arabic text-[1.1rem] text-ink-2 hidden sm:table-cell" style={{ textAlign: "left" }}>{b.nameAr ?? ""}</td>
                <td className="tabular-nums whitespace-nowrap">{b.count} <span className="text-muted">· {b.first}–{b.last}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
