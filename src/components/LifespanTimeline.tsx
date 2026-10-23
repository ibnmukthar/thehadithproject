import type { Narration, Narrator } from "@/data/types";
import { BANDS } from "@/lib/bands";

interface Props {
  narration: Narration;
  narrators: Record<string, Narrator>;
}

/**
 * Lifespans on a hijri axis. One row per narrator, the compiler at the bottom.
 * A dotted drop at each teacher's death year shows the student's bar covering
 * that year: the two lives overlapped. Where a birth year is not recorded the
 * bar fades in rather than pretending to a start.
 */
export function LifespanTimeline({ narration, narrators }: Props) {
  const rows = ["prophet", ...[...narration.chain].reverse()];
  const people = rows.map((id) =>
    id === "prophet"
      ? { id, short: "The Prophet ﷺ", born: -53 as number | null, died: 11, band: "prophet" as const }
      : { id, short: narrators[id].short, born: narrators[id].born ?? null, died: narrators[id].died ?? null, band: narrators[id].band },
  );
  const maxYear = Math.max(...people.map((p) => p.died ?? 0)) + 15;
  const minYear = 0;
  const labelW = 190;
  const W = 760;
  const plotW = W - labelW - 20;
  const rowH = 30;
  const top = 26;
  const H = top + rows.length * rowH + 30;
  const x = (yr: number) => labelW + ((yr - minYear) / (maxYear - minYear)) * plotW;
  const ticks: number[] = [];
  for (let t = 0; t <= maxYear; t += 50) ticks.push(t);

  // Plain-language conclusion of what the drawing shows.
  const pairs = people.slice(0, -1).map((teacher, i) => ({ teacher, student: people[i + 1] }));
  const checked = pairs.filter((pr) => pr.teacher.died != null && pr.student.born != null).map((pr) => pr.teacher.died! - pr.student.born!);
  const unverifiable = pairs.length - checked.length;
  const allOverlap = checked.every((age) => age > 0);
  const summary =
    checked.length > 0
      ? `Where both dates are recorded, ${allOverlap ? "every" : "not every"} teacher died within the next narrator's lifetime (the student's age at that moment: ${Math.min(...checked) === Math.max(...checked) ? `about ${checked[0]}` : `from ${Math.min(...checked)} to ${Math.max(...checked)}`}).${unverifiable > 0 ? ` ${unverifiable} of the ${pairs.length} links cannot be checked this way because a birth year is not recorded.` : ""}`
      : `None of the ${pairs.length} links can be checked by dates alone, because birth years are not recorded; the critics relied on recorded hearing and teacher–student lists instead.`;

  return (
    <div>
    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0" tabIndex={0} role="region" aria-label="Lifespan timeline; scrolls sideways on small screens">
    <div style={{ minWidth: 620 }}>
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Lifespans of the narrators on a hijri timeline" aria-describedby="lifespan-summary" style={{ overflow: "visible" }}>
      {/* grid */}
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={top - 6} y2={H - 24} stroke="var(--hairline)" strokeWidth="1" />
          <text x={x(t)} y={H - 8} fontSize="11.5" textAnchor="middle" fill="var(--muted)" fontFamily="var(--font-sans)">
            {t} AH
          </text>
        </g>
      ))}
      {/* rows */}
      {people.map((p, i) => {
        const y = top + i * rowH + rowH / 2;
        const b = BANDS[p.band];
        const died = p.died ?? maxYear;
        const bornBH = p.born != null && p.born < minYear;
        const start = p.born == null ? Math.max(minYear, died - 55) : Math.max(minYear, p.born);
        return (
          <g key={p.id}>
            <text x={labelW - 12} y={y + 4} fontSize="12.5" textAnchor="end" fill="var(--ink)" fontFamily="var(--font-sans)">
              {p.short}
            </text>
            {p.born == null ? (
              <rect x={x(start)} y={y - 6} width={x(died) - x(start)} height="12" fill="none" stroke="var(--muted)" strokeWidth="1" strokeDasharray="3 3" rx="2" />
            ) : (
              <rect x={x(start)} y={y - 6} width={x(died) - x(start)} height="12" fill={b.tint} stroke={b.color} strokeWidth="1" rx="2" />
            )}
            {p.died != null && (
              <>
                <line x1={x(died)} x2={x(died)} y1={y - 9} y2={y + 9} stroke={b.color} strokeWidth="2" />
                <text x={x(died) + 5} y={y + 4} fontSize="11.5" fill="var(--ink-2)" fontFamily="var(--font-sans)">
                  d. {died}
                  {p.born != null ? ` (b. ${bornBH ? `${-p.born} BH` : p.born})` : ""}
                </text>
              </>
            )}
            {p.born == null && (
              <text x={x(start) + 2} y={y - 9} fontSize="10.5" fill="var(--muted)" fontFamily="var(--font-sans)">
                birth not recorded
              </text>
            )}
          </g>
        );
      })}
      {/* overlap drops: teacher death year falls inside student's life */}
      {people.slice(0, -1).map((teacher, i) => {
        const student = people[i + 1];
        if (teacher.died == null) return null;
        const y1 = top + i * rowH + rowH / 2;
        const y2 = top + (i + 1) * rowH + rowH / 2;
        const age = student.born != null ? teacher.died - student.born : null;
        return (
          <g key={`drop-${teacher.id}`}>
            <line x1={x(teacher.died)} x2={x(teacher.died)} y1={y1 + 9} y2={y2 - 7} stroke="var(--lapis)" strokeWidth="1.2" strokeDasharray="2 3" />
            {age != null && (
              <text x={x(teacher.died) - 5} y={y2 - 9} fontSize="10.5" textAnchor="end" fill="var(--lapis)" fontFamily="var(--font-sans)">
                aged {age}
              </text>
            )}
          </g>
        );
      })}
    </svg>
    </div>
    </div>
    <p id="lifespan-summary" className="small text-ink-2 mt-3" style={{ maxWidth: "70ch" }}>{summary}</p>
    <details className="small mt-3">
      <summary className="cursor-pointer text-ink-2">View these lifespans as a table</summary>
      <table className="data mt-2">
        <thead>
          <tr><th>Narrator</th><th>Born</th><th>Died</th><th>Age when the previous narrator died</th></tr>
        </thead>
        <tbody>
          {people.map((p, i) => {
            const teacher = i > 0 ? people[i - 1] : null;
            const age = teacher && teacher.died != null && p.born != null ? teacher.died - p.born : null;
            return (
              <tr key={p.id}>
                <td>{p.short}</td>
                <td>{p.born == null ? "not recorded" : p.born < 0 ? `${-p.born} BH` : `${p.born} AH`}</td>
                <td>{p.died == null ? "not recorded" : `${p.died} AH`}</td>
                <td>{age != null ? `about ${age}` : teacher ? "unknown (birth not recorded)" : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </details>
    </div>
  );
}
