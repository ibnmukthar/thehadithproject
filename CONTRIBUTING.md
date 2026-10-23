# Contributing

The Hadith Project is open in three senses: the code is open source, the data is openly licensed, and the editorial process is public. It is not a wiki. Nothing enters the published record without review by someone qualified in the discipline, and every line must carry a source.

## The fastest way to help: send a correction

If anything on the site is wrong, open an issue with:

1. The page and the exact line (quote it).
2. What it should say.
3. The source: book, edition, volume and page, and a link to a scan or a reliable transcription where one exists.

A correction with a source is the most valuable contribution there is. One without a source will be asked for one.

## How changes are reviewed

- **Narrator records, verdicts and status lines** (`src/data/`): require review by a maintainer with training in hadith sciences. Two reviewers are required for any change to a narrator's band or a hadith's status line. Disagreements are not resolved by edit; they are recorded on the page as a dispute with both positions and their sources.
- **Site code and components** (`src/app/`, `src/components/`, `src/lib/`): ordinary pull-request review.
- **The blueprint and docs** (`docs/`): open to discussion in issues; substantive changes go through a pull request so the history is public.

Reviewer qualifications are stated on the contributors page once the editorial board is formed. Until then, the founding maintainers review everything and say so.

## Adding a hadith

Each hadith lives in one file under `src/data/hadith/`, with its narrators in a narrator file. Follow the shape in `src/data/types.ts`. Required for every entry:

- The Arabic chain and text exactly as in the cited edition, with the edition named in `numbering`.
- The transmission formula on every link.
- For every narrator: Ibn Hajar's Taqrib line (with entry number) or an explicit note that it is not yet entered; the critics' words verbatim with book and page; death year with a note if disputed.
- For every verdict: the scholar, the work, the exact locus, the grade in the scholar's own words, the scope (which sentence, route or the whole text), and the reason.

Run `pnpm lint` and `pnpm build` before opening a pull request.

## Conduct

Disagree about narrators, not about people. Arguments are settled by sources, and where sources disagree, the disagreement is the record.
