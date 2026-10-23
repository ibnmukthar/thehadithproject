import type { Hadith } from "../types";

export const leavingWhatDoesNotConcern: Hadith = {
  slug: "leaving-what-does-not-concern",
  title: "Leaving what does not concern you",
  titleAr: "من حسن إسلام المرء تركه ما لا يعنيه",
  takeaway:
    "Part of practising Islam well is minding your own business: not speaking, prying or interfering where you have no stake. One of the most quoted lines in the tradition; also one whose chain the scholars have argued about for a thousand years, which is why it is here.",
  status: {
    band: "disputed",
    label: "Disputed",
    line: "Hasan to al-Nawawi and, by corroboration, to al-Arna'ut and al-Albani; but most early masters held this connected chain to be an error and the version without a Companion (mursal) to be the sound one.",
  },
  primary: {
    cite: "tirmidhi:2317",
    collection: "Jami' al-Tirmidhi",
    collectionAr: "جامع الترمذي",
    numbering: "Ahmad Shakir / Darussalam numbering, as used on sunnah.com",
    number: "2317",
    bookChapter: "Book of Renunciation, chapter 11",
    chain: ["al-tirmidhi", "ahmad-ibn-nasr-al-naysaburi", "abu-mushir", "ismail-ibn-samaa", "al-awzai", "qurra-ibn-abd-al-rahman", "al-zuhri", "abu-salama", "abu-hurayra"],
    links: [
      { from: "prophet", to: "abu-hurayra", sighaAr: "قال رسول الله ﷺ", sighaEn: "the Messenger of God ﷺ said", kind: "qala" },
      { from: "abu-hurayra", to: "abu-salama", sighaAr: "عن", sighaEn: "from", kind: "an" },
      { from: "abu-salama", to: "al-zuhri", sighaAr: "عن", sighaEn: "from", kind: "an" },
      { from: "al-zuhri", to: "qurra-ibn-abd-al-rahman", sighaAr: "عن", sighaEn: "from", kind: "an" },
      { from: "qurra-ibn-abd-al-rahman", to: "al-awzai", sighaAr: "عن", sighaEn: "from", kind: "an" },
      { from: "al-awzai", to: "ismail-ibn-samaa", sighaAr: "عن", sighaEn: "from", kind: "an" },
      { from: "ismail-ibn-samaa", to: "abu-mushir", sighaAr: "عن", sighaEn: "from", kind: "an" },
      { from: "abu-mushir", to: "ahmad-ibn-nasr-al-naysaburi", sighaAr: "حدثنا", sighaEn: "narrated to us", kind: "sama" },
      { from: "ahmad-ibn-nasr-al-naysaburi", to: "al-tirmidhi", sighaAr: "حدثنا", sighaEn: "narrated to us", kind: "sama", note: "al-Tirmidhi adds “and more than one other”" },
    ],
    isnadAr:
      "حَدَّثَنَا أَحْمَدُ بْنُ نَصْرٍ النَّيْسَابُورِيُّ وَغَيْرُ وَاحِدٍ، قَالُوا حَدَّثَنَا أَبُو مُسْهِرٍ، عَنْ إِسْمَاعِيلَ بْنِ عَبْدِ اللَّهِ بْنِ سَمَاعَةَ، عَنِ الأَوْزَاعِيِّ، عَنْ قُرَّةَ، عَنِ الزُّهْرِيِّ، عَنْ أَبِي سَلَمَةَ، عَنْ أَبِي هُرَيْرَةَ، قَالَ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم",
    matnAr: "مِنْ حُسْنِ إِسْلاَمِ الْمَرْءِ تَرْكُهُ مَا لاَ يَعْنِيهِ",
    matnEn: "Part of the excellence of a person's Islam is their leaving what does not concern them.",
    url: "https://sunnah.com/tirmidhi:2317",
  },
  also: [
    { cite: "tirmidhi:2318", label: "Jami' al-Tirmidhi 2318", note: "the mursal: Malik ← al-Zuhri ← Ali ibn al-Husayn, no Companion named; al-Tirmidhi: “this is, to us, more correct”", url: "https://sunnah.com/tirmidhi:2318" },
    { cite: "malik:47:3", label: "al-Muwatta, Good Character, 3", note: "the mursal, in the Muwatta (Yahya al-Laythi's recension)", url: "https://sunnah.com/malik/47" },
    { cite: "ibnmajah:3976", label: "Sunan Ibn Majah 3976", note: "same route through al-Awza'i and Qurra, so not an independent witness", url: "https://sunnah.com/ibnmajah:3976" },
    { cite: "ahmad:1737", label: "Musnad Ahmad 1737", note: "from al-Husayn ibn Ali, via Abdullah al-Umari (weak); al-Arna'ut: hasan by its witnesses", url: "https://islamtics.com/hadith/musnad-ahmad/1737/" },
    { cite: "ahmad:1732", label: "Musnad Ahmad 1732", note: "from al-Husayn ibn Ali with the wording “little speech in what does not concern him”; broken chain", url: "https://islamtics.com/hadith/musnad-ahmad/1732/" },
    { cite: "ibnhibban:229", label: "Sahih Ibn Hibban 229", note: "Ibn Hibban included it in his Sahih" },
    { cite: "nawawi40:12", label: "al-Nawawi's Forty Hadith, 12", url: "https://sunnah.com/nawawi40:12" },
    { cite: "riyadussalihin:67", label: "Riyad al-Salihin 67", url: "https://sunnah.com/riyadussalihin:67" },
  ],
  verdicts: [
    { scholar: "al-Tirmidhi", died: 279, era: "classical", band: "note", grade: "Gharib; the mursal is sounder", gradeAr: "غريب", source: "Jami' al-Tirmidhi 2317–2318", quoteAr: "هذا حديث غريب لا نعرفه من حديث أبي سلمة عن أبي هريرة عن النبي ﷺ إلا من هذا الوجه … وهذا عندنا أصح من حديث أبي سلمة عن أبي هريرة", reason: "Knows the Abu Hurayra route only through this chain. After recording Malik's mursal, says that version is, to him, more correct.", url: "https://sunnah.com/tirmidhi:2318" },
    { scholar: "al-Bukhari", died: 256, era: "classical", band: "daif", grade: "Sound only as mursal", source: "al-Tarikh al-Kabir 4/220", quoteAr: "وهذا أصح بانقطاعه … ولا يصح إلا عن علي بن حسين عن النبي ﷺ", reason: "The version with the gap is more correct; the report is not sound except from Ali ibn al-Husayn directly from the Prophet ﷺ, with no Companion named (what Ibn Rajab summarises as “only as mursal”).", url: "https://dorar.net/hadith/search?q=من+حسن+إسلام+المرء+تركه+ما+لا+يعنيه" },
    { scholar: "al-Daraqutni", died: 385, era: "classical", band: "daif", grade: "The mursal is correct", source: "al-Ilal 310, 3024, 3158; and 8/25 on the Abu Hurayra route", quoteAr: "الصحيح عن الزهري عن علي بن الحسين مرسلًا", reason: "Compared the versions attributed to al-Zuhri and holds the mursal from Ali ibn al-Husayn to be the correct form. In the Abu Hurayra entry he treats Qurra's version as what al-Awza'i actually transmitted, and still names the mursal as the preserved form alongside it.", url: "https://dorar.net/hadith/search?q=من+حسن+إسلام+المرء+تركه+ما+لا+يعنيه" },
    { scholar: "Ibn Abd al-Barr", died: 463, era: "classical", band: "hasan", grade: "Both routes preserved", source: "al-Tamhid 9/199", quoteAr: "ولا يصح فيه عن الزهري إلا إسنادان … والمرسل عن علي بن حسين أشهر وأكثر", reason: "Only two chains from al-Zuhri are sound: Malik's mursal, which is more famous, and al-Awza'i's connected chain through Qurra. Everything else is error. Ibn Rajab reads this as supporting al-Nawawi's hasan." },
    { scholar: "al-Nawawi", died: 676, era: "classical", band: "hasan", grade: "Hasan", gradeAr: "حديث حسن", source: "al-Arba'in 12; Riyad al-Salihin 67", reason: "Its narrators are reliable; Qurra was declared reliable by some and weak by others (so Ibn Rajab explains the grading).", url: "https://sunnah.com/nawawi40:12" },
    { scholar: "Ibn Rajab al-Hanbali", died: 795, era: "classical", band: "daif", grade: "Sound only as mursal", source: "Jami' al-Ulum wa al-Hikam, hadith 12", quoteAr: "وأما أكثر الأئمة فقالوا: ليس هو محفوظًا بهذا الإسناد … والصحيح فيه المرسل … وقد روي عن النبي ﷺ من وجوه أخر وكلها ضعيفة", reason: "Reports al-Nawawi's grade fairly, then sides with Ahmad, Ibn Ma'in, al-Bukhari and al-Daraqutni: the connected chain is not preserved, and the other routes are all weak.", url: "https://ar.wikisource.org/wiki/جامع_العلوم_والحكم/الحديث_الثاني_عشر" },
    { scholar: "Ibn Hajar al-Asqalani", died: 852, era: "classical", band: "daif", grade: "Qurra erred", source: "Ithaf al-Mahara 16/205", quoteAr: "أخطأ فيه قرة، والمحفوظ: مالك عن الزهري عن علي بن الحسين عن النبي ﷺ مرسلًا كما في الموطأ", reason: "The preserved form is the mursal in the Muwatta." },
    { scholar: "al-Albani", died: 1420, era: "contemporary", band: "sahih", grade: "Sahih", source: "Sahih al-Jami' 5911; Sahih al-Tirmidhi 2317", reason: "Accepts the text on the strength of its routes taken together." },
    { scholar: "al-Albani", died: 1420, era: "contemporary", band: "hasan", grade: "Hasan li-ghayrihi", gradeAr: "حسن لغيره", source: "Sahih al-Targhib 2881", reason: "In a different book he gives the more cautious grade: sound because of its corroborating routes, not on its own." },
    { scholar: "Shu'ayb al-Arna'ut", died: 1438, era: "contemporary", band: "hasan", grade: "Hasan li-ghayrihi", gradeAr: "حسن لشواهده", source: "Takhrij Musnad Ahmad 1732, 1737; Sahih Ibn Hibban 229", reason: "Each chain is weak on its own (Qurra; al-Umari; a break in the Husayn route), but the routes together with the sound mursal raise the text to hasan. In his takhrij of Riyad al-Salihin he goes further and calls it sound by its witnesses." },
    { scholar: "Zubair Ali Za'i", died: 1435, era: "contemporary", band: "daif", grade: "Da'if", source: "Darussalam edition of al-Tirmidhi, 2317", reason: "Grades the connected chain weak.", url: "https://sunnah.com/tirmidhi:2317" },
  ],
  lessons: [
    {
      title: "One narrator decides the argument",
      body: "Eight of the nine people in this chain are rated reliable by the critics without dispute. The argument is entirely about Qurra. Honest, said the critics, but with objectionable reports; and this, most of them concluded, is one of them. Everything downstream, hasan or error, is a judgement about one man's precision.",
    },
    {
      title: "“From” is not “I heard”",
      body: "Below Abu Mushir every link is ʿan, “from”. That is normal for this period and not in itself a fault. But it means the chain asserts less than Bukhari's first hadith does, where every narrator says he heard directly.",
    },
    {
      title: "A text can rise by corroboration, or fail to",
      body: "Later scholars gathered the other routes, each weak alone, and graded the text hasan li-ghayrihi, sound by its witnesses. Earlier masters replied that the routes return to the same error or run through abandoned narrators, so they corroborate nothing. The disagreement is about method, and both methods are on the record.",
    },
    {
      title: "Fame is not a grade",
      body: "This is hadith 12 of al-Nawawi's Forty, and one of four hadith Abu Dawud said would suffice a person for their religion. Its standing is real and its chain is contested. A record that could not hold both facts at once would be lying about one of them.",
    },
  ],
  context:
    "Abu Dawud, compiler of the Sunan, is reported by al-Khatib al-Baghdadi to have said that four hadith suffice a person for their religion: “Actions are by intentions”, this one, “A believer is not a believer until he is content for his brother with what he is content with for himself”, and “The lawful is clear and the unlawful is clear”. Ibn Abi Zayd al-Qayrawani separately named it, as Ibn al-Salah reports, among four hadith from which all good manners branch.",
  vocabulary: [
    { term: "Mursal", ar: "مرسل", meaning: "A report in which a Successor says “the Prophet ﷺ said” without naming the Companion he heard it from. A gap at the top of the chain, and a category of weakness, though some jurists accepted mursal reports from certain narrators." },
    { term: "Mahfuz", ar: "محفوظ", meaning: "The “preserved” version: of two conflicting transmissions from the same teacher, the one the stronger students carry." },
    { term: "Munkar", ar: "منكر", meaning: "An objectionable report: what a weak narrator transmits in contradiction to the reliable." },
    { term: "Shahid", ar: "شاهد", meaning: "A witness: a separate chain, through a different Companion, carrying the same meaning." },
    { term: "Hasan li-ghayrihi", ar: "حسن لغيره", meaning: "Sound by its witnesses: a weak chain raised to acceptable by independent corroboration." },
    { term: "Maqrun", ar: "مقرون", meaning: "Paired: a narrator cited only alongside another, so that the report does not rest on him alone." },
  ],
  sources: [
    { label: "Jami' al-Tirmidhi 2317 (sunnah.com)", url: "https://sunnah.com/tirmidhi:2317" },
    { label: "Ibn Rajab, Jami' al-Ulum wa al-Hikam, hadith 12 (Wikisource)", url: "https://ar.wikisource.org/wiki/جامع_العلوم_والحكم/الحديث_الثاني_عشر" },
    { label: "A. al-Aqla, study of the hadith's routes (PDF)", url: "https://tadween.sa/documents/researchDatabase/gnagj73lx4.pdf" },
    { label: "Verdict index (dorar.net)", url: "https://dorar.net/hadith/search?q=من+حسن+إسلام+المرء+تركه+ما+لا+يعنيه" },
  ],
};
