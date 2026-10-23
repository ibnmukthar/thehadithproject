"use client";

export type Mode = "layman" | "student" | "researcher";

const MODES: { id: Mode; label: string; hint: string }[] = [
  { id: "layman", label: "Reader", hint: "The text, the meaning, and whether it is sound." },
  { id: "student", label: "Student", hint: "Adds the chain, each narrator's record, and the scholars' verdicts." },
  { id: "researcher", label: "Researcher", hint: "Adds transmission formulae, lifespans, parallel narrations and the critics in Arabic." },
];

export function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="sans">
      <div role="radiogroup" aria-label="Depth" className="inline-flex rounded-md border border-hairline-strong p-[3px] bg-plane">
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
      <p className="tiny text-muted mt-1.5">{MODES.find((m) => m.id === mode)?.hint}</p>
    </div>
  );
}
