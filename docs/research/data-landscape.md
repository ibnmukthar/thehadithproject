# Hadith data and tooling landscape

Research memo, 23 October 2026. Compiled with web research for The Hadith Project; every row was checked against the linked page, repo or API unless marked *unverified*. Pages behind Cloudflare (sunnah.com `/about` and `/developers`, dorar.net, mdpi.com, kaggle.com) blocked automated fetches; where the memo relies on search snippets or secondary sources it says so. Treat this as a starting point for the engineering plan, not as settled fact: licences change, and some claims need a human to confirm with the maintainers.

## 1. Open hadith text datasets and APIs

| Name | URL | What it has | Licence | Format | Notes |
|---|---|---|---|---|---|
| sunnah.com + official API | https://sunnah.com · API spec: https://github.com/sunnah-com/api/blob/master/spec.v1.yml · https://sunnah.com/llms.txt | 9 Books (Bukhari, Muslim, Nasa'i, Abu Dawud, Tirmidhi, Ibn Majah, Muwatta, Ahmad, Darimi) plus Ibn Khuzayma, Ibn Hibban, Hakim, both Musannafs, Daraqutni, Bayhaqi, Nasa'i Kubra, Adab al-Mufrad, Shama'il and secondary selections (Nawawi 40, Riyad, Mishkat, Bulugh, Hisn). Arabic + English (Urdu/Bangla for some). Grades from al-Albani and Darussalam; al-Arna'ut, Ahmad Shakir, Abu Ghuddah "being added". Integer URN per hadith; URL `sunnah.com/{collection}:{number}`; `/hadiths/refs?refs=bukhari:1` lookup. Narrator pages at `sunnah.com/narrator/{nid}` exist but are not in API v1. Isnads not parsed. | Unclear. None of the `api`, `website`, `corrections`, `data` repos has a LICENSE. llms.txt: do not mass scrape or reproduce whole collections; translations are Darussalam/Khan/Siddiqui copyright. | REST JSON, `X-API-Key` by GitHub issue. Base `https://api.sunnah.com/v1/`. | Very active (`api` pushed 2026-10-20). `sunnah-com/data` is a placeholder. An offline dump "available on request" is *unverified*. |
| fawazahmed0/hadith-api | https://github.com/fawazahmed0/hadith-api · CDN `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions.json` | 10 books, 74 editions, 9 languages. Per hadith: `hadithnumber, arabicnumber, text, grades[{name, grade}], reference{book, hadith}`. Graders: Abu Dawud = al-Albani, Abd al-Hamid, al-Arna'ut, Zubair Ali Zai; Ibn Majah = al-Albani, Abd al-Baqi, al-Arna'ut, Zubair Ali Zai; Nasa'i = Abu Ghuddah, al-Albani, Zubair Ali Zai; Tirmidhi = Ahmad Shakir, al-Albani, Bashshar Awwad Ma'ruf, Zubair Ali Zai; Malik = Salim al-Hilali; none for Bukhari/Muslim. Counts: Bukhari 7,589 records (last no. 7,563), Muslim 7,563, Abu Dawud 5,274, Ibn Majah 4,343, Nasa'i 5,765, Tirmidhi 3,998, Malik 1,858. No isnad parsing. | Unlicense on the repo, but data is scraped from sunnah.com et al.; the Unlicense cannot clear upstream translation copyright. | Static JSON via jsDelivr; no auth. | Pushed 2026-06-03. Its "muslim" edition is sequential 1–7,563, not sunnah.com's Abd al-Baqi scheme. |
| AhmedBaset/hadith-json | https://github.com/AhmedBaset/hadith-json | 50,884 hadith, 17 books scraped from sunnah.com. No grades, no scholarly reference numbers (Bukhari has 7,277 sequential ids vs 7,563 standard). Musnad Ahmad chapters 8–30 missing. | None stated. | JSON | Pushed 2026-03-28. |
| hadithapi.com | https://hadithapi.com | Books, chapters, hadith in Arabic, Urdu, English. Numbering and grading undocumented. | Not stated. | REST JSON, key on registration. | Individual maintainer; no source attribution. |
| mhashim6/Open-Hadith-Data | https://github.com/mhashim6/Open-Hadith-Data (upstream https://github.com/ceefour/hadith-islamware) | 9 Books, Arabic only, CSV with and without tashkil; narrator names wrapped in RTL markers (usable for crude isnad highlighting). | ODbL 1.0 (database) + DbCL 1.0 (contents). | CSV | Last push 2022. Cleanest licence for an Arabic spine. |
| abdelrahmaan/Hadith-Data-Sets | https://github.com/abdelrahmaan/Hadith-Data-Sets | 62,169 Arabic hadith, 9 Books, with/without tashkil. Scraped; source unnamed. | None stated. | CSV | Counts differ from standard numbering. |
| LK Hadith Corpus (Leeds/KSU) | https://github.com/ShathaTm/LK-Hadith-Corpus · https://aclanthology.org/2020.lrec-1.415.pdf | 39,038 hadith from the six books, Arabic–English parallel, with separate isnad and matn columns, chapter/section/hadith numbers, grade. Bukhari manually checked; other five auto-segmented (~92%). | None stated (citation requested). | CSV | Best open isnad/matn gold split for Bukhari. |
| Jawami' al-Kalim | Islamweb (Qatar) desktop app; studies: https://ejournal.stdiis.ac.id/index.php/al-atsar/article/view/784 | ~1,400 sources (543 from manuscripts), ~70,000 narrator biographies, automatic takhrij, narrator evaluation with references to Tahdhib al-Kamal, isnad-tree drawing. Arabic-only Windows app. | Proprietary; no open data, no API. | Windows binary | Widely used in hadith faculties; one study reports takhrij accuracy as low as 37–50% on test cases. |
| dorar.net Hadith Encyclopedia | https://dorar.net/hadith · unofficial wrapper https://github.com/AhmedElTabarani/dorar-hadith-api | Per hadith: text, Companion, grading scholar, book, number, grade and grade explanation, takhrij, similar hadith, usul, sharh. | No open licence; dorar.net copyright. Wrapper is MIT. | HTML / JSONP | The only source exposing verdicts with a reason text. Needs an agreement, not scraping. |
| OpenITI corpus | https://github.com/OpenITI/RELEASE · https://zenodo.org/records/3082463 | 9,106 unique books, 55% from Shamela. Whole-book plain text with structural markdown; no per-hadith records, no isnad markup. | CC BY-NC-SA 4.0. | OpenITI mARkdown | Good for full text of rijal works; needs segmentation; NC licence. |
| al-Maktaba al-Shamela | https://shamela.ws | Free Arabic library; source of most digitised texts. | Freeware; text copyright not addressed. No API. | BOK/EPUB/app | Upstream, not a licensed dataset. |
| HadeethEnc | https://hadeethenc.com/api/v1/ | ~3,574 selected hadith in 60+ languages with `grade`, `attribution`, `explanation`, word meanings. | Use without modification, with attribution. | REST JSON, keyless | Only API returning grade + explanation in many languages. |
| islamic.app API | https://docs.islamic.app/api-reference/hadith-collections | Mirror of api.sunnah.com, keyless. | Not stated. | REST JSON | Fallback for sunnah.com schema. |
| Hugging Face quranlab/hadith | https://huggingface.co/datasets/quranlab/hadith | 13 collections, 65,834 Arabic rows + translations, aggregated grader/grade pairs, `hadith_key` = `collection:number`, `urn`. | Mixed per row; Arabic matn declared public domain; translations/grades under owners' terms. | Parquet | Most carefully provenance-tracked aggregate found. |
| Hugging Face freococo/sunnah_dataset | https://huggingface.co/datasets/freococo/sunnah_dataset | 39,318 rows, 11 collections with `arabic_sanad`, `arabic_matn`, gradings JSON. | Self-declared CC BY-NC-SA on scraped data. | CSV | Sanad/matn already split (automatic). |
| Ihsan Network | https://ihsanetwork.org/ | Critically edited encyclopaedia linked to manuscript images. | All rights reserved. | Web / ISO | Closed. |
| Ifta' Sunnah platform (KSA) | https://sunna.alifta.gov.sa | Hadith books with subject hierarchy and narrator data; source for AR-Sanad and the Ifta datasets. | Terms not stated. | Web | No API found. |

