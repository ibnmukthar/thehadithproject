# Contributing

The Hadith Project is open in three senses: the code is open source, the data is openly licensed, and the editorial process is public. It is not a wiki. Nothing enters the published record without review by someone qualified in the discipline, and every line must carry a source.

You do not need to know git to contribute. There are three doors, in order of how much they ask of you.

## 1. Report a correction (anyone, two minutes)

Every line on the site has a "Report a correction" link. It opens a form, prefilled with the record and the line, asking for what it should say and the source: book, edition, volume and page, or a link to the text. The report becomes a public issue, is read by a reviewer, and is answered in public. You will be credited by the name you give.

A correction with a source is the most valuable contribution there is. One without a source will be asked for one.

## 2. Propose a change to a record (an afternoon)

Every record is a file:

- `data/narrators/<id>.json`: one narrator, in the shape of the classical entry (see [the schema](src/data/schema.ts) and [the research memo](docs/research/rijal-entry-structure.md)).
- `data/hadith/<slug>.json`: one studied hadith, with its four discussions.
- `data/collections/<collection>/books/<book>.json`: the narrations of one book of a collection, with the machine-parsed chains awaiting review.

Open the file on GitHub, press the pencil, make the change, and GitHub opens a pull request for you (it forks the repository on your behalf). The checks run on their own: the record must validate against the schema, chains must name narrators that exist, every verdict must carry a source, and teacher/student links must be reciprocal. The reviewers then read the change on the rendered page, not the raw file.

Required for every entry:

- The Arabic chain and text exactly as in the cited edition, with the edition named in `numbering`.
- The transmission formula on every link.
- For every narrator: Ibn Hajar's Taqrib line (with entry number) or an explicit note that it is not yet entered; the critics' words verbatim with book and page; death year with a note if disputed; the sigla of the books that used him where known.
- For every verdict: the scholar, the work, the exact locus, the grade in the scholar's own words, the scope (which sentence, route or the whole text), and the reason.
- For a machine-parsed chain you have checked: change `chain.status` from `"machine"` to `"reviewed"`, link the names to narrator ids, and say in the pull request which edition you checked against.

Run `pnpm check:data` locally if you can; the same check runs on every pull request.

## 3. Review (named scholars)

Members of the editorial board, listed in [`data/board.json`](data/board.json) and described in [docs/REVIEWERS.md](docs/REVIEWERS.md), approve changes to the record. Approval is written into the record itself as a sign-off block:

```json
"review": {
  "status": "approved",
  "signoffs": [
    { "who": "Name", "role": "reviewer", "date": "2026-10-24", "decision": "approved", "note": "Checked against Tahdhib al-Kamal 23/581." }
  ]
}
```

A pull request that changes a narrator's standing, a hadith's status line, or a scholar's verdict cannot merge without an `approved` sign-off from a board member; the check `scripts/check-signoff.ts` enforces it. Disagreements are not resolved by edit; they are recorded on the page as a dispute with both positions and their sources.

"Validated" (the entry matches the cited source, checked by a trained contributor) and "approved" (a named scholar has reviewed it) are different statuses and are both shown on the page.

## What is where

- Narrator records, studied hadith and collection texts: `data/`.
- Site code and components: `src/app/`, `src/components/`, `src/lib/`. Ordinary pull-request review.
- The blueprint, research memos and plans: `docs/`. Open to discussion in issues; substantive changes go through a pull request so the history is public.
- The static JSON API is generated at build from `data/`; do not edit `public/api`.

## Coming later

A contributor portal with small, well-defined tasks (transcribe a Taqrib entry from a scan, link a name in a chain to a record, enter a verdict with its page) done independently by two people and reconciled by a reviewer, which writes the reviewed result back here as a pull request. The repository stays the only record; the portal is a better pencil.

## Conduct

Disagree about narrators, not about people. Arguments are settled by sources, and where sources disagree, the disagreement is the record.
