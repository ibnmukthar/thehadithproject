import type { Band } from "@/data/types";
import { BANDS, HADITH_BANDS, type HadithBand } from "@/lib/bands";

type Glyph = "solid" | "half" | "hollow" | "crossed" | "dotted" | "ring" | "star";

/** SVG glyph; colour never carries meaning alone, the shape differs per band. */
export function Glyph({ glyph, color, size = 14, title }: { glyph: Glyph; color: string; size?: number; title?: string }) {
  const r = size / 2 - 1.2;
  const c = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden={title ? undefined : true} role={title ? "img" : undefined} className="shrink-0 inline-block align-[-2px]">
      {title ? <title>{title}</title> : null}
      {glyph === "solid" && <circle cx={c} cy={c} r={r} fill={color} />}
      {glyph === "half" && (
        <>
          <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth="1.6" />
          <path d={`M ${c} ${c - r} A ${r} ${r} 0 0 1 ${c} ${c + r} Z`} fill={color} />
        </>
      )}
      {glyph === "hollow" && <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth="1.8" />}
      {glyph === "crossed" && (
        <>
          <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth="1.6" />
          <line x1={c - r * 0.6} y1={c - r * 0.6} x2={c + r * 0.6} y2={c + r * 0.6} stroke={color} strokeWidth="1.6" />
          <line x1={c + r * 0.6} y1={c - r * 0.6} x2={c - r * 0.6} y2={c + r * 0.6} stroke={color} strokeWidth="1.6" />
        </>
      )}
      {glyph === "dotted" && <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth="1.6" strokeDasharray="2 2.2" />}
      {glyph === "ring" && (
        <>
          <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth="1.6" />
          <circle cx={c} cy={c} r={r * 0.38} fill={color} />
        </>
      )}
      {glyph === "star" && (
        <path
          d={starPath(c, c, r, r * 0.5, 8)}
          fill={color}
        />
      )}
    </svg>
  );
}

function starPath(cx: number, cy: number, outer: number, inner: number, points: number) {
  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / points) * i - Math.PI / 2;
    d += `${i === 0 ? "M" : "L"} ${(cx + rad * Math.cos(a)).toFixed(2)} ${(cy + rad * Math.sin(a)).toFixed(2)} `;
  }
  return d + "Z";
}

export function BandChip({ band, showAr = true, size = "md" }: { band: Band; showAr?: boolean; size?: "sm" | "md" }) {
  const b = BANDS[band];
  return (
    <span
      className={`sans inline-flex items-center gap-1.5 rounded-full border ${size === "sm" ? "text-[0.74rem] px-2 py-[1px]" : "text-[0.82rem] px-2.5 py-[3px]"}`}
      style={{ color: b.color, borderColor: "color-mix(in srgb, " + b.color + " 35%, transparent)", background: b.tint }}
    >
      <Glyph glyph={b.glyph} color={b.color} size={size === "sm" ? 11 : 13} />
      <span className="font-medium">{b.label}</span>
      {showAr && <span lang="ar" className="arabic text-[1.05em] leading-none text-ink-2">{b.labelAr}</span>}
    </span>
  );
}

export function HadithChip({ band, label, size = "md" }: { band: HadithBand; label?: string; size?: "sm" | "md" | "lg" }) {
  const b = HADITH_BANDS[band];
  const cls = size === "sm" ? "text-[0.74rem] px-2 py-[1px]" : size === "lg" ? "text-[0.95rem] px-3 py-1" : "text-[0.82rem] px-2.5 py-[3px]";
  return (
    <span
      className={`sans inline-flex items-center gap-1.5 rounded-full border ${cls}`}
      style={{ color: b.color, borderColor: "color-mix(in srgb, " + b.color + " 35%, transparent)", background: b.tint }}
    >
      <Glyph glyph={b.glyph} color={b.color} size={size === "sm" ? 11 : size === "lg" ? 15 : 13} />
      <span className="font-medium">{label ?? b.label}</span>
      <span lang="ar" className="arabic text-[1.05em] leading-none text-ink-2">{b.labelAr}</span>
    </span>
  );
}

export function BandLegend({ bands }: { bands: Band[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 tiny text-ink-2">
      {bands.map((k) => {
        const b = BANDS[k];
        return (
          <li key={k} className="inline-flex items-center gap-1.5">
            <Glyph glyph={b.glyph} color={b.color} size={11} />
            <span>{b.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