## 2. Narrator and isnad structured data

| Name | URL | What it has | Licence | Format | Notes |
|---|---|---|---|---|---|
| muslimscholars.info (Arees Institute) | https://muslimscholars.info/ | 25,000+ entries: names, kunya, family, birth/death, places, teachers/students, tags, references with page cites, Arabic excerpts. Stable integer IDs reused by MIDS and Muhaddithat datasets. | All contents copyright Arees Institute; no API/export. | PHP site | Permission needed for reuse. Last updates circa 2009. |
| Hadith Transmitters Encyclopedia (Hawramani) | https://hadithtransmitters.hawramani.com/ | 135,068 entries indexed from 62 biographical dictionaries; each entry is the dictionary passages mentioning the name. Unstructured: no death-date/grade fields, no teacher/student edges, no entity resolution. | Site says texts are public domain (a claim, not a clearance); software copyright. No download. | HTML | A 2026 paper counts 100,915 entries after dedup. |
| emadjumaah/hadith-kg | https://huggingface.co/datasets/emadjumaah/hadith-kg · https://github.com/emadjumaah/hadith | 715,790 hadith from 425 collections; 577,024 isnad chains; 49,819 narrator bios with tabaqa, grade, tadlis/ikhtilat flags; 127,863 jarh wa ta'dil statements by 1,015 critics; meaning groups with embeddings. | Dataset CC BY 4.0; code MIT. | SQLite | Built from an undistributed "2017 source dump"; provenance not disclosed; single author. Potentially the richest open graph; audit before relying on it. |
| Sanadset 650K | https://data.mendeley.com/datasets/5xth87zwb5 · https://pmc.ncbi.nlm.nih.gov/articles/PMC9440281/ | 650,986 records from 926 books; text tagged SANAD/NAR/MATN; narrator lists. Names not normalised or linked. | CC BY 4.0. | CSV | Largest open raw-chain set; needs entity resolution. |
| Multi-IsnadSet (MIDS), Sahih Muslim | https://data.mendeley.com/datasets/gzprcr93zn | 7,748 hadith, 2,092 narrators with global IDs; node and edge sheets. Chains from Ihsan Network; bios from muslimscholars.info. No grade column. | CC BY 4.0. | Excel | One collection only. |
| AR-Sanad 280K | https://doi.org/10.3390/info13020055 | ~280K synthetic sanads over 18,298 narrators; real test set from six books. | Paper CC BY; data location not found. | — | Disambiguation benchmark. |
| Ifta' Sunnah Hadith & Narrators Dataset (Oumer) | https://github.com/JehadOumer/Ifta-Sunnah-Hadith-and-Narrators-Dataset | 276,347 hadith; 20,957 narrator profiles; graph release with ID-linked chain steps (Neo4j scripts); NER/RE release. | No licence; defers to platform terms. | CSV/JSON/Cypher | Pushed 2026-04-24. |
| Wirahman 2026 entity-linking graph | https://arxiv.org/abs/2607.05424 | Links Sanadset names to Hawramani (51%) and muslimscholars (95% of those); 185,216-node transmission graph "released as open resources". | Paper CC BY; data licence not stated. | — | Exactly the crosswalk the project needs; verify the release. |
| SemanticHadith KG | https://github.com/A-Kamran/SemanticHadith-V2 | OWL ontology + RDF KG of six collections. | V2 repo CC0. | RDF | Endpoint unreachable. |
| Taqrib al-Tahdhib / Tahdhib al-Kamal structured | — | No open structured dataset found. Full text exists only unstructured (Hawramani; Shamela/OpenITI). | — | — | A core gap. |

