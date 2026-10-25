# Phase 2 plan: from prototype to platform

Written 23 October 2026, after the prototype launched and the first round of feedback. This is a plan, not a changelog: nothing in it has been built. It answers six questions that came back from the first readers, cross-checks the instincts behind them against measurements of the live site, and sets an order of work. Everything here is open to argument.

## 0. The cross-check: what the feedback got right, and where to push back

### "The landing page has a bit too much detail"

Right, and measurably. The live landing page is 2,500 words, which is longer than the science explainer (2,077). The embedded demo accounts for about 1,150 of those words, and the mission, goals, principles and roadmap blocks for another 650. A landing page whose job is to make a stranger believe and want in should be a few hundred words and mostly visual.

What to do:

- Keep the living chain in the hero. It is the thing people respond to.
- Keep the five conditions as a visual strip, with one sentence each, nothing more.
- Replace the full embedded demo with one card: the chain graph of Bukhari 1, two lines, and a button "Open the full record". The demo becomes a door, not a room.
- Replace the mission, goals, principles and roadmap sections with three doors: Explore (the hadith), Why it is a science (the explainer), About (mission, goals, principles, road, people). The About page is new and holds everything that moved.
- Keep "One link that ends the argument" but as a single image of the reference card with one sentence.
- Target: under 700 words, five screens on a phone, two of them visual.

### "Still a lot of text here and there"

Partly right. Two kinds of text are on the site. Text that is the record (a critic's words, a verdict's reason, a formula on a link) must stay; it is the product. Text that frames the record (the paragraph under every section heading explaining what the section is) can go behind a disclosure. A hadith page is 1,400 words in researcher mode. The target is about 900 with the framing paragraphs collapsed to one line each and a "why this matters" toggle, and about 250 in reader mode.

### "Two views, not three"

Right. The student tier was a subset of the researcher tier, and a three-way toggle forces a choice before anyone has read a word. Two views: **Reader** (text, meaning, grade, chain strip, one-sentence status) and **Researcher** (everything). Inside Researcher, progressive disclosure replaces the third tier: chain and verdicts open by default; formulae, lifespans, parallel narrations, route comparison, vocabulary and identifiers each behind their own toggle, remembered per visitor. This gives the student what the middle tier gave without a third mode. The toggle is renamed from "Reader / Student / Researcher" to "Reader / Researcher" and the default stays Reader for first-time visitors.

### "Check whether there is a lot of white"

There is, and it is structural rather than tonal. Each section carries up to 104px of padding top and bottom on desktop, and there are twelve sections, so roughly a third of the landing page's height is padding. The fix is not a palette change: cut section padding by about a third, merge the "problem" section into the hero sub-copy, and remove the alternating plane backgrounds where they separate nothing. Colours, type and the lapis-and-ink identity stay exactly as they are. People like it; nobody is touching it.

### "How do we take the visualisations to the next level?"

See section 2. The short answer: the next level is not a fancier chain diagram. It is drawing the things the discipline already looks at and the site does not yet show: where a hadith travelled, where routes converge, and the "subtleties" scholars read off a chain.

### "Should the maths come in?"

The side note on the science page is the right size for it, and the research behind it says why it should stay small: the critics did not assign numbers to narrators and were explicit that the threshold of certainty cannot be counted. Counting routes, checking dates and drawing convergence is arithmetic the project already does. Anything that produces a number resembling a grade is off the table. Nothing more to add here.

## 1. The page model: your teacher's four discussions

The class notes for Sahih al-Bukhari (the teacher's hadith 1 to 13, numbered by course sequence rather than by al-Bukhari's numbering; the mapping is in `docs/research/class-notes/INDEX.md`) use one structure for every hadith, and it is a better model for the hadith page than the one the prototype grew into. Each hadith is studied in four discussions:

