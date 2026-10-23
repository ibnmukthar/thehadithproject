import type { Narration, Narrator } from "@/data/types";
import { BANDS } from "@/lib/bands";
import { Glyph } from "./GradeMark";

/** Compact, horizontal summary of a chain: compiler → … → Companion → ﷺ */
export function ChainStrip({ narration, narrators, dense = false }: { narration: Narration; narrators: Record<string, Narrator>; dense?: boolean }) {
  const ids = [...narration.chain, "prophet"];
  return (
    <ol className={`sans flex flex-wrap items-center ${dense ? "gap-x-1.5 gap-y-1 text-[0.78rem]" : "gap-x-2 gap-y-1.5 text-[0.86rem]"}`} aria-label="Chain of narration, from the book back to the Prophet">
      {ids.map((id, i) => {
        const nr = id === "prophet" ? null : narrators[id];
        const band = id === "prophet" ? "prophet" : nr?.band ?? "unknown";
        const b = BANDS[band];
        return (
          <li key={id} className="inline-flex items-center gap-1.5">
            <Glyph glyph={b.glyph} color={b.color} size={dense ? 11 : 13} title={b.label} />
            <span className="text-ink">{id === "prophet" ? "the Prophet ﷺ" : nr?.short ?? id}</span>
            {i < ids.length - 1 && <span className="text-muted" aria-hidden="true">›</span>}
          </li>
        );
      })}
    </ol>
  );
}
