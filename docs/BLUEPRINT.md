# The blueprint

How to take the integrity of hadith into the digital age without losing any of it. This document is the project's thinking in full: what a hadith is as data, how identifiers should work, how the chain becomes a graph, how narrator criticism and scholarly verdicts are modelled without being flattened, who decides what, and what the road looks like. It is written to be argued with. Corrections and objections, with sources, are the most useful thing you can send us.

## 1. The problem, stated precisely

The science of hadith is finished work. Between the second and ninth centuries of the hijra the critics examined every narrator of consequence, compared every route of every report they could find, wrote the results down, and then wrote summaries of the results, and then indexes of the summaries. What was never built is the access layer: the thing that lets a person who is not a specialist get from a quoted sentence to the chain behind it, the people in the chain, and the verdicts on them, in the time it takes to read a tweet.

Four fractures stand between the scholarship and the public.

1. **Numbering.** The same hadith in Sahih al-Bukhari is number 4051 in one printed edition and 4302 in another. Sahih Muslim has 3,033 base numbers in Abd al-Baqi's edition and 7,563 in Darussalam's. Two of the most used open datasets (sunnah.com and the fawazahmed0 hadith-api) disagree on what "Muslim 1716" refers to. A cite that does not resolve is not a cite.
2. **Narrators.** The records of the narrators exist in biographical dictionaries of extraordinary depth: al-Mizzi's Tahdhib al-Kamal, Ibn Hajar's Tahdhib al-Tahdhib and its summary the Taqrib, al-Dhahabi's Mizan, the Tarikh of al-Bukhari, the Jarh wa al-Ta'dil of Ibn Abi Hatim. Online they exist as full text in a few libraries and as a copyrighted, partly outdated database or two. No open, structured, sourced authority file exists.
3. **Verdicts.** A scholar's grade for a hadith is, in every structured dataset we found, a label: "sahih", "da'if". The reason, which is the whole point, survives only in the books, or behind one closed encyclopaedia. Labels without reasons are exactly what makes the science look like opinion.
4. **Links.** Because there are no shared identifiers, nothing links to anything. A hadith page does not link to its narrators; a narrator does not link to the critics' words; a verdict does not link to the page it was written on. Without links there is no citation culture, and without a citation culture there is only assertion.

The discourse failure follows from the access failure. People argue about hadith without evidence because the evidence is a day's work away. Make it a second's work and a different conversation becomes possible: not a friendlier one, necessarily, but one with receipts.

## 2. What a hadith is, as data

The naive model is "a hadith is a text with a number". It fails immediately, and the way it fails determines the whole design.

The scholars of hadith worked with at least three different units, and a faithful system has to carry all three.

- **The narration** (riwaya): one text, as transmitted through one chain, as recorded in one book at one place. "Sahih al-Bukhari, 1" is a narration. It has exactly one isnad and one matn. It is the unit of citation.
- **The route** (tariq, wajh): the chain itself, considered as a path through the graph of narrators. A narration has one route; a hadith has many. Routes are what scholars compare when they ask whether a report is corroborated, single-stranded, or anomalous. They are the unit of grading in the strict sense: a grade belongs to a route, and only derivatively to a text.
- **The hadith** (the matn family, what the atraf literature indexes by a tell-tale fragment of the text, its taraf): the cluster of narrations that transmit the same statement or event, possibly from several Companions, possibly in different wordings. "Actions are by intentions" is a hadith; it has seven narrations in al-Bukhari alone and routes in every major collection. It is the unit people mean when they say "the hadith of intentions", and the unit a verdict like "hasan by its corroborating routes" (hasan li-ghayrihi) or "sahih by its corroborating routes" (sahih li-ghayrihi) is actually about.

