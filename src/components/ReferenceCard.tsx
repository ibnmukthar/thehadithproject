"use client";

import { useState } from "react";
import type { Hadith, Narrator } from "@/data/types";
import { HadithChip } from "./GradeMark";
import { ChainStrip } from "./ChainStrip";
import { Wordmark } from "./Wordmark";

/** What a thehadithproject.com link unfurls into when pasted into a feed. */
export function ReferenceCard({ hadith, narrators, url }: { hadith: Hadith; narrators: Record<string, Narrator>; url: string }) {
  const [copied, setCopied] = useState(false);
  const p = hadith.primary;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };
  return (
    <div className="grid gap-3">
      <div className="rounded-[var(--radius-lg)] border border-hairline-strong overflow-hidden bg-page">
        <div className="h-1.5" style={{ background: "var(--lapis)" }} />
        <div className="p-5 grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <Wordmark />
            <HadithChip band={hadith.status.band} label={hadith.status.label} size="sm" />
          </div>
          <p lang="ar" dir="rtl" className="arabic text-[1.45rem] leading-[1.8] text-ink" style={{ maxWidth: "none" }}>{p.matnAr}</p>
          <p className="text-[0.98rem] text-ink-2" style={{ maxWidth: "none" }}>{p.matnEn}</p>
          <div className="small text-ink-2">{p.collection}, {p.number}</div>
          <ChainStrip narration={p} narrators={narrators} dense />
          <div className="tiny text-muted">
            {p.chain.length} narrators · {hadith.verdicts.length} scholarly verdicts on record
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <code className="mono text-[0.82rem] bg-plane border border-hairline rounded px-2 py-1 text-ink-2">{url}</code>
        <button type="button" onClick={copy} className="btn btn-secondary py-1.5 px-3 text-[0.85rem]">
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
