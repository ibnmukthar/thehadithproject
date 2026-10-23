export function Wordmark({ large = false, compact = false }: { large?: boolean; compact?: boolean }) {
  return (
    <span className={`inline-flex items-baseline gap-2 ${large ? "text-2xl" : "text-[1.05rem]"}`}>
      <svg width={large ? 28 : 20} height={large ? 28 : 20} viewBox="0 0 20 20" aria-hidden="true" className="self-center">
        <circle cx="10" cy="3" r="2.2" fill="var(--gold)" />
        <line x1="10" y1="5.2" x2="10" y2="8" stroke="var(--ink)" strokeWidth="1.2" />
        <circle cx="10" cy="10" r="2" fill="none" stroke="var(--lapis)" strokeWidth="1.4" />
        <line x1="10" y1="12" x2="10" y2="15" stroke="var(--ink)" strokeWidth="1.2" />
        <circle cx="10" cy="17" r="2" fill="var(--lapis)" />
      </svg>
      <span className={`serif tracking-tight whitespace-nowrap ${compact ? "hidden sm:inline" : ""}`}>The Hadith Project</span>
    </span>
  );
}
