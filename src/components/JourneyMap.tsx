"use client";

import { useId, useMemo, useState } from "react";
import type { Hadith, Narrator } from "@/data/types";
import { PLACES, placesFor, project, MAP_W, MAP_H, type Place } from "@/lib/places";
import { hijriToCE } from "@/lib/text";
import { BANDS } from "@/lib/bands";

/** Coastlines, roughly: enough to place the cities, not a map to navigate by. [lon, lat] */
const SEAS: [number, number][][] = [
  // Mediterranean, eastern basin
  [[26, 37.5], [37, 37.5], [36.9, 36.2], [35.9, 35.9], [35.6, 34.3], [35.5, 33.9], [35.0, 32.8], [34.5, 31.6], [33.0, 31.2], [32.3, 31.3], [31.0, 31.5], [29.9, 31.2], [26, 31.4]],
  // Red Sea and Gulf of Aden
  [[32.5, 30.0], [32.6, 29.3], [33.6, 28.0], [34.3, 26.1], [35.5, 24.0], [36.8, 22.5], [37.3, 21.0], [37.2, 19.6], [38.5, 18.0], [39.2, 15.6], [40.0, 14.6], [42.7, 12.7], [43.3, 12.6], [45.0, 12.8], [48.0, 14.0], [50.0, 15.0], [52.0, 16.5], [54.0, 17.0], [56.0, 18.5], [57.8, 20.0], [58.8, 22.4], [58.6, 23.6], [57.5, 23.8], [56.6, 24.5], [56.4, 25.3], [56.4, 26.4], [57.2, 25.6], [58.5, 25.5], [60.0, 25.3], [61.6, 25.2], [63.0, 25.3], [66.0, 25.0], [67.0, 24.8], [70, 24.0], [70, 12], [43.3, 12], [42.9, 14.0], [42.6, 15.3], [42.0, 16.6], [41.5, 18.0], [40.8, 19.5], [39.2, 21.5], [39.0, 22.8], [38.5, 24.1], [37.3, 25.5], [36.6, 26.3], [35.5, 27.7], [34.9, 28.0], [34.9, 29.5], [34.7, 29.5], [34.4, 28.4], [33.9, 27.9], [33.0, 28.6], [32.5, 30.0]],
  // Persian Gulf
  [[48.0, 30.4], [48.8, 30.0], [49.6, 30.0], [50.3, 29.3], [51.5, 28.0], [52.6, 27.3], [54.0, 26.7], [55.0, 26.6], [56.3, 27.1], [56.6, 26.5], [56.4, 26.4], [55.3, 25.3], [54.4, 24.5], [52.6, 24.1], [51.6, 24.7], [51.5, 25.5], [51.0, 26.1], [50.6, 25.5], [50.3, 26.2], [49.6, 27.2], [48.8, 28.3], [48.4, 29.3], [47.9, 29.9]],
  // Caspian
  [[48.9, 38.4], [49.5, 40.4], [49.2, 41.5], [48.7, 42.5], [47.5, 44.0], [48.0, 45.6], [49.5, 46.0], [51.5, 46.0], [53.0, 45.5], [51.2, 43.6], [51.0, 42.5], [53.0, 41.0], [52.9, 40.0], [53.9, 38.0], [54.0, 37.3], [53.0, 36.9], [51.5, 36.7], [50.3, 37.2], [49.3, 37.5]],
  // Aral
  [[58.3, 45.0], [59.5, 46.0], [61.0, 46.0], [61.5, 45.5], [60.8, 44.0], [59.5, 43.6], [58.3, 44.3]],
  // Black Sea (edge)
  [[26, 46], [26, 41.2], [29, 41.2], [31, 41.1], [35, 42.0], [38, 41.0], [41, 41.5], [41.5, 46]],
];
const RIVERS: [number, number][][] = [
  [[31.2, 30.0], [31.2, 29.0], [30.8, 28.0], [31.0, 27.0], [31.3, 26.0], [32.6, 25.7], [32.9, 24.1], [32.9, 22.0], [31.5, 20.0], [30.5, 18.0], [32.5, 15.6]],
  [[38.3, 37.2], [38.8, 36.0], [40.0, 35.0], [41.2, 34.4], [43.0, 33.3], [44.0, 32.5], [44.4, 31.5], [45.8, 31.1], [47.0, 30.9], [47.8, 30.5]],
  [[42.0, 37.5], [43.1, 36.3], [43.6, 35.3], [44.3, 34.0], [44.4, 33.3], [45.5, 32.5], [46.2, 32.0], [47.1, 31.1], [47.8, 30.5]],
];
const ANCHORS = ["Madinah", "Makkah", "Damascus", "Jerusalem", "Fustat", "Kufa", "Basra", "Baghdad", "Rayy", "Nishapur", "Marw", "Bukhara", "Sanaa"];