Two facts make the family layer hard and important. First, transmission by meaning (riwaya bi al-ma'na) was permitted within limits, so the wording of the same hadith differs between narrations: shortened, lengthened, with a sentence moved. A hash of the text is therefore not an identifier of the hadith; it is a fingerprint of one narration's text in one edition. Second, the boundaries of a family are a scholarly judgement, not a string-similarity threshold. Al-Mizzi's Tuhfat al-Ashraf, which indexes the six books and their appended works by Companion and then by the narrators from each Companion, is the classical answer to exactly this problem, and the project's family layer should be built on the atraf tradition rather than invented from scratch.

So the decision is: three identifier classes with explicit, different semantics; the family identifier is curated by people following the takhrij literature, never derived by hashing.

## 3. Identifiers

### 3.1 Narration cite

A narration is cited as `thp:<collection>:<number>`, for example `thp:bukhari:1` or `thp:muslim:1907`. The collection token names a declared canonical numbering, published in a table that says exactly which edition's numbers these are and why.

| Collection | Canonical numbering adopted | Reason |
|---|---|---|
| Sahih al-Bukhari | Muhammad Fu'ad Abd al-Baqi (the bold reference on sunnah.com) | The most widely cited scheme; it is the numbering printed in the standard edition of Ibn Hajar's Fath al-Bari |
| Sahih Muslim | Abd al-Baqi base numbers, with letter suffixes for repeated reports in the sunnah.com manner (1907a, 1716b…) | Keeps the editor's grouping of repeats visible instead of flattening it |
| Sunan Abi Dawud | Darussalam | Matches the numbering most modern takhrij notes use |
| Jami' al-Tirmidhi | Darussalam | As above; Ahmad Shakir's numbering is recorded in the crosswalk |
| Sunan al-Nasa'i | To be decided with the editorial board; the common web numbering is of uncertain origin | An honest gap, see section 14 |
| Sunan Ibn Majah | Abd al-Baqi | Standard |
| Musnad Ahmad | Risala edition (Shu'ayb al-Arna'ut) number, with volume and page always recorded | The recensions differ enough that volume and page are the only stable locator |

Behind every public cite is an opaque internal identifier that never changes. If an edition is renumbered or a numbering decision is revised, the crosswalk changes and the links keep working. The crosswalk itself is a published table with provenance per row: "Bukhari 4302 (Abd al-Baqi) = 4051 (al-Bugha, Dar Ibn Kathir) = Book 64, Hadith 335 (sunnah.com in-book reference) = Vol. 5, Book 59, Hadith 595 (USC-MSA web numbering, deprecated)". Rows are added from existing concordances where they exist and from editions where they do not, and each row says where it came from.

In-book numbers (Book 2, Hadith 12) are never used as identifiers. They are unstable across editions and even across versions of the same website, and the one site that uses them says not to store them.

### 3.2 Text fingerprint

Alongside the cite, every narration carries a fingerprint: the SHA-256 of its Arabic matn after a documented normalisation (vowel marks removed, alif variants unified, ta marbuta and alif maqsura normalised, punctuation and tatweel stripped, whitespace collapsed). The normalisation rule is part of the specification and will be versioned.

The fingerprint does three jobs. It lets anyone check that a quoted text matches the record, whichever edition it was typed from. It detects altered or truncated quotations. And it allows deduplication across datasets that use different numberings, which is how the crosswalk gets bootstrapped. It is a checksum, not an identity: two narrations with the same fingerprint are the same text, not necessarily the same hadith (they may have different chains), and two with different fingerprints may be the same hadith in different wordings.

### 3.3 Hadith family

A family is identified by a short opaque id, `thp:h:<id>`, with a human-readable slug alias for URLs (`/h/actions-by-intentions/`). Families are created and bounded by editors following the takhrij literature, and every family page lists its member narrations with the reason they belong (same Companion and Successor; same event in different wording; a shahid from another Companion, which belongs to the family but is flagged as an independent witness).

### 3.4 Narrator

A narrator is `thp:r:<id>`, opaque, with a crosswalk to the identifiers already in use: the entry number in Tahdhib al-Kamal, the Taqrib entry number, the muslimscholars.info id that two existing datasets already key on, sunnah.com narrator ids, and library authority ids where a narrator is also an author. Name forms are many-to-one: every spelling, kunya, nisba and laqab found in the chains points at one record, and the record lists them.

### 3.5 Versioning

Dataset releases are tagged. Every record carries a revision number and a change history. A cite can pin a release (`thp:bukhari:1@2027.1`) for scholarly work that must be reproducible. The current release is the default.

## 4. The chain as a graph

A chain is a path. The whole corpus is a graph: narrators are nodes and transmissions are edges. Getting the edge right is most of the work.

### 4.1 Edges are events, not relationships

"Sufyan narrated from Yahya" is not one fact. It is thousands of transmission events, each in a particular narration, each with its own formula. The model therefore has two layers. A **transmission** belongs to one narration: it records the teacher, the student, the formula used (haddathana, akhbarana, sami'tu, 'an, qala, anna…), the position in the chain, and the source. A **relationship** between two narrators is the aggregate: all the transmissions between them, plus what the biographical literature says about them (listed as teacher and student in Tahdhib al-Kamal; a recorded hearing; a critic's statement that one never heard from the other).

The formula is evidence. "Narrated to us" asserts direct hearing. "From" (ʿan) does not. The discipline's rules about ambiguous formulae depend on who used them, and the system has to carry the formula on every edge to apply those rules.

### 4.2 Continuity is checked with evidence, not inferred from dates

The suggestion that software should "automatically flag if two narrators lived in different eras and never met" is right in spirit and wrong in detail, and the detail is the science. Continuity (ittisal) was established by the critics from evidence: an explicit hearing formula in a sound chain, a recorded meeting, inclusion in a teacher's list of students, or a critic's testimony. Its absence was established the same way, often against the dates: a narrator who could have met his source by the calendar but is known not to have.

So each relationship carries a **meeting-evidence class**, and the interface shows which:

1. Explicit hearing stated in a sound chain (sama' musarrah).
2. Listed as teacher and student by al-Mizzi or another authority.
3. Contemporaneity only: the dates permit a meeting; nothing records one.
4. Explicit denial by a critic ("he did not hear from him", "he never met him"), with the source.
5. Dates forbid a meeting.

The software computes classes 3 and 5 from the dates and raises them as questions. It never labels a chain "broken" (munqati') on its own; that is a verdict, and it is reserved for the scholars whose words are then quoted. The two classical standards are both available as views: al-Bukhari's, which requires evidence of at least one meeting, and Muslim's, which accepts contemporaneity with the possibility of meeting from a narrator not known for disguising gaps.

### 4.3 Tadlis

A narrator known to say "from" over a teacher he met but did not hear that report from, so that it sounds like direct hearing, or to drop a weak intermediary, is a mudallis. (Saying "from" over a contemporary he never met is, in Ibn Hajar's terms, a hidden mursal, and is handled separately.) Ibn Hajar sorted them into five ranks by how much the practice was tolerated. The model stores the rank on the narrator and the formula on the edge; the combination "ambiguous formula from a mudallis of rank three or worse, with no explicit hearing recorded elsewhere" is raised as a flag. It is a flag because the rules have exceptions the critics knew and applied: an ambiguous formula from a rank-one or rank-two mudallis is accepted, and an ambiguous formula is accepted from any mudallis when his hearing of that report from that teacher is established by another route.

### 4.4 Pivots and corroboration (i'tibar)

For a family, the routes are merged into one tree and the pivot (madar), the narrator at which routes converge, is computed and shown. Single-strand segments are marked as such; corroborations are classified the way the discipline classifies them: a full follow-up (mutaba'a tamma, another student of the same teacher), a partial one (mutaba'a qasira, another route higher up), or a witness (shahid, another Companion). This is the i'tibar procedure the critics performed by memory, made visible. Al-Bukhari's first hadith is the textbook case: single-stranded for four links, then hundreds of routes from Yahya ibn Sa'id. Showing that shape is worth more than any label.

## 5. Narrators: modelling the critics without flattening them

### 5.1 The words, verbatim

Every judgement on a narrator is stored as the critic's own words, with the critic, the work, the edition and the page, and a translation. A summary band may be derived from these; the words are never replaced by it. "Weak" is a rendering; "munkar al-hadith jiddan, said Ahmad, reported by al-Juzajani" is a record.

### 5.2 A controlled vocabulary of ranks

The terms of praise and criticism form ranked vocabularies that the discipline itself systematised: Ibn Abi Hatim's four grades each way, Ibn Hajar's twelve ranks in the Taqrib, al-Dhahabi's and al-Sakhawi's refinements. The project publishes a mapping from terms to ranks and a mapping from ranks to the colour bands shown on screen. Both mappings are data, not code, and both are open to the board's revision.

The default band for a narrator of the six books is Ibn Hajar's Taqrib rank. Where a later authority revised it with reasons, the Tahrir Taqrib al-Tahdhib of Bashshar Awwad Ma'ruf and Shu'ayb al-Arna'ut being the obvious case, both are shown. The band is never a vote count.

### 5.3 Reliability is scoped

The thing the colour-coded blob cannot say, and the critics said constantly, is that a narrator's reliability can depend on the circumstances.

- **Time.** Narrators who suffered confusion late in life (ikhtilat) are reliable in what students heard from them before it and not after. The critics recorded who heard when.
- **Source.** Isma'il ibn Ayyash is reliable when narrating from Syrians and weak from Hijazis. Hammad ibn Salama is strongest in what he narrates from Thabit. Some narrators are weak only in one particular teacher.
- **Place.** Ma'mar's narrations in Basra were considered less reliable than those in Yemen, because in Basra he narrated from memory without his books.
- **Medium.** From his book versus from memory, with the critics' notes on which.

The model therefore stores reliability assertions as **scoped**: narrator, scope (from which teachers, before or after which event, in which place, from book or memory), rank, critic, source. The band on a narrator's page is the unscoped summary; the band on an edge in a particular chain can differ, because the scope applies. This is, as far as we can find, something no existing tool represents, and it is one of the places where the digital form can be more faithful to the discipline than the printed summary.

### 5.4 Disambiguation

The chains name people by whatever the student called them: "Sufyan" (which of the two?), "Hammad" (ibn Zayd or ibn Salama?), a kunya, a nisba. The critics wrote entire books to resolve this (the muhmal and mu'talif literature), and the resolution usually depends on who the teacher and student are. The project's parser proposes a resolution with its confidence and its reasoning; a reviewer confirms it; the public record carries only confirmed links, with the proposal visible in the history.

### 5.5 Companions

Companions are not graded; the discipline treats all of them as upright, and the project follows the discipline. Their records carry dates, places and the Companion-specific questions the critics did ask: whether a particular report is a Companion's own mursal (narrated from another Companion without naming him), and the age of a young Companion at the Prophet's death.

## 6. Verdicts: aggregated, never averaged

A verdict is a structured record: the scholar, the work, the exact locus, the grade term in the scholar's own words, the **scope** (this narration, this route, or the hadith as a whole by the totality of its routes), the reason quoted, and the era. Inclusion in a Sahih is a verdict with its own semantics and is recorded as one.

Scope is where most public confusion lives. Al-Tirmidhi says "gharib" of his chain and prefers the mursal; al-Nawawi says "hasan"; al-Albani says "sahih" in one book and "hasan by its corroborating routes" (hasan li-ghayrihi) in another; al-Arna'ut says "hasan by its witnesses" in his Musnad notes, and "sahih by its witnesses" in his Riyad al-Salihin notes, of a chain he himself calls weak. None of these contradict each other once the scope is shown, and all of them look contradictory when it is not. The verdict table always shows the scope.

The project does not grade. The status line at the top of a hadith page is an editorial summary of the literature, like the abstract of a systematic review: written by a named editor, citing the verdicts below it, reviewable, and labelled as what it is. It uses the discipline's words ("agreed upon", "disputed", "weak by this route") and never a new word of its own.

### 6.1 Hidden defects (ilal)

An 'illa is a flaw a master detects by comparing all the routes: a chain that looks sound but where a reliable narrator erred, a connected version that is really a mursal, a text that belongs to a different hadith. These cannot be derived from the data model; they are expert annotations, and the literature of them (al-Daraqutni's 'Ilal, Ibn Abi Hatim's 'Ilal, al-Tirmidhi's 'Ilal) is among the most demanding in the discipline. They are modelled as first-class objects attached to narrations: the defect, who identified it, where, and a link to the version the critic held to be the preserved one (mahfuz). The "leaving what does not concern you" page is a worked example.

### 6.2 Text criticism and meaning

Grading a chain is not the end of the discipline. The critics also examined texts (naqd al-matn), and jurists examined meaning: the occasion of a statement (sabab al-wurud), abrogation, apparent conflicts between sound reports and their reconciliation, and what a report implies in law. The project links each hadith to this literature as a clearly labelled interpretive layer. It does not editorialise about what a hadith means; it shows who said what it means, with sources, under a heading that says so.

### 6.3 Testimony, and whether it can be counted

Most knowledge is testimony, and the hadith critics built the most systematic method for evaluating it that any civilisation produced. The founders of probability later met the same two problems: a fact passed down a chain of witnesses loses probability at every link (Laplace's twenty witnesses at nine-tenths each arrive below one in eight), and independent witnesses who agree raise it sharply, but only, as Laplace himself warns, if they could not have coordinated. Those are the two questions the discipline answers with its premium on short chains and its theory of corroboration; al-Khatib al-Baghdadi defines mass transmission by the impossibility of collusion, Ibn Hajar refuses to fix a number, al-Ghazali says the threshold cannot be counted and describes the accumulation of reports into certainty in terms Laplace would have recognised.

The project draws the parallel on the science page and then declines to go further, for reasons the tradition gives: a narrator's reliability is not a fixed fraction but a scoped judgement (section 5.3); corroboration counts only for genuinely independent routes with light weakness; certainty from mass transmission is a matter of settled custom, not calculation; and most hadith yield probable knowledge that the law accepts as a basis for action. Any future tooling that counts routes or checks dates is retrieval and flagging, never grading. We are not aware of a peer-reviewed probabilistic model of chain corroboration; if one appears, it would be evaluated as a research instrument, not adopted as a verdict.

## 7. Provenance: receipts all the way down

Every assertion in the dataset has a source, and every source resolves to a location: the work, the edition, the volume and page, and where one exists a link to the page image (a digitised printed edition, or a manuscript folio). Primary sources (the hadith collections), secondary (the biographical and critical literature) and tertiary (modern takhrij and reference works) are labelled as such.

The editorial trail is public: who entered a record, who reviewed it, when, and what changed. A reader who distrusts a line can follow it back to a page, and a reader who distrusts the page can see who put it there.

## 8. Governance: who decides, and how disagreement is recorded

- **An editorial board** of hadith specialists, named, with affiliations, sets the vocabularies and mappings, resolves family boundaries, and reviews narrator-band overrides and status lines. Two reviewers are required for anything that changes a band or a status line.
- **Reviewers** are qualified in the discipline, by recognised study or by academic credentials in hadith. Qualification is stated on their public profile.
- **Disputes are objects.** When reviewers disagree and the literature disagrees, the record carries a dispute: each position, its holders, its sources. The page shows all positions. There are no edit wars because there is nothing to win.
- **Scope is declared.** The project begins with the Sunni hadith sciences and the rijal tradition of the six books, because that is where the classical method is most fully documented and where the public argument mostly happens. Shi'i hadith sciences have a parallel and serious rijal tradition (al-Najashi, al-Tusi, al-Kashshi, and in modern times al-Khoei's Mu'jam Rijal al-Hadith) that deserves first-class treatment by its own scholars under the same principles. It is planned, not improvised, and the two traditions' verdicts are never mixed in one table without labelling.
- **Independence.** The project issues no fatwas and polices no sect. Its funding is public.

## 9. Data, licensing and the sources we build on

### 9.1 Licences

Data is released under CC BY 4.0: attribution is the one condition, because attribution is provenance. Code is released under Apache-2.0. Modern translations under copyright (Darussalam, Khan, Siddiqui) are not redistributed; the project ships Arabic by default, commissions or adopts openly licensed translations over time, and links to copyrighted translations where their owners permit. Classical texts are public domain; modern critical editions may carry rights in their apparatus, and the project records which edition a text was taken from and respects the rights that apply.

### 9.2 What exists, and what we reuse

A full survey is in `docs/research/data-landscape.md`. The short version:

- **Arabic text with a clean licence:** the Open-Hadith-Data CSVs (ODbL) for the nine books, with the LK Hadith Corpus for a human-checked split of chain and text in al-Bukhari.
- **Numbering and grade labels:** the fawazahmed0 hadith-api mirrors the standard reference numbers and carries multi-grader labels for four of the Sunan; its translations are copyrighted upstream regardless of the repo licence and are treated as display-only.
- **Chains in bulk:** Sanadset (650,000 tagged records, CC BY) and the Multi-IsnadSet for Sahih Muslim (CC BY, with narrator ids), plus a 2026 entity-linking release that maps chain names to biographical entries.
- **Narrator biographies:** the full texts of the dictionaries through Shamela and OpenITI; a large open knowledge graph of undocumented provenance that must be audited before any of it is trusted; and one copyrighted database whose ids are already a de facto key and whose owners we will ask for a licence.
- **Verdicts with reasons:** exist in structured form only in one closed encyclopaedia (dorar.net). The project will negotiate rather than scrape, and will otherwise enter reasons from the books, by hand, with page references.

Nobody has built: an edition-independent identifier; an open structured narrator authority file with scoped reliability; an open verdict dataset with reasons and scope; an open normalised isnad graph keyed to standard numbers; or an open interactive visualiser with corroboration views. Those are the project's deliverables, in that order.

### 9.3 Formats and the API

- JSON API, read-only, keyless for reasonable use, versioned (`/api/v1/…`), with the same records the pages render.
- Bulk releases as JSON Lines and Parquet with checksums, mirrored on an archival repository so the data outlives the website.
- Graph export (GraphML and RDF, aligned where sensible with the existing SemanticHadith ontology) so researchers can load the whole thing into their own tools.
- An oEmbed endpoint and link-preview cards, so that pasting a cite anywhere produces the reference card.

## 10. Products

The data is the project. These are the ways people will meet it.

1. **The website**, with three depths of the same record: reader, student, researcher.
2. **The reference card.** A link that unfurls, wherever it is pasted, into the text, the source, the chain and the verdicts. This is the argument-ender, and it is the single most important product for the public conversation.
3. **A browser extension** that recognises hadith cites (Bukhari 1, Sahih Muslim 1907, an Arabic text) on any page and annotates them with the card.
4. **A reply bot** that, when invoked, answers a cited hadith with its card and nothing else. No argument, no opinion, the record.
5. **Citation tools**: a citation style and a reference-manager translator so that academic writing cites narrations by stable identifiers.
6. **An embeddable widget** for websites, lesson pages and apps.
7. **Search**: lexical search with proper Arabic normalisation and root-aware matching; search by meaning using embeddings, labelled as retrieval and never as verdict; and search by paste, where any Arabic text is fingerprinted and matched to its family.

## 11. What machines may and may not do here

Machines may: parse chains and propose narrator links; cluster texts and propose families; check dates and raise continuity questions; find parallel narrations; draft translations labelled as drafts. Every such output is labelled, versioned and reviewable, and the public record carries only what a person confirmed.

Machines may not: grade a hadith; grade a narrator; summarise a narrator's standing without quoting the critics; present generated prose as scholarship. The failure mode of this decade is confident text with no source. The project exists to be the opposite of that, and a single hallucinated verdict would cost it the trust that is its only asset.

## 12. The road

**Now: prototype.** Three hadith, one of each kind, with every link examined; sixteen narrator records with the critics quoted; the identifier scheme and fingerprint; reader, student and researcher depths; reference cards; a static JSON API; and this blueprint.

**Foundation, the first year.** The six canonical collections in Arabic with a published numbering crosswalk. A record for every narrator of the six books and their appended works, built from the Tahdhib literature with the Taqrib rank, the Tahrir revision where it differs, and the critics' words, each with a page reference. Chains parsed for every narration, with the parser's proposals reviewed by people. Verdicts: inclusion in the two Sahihs; al-Tirmidhi's own; the labels of al-Albani, al-Arna'ut, Ahmad Shakir and Zubair Ali Za'i; reasons entered from the books for the most-cited hadith first. An editorial board, a reviewer process and a public change log. Measures of success: the share of narrations with reviewed chains; the share of narrators with sourced verdicts; the time it takes a stranger to verify a cited hadith (target: under ten seconds); the number of corrections received and the time to resolve them.

**Infrastructure, the second and third years.** Family views with corroboration trees for the whole corpus. The API, the cards, the extension and the bot. Translations in the languages of the largest Muslim publics. The 'ilal literature as structured annotations. Further collections: Musnad Ahmad, the Muwatta, Ibn Hibban, al-Hakim, the Musannafs. Manuscripts and digitised editions linked at page level. The Shi'i track under its own scholars. Partnerships with universities and hadith institutes for review capacity and authority.

## 13. Risks

- **Authority capture.** A project that decides what is sahih would be a new authority, and a bad one. Mitigation: we do not grade, the board's role is editorial, and disputes are published rather than resolved.
- **Generated text.** Mitigation: section 11, enforced in the data model, not just in policy.
- **Copyright.** Translations and modern editions carry rights. Mitigation: Arabic-first, open translations over time, respect for edition rights, and agreements rather than scraping.
- **Numbering wars.** Mitigation: opaque ids, a public crosswalk, and no in-book numbers.
- **Misuse of "weak".** A weak grade will be used as "fake". Mitigation: the status line carries the discipline's qualification every time; scope is always shown; the reader depth explains that weak means unproven by this route.
- **Sustainability.** Mitigation: an endowment model, institutional hosting, archival mirrors, and a licence that lets the data survive the organisation.

## 14. Open questions for the scholars

These are decisions the project will not make alone.

1. Which numbering to adopt for Sunan al-Nasa'i and the Muwatta, and how to cite Musnad Ahmad across recensions.
2. Whether to display a derived band at all for narrators on whom the critics split sharply, or only the quotations.
3. How to present "hasan by its witnesses" so that readers understand it is a judgement about a text's routes together, not about any one chain.
4. How to treat the mursal of senior Successors whose mursal reports some jurists accepted, and the mursal of Companions.
5. The vocabulary mapping from the critics' terms to ranks: whose ranking, with what exceptions, and how to record a term whose force changed between critics.

## 15. Licensing

Data: Creative Commons Attribution 4.0. Code: Apache-2.0. Modern copyrighted translations are not redistributed. See section 9.