## 3. Grading data

| Name | What it has | Notes |
|---|---|---|
| sunnah.com API `grades[]` | `{graded_by, grade}` per entry; no reason text. | "Always name the grading scholar." |
| fawazahmed0 `info.json` | Grade labels per hadith for Abu Dawud, Ibn Majah, Nasa'i, Tirmidhi, Malik from the graders listed above. Labels only. | Only multi-grader structured file in the open. |
| dorar.net | Grade + explanation attributed to a named scholar; takhrij; alternate sahih narration; usul. | Only source with reasons; closed. |
| HadeethEnc | Grade, attribution, explanation in 60+ languages for ~3,574 hadith. | Attribution-only terms. |
| emadjumaah/hadith-kg | Narrator-level grades + 127,863 jarh/ta'dil statements. | Provenance caveat. |

No structured, open dataset of al-Albani's Silsila/Irwa', al-Arna'ut's takhrij notes, or Ibn Hajar's Fath judgements was found; these exist only as book text.

## 4. Numbering and identifier problems

| Topic | Facts | Source |
|---|---|---|
| Numbers are editorial, not authorial | The same Bukhari hadith is no. 4051 in the Dar Ibn Kathir (al-Bugha) edition and no. 4302 in Dar Tawq al-Najat (Abd al-Baqi numbering). | https://islamweb.net/en/fatwa/373327/ |
| Bukhari counts | Abd al-Baqi 7,563; other totals 7,495 / 7,658 / 7,208; 2,602 without repetition (Ibn Hajar). Khan's translation has 93 books; sunnah.com shows 97. | https://en.wikipedia.org/wiki/Sahih_al-Bukhari |
| USC-MSA instability | USC renumbered Bukhari Book 2 in 2013/14; its Abu Dawud covers only about half the collection; sunnah.com marks USC-MSA deprecated. | https://github.com/QuranX/QuranX/blob/master/docs/QuranXHadiths.md |
| In-book numbers are unstable | sunnah.com says only the bold Reference is verified against a scholarly numbering; non-bold references "may change, do not store them". | https://sunnah.com/llms.txt |
| Which scheme sunnah.com's Reference is | Bukhari = Abd al-Baqi; Muslim = Abd al-Baqi with letter suffixes for repeats; Abu Dawud and Tirmidhi = Darussalam; Ibn Majah = Abd al-Baqi; Nasa'i reference of unknown origin; Muwatta Arabic reference of unknown origin. | QuranX doc |
| Muslim: 3,033 vs ~7,500 | Abd al-Baqi groups repeats under 3,033 base numbers with letters; Darussalam numbers sequentially to ~7,563. fawazahmed0's Muslim is sequential, so "Muslim 1716" means different hadith in different datasets. | https://en.wikipedia.org/wiki/Sahih_Muslim |
| Musnad Ahmad | 27,000–30,000 reports depending on recension; Shakir and al-Arna'ut numberings differ; the ISNAD citation standard tells scholars to cite by volume/page. | https://www.isnadsistemi.org/ |
| Prior identifier attempts | sunnah.com URN + `/hadiths/refs`; QuranX multi-index; WikiIslam templates; quranlab `hadith_key`; classical: al-Mizzi's Tuhfat al-Ashraf (atraf index by Companion and isnad), Wensinck's Concordance. No published universal identifier or open cross-edition concordance exists. | various |

