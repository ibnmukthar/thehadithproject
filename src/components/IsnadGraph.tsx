"use client";

import { useId, useState } from "react";
import type { Hadith, Narration, Narrator } from "@/data/types";
import { BANDS } from "@/lib/bands";

interface Props {
  narration: Narration;
  narrators: Record<string, Narrator>;
  fanOut?: Hadith["fanOut"];
  animate?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  showSigha?: boolean;
  width?: number;
  step?: number;
}

/**
 * Vertical isnad: the Prophet ﷺ at the top, the compiler at the bottom.
 * Each node is a narrator; each edge carries the transmission formula used
 * in the book (حدثنا, أخبرني, سمعت, عن…), which is itself evidence.
 */
export function IsnadGraph({ narration, narrators, fanOut, animate = false, selectedId = null, onSelect, showSigha = true, width = 460, step = 74 }: Props) {
  const uid = useId();
  const [hover, setHover] = useState<string | null>(null);
  // chain is compiler-first; render Prophet first (top)
  const ids = ["prophet", ...[...narration.chain].reverse()];
  const n = ids.length;
  const x0 = 34;
  const top = 30;
  const height = top + (n - 1) * step + 40;
  const pos = (i: number) => ({ x: x0, y: top + i * step });

  const linkByPair = new Map<string, Narration["links"][number]>();
  for (const l of narration.links) linkByPair.set(`${l.from}->${l.to}`, l);

  const fanLevel = fanOut ? ids.indexOf(fanOut.afterId) : -1;
  const fanCount = fanOut ? fanOut.named.length + 1 : 0;
  const fanXStart = 290;
  const fanXEnd = width - 24;

  const delay = (i: number) => (animate ? `${0.15 + (n - 1 - i) * 0.22}s` : "0s");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      role="group"
      aria-label={`Chain of narration for ${narration.cite}`}
      className="select-none"
      style={{ maxWidth: width, overflow: "visible" }}
      onMouseLeave={() => setHover(null)}
    >
      <defs>
        <marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 2 2 L 8 5 L 2 8 z" fill="var(--muted)" />
        </marker>
      </defs>

      {/* edges */}
      {ids.slice(1).map((id, k) => {
        const i = k + 1;
        const a = pos(i - 1);
        const b = pos(i);
        const teacher = ids[i - 1];
        const link = linkByPair.get(`${teacher}->${id}`);
        const emphasised = hover === id || hover === teacher || selectedId === id || selectedId === teacher;
        return (
          <g key={`e-${id}`}>
            <line
              x1={b.x}
              y1={b.y - 16}
              x2={a.x}
              y2={a.y + 16}
              stroke={emphasised ? "var(--lapis)" : "var(--muted)"}
              strokeWidth={emphasised ? 2 : 1.5}
              className={animate ? "draw-edge" : undefined}
              style={animate ? { animationDelay: delay(i) } : undefined}
              markerEnd={`url(#${uid}-arrow)`}
            />
            {showSigha && link && (
              <g className={animate ? "fade-in" : undefined} style={animate ? { animationDelay: delay(i) } : undefined}>
                <text x={x0 + 26} y={(a.y + b.y) / 2 + 1} className="arabic" fontSize="15" fill="var(--ink-2)" style={{ direction: "rtl" }} textAnchor="start">
                  {link.sighaAr}
                </text>
                <text x={x0 + 26} y={(a.y + b.y) / 2 + 15} fontSize="10.5" fill="var(--muted)" fontFamily="var(--font-sans)">
                  {link.sighaEn}
                  {link.kind === "sama" || link.kind === "ikhbar" ? "  · explicit hearing" : link.kind === "an" ? "  · unspecified (ʿan)" : ""}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* fan-out: where a single narrator's students multiply */}
      {fanOut && fanLevel >= 0 && (
        <g className={animate ? "fade-in" : undefined} style={animate ? { animationDelay: `${0.15 + (n - 1 - fanLevel) * 0.22 + 0.5}s` } : undefined}>
          {Array.from({ length: fanCount }).map((_, j) => {
            const src = pos(fanLevel);
            const x = fanXStart + ((fanXEnd - fanXStart) * j) / Math.max(1, fanCount - 1);
            const y = src.y + step * 0.58;
            const isMore = j === fanCount - 1;
            const name = isMore ? fanOut.headline : fanOut.named[j];
            return (
              <g key={`fan-${j}`}>
                <path
                  d={`M ${src.x} ${src.y + 14} C ${src.x} ${src.y + 40}, ${x - 40} ${y}, ${x} ${y - 7}`}
                  fill="none"
                  stroke="var(--hairline-strong)"
                  strokeWidth="1.1"
                  strokeDasharray={isMore ? "3 3" : undefined}
                />
                <circle cx={x} cy={y} r={isMore ? 6 : 5} fill={isMore ? "none" : "var(--lapis-tint-2)"} stroke={isMore ? "var(--muted)" : "var(--lapis)"} strokeWidth="1.2" strokeDasharray={isMore ? "2 2" : undefined}>
                  <title>{name}</title>
                </circle>
                {isMore && (
                  <>
                    <circle cx={x + 11} cy={y + 7} r="4" fill="none" stroke="var(--muted)" strokeWidth="1" strokeDasharray="2 2" />
                    <circle cx={x + 2} cy={y + 13} r="3" fill="none" stroke="var(--muted)" strokeWidth="1" strokeDasharray="2 2" />
                  </>
                )}
              </g>
            );
          })}
          <text x={fanXStart} y={pos(fanLevel).y + step * 0.58 + 26} fontSize="10.5" fill="var(--muted)" fontFamily="var(--font-sans)">
            {fanOut.named.slice(0, 3).join(", ")}… and {fanOut.headline}
          </text>
        </g>
      )}

      {/* nodes */}
      {ids.map((id, i) => {
        const p = pos(i);
        const nr = id === "prophet" ? null : narrators[id];
        const band = id === "prophet" ? "prophet" : nr?.band ?? "unknown";
        const b = BANDS[band];
        const active = hover === id || selectedId === id;
        const label = id === "prophet" ? "The Prophet Muhammad ﷺ" : nr?.short ?? id;
        const meta =
          id === "prophet"
            ? "d. 11 AH, Madinah"
            : nr
              ? `${nr.died ? `d. ${nr.died} AH` : nr.diedNote ?? "death year not recorded"}${nr.region ? ` · ${nr.region}` : ""}`
              : "";
        return (
          <g
            key={id}
            transform={`translate(${p.x}, ${p.y})`}
            className={animate ? "pop-node" : undefined}
            style={{ cursor: onSelect && id !== "prophet" ? "pointer" : "default", ...(animate ? { animationDelay: delay(i) } : {}) }}
            role={onSelect && id !== "prophet" ? "button" : undefined}
            tabIndex={onSelect && id !== "prophet" ? 0 : undefined}
            aria-label={`${label}, ${b.label}`}
            onMouseEnter={() => setHover(id)}
            onFocus={() => setHover(id)}
            onBlur={() => setHover(null)}
            onClick={() => onSelect && id !== "prophet" && onSelect(selectedId === id ? null : id)}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && onSelect && id !== "prophet") {
                e.preventDefault();
                onSelect(selectedId === id ? null : id);
              }
            }}
          >
            {active && <circle r="20" fill="var(--lapis-tint)" />}
            <NodeGlyph band={band} />
            <text x="26" y="-1" fontSize="13.5" fontFamily="var(--font-sans)" fontWeight={active ? 600 : 500} fill="var(--ink)">
              {label}
            </text>
            <text x="26" y="14" fontSize="10.5" fontFamily="var(--font-sans)" fill="var(--muted)">
              {meta}
            </text>
            {nr && nr.band !== "sahabi" && (
              <text x={26 + label.length * 7.4 + 8} y="-1" fontSize="10.5" fontFamily="var(--font-sans)" fill={b.color} fontWeight={600}>
                {b.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function NodeGlyph({ band }: { band: keyof typeof BANDS }) {
  const b = BANDS[band];
  const r = 12;
  switch (b.glyph) {
    case "star":
      return <path d={starPath(0, 0, 15, 9, 8)} fill={b.color} />;
    case "ring":
      return (
        <>
          <circle r={r} fill="var(--page)" stroke={b.color} strokeWidth="2.2" />
          <circle r={4.5} fill={b.color} />
        </>
      );
    case "solid":
      return <circle r={r} fill={b.color} />;
    case "half":
      return (
        <>
          <circle r={r} fill="var(--page)" stroke={b.color} strokeWidth="2.2" />
          <path d={`M 0 ${-r} A ${r} ${r} 0 0 1 0 ${r} Z`} fill={b.color} />
        </>
      );
    case "hollow":
      return <circle r={r} fill="var(--page)" stroke={b.color} strokeWidth="2.4" />;
    case "crossed":
      return (
        <>
          <circle r={r} fill="var(--page)" stroke={b.color} strokeWidth="2.2" />
          <line x1={-6} y1={-6} x2={6} y2={6} stroke={b.color} strokeWidth="2.2" />
          <line x1={6} y1={-6} x2={-6} y2={6} stroke={b.color} strokeWidth="2.2" />
        </>
      );
    default:
      return <circle r={r} fill="var(--page)" stroke={b.color} strokeWidth="2" strokeDasharray="3 3" />;
  }
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
