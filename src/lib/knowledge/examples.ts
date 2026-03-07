/**
 * Few-Shot I'rab Examples — encoded from DatasetAI/ContohSoal.md.
 * 60 verified examples covering all major Nahwu chapters.
 *
 * Used by the Pakar Engine to inject the most relevant examples
 * into the prompt based on detected sentence structure.
 */

export interface ExampleWord {
  word: string;
  irab: string;
}

export interface IrabExample {
  id: number;
  bab: string;
  sentence: string;
  translation: string;
  words: ExampleWord[];
}

export const IRAB_EXAMPLES: IrabExample[] = [
  // ─── A. Marfu'atul Asma' ───────────────────────────────────────────
  {
    id: 1, bab: "Fa'il Mufrad",
    sentence: "قَامَ زَيْدٌ", translation: "Zaid telah berdiri",
    words: [
      { word: "قَامَ", irab: "Fi'il Madhi mabni 'ala fathah" },
      { word: "زَيْدٌ", irab: "Fa'il marfu', tanda dhommah dhohiroh (isim mufrad)" },
    ],
  },
  {
    id: 2, bab: "Fa'il Tatsniyah",
    sentence: "قَامَ الزَّيْدَانِ", translation: "Dua Zaid telah berdiri",
    words: [
      { word: "قَامَ", irab: "Fi'il Madhi mabni 'ala fathah" },
      { word: "الزَّيْدَانِ", irab: "Fa'il marfu', tanda Alif (isim tatsniyah)" },
    ],
  },
  {
    id: 3, bab: "Fa'il Jamak Mudzakkar Salim",
    sentence: "قَامَ الزَّيْدُونَ", translation: "Banyak Zaid telah berdiri",
    words: [
      { word: "قَامَ", irab: "Fi'il Madhi mabni 'ala fathah" },
      { word: "الزَّيْدُونَ", irab: "Fa'il marfu', tanda Wawu (jamak mudzakkar salim)" },
    ],
  },
  {
    id: 4, bab: "Fa'il Jamak Muannats Salim",
    sentence: "قَامَتِ الْهِنْدَاتُ", translation: "Banyak Hindun telah berdiri",
    words: [
      { word: "قَامَتِ", irab: "Fi'il Madhi mabni 'ala fathah, Ta' ta'nits" },
      { word: "الْهِنْدَاتُ", irab: "Fa'il marfu', tanda dhommah dhohiroh" },
    ],
  },
  {
    id: 5, bab: "Fa'il Asmaul Khomsah",
    sentence: "جَاءَ أَبُوكَ", translation: "Ayahmu telah datang",
    words: [
      { word: "جَاءَ", irab: "Fi'il Madhi mabni 'ala fathah" },
      { word: "أَبُو", irab: "Fa'il marfu', tanda Wawu (Asmaul Khomsah), mudhaf" },
      { word: "كَ", irab: "Dhomir muttashil fi mahalli jar, mudhaf ilaih" },
    ],
  },
  {
    id: 6, bab: "Naibul Fa'il",
    sentence: "ضُرِبَ زَيْدٌ", translation: "Zaid telah dipukul",
    words: [
      { word: "ضُرِبَ", irab: "Fi'il Madhi mabni majhul" },
      { word: "زَيْدٌ", irab: "Naibul Fa'il marfu', tanda dhommah" },
    ],
  },
  {
    id: 7, bab: "Naibul Fa'il Mudhari'",
    sentence: "يُضْرَبُ زَيْدٌ", translation: "Zaid sedang/akan dipukul",
    words: [
      { word: "يُضْرَبُ", irab: "Fi'il Mudhari' mabni majhul, marfu' tanda dhommah" },
      { word: "زَيْدٌ", irab: "Naibul Fa'il marfu', tanda dhommah" },
    ],
  },
  {
    id: 8, bab: "Mubtada' Khobar Mufrad",
    sentence: "زَيْدٌ قَائِمٌ", translation: "Zaid adalah orang yang berdiri",
    words: [
      { word: "زَيْدٌ", irab: "Mubtada' marfu', tanda dhommah" },
      { word: "قَائِمٌ", irab: "Khobar marfu', tanda dhommah" },
    ],
  },
  {
    id: 9, bab: "Mubtada' Dhomir Munfashil",
    sentence: "أَنَا قَائِمٌ", translation: "Saya adalah orang yang berdiri",
    words: [
      { word: "أَنَا", irab: "Dhomir munfashil mabni sukun fi mahalli rafa' mubtada'" },
      { word: "قَائِمٌ", irab: "Khobar marfu', tanda dhommah" },
    ],
  },
  {
    id: 10, bab: "Khobar Jar Majrur",
    sentence: "زَيْدٌ فِي الدَّارِ", translation: "Zaid berada di dalam rumah",
    words: [
      { word: "زَيْدٌ", irab: "Mubtada' marfu'" },
      { word: "فِي", irab: "Huruf Jar" },
      { word: "الدَّارِ", irab: "Isim majrur, tanda kasrah. Jar majrur berta'alluq pada khobar mahdzuf" },
    ],
  },
  {
    id: 11, bab: "Khobar Dhorof",
    sentence: "زَيْدٌ عِنْدَكَ", translation: "Zaid berada di sisimu",
    words: [
      { word: "زَيْدٌ", irab: "Mubtada' marfu'" },
      { word: "عِنْدَ", irab: "Dhorof makan manshub, berta'alluq pada khobar mahdzuf" },
      { word: "كَ", irab: "Dhomir muttashil fi mahalli jar, mudhaf ilaih" },
    ],
  },
  {
    id: 12, bab: "Khobar Jumlah Fi'liyyah",
    sentence: "زَيْدٌ قَامَ أَبُوهُ", translation: "Zaid itu, ayahnya telah berdiri",
    words: [
      { word: "زَيْدٌ", irab: "Mubtada' marfu'" },
      { word: "قَامَ", irab: "Fi'il Madhi" },
      { word: "أَبُوهُ", irab: "Fa'il marfu' tanda Wawu (Asmaul Khomsah). Jumlah fi'liyyah fi mahalli rafa' khobar" },
    ],
  },

  // ─── B. Nawasikh ───────────────────────────────────────────────────
  {
    id: 13, bab: "Isim Kaana",
    sentence: "كَانَ زَيْدٌ قَائِمًا", translation: "Zaid dahulu berdiri",
    words: [
      { word: "كَانَ", irab: "Fi'il madhi naqish" },
      { word: "زَيْدٌ", irab: "Isim Kaana marfu', tanda dhommah" },
      { word: "قَائِمًا", irab: "Khobar Kaana manshub, tanda fathah" },
    ],
  },
  {
    id: 14, bab: "Isim Laisa",
    sentence: "لَيْسَ عَمْرٌو شَاخِصًا", translation: "Umar bukanlah orang yang pergi",
    words: [
      { word: "لَيْسَ", irab: "Fi'il madhi naqish" },
      { word: "عَمْرٌو", irab: "Isim Laisa marfu', tanda dhommah" },
      { word: "شَاخِصًا", irab: "Khobar Laisa manshub, tanda fathah" },
    ],
  },
  {
    id: 15, bab: "Isim Inna",
    sentence: "إِنَّ زَيْدًا قَائِمٌ", translation: "Sesungguhnya Zaid berdiri",
    words: [
      { word: "إِنَّ", irab: "Huruf taukid dan nashab" },
      { word: "زَيْدًا", irab: "Isim Inna manshub, tanda fathah" },
      { word: "قَائِمٌ", irab: "Khobar Inna marfu', tanda dhommah" },
    ],
  },
  {
    id: 16, bab: "Isim Laita",
    sentence: "لَيْتَ عَمْرًا شَاخِصٌ", translation: "Andai saja Umar pergi",
    words: [
      { word: "لَيْتَ", irab: "Huruf tamanni dan nashab" },
      { word: "عَمْرًا", irab: "Isim Laita manshub, tanda fathah" },
      { word: "شَاخِصٌ", irab: "Khobar Laita marfu', tanda dhommah" },
    ],
  },
  {
    id: 17, bab: "Af'alul Qulub (Dhonna)",
    sentence: "ظَنَنْتُ زَيْدًا مُنْطَلِقًا", translation: "Saya menyangka Zaid pergi",
    words: [
      { word: "ظَنَنْتُ", irab: "Fi'il madhi, Ta' dhomir fa'il" },
      { word: "زَيْدًا", irab: "Maf'ul bih awwal manshub, tanda fathah" },
      { word: "مُنْطَلِقًا", irab: "Maf'ul bih tsani manshub, tanda fathah" },
    ],
  },

  // ─── C. Manshubatul Asma' ─────────────────────────────────────────
  {
    id: 18, bab: "Maf'ul Bih Isim Dhohir",
    sentence: "رَكِبْتُ الْفَرَسَ", translation: "Saya mengendarai kuda",
    words: [
      { word: "رَكِبْتُ", irab: "Fi'il madhi, Ta' dhomir fa'il" },
      { word: "الْفَرَسَ", irab: "Maf'ul bih manshub, tanda fathah dhohiroh" },
    ],
  },
  {
    id: 19, bab: "Maf'ul Bih Dhomir Muttashil",
    sentence: "ضَرَبَنِي", translation: "Dia telah memukulku",
    words: [
      { word: "ضَرَبَ", irab: "Fi'il madhi" },
      { word: "نِ", irab: "Nun wiqoyah" },
      { word: "ي", irab: "Ya' mutakallim fi mahalli nashab maf'ul bih" },
    ],
  },
  {
    id: 20, bab: "Maf'ul Bih Dhomir Munfashil",
    sentence: "إِيَّاكَ حَيَّيْتُ", translation: "Hanya kepadamu saya memberi penghormatan",
    words: [
      { word: "إِيَّاكَ", irab: "Dhomir munfashil fi mahalli nashab maf'ul bih muqaddam" },
      { word: "حَيَّيْتُ", irab: "Fi'il madhi, Ta' dhomir fa'il" },
    ],
  },
  {
    id: 21, bab: "Maf'ul Mutlaq Muakkid",
    sentence: "ضَرَبْتُ زَيْدًا ضَرْبًا", translation: "Saya benar-benar memukul Zaid",
    words: [
      { word: "ضَرَبْتُ", irab: "Fi'il madhi, Ta' dhomir fa'il" },
      { word: "زَيْدًا", irab: "Maf'ul bih manshub, tanda fathah" },
      { word: "ضَرْبًا", irab: "Maf'ul mutlaq manshub (muakkid li amilihi), tanda fathah" },
    ],
  },
  {
    id: 22, bab: "Maf'ul Mutlaq Mubayyin",
    sentence: "سِرْتُ سَيْرَ زَيْدٍ", translation: "Saya berjalan seperti jalannya Zaid",
    words: [
      { word: "سِرْتُ", irab: "Fi'il madhi, Ta' dhomir fa'il" },
      { word: "سَيْرَ", irab: "Maf'ul mutlaq manshub (mubayyin lin nau'), mudhaf" },
      { word: "زَيْدٍ", irab: "Mudhaf ilaih majrur, tanda kasrah" },
    ],
  },
  {
    id: 23, bab: "Maf'ul Liajlih",
    sentence: "قُمْتُ إِجْلَالًا لِعَمْرٍو", translation: "Saya berdiri karena mengagungkan Umar",
    words: [
      { word: "قُمْتُ", irab: "Fi'il madhi, Ta' dhomir fa'il" },
      { word: "إِجْلَالًا", irab: "Maf'ul liajlih manshub, tanda fathah" },
      { word: "لِعَمْرٍو", irab: "Lam huruf jar, 'Amru isim majrur tanda kasrah" },
    ],
  },
  {
    id: 24, bab: "Maf'ul Ma'ah",
    sentence: "سِيرِي وَالطَّرِيقَ مُسْرِعَةً", translation: "Berjalanlah menyusuri jalan dengan cepat",
    words: [
      { word: "سِيرِي", irab: "Fi'il Amr mabni sukun, Ya' dhomir fa'il" },
      { word: "وَ", irab: "Wawu Ma'iyyah" },
      { word: "الطَّرِيقَ", irab: "Maf'ul ma'ah manshub, tanda fathah" },
      { word: "مُسْرِعَةً", irab: "Hal manshub, tanda fathah" },
    ],
  },
  {
    id: 25, bab: "Dhorof Zaman",
    sentence: "صُمْتُ يَوْمَ الْجُمُعَةِ", translation: "Saya puasa pada hari Jumat",
    words: [
      { word: "صُمْتُ", irab: "Fi'il madhi, Ta' dhomir fa'il" },
      { word: "يَوْمَ", irab: "Dhorof Zaman manshub (maf'ul fih), tanda fathah, mudhaf" },
      { word: "الْجُمُعَةِ", irab: "Mudhaf ilaih majrur, tanda kasrah" },
    ],
  },
  {
    id: 26, bab: "Dhorof Makan",
    sentence: "جَلَسْتُ أَمَامَكَ", translation: "Saya duduk di depanmu",
    words: [
      { word: "جَلَسْتُ", irab: "Fi'il madhi, Ta' dhomir fa'il" },
      { word: "أَمَامَ", irab: "Dhorof Makan manshub (maf'ul fih), tanda fathah, mudhaf" },
      { word: "كَ", irab: "Dhomir muttashil fi mahalli jar, mudhaf ilaih" },
    ],
  },
  {
    id: 27, bab: "Hal",
    sentence: "جَاءَ زَيْدٌ رَاكِبًا", translation: "Zaid datang dalam keadaan berkendara",
    words: [
      { word: "جَاءَ", irab: "Fi'il Madhi mabni 'ala fathah" },
      { word: "زَيْدٌ", irab: "Fa'il marfu', tanda dhommah" },
      { word: "رَاكِبًا", irab: "Hal manshub, tanda fathah" },
    ],
  },
  {
    id: 28, bab: "Tamyiz Nisbat",
    sentence: "تَصَبَّبَ زَيْدٌ عَرَقًا", translation: "Zaid bercucuran keringatnya",
    words: [
      { word: "تَصَبَّبَ", irab: "Fi'il Madhi mabni 'ala fathah" },
      { word: "زَيْدٌ", irab: "Fa'il marfu', tanda dhommah" },
      { word: "عَرَقًا", irab: "Tamyiz manshub (muhawwal min fa'il), tanda fathah" },
    ],
  },
  {
    id: 29, bab: "Tamyiz Adad",
    sentence: "اشْتَرَيْتُ عِشْرِينَ غُلَامًا", translation: "Saya membeli 20 pembantu",
    words: [
      { word: "اشْتَرَيْتُ", irab: "Fi'il madhi, Ta' dhomir fa'il" },
      { word: "عِشْرِينَ", irab: "Maf'ul bih manshub, tanda Ya' (mulhaq jamak mudzakkar salim)" },
      { word: "غُلَامًا", irab: "Tamyiz manshub, tanda fathah" },
    ],
  },
  {
    id: 30, bab: "Mustatsna Tam Mujab",
    sentence: "قَامَ الْقَوْمُ إِلَّا زَيْدًا", translation: "Semua kaum berdiri kecuali Zaid",
    words: [
      { word: "قَامَ", irab: "Fi'il Madhi" },
      { word: "الْقَوْمُ", irab: "Fa'il marfu', tanda dhommah" },
      { word: "إِلَّا", irab: "Adat Istisna'" },
      { word: "زَيْدًا", irab: "Mustatsna manshub wajib (kalam tam mujab), tanda fathah" },
    ],
  },
  {
    id: 31, bab: "Mustatsna Mufarragh",
    sentence: "مَا قَامَ إِلَّا زَيْدٌ", translation: "Tidak ada yang berdiri kecuali Zaid",
    words: [
      { word: "مَا", irab: "Huruf Nafi" },
      { word: "قَامَ", irab: "Fi'il Madhi" },
      { word: "إِلَّا", irab: "Adat istisna' mulghoh" },
      { word: "زَيْدٌ", irab: "Fa'il marfu', tanda dhommah" },
    ],
  },
  {
    id: 32, bab: "Munada Mufrod Alam",
    sentence: "يَا زَيْدُ", translation: "Wahai Zaid",
    words: [
      { word: "يَا", irab: "Huruf Nida'" },
      { word: "زَيْدُ", irab: "Munada mufrod alam, mabni 'ala dhommah fi mahalli nashab" },
    ],
  },
  {
    id: 33, bab: "Munada Mudhaf",
    sentence: "يَا غُلَامَ زَيْدٍ", translation: "Wahai pembantunya Zaid",
    words: [
      { word: "يَا", irab: "Huruf Nida'" },
      { word: "غُلَامَ", irab: "Munada mudhaf manshub, tanda fathah" },
      { word: "زَيْدٍ", irab: "Mudhaf ilaih majrur, tanda kasrah" },
    ],
  },
  {
    id: 34, bab: "Isim Laa Li Nafyil Jinsi",
    sentence: "لَا رَجُلَ فِي الدَّارِ", translation: "Tidak ada laki-laki di dalam rumah",
    words: [
      { word: "لَا", irab: "Huruf nafi jinis (beramal seperti Inna)" },
      { word: "رَجُلَ", irab: "Isim Laa mufrad, mabni 'ala fathah fi mahalli nashab" },
      { word: "فِي", irab: "Huruf Jar" },
      { word: "الدَّارِ", irab: "Isim majrur, tanda kasrah. Jar majrur berta'alluq pada khobar Laa mahdzuf" },
    ],
  },

  // ─── D. Majruratul Asma' ──────────────────────────────────────────
  {
    id: 35, bab: "Majrur Huruf Jar",
    sentence: "مَرَرْتُ بِزَيْدٍ", translation: "Saya berpapasan dengan Zaid",
    words: [
      { word: "مَرَرْتُ", irab: "Fi'il madhi, Ta' dhomir fa'il" },
      { word: "بِـ", irab: "Huruf Jar" },
      { word: "زَيْدٍ", irab: "Isim majrur dengan Ba', tanda kasrah dhohiroh" },
    ],
  },
  {
    id: 36, bab: "Idhafah Lam",
    sentence: "غُلَامُ زَيْدٍ", translation: "Pembantunya Zaid (milik Zaid)",
    words: [
      { word: "غُلَامُ", irab: "Mudhaf marfu' (atau sesuai posisi), tanda dhommah" },
      { word: "زَيْدٍ", irab: "Mudhaf ilaih majrur, tanda kasrah. Idhafah bermakna Lam (kepemilikan)" },
    ],
  },
  {
    id: 37, bab: "Idhafah Min",
    sentence: "خَاتَمُ حَدِيدٍ", translation: "Cincin dari besi",
    words: [
      { word: "خَاتَمُ", irab: "Mudhaf marfu' (atau sesuai posisi), tanda dhommah" },
      { word: "حَدِيدٍ", irab: "Mudhaf ilaih majrur, tanda kasrah. Idhafah bermakna Min (jenis bahan)" },
    ],
  },

  // ─── E. Tawabi' ───────────────────────────────────────────────────
  {
    id: 38, bab: "Na'at Haqiqi",
    sentence: "جَاءَ زَيْدٌ الْعَاقِلُ", translation: "Telah datang Zaid yang berakal",
    words: [
      { word: "جَاءَ", irab: "Fi'il Madhi" },
      { word: "زَيْدٌ", irab: "Fa'il marfu' (Man'ut), tanda dhommah" },
      { word: "الْعَاقِلُ", irab: "Na'at Haqiqi marfu' (mengikuti man'ut), tanda dhommah" },
    ],
  },
  {
    id: 39, bab: "Na'at Sababi",
    sentence: "جَاءَ رَجُلٌ حَسَنَةٌ أُمُّهُ", translation: "Datang seorang laki-laki yang ibunya cantik",
    words: [
      { word: "جَاءَ", irab: "Fi'il Madhi" },
      { word: "رَجُلٌ", irab: "Fa'il marfu' (Man'ut), tanda dhommah" },
      { word: "حَسَنَةٌ", irab: "Na'at Sababi marfu' (mengikuti man'ut), muannats menyesuaikan isim setelahnya" },
      { word: "أُمُّهُ", irab: "Fa'il dari sifat musyabbahah 'hasanah', marfu' tanda dhommah" },
    ],
  },
  {
    id: 40, bab: "Athaf Nasaq",
    sentence: "قَامَ زَيْدٌ وَعَمْرٌو", translation: "Zaid dan Umar telah berdiri",
    words: [
      { word: "قَامَ", irab: "Fi'il Madhi" },
      { word: "زَيْدٌ", irab: "Fa'il marfu', tanda dhommah" },
      { word: "وَ", irab: "Huruf Athaf" },
      { word: "عَمْرٌو", irab: "Ma'thuf marfu' (mengikuti ma'thuf alaih), tanda dhommah" },
    ],
  },
  {
    id: 41, bab: "Taukid Maknawi",
    sentence: "قَامَ زَيْدٌ نَفْسُهُ", translation: "Zaid dirinya sendiri telah berdiri",
    words: [
      { word: "قَامَ", irab: "Fi'il Madhi" },
      { word: "زَيْدٌ", irab: "Fa'il marfu', tanda dhommah" },
      { word: "نَفْسُ", irab: "Taukid maknawi marfu' (mengikuti muakkad), tanda dhommah, mudhaf" },
      { word: "هُ", irab: "Dhomir muttashil fi mahalli jar, mudhaf ilaih" },
    ],
  },
  {
    id: 42, bab: "Badal Kul min Kul",
    sentence: "قَامَ زَيْدٌ أَخُوكَ", translation: "Telah berdiri Zaid, yaitu saudaramu",
    words: [
      { word: "قَامَ", irab: "Fi'il Madhi" },
      { word: "زَيْدٌ", irab: "Fa'il marfu' (mubdal minhu), tanda dhommah" },
      { word: "أَخُو", irab: "Badal kul min kul marfu', tanda Wawu (Asmaul Khomsah), mudhaf" },
      { word: "كَ", irab: "Dhomir muttashil fi mahalli jar, mudhaf ilaih" },
    ],
  },
  {
    id: 43, bab: "Badal Ba'dh min Kul",
    sentence: "أَكَلْتُ الرَّغِيفَ ثُلُثَهُ", translation: "Saya memakan roti, yaitu sepertiganya",
    words: [
      { word: "أَكَلْتُ", irab: "Fi'il madhi, Ta' dhomir fa'il" },
      { word: "الرَّغِيفَ", irab: "Maf'ul bih manshub (mubdal minhu), tanda fathah" },
      { word: "ثُلُثَ", irab: "Badal ba'dh min kul manshub, tanda fathah, mudhaf" },
      { word: "هُ", irab: "Dhomir muttashil fi mahalli jar, mudhaf ilaih" },
    ],
  },
  {
    id: 44, bab: "Badal Isytimal",
    sentence: "نَفَعَنِي زَيْدٌ عِلْمُهُ", translation: "Zaid memberi manfaat, yaitu ilmunya",
    words: [
      { word: "نَفَعَ", irab: "Fi'il Madhi" },
      { word: "نِي", irab: "Nun wiqoyah + Ya' mutakallim fi mahalli nashab maf'ul bih" },
      { word: "زَيْدٌ", irab: "Fa'il marfu' (mubdal minhu), tanda dhommah" },
      { word: "عِلْمُ", irab: "Badal isytimal marfu' (mengikuti Zaid), tanda dhommah, mudhaf" },
      { word: "هُ", irab: "Dhomir muttashil fi mahalli jar, mudhaf ilaih" },
    ],
  },

  // ─── F. I'rab Khusus ──────────────────────────────────────────────
  {
    id: 45, bab: "Ghairu Munsharif",
    sentence: "مَرَرْتُ بِأَحْمَدَ", translation: "Saya berpapasan dengan Ahmad",
    words: [
      { word: "مَرَرْتُ", irab: "Fi'il madhi, Ta' dhomir fa'il" },
      { word: "بِـ", irab: "Huruf Jar" },
      { word: "أَحْمَدَ", irab: "Isim majrur, tanda fathah (niyabah dari kasrah) karena ghairu munsharif" },
    ],
  },
  {
    id: 46, bab: "Isim Maqshur",
    sentence: "جَاءَ الْفَتَى", translation: "Telah datang seorang pemuda",
    words: [
      { word: "جَاءَ", irab: "Fi'il Madhi" },
      { word: "الْفَتَى", irab: "Fa'il marfu', tanda dhommah muqoddaroh 'ala Alif (ta'adzdzur)" },
    ],
  },
  {
    id: 47, bab: "Isim Manqush Nashab",
    sentence: "رَأَيْتُ الْقَاضِيَ", translation: "Saya melihat seorang hakim",
    words: [
      { word: "رَأَيْتُ", irab: "Fi'il madhi, Ta' dhomir fa'il" },
      { word: "الْقَاضِيَ", irab: "Maf'ul bih manshub, tanda fathah dhohiroh" },
    ],
  },
  {
    id: 48, bab: "Isim Manqush Jar",
    sentence: "مَرَرْتُ بِالْقَاضِي", translation: "Saya berpapasan dengan hakim",
    words: [
      { word: "مَرَرْتُ", irab: "Fi'il madhi, Ta' dhomir fa'il" },
      { word: "بِـ", irab: "Huruf Jar" },
      { word: "الْقَاضِي", irab: "Isim majrur, tanda kasrah muqoddaroh 'ala Ya' (tsiqol)" },
    ],
  },
  {
    id: 49, bab: "Mudhaf ke Ya' Mutakallim",
    sentence: "جَاءَ غُلَامِي", translation: "Pembantuku telah datang",
    words: [
      { word: "جَاءَ", irab: "Fi'il Madhi" },
      { word: "غُلَامِي", irab: "Fa'il marfu', tanda dhommah muqoddaroh (isytighalul mahal). Ya' mutakallim mudhaf ilaih" },
    ],
  },

  // ─── G. I'rab Fi'il Mudhari' ──────────────────────────────────────
  {
    id: 51, bab: "Mudhari' Marfu'",
    sentence: "يَضْرِبُ زَيْدٌ", translation: "Zaid memukul",
    words: [
      { word: "يَضْرِبُ", irab: "Fi'il mudhari' marfu' (tajarrud), tanda dhommah dhohiroh" },
      { word: "زَيْدٌ", irab: "Fa'il marfu', tanda dhommah" },
    ],
  },
  {
    id: 52, bab: "Mudhari' Mu'tal Alif",
    sentence: "يَخْشَى زَيْدٌ", translation: "Zaid takut",
    words: [
      { word: "يَخْشَى", irab: "Fi'il mudhari' marfu', tanda dhommah muqoddaroh 'ala Alif (ta'adzdzur)" },
      { word: "زَيْدٌ", irab: "Fa'il marfu', tanda dhommah" },
    ],
  },
  {
    id: 53, bab: "Mudhari' Manshub Lan",
    sentence: "لَنْ يَضْرِبَ", translation: "Dia tidak akan memukul",
    words: [
      { word: "لَنْ", irab: "Huruf Nashab" },
      { word: "يَضْرِبَ", irab: "Fi'il mudhari' manshub dengan lan, tanda fathah dhohiroh" },
    ],
  },
  {
    id: 54, bab: "Mudhari' Manshub Hatta",
    sentence: "سِرْتُ حَتَّى أَدْخُلَ الْبَلَدَ", translation: "Saya berjalan hingga masuk negara itu",
    words: [
      { word: "سِرْتُ", irab: "Fi'il madhi, Ta' dhomir fa'il" },
      { word: "حَتَّى", irab: "Huruf jar dan nashab (An mudhmaroh wujub setelahnya)" },
      { word: "أَدْخُلَ", irab: "Fi'il mudhari' manshub oleh An mudhmaroh, tanda fathah" },
      { word: "الْبَلَدَ", irab: "Maf'ul bih manshub, tanda fathah" },
    ],
  },
  {
    id: 55, bab: "Mudhari' Majzum Lam",
    sentence: "لَمْ يَضْرِبْ", translation: "Dia belum memukul",
    words: [
      { word: "لَمْ", irab: "Huruf Jazm" },
      { word: "يَضْرِبْ", irab: "Fi'il mudhari' majzum dengan lam, tanda sukun" },
    ],
  },
  {
    id: 56, bab: "Mudhari' Mu'tal Jazm Wawu",
    sentence: "لَمْ يَدْعُ", translation: "Dia belum berdoa",
    words: [
      { word: "لَمْ", irab: "Huruf Jazm" },
      { word: "يَدْعُ", irab: "Fi'il mudhari' majzum, tanda membuang huruf 'illat (Wawu)" },
    ],
  },
  {
    id: 57, bab: "Mudhari' Mu'tal Jazm Ya'",
    sentence: "لَمْ يَرْمِ", translation: "Dia belum melempar",
    words: [
      { word: "لَمْ", irab: "Huruf Jazm" },
      { word: "يَرْمِ", irab: "Fi'il mudhari' majzum, tanda membuang huruf 'illat (Ya')" },
    ],
  },
  {
    id: 58, bab: "Af'alul Khomsah Rafa'",
    sentence: "الزَّيْدَانِ يَضْرِبَانِ", translation: "Dua Zaid sedang memukul",
    words: [
      { word: "الزَّيْدَانِ", irab: "Mubtada' marfu', tanda Alif (tatsniyah)" },
      { word: "يَضْرِبَانِ", irab: "Fi'il mudhari' marfu', tanda tsubutun nun (af'alul khomsah). Alif dhomir fa'il" },
    ],
  },
  {
    id: 59, bab: "Af'alul Khomsah Nashab",
    sentence: "لَنْ تَضْرِبِي", translation: "Kamu (pr) tidak akan memukul",
    words: [
      { word: "لَنْ", irab: "Huruf Nashab" },
      { word: "تَضْرِبِي", irab: "Fi'il mudhari' manshub, tanda hadzfun nun (af'alul khomsah)" },
    ],
  },
  {
    id: 60, bab: "Af'alul Khomsah Jazm",
    sentence: "لَمْ يَفْعَلَا", translation: "Mereka berdua belum melakukan",
    words: [
      { word: "لَمْ", irab: "Huruf Jazm" },
      { word: "يَفْعَلَا", irab: "Fi'il mudhari' majzum, tanda hadzfun nun (af'alul khomsah). Alif dhomir fa'il" },
    ],
  },
];
