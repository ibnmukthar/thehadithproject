import Link from "next/link";
import type { Narrator } from "@/data/types";
import { BANDS } from "@/lib/bands";
import { BandChip } from "./GradeMark";

export function NarratorCard({ narrator, full = false, showArabicQuotes = false }: { narrator: Narrator; full?: boolean; showArabicQuotes?: boolean }) {
  const b = BANDS[narrator.band];
  return (
    <article className="rounded-[var(--radius-lg)] border border-hairline bg-page p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-[1.25rem] leading-tight">{narrator.name}</h3>
          <p lang="ar" dir="rtl" className="arabic text-[1.35rem] text-ink-2 leading-snug text-left" style={{ direction: "rtl", textAlign: "left" }}>{narrator.nameAr}</p>
        </div>
        <BandChip band={narrator.band} />
      </header>
      <dl className="sans text-[0.85rem] grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 mt-4 text-ink-2">
        {narrator.role && (<><dt className="text-muted">Role</dt><dd>{narrator.role}</dd></>)}
        <dt className="text-muted">Died</dt>
        <dd>{narrator.died ? `${narrator.died} AH` : narrator.diedNote ?? "not recorded"}{narrator.born ? ` · born ${narrator.born} AH` : ""}</dd>
        <dt className="text-muted">Region</dt>
        <dd>{narrator.region}</dd>
        {narrator.tabaqa && (<><dt className="text-muted">Generation</dt><dd>{ordinal(narrator.tabaqa)} of 12 in the Taqrib</dd></>)}
      </dl>

      {narrator.taqrib && (
        <div className="mt-4 rounded-md p-3" style={{ background: b.tint }}>
          <div className="tiny text-ink-2">Ibn Hajar, Taqrib al-Tahdhib{narrator.taqrib.number ? ` · entry ${narrator.taqrib.number}` : ""}</div>
          <div lang="ar" dir="rtl" className="arabic text-[1.3rem] leading-relaxed text-ink" style={{ direction: "rtl", textAlign: "right" }}>{narrator.taqrib.ar}</div>
          <div className="small text-ink-2">{narrator.taqrib.en}</div>
        </div>
      )}

      {narrator.flags && narrator.flags.length > 0 && (
        <ul className="mt-4 space-y-2">
          {narrator.flags.map((f) => (
            <li key={f.label} className="small text-ink-2 border-l-2 border-saduq pl-3">
              <span className="font-semibold text-ink">{f.label}.</span> {f.detail}
            </li>
          ))}
        </ul>
      )}

      {narrator.band === "sahabi" && (
        <p className="small text-ink-2 mt-4">{b.meaning}</p>
      )}

      {narrator.verdicts.length > 0 && (
        <div className="mt-5">
          <div className="tiny text-muted mb-2">What the critics said</div>
          <ul className="space-y-2.5">
            {narrator.verdicts.map((v, i) => (
              <li key={i} className="small">
                <span className="font-semibold text-ink">{v.critic}</span>
                {v.criticDied ? <span className="text-muted"> (d. {v.criticDied})</span> : null}
                <span className="text-ink-2">: {v.en}</span>
                <span className="text-muted"> · {v.url ? <a className="link" href={v.url} rel="noopener">{v.source}</a> : v.source}</span>
                {showArabicQuotes && v.ar ? <div lang="ar" dir="rtl" className="arabic text-[1.15rem] text-ink-2 mt-0.5" style={{ direction: "rtl", textAlign: "right" }}>{v.ar}</div> : null}
              </li>
            ))}
          </ul>
        </div>
      )}

      {full && (
        <>
          <p className="mt-5 text-ink-2">{narrator.bio}</p>
          {narrator.sources.length > 0 && (
            <div className="mt-4 tiny text-muted">
              Sources: {narrator.sources.map((s, i) => (
                <span key={s.url}>{i > 0 ? " · " : ""}<a className="link" href={s.url} rel="noopener">{s.label}</a></span>
              ))}
            </div>
          )}
        </>
      )}
      {!full && (
        <div className="mt-4 small">
          <Link className="link" href={`/narrator/${narrator.id}/`}>Full record</Link>
        </div>
      )}
    </article>
  );
}

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
