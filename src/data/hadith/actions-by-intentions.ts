import type { Hadith } from "../types";

export const actionsByIntentions: Hadith = {
  slug: "actions-by-intentions",
  title: "Actions are by intentions",
  titleAr: "إنما الأعمال بالنيات",
  takeaway:
    "What a deed is worth depends on why it was done. The same act can be devotion or self-interest depending on the intention behind it. The Prophet ﷺ gives the example of migrating to Madinah: done for God it is a sacred act; done to marry someone or make money it is only that.",
  status: {
    band: "sahih",
    label: "Sahih",
    line: "Agreed upon: recorded by both al-Bukhari and Muslim, and accepted by every scholar who examined it. Al-Bukhari opened his Sahih with it in place of a preface.",
  },
  primary: {
    cite: "bukhari:1",
    collection: "Sahih al-Bukhari",
    collectionAr: "صحيح البخاري",
    numbering: "Muhammad Fu'ad Abd al-Baqi numbering, as used in Fath al-Bari and on sunnah.com",
    number: "1",
    bookChapter: "Book of Revelation, chapter 1",
    chain: ["al-bukhari", "al-humaydi", "sufyan-ibn-uyaynah", "yahya-ibn-said", "muhammad-ibn-ibrahim-al-taymi", "alqama-ibn-waqqas", "umar-ibn-al-khattab"],
    links: [
      { from: "prophet", to: "umar-ibn-al-khattab", sighaAr: "سمعتُ رسول الله ﷺ يقول", sighaEn: "I heard the Messenger of God ﷺ say", kind: "sama" },
      { from: "umar-ibn-al-khattab", to: "alqama-ibn-waqqas", sighaAr: "سمعتُ عمر على المنبر", sighaEn: "I heard Umar, on the pulpit", kind: "sama" },
      { from: "alqama-ibn-waqqas", to: "muhammad-ibn-ibrahim-al-taymi", sighaAr: "أنه سمع علقمة يقول", sighaEn: "that he heard Alqama say", kind: "sama" },
      { from: "muhammad-ibn-ibrahim-al-taymi", to: "yahya-ibn-said", sighaAr: "أخبرني", sighaEn: "informed me", kind: "ikhbar" },
      { from: "yahya-ibn-said", to: "sufyan-ibn-uyaynah", sighaAr: "حدثنا", sighaEn: "narrated to us", kind: "sama" },
      { from: "sufyan-ibn-uyaynah", to: "al-humaydi", sighaAr: "حدثنا", sighaEn: "narrated to us", kind: "sama" },
      { from: "al-humaydi", to: "al-bukhari", sighaAr: "حدثنا", sighaEn: "narrated to us", kind: "sama" },
    ],
    isnadAr:
      "حَدَّثَنَا الْحُمَيْدِيُّ عَبْدُ اللَّهِ بْنُ الزُّبَيْرِ، قَالَ حَدَّثَنَا سُفْيَانُ، قَالَ حَدَّثَنَا يَحْيَى بْنُ سَعِيدٍ الأَنْصَارِيُّ، قَالَ أَخْبَرَنِي مُحَمَّدُ بْنُ إِبْرَاهِيمَ التَّيْمِيُّ، أَنَّهُ سَمِعَ عَلْقَمَةَ بْنَ وَقَّاصٍ اللَّيْثِيَّ، يَقُولُ سَمِعْتُ عُمَرَ بْنَ الْخَطَّابِ رضى الله عنه عَلَى الْمِنْبَرِ قَالَ سَمِعْتُ رَسُولَ اللَّهِ صلى الله عليه وسلم يَقُولُ",
    matnAr:
      "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ",
    matnEn:
      "Actions are only by intentions, and each person will have only what they intended. So whoever migrated for worldly gain, or for a woman to marry, their migration was for whatever they migrated to.",
    url: "https://sunnah.com/bukhari:1",
  },
  also: [
    { cite: "bukhari:54", label: "Sahih al-Bukhari 54", note: "Book of Faith", url: "https://sunnah.com/bukhari:54" },
    { cite: "bukhari:2529", label: "Sahih al-Bukhari 2529", note: "Book of Manumission", url: "https://sunnah.com/bukhari:2529" },
    { cite: "bukhari:3898", label: "Sahih al-Bukhari 3898", note: "Merits of the Ansar", url: "https://sunnah.com/bukhari:3898" },
    { cite: "bukhari:5070", label: "Sahih al-Bukhari 5070", note: "Book of Marriage", url: "https://sunnah.com/bukhari:5070" },
    { cite: "bukhari:6689", label: "Sahih al-Bukhari 6689", note: "Book of Oaths and Vows", url: "https://sunnah.com/bukhari:6689" },
    { cite: "bukhari:6953", label: "Sahih al-Bukhari 6953", note: "Book of Tricks", url: "https://sunnah.com/bukhari:6953" },
    { cite: "muslim:1907a", label: "Sahih Muslim 1907a", note: "via Malik; 1907b adds eight further routes from Yahya (al-Layth, Hammad ibn Zayd, Abd al-Wahhab al-Thaqafi, Abu Khalid al-Ahmar, Hafs ibn Ghiyath, Yazid ibn Harun, Ibn al-Mubarak, Sufyan ibn Uyaynah)", url: "https://sunnah.com/muslim:1907a" },
    { cite: "abudawud:2201", label: "Sunan Abi Dawud 2201", url: "https://sunnah.com/abudawud:2201" },
    { cite: "tirmidhi:1647", label: "Jami' al-Tirmidhi 1647", note: "al-Tirmidhi: hasan sahih", url: "https://sunnah.com/tirmidhi:1647" },
    { cite: "nasai:75", label: "Sunan al-Nasa'i 75", url: "https://sunnah.com/nasai:75" },
    { cite: "ibnmajah:4227", label: "Sunan Ibn Majah 4227", url: "https://sunnah.com/ibnmajah:4227" },
    { cite: "nawawi40:1", label: "al-Nawawi's Forty Hadith, 1", url: "https://sunnah.com/nawawi40:1" },
  ],
  verdicts: [
    { scholar: "al-Bukhari", died: 256, era: "classical", band: "sahih", grade: "Sahih", source: "Sahih al-Bukhari 1, 54, 2529, 3898, 5070, 6689, 6953", reason: "Chose it to open the Sahih and recorded it in seven places through five of Yahya ibn Sa'id's students (Ibn Uyaynah, Malik, al-Thawri, Hammad ibn Zayd, Abd al-Wahhab al-Thaqafi). Inclusion in the Sahih is itself a grade: every narrator meets his conditions.", url: "https://sunnah.com/bukhari:1" },
    { scholar: "Muslim ibn al-Hajjaj", died: 261, era: "classical", band: "sahih", grade: "Sahih", source: "Sahih Muslim 1907", reason: "Included in the Sahih, in the Book of Leadership.", url: "https://sunnah.com/muslim:1907" },
    { scholar: "al-Tirmidhi", died: 279, era: "classical", band: "sahih", grade: "Hasan sahih", gradeAr: "حسن صحيح", source: "Jami' al-Tirmidhi 1647", quoteAr: "هذا حديث حسن صحيح … ولا نعرفه إلا من حديث يحيى بن سعيد الأنصاري", reason: "Sound, and known only through Yahya ibn Sa'id. He also records Ibn Mahdi's remark that this hadith ought to be placed in every chapter.", url: "https://sunnah.com/tirmidhi:1647" },
    { scholar: "al-Nawawi", died: 676, era: "classical", band: "sahih", grade: "Sound by consensus", gradeAr: "أجمع المسلمون على عظم موقع هذا الحديث وكثرة فوائده وصحته", source: "al-Arba'in, hadith 1; al-Minhaj Sharh Sahih Muslim 13/53", reason: "Opened his Forty with it, noting that the two imams of hadith recorded it in their Sahihs, the soundest books composed. In his commentary on Muslim he writes that the Muslims agree on its great standing, its many benefits and its soundness.", url: "https://shamela.ws/book/1711/2863" },
    { scholar: "Ibn Rajab al-Hanbali", died: 795, era: "classical", band: "sahih", grade: "Agreed upon", gradeAr: "اتفق العلماء على صحته", source: "Jami' al-Ulum wa al-Hikam, hadith 1", quoteAr: "واتفق العلماء على صحته وتلقيه بالقبول، وبه صدر البخاري كتابه الصحيح وأقامه مقام الخطبة له", reason: "Scholars agreed on its soundness and received it with acceptance; al-Bukhari opened his Sahih with it in place of a preface. Records al-Shafi'i's remark that it enters seventy chapters of law and Ahmad's that it is one of three hadith on which Islam's foundations rest.", url: "https://ar.wikisource.org/wiki/جامع_العلوم_والحكم/الحديث_الأول" },
    { scholar: "Ibn Hajar al-Asqalani", died: 852, era: "classical", band: "sahih", grade: "Sahih, agreed upon", gradeAr: "متفق على صحته", source: "Fath al-Bari, commentary on hadith 1", quoteAr: "ثم إن هذا الحديث متفق على صحته أخرجه الأئمة المشهورون إلا الموطأ", reason: "Agreed upon by all; recorded by every famous imam except in the Muwatta. Answers al-Tabari's observation that on some people's method it would be rejected for being single-stranded: it is single-stranded only in its sound form, and only in this wording; the meaning is attested from other Companions, and those who called it mass-transmitted erred.", url: "https://ar.wikisource.org/wiki/فتح_الباري/بدء_الوحي/الحديث_الأول" },
    { scholar: "Ibn Taymiyya", died: 728, era: "classical", band: "sahih", grade: "Among the rare reports of the Sahih", gradeAr: "من غرائب الصحيح", source: "Majmu' al-Fatawa, vol. 18", reason: "Sound and single-stranded at once: his phrase for exactly this shape of chain.", url: "https://ar.wikisource.org/wiki/مجموع_الفتاوى/المجلد_الثامن_عشر/شرح_حديث_إنما_الأعمال_بالنيات" },
  ],
  fanOut: {
    afterId: "yahya-ibn-said",
    headline: "many more students of Yahya ibn Sa'id",
    detail:
      "From the Prophet ﷺ down to Yahya ibn Sa'id the report is carried by one person at each step. From Yahya it fans out: al-Bukhari alone records it through Malik, Sufyan al-Thawri, Hammad ibn Zayd and Abd al-Wahhab al-Thaqafi, and Muslim adds al-Layth, Ibn al-Mubarak, Yazid ibn Harun and others. How many carried it from Yahya was itself examined: al-Naqqash counted 250, Ibn Manda listed more than 300, a report through al-Harawi claims 700, and Ibn Hajar, who spent his life collecting routes, could not complete a hundred and doubted the larger figures.",
    named: ["Malik ibn Anas", "Sufyan al-Thawri", "Hammad ibn Zayd", "Abd al-Wahhab al-Thaqafi", "al-Layth ibn Sa'd", "Shu'ba", "Ibn al-Mubarak", "al-Awza'i"],
    source: "Ibn Hajar, Fath al-Bari on hadith 1; Ibn Rajab, Jami' al-Ulum, hadith 1",
  },
  lessons: [
    {
      title: "Rare is not the same as weak",
      body: "At its first four links this is a single-strand report (gharib): one Companion, one Successor, one student, one student again. It is still one of the most universally accepted hadith in the corpus, because every one of those people is of the highest grade. Rarity is a property the discipline records; weakness is a verdict it reaches only from the narrators.",
    },
    {
      title: "The verb on each link is evidence",
      body: "“Narrated to us” and “I heard” assert direct hearing. Sufyan ibn Uyaynah occasionally used an ambiguous “from”, and critics noted it. Here, in the standard recension, he says “narrated to us”, which closes the question before it is asked.",
    },
    {
      title: "Even a master has a file",
      body: "A report that Sufyan's memory failed in his last year is on record alongside his rank as an imam, and so is al-Dhahabi's rejection of that report. Ahmad's reservation about Muhammad ibn Ibrahim sits beside four critics who called him reliable. The record hides nothing; it lets a reader see how the balance was struck.",
    },
    {
      title: "Then it becomes famous",
      body: "Below Yahya ibn Sa'id the chain widens into hundreds of routes. A report can be rare at its root and widely attested at its trunk; both facts are tracked, and both matter for how later scholars weigh it.",
    },
  ],
  context:
    "Hadith 1 is an abridgement: the clause “whoever's migration was for God and His Messenger, his migration is for God and His Messenger” appears in al-Bukhari's other six narrations and is omitted here, a practice of his that Ibn Hajar discusses at length. A report in al-Tabarani, through Ibn Mas'ud, tells of a man who migrated to marry a woman called Umm Qays, which is often given as the occasion of the example; Ibn Hajar accepts that report's chain but notes nothing in it states the hadith was spoken about that man, and Ibn Rajab says he found no sound basis for the story as its occasion. The early imams, al-Shafi'i, Ibn Mahdi and Ahmad among them, called this hadith a third of knowledge, and Abu Dawud named it among four hadith that suffice a person for their religion.",
  vocabulary: [
    { term: "Isnad", ar: "إسناد", meaning: "The chain of people who passed the report down, named in order." },
    { term: "Matn", ar: "متن", meaning: "The text of the report itself." },
    { term: "Gharib", ar: "غريب", meaning: "A report carried by a single narrator at some point in its chain." },
    { term: "Mashhur", ar: "مشهور", meaning: "A report carried by three or more narrators at every level, short of mass transmission. This hadith is rare at its root and became mashhur from Yahya ibn Sa'id onward." },
    { term: "Thiqa", ar: "ثقة", meaning: "A narrator critics judged both upright and precise." },
    { term: "Tadlis", ar: "تدليس", meaning: "Using an ambiguous formula like “from” that hides whether the narrator heard directly." },
    { term: "Muttafaq alayh", ar: "متفق عليه", meaning: "Recorded by both al-Bukhari and Muslim from the same Companion." },
  ],
  sources: [
    { label: "Sahih al-Bukhari 1 (sunnah.com)", url: "https://sunnah.com/bukhari:1" },
    { label: "Ibn Hajar, Fath al-Bari on hadith 1 (Wikisource)", url: "https://ar.wikisource.org/wiki/فتح_الباري/بدء_الوحي/الحديث_الأول" },
    { label: "Ibn Rajab, Jami' al-Ulum wa al-Hikam, hadith 1 (Wikisource)", url: "https://ar.wikisource.org/wiki/جامع_العلوم_والحكم/الحديث_الأول" },
  ],
};
