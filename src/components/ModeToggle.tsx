"use client";

export type Mode = "reader" | "researcher";

const MODES: { id: Mode; label: string; hint: string }[] = [
  { id: "reader", label: "Reader", hint: "The text, what it means, and whether it is sound." },
  { id: "researcher", label: "Researcher", hint: "The chain, every narrator's record, the verdicts, and what sits behind them." },
];

/** Older saved values from the three-mode prototype map onto the two views. */
export function normaliseMode(v: string | null): Mode | null {
  if (v === "reader" || v === "layman") return "reader";
  if (v === "researcher" || v === "student") return "researcher";
  return null;
}

export function ModeToggle({ mode, onChange, compact = false }: { mode: Mode; onChange: (m: Mode) => void; compact?: boolean }) {
  return (
    <div className="sans">
      <div role="radiogroup" aria-label="View" className="inline-flex rounded-md border border-hairline-strong p-[3px] bg-plane">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={mode === m.id}
            onClick={() => onChange(m.id)}
            className={`px-3.5 py-2.5 sm:py-1.5 min-h-[44px] sm:min-h-0 text-[0.88rem] rounded-[4px] transition-colors ${mode === m.id ? "bg-page text-ink shadow-[0_0_0_1px_var(--hairline-strong)] font-medium" : "text-ink-2 hover:text-ink"}`}
          >
            {m.label}
          </button>
        ))}
      </div>
      {!compact && <p className="tiny text-muted mt-1.5">{MODES.find((m) => m.id === mode)?.hint}</p>}
    </div>
  );
}
