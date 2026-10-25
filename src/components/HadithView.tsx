"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Hadith, Narrator, Subtlety } from "@/data/types";
import { IsnadGraph } from "./IsnadGraph";
import { ChainStrip } from "./ChainStrip";
import { LifespanTimeline } from "./LifespanTimeline";
import { NarratorCard } from "./NarratorCard";
import { VerdictTable } from "./VerdictTable";
import { ModeToggle, normaliseMode, type Mode } from "./ModeToggle";
import { HadithChip, BandLegend } from "./GradeMark";
import { HADITH_BANDS } from "@/lib/bands";
import { RouteComparison } from "./RouteComparison";
import { CorroborationTree } from "./CorroborationTree";
import { Disclosure } from "./Disclosure";
import { SubtletiesStrip } from "./SubtletiesStrip";
import { JourneyMap } from "./JourneyMap";
import { ReportLink } from "./ReportLink";

interface Props {
  hadith: Hadith;
  narrators: Record<string, Narrator>;
  fingerprint: string;
  subtleties?: Subtlety[];
  initialMode?: Mode;
  embedded?: boolean;
}

/**
 * One hadith, two views. Reader: the text, what it means, whether it is sound.
 * Researcher: the four discussions a hadith is studied under (where it is
 * recorded, who carried it, what the chain shows, what it means), each one
 * a section that opens and closes and remembers the visitor's choice.
 */
