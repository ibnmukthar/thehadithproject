import type { Subtlety } from "@/data/types";
import { Glyph } from "./GradeMark";

/**
 * The subtleties of the chain (lata'if al-isnad) as a strip of badges under
 * the chain graph. Computed observations carry a solid mark; a scholar's
 * observation carries a ring and names its source. The text is always shown;
 * the mark only distinguishes the two kinds.
 */
export function SubtletiesStrip({ items, record }: { items: Subtlety[]; record?: string }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
        <div className="sans text-[0.9rem] font-semibold text-ink">
          Subtleties of this chain <span lang="ar" className="arabic text-[1.05rem] font-normal text-ink-2">لطائف الإسناد</span>
        </div>
        <span className="tiny text-muted">What a trained reader notices on sight. Observations, not grades.</span>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((s, i) => (
          <li key={i} className="latifa">
            <span className="pt-[3px]">
              <Glyph glyph={s.kind === "check" ? "solid" : "ring"} color={s.kind === "check" ? "var(--lapis)" : "var(--gold)"} size={11} title={s.kind === "check" ? "Checkable from the records" : "A scholar's observation"} />
            </span>
            <span className="small text-ink" style={{ maxWidth: "none" }}>
              {s.text}
              {s.source && <span className="tiny text-muted block mt-0.5">{s.kind === "scholar" ? "Source: " : ""}{s.source}</span>}
            </span>
          </li>
        ))}
      </ul>
      {record && (
        <p className="tiny text-muted mt-2">
          <Glyph glyph="solid" color="var(--lapis)" size={9} /> computed from the records · <Glyph glyph="ring" color="var(--gold)" size={9} /> entered by a scholar
        </p>
      )}
    </div>
  );
}
