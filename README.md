# The Hadith Project

**thehadithproject.com** · Open, verifiable infrastructure for hadith and its sciences.

Hadith is a science of provenance. Every hadith comes with a chain of named people, each one examined, and fourteen centuries of scholarship on whether that chain holds. This project puts that record online: one stable reference for every narration, every narrator's record with the critics quoted, every scholar's verdict with its reason, and chains drawn as graphs anyone can read.

This repository holds the public site and the prototype dataset. The thinking behind it is in [docs/BLUEPRINT.md](docs/BLUEPRINT.md); the survey of existing data and tools is in [docs/research/data-landscape.md](docs/research/data-landscape.md); the pre-launch authenticity audit, with every claim's status and every correction made, is in [docs/research/audit-2026-10-23.md](docs/research/audit-2026-10-23.md).

## What is here

- **A landing page** that states the mission, vision and goals, explains why hadith authentication is a method and not a mood, and shows a chain examined live.
- **Three worked hadith**, one of each kind, with every link examined:
  - *Actions are by intentions* (Sahih al-Bukhari 1): sahih, and single-stranded at its root, which is the lesson.
  - *Leaving what does not concern you* (Jami' al-Tirmidhi 2317): disputed, with a thousand years of argument about one narrator, shown rather than resolved.
  - *Seek knowledge even in China* (al-Khatib, al-Rihla 1): weak, with the critics' words on the narrator who carries it, and the separate, better-attested sentence it is usually attached to.
- **Narrator records** quoting Ibn Hajar's Taqrib and the earlier critics, with sources.
- **Three depths** of the same page: reader, student, researcher.
- **Visualisations**: the isnad as a vertical chain with transmission formulae and fan-out; lifespans on a hijri axis showing teacher–student overlap.
- **Reference cards**: what a link unfurls into when pasted into a feed.
- **A static JSON API** under `/api/v0/` with the same records the pages render.

Nothing on the site is a verdict of the project. Every grade shown is attributed to the scholar who gave it, with the source. The demo data was hand-checked against primary and secondary sources (sunnah.com, Shamela, Wikisource transcriptions of Fath al-Bari, the Taqrib and Jami' al-Ulum, dorar.net, and two published studies of the Tirmidhi hadith's routes, by A. al-Aqla and by A. al-Ghamdi), then independently re-audited; items that could not be confirmed are left out or marked.

## Running it

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000. `pnpm build` produces a fully static site in `out/` (the API JSON is regenerated into `public/api/` first). Deploy `out/` to any static host; Cloudflare Pages and Vercel both work with the defaults, and `public/_headers` sets content types for the OpenGraph image and the JSON API on Cloudflare Pages.

If your shell exports a `NODE_ENV` of its own (for example `development`), unset it before building, or run `NODE_ENV=production pnpm build`; a mismatched value makes the production export load the wrong React build and fail with a `useOptimistic` error.

Deployment steps for Cloudflare (recommended), Vercel and others are in [docs/DEPLOY.md](docs/DEPLOY.md).

## Structure

```
src/app/              pages (App Router, static export)
  page.tsx            landing page
  science/            why hadith is a science
  explore/            the three worked hadith
  h/[slug]/           hadith pages
  narrator/[id]/      narrator records
  blueprint/          renders docs/BLUEPRINT.md
  contribute/
src/components/       IsnadGraph, LifespanTimeline, HadithView, NarratorCard, VerdictTable, ReferenceCard…
src/data/             types, narrator records, hadith records (one file per hadith)
src/lib/              band definitions, Arabic normalisation and fingerprinting
scripts/build-api.ts  emits public/api/v0/*.json
docs/BLUEPRINT.md     the full design: identifiers, graph, rijal, verdicts, governance, roadmap
docs/research/        research memos
```

## Data model in brief

- **Narration**: one text through one chain in one book, cited as `thp:<collection>:<number>` against a declared canonical numbering, with a SHA-256 fingerprint of the normalised Arabic text.
- **Hadith** (family): the cluster of narrations carrying the same report; curated, not hashed.
- **Narrator**: a record with dates, region, Taqrib generation, a reliability band derived from Ibn Hajar's rank, and the critics' words verbatim with sources.
- **Transmission**: an edge between two narrators inside one narration, carrying the formula used (haddathana, akhbarana, sami'tu, 'an).
- **Verdict**: a scholar, a work, a grade in their words, the scope, and the reason.

Bands are always shown with a label and a distinct glyph, never colour alone.

## Contributing

Corrections with sources are the most valuable contribution. Open an issue with the page, the line and your source. See [/contribute](https://thehadithproject.com/contribute/) for how scholars, developers, translators and institutions can help.

## Open source, in what sense

- **Code** is open source under the Apache License 2.0 (`LICENSE`).
- **Data** is openly licensed under CC BY 4.0 (`LICENSE-DATA.md`): anyone may reuse it with attribution.
- **The editorial process is public but not open-edit.** Corrections arrive as issues and pull requests; changes to narrator records, verdicts and status lines are merged only after review by maintainers trained in the discipline, and disputes are recorded rather than overwritten. See `CONTRIBUTING.md`.

Modern copyrighted translations are not redistributed; the English renderings in the prototype are the project's own.
