import Link from "next/link";
import type { Narrator } from "@/data/types";
import { BANDS } from "@/lib/bands";
import { Glyph } from "./GradeMark";

/**
 * The narrator's immediate network: teachers on the row above, the narrator in
 * the middle, students on the row below. Drawn as three rows rather than a
 * force layout so it stays legible, ordered, and readable by a screen reader
 * as two lists. A name with a record is a link; walking the network is a
 * matter of following links.
 */
export function NarratorNetwork({ narrator, narrators }: { narrator: Narrator; narrators: Record<string, Narrator> }) {
  const teachers = narrator.teachers ?? [];
  const students = narrator.students ?? [];
  return (
    <div className="network">
      <Row title="Narrated from" people={teachers} narrators={narrators} />
      <div className="network-self">
        <span className="network-line" aria-hidden="true" />
        <span className="network-node self">
          <Glyph glyph={BANDS[narrator.band].glyph} color={BANDS[narrator.band].color} size={13} />
          <span className="font-semibold text-ink">{narrator.short}</span>
        </span>
        <span className="network-line" aria-hidden="true" />
      </div>
      <Row title="Narrated by" people={students} narrators={narrators} />
    </div>
  );
}

function Row({ title, people, narrators }: { title: string; people: NonNullable<Narrator["teachers"]>; narrators: Record<string, Narrator> }) {
  if (people.length === 0) return <p className="tiny text-muted">{title}: none recorded yet.</p>;
  return (
    <div>
      <div className="tiny text-muted mb-1">{title}</div>
      <ul className="flex flex-wrap gap-2" aria-label={title}>
        {people.map((p, i) => {
          const rec = p.id ? narrators[p.id] : undefined;
          const b = rec ? BANDS[rec.band] : null;
          return (
            <li key={i} className="network-node">
              {b ? <Glyph glyph={b.glyph} color={b.color} size={11} title={b.label} /> : <Glyph glyph="dotted" color="var(--g-unknown)" size={11} title="No record yet" />}
              {rec ? <Link className="link" href={`/narrator/${rec.id}/`}>{p.name}</Link> : <span className="text-ink-2">{p.name}</span>}
              {p.sigla?.length ? <span lang="ar" className="arabic text-[0.95rem] text-muted">{p.sigla.join(" ")}</span> : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
