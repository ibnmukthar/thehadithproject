import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Contribute", description: "Three ways to help build The Hadith Project, none of which require knowing git." };

const REPO = "https://github.com/ibnmukthar/thehadithproject";

export default function ContributePage() {
  return (
    <div className="container pt-10 pb-16">
      <div className="max-w-[60ch]">
        <h1 className="text-[2.2rem] sm:text-[2.8rem]">Build it with us</h1>
        <p className="mt-5 text-ink-2">
          Everything is public: the code, the record, the blueprint and the disagreements. Nothing enters the record without a source and a named reviewer. There are three doors, in order of how much they ask of you.
        </p>
      </div>

      <ol className="mt-10 grid gap-5 md:grid-cols-3">
        <Door n="1" title="Report a correction" who="Anyone, two minutes">
          Every line on the site has a <em>Report a correction</em> link. It opens a form prefilled with the record and the line, asks what it should say and for the source, and becomes a public issue a reviewer answers in public. You are credited by the name you give.
        </Door>
        <Door n="2" title="Propose a change" who="An afternoon, no git needed">
          Every record is a file: one per narrator, one per studied hadith, one per book of a collection. Open it on GitHub, press the pencil, make the change, and GitHub opens a pull request for you. The checks validate the record; the reviewers read it on the rendered page.
        </Door>
        <Door n="3" title="Review" who="Named scholars">
          Members of the editorial board approve changes to the record by writing a sign-off into it: who, role, date, decision, what was checked. A change to a narrator's standing or a hadith's status cannot merge without one.
        </Door>
      </ol>

      <div className="mt-6 flex flex-wrap gap-3">
        <a href={`${REPO}/issues/new?template=correction.yml`} className="btn btn-primary" rel="noopener">Report a correction</a>
        <a href={`${REPO}/tree/main/data`} className="btn btn-secondary" rel="noopener">Browse the record on GitHub</a>
        <a href={`${REPO}/blob/main/CONTRIBUTING.md`} className="btn btn-secondary" rel="noopener">Read the contributing guide</a>
      </div>

      <section className="rule pt-8 mt-12 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <h2 className="text-[1.6rem]">What is most useful right now</h2>
          <ul className="mt-4 grid gap-4">
            <Item title="Checking the machine-parsed chains">
              Every narration of Sahih al-Bukhari has a chain parsed by machine and labelled as such. Reading one against the edition, correcting the names and marking it reviewed is the single most valuable thing a trained reader can do. Start from any narration page.
            </Item>
            <Item title="Narrator records">
              The record follows the classical entry. Transcribing a Taqrib line with its entry number, the sigla of the books that used a narrator, or a critic's words with the page, fills a field that the site then uses to draw and to check.
            </Item>
            <Item title="Verdicts with reasons">
              A scholar's grade, where they gave it, and the reason they gave, for the hadith people quote most.
            </Item>
            <Item title="Reviewing">
              If you are trained in hadith sciences and willing to be named, write to us. The board is small and public, and its members are credited on every record they approve.
            </Item>
          </ul>
        </div>
        <div>
          <h2 className="text-[1.6rem]">And if you are</h2>
          <ul className="mt-4 grid gap-4">
            <Item title="A developer">Isnad parsing and name resolution against the Tahdhib literature, the numbering crosswalk, the corroboration tree over whole families, the contributor portal, the reply bot. All in the open at <a className="link" href={REPO} rel="noopener">GitHub</a>.</Item>
            <Item title="A translator or editor">The records must read well in many languages without losing precision. Translators who know the terminology of the discipline are rare and essential.</Item>
            <Item title="An institution">Universities, hadith institutes and libraries can lend review capacity, host mirrors and open their scanned editions.</Item>
          </ul>
          <p className="mt-6 small text-ink-2">
            Write to <a className="link" href="mailto:hello@thehadithproject.com">hello@thehadithproject.com</a>. The <Link className="link" href="/about/">About page</Link> has the mission, the principles and the road.
          </p>
        </div>
      </section>
    </div>
  );
}

function Door({ n, title, who, children }: { n: string; title: string; who: string; children: React.ReactNode }) {
  return (
    <li className="door">
      <div className="tiny text-muted">Door {n} · {who}</div>
      <h2 className="text-[1.4rem] leading-tight mt-1">{title}</h2>
      <p className="small text-ink-2 mt-2" style={{ maxWidth: "none" }}>{children}</p>
    </li>
  );
}

function Item({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <li className="border-t border-hairline pt-3">
      <div className="sans font-semibold text-ink text-[0.98rem]">{title}</div>
      <p className="small text-ink-2 mt-1">{children}</p>
    </li>
  );
}
