import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listCollections, getCollection, getBook } from "@/data";

export function generateStaticParams() {
  const out: { id: string; book: string }[] = [];
  for (const c of listCollections()) for (const b of c.books) out.push({ id: c.id, book: String(b.book) });
  return out.length ? out : [{ id: "none", book: "0" }];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string; book: string }> }): Promise<Metadata> {
  const { id, book } = await params;
  const c = getCollection(id);
  const b = getBook(id, Number(book));
  if (!c || !b) return {};
  return { title: `${b.nameEn} · ${c.nameEn}`, description: `Book ${b.book} of ${c.nameEn}: ${b.narrations.length} narrations.` };
}

export default async function BookPage({ params }: { params: Promise<{ id: string; book: string }> }) {
  const { id, book } = await params;
  const c = getCollection(id);
  const b = getBook(id, Number(book));
  if (!c || !b) notFound();
  const i = c.books.findIndex((x) => x.book === b.book);
  const prev = i > 0 ? c.books[i - 1] : null;
  const next = i < c.books.length - 1 ? c.books[i + 1] : null;
  return (
    <div className="container pt-10 pb-16">
      <div className="small text-muted mb-3"><Link href="/explore/" className="link">Explore</Link> · <Link href={`/collection/${c.id}/`} className="link">{c.nameEn}</Link> · book {b.book}</div>
      <h1 className="text-[1.9rem] sm:text-[2.4rem]">{b.nameEn}</h1>
      {b.nameAr && <p lang="ar" dir="rtl" className="arabic text-[1.7rem] text-ink-2 mt-1 text-left" style={{ direction: "rtl", textAlign: "left" }}>{b.nameAr}</p>}
      <p className="small text-muted mt-2">{b.narrations.length} narrations · {c.nameEn} {b.narrations[0]?.n}–{b.narrations[b.narrations.length - 1]?.n}</p>

      <ol className="mt-8 grid gap-0 border-t border-hairline">
        {b.narrations.map((n) => {
          const matn = n.split ? n.textAr.slice(n.split.at) : n.textAr;
          return (
            <li key={n.n} className="grid grid-cols-[4.5rem_1fr] sm:grid-cols-[5.5rem_1fr] gap-3 py-3 border-b border-hairline items-start">
              <Link href={`/n/${c.id}/${n.n}/`} className="link mono text-[0.85rem] pt-1.5">{n.n}</Link>
              <div className="min-w-0">
                <p lang="ar" dir="rtl" className="arabic text-[1.25rem] leading-[1.8] text-ink text-left line-clamp-2" style={{ direction: "rtl", textAlign: "left", maxWidth: "none" }}>{matn}</p>
                <div className="tiny text-muted mt-1 flex flex-wrap gap-x-3">
                  {n.chain && <span>{n.chain.names.length} names in the chain{n.chain.status === "machine" ? ", parsed by machine" : ""}</span>}
                  {n.study && <Link href={`/h/${n.study}/`} className="link">studied</Link>}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <nav aria-label="Books" className="mt-8 flex flex-wrap justify-between gap-4 small">
        <span>{prev && <Link className="link" href={`/collection/${c.id}/${prev.book}/`}>← {prev.nameEn}</Link>}</span>
        <span>{next && <Link className="link" href={`/collection/${c.id}/${next.book}/`}>{next.nameEn} →</Link>}</span>
      </nav>
    </div>
  );
}
