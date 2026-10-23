import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contribute", description: "How to help build The Hadith Project." };

export default function ContributePage() {
  return (
    <div className="container pt-10 pb-16 grid gap-12 lg:grid-cols-[1fr_1fr]">
      <div>
        <h1 className="text-[2.2rem] sm:text-[2.8rem]">Build it with us</h1>
        <p className="mt-5 text-ink-2">
          The project is at the stage where the shape is decided and the hard, careful work begins. Everything is public: the code, the data, the blueprint and the disagreements.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="https://github.com/ibnmukthar/thehadithproject" className="btn btn-primary" rel="noopener">Source on GitHub</a>
          <a href="mailto:hello@thehadithproject.com" className="btn btn-secondary">hello@thehadithproject.com</a>
        </div>
      </div>
      <div className="grid gap-8">
        <Block title="If you are a hadith scholar">
          Review the narrator records and verdict tables in the prototype and tell us what is wrong. Help design the editorial process: who reviews, how disputes are recorded, what counts as a source. Write the reasons behind verdicts in language a newcomer can follow.
        </Block>
        <Block title="If you write software">
          The first engineering problems are isnad parsing (turning the Arabic chain text into narrator references), narrator disambiguation against the Tahdhib literature, the numbering crosswalk across editions, and the graph store behind the API. All are tractable and none are solved.
        </Block>
        <Block title="If you translate or edit">
          The records must read well in many languages without losing precision. Translators who know the terminology of the discipline are rare and essential.
        </Block>
        <Block title="If you represent an institution">
          Universities, hadith institutes and libraries can lend review capacity, host mirrors, and open their scanned editions. Write to us.
        </Block>
        <Block title="If you found an error">
          Open an issue on GitHub with the page, the line, and your source. Corrections with sources are the most valuable contribution there is.
        </Block>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-hairline pt-4">
      <h3>{title}</h3>
      <p className="small text-ink-2 mt-2">{children}</p>
    </div>
  );
}