## 5. Existing isnad visualisation

| Name | URL | Notes |
|---|---|---|
| ParallelQuran Isnad Tree | https://parallelquran.com/isnad-tree/ | Interactive teacher→student tree, node colour = grade, tabaqat browser. Closed; data source undisclosed; observed data errors. Closest existing product. |
| emadjumaah/hadith | https://github.com/emadjumaah/hadith | Isnad tree merging routes, automatic pivot-narrator (madar) detection, narrator dossiers. MIT + CC BY 4.0. Nascent. |
| HadithGraph (Hawramani) | https://hawramani.com/on-using-hadithgraph/ | Paste chains, get a diagram. Manual input only. |
| Al-Ahadeeth (HBKU, HCII 2024) | https://elmi.hbku.edu.qa/en/publications/al-ahadeeth-a-visualization-tool-ofthehadiths-chain-ofnarrators/ | Narrator graph of the six books on concentric generation rings. Not public; layout idea worth copying. |

## 6. Academic work

| Work | What it has | URL |
|---|---|---|
| Altammami, Atwell, Alsalka 2019/2020 | Isnad/matn segmentation (~92%), the LK corpus. | https://aclanthology.org/2020.lrec-1.415.pdf |
| Muther & Smith 2020 | Isnad detection over OpenITI texts. | https://aclanthology.org/2020.wanlp-1.12/ |
| Muther, Smith, Savant 2023 | Narrator name disambiguation with BERT embeddings + community detection. | https://doi.org/10.25517/jhnr.v8i1.135 |
| Mahmoud et al. 2022 (AR-Sanad) | Disambiguation as classification over 18,298 narrators. | https://doi.org/10.3390/info13020055 |
| Oumer 2025 | Joint NER + relation extraction for isnad graphs on 270K records. | https://www.um.edu.mt/library/oar/handle/123456789/137629 |
| Wirahman 2026 | Cross-database narrator entity resolution. | https://arxiv.org/abs/2607.05424 |
| IsnadGuard (ICML 2026 workshop) | Graph model detecting fabricated chains on Sanadset. | https://icml.cc/virtual/2026/80146 |
| Vector search implementations | GTAF related-hadith, hadith-mcp, Fanar-Sadiq, others; all embed full text or translations; none isolates the Arabic matn or publishes a retrieval benchmark. | https://gtaf.org/blog/enhancing-related-hadith-suggestions-using-sentence-transformers |

