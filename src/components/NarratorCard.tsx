import Link from "next/link";
import type { Narrator } from "@/data/types";
import { BANDS } from "@/lib/bands";
import { BandChip } from "./GradeMark";
import { ReportLink } from "./ReportLink";
import { SIGLA_NAMES } from "@/lib/sigla";

/**
 * A narrator's record, in the order of the classical entry: names, dates and
 * places, the Taqrib line, the sigla of the books that used him, the critics
 * in their own words with the source for each, then the specialist notes.
 */
export function NarratorCard({ narrator, full = false, showArabicQuotes = false }: { narrator: Narrator; full?: boolean; showArabicQuotes?: boolean }) {
  const b = BANDS[narrator.band];
  const record = `narrator ${narrator.id}`;
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
        {narrator.kunya && (<><dt className="text-muted">Kunya</dt><dd>{narrator.kunya}{narrator.kunyaAr ? <span lang="ar" className="arabic text-[1.05rem] ml-2">{narrator.kunyaAr}</span> : null}{narrator.kunyaVariants?.length ? <span className="text-muted"> · also {narrator.kunyaVariants.join(", ")}</span> : null}</dd></>)}
        {narrator.laqab && (<><dt className="text-muted">Known as</dt><dd>{narrator.laqab.en}{narrator.laqab.ar ? <span lang="ar" className="arabic text-[1.05rem] ml-2">{narrator.laqab.ar}</span> : null}</dd></>)}
        {narrator.nisbas && narrator.nisbas.length > 0 && (<><dt className="text-muted">Attributions</dt><dd>{narrator.nisbas.map((n) => n.en).join(", ")}</dd></>)}
        {narrator.mawla && (<><dt className="text-muted">Client of</dt><dd>{narrator.mawla}</dd></>)}
        <dt className="text-muted">Died</dt>
        <dd>
          {narrator.died ? `${narrator.died} AH` : narrator.diedNote ?? "not recorded"}
          {narrator.born ? ` · born ${narrator.born} AH` : narrator.bornNote ? ` · ${narrator.bornNote}` : ""}
          {narrator.deathVariants && narrator.deathVariants.length > 0 && <span className="text-muted"> · also given as {narrator.deathVariants.map((v) => `${v.year} (${v.authority})`).join("; ")}</span>}
        </dd>
        <dt className="text-muted">Region</dt>
        <dd>{narrator.region}{narrator.origin ? <span className="text-muted"> · from {narrator.origin}</span> : null}</dd>
        {narrator.tabaqa && (<><dt className="text-muted">Generation</dt><dd>{ordinal(narrator.tabaqa)} of 12 in the Taqrib</dd></>)}
        {narrator.rumuz && narrator.rumuz.length > 0 && (
          <>
            <dt className="text-muted">Used by</dt>
            <dd>
              <ul className="inline-flex flex-wrap gap-1.5 align-middle">
                {narrator.rumuz.map((s) => (
                  <li key={s} className="inline-flex items-center gap-1 rounded border border-hairline px-1.5 py-[1px] bg-plane">
                    <span lang="ar" className="arabic text-[1rem] leading-none">{s}</span>
                    <span className="tiny text-ink-2">{SIGLA_NAMES[s] ?? s}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </>
        )}
      </dl>

      {narrator.taqrib && (
        <div className="mt-4 rounded-md p-3" style={{ background: b.tint }}>
          <div className="tiny text-ink-2">Ibn Hajar, Taqrib al-Tahdhib{narrator.taqrib.number ? ` · entry ${narrator.taqrib.number}` : ""}{narrator.taqrib.rank ? ` · rank ${narrator.taqrib.rank} of 12` : ""}</div>
          <div lang="ar" dir="rtl" className="arabic text-[1.3rem] leading-relaxed text-ink" style={{ direction: "rtl", textAlign: "right" }}>{narrator.taqrib.ar}</div>
          <div className="small text-ink-2">{narrator.taqrib.en}</div>
        </div>
      )}

      {narrator.band === "sahabi" && narrator.companionCounts && (
        <p className="small text-ink-2 mt-4">
          {narrator.companionCounts.total !== undefined && <>{narrator.companionCounts.total.toLocaleString()} hadith are attributed to him in all</>}
          {narrator.companionCounts.agreed !== undefined && <>; {narrator.companionCounts.agreed} agreed upon by al-Bukhari and Muslim</>}
          {narrator.companionCounts.bukhariOnly !== undefined && <>, {narrator.companionCounts.bukhariOnly} in al-Bukhari alone</>}
          {narrator.companionCounts.muslimOnly !== undefined && <>, {narrator.companionCounts.muslimOnly} in Muslim alone</>}
          {narrator.companionCounts.inBukhari !== undefined && <>; {narrator.companionCounts.inBukhari} in al-Bukhari in total</>}
          . <span className="text-muted">({narrator.companionCounts.source})</span>
        </p>
      )}

      {(narrator.flags?.length || narrator.tadlis || narrator.ikhtilat || narrator.notHeardFrom?.length) && (
        <ul className="mt-4 space-y-2">
          {narrator.tadlis && (
            <li className="small text-ink-2 border-l-2 border-saduq pl-3">
              <span className="font-semibold text-ink">Tadlis, rank {narrator.tadlis.rank} of 5.</span> {narrator.tadlis.type ? `${narrator.tadlis.type}. ` : ""}{narrator.tadlis.note ?? ""} <span className="text-muted">({narrator.tadlis.source})</span>
            </li>
          )}
          {narrator.ikhtilat && (
            <li className="small text-ink-2 border-l-2 border-saduq pl-3">
              <span className="font-semibold text-ink">Confusion in later life.</span> {narrator.ikhtilat.when ? `${narrator.ikhtilat.when}. ` : ""}{narrator.ikhtilat.cause ? `${narrator.ikhtilat.cause}. ` : ""}
              {narrator.ikhtilat.heardBefore?.length ? `Heard from him before it: ${narrator.ikhtilat.heardBefore.join(", ")}. ` : ""}
              {narrator.ikhtilat.heardAfter?.length ? `After it: ${narrator.ikhtilat.heardAfter.join(", ")}. ` : ""}
              <span className="text-muted">({narrator.ikhtilat.source})</span>
            </li>
          )}
          {narrator.notHeardFrom?.map((x, i) => (
            <li key={i} className="small text-ink-2 border-l-2 border-saduq pl-3">
              <span className="font-semibold text-ink">Did not hear from {x.name}</span>, according to {x.authority}. {x.counter ?? ""} <span className="text-muted">({x.source})</span>
            </li>
          ))}
          {narrator.flags?.map((f) => (
            <li key={f.label} className="small text-ink-2 border-l-2 border-saduq pl-3">
              <span className="font-semibold text-ink">{f.label}.</span> {f.detail}
            </li>
          ))}
        </ul>
      )}

      {narrator.band === "sahabi" && !narrator.companionCounts && <p className="small text-ink-2 mt-4">{b.meaning}</p>}

      {narrator.verdicts.length > 0 && (
        <div className="mt-5">
          <div className="tiny text-muted mb-2">What the critics said</div>
          <ul className="space-y-2.5">
            {narrator.verdicts.map((v, i) => (
              <li key={i} className="small">
                <span className="font-semibold text-ink">{v.critic}</span>
                {v.criticDied ? <span className="text-muted"> (d. {v.criticDied})</span> : null}
                {v.via ? <span className="text-muted">, via {v.via}</span> : null}
                <span className="text-ink-2">: {v.en}</span>
                <span className="text-muted"> · {v.url ? <a className="link" href={v.url} rel="noopener">{v.source}</a> : v.source}</span>
                {showArabicQuotes && v.ar ? <div lang="ar" dir="rtl" className="arabic text-[1.15rem] text-ink-2 mt-0.5" style={{ direction: "rtl", textAlign: "right" }}>{v.ar}</div> : null}
              </li>
            ))}
          </ul>
        </div>
      )}

      {(narrator.dhahabi || narrator.tahrir) && (
        <div className="mt-4 grid gap-2 small">
          {narrator.dhahabi && (
            <p>
              <span className="font-semibold text-ink">al-Dhahabi</span>
              <span className="text-ink-2">: {narrator.dhahabi.en}</span> <span className="text-muted">· {narrator.dhahabi.source}</span>
              {showArabicQuotes && narrator.dhahabi.ar ? <span lang="ar" dir="rtl" className="arabic text-[1.15rem] text-ink-2 block" style={{ direction: "rtl", textAlign: "right" }}>{narrator.dhahabi.ar}</span> : null}
            </p>
          )}
          {narrator.tahrir && (
            <p>
              <span className="font-semibold text-ink">Tahrir al-Taqrib</span>
              <span className="text-ink-2">: {narrator.tahrir.grade}. {narrator.tahrir.note}</span>
              {narrator.tahrir.rebuttal ? <span className="text-ink-2"> Rebuttal: {narrator.tahrir.rebuttal}</span> : null} <span className="text-muted">· {narrator.tahrir.source}</span>
            </p>
          )}
        </div>
      )}

      {full && (
        <>
          <p className="mt-5 text-ink-2">{narrator.bio}</p>
          {(narrator.teachers?.length || narrator.students?.length) && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 small">
              {narrator.teachers && narrator.teachers.length > 0 && (
                <div>
                  <div className="tiny text-muted mb-1">Narrated from</div>
                  <ul className="grid gap-1">
                    {narrator.teachers.map((t, i) => (
                      <li key={i}>
                        {t.id ? <Link className="link" href={`/narrator/${t.id}/`}>{t.name}</Link> : t.name}
                        {t.sigla?.length ? <span lang="ar" className="arabic text-[1rem] text-muted ml-2">{t.sigla.join(" ")}</span> : null}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {narrator.students && narrator.students.length > 0 && (
                <div>
                  <div className="tiny text-muted mb-1">Narrated by</div>
                  <ul className="grid gap-1">
                    {narrator.students.map((s, i) => (
                      <li key={i}>
                        {s.id ? <Link className="link" href={`/narrator/${s.id}/`}>{s.name}</Link> : s.name}
                        {s.sigla?.length ? <span lang="ar" className="arabic text-[1rem] text-muted ml-2">{s.sigla.join(" ")}</span> : null}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {narrator.sources.length > 0 && (
            <div className="mt-4 tiny text-muted">
              Sources: {narrator.sources.map((s, i) => (
                <span key={s.url ?? s.label}>{i > 0 ? " · " : ""}{s.url ? <a className="link" href={s.url} rel="noopener">{s.label}</a> : s.label}</span>
              ))}
            </div>
          )}
        </>
      )}
      <div className="mt-4 small flex flex-wrap items-center gap-x-4 gap-y-1">
        {!full && <Link className="link" href={`/narrator/${narrator.id}/`}>Full record</Link>}
        <ReportLink record={record} />
      </div>
    </article>
  );
}

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
