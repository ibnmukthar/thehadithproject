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
                <span lang="ar" className="arabic text-[1.15rem] text-ink mr-3" style={{ direction: "rtl" }}>{r.ar}</span>
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

      <section className="mt-14 border-t border-hairline pt-8 max-w-[70ch]">
        <details className="group">
          <summary className="cursor-pointer text-ink-2 small">A side note on testimony, and on whether it can be counted</summary>
          <div className="mt-5 grid gap-4 text-ink-2 [&>p]:max-w-none">
            <p>
              Most of what anyone knows, they know because someone told them. History, science, the news, the verdict of a court, your own date of birth: all testimony. Philosophers have argued about how such knowledge is justified since Hume, who held that we trust witnesses only because experience shows testimony and fact usually agree, and Thomas Reid, who answered that trust in what others tell us is an original principle of the mind, limited by experience rather than built from it. C. A. J. Coady's <em>Testimony</em> (1992) opened the contemporary debate. The scholars of hadith were not working on a strange problem; they were working on the general problem, earlier and more systematically than anyone.
            </p>
            <p>
              The founders of probability met the same two questions. Laplace, in his <em>Philosophical Essay on Probabilities</em> (1814), works the case of a fact passed down a chain of twenty witnesses, each with nine chances in ten of speaking truly: it arrives with a probability below one in eight, fading, he says, like light through a series of panes of glass, and he adds that historians had not paid this degradation enough attention. In his chapter on testimonies he shows the opposite effect: two independent witnesses who agree make a fact nearly certain, but only, he is careful to say, if they have no secret agreement. Condorcet had tried in 1784 to measure a historian's credibility as an error rate, and a colleague objected that this was a usurpation of criticism by arithmetic.
            </p>
            <p>
              Both questions are the daily business of the hadith critic. The first is why the discipline prized a short chain with few links and devoted a chapter of its manuals to "high" and "low" chains, and why every added narrator is examined rather than assumed. The second is the whole theory of corroboration. Al-Khatib al-Baghdadi (d. 463 AH) defines the mass-transmitted report (mutawatir) not by a count but by the impossibility of collusion among its transmitters; Ibn Hajar says there is no sense in fixing a number, and lists the numbers people had proposed; al-Ghazali says the threshold at which accumulating reports turn into certain knowledge is known to God and not to us, as we know bread satisfies without knowing the least quantity that would. His description of the process is almost Laplace's: the first report stirs a supposition, the second and third confirm it, and it keeps strengthening until it is necessary knowledge.
            </p>
            <p>
              Here the parallel should stop, and the discipline is wiser than the arithmetic. The critics never assigned a number to a narrator, because reliability is not a fixed fraction: it varies by teacher, by period, and by whether a man narrated from his book or his memory. A naive multiplication would make every long chain worthless and every heap of weak routes strong; the critics did neither. They read a chain person by person, and they admitted corroboration only when the routes were genuinely independent and their weakness light, which is exactly what the two contested examples on this site show. They also kept the registers apart: certainty from mass transmission is a matter of settled custom, not calculation, and most hadith are single-narrator reports that yield probable knowledge, which the law treats as sufficient to act on. That is graded confidence, stated explicitly, seven centuries before anyone had a theory of it. We are not aware of a peer-reviewed probabilistic model of chain corroboration, and the best-known modern use of probability language in this field (Hallaq, 1999) uses it informally. This project uses arithmetic for nothing more than it should: counting routes, checking dates, and drawing where routes converge. The judgement stays with the scholars.
            </p>
            <p className="tiny text-muted" style={{ maxWidth: "none" }}>
              Sources: <a className="link" href="https://plato.stanford.edu/entries/testimony-episprob/" rel="noopener">Stanford Encyclopedia of Philosophy, "Epistemological Problems of Testimony"</a>; Hume, <a className="link" href="https://davidhume.org/texts/e/10" rel="noopener">Enquiry, section X</a>; Reid, Inquiry (1764) VI.24; Coady, Testimony (Oxford, 1992); Laplace, <a className="link" href="https://www.gutenberg.org/ebooks/58881" rel="noopener">A Philosophical Essay on Probabilities</a>, ch. III and XI; Condorcet, "Application des principes…", Histoire de l'Académie 1784; al-Khatib al-Baghdadi, <a className="link" href="https://shamela.ws/book/13055" rel="noopener">al-Kifaya</a>, on the division of reports; al-Ghazali, al-Mustasfa, on the least number that yields necessary knowledge; Ibn Hajar, <a className="link" href="https://shamela.ws/book/1565" rel="noopener">Nuzhat al-Nazar</a>, on the mutawatir; W. Hallaq, <a className="link" href="https://doi.org/10.2307/1596086" rel="noopener">"The Authenticity of Prophetic Hadith: A Pseudo-Problem"</a>, Studia Islamica 89 (1999).
            </p>
          </div>
        </details>
      </section>

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
        <div className="text-[1.15rem] text-ink">{title} <span lang="ar" className="arabic text-ink-2 text-[1.2rem]">{ar}</span></div>
        <p className="small text-ink-2 mt-1">{body}</p>
      </div>
    </li>
  );
}