1. **Takhrij.** Every place the hadith appears in al-Bukhari, with the chain and wording of each, then Muslim, Abu Dawud, al-Nasa'i, al-Tirmidhi, Ibn Majah, Malik, Ahmad, al-Tayalisi and others, noting wording differences, chain switches (the letter ح), whose wording is used when chains converge, and where a narrator known for ambiguous formulae states explicit hearing in another route.
2. **Biographies of the narrators**, from the compiler's teacher down to the Companion, each with: full name and lineage, kunya, title, attributions, client status; who he narrated from and who narrated from him; the critics' statements with the book each comes from; the Taqrib line; death-date variants; which of the six books used him; and, for a Companion, his hadith counts (total, agreed upon, Bukhari only, Muslim only) and the number in al-Bukhari.
3. **Subtleties of the chain** (lata'if al-isnad): the observations a trained reader makes on sight. Across the six notes these include: every narrator used by all six compilers (or which ones were not); a Successor narrating from a Successor; regional clusters (an all-Basran chain, four consecutive Kufans, three narrators from Marw); clients versus Qurashis; a four-link chain (ruba'i); a mukhadram; a narrator known by a title (al-A'mash, Abdan); a kunya that matches the father's name; two narrators who both practised tadlis and where one states hearing explicitly; a Successor who often sent reports back (mursal); the sabiq and lahiq (two students of one teacher who died 110 years apart); complete and partial corroboration and witnesses (i'tibar); whose words the opening sentence is; the setting the Companion heard it in, as evidence of precision; and even that the narrators' ages descend down the chain.
4. **Explanation**: the words, the grammar, Ibn Hajar's commentary, the creed points, and a numbered list of what the hadith teaches and what law is drawn from it.

The prototype already has most of (1), (2) and the verdicts; it has nothing of (3) as a system and only a hand-written "what this chain teaches" for (4). The plan adopts the four discussions as the skeleton of every hadith page:

| Discussion | On the site today | In phase 2 |
|---|---|---|
| Takhrij | "The same report elsewhere", a list of cites | A first-class section with each parallel's chain and wording difference, feeding the corroboration tree |
| Biographies | Narrator cards with Taqrib line and critics | The full classical entry (section 5), including rumuz and Companion counts |
| Subtleties | Four hand-written lessons | Computed from the data and drawn on the chain (section 2.2), with hand-written notes where a pattern needs a scholar |
| Explanation | Takeaway and context | A sourced "meaning and lessons" section, clearly labelled as commentary, with the commentary it comes from named (Fath al-Bari first) |

The site should also say, on each worked hadith, "studied with" and credit the class if the teacher agrees, because the worked studies are the closest thing to a syllabus the site has.

## 2. Visualisations: what to bring to life, in order

Every diagram keeps a table view and a one-sentence conclusion in text; that policy is already in place.

### 2.1 The journey of a hadith (new, highest value)

A map of the Islamic world with the chain drawn across it as a path through the narrators' cities and a time scrubber along the bottom in hijri years: the hadith of intentions leaves Madinah with Umar, stays in Madinah for three generations, goes to Makkah with Sufyan, and arrives in Bukhara with al-Bukhari two centuries later. The China hadith's second route goes Madinah to Egypt to Kufa to Nishapur to Baghdad. Nothing on the site makes the transmission feel real the way this will, and the data already exists for every narrator (region and dates). Cost: a static SVG map of about a dozen cities, positions by hand, no map library. Mobile: the map scrolls horizontally with a table beneath.

### 2.2 Subtleties as badges and overlays (new, cheap, distinctive)

Compute the lata'if from the narrator records and show them as small badges on the chain graph and as a strip beneath it: "Four links to the Prophet ﷺ (one of al-Bukhari's ruba'iyyat)", "All four narrators Basran", "Successor from Successor", "Two narrators known for tadlis; explicit hearing recorded in Musnad Ahmad 1732", "Kunya matches the father's name". Regional clusters colour the node ring by city. Fields required: region, generation, client status, kunya, father's name, title, tadlis rank, rumuz, and the takhrij links. Patterns that need a scholar's eye (whose words the opening is; the precision inference from the setting) stay hand-written and attributed.

### 2.3 The corroboration tree (i'tibar) (the scholarly centrepiece)

For a hadith family, merge every route from every collection into one tree from the Prophet ﷺ down, with the pivot narrator where routes converge marked, single-strand segments drawn thin, and each collection's narrations as leaves. This is the diagram the discipline actually works with (Juynboll's common-link diagrams are a Western version of it), and it is what the route-comparison cards approximate today. First step at low cost: arcs on the existing chain for the other routes of the same hadith. Full version once takhrij entries carry complete chains.

### 2.4 Narrator network (for narrator pages)

Teachers above, students below, on generation rings, from the "narrated from / narrated by" lists in the classical entries. Click to walk the network. Rings by generation rather than a force layout, so it stays legible and screen-reader friendly.

### 2.5 Verify a quote (the feature that pays for the rest)

A single input: paste any Arabic text and the site fingerprints it, matches it to the record, and returns the card. On the landing page this replaces a paragraph of explanation with a thing people can try. It is only convincing once a whole collection is in, so it ships with Bukhari (section 3).

### 2.6 Later

A whole-collection overview (every narration in al-Bukhari as a field of dots, filterable by chain length, Companion and region); scrollytelling for the reader view (one link highlighted per step as you scroll); and a Sankey-style corroboration view once link multiplicities exist. Radial "generation ring" views of whole collections are impressive and nearly unreadable; skip.

## 3. Building it so it scales: what Explore becomes

Today Explore is three worked examples. The target is a site where every narration of the six books has a page and the worked examples are a curated learning track inside it.

### 3.1 Site structure

- `/collections` → `/collection/bukhari` → book → chapter → `/n/bukhari/1` (a narration page: text, chain, narrators, verdicts, parallels, subtleties).
- `/hadith/<family>` (a family page: every narration of the same report across collections, the corroboration tree, the scholars' verdicts on the whole).
- `/narrator/<id>` (the classical entry, the network, every narration the person carries).
- `/search` (lexical with proper Arabic normalisation; verify-a-quote; later, search by meaning labelled as retrieval).
- `/studies` (the worked hadith, in the four-discussion form, as a track to follow).
- `/about` (mission, goals, principles, road, people, licences).

### 3.2 Data pipeline, in the order the data allows

1. **Texts.** The nine books in Arabic from Open-Hadith-Data (ODbL). Bukhari first.
2. **Numbering.** Adopt the reference numbers the site already declares; build the crosswalk from the fawazahmed0 mirror and sunnah.com's reference lookup; never store in-book numbers.
3. **Chains parsed.** Train on Sanadset's tagged chains and the LK corpus's hand-checked Bukhari split; every parse is a proposal until a person confirms it (section 4).
4. **Narrator authority file.** Bootstrap from the Multi-IsnadSet (Muslim, with ids) and Sanadset; then transcribe the Taqrib entry by entry as micro-tasks, and the Tahdhib fields after.
5. **Verdict labels**, then reasons entered from the books for the most-cited hadith first.
6. **Families.** Al-Mizzi's Tuhfat al-Ashraf numbers every hadith of the six books and their appended works (19,626 entries) by Companion and then by the narrator from him; adopt its entry number as the family key for the six books (section 5).
7. **Subtleties computed** from 3 and 4.

### 3.3 Storage and serving

Git stays the single public record: one file per narration, narrator and family, reviewed through pull requests. A build step compiles the files into SQLite. The site moves from a static export to server rendering on Cloudflare Workers with D1 (the compiled database) and R2 (scans), because a static export of forty thousand pages is a multi-gigabyte deploy with a slow build, while a Worker renders any page from the database on demand and pre-renders the popular ones. The current Next.js code carries over; the deployment target changes. The static JSON API becomes a real one on the same database. Search uses the database's full-text index first; a vector index later.

## 4. How people contribute, and how it stays open

The question was: does everything go through GitHub, or is there a portal for people who are not technical, and how can that be open source? The research surveyed how Wikidata, OpenStreetMap, Zooniverse, Wikisource, iNaturalist, Wikipedia's pending changes, Pleiades, Syriaca and Papyri.info handle exactly this, and how Islamic-studies projects (sunnah.com's corrections endpoint, Tarteel's Quranic Universal Library, Quran.com's feedback, OpenITI) do. The closest precedent is Papyri.info's editorial system: contributors work in a web editor, an editorial board votes, a finaliser commits, and git holds the only public record with every rejection retained. The survey, with a comparison table and the micro-task designs, is in `docs/research/contribution-models.md`.

The model for this project:

**Three roles, three doors.**

- **Reporter**: anyone, no account. Every line on the site gets a "Report a correction" link, prefilled with the record and the line, asking for the proposed value, a reason and a source. The report is stored and mirrored as a public GitHub issue so it is auditable, and a public page shows its status. (OpenStreetMap notes; Quran.com's tracked reports, but visible.)
- **Contributor**: an email login, no GitHub. Micro-tasks in a portal: transcribe a Taqrib entry from a scan; link a name in a chain to a narrator record; enter a scholar's verdict with the page reference and a scan crop; check a parallel narration. Each task is done independently by two or three people and becomes "validated" when they agree; disagreements go to a reviewer with all versions side by side. (Zooniverse's retirement rules; Wikisource's rule that the validator must be a different person.)
- **Reviewer**: a named member of the editorial board. Reviews in the portal on the rendered record, not a JSON diff, and approves. Approval writes a sign-off block into the record (who, role, date, decision, note) and the portal, acting as a GitHub App, opens a pull request into the public repository with the evidence and the sign-off; a check refuses to merge any data change without a sign-off from someone on the board list. "Validated" (matches the source, by trained volunteers) and "approved" (by a named scholar) stay distinct statuses, a lesson from Wikipedia's flagged revisions.

**Why this is still open source.** The repository remains the only record and stays public; every change arrives as a pull request anyone can read; contributors are credited in the commit even without GitHub accounts; raw submissions and votes are published periodically so the reasoning behind each decision is visible; rejected proposals are kept, not deleted. Nobody has to know git to contribute, and nobody can change the record without it being visible.

**How to get there in steps.** Phase A, cheap and immediate: a "Report a correction" link on every line that opens a prefilled GitHub issue form, and Decap CMS's editorial workflow for the board's own editing (one entry, one pull request, with a rendered preview). Phase B: the portal with contributor login, the three micro-tasks, and the GitHub App that writes reviewed pull requests. Phase C: published submission exports and reviewer profiles.

## 5. Narrator records: the classical entry as the schema

The research read al-Mizzi's own account of how he built Tahdhib al-Kamal, followed one narrator (Qurra ibn Abd al-Rahman) through five works, and transcribed Ibn Hajar's definitions. The full memo is in `docs/research/rijal-entry-structure.md`. Three findings change the data model.

**The classical entry is already a graph with provenance on every edge.** Al-Mizzi lists each narrator's teachers and students alphabetically, and marks *each link* with the siglum of the book in which that specific transmission occurs, "so that every entry bears witness to the others". That is exactly the project's "transmission as event" model, six centuries early, and it means the narrator file should store teacher and student links as typed edges with sources, not as prose, and should check reciprocity (if A lists B as teacher, B must list A as student) as a build-time integrity test.

**The entry has a fixed anatomy, and the site should mirror it field for field.** In order: entry number; sigla (which of the six books and their appended works used him); name, full lineage, tribal and geographic attributions, kunya with variants, title, client status, origin; teachers; students; the critics' verdicts, each with its chain of attribution ("al-Juzajani, from Ahmad: very objectionable in hadith") and the book it is quoted from; listings in the registers of the reliable and the weak; death-date variants, each attributed, with the century implied by the generation; and the closing sentence stating who narrated from him, with its qualifiers ("Muslim, paired with another"; "in the corroborations"; "through an intermediary"). The abridgements layer on top: Ibn Hajar's Tahdhib keeps every verdict and marks his additions with "I say"; the Taqrib compresses to one line (name, grading term, generation, death year, sigla); al-Dhahabi's Kashif to one line with two teachers and two students; the Mizan adds his own verdict and a sample objectionable hadith. The record therefore needs: the Taqrib term and rank (1 to 12); the Taqrib generation (1 to 12); al-Dhahabi's verdict; the Tahrir's revised grade where it differs (and the published rebuttal of it); the full siglum set; and a provenance tag on every line saying which layer it came from.

**Specialist works add fields that no aggregator has.** Tadlis rank (one to five, with the type and who said so) from Tabaqat al-Mudallisin; confusion in later life (when, cause, who heard before, who after, who both, disputes) from al-Kawakib al-Nayyirat and al-Ightibat; "did not hear from" pairs with the authority and any counter-evidence from Ibn Abi Hatim's Marasil, al-Ala'i and Ibn al-Iraqi; name orthography spelled letter by letter and the homograph group from Tabsir al-Muntabih and al-Mu'talif; for Companions, Ibn Hajar's four classes in al-Isaba (attested companionship; born in the Prophet's lifetime; mukhadram who never met him; listed by error). These are the fields that make the "subtleties" computable and the continuity and tadlis flags honest.

The proposed record has 29 fields; the memo lists each with its Arabic name and source. The sigla key (ع، خ، خت، بخ، عخ، ي، ر، م، مق، د، مد، قد، خد، ف، صد، ل، كد، ت، تم، س، سي، ص، عس، كن، ق، فق and the ٤ for the four Sunan) goes into the controlled vocabulary, with al-Mizzi's own note that two of the appended works were only partly available to him.

**A family identifier already exists: Tuhfat al-Ashraf.** Al-Mizzi's index of the six books and their five appended works arranges every hadith by Companion, then by the narrator from him, and numbers the entries 1 to 19,626; each entry lists every place the hadith occurs with the chain down to the pivot narrator. The numbering is fixed in the standard edition, is carried by the digitised texts, and is already printed as a cross-reference in modern editions of the Sunan. It is the right key for the family layer of the six books, with three caveats the memo documents: one entry bundles many loci (so per-collection cites stay on each narration), coverage stops at the six plus appendages (Ibn Hajar's Ithaf al-Mahara extends it to ten more works), and al-Mizzi's omissions are catalogued by Ibn Hajar in the margins. The blueprint's "curated family" is therefore not invented; it is al-Mizzi's atraf entry, adopted and corrected.

**The takhrij footnote is the format for the parallels section.** A modern critical edition's note runs: a one-phrase verdict on the chain as printed; the narrator who decides the grade and his standing, with the authority quoted; name disambiguations; then parallels in a fixed grammar ("recorded by X (no.), Y (vol/page) … from Z, with this chain" for identical chains, "by routes from Z, with it" for chains converging on a pivot), grouped by pivot and moving upward; cross-references; earlier critics' verdicts; glosses. The site's "same report elsewhere" section should be generated in exactly this grammar from the structured parallels, and the verdict-entry micro-task should ask for exactly these pieces.

## 6. Order of work

1. **Now, one to two weeks.** Landing page restructure and the About page; two views with disclosures; framing text compressed; whitespace tightened; "Report a correction" on every line via issue forms; subtleties badges for the three worked hadith with hand-entered fields; the journey map prototype for the three chains.
2. **Next, a month.** Narrator record v1 mirroring the classical entry; the 23 existing records converted and re-audited; the four-discussion page layout; Decap editorial workflow for the board; the first scholars invited to review the three studies.
3. **Then, the first collection.** Al-Bukhari in full: texts, numbering, rumuz, chains parsed with review; narrator authority bootstrap; the move to Workers and D1; browse pages; verify-a-quote.
4. **Then, the platform.** The contributor portal with micro-tasks; the corroboration tree for families; narrator networks; the remaining collections in order of use.

## 7. Decisions needed from you and your teacher

- Whether the explanation discussion (meaning, lessons, law) belongs on the site at all, and from which commentary it is drawn; whether the class notes may seed it, with credit.
- Who the first two reviewers are.
- The naming of the two views (Reader / Researcher, or Simple / Detailed).
- Whether to adopt Tuhfat al-Ashraf's entry numbers as the family identifier for the six books, as section 5 recommends.

## 8. Status, 24 October 2026

Executed in one pass the day after the plan was written. Where the work departed from the plan, the reason is given.

**Done.**

- Landing page cut to the hero, the five conditions, three doors, the reference card and a short join block; mission, vision, goals, principles and the road moved to `/about/`. Section padding reduced by about a third; palette and type untouched.
- Two views, Reader and Researcher, with the former student material as sections inside Researcher that open, close and remember the choice. Framing paragraphs cut to one line each. Saved three-mode preferences map onto the two views.
- The record moved out of TypeScript into validated JSON files under `data/` (one per narrator, studied hadith and collection book), with `src/data/schema.ts` as the single source of truth and `pnpm check:data` running schema and integrity checks (chain ids exist, links name chain members, verdicts carry sources, teacher/student links reciprocate) before every build and on every pull request.
- Narrator schema v1 in the shape of the classical entry: names (kunya, laqab, nisbas, mawla, father's name, orthography), dates with variants, places, Taqrib term with rank and generation, the sigla of the six books and appended works, teachers and students with per-link sigla, the critics with attribution chains, al-Dhahabi and the Tahrir, tadlis rank, ikhtilat, non-hearing pairs, Companion classes and counts, provenance per field, and a review block.
- The four discussions as the skeleton of the hadith page: where it is recorded (takhrij with chain and wording notes, route comparison and the merged corroboration tree), who carried it (the chain with narrator records), what the chain shows (subtleties computed from the records plus a scholar's observations), what it means (commentary with each point attributed, or a "coming soon" placeholder where nothing sourced exists yet).
- Visualisations: the journey map with a hijri-year scrubber; subtleties as badges; the corroboration tree with the pivot narrator marked; the narrator network as teachers above and students below. Every one keeps a table view.
- Sahih al-Bukhari ingested in full from the Open Hadith Data text (ODbL), aligned to the standard numbering, with a machine isnad/matn split and a machine-parsed chain per narration, labelled as such; browse pages for the collection, its books and every narration; verify-a-quote over every narration on record.
- Contribution, phase A: a "Report a correction" link on every line opening a prefilled public issue form; "propose a change" is a file edit on GitHub that opens a pull request; the editorial board in `data/board.json`; sign-off blocks in the records; a pull-request guard (`scripts/check-signoff.ts`) that refuses changes to the substance of a record without a board member's approval; CI that validates, lints and builds.
- Studied hadith from the class notes, each verified against sources before entry, with the notes' lata'if encoded as narrator fields where the site can compute them and as attributed scholar's observations where it cannot.

**Changed from the plan.**

- *Static export kept; the move to Workers with D1 deferred.* The measured output for Bukhari in full is under ten thousand files, within the static-asset limit of the current plan, and the build takes minutes. The database move becomes necessary with the second and third collections, not before; the loader in `src/data/index.ts` is the seam where it will happen.
- *Decap CMS dropped for the board's editing.* Decap writes only the fields its configuration declares and discards the rest, which would silently strip the classical-entry fields from any record it touched. GitHub's own file editor, which opens a pull request for non-members, does the same job without that risk, and the checks and the rendered preview do the reviewing.
- *The Tuhfat al-Ashraf family id is a field, not yet a dataset.* `family: "tuhfa:<entry>"` exists on the record and is set where known; the index itself has not been ingested.

**Not done, and why.**

- The contributor portal (phase B: email login, micro-tasks done independently by two people, reconciliation, a GitHub App that writes reviewed pull requests). It needs an authentication provider, a mail provider and a hosted backend with credentials only the project's owner can create, and decisions about who may do what. The design is in section 4 and in `docs/research/contribution-models.md`; the issue forms and the sign-off guard are its first stage.
- The remaining five collections. The ingestion script is written for al-Bukhari against the Open Hadith Data layout; the other eight books in that dataset follow the same layout and can be added one at a time once the Bukhari pages have been reviewed in use. Numbering for al-Nasa'i is still an open question for the board.
- Inviting the first reviewers, and crediting the teacher by name: both are the founder's to do.