interface Stop {
  id: string;
  label: string;
  place: Place | null;
  origin: Place | null; // where the person came from, when different from where they settled
  died: number | null;
  born: number | null;
  band: keyof typeof BANDS;
  year: number; // the year by which the report had reached this person (teacher's death)
}

function polygon(pts: [number, number][]) {
  return pts.map(([lon, lat]) => { const p = project(lat, lon); return `${p.x.toFixed(1)},${p.y.toFixed(1)}`; }).join(" ");
}

/**
 * Where the report travelled: each narrator's city on a schematic map, the
 * path between them, and a year scrubber. A chain is a route through places
 * and centuries as much as through people; this draws that.
 */
export function JourneyMap({ hadith, narrators }: { hadith: Hadith; narrators: Record<string, Narrator> }) {
  const uid = useId();
  const stops = useMemo<Stop[]>(() => {
    const ids = [...hadith.primary.chain].reverse(); // Companion first, compiler last
    const out: Stop[] = [{ id: "prophet", label: "The Prophet ﷺ", place: PLACES.Madinah, origin: null, died: 11, born: null, band: "prophet", year: 0 }];
    let lastYear = 11;
    for (const id of ids) {
      const n = narrators[id];
      if (!n) continue;
      const ps = placesFor(n.region);
      const settled = ps.length ? ps[ps.length - 1] : null;
      const origin = ps.length > 1 ? ps[0] : null;
      const prev = out[out.length - 1];
      const year = prev.died ?? lastYear + 30;
      lastYear = year;
      out.push({ id, label: n.short, place: settled, origin, died: n.died ?? null, born: n.born ?? null, band: n.band, year });
    }
    return out;
  }, [hadith, narrators]);

  const years = stops.map((s) => s.died).filter((y): y is number => y !== null);
  const minYear = 11;
  const maxYear = Math.max(...years, 11);
  const [year, setYear] = useState(maxYear);

  // Legs: consecutive stops in different cities. Stops in the same city stack.
  const legs: { from: Stop; to: Stop; i: number }[] = [];
  for (let i = 1; i < stops.length; i++) {
    const a = stops[i - 1];
    const b = stops[i];
    if (a.place && b.place && a.place.name !== b.place.name) legs.push({ from: a, to: b, i });
  }
  const cities = new Map<string, { place: Place; stops: Stop[] }>();
  for (const s of stops) if (s.place) (cities.get(s.place.name) ?? cities.set(s.place.name, { place: s.place, stops: [] }).get(s.place.name)!).stops.push(s);
  const anchors = ANCHORS.map((k) => PLACES[k]).filter((p) => !cities.has(p.name));
  const reachedIdx = stops.reduce((acc, s, i) => (s.year <= year ? i : acc), 0);
  const unknown = stops.filter((s) => !s.place && s.id !== "prophet");

  const sentence = describe(stops);

  return (
    <figure className="journey">
      <div className="journey-scroll" tabIndex={0} role="region" aria-label="Map of the route the report took">
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} width="100%" style={{ minWidth: 520, display: "block" }} role="img" aria-labelledby={`${uid}-title`}>
          <title id={`${uid}-title`}>{sentence}</title>
          <defs>
            <marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M 1 1 L 8 5 L 1 9 z" fill="var(--lapis)" />
            </marker>
          </defs>
          <rect width={MAP_W} height={MAP_H} fill="var(--page)" />
          <g fill="var(--plane-2)" stroke="var(--hairline)" strokeWidth="0.8">
            {SEAS.map((s, i) => <polygon key={i} points={polygon(s)} />)}
          </g>
          <g fill="none" stroke="var(--hairline-strong)" strokeWidth="0.9" strokeLinejoin="round">
            {RIVERS.map((r, i) => <polyline key={i} points={polygon(r)} />)}
          </g>
          {/* orientation cities */}
          <g fontFamily="var(--font-sans)" fontSize="9.5" fill="var(--muted)">
            {anchors.map((p) => {
              const q = project(p.lat, p.lon);
              return (
                <g key={p.name}>
                  <circle cx={q.x} cy={q.y} r="1.8" fill="var(--muted)" />
                  <text x={q.x + 4} y={q.y + 3}>{p.name}</text>
                </g>
              );
            })}
          </g>
          {/* legs */}
          <g fill="none" strokeLinecap="round">
            {legs.map(({ from, to, i }) => {
              const a = project(from.place!.lat, from.place!.lon);
              const b = project(to.place!.lat, to.place!.lon);
              const mx = (a.x + b.x) / 2;
              const my = (a.y + b.y) / 2 - Math.min(60, Math.hypot(b.x - a.x, b.y - a.y) * 0.22);
              const reached = i <= reachedIdx;
              return (
                <path
                  key={i}
                  d={`M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`}
                  stroke={reached ? "var(--lapis)" : "var(--hairline-strong)"}
                  strokeWidth={reached ? 2.2 : 1.4}
                  strokeDasharray={reached ? undefined : "4 4"}
                  markerEnd={reached ? `url(#${uid}-arrow)` : undefined}
                  className={reached ? "journey-leg" : undefined}
                />
              );
            })}
          </g>
          {/* stops */}
          <g fontFamily="var(--font-sans)">
            {[...cities.values()].map(({ place, stops: ss }) => {
              const q = project(place.lat, place.lon);
              const reached = ss.some((s) => stops.indexOf(s) <= reachedIdx);
              const color = reached ? "var(--lapis)" : "var(--muted)";
              const labelRight = place.lon < 60;
              return (
                <g key={place.name}>
                  {ss.length > 1 && <circle cx={q.x} cy={q.y} r={9 + ss.length * 1.5} fill="var(--lapis-tint)" opacity={reached ? 0.9 : 0.4} />}
                  <circle cx={q.x} cy={q.y} r="5" fill={color} stroke="var(--page)" strokeWidth="1.5" />
                  <text x={labelRight ? q.x + 9 : q.x - 9} y={q.y - 4} textAnchor={labelRight ? "start" : "end"} fontSize="11" fontWeight={600} fill="var(--ink)">{place.name}</text>
                  <text x={labelRight ? q.x + 9 : q.x - 9} y={q.y + 8} textAnchor={labelRight ? "start" : "end"} fontSize="9.5" fill="var(--ink-2)">
                    {ss.map((s) => s.label).join(" · ")}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <div className="journey-controls sans">
        <label htmlFor={`${uid}-year`} className="small text-ink-2">
          By <span className="font-semibold text-ink tabular-nums">{year} AH</span> <span className="text-muted">(≈ {hijriToCE(year)} CE)</span>: the report had reached {stops[reachedIdx].label}
          {stops[reachedIdx].place ? ` in ${stops[reachedIdx].place.name}` : ""}.
        </label>
        <input id={`${uid}-year`} type="range" min={minYear} max={maxYear} step={1} value={year} onChange={(e) => setYear(Number(e.target.value))} aria-valuetext={`${year} AH`} className="journey-range" />
      </div>

      <figcaption className="small text-ink-2 mt-3" style={{ maxWidth: "none" }}>{sentence}</figcaption>
      {unknown.length > 0 && <p className="tiny text-muted mt-1">No place recorded for: {unknown.map((s) => s.label).join(", ")}.</p>}
      <details className="small mt-3">
        <summary className="cursor-pointer text-ink-2">View the route as a table</summary>
        <table className="data stack mt-2">
          <thead><tr><th>Narrator</th><th>City</th><th>Lived</th><th>Had the report by</th></tr></thead>
          <tbody>
            {stops.map((s) => (
              <tr key={s.id}>
                <td data-label="Narrator">{s.label}</td>
                <td data-label="City">{s.place ? s.place.name : "not recorded"}{s.origin ? ` (from ${s.origin.name})` : ""}</td>
                <td data-label="Lived">{s.born !== null ? `${s.born}–` : "d. "}{s.died !== null ? `${s.died} AH` : "year not recorded"}</td>
                <td data-label="Had the report by">{s.id === "prophet" ? "" : `${s.year} AH`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

function describe(stops: Stop[]): string {
  const parts: string[] = [];
  let i = 1;
  if (stops.length < 2) return "";
  const first = stops[1];
  parts.push(`The report leaves ${first.place ? first.place.name : "its first city"} with ${first.label}${first.died !== null ? ` (d. ${first.died} AH)` : ""}`);
  while (i < stops.length) {
    const here = stops[i].place?.name;
    let j = i;
    while (j + 1 < stops.length && stops[j + 1].place?.name === here) j++;
    const stay = j - i; // extra generations in the same city
    if (stay > 0 && here) parts.push(`stays in ${here} for ${["one", "two", "three", "four", "five", "six"][stay - 1] ?? stay} more generation${stay > 1 ? "s" : ""}`);
    if (j + 1 < stops.length) {
      const next = stops[j + 1];
      if (next.place) parts.push(`${j + 1 === stops.length - 1 ? "arrives in" : "travels to"} ${next.place.name} with ${next.label}${next.died !== null ? ` (d. ${next.died} AH)` : ""}`);
    }
    i = j + 1;
  }
  return parts.join(", ") + ".";
}
