import { Glyph } from "./GradeMark";

const CONDITIONS = [
  {
    title: "An unbroken chain",
    ar: "اتصال السند",
    what: "Every narrator heard from the one before, all the way back to the source.",
    modern: "A chain of custody with no gap in which the evidence could have been swapped.",
  },
  {
    title: "Upright narrators",
    ar: "عدالة الرواة",
    what: "Each person in the chain was known for honesty and religious integrity.",
    modern: "A witness whose character was vetted by people who knew them.",
  },
  {
    title: "Precise narrators",
    ar: "ضبط الرواة",
    what: "Each transmitted accurately, from memory or from a trustworthy written copy.",
    modern: "A witness whose recall was tested against everyone else's.",
  },
  {
    title: "No anomaly",
    ar: "عدم الشذوذ",
    what: "The report does not contradict what more reliable narrators transmitted.",
    modern: "A result that is not an outlier against stronger data.",
  },
  {
    title: "No hidden defect",
    ar: "عدم العلة",
    what: "Experts who compared every route found no subtle flaw.",
    modern: "Peer review by the people who have read every other copy.",
  },
];

export function Conditions() {
  return (
    <ol className="relative grid gap-8 md:grid-cols-5 md:gap-5" aria-label="The five conditions of a sahih hadith">
      <div aria-hidden="true" className="hidden md:block absolute left-[10%] right-[10%] top-[7px] h-px bg-hairline-strong" />
      {CONDITIONS.map((c) => (
        <li key={c.title} className="relative md:pt-7">
          <span className="absolute left-0 top-0 md:left-1/2 md:-translate-x-1/2 bg-page px-0.5">
            <Glyph glyph="solid" color="var(--lapis)" size={15} />
          </span>
          <div className="pl-7 md:pl-0 text-left md:text-center">
            <div className="sans font-semibold text-ink text-[0.98rem]">{c.title}</div>
            <div className="arabic text-ink-2 text-[1.15rem] leading-snug text-left md:text-center" style={{ direction: "rtl" }}>{c.ar}</div>
            <p className="small text-ink-2 mt-2" style={{ maxWidth: "none" }}>{c.what}</p>
            <p className="tiny text-muted mt-2" style={{ maxWidth: "none" }}>{c.modern}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
