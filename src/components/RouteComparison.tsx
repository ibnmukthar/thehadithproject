import type { Band, RouteComparison as RC, RouteNode } from "@/data/types";
import { BANDS } from "@/lib/bands";
import { Glyph, HadithChip } from "./GradeMark";

/**
 * Side-by-side routes of one report: the classical i'tibar, drawn small.
 * Each route runs from the Prophet ﷺ downward. On wide screens the rows are
 * aligned by position so a narrator shared between routes lines up and is
 * tinted; the flagged node is where the critics located the fault.
 */
export function RouteComparison({ comparison, headingLevel = 3 }: { comparison: RC; headingLevel?: 2 | 3 }) {
  const cols = Math.max(...comparison.routes.map((r) => r.nodes.length)) + 1;
  const counts = new Map<string, number>();
  for (const r of comparison.routes) for (const n of r.nodes) if (n.band !== "gap") counts.set(n.name, (counts.get(n.name) ?? 0) + 1);
  const shared = new Set([...counts.entries()].filter(([, c]) => c >= 2).map(([n]) => n));
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <section className="rule pt-8">
      <Heading className={headingLevel === 2 ? "text-[1.4rem] mb-1" : "mb-1"}>{comparison.title}</Heading>
      <p className="small text-ink-2 mb-6" style={{ maxWidth: "70ch" }}>{comparison.intro}</p>
      <ol className="grid gap-5">
        {comparison.routes.map((r) => (
          <li key={r.label} className="rounded-[var(--radius-lg)] border border-hairline p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="sans font-semibold text-ink text-[0.95rem]">{r.label}</div>
              <HadithChip band={r.band} label={r.verdict} size="sm" />
            </div>
            <ol className="route-row sans text-[0.84rem]" style={{ "--cols": cols } as React.CSSProperties} aria-label={`Route: ${r.label}`}>
              <li className="route-node inline-flex items-center gap-1.5">
                <Glyph glyph="star" color="var(--gold)" size={13} title="The Prophet ﷺ" />
                <span>the Prophet ﷺ</span>
                <span className="sep" aria-hidden="true">›</span>
              </li>
              {r.nodes.map((n, i) => (
                <Node key={i} node={n} last={i === r.nodes.length - 1} shared={shared.has(n.name)} />
              ))}
            </ol>
            <p className="small text-ink-2 mt-3" style={{ maxWidth: "none" }}>{r.note}</p>
          </li>
        ))}
      </ol>
      {shared.size > 0 && (
        <p className="tiny text-muted mt-3">Tinted names appear in more than one route: {[...shared].join(", ")}. Routes that share a narrator below the Companion are not independent of each other at that point.</p>
      )}
    </section>
  );
}

function Node({ node, last, shared }: { node: RouteNode; last: boolean; shared: boolean }) {
  const gap = node.band === "gap";
  const b = !gap && node.band ? BANDS[node.band as Band] : null;
  return (
    <li className={`route-node inline-flex flex-col max-w-[14rem] ${shared ? "shared" : ""}`}>
      <span className="inline-flex items-center gap-1.5">
        {gap ? (
          <Glyph glyph="dotted" color="var(--g-daif)" size={13} title="Missing link" />
        ) : b ? (
          <Glyph glyph={b.glyph} color={b.color} size={13} title={b.label} />
        ) : (
          <Glyph glyph="dotted" color="var(--g-unknown)" size={13} title="Not graded here" />
        )}
        <span className={node.flag ? "font-semibold text-ink underline decoration-daif decoration-2 underline-offset-4" : gap ? "italic text-daif" : "text-ink"}>{node.name}</span>
        {!last && <span className="sep" aria-hidden="true">›</span>}
      </span>
      {node.flag && <span className="tiny text-daif pl-5">{node.flag}</span>}
    </li>
  );
}
