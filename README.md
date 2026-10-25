# The Hadith Project

**thehadithproject.com** · Open, verifiable infrastructure for hadith and its sciences.

Hadith is a science of provenance. Every hadith comes with a chain of named people, each one examined, and fourteen centuries of scholarship on whether that chain holds. This project puts that record online: one stable reference for every narration, every narrator's record with the critics quoted, every scholar's verdict with its reason, and chains drawn as graphs anyone can read.

This repository holds the public site and the public record. The thinking behind it is in [docs/BLUEPRINT.md](docs/BLUEPRINT.md); the phase-2 plan is in [docs/plans/phase-2.md](docs/plans/phase-2.md); research memos (data landscape, the anatomy of a classical narrator entry, contribution models, the pre-launch audit) are in [docs/research/](docs/research/).

## What is here

- **The record, as files.** `data/narrators/*.json` (one narrator each, in the shape of the classical entry), `data/hadith/*.json` (one studied hadith each, in the four discussions of a hadith class), `data/collections/<id>/` (a whole collection: every narration with the standard numbering, a text fingerprint, and a machine-parsed chain labelled as such until reviewed). Every file is validated against [`src/data/schema.ts`](src/data/schema.ts) at build.
- **Two views of every hadith.** Reader: the text, what it means, whether it is sound. Researcher: the chain person by person with the subtleties a trained reader sees, where the report travelled on a map and through the centuries, whether the narrators' lives overlapped, where else it is recorded and how the routes compare, who graded it and why, what it means, and the identifiers. Each section opens and closes and remembers the choice.
- **Visualisations**: the isnad as a vertical chain with transmission formulae and fan-out; the journey map with a hijri-year scrubber; lifespans on a hijri axis; competing routes side by side and merged into one corroboration tree with the pivot narrator marked; the narrator's teachers and students. Every diagram has a table view.
- **Browse**: collections, books, narrations; narrators; the studied hadith as a track.
- **Verify a quote**: paste any Arabic text and check it against every narration on record, in the browser.
- **Reference cards** and a **static JSON API** under `/api/v0/` with the same records the pages render.
- **A correction link on every line**, which opens a prefilled public issue.

Nothing on the site is a verdict of the project. Every grade shown is attributed to the scholar who gave it, with the source. Machine output (parsed chains, isnad/matn splits, text matches) is labelled as such until a person has checked it.

## Running it

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000. `pnpm build` validates the record (`pnpm check:data`), regenerates the API into `public/api/`, and produces a fully static site in `out/`.

If your shell exports a `NODE_ENV` of its own (for example `development`), unset it before building, or run `NODE_ENV=production pnpm build`; a mismatched value makes the production export load the wrong React build and fail with a `useOptimistic` error.

To re-ingest a collection: `pnpm tsx scripts/ingest-bukhari.ts` (sources are downloaded into `sources/`, which is not committed). Deployment is described in [docs/DEPLOY.md](docs/DEPLOY.md).

## Structure

```
data/                 the public record (JSON, validated against src/data/schema.ts)
  narrators/          one file per narrator
  hadith/             one file per studied hadith
  collections/<id>/   collection.json + books/NNN.json
  board.json          the editorial board
src/app/              pages (App Router, static export)
  page.tsx            landing
  about/ science/ explore/ studies/ narrators/ verify/ contribute/ blueprint/
  h/[slug]/           studied hadith
  narrator/[id]/      narrator records
  collection/[id]/    a collection, and [book]/ its books
  n/[id]/[n]/         one narration of a collection
src/components/       HadithView, IsnadGraph, JourneyMap, LifespanTimeline, RouteComparison, CorroborationTree, NarratorCard, NarratorNetwork, VerdictTable, SubtletiesStrip, Disclosure, VerifyQuote…
src/lib/              bands, places, subtleties, isnad parsing, Arabic normalisation and fingerprinting
scripts/              check-data (schema + integrity), check-signoff (PR guard), build-api, ingest-bukhari
docs/                 BLUEPRINT.md, REVIEWERS.md, DEPLOY.md, plans/, research/
```

## Data model in brief

- **Narration**: one text through one chain in one book, cited as `thp:<collection>:<number>` against a declared canonical numbering, with a SHA-256 fingerprint of the normalised Arabic text.
- **Family**: the cluster of narrations carrying the same report across collections. For the six books, al-Mizzi's Tuhfat al-Ashraf entry number is the intended key.
- **Narrator**: the classical entry as a record: names, dates, places, teachers and students with the book each link occurs in, the Taqrib line and rank, the sigla of the books that used him, the critics' words verbatim with sources, and the specialist notes (tadlis, late-life confusion, non-hearing, orthography).
- **Transmission**: an edge between two narrators inside one narration, carrying the formula used (haddathana, akhbarana, sami'tu, 'an).
- **Verdict**: a scholar, a work, a grade in their words, the scope, and the reason.
- **Review**: a sign-off block on any record, naming who validated or approved it and when.

Bands are always shown with a label and a distinct glyph, never colour alone.

## Contributing

Three doors: report a correction from any line of the site; propose a change to a record file (GitHub opens the pull request for you; the checks validate it); review, if you are on the editorial board. See [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/REVIEWERS.md](docs/REVIEWERS.md).

## Open source, in what sense

- **Code** is open source under the Apache License 2.0 (`LICENSE`).
- **Data** is openly licensed under CC BY 4.0 (`LICENSE-DATA.md`); the Arabic text of the collections comes from the Open Hadith Data project under the ODbL, see each collection's README.
- **The editorial process is public but not open-edit.** Changes to the record merge only with a sign-off from a named reviewer; disputes are recorded rather than overwritten.

Modern copyrighted translations are not redistributed; the English renderings are the project's own.
