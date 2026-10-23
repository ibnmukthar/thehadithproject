import type { Metadata } from "next";
import Link from "next/link";
import { Conditions } from "@/components/Conditions";
import { Glyph } from "@/components/GradeMark";

export const metadata: Metadata = {
  title: "Why hadith is a science",
  description: "How the scholars of hadith decided what the Prophet ﷺ said: chains, narrator criticism, corroboration and the ladder of grades, explained from first principles.",
};

const RANKS: { n: number; ar: string; en: string; band: "sahabi" | "thiqa" | "saduq" | "maqbul" | "daif" | "matruk" | "unknown" }[] = [
  { n: 1, ar: "الصحابة", en: "The Companions", band: "sahabi" },
  { n: 2, ar: "أوثق الناس، ثقة ثقة، ثقة حافظ", en: "Praise doubled or made superlative: “the most reliable of people”, “reliable, reliable”, “reliable master”", band: "thiqa" },
  { n: 3, ar: "ثقة، متقن، ثبت، عدل", en: "A single term of praise: reliable, precise, firm, upright", band: "thiqa" },
  { n: 4, ar: "صدوق، لا بأس به، ليس به بأس", en: "Truthful; no harm in him", band: "saduq" },
  { n: 5, ar: "صدوق يهم، صدوق سيئ الحفظ، له أوهام، تغيّر بأخرة", en: "Truthful but errs, poor memory, changed late in life; also those tainted with an innovation", band: "saduq" },
  { n: 6, ar: "مقبول، وإلا فليّن الحديث", en: "Accepted where corroborated; otherwise soft in hadith (a narrator with few reports and no disqualifying fault)", band: "maqbul" },
  { n: 7, ar: "مستور، مجهول الحال", en: "Of unknown condition: more than one narrated from him, but no one vouched for him", band: "unknown" },
  { n: 8, ar: "ضعيف", en: "Weak", band: "daif" },
  { n: 9, ar: "مجهول", en: "Unknown: only one person narrated from him and no one vouched for him", band: "unknown" },
  { n: 10, ar: "متروك، واهي الحديث، ساقط", en: "Abandoned; worthless in hadith", band: "matruk" },
  { n: 11, ar: "متهم بالكذب", en: "Accused of lying", band: "matruk" },
  { n: 12, ar: "كذاب، وضّاع", en: "Liar; fabricator", band: "matruk" },
];

