import type { Hadith } from "../types";

export const seekKnowledgeEvenInChina: Hadith = {
  slug: "seek-knowledge-even-in-china",
  title: "Seek knowledge even in China",
  titleAr: "اطلبوا العلم ولو بالصين",
  takeaway:
    "The saying urges seeking knowledge however far away it is, and its meaning is unobjectionable. As a sentence attributed to the Prophet ﷺ it fails: the only chain carrying “even in China” that does not run through a known liar or fabricator runs through a narrator the critics abandoned. The second half, that seeking knowledge is an obligation on every Muslim, reaches us by many routes and is accepted on their combined strength. Two sentences, two verdicts.",
  status: {
    band: "daif",
    label: "Weak",
    line: "“Even in China” rests on one narrator the critics abandoned: Ibn Hibban and al-Albani call it baseless, al-Bayhaqi says the text is famous and its chains weak. The sentence it is attached to, “seeking knowledge is an obligation on every Muslim”, has many routes and is graded sound by later scholars on their strength.",
  },
  primary: {
    cite: "khatib-rihla:1",
    collection: "al-Khatib al-Baghdadi, al-Rihla fi Talab al-Hadith",
    collectionAr: "الرحلة في طلب الحديث للخطيب البغدادي",
    numbering: "as numbered in the edition on al-Maktaba al-Shamela (book 1454)",
    number: "1",
    chain: ["al-khatib-al-baghdadi", "al-tarrazi", "al-asamm", "al-hasan-ibn-ali-ibn-affan", "al-hasan-ibn-atiyya", "abu-atika", "anas-ibn-malik"],
    links: [
      { from: "prophet", to: "anas-ibn-malik", sighaAr: "قال رسول الله ﷺ", sighaEn: "the Messenger of God ﷺ said", kind: "qala" },
      { from: "anas-ibn-malik", to: "abu-atika", sighaAr: "عن", sighaEn: "from", kind: "an" },
      { from: "abu-atika", to: "al-hasan-ibn-atiyya", sighaAr: "ثنا", sighaEn: "narrated to us", kind: "sama" },
      { from: "al-hasan-ibn-atiyya", to: "al-hasan-ibn-ali-ibn-affan", sighaAr: "ثنا", sighaEn: "narrated to us", kind: "sama" },
      { from: "al-hasan-ibn-ali-ibn-affan", to: "al-asamm", sighaAr: "ثنا", sighaEn: "narrated to us", kind: "sama" },
      { from: "al-asamm", to: "al-tarrazi", sighaAr: "ثنا", sighaEn: "narrated to us", kind: "sama" },
      { from: "al-tarrazi", to: "al-khatib-al-baghdadi", sighaAr: "أنبأ", sighaEn: "informed us", kind: "ikhbar" },
    ],
    isnadAr:
      "أَنْبَأَ أَبُو الْحَسَنِ عَلِيُّ بْنُ مُحَمَّدِ بْنِ مُحَمَّدِ بْنِ أَحْمَدَ بْنِ عُثْمَانَ الطَّرَازِيُّ بِنَيْسَابُورَ، ثَنَا أَبُو الْعَبَّاسِ مُحَمَّدُ بْنُ يَعْقُوبَ الْأَصَمُّ، ثَنَا الْحَسَنُ بْنُ عَلِيِّ بْنِ عَفَّانَ الْعَامِرِيُّ، ثَنَا الْحَسَنُ بْنُ عَطِيَّةَ، ثَنَا أَبُو عَاتِكَةَ، عَنْ أَنَسِ بْنِ مَالِكٍ قَالَ: قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم",
    matnAr: "اطْلُبُوا الْعِلْمَ وَلَوْ بِالصِّينِ، فَإِنَّ طَلَبَ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
    matnEn: "Seek knowledge even in China, for seeking knowledge is an obligation on every Muslim.",
    url: "https://shamela.ws/book/1454/8",
  },
  also: [
    { cite: "bayhaqi-shuab", label: "al-Bayhaqi, Shu'ab al-Iman", note: "same route through Abu Atika; al-Bayhaqi's own remark: the text is famous, the chain weak", url: "https://dorar.net/hadith/search?q=اطلبوا+العلم+ولو+بالصين&st=p&t=0" },
    { cite: "ibnabdalbarr-jami:20", label: "Ibn Abd al-Barr, Jami' Bayan al-Ilm, nos. 20–22 and 29 (ed. al-Zuhayri)", note: "three Abu Atika routes, and a fourth from al-Zuhri through Ya'qub ibn Ishaq al-Asqalani, whom al-Dhahabi called a liar", url: "https://shamela.ws/book/22367/15" },
    { cite: "ibnadi-kamil:4/118", label: "Ibn Adi, al-Kamil 4/118", note: "in the entry on Abu Atika, as an example of his objectionable reports" },
    { cite: "uqayli-duafa:2/230", label: "al-Uqayli, al-Du'afa al-Kabir 2/230", note: "“‘even in China’ is preserved only from Abu Atika, who is abandoned”" },
    { cite: "ibnhibban-majruhin:1/489", label: "Ibn Hibban, al-Majruhin 1/489", note: "“baseless; it has no origin”" },
    { cite: "ibnaljawzi-mawduat:1/347", label: "Ibn al-Jawzi, al-Mawdu'at 1/347", note: "listed among the fabrications" },
    { cite: "ibnmajah:224", label: "Sunan Ibn Majah 224", note: "the obligation sentence alone, without “China”; chain very weak, but one of many routes", url: "https://sunnah.com/ibnmajah:224" },
  ],
  verdicts: [
    { scholar: "al-Bazzar", died: 292, era: "classical", band: "mawdu", grade: "No basis", gradeAr: "ليس لهذا الحديث أصل", scope: "the whole report", source: "al-Bahr al-Zakhkhar 1/172–175, no. 95", quoteAr: "لا يعرف أبو العاتكة ولا يدرى من أين هو، فليس لهذا الحديث أصل", reason: "Abu Atika is unknown, nor is it known where he is from; so the hadith has no basis.", url: "https://shamela.ws/book/12981/98" },
    { scholar: "al-Uqayli", died: 322, era: "classical", band: "daif", grade: "Abandoned narrator", gradeAr: "متروك", scope: "the words “even in China”", source: "al-Du'afa al-Kabir 2/230", quoteAr: "لا يحفظ ولو بالصين إلا عن أبي عاتكة وهو متروك الحديث", reason: "The words “even in China” are preserved only from Abu Atika, who is abandoned in hadith.", url: "https://shamela.ws/book/1454/8" },
    { scholar: "Ibn Hibban", died: 354, era: "classical", band: "mawdu", grade: "Baseless", gradeAr: "باطل لا أصل له", scope: "the whole report", source: "al-Majruhin 1/489", reason: "Abu Atika transmits from Anas what does not resemble Anas's hadith; this report is baseless.", url: "https://dorar.net/hadith/search?q=اطلبوا+العلم+ولو+بالصين&st=p&t=0" },
    { scholar: "al-Bayhaqi", died: 458, era: "classical", band: "daif", grade: "Chains weak", gradeAr: "متنه مشهور وأسانيده ضعيفة", scope: "the whole report", source: "al-Madkhal ila al-Sunan 1/292; Shu'ab al-Iman", quoteAr: "هذا حديث متنه مشهور وأسانيده ضعيفة، لا أعرف له إسنادًا يثبت بمثله الحديث", reason: "Its text is famous and its chains are weak; he knows of no chain by which such a hadith could be established.", url: "https://dorar.net/hadith/search?q=اطلبوا+العلم+ولو+بالصين&st=p&t=0" },
    { scholar: "Ibn Abd al-Barr", died: 463, era: "classical", band: "daif", grade: "All routes defective", gradeAr: "كلها معلولة", scope: "every route from Anas, China wording included", source: "Jami' Bayan al-Ilm, head of the chapter on the obligation hadith", quoteAr: "يروى عن أنس من وجوه كثيرة كلها معلولة لا حجة في شيء منها عند أهل العلم بالحديث من جهة الإسناد", reason: "Transmitted from Anas by many routes, all defective; none is a proof for the people of hadith as far as the chain is concerned.", url: "https://shamela.ws/book/22367/15" },
    { scholar: "Ibn al-Jawzi", died: 597, era: "classical", band: "mawdu", grade: "Not sound; placed among the fabrications", gradeAr: "لا يصح", scope: "the whole report", source: "al-Mawdu'at 1/347", quoteAr: "هذا حديث لا يصح عن رسول الله ﷺ", reason: "Included in his collection of fabrications, citing al-Bukhari and Ibn Hibban on Abu Atika; he also faults al-Hasan ibn Atiyya, misquoting Abu Hatim, who in fact called him truthful.", url: "https://shamela.ws/book/882/213" },
    { scholar: "al-Sakhawi", died: 902, era: "classical", band: "daif", grade: "Weak", gradeAr: "ضعيف من الوجهين", scope: "the words “even in China”", source: "al-Maqasid al-Hasana, no. 126", quoteAr: "وهو ضعيف من الوجهين، بل قال ابن حبان إنه باطل لا أصل له، وذكره ابن الجوزي في الموضوعات", reason: "Weak by both its routes; records Ibn Hibban's “baseless” and Ibn al-Jawzi's placement among the fabrications.", url: "https://shamela.ws/book/1266/379" },
    { scholar: "al-Albani", died: 1420, era: "contemporary", band: "mawdu", grade: "Baseless", gradeAr: "باطل", scope: "the words “even in China”", source: "al-Silsila al-Da'ifa 416; Hidayat al-Ruwat 214", quoteAr: "وأما زيادة اطلبوا العلم ولو بالصين فباطلة", reason: "Agrees with Ibn Hibban and Ibn al-Jawzi: the first half is baseless and has no route fit to support it.", url: "https://dorar.net/hadith/sharh/127801" },
    { scholar: "Ahmad ibn Hanbal", died: 241, era: "classical", band: "daif", grade: "Nothing established", gradeAr: "لا يثبت عندنا فيه شيء", scope: "the obligation sentence", source: "al-Muntakhab min al-Ilal li-l-Khallal 108", reason: "None of the routes of “seeking knowledge is an obligation” is established with him.", url: "https://dorar.net/hadith/search?q=طلب+العلم+فريضة+على+كل+مسلم&st=p&t=1" },
    { scholar: "al-Mizzi", died: 742, era: "classical", band: "hasan", grade: "Hasan by its routes", gradeAr: "روي من طرق تبلغ رتبة الحسن", scope: "the obligation sentence", source: "quoted by al-Sakhawi and by al-Suyuti in Tadrib al-Rawi, section on the mashhur", reason: "Transmitted by routes that together reach the rank of hasan.", url: "https://shamela.ws/book/38171/56" },
    { scholar: "al-Suyuti", died: 911, era: "classical", band: "sahih", grade: "Sahih by its witnesses", gradeAr: "صحيح لغيره", scope: "the obligation sentence", source: "quoted in Fayd al-Qadir 4/267, no. 5264", quoteAr: "جمعت له خمسين طريقًا وحكمت بصحته لغيره", reason: "Collected fifty routes and judged it sound on their combined strength; marks the “China” wording weak in al-Jami' al-Saghir.", url: "https://shamela.ws/book/21660/5306" },
    { scholar: "al-Albani", died: 1420, era: "contemporary", band: "sahih", grade: "Sahih", gradeAr: "صحيح", scope: "the obligation sentence", source: "Sahih al-Jami' 3914; Hidayat al-Ruwat 214", reason: "Sound by its many routes; adds that the extension “and every Muslim woman” has no basis in any of them.", url: "https://dorar.net/hadith/sharh/126132" },
  ],
  lessons: [
    {
      title: "The most famous version is the weakest",
      body: "Almost everyone has heard “even in China”. The critics traced those three words to one man, Abu Atika; the only other routes run through a liar and a known fabricator, which is to say no one corroborates him. Fame among the public is not a category the discipline recognises; the technical word mashhur means something else entirely.",
    },
    {
      title: "A verdict applies to a wording, not a topic",
      body: "The same breath contains two sentences with two different fates. “Seeking knowledge is an obligation on every Muslim” has dozens of routes, none sound alone, and later scholars accepted it on their combined strength. “Even in China” has one route and nothing to lean on. Showing the scope of each verdict is the difference between information and noise.",
    },
    {
      title: "Weak is not false, and quoting it is not lying",
      body: "The meaning is fine; the attribution is what fails. The discipline's question is never “is this wise?” but “did he say it?”, and it answers only the second. Someone who quotes this line is repeating a famous saying, not fabricating a hadith, but they should not say “the Prophet ﷺ said”.",
    },
    {
      title: "A great book is not a grade",
      body: "Al-Khatib al-Baghdadi, a master of the discipline, opened his book on travelling for knowledge with this report. Scholars commonly cited weak reports under virtues, and left the grading to the rijal books. Inclusion means “this is in circulation”, not “this is sound”. The modern editor of the same book marks it weak in the footnote.",
    },
    {
      title: "Corroboration has rules",
      body: "Why can many weak routes lift the obligation sentence but not the China clause? Because corroboration requires independent routes whose weakness is mild, not routes that all return to the same abandoned narrator or to liars. Al-Albani, who accepts the first sentence, rejects the second for exactly this reason.",
    },
  ],
  context:
    "The obligation sentence is itself the subject of a celebrated disagreement. Ahmad, Ishaq ibn Rahawayh, al-Bazzar and Ibn al-Jawzi held that none of its chains is sound, and Ishaq said the obligation is real even if the report is not. Al-Mizzi, al-Suyuti and al-Albani accepted it on the strength of its many routes, and al-Iraqi reports that some imams graded its routes sound; Ibn al-Salah had used it as his example of a report famous among people but not sound. Al-Sakhawi also warned that the addition “and every Muslim woman” appears in none of its routes.",
  vocabulary: [
    { term: "Matruk", ar: "متروك", meaning: "Abandoned: a narrator whose reports the critics set aside entirely, usually for being accused of lying or for gross error." },
    { term: "Munkar al-hadith", ar: "منكر الحديث", meaning: "Al-Bukhari's formula for a narrator whose reports are objectionable; he said it was not permissible to narrate from such a person." },
    { term: "Batil", ar: "باطل", meaning: "Baseless: a report with no sound origin at all." },
    { term: "La asla lahu", ar: "لا أصل له", meaning: "“It has no basis”: no chain exists by which it could be established." },
    { term: "Mashhur", ar: "مشهور", meaning: "Technically, a report with three or more narrators at every level, short of mass transmission; colloquially, a report everyone has heard. The two meanings come apart here." },
    { term: "Sahih li-ghayrihi", ar: "صحيح لغيره", meaning: "Sound by its witnesses: a text whose individual chains are below sahih but whose independent routes together raise it." },
  ],
  sources: [
    { label: "al-Khatib, al-Rihla fi Talab al-Hadith, 1, with the editor's notes (Shamela)", url: "https://shamela.ws/book/1454/8" },
    { label: "Abu Atika in the biographical dictionaries (Hawramani)", url: "https://hadithtransmitters.hawramani.com/طريف-بن-سلمان-أبو-عاتكة/" },
    { label: "Verdict index for the China wording (dorar.net)", url: "https://dorar.net/hadith/search?q=اطلبوا+العلم+ولو+بالصين&st=p&t=0" },
    { label: "Verdict index for the obligation sentence (dorar.net)", url: "https://dorar.net/hadith/search?q=طلب+العلم+فريضة+على+كل+مسلم&st=p&t=1" },
    { label: "Takhrij of both sentences (Shamela)", url: "https://shamela.ws/book/38171/56" },
  ],
};
