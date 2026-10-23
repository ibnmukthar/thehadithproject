"use client";

import { useState } from "react";
import type { Hadith, Narrator } from "@/data/types";
import { HadithView } from "./HadithView";
import { HadithChip } from "./GradeMark";

interface Item { hadith: Hadith; narrators: Record<string, Narrator>; fingerprint: string }

export function ExploreSwitcher({ items }: { items: Item[] }) {
  const [i, setI] = useState(0);
  const cur = items[i];
  return (
    <div>
      <div role="tablist" aria-label="Choose a hadith" className="flex flex-wrap gap-2 mb-10 border-b border-hairline pb-4">
        {items.map((it, k) => (
          <button
            key={it.hadith.slug}
            role="tab"
            aria-selected={i === k}
            onClick={() => setI(k)}
            className={`sans text-left rounded-md border px-3.5 py-2.5 transition-colors ${i === k ? "border-ink bg-page" : "border-hairline hover:border-hairline-strong text-ink-2"}`}
          >
            <div className="text-[0.95rem] font-medium text-ink">{it.hadith.title}</div>
            <div className="mt-1 flex items-center gap-2 tiny text-muted">
              <HadithChip band={it.hadith.status.band} label={it.hadith.status.label} size="sm" />
              <span>{it.hadith.primary.collection} {it.hadith.primary.number}</span>
            </div>
          </button>
        ))}
      </div>
      <HadithView key={cur.hadith.slug} hadith={cur.hadith} narrators={cur.narrators} fingerprint={cur.fingerprint} initialMode="student" embedded />
    </div>
  );
}
