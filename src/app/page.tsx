import Link from "next/link";
import { getHadith, narratorsFor, fingerprintOf } from "@/data";
import { IsnadGraph } from "@/components/IsnadGraph";
import { HadithView } from "@/components/HadithView";
import { ReferenceCard } from "@/components/ReferenceCard";
import { Conditions } from "@/components/Conditions";
import { Glyph } from "@/components/GradeMark";

export default function Home() {
  const h = getHadith("actions-by-intentions")!;
  const narrators = narratorsFor(h);
  const fp = fingerprintOf(h);

  return (
    <>
      {/* Hero */}
      <section className="container pt-12 sm:pt-20 pb-10 grid gap-12 lg:grid-cols-[7fr_5fr] lg:items-start">
        <div className="pt-2">
          <h1>Hadith is a science of provenance.</h1>
          <p className="mt-7 text-[1.2rem] leading-[1.55] text-ink-2 max-w-[34rem]">
            Every hadith comes with a chain of named people, each one examined, and fourteen centuries of scholarship on whether that chain holds. The Hadith Project is putting all of it online: open, linked, and checkable in seconds.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#demo" className="btn btn-primary">See a chain examined</a>
            <Link href="/blueprint/" className="btn btn-secondary">Read the blueprint</Link>
          </div>
          <p className="mt-10 small text-muted max-w-[34rem]">
            Not a new collection, and not a new grading. A verifiable record of what the scholars established, with the sources, built in the open.
          </p>
        </div>
        <figure className="lg:pl-6">
          <IsnadGraph narration={h.primary} narrators={narrators} animate showSigha={false} step={62} width={400} />
          <figcaption className="tiny text-muted mt-2 max-w-[24rem]">
            Sahih al-Bukhari, hadith 1. Seven people, al-Bukhari included, stand between you and the Prophet ﷺ. Each has a record, and the record is the point.
          </figcaption>
        </figure>
      </section>

      {/* Problem */}
      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2>Quoting takes a second. Checking takes a library.</h2>
            <p className="mt-5 text-ink-2">
              Hadith are quoted, disputed and dismissed millions of times a day. The texts sit in dozens of editions with incompatible numbering. The narrators' records sit in biographical dictionaries that fill shelves. The verdicts are scattered through a thousand years of books. So the arguing happens without the evidence, and a method of rare rigour looks, from the outside, like a matter of faith.
            </p>
            <p className="mt-4 text-ink-2">
              None of this is lost. It is simply not linked. Linking it is an engineering problem, and engineering problems get solved.
            </p>
          </div>
          <dl className="grid gap-5 content-start border-t border-hairline">
            <Fact n="2,602" text="connected hadith, without repetition, that al-Bukhari admitted into his Sahih by Ibn Hajar's count, from the six hundred thousand reports he said he sifted." />
            <Fact n="12 × 12" text="ranks of reliability, and generations, into which Ibn Hajar sorted every narrator of the six canonical collections and their appended works in the Taqrib." />
            <Fact n="5" text="conditions a report must satisfy before anyone may call it sahih." />
          </dl>
        </div>
      </section>

      {/* Method */}
      <section className="section bg-plane">
        <div className="container">
          <h2 className="max-w-[26ch]">What it takes to call a hadith sahih</h2>
          <p className="mt-4 text-ink-2 max-w-[60ch]">
            The categories are not a mood. They are a decision procedure, fixed in writing by Ibn al-Salah in the seventh century from the practice of the critics before him. A report earns the word sahih only when all five conditions hold.
          </p>
          <div className="mt-12">
            <Conditions />
          </div>
          <p className="mt-12 small text-ink-2 max-w-[60ch]">
            Fail any one of the five and the report is weak (da'if). Keep all five with a narrator of slightly lesser precision and it is hasan. A chain with a light weakness can be strengthened by independent chains saying the same thing; a liar's chain cannot. Weak never means false; it means unproven by this route.{" "}
            <Link href="/science/" className="link">How the science works</Link>
          </p>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" className="section scroll-mt-16">
        <div className="container">
          <div className="max-w-[60ch] mb-10">
            <h2>A chain, examined</h2>
            <p className="mt-4 text-ink-2">
              This is what every hadith page will look like. Switch the depth, click a narrator, and read what the critics wrote about them. The chain below is the first hadith in Sahih al-Bukhari.
            </p>
          </div>
          <HadithView hadith={h} narrators={narrators} fingerprint={fp} initialMode="student" embedded />
          <p className="mt-8 small text-ink-2">
            Two more worked examples, one genuinely disputed and one weak, are in <Link href="/explore/" className="link">Explore</Link>. The weak one is a line almost everyone has heard.
          </p>
        </div>
      </section>

      {/* Reference */}
      <section className="section bg-plane">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16 items-start">
          <div>
            <h2>One link that ends the argument</h2>
            <p className="mt-5 text-ink-2">
              Paste a Hadith Project link anywhere and it unfurls into the text, the source, the chain and who graded it. The person you are talking to does not have to trust you. They can look.
            </p>
            <p className="mt-4 text-ink-2">
              Behind the link is a stable identifier. A cite names the collection and a declared canonical numbering, with a published crosswalk to every other edition. A fingerprint of the normalised Arabic text lets anyone check that a quotation matches the record, whichever edition it came from.
            </p>
            <dl className="sans text-[0.9rem] mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5">
              <dt className="text-muted">Cite</dt><dd className="mono">thp:{h.primary.cite}</dd>
              <dt className="text-muted">Fingerprint</dt><dd className="mono">sha256:{fp}</dd>
              <dt className="text-muted">Same data, for machines</dt><dd><Link className="link" href={`/api/v0/hadith/${h.slug}.json`}>/api/v0/hadith/{h.slug}.json</Link></dd>
            </dl>
          </div>
          <ReferenceCard hadith={h} narrators={narrators} url={`https://thehadithproject.com/h/${h.slug}/`} />
        </div>
      </section>

      {/* Mission, vision, goals */}
      <section className="section">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div className="grid gap-10 content-start">
              <div>
                <h2>Mission</h2>
                <p className="mt-4 text-ink-2">
                  To make the sciences of hadith as transparent, searchable and verifiable as the best modern reference works, by building open data, open tools and open standards that scholars trust and anyone can use.
                </p>
              </div>
              <div>
                <h2>Vision</h2>
                <p className="mt-4 text-ink-2">
                  A world in which no hadith is quoted without its chain, no chain without its narrators, and no verdict without its reasons. Where checking a hadith takes seconds, misquoting one is harder than quoting it correctly, and the method of the muhaddithin is recognised for what it is: one of the most rigorous systems of source criticism people have ever built.
                </p>
              </div>
            </div>
            <div>
              <h2>Goals</h2>
              <ol className="mt-5 grid gap-4">
                <Goal state="prototype" title="One stable reference for every narration" body="A universal identifier with a published crosswalk across editions and numberings, so a cite means the same thing everywhere." />
                <Goal state="prototype" title="Every narrator on record" body="A structured, sourced entry for every narrator of the major collections, quoting the critics in their own words." />
                <Goal state="prototype" title="Every chain drawn" body="Interactive isnad graphs for every narration, with transmission formulae and continuity visible." />
                <Goal state="prototype" title="Every verdict with its reason" body="Gradings from classical and contemporary scholars side by side, each tied to its source, with disagreement shown rather than averaged away." />
                <Goal state="done" title="Three depths, one record" body="Reader, student and researcher views of the same page, so a newcomer and a specialist are looking at the same facts." />
                <Goal state="prototype" title="Open by default" body="Open data, open code, a public API and embeddable reference cards, so apps, bots and browser extensions can cite instantly." />
                <Goal state="planned" title="Governed by scholars" body="An editorial process in which qualified hadith scholars review every change, and nothing automated is ever presented as a verdict." />
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="section bg-plane">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2>What we will not do</h2>
            <p className="mt-4 text-ink-2">Trust is the whole product. These are the lines that keep it.</p>
          </div>
          <ul className="grid gap-5">
            <Principle title="We will not grade hadith." body="Scholars grade. We show who said what, where they said it, and the reason they gave." />
            <Principle title="We will not hide disagreement." body="Where al-Albani and al-Arna'ut differ, both appear, with their reasoning. Where the classical critics split, the split is the record." />
            <Principle title="We will not publish a claim without a source." body="Every line traces to a book, an edition and a page. Where a scan exists, it links to the scan." />
            <Principle title="We will not let an algorithm pose as a muhaddith." body="Search, text clustering and continuity checks surface questions for human review. They never answer them." />
            <Principle title="We will not lock the data." body="Everything is downloadable, licensed for reuse, versioned, and mirrored. If this project ends, the data outlives it." />
          </ul>
        </div>
      </section>

      {/* Roadmap */}
      <section className="section">
        <div className="container">
          <h2>The road</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <Phase
              when="Now"
              title="Prototype"
              items={[
                "Three hadith with every link examined: one sahih, one disputed, one weak",
                "Identifier scheme and text fingerprint",
                "Reader, student and researcher depths",
                "Reference cards and a static JSON API",
                "The blueprint, open for criticism",
              ]}
            />
            <Phase
              when="Next"
              title="Foundation"
              items={[
                "The six canonical collections, with a numbering crosswalk across editions",
                "A record for every narrator of the six collections, built from the Tahdhib literature",
                "Verdicts from the classical critics and from al-Albani and al-Arna'ut, with reasons",
                "Isnad parsing for every narration, reviewed by people",
                "An editorial board of hadith scholars and a public change log",
              ]}
            />
            <Phase
              when="Later"
              title="Infrastructure"
              items={[
                "A browser extension and reply bot that answer any cited hadith with its card",
                "Search by meaning, labelled as retrieval, never as verdict",
                "Manuscripts and scanned editions linked at page level",
                "Further collections: Musnad Ahmad, the Muwatta, Ibn Hibban, al-Hakim and beyond",
                "Partnerships with universities and hadith institutes",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Join */}
      <section className="section bg-plane">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2>Build it with us</h2>
            <p className="mt-4 text-ink-2">
              The scholarship exists. The data exists, in pieces. What is missing is the work of joining them with care, and that is work many hands can share.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="https://github.com/ibnmukthar/thehadithproject" className="btn btn-primary" rel="noopener">Source on GitHub</a>
              <a href="mailto:hello@thehadithproject.com" className="btn btn-secondary">Write to us</a>
            </div>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2">
            <Role title="Hadith scholars" body="Review narrator records and verdicts, write the reasons in plain language, and sit on the editorial board." />
            <Role title="Developers" body="Isnad parsing, narrator disambiguation, the graph store, the API, the extension and the bot." />
            <Role title="Translators and editors" body="Make the records read well in English, Urdu, Turkish, Malay, French and beyond." />
            <Role title="Institutions and funders" body="Lend authority, host mirrors, and fund the scholars who do the reviewing." />
          </ul>
        </div>
      </section>
    </>
  );
}

function Fact({ n, text }: { n: string; text: string }) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-hairline pb-5">
      <dt className="serif text-[2rem] leading-none text-ink">{n}</dt>
      <dd className="small text-ink-2 self-center">{text}</dd>
    </div>
  );
}

function Goal({ title, body, state }: { title: string; body: string; state: "done" | "prototype" | "planned" }) {
  const color = state === "done" ? "var(--g-thiqa)" : state === "prototype" ? "var(--lapis)" : "var(--muted)";
  const glyph = state === "done" ? "solid" : state === "prototype" ? "half" : "hollow";
  const label = state === "done" ? "in the prototype" : state === "prototype" ? "prototyped" : "planned";
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

function Role({ title, body }: { title: string; body: string }) {
  return (
    <li>
      <div className="sans font-semibold text-ink">{title}</div>
      <p className="small text-ink-2 mt-1">{body}</p>
    </li>
  );
}