## Recommended build-on sources for the foundation phase

1. Arabic text spine with a clean licence: mhashim6/Open-Hadith-Data (ODbL/DbCL). Add the LK Hadith Corpus for the gold isnad/matn split of Bukhari (ask the maintainers about licence).
2. Numbering spine, grades and translations: fawazahmed0/hadith-api mirrors sunnah.com's bold Reference numbers and carries multi-grader labels. Treat English translations as display-only pending permission; ship Arabic by default.
3. Canonical reference IDs: adopt sunnah.com's bold Reference scheme per collection, document the origin per collection, mint opaque project IDs, and keep a crosswalk table seeded from the QuranX notes and sunnah.com `/hadiths/refs`. Never persist in-book numbers.
4. Narrator authority file: Sanadset chains + Wirahman's links + MIDS for ID-mapped edges; audit emadjumaah/hadith-kg before using its grades. Ask Arees Institute for a licence to muslimscholars.info.
5. Gradings with reasons: structured labels from fawazahmed0 and HadeethEnc; negotiate with dorar.net for reasons rather than scrape.
6. Isnad parsing: train and evaluate on the Ifta NLP release and Sanadset tags; follow Muther, Smith and Savant for disambiguation.
7. Visualisation reference points: ParallelQuran (feature target), HBKU's generation rings (layout), emadjumaah (madar detection code).

## Gaps nobody has filled

1. No persistent, edition-independent hadith identifier or open concordance.
2. No openly licensed, structured narrator authority file with stable IDs, teacher/student edges, dates, places, tabaqa and grades.
3. No open dataset of scholar verdicts with reasons.
4. No open, normalised isnad graph for the six books keyed to standard numbers and narrator IDs.
5. No open-source interactive isnad visualiser with grade colour-coding and pivot/i'tibar views.
6. No public benchmark for narrator disambiguation on real chains, and no Arabic matn-level retrieval benchmark.
7. Licence hygiene is absent across the ecosystem; most "open" datasets re-license scraped translations without authority.
8. No API exposes the isnad as structured data (narrator IDs per position) for the canonical collections.
