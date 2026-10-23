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

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Lifespans of the narrators on a hijri timeline" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="fade-in-bar" x1="0" x2="1">
          <stop offset="0" stopColor="var(--hairline)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--hairline-strong)" stopOpacity="1" />
        </linearGradient>
      </defs>
      {/* grid */}
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={top - 6} y2={H - 24} stroke="var(--hairline)" strokeWidth="1" />
          <text x={x(t)} y={H - 8} fontSize="10.5" textAnchor="middle" fill="var(--muted)" fontFamily="var(--font-sans)">
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
              <rect x={x(start)} y={y - 6} width={x(died) - x(start)} height="12" fill="url(#fade-in-bar)" rx="2" />
            ) : (
              <rect x={x(start)} y={y - 6} width={x(died) - x(start)} height="12" fill={b.tint} stroke={b.color} strokeWidth="1" rx="2" />
            )}
            {p.died != null && (
              <>
                <line x1={x(died)} x2={x(died)} y1={y - 9} y2={y + 9} stroke={b.color} strokeWidth="2" />
                <text x={x(died) + 5} y={y + 4} fontSize="10.5" fill="var(--ink-2)" fontFamily="var(--font-sans)">
                  d. {died}
                  {p.born != null ? ` (b. ${bornBH ? `${-p.born} BH` : p.born})` : ""}
                </text>
              </>
            )}
            {p.born == null && (
              <text x={x(start) + 2} y={y - 9} fontSize="9.5" fill="var(--muted)" fontFamily="var(--font-sans)">
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
              <text x={x(teacher.died) - 5} y={y2 - 9} fontSize="9.5" textAnchor="end" fill="var(--lapis)" fontFamily="var(--font-sans)">
                aged {age}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