export default function SciencePage() {
  return (
    <div className="container pt-10 pb-16">
      <header className="max-w-[60ch]">
        <h1 className="text-[2.2rem] sm:text-[3rem]">Why hadith is a science</h1>
        <p className="mt-5 text-[1.15rem] text-ink-2">
          A science is a method that can be written down, applied by strangers, and checked by them. The scholars of hadith built one, and wrote it down, before most of the world had universities.
        </p>
      </header>

      <Section title="The problem it was built to solve">
        <p>
          The Prophet ﷺ said: “Whoever lies about me deliberately, let him take his seat in the Fire.” The warning is itself a hadith so widely transmitted that no one disputes it (Sahih al-Bukhari 110, Sahih Muslim, introduction). It made the question of who said what a matter of eternal consequence, and so the first generations began to ask it with unusual seriousness.
        </p>
        <p>
          Muhammad ibn Sirin (d. 110 AH) described the turn: “They did not use to ask about the chain. Then, when the civil strife came, they said: name us your men. The people of the Sunna were looked at and their hadith accepted; the people of innovation were looked at and their hadith not accepted.” (Sahih Muslim, introduction, narration 26.) From that point a report without a chain was a report without evidence.
        </p>
      </Section>

      <Section title="Two things to examine">
        <p>
          Every report has two parts. The <strong>isnad</strong> is the chain: the list of people who passed it down, each named. The <strong>matn</strong> is the text. The discipline examines both, but it begins with the chain, because a text with no known route to its source cannot be weighed at all.
        </p>
        <p>
          The habit of attaching the chain is what makes hadith unlike almost any other ancient literature. Herodotus almost never names the people who told him what he reports. For a hadith in al-Bukhari we know every person in the line, and for nearly all of them roughly when they died, where they lived, who they studied with, and what their contemporaries thought of their memory.
        </p>
      </Section>

      <Section title="The five conditions">
        <p className="mb-10">
          Ibn al-Salah (d. 643 AH) fixed the definition that every later writer uses. A report is sahih when all five conditions hold.
        </p>
        <Conditions />
      </Section>

      <Section title="How narrators were judged">
        <p>
          The study of narrators is called <em>ilm al-rijal</em>, and the practice of praising or faulting them is <em>al-jarh wa al-ta'dil</em>. The critics were not a committee; they were individuals, Shu'ba, Malik, Yahya ibn Ma'in, Ahmad ibn Hanbal, al-Bukhari, Abu Hatim, Abu Zur'a, al-Nasa'i, al-Daraqutni and others, who spent their lives comparing what each narrator transmitted against what everyone else transmitted from the same teachers. A narrator who often disagreed with stronger colleagues was marked down. One who matched them was marked up.
        </p>
        <p>
          Their words were recorded with the same care as the hadith themselves, in dictionaries that run to dozens of volumes. Ibn Hajar's Taqrib al-Tahdhib summarises the verdicts on every narrator of the six canonical collections and the works appended to them, each in a line, sorted into twelve ranks and twelve generations. The project's colour bands are a reading of these ranks, and the ranks are always shown beneath.
        </p>
        <ol className="mt-8 grid gap-2 sans text-[0.9rem]">
          {RANKS.map((r) => (
            <li key={r.n} className="grid grid-cols-[2rem_1.25rem_1fr] items-baseline gap-3 border-b border-hairline py-2">
              <span className="text-muted">{r.n}</span>
              <span><RankGlyph band={r.band} /></span>
              <span>
                <span className="arabic text-[1.15rem] text-ink mr-3" style={{ direction: "rtl" }}>{r.ar}</span>
                <span className="text-ink-2">{r.en}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-6 small text-ink-2">
          Ranks one to three are reliable. Four and five are truthful with lesser precision, whose reports are accepted with care and strengthened by corroboration. Six (maqbul) is accepted only where corroborated and otherwise counted weak. Seven to nine are not accepted on their own. Ten to twelve are rejected. A narrator's rank can also be conditional: some are reliable when narrating from their own countrymen and weak from others, or reliable before an illness and unreliable after it, and the dictionaries record exactly that.
        </p>
      </Section>

      <Section title="The ladder of grades">
        <ul className="grid gap-4">
          <Grade glyph="solid" color="var(--g-thiqa)" title="Sahih" ar="صحيح" body="All five conditions, with narrators of full precision." />
          <Grade glyph="half" color="var(--g-thiqa)" title="Hasan" ar="حسن" body="All five conditions, but a narrator of lesser precision. Also given to a chain with a light weakness (a poor memory, an unvouched narrator, a gap) that is corroborated by other independent chains (hasan li-ghayrihi); a weakness such as an abandoned narrator or a liar cannot be repaired this way." />
          <Grade glyph="hollow" color="var(--g-saduq)" title="Da'if" ar="ضعيف" body="A condition fails: a gap in the chain (mursal, munqati'), an unreliable narrator, an anomaly, a defect. Weak means unproven by this route, not false." />
          <Grade glyph="crossed" color="var(--g-daif)" title="Mawdu'" ar="موضوع" body="Judged a fabrication: a narrator known to lie, or a text that could not have been said." />
        </ul>
        <p className="mt-6 small text-ink-2">
          Grades belong to chains, not to texts. The same words can reach us through a weak route and a sound one; the scholar's task is to find every route and weigh them together. That is why a project like this must show the parallel narrations, not just the one in front of you.
        </p>
      </Section>

      <Section title="Did they actually meet?">
        <p>
          An unbroken chain means more than consecutive names. Critics checked that each narrator was alive, in the right place, and old enough to have heard from the person they cite. Where a narrator says only “from”, al-Bukhari is understood (by al-Qadi Iyad, Ibn Rajab and Ibn Hajar) to have required positive evidence that the two had met at least once. Muslim argued in his introduction that contemporaries who could have met suffice, provided the narrator was not known for disguising gaps. The project draws the lifespans so that this check, which the critics did from memory, is visible to anyone.
        </p>
        <p>
          The words a narrator uses matter too. “He narrated to us” and “I heard” assert direct hearing. “From” (ʿan) does not. A narrator known to say “from” over people he met but did not hear that particular report from, so that it sounds like direct hearing, is a <em>mudallis</em>, and Ibn Hajar sorted them into five ranks by how much it was tolerated. (Saying “from” over a contemporary he never met is, in Ibn Hajar's terms, a hidden mursal.) These facts are on record, which is why they can be shown.
        </p>
      </Section>

      <Section title="Why scholars disagree">
        <p>
          Two careful scholars can reach different verdicts on the same report: they may weigh a narrator differently, know different parallel routes, or hold different standards for corroboration. This is not a flaw in the science. It is what a science looks like when it is practised by people. The honest response is to show the disagreement with its reasons, not to pick a winner and hide the rest.
        </p>
        <p>
          Three things a reader should hold on to. Weak is not false. Sahih is not the same as binding, since what a hadith means is a further question for jurists. And a famous line can be weak while an obscure one is sound; fame is not a grade.
        </p>
      </Section>

      <Section title="What this means online">
        <p>
          When someone cites a hadith, the useful reply is not “that's fake” or “that's sahih”. It is the chain, the narrators, and who graded it. That reply used to require a library. <Link href="/" className="link">It should require a link.</Link>
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14 border-t border-hairline pt-8 max-w-[70ch]">
      <h2 className="mb-5">{title}</h2>
      <div className="grid gap-4 text-ink-2 [&>p]:max-w-none">{children}</div>
    </section>
  );
}

function RankGlyph({ band }: { band: "sahabi" | "thiqa" | "saduq" | "maqbul" | "daif" | "matruk" | "unknown" }) {
  const map = {
    sahabi: ["ring", "var(--lapis)"],
    thiqa: ["solid", "var(--g-thiqa)"],
    saduq: ["half", "var(--g-saduq)"],
    maqbul: ["hollow", "var(--g-saduq)"],
    daif: ["hollow", "var(--g-daif)"],
    matruk: ["crossed", "var(--g-daif)"],
    unknown: ["dotted", "var(--g-unknown)"],
  } as const;
  const [g, c] = map[band];
  return <Glyph glyph={g} color={c} size={13} />;
}

function Grade({ glyph, color, title, ar, body }: { glyph: "solid" | "half" | "hollow" | "crossed"; color: string; title: string; ar: string; body: string }) {
  return (
    <li className="grid grid-cols-[1.5rem_1fr] gap-3">
      <span className="pt-1.5"><Glyph glyph={glyph} color={color} size={15} /></span>
      <div>
        <div className="text-[1.15rem] text-ink">{title} <span className="arabic text-ink-2 text-[1.2rem]">{ar}</span></div>
        <p className="small text-ink-2 mt-1">{body}</p>
      </div>
    </li>
  );
}
