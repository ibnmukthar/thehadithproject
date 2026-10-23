import type { Metadata } from "next";
import { HADITH, narratorsFor, fingerprintOf } from "@/data";
import { ExploreSwitcher } from "@/components/ExploreSwitcher";

export const metadata: Metadata = {
  title: "Explore",
  description: "Three hadith, every link examined: one sahih, one hasan, one weak.",
};

export default function ExplorePage() {
  const items = HADITH.map((h) => ({ hadith: h, narrators: narratorsFor(h), fingerprint: fingerprintOf(h) }));
  return (
    <div className="container pt-10 pb-16">
      <div className="max-w-[60ch] mb-8">
        <h1 className="text-[2.2rem] sm:text-[2.8rem]">Three chains, examined</h1>
        <p className="mt-4 text-ink-2">
          One hadith of each kind. The point is not the grade; it is that you can see where the grade comes from.
        </p>
      </div>
      <ExploreSwitcher items={items} />
    </div>
  );
}