export function HadithView({ hadith, narrators, fingerprint, subtleties = [], initialMode = "reader", embedded = false }: Props) {
  const [mode, setModeState] = useState<Mode>(initialMode);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = normaliseMode(window.localStorage.getItem("thp-mode"));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setModeState(saved);
    } catch {}
  }, []);
  const setMode = (m: Mode) => {
    setModeState(m);
    try {
      window.localStorage.setItem("thp-mode", m);
    } catch {}
  };

  const p = hadith.primary;
  const record = `thp:${p.cite}`;
  const status = HADITH_BANDS[hadith.status.band];
  const chainNarrators = p.chain.map((id) => narrators[id]).filter(Boolean);
  const selectedNarrator = selected ? narrators[selected] : null;
  const researcher = mode === "researcher";
  const H = embedded ? 3 : 2;
  const disputed = hadith.status.band !== "sahih";

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
    <div className="grid gap-7">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          {!embedded && <div className="small text-muted mb-1">{p.collection} · {p.number}</div>}
          {embedded ? <h2 className="text-[1.6rem] sm:text-[2rem] leading-tight">{hadith.title}</h2> : <h1 className="text-[1.6rem] sm:text-[2.2rem] leading-tight">{hadith.title}</h1>}
        </div>
        <ModeToggle mode={mode} onChange={setMode} compact={embedded} />
      </div>

      {/* text */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p lang="ar" dir="rtl" className="arabic text-[1.6rem] sm:text-[2rem] leading-[1.9] text-ink" style={{ maxWidth: "none" }}>{p.matnAr}</p>
          {researcher && <p lang="ar" dir="rtl" className="arabic text-[1.15rem] text-ink-2 mt-3 leading-[1.9]" style={{ maxWidth: "none" }}>{p.isnadAr}</p>}
        </div>
        <div className="grid gap-4 content-start">
          <p className="text-[1.1rem] leading-relaxed" style={{ maxWidth: "none" }}>{p.matnEn}</p>
          <div className="flex flex-wrap items-center gap-3">
            <HadithChip band={hadith.status.band} label={hadith.status.label} size="lg" />
            <span className="small text-ink-2">{hadith.status.line}</span>
          </div>
          {!researcher && (
            <div className="rounded-md bg-plane p-4">
              <div className="tiny text-muted mb-1">In plain terms</div>
              <p className="text-ink-2" style={{ maxWidth: "none" }}>{hadith.takeaway}</p>
            </div>
          )}
          <div className="small text-ink-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              <span className="text-muted">Source: </span>
              {p.url ? <a className="link" href={p.url} rel="noopener">{p.collection}, {p.number}</a> : `${p.collection}, ${p.number}`}
              {p.bookChapter ? <span className="text-muted"> · {p.bookChapter}</span> : null}
            </span>
            <ReportLink record={record} line={p.matnAr} />
          </div>
          {!researcher && (
            <div>
              <div className="tiny text-muted mb-1.5">Who passed it down</div>
              <ChainStrip narration={p} narrators={narrators} />
              <p className="tiny text-muted mt-2">{status.meaning}</p>
              <button type="button" onClick={() => setMode("researcher")} className="btn btn-secondary mt-4 text-[0.9rem]">
                Open the full examination
              </button>
            </div>
          )}
        </div>
      </div>

      {researcher && (
        <>
          {/* 1. The chain, and what it shows */}
          <Disclosure id="chain" headingLevel={H} defaultOpen title="The chain, person by person" hint="Read upward from the book to the Prophet ﷺ. Click a narrator to open the record critics kept on them." aside={<BandLegend bands={["thiqa", "saduq", "daif", "matruk", "unknown", "sahabi"]} />}>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,460px)_1fr]">
              <IsnadGraph narration={p} narrators={narrators} fanOut={hadith.fanOut} selectedId={selected} onSelect={setSelected} showSigha step={86} width={hadith.fanOut ? 520 : 460} tableView />
              <div>
                {selectedNarrator ? (
                  <div className="grid gap-4">
                    <NarratorCard narrator={selectedNarrator} showArabicQuotes />
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
            <SubtletiesStrip items={subtleties} record={record} />
            {hadith.fanOut && (
              <details className="small mt-4">
                <summary className="cursor-pointer text-ink-2">Where the chain widens</summary>
                <p className="small text-ink-2 mt-2" style={{ maxWidth: "70ch" }}>
                  {hadith.fanOut.detail} <span className="text-muted">({hadith.fanOut.source})</span>
                </p>
              </details>
            )}
          </Disclosure>

          {/* Journey */}
          <Disclosure id="journey" headingLevel={H} defaultOpen title="Where it travelled" hint="Each narrator's city, in order, and the years by which the report had reached them.">
            <JourneyMap hadith={hadith} narrators={narrators} />
          </Disclosure>

          {/* Lifespans */}
          <Disclosure id="lifespans" headingLevel={H} title="Did these people overlap?" hint="Continuity is a condition, not an assumption: each teacher's death must fall inside the student's lifetime.">
            <LifespanTimeline narration={p} narrators={narrators} />
            <p className="tiny text-muted mt-3" style={{ maxWidth: "70ch" }}>
              Overlap is the weakest test. Scholars also asked whether the two met: al-Bukhari required proof of meeting, Muslim accepted proven contemporaneity with the possibility of meeting.
            </p>
          </Disclosure>

          {/* 2. Where it is recorded */}
          {(hadith.also.length > 0 || hadith.comparison) && (
            <Disclosure id="takhrij" headingLevel={H} defaultOpen={disputed} title="Where it is recorded" hint="Takhrij: every other place the report appears, and how each route differs from this one." aside={<span className="tiny text-muted">{hadith.also.length} parallel narration{hadith.also.length === 1 ? "" : "s"}</span>}>
              {hadith.also.length > 0 && (
                <ul className="grid gap-2.5 sm:grid-cols-2 small">
                  {hadith.also.map((a) => (
                    <li key={a.cite} className="flex gap-2">
                      <span className="mono text-muted break-all shrink-0 max-w-[40%]">{a.cite}</span>
                      <span>
                        {a.url ? <a className="link" href={a.url} rel="noopener">{a.label}</a> : a.label}
                        {a.note ? <span className="text-muted"> · {a.note}</span> : null}
                        {a.chainNote ? <span className="block tiny text-ink-2 mt-0.5">Chain: {a.chainNote}</span> : null}
                        {a.wordingNote ? <span className="block tiny text-ink-2 mt-0.5">Wording: {a.wordingNote}</span> : null}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {hadith.comparison && (
                <>
                  <RouteComparison comparison={hadith.comparison} headingLevel={3} />
                  <div className="rule pt-6 mt-6">
                    <h3 className="mb-1">The routes as one tree</h3>
                    <p className="small text-ink-2 mb-3" style={{ maxWidth: "70ch" }}>The same routes merged from the Prophet ﷺ down (i'tibar). Where they share a narrator, they share a node.</p>
                    <CorroborationTree comparison={hadith.comparison} />
                  </div>
                </>
              )}
              <p className="tiny text-muted mt-4">Corroboration across independent chains is how light weaknesses are shored up and anomalies caught. <ReportLink record={`${record} · takhrij`} /></p>
            </Disclosure>
          )}

          {/* Verdicts */}
          <Disclosure id="verdicts" headingLevel={H} defaultOpen title="Who graded it, and why" hint="We do not grade hadith. Each line is a named scholar's verdict, where they gave it, and the reason they gave." aside={<span className="tiny text-muted">{hadith.verdicts.length} verdicts</span>}>
            <VerdictTable verdicts={hadith.verdicts} showArabic record={record} />
          </Disclosure>

          {/* 4. Meaning */}
          <Disclosure id="meaning" headingLevel={H} title="What it means" hint="Commentary, not record: each point names the commentary it is drawn from.">
            {hadith.explanation?.status === "coming-soon" || !hadith.explanation ? (
              <div className="rounded-md border border-dashed border-hairline-strong p-4 small text-ink-2" style={{ maxWidth: "70ch" }}>
                <span className="font-semibold text-ink">Coming soon.</span> {hadith.explanation?.note ?? "The explanation will be drawn from the classical commentaries, each point attributed to the work it comes from, once a reviewer has checked it."}
              </div>
            ) : (
              <div className="grid gap-5">
                {hadith.explanation.note && <p className="small text-ink-2" style={{ maxWidth: "70ch" }}>{hadith.explanation.note}</p>}
                {hadith.explanation.rulings && hadith.explanation.rulings.length > 0 && (
                  <ol className="grid gap-2 small list-decimal pl-5" style={{ maxWidth: "70ch" }}>
                    {hadith.explanation.rulings.map((r, i) => (
                      <li key={i}>
                        {r.text} <span className="text-muted">({r.source})</span>
                      </li>
                    ))}
                  </ol>
                )}
                {hadith.explanation.commentaries && hadith.explanation.commentaries.length > 0 && (
                  <ul className="grid gap-2 small sm:grid-cols-2">
                    {hadith.explanation.commentaries.map((c, i) => (
                      <li key={i}>
                        <span className="font-semibold text-ink">{c.author}, </span>
                        {c.url ? <a className="link" href={c.url} rel="noopener">{c.work}</a> : <span className="italic">{c.work}</span>}
                        <span className="text-ink-2">: {c.point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {hadith.context && (
              <div className="mt-5">
                <div className="sans text-[0.9rem] font-semibold text-ink mb-1">Context</div>
                <p className="small text-ink-2" style={{ maxWidth: "70ch" }}>{hadith.context}</p>
              </div>
            )}
            {hadith.vocabulary && hadith.vocabulary.length > 0 && (
              <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2 small mt-5">
                {hadith.vocabulary.map((v) => (
                  <div key={v.term}>
                    <dt className="font-semibold text-ink">{v.term} <span lang="ar" className="arabic text-[1.1rem] text-ink-2">{v.ar}</span></dt>
                    <dd className="text-ink-2">{v.meaning}</dd>
                  </div>
                ))}
              </dl>
            )}
          </Disclosure>

          {/* Method lessons */}
          {hadith.lessons.length > 0 && (
            <Disclosure id="lessons" headingLevel={H} title="What this chain teaches about the method">
              <div className="grid gap-5 md:grid-cols-2">
                {hadith.lessons.map((l) => (
                  <div key={l.title}>
                    <div className="font-semibold sans text-[0.95rem] text-ink mb-1">{l.title}</div>
                    <p className="small text-ink-2">{l.body}</p>
                  </div>
                ))}
              </div>
            </Disclosure>
          )}

          {/* Identifiers */}
          <Disclosure id="identifiers" headingLevel={H} title="Reference and fingerprint" hint="A stable cite, and a checksum of the normalised Arabic so a quotation can be checked against the record whatever edition it came from.">
            <dl className="sans text-[0.9rem] grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-1.5">
              <dt className="text-muted">Canonical cite</dt><dd className="mono break-all">{record}</dd>
              <dt className="text-muted">Numbering</dt><dd>{p.numbering}</dd>
              <dt className="text-muted">Text fingerprint</dt><dd className="mono break-all">sha256:{fingerprint}</dd>
              {hadith.family && (<><dt className="text-muted">Family</dt><dd className="mono break-all">{hadith.family}</dd></>)}
              <dt className="text-muted">Machine-readable</dt><dd className="break-all"><Link className="link" href={`/api/v0/hadith/${hadith.slug}.json`}>/api/v0/hadith/{hadith.slug}.json</Link></dd>
            </dl>
          </Disclosure>
        </>
      )}

      {embedded && (
        <div className="small">
          <Link className="link" href={`/h/${hadith.slug}/`}>Open the full page for this hadith</Link>
        </div>
      )}
    </div>
  );
}
