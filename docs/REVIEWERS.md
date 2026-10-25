# Reviewers and sign-off

## The board

The editorial board is the list in [`data/board.json`](../data/board.json). Each entry names a person, their role (`editor` or `reviewer`), what they review (narrators, verdicts, texts, chains, explanation), and the date they joined. The list is public, the page `/about/` renders it, and a change to it is itself a pull request reviewed by an existing editor.

Roles:

- **Editor**: founding maintainers. Approve code, docs and data; add reviewers.
- **Reviewer**: a person trained in hadith sciences, named with their qualification. Approves changes to the record in their area.

Until two reviewers have agreed to serve, the founding editor approves everything and the site says so.

## What needs a sign-off

Any pull request that changes, in `data/`:

- a narrator's `band`, `taqrib`, `verdicts`, `tadlis`, `ikhtilat`, `notHeardFrom`, `rumuz`, `teachers` or `students`;
- a hadith's `status`, `verdicts`, `primary.chain`, `primary.links`, `also`, `subtleties` or `explanation`;
- a collection narration's `chain` or `split` when its status becomes `reviewed`.

The check `scripts/check-signoff.ts` runs on pull requests. It lists the changed data files, and for each one that touches the fields above requires a `review.signoffs` entry with `decision: "approved"` whose `who` matches a board member whose `reviews` covers that kind of record. Code and docs changes do not need a sign-off.

## How to sign off

Reviewers review on the rendered page (the pull request's preview build, or a local `pnpm dev`), not on the raw JSON. To approve, add to the record:

```json
"review": {
  "status": "approved",
  "signoffs": [
    { "who": "Your name as in board.json", "role": "reviewer", "date": "YYYY-MM-DD", "decision": "approved", "note": "What you checked and against which edition." }
  ]
}
```

To ask for changes, use `"decision": "changes-requested"` with a note; the check fails until an approval is present. A contributor who has verified an entry against its source but is not a board member uses `"decision": "validated"` and `"role": "contributor"`; the record then shows as validated, not approved.

## Principles for reviewers

1. The source decides. A line that cannot be traced to a book, edition and page does not enter.
2. Quote the critic, then paraphrase. The Arabic goes in `ar`, the English in `en`, the locus in `source`.
3. Scope every verdict. Which narration, which route, which sentence.
4. Record disagreement; never average it.
5. Machine output is a proposal. A parse, a split or a match is approved only once you have read it against the edition.
