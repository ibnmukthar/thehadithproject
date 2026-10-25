import type { Metadata } from "next";
import Link from "next/link";
import { NARRATORS, hadithFor } from "@/data";
import { BandChip } from "@/components/GradeMark";

export const metadata: Metadata = {
  title: "Narrators",
  description: "Every narrator record on the site, in the shape of the classical entry.",
};

export default function NarratorsPage() {
  const all = Object.values(NARRATORS).sort((a, b) => (a.died ?? 9999) - (b.died ?? 9999) || a.name.localeCompare(b.name));
  return (
    <div className="container pt-10 pb-16">
      <div className="max-w-[60ch] mb-8">
        <h1 className="text-[2.2rem] sm:text-[2.8rem]">Narrators</h1>
        <p className="mt-4 text-ink-2">
          {all.length} records, ordered by death year. Each follows the anatomy of the classical entry: names, dates and places, who he narrated from and who narrated from him, the critics in their own words with the source for each line, and the sigla of the books that used him.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="data stack">
          <thead>
            <tr><th>Narrator</th><th>Standing</th><th>Died</th><th>Region</th><th>Generation</th><th>Appears in</th></tr>
          </thead>
          <tbody>
            {all.map((n) => {
              const hs = hadithFor(n.id);
              return (
                <tr key={n.id}>
                  <td data-label="Narrator">
                    <Link className="link" href={`/narrator/${n.id}/`}>{n.name}</Link>
                    <div lang="ar" dir="rtl" className="arabic text-[1.05rem] text-ink-2 text-left" style={{ direction: "rtl", textAlign: "left" }}>{n.nameAr}</div>
                  </td>
                  <td data-label="Standing"><BandChip band={n.band} showAr={false} size="sm" /></td>
                  <td data-label="Died">{n.died ? `${n.died} AH` : n.diedNote ?? "not recorded"}</td>
                  <td data-label="Region">{n.region}</td>
                  <td data-label="Generation">{n.tabaqa ? `${n.tabaqa} of 12` : ""}</td>
                  <td data-label="Appears in">{hs.map((h, i) => <span key={h.slug}>{i > 0 ? ", " : ""}<Link className="link" href={`/h/${h.slug}/`}>{h.primary.collection} {h.primary.number}</Link></span>)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
