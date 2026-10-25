import Link from "next/link";
import { getHadith, narratorsFor, fingerprintOf, HADITH, NARRATORS, listCollections } from "@/data";
import { IsnadGraph } from "@/components/IsnadGraph";
import { ReferenceCard } from "@/components/ReferenceCard";
import { Conditions } from "@/components/Conditions";
import { HadithChip } from "@/components/GradeMark";

export default function Home() {
  const h = getHadith("actions-by-intentions")!;
  const narrators = narratorsFor(h);
  const fp = fingerprintOf(h);
  const collections = listCollections();
  const narrationCount = collections.reduce((a, c) => a + c.total, 0);
  const studies = HADITH.filter((x) => x.study);

  return (
    <>
      {/* Hero */}
      <section className="container pt-12 sm:pt-20 pb-6 grid gap-12 lg:grid-cols-[7fr_5fr] lg:items-start">
        <div className="pt-2">
          <h1>Hadith is a science of provenance.</h1>
          <p className="mt-7 text-[1.2rem] leading-[1.55] text-ink-2 max-w-[34rem]">
            Every hadith comes with a chain of named people, each one examined, and fourteen centuries of scholarship on whether that chain holds. Quoting one takes a second; checking it used to take a library. This puts the library behind the link.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/h/actions-by-intentions/" className="btn btn-primary">See a chain examined</Link>
            <Link href="/explore/" className="btn btn-secondary">Explore</Link>
          </div>
          <p className="mt-8 small text-muted max-w-[34rem]">
            Not a new collection, and not a new grading. The record of what the scholars established, with the sources, built in the open.
          </p>
        </div>
        <figure className="lg:pl-6">
          <IsnadGraph narration={h.primary} narrators={narrators} animate showSigha={false} step={62} width={400} />
          <figcaption className="tiny text-muted mt-2 max-w-[24rem]">
            Sahih al-Bukhari, hadith 1. Seven people, al-Bukhari included, stand between you and the Prophet ﷺ. Each has a record, and the record is the point.
          </figcaption>
        </figure>
      </section>

      {/* Conditions */}
      <section className="section">
        <div className="container">
          <h2 className="max-w-[26ch]">What it takes to call a hadith sahih</h2>
          <p className="mt-3 text-ink-2 max-w-[60ch]">Five conditions, fixed in writing by Ibn al-Salah in the seventh century from the practice of the critics before him. Fail one and the report is weak; weak means unproven by this route, never false.</p>
          <div className="mt-10">
            <Conditions />
          </div>
          <p className="mt-8 small"><Link href="/science/" className="link">How the science works</Link></p>
        </div>
      </section>

      {/* Three doors */}
      <section className="section bg-plane">
        <div className="container">
          <h2>Where to start</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <Door
              href="/studies/"
              title="Studied hadith"
              body={`${studies.length} hadith examined link by link: where each is recorded, who carried it, what the chain shows, what it means.`}
              foot={<span className="flex flex-wrap gap-2">{studies.slice(0, 3).map((s) => <HadithChip key={s.slug} band={s.status.band} label={s.status.label} size="sm" />)}</span>}
            />
            <Door
              href={collections.length ? `/collection/${collections[0].id}/` : "/explore/"}
              title={collections.length ? collections.map((c) => c.nameEn).join(", ") : "The collections"}
              body={collections.length ? `${narrationCount.toLocaleString()} narrations with the standard numbering, a stable cite and a text fingerprint for each, and a machine-parsed chain awaiting review.` : "The six canonical collections, each narration with a stable cite and a text fingerprint. Al-Bukhari first."}
              foot={<span className="tiny text-muted">{Object.keys(NARRATORS).length} narrator records so far</span>}
            />
            <Door
              href="/science/"
              title="Why it is a science"
              body="The five conditions, the twelve ranks of narrators, how a chain is tested, and why a weak hadith is not a false one. Twenty minutes, no prior knowledge."
              foot={<span className="tiny text-muted">With a side note on testimony, and on whether certainty can be counted</span>}
            />
          </div>
        </div>
      </section>

      {/* Reference */}
      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16 items-start">
          <div>
            <h2>One link that ends the argument</h2>
            <p className="mt-4 text-ink-2">
              Paste a Hadith Project link anywhere and it unfurls into the text, the source, the chain and who graded it. The person you are talking to does not have to trust you. They can look.
            </p>
            <dl className="sans text-[0.9rem] mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5">
              <dt className="text-muted">Cite</dt><dd className="mono">thp:{h.primary.cite}</dd>
              <dt className="text-muted">Fingerprint</dt><dd className="mono break-all">sha256:{fp}</dd>
              <dt className="text-muted">For machines</dt><dd><Link className="link" href={`/api/v0/hadith/${h.slug}.json`}>/api/v0/hadith/{h.slug}.json</Link></dd>
            </dl>
          </div>
          <ReferenceCard hadith={h} narrators={narrators} url={`https://thehadithproject.com/h/${h.slug}/`} />
        </div>
      </section>

      {/* Join */}
      <section className="section bg-plane">
        <div className="container grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16 items-start">
          <div>
            <h2>Built in the open</h2>
            <p className="mt-4 text-ink-2">
              Every record is a file anyone can read, every change is reviewed by a named scholar, and every line on the site has a link to report a correction. The scholarship exists; the work is joining it with care.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end lg:pt-3">
            <Link href="/about/" className="btn btn-secondary">Mission, goals and principles</Link>
            <Link href="/contribute/" className="btn btn-primary">Contribute</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Door({ href, title, body, foot }: { href: string; title: string; body: string; foot?: React.ReactNode }) {
  return (
    <Link href={href} className="door">
      <h3 className="text-[1.3rem] leading-tight">{title}</h3>
      <p className="small text-ink-2 mt-2" style={{ maxWidth: "none" }}>{body}</p>
      {foot && <div className="mt-4">{foot}</div>}
      <span className="door-arrow small mt-4" aria-hidden="true">Open</span>
    </Link>
  );
}
