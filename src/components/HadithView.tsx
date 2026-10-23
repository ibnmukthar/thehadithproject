"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Hadith, Narrator } from "@/data/types";
import { IsnadGraph } from "./IsnadGraph";
import { ChainStrip } from "./ChainStrip";
import { LifespanTimeline } from "./LifespanTimeline";
import { NarratorCard } from "./NarratorCard";
import { VerdictTable } from "./VerdictTable";
import { ModeToggle, type Mode } from "./ModeToggle";
import { HadithChip, BandLegend } from "./GradeMark";
import { HADITH_BANDS } from "@/lib/bands";
import { RouteComparison } from "./RouteComparison";

interface Props {
  hadith: Hadith;
  narrators: Record<string, Narrator>;
  fingerprint: string;
  initialMode?: Mode;
  embedded?: boolean; // used on the landing page
}

export function HadithView({ hadith, narrators, fingerprint, initialMode = "student", embedded = false }: Props) {
  const [mode, setModeState] = useState<Mode>(initialMode);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("thp-mode") as Mode | null;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved === "layman" || saved === "student" || saved === "researcher") setModeState(saved);
    } catch {}
  }, []);
  const setMode = (m: Mode) => {
    setModeState(m);
    try { window.localStorage.setItem("thp-mode", m); } catch {}
  };

  const p = hadith.primary;
  const status = HADITH_BANDS[hadith.status.band];
  const chainNarrators = p.chain.map((id) => narrators[id]).filter(Boolean);
  const selectedNarrator = selected ? narrators[selected] : null;
  const showChain = mode !== "layman";
  const researcher = mode === "researcher";
  const narratorList = (
    <ul className="grid gap-1.5 small">
      {chainNarrators.map((n) => (
        <li key={n.id}>
          <button type="button" onClick={() => setSelected(n.id)} aria-pressed={selected === n.id} className={`link text-left inline-flex items-center min-h-6 ${selected === n.id ? "font-semibold" : ""}`}>{n.short}</button>
          <span className="text-muted"> · {n.taqrib?.en ?? (n.band === "sahabi" ? "Companion" : "")}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="grid gap-8">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          {!embedded && <div className="small text-muted mb-1">{p.collection} · {p.number}</div>}
          {embedded ? (
            <h2 className="text-[1.6rem] sm:text-[2rem] leading-tight">{hadith.title}</h2>
          ) : (
            <h1 className="text-[1.6rem] sm:text-[2.2rem] leading-tight">{hadith.title}</h1>
          )}
        </div>
        <ModeToggle mode={mode} onChange={setMode} />
      </div>

      {/* text */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p lang="ar" dir="rtl" className="arabic text-[1.6rem] sm:text-[2rem] leading-[1.9] text-ink" style={{ maxWidth: "none" }}>{p.matnAr}</p>
          {researcher && (
            <p lang="ar" dir="rtl" className="arabic text-[1.15rem] text-ink-2 mt-3 leading-[1.9]" style={{ maxWidth: "none" }}>{p.isnadAr}</p>
          )}
        </div>
        <div className="grid gap-4 content-start">
          <p className="text-[1.1rem] leading-relaxed" style={{ maxWidth: "none" }}>{p.matnEn}</p>
          <div className="flex flex-wrap items-center gap-3">
            <HadithChip band={hadith.status.band} label={hadith.status.label} size="lg" />
            <span className="small text-ink-2">{hadith.status.line}</span>
          </div>
          {mode === "layman" && (
            <div className="rounded-md bg-plane p-4">
              <div className="tiny text-muted mb-1">In plain terms</div>
              <p className="text-ink-2" style={{ maxWidth: "none" }}>{hadith.takeaway}</p>
            </div>
          )}
          <div className="small text-ink-2">
            <span className="text-muted">Source: </span>
            {p.url ? <a className="link" href={p.url} rel="noopener">{p.collection}, {p.number}</a> : `${p.collection}, ${p.number}`}
            {p.bookChapter ? <span className="text-muted"> · {p.bookChapter}</span> : null}
          </div>
          {mode === "layman" && (
            <div>
              <div className="tiny text-muted mb-1.5">Who passed it down</div>
              <ChainStrip narration={p} narrators={narrators} />
              <p className="tiny text-muted mt-2">{status.meaning}</p>
            </div>
          )}
        </div>
      </div>

      {/* chain */}
      {showChain && (
        <section className="rule pt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
            <SectionHeading embedded={embedded}>The chain, person by person</SectionHeading>
            <BandLegend bands={["thiqa", "saduq", "daif", "matruk", "unknown", "sahabi"]} />
          </div>
          <p className="small text-ink-2 mb-6">
            Read upward from the book to the Prophet ﷺ. Click a narrator to see the record critics kept on them.
            {researcher ? " The word on each link is the formula the narrator used; “narrated to us” and “I heard” assert direct hearing, while ʿan (“from”) leaves it open." : ""}
          </p>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,460px)_1fr]">
            <IsnadGraph
              narration={p}
              narrators={narrators}
              fanOut={researcher ? hadith.fanOut : undefined}
              selectedId={selected}
              onSelect={setSelected}
              showSigha={researcher}
              step={researcher ? 86 : 70}
              width={researcher && hadith.fanOut ? 520 : 460}
              tableView
            />
            <div>
              {selectedNarrator ? (
                <div className="grid gap-4">
                  <NarratorCard narrator={selectedNarrator} showArabicQuotes={researcher} />
                  <div className="rounded-[var(--radius-lg)] border border-dashed border-hairline-strong p-4">
                    <div className="tiny text-muted mb-2">Others in this chain</div>
                    {narratorList}
                  </div>
                </div>
              ) : (
                <div className="rounded-[var(--radius-lg)] border border-dashed border-hairline-strong p-5 text-ink-2">
                  <p className="small">Select a narrator to open their record: dates, teachers, and what the critics wrote, with the source for each line.</p>
                  <div className="mt-4">{narratorList}</div>
                </div>
              )}
            </div>
          </div>
          {hadith.fanOut && researcher && (
            <p className="small text-ink-2 mt-4" style={{ maxWidth: "none" }}>
              <span className="font-semibold text-ink">Where the chain widens.</span> {hadith.fanOut.detail} <span className="text-muted">({hadith.fanOut.source})</span>
            </p>
          )}
        </section>
      )}

      {/* competing routes */}
      {showChain && hadith.comparison && <RouteComparison comparison={hadith.comparison} headingLevel={embedded ? 3 : 2} />}

      {/* lifespans */}
      {researcher && (
        <section className="rule pt-8">
          <SectionHeading embedded={embedded} className="mb-1">Did these people overlap?</SectionHeading>
          <p className="small text-ink-2 mb-5">
            Continuity is a condition, not an assumption. Each dotted drop marks a teacher's death year falling inside the student's lifetime; where a birth year is recorded the student's age at that moment is shown. Scholars also checked whether the two actually met, a stricter test (al-Bukhari required proof of meeting; Muslim accepted proven contemporaneity with the possibility of meeting).
          </p>
          <LifespanTimeline narration={p} narrators={narrators} />
        </section>
      )}

      {/* verdicts */}
      {showChain && (
        <section className="rule pt-8">
          <SectionHeading embedded={embedded} className="mb-1">Who graded it, and why</SectionHeading>
          <p className="small text-ink-2 mb-5">We do not grade hadith. Each line is a named scholar's verdict, where they gave it, and the reason they gave. Disagreement is shown, not resolved.</p>
          <VerdictTable verdicts={hadith.verdicts} showArabic={researcher} />
        </section>
      )}

      {/* lessons */}
      {showChain && hadith.lessons.length > 0 && (
        <section className="rule pt-8">
          <SectionHeading embedded={embedded} className="mb-4">What this chain teaches about the method</SectionHeading>
          <div className="grid gap-5 md:grid-cols-2">
            {hadith.lessons.map((l) => (
              <div key={l.title}>
                <div className="font-semibold sans text-[0.95rem] text-ink mb-1">{l.title}</div>
                <p className="small text-ink-2">{l.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* other narrations */}
      {researcher && hadith.also.length > 0 && (
        <section className="rule pt-8">
          <SectionHeading embedded={embedded} className="mb-1">The same report elsewhere</SectionHeading>
          <p className="small text-ink-2 mb-4">Parallel narrations (takhrij). Corroboration across independent chains is how weak links are shored up, and how anomalies are caught.</p>
          <ul className="grid gap-2 sm:grid-cols-2 small">
            {hadith.also.map((a) => (
              <li key={a.cite} className="flex gap-2">
                <span className="mono text-muted break-all shrink-0 max-w-[45%]">{a.cite}</span>
                <span>
                  {a.url ? <a className="link" href={a.url} rel="noopener">{a.label}</a> : a.label}
                  {a.note ? <span className="text-muted"> · {a.note}</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* vocabulary */}
      {mode === "student" && hadith.vocabulary && hadith.vocabulary.length > 0 && (
        <section className="rule pt-8">
          <SectionHeading embedded={embedded} className="mb-4">Terms used here</SectionHeading>
          <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2 small">
            {hadith.vocabulary.map((v) => (
              <div key={v.term}>
                <dt className="font-semibold text-ink">{v.term} <span lang="ar" className="arabic text-[1.1rem] text-ink-2">{v.ar}</span></dt>
                <dd className="text-ink-2">{v.meaning}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* identifiers */}
      {researcher && (
        <section className="rule pt-8">
          <SectionHeading embedded={embedded} className="mb-1">Reference and fingerprint</SectionHeading>
          <p className="small text-ink-2 mb-4">The cite names a collection and a declared canonical numbering. The fingerprint is a checksum of the Arabic text with vowel marks and orthographic variants normalised, so a quoted text can be checked against the record regardless of edition.</p>
          <dl className="sans text-[0.9rem] grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-1.5">
            <dt className="text-muted">Canonical cite</dt><dd className="mono break-all">thp:{p.cite}</dd>
            <dt className="text-muted">Numbering</dt><dd>{p.numbering}</dd>
            <dt className="text-muted">Text fingerprint</dt><dd className="mono break-all">sha256:{fingerprint}</dd>
            <dt className="text-muted">Machine-readable</dt><dd className="break-all"><Link className="link" href={`/api/v0/hadith/${hadith.slug}.json`}>/api/v0/hadith/{hadith.slug}.json</Link></dd>
          </dl>
        </section>
      )}

      {embedded && (
        <div className="small">
          <Link className="link" href={`/h/${hadith.slug}/`}>Open the full page for this hadith</Link>
        </div>
      )}
    </div>
  );
}

function SectionHeading({ embedded, children, className = "" }: { embedded: boolean; children: React.ReactNode; className?: string }) {
  return embedded ? <h3 className={className}>{children}</h3> : <h2 className={`text-[1.4rem] ${className}`}>{children}</h2>;
}
