"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { fingerprintInBrowser, normalizeArabic } from "@/lib/normalize";

interface Entry {
  fp: string; // fingerprint of the matn
  cite: string; // e.g. bukhari:1
  url: string; // site path
  label: string;
  study?: string;
}
interface Index {
  generated: string;
  entries: Entry[];
}
interface TextIndex {
  // normalised matn texts for substring matching, keyed by cite
  texts: Record<string, string>;
}

type Result =
  | { kind: "idle" }
  | { kind: "empty" }
  | { kind: "exact"; entries: Entry[]; fp: string }
  | { kind: "partial"; entries: { entry: Entry; where: number; length: number }[]; fp: string }
  | { kind: "none"; fp: string };

/**
 * Verify-a-quote. Everything runs in the browser against two static files
 * generated at build: an index of fingerprints, and (fetched only when an
 * exact match fails) the normalised texts for substring search.
 */
export function VerifyQuote() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Result>({ kind: "idle" });
  const [busy, setBusy] = useState(false);
  const indexRef = useRef<Index | null>(null);
  const textsRef = useRef<TextIndex | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/v0/fingerprints.json")
      .then((r) => r.json())
      .then((j: Index) => {
        indexRef.current = j;
        setReady(true);
      })
      .catch(() => setReady(false));
  }, []);

  async function check() {
    const text = input.trim();
    if (!text) {
      setResult({ kind: "empty" });
      return;
    }
    setBusy(true);
    try {
      const idx = indexRef.current;
      const fp = await fingerprintInBrowser(text);
      const exact = idx?.entries.filter((e) => e.fp === fp) ?? [];
      if (exact.length) {
        setResult({ kind: "exact", entries: exact, fp });
        return;
      }
      if (!textsRef.current) {
        const r = await fetch("/api/v0/texts.json");
        textsRef.current = (await r.json()) as TextIndex;
      }
      const norm = normalizeArabic(text);
      const found: { entry: Entry; where: number; length: number }[] = [];
      if (norm.length >= 12 && idx) {
        const byCite = new Map(idx.entries.map((e) => [e.cite, e]));
        for (const [cite, t] of Object.entries(textsRef.current.texts)) {
          const where = t.indexOf(norm);
          if (where >= 0) {
            const entry = byCite.get(cite);
            if (entry) found.push({ entry, where, length: t.length });
          }
        }
      }
      setResult(found.length ? { kind: "partial", entries: found.slice(0, 50), fp } : { kind: "none", fp });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-5 max-w-[46rem]">
      <label className="grid gap-2">
        <span className="sans text-[0.9rem] font-semibold text-ink">Arabic text to check</span>
        <textarea
          lang="ar"
          dir="rtl"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          className="arabic text-[1.35rem] leading-[1.9] w-full rounded-md border border-hairline-strong bg-page p-3 focus:outline-none focus:ring-2 focus:ring-[var(--lapis)]"
          placeholder="إنما الأعمال بالنيات…"
          style={{ maxWidth: "none" }}
        />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={check} disabled={busy || !ready} className="btn btn-primary">
          {busy ? "Checking…" : "Check against the record"}
        </button>
        {!ready && <span className="tiny text-muted">Loading the index…</span>}
      </div>

      <div aria-live="polite">
        {result.kind === "empty" && <p className="small text-ink-2">Paste some Arabic text first.</p>}
        {result.kind === "exact" && (
          <div className="rounded-[var(--radius-lg)] border border-thiqa p-4 grid gap-2">
            <div className="sans font-semibold text-ink">Matches the record exactly.</div>
            <p className="small text-ink-2" style={{ maxWidth: "none" }}>
              The normalised text has the fingerprint <span className="mono">sha256:{result.fp}</span>, which belongs to:
            </p>
            <ul className="small grid gap-1">
              {result.entries.map((e) => (
                <li key={e.cite}>
                  <Link className="link" href={e.url}>{e.label}</Link> <span className="mono text-muted">thp:{e.cite}</span>
                  {e.study && <> · <Link className="link" href={`/h/${e.study}/`}>studied</Link></>}
                </li>
              ))}
            </ul>
            <p className="tiny text-muted">An exact match means the words are the same once vowel marks and spelling variants are removed. It says nothing about the grade; open the narration for that.</p>
          </div>
        )}
        {result.kind === "partial" && (
          <div className="rounded-[var(--radius-lg)] border border-hairline-strong p-4 grid gap-2">
            <div className="sans font-semibold text-ink">Found inside {result.entries.length === 1 ? "one narration" : `${result.entries.length} narrations`}.</div>
            <p className="small text-ink-2" style={{ maxWidth: "none" }}>Your text is part of a longer narration, or quoted without its first or last words:</p>
            <ul className="small grid gap-1">
              {result.entries.map(({ entry, where, length }) => (
                <li key={entry.cite}>
                  <Link className="link" href={entry.url}>{entry.label}</Link> <span className="mono text-muted">thp:{entry.cite}</span>
                  <span className="text-muted"> · starts {Math.round((where / Math.max(1, length)) * 100)}% into the text</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {result.kind === "none" && (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-hairline-strong p-4 grid gap-2">
            <div className="sans font-semibold text-ink">No match on record.</div>
            <p className="small text-ink-2" style={{ maxWidth: "none" }}>
              Not found in the narrations on record (fingerprint <span className="mono">sha256:{result.fp}</span>). That does not make it false or weak. It may be from a collection not yet ingested, a paraphrase, a translation back into Arabic, or a well-known saying that is not a hadith. Try a shorter, distinctive phrase from the middle of the text.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
