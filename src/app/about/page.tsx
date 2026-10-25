import type { Metadata } from "next";
import Link from "next/link";
import { Glyph } from "@/components/GradeMark";

export const metadata: Metadata = {
  title: "About",
  description: "Mission, goals, principles and roadmap of The Hadith Project: open, verifiable infrastructure for hadith and its sciences.",
};

export default function AboutPage() {
  return (
    <div className="container pt-10 pb-16">
      <div className="max-w-[60ch]">
        <h1 className="text-[2.2rem] sm:text-[2.8rem]">About the project</h1>
        <p className="mt-4 text-ink-2 text-[1.1rem]">
          Hadith are quoted, disputed and dismissed millions of times a day. The texts sit in dozens of editions with incompatible numbering, the narrators' records fill shelves of biographical dictionaries, and the verdicts are scattered through a thousand years of books. None of it is lost. It is simply not linked. Linking it is an engineering problem, and that is what this project is.
        </p>
      </div>

      <section className="rule pt-8 mt-10 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div className="grid gap-8 content-start">
          <div>
            <h2 className="text-[1.6rem]">Mission</h2>
            <p className="mt-3 text-ink-2">
              To make the sciences of hadith as transparent, searchable and verifiable as the best modern reference works, by building open data, open tools and open standards that scholars trust and anyone can use.
            </p>
          </div>
          <div>
            <h2 className="text-[1.6rem]">Vision</h2>
            <p className="mt-3 text-ink-2">
              A world in which no hadith is quoted without its chain, no chain without its narrators, and no verdict without its reasons. Where checking a hadith takes seconds, misquoting one is harder than quoting it correctly, and the method of the muhaddithin is recognised for what it is: one of the most rigorous systems of source criticism people have ever built.
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-[1.6rem]">Goals</h2>
          <ol className="mt-4 grid gap-4">
            <Goal state="prototype" title="One stable reference for every narration" body="A universal identifier with a published crosswalk across editions and numberings, so a cite means the same thing everywhere." />
            <Goal state="prototype" title="Every narrator on record" body="A structured, sourced entry for every narrator of the major collections, in the shape of the classical entry, quoting the critics in their own words." />
            <Goal state="prototype" title="Every chain drawn" body="Interactive chains for every narration, with transmission formulae, continuity, the route it travelled and the subtleties a trained reader sees." />
            <Goal state="prototype" title="Every verdict with its reason" body="Gradings from classical and contemporary scholars side by side, each tied to its source, with disagreement shown rather than averaged away." />
            <Goal state="done" title="Two views, one record" body="A reader's view and a researcher's view of the same page, so a newcomer and a specialist are looking at the same facts." />
            <Goal state="prototype" title="Open by default" body="Open data, open code, a public API and embeddable reference cards, so apps, bots and browser extensions can cite instantly." />
            <Goal state="planned" title="Governed by scholars" body="An editorial process in which qualified hadith scholars review every change, and nothing automated is ever presented as a verdict." />
          </ol>
        </div>
      </section>

      <section className="rule pt-8 mt-10 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <h2 className="text-[1.6rem]">What we will not do</h2>
          <p className="mt-3 text-ink-2">Trust is the whole product. These are the lines that keep it.</p>
        </div>
        <ul className="grid gap-5">
          <Principle title="We will not grade hadith." body="Scholars grade. We show who said what, where they said it, and the reason they gave." />
          <Principle title="We will not hide disagreement." body="Where al-Albani and al-Arna'ut differ, both appear, with their reasoning. Where the classical critics split, the split is the record." />
          <Principle title="We will not publish a claim without a source." body="Every line traces to a book, an edition and a page. Where a scan exists, it links to the scan." />
          <Principle title="We will not let an algorithm pose as a muhaddith." body="Search, text clustering, parsed chains and continuity checks surface questions for human review. They never answer them, and they are labelled as machine output until a person has checked them." />
          <Principle title="We will not lock the data." body="Everything is downloadable, licensed for reuse, versioned, and mirrored. If this project ends, the data outlives it." />
        </ul>
      </section>

      <section className="rule pt-8 mt-10">
        <h2 className="text-[1.6rem]">The road</h2>
        <div className="mt-6 grid gap-8 md:grid-cols-3">
          <Phase
            when="Done"
            title="Prototype"
            items={[
              "Three hadith with every link examined: one sahih, one disputed, one weak",
              "Identifier scheme and text fingerprint",
              "Reader and researcher views",
              "Reference cards and a JSON API",
              "The blueprint, open for criticism",
            ]}
          />
          <Phase
            when="Now"
            title="Foundation"
            items={[
              "Sahih al-Bukhari in full, with the standard numbering and a machine-parsed chain for every narration, awaiting review",
              "Narrator records in the shape of the classical entry, with the sigla of the six books",
              "The four discussions on every studied hadith: where it is recorded, who carried it, what the chain shows, what it means",
              "A correction link on every line, and an editorial board of hadith scholars",
            ]}
          />
          <Phase
            when="Next"
            title="Platform"
            items={[
              "The remaining five canonical collections, then the Muwatta and Musnad Ahmad",
              "A contributor portal: transcribe an entry, link a name, enter a verdict, each checked by a second person and approved by a named scholar",
              "The corroboration tree for every family of narrations, and the narrator network",
              "A browser extension and reply bot that answer any cited hadith with its card",
            ]}
          />
        </div>
      </section>

      <section className="rule pt-8 mt-10 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <h2 className="text-[1.6rem]">People</h2>
          <p className="mt-3 text-ink-2">
            Started by Muhammad Mukthar. The worked studies follow the structure of a hadith class taught from Sahih al-Bukhari. An editorial board of hadith scholars is being formed; the first two reviewers will be named here, with their roles, as soon as they have agreed.
          </p>
          <p className="mt-3 text-ink-2">
            Want to help? <Link className="link" href="/contribute/">Read how to contribute</Link>, or write to <a className="link" href="mailto:hello@thehadithproject.com">hello@thehadithproject.com</a>.
          </p>
        </div>
        <div>
          <h2 className="text-[1.6rem]">Open</h2>
          <ul className="mt-3 grid gap-2 text-ink-2">
            <li>Code: Apache 2.0, at <a className="link" href="https://github.com/ibnmukthar/thehadithproject" rel="noopener">github.com/ibnmukthar/thehadithproject</a>.</li>
            <li>Data: Creative Commons Attribution 4.0. The Arabic text of Sahih al-Bukhari is from the Open Hadith Data project (ODbL).</li>
            <li>The <Link className="link" href="/blueprint/">blueprint</Link> describes the identifiers, the data model, the review process and what the project will not do, in detail.</li>
            <li>The <Link className="link" href="/api/v0/hadith.json">API</Link> returns the same data the pages render.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

function Goal({ title, body, state }: { title: string; body: string; state: "done" | "prototype" | "planned" }) {
  const color = state === "done" ? "var(--g-thiqa)" : state === "prototype" ? "var(--lapis)" : "var(--muted)";
  const glyph = state === "done" ? "solid" : state === "prototype" ? "half" : "hollow";
  const label = state === "done" ? "done" : state === "prototype" ? "in progress" : "planned";
  return (
    <li className="grid grid-cols-[1.25rem_1fr] gap-3">
      <span className="pt-[5px]"><Glyph glyph={glyph} color={color} size={14} title={label} /></span>
      <div>
        <div className="sans font-semibold text-ink text-[0.98rem]">{title} <span className="tiny font-normal text-muted">{label}</span></div>
        <p className="small text-ink-2 mt-1">{body}</p>
      </div>
    </li>
  );
}

function Principle({ title, body }: { title: string; body: string }) {
  return (
    <li>
      <div className="text-[1.15rem] text-ink">{title}</div>
      <p className="small text-ink-2 mt-1">{body}</p>
    </li>
  );
}

function Phase({ when, title, items }: { when: string; title: string; items: string[] }) {
  return (
    <div className="border-t border-ink pt-4">
      <div className="sans text-[0.85rem] text-muted">{when}</div>
      <h3 className="mt-1">{title}</h3>
      <ul className="mt-4 grid gap-2 small text-ink-2 list-disc pl-4">
        {items.map((it) => <li key={it}>{it}</li>)}
      </ul>
    </div>
  );
}
