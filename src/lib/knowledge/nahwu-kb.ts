/**
 * Nahwu Knowledge Base — encoded from Matan Al-Ajurrumiyyah & Nadzom Al-Imrithi.
 * Source: DatasetAI/Qoidah.md
 *
 * Used by the Pakar Engine for Dynamic Knowledge Retrieval (Vector-less RAG).
 */

export interface KaidahEntry {
  bab: string;
  tags: string[];
  rules: string[];
}

export const NAHWU_KB: KaidahEntry[] = [
  // ─── BAB 1: Kalam & Pembagian Kalimah ─────────────────────────────
  {
    bab: "Kalam dan Pembagian Kalimah",
    tags: ["kalam", "kalimah", "isim", "fiil", "harf", "tanda isim", "tanda fiil", "tanda harf"],
    rules: [
      "Kalam menurut ahli nahwu: lafadz murakkab, mufid, dan bi-wadho' (bahasa Arab).",
      "Kalimah terbagi 3: Isim, Fi'il, Huruf.",
      "Tanda Isim: menerima jar, tanwin, Alif-Lam (AL), dan kemasukan huruf jar (min, ila, 'an, 'ala, fi, rubba, ba', kaf, lam, huruf qasam).",
      "Tanda Fi'il: menerima qad, sin, saufa, ta' ta'nits sakinah, ta' fa'il, nun taukid, ya' muannatsah mukhatabah.",
      "Tanda Huruf: tidak menerima tanda isim maupun tanda fi'il.",
    ],
  },

  // ─── BAB 2: I'rab dan Pembagiannya ─────────────────────────────────
  {
    bab: "I'rab dan Pembagiannya",
    tags: ["i'rab", "rafa'", "nashab", "jar", "khafadh", "jazm", "tanda i'rab"],
    rules: [
      "I'rab: perubahan akhir kalimah karena perbedaan amil, baik lafdziy (harakat) maupun taqdiriy.",
      "I'rab terbagi 4: Rafa', Nashab, Khafadh (Jar), Jazm.",
      "Isim hanya bisa: Rafa', Nashab, Khafadh — tidak bisa di-jazm.",
      "Fi'il hanya bisa: Rafa', Nashab, Jazm — tidak bisa di-khafadh.",
    ],
  },

  // ─── BAB 3: Tanda-Tanda I'rab ─────────────────────────────────────
  {
    bab: "Tanda-Tanda I'rab",
    tags: [
      "dhommah", "fathah", "kasrah", "sukun", "wawu", "alif", "nun",
      "hadzfun nun", "ghairu munsharif", "maqshur", "manqush",
      "asmaul khomsah", "af'alul khomsah", "tatsniyah", "mutsanna",
      "jamak mudzakkar salim", "jamak muannats salim", "jamak taksir",
      "isim mufrad", "fi'il mudhari'"
    ],
    rules: [
      "Tanda Rafa' (4): Dhommah (isim mufrad, jamak taksir, jamak muannats salim, fi'il mudhari'), Wawu (jamak mudzakkar salim, asmaul khomsah), Alif (isim tatsniyah), Nun (af'alul khomsah).",
      "Tanda Nashab (5): Fathah (isim mufrad, jamak taksir, fi'il mudhari'), Alif (asmaul khomsah), Kasrah (jamak muannats salim), Ya' (tatsniyah, jamak mudzakkar salim), Hadzfun Nun (af'alul khomsah).",
      "Tanda Khafadh/Jar (3): Kasrah (isim mufrad munsharif, jamak taksir munsharif, jamak muannats salim), Ya' (asmaul khomsah, tatsniyah, jamak mudzakkar salim), Fathah (isim ghairu munsharif).",
      "Tanda Jazm (2): Sukun (fi'il mudhari' shahih akhir), Membuang huruf 'illat atau nun (fi'il mudhari' mu'tal akhir, af'alul khomsah).",
    ],
  },

  // ─── BAB 4: Marfu'atul Asma' ──────────────────────────────────────
  {
    bab: "Marfu'atul Asma'",
    tags: [
      "fa'il", "naibul fa'il", "mubtada'", "khobar", "isim kaana",
      "khobar inna", "marfu'", "rafa'", "jumlah ismiyyah", "jumlah fi'liyyah"
    ],
    rules: [
      "7 isim yang wajib Rafa': Fa'il, Naibul Fa'il, Mubtada', Khobar, Isim Kaana, Khobar Inna, dan Tabi' marfu'.",
      "Fa'il: isim marfu' yang disebutkan setelah fi'ilnya.",
      "Naibul Fa'il: maf'ul bih yang menggantikan fa'il yang dibuang, fi'ilnya diubah ke bentuk majhul.",
      "Mubtada': isim marfu' yang sepi dari amil lafdziy (awal jumlah ismiyyah).",
      "Khobar: isim marfu' yang disandarkan kepada mubtada' untuk menyempurnakan makna.",
    ],
  },

  // ─── BAB 5: Nawasikh (Kaana, Inna, dll) ───────────────────────────
  {
    bab: "Nawasikh (Kaana & Inna)",
    tags: [
      "kaana", "laisa", "inna", "anna", "laita", "la'alla", "ka'anna",
      "isim kaana", "khobar kaana", "isim inna", "khobar inna",
      "nawasikh", "dhonna", "af'alul qulub"
    ],
    rules: [
      "Kaana dan saudara-saudaranya: merafa'kan isim dan menashabkan khobar.",
      "Saudara Kaana: kaana, asbaha, amsa, adha, bata, shaara, laisa, maa daama, maa zaala, maa fati'a, maa bariha, maa infakka.",
      "Inna dan saudara-saudaranya: menashabkan isim dan merafa'kan khobar.",
      "Saudara Inna: inna, anna, ka'anna, laita, la'alla, lakinna.",
      "Af'alul Qulub (Dhonna dkk): menashabkan dua maf'ul bih (maf'ul awwal & tsani).",
    ],
  },

  // ─── BAB 6: Manshubatul Asma' ─────────────────────────────────────
  {
    bab: "Manshubatul Asma'",
    tags: [
      "maf'ul bih", "maf'ul mutlaq", "maf'ul liajlih", "maf'ul ma'ah",
      "maf'ul fih", "dhorof zaman", "dhorof makan",
      "hal", "tamyiz", "mustatsna", "munada", "isim laa",
      "nashab", "manshub"
    ],
    rules: [
      "15 isim yang wajib Nashab, di antaranya: Maf'ul Bih, Maf'ul Mutlaq, Dhorof Zaman, Dhorof Makan, Hal, Tamyiz, Mustatsna, Isim Laa, Munada, Maf'ul li Ajlih, Maf'ul Ma'ah.",
      "Maf'ul Bih: objek yang terkena pekerjaan fi'il, manshub.",
      "Hal: menjelaskan keadaan (haiat) shohibul hal, selalu nakirah dan manshub.",
      "Tamyiz: menjelaskan kesamaran dzat atau nisbat, selalu nakirah dan manshub.",
      "Mustatsna: yang dikecualikan oleh illa/ghair/siwa. Wajib nashab jika kalam tam mujab.",
      "Munada mufrod alam: mabni 'ala dhommah fi mahalli nashab.",
    ],
  },

  // ─── BAB 7: Makhfudhatul Asma' (Majrurat) ────────────────────────
  {
    bab: "Makhfudhatul Asma' (Jar)",
    tags: [
      "huruf jar", "jar", "khafadh", "majrur", "idhafah",
      "mudhaf", "mudhaf ilaih", "bi", "li", "fi", "min", "ila", "'an", "'ala"
    ],
    rules: [
      "Isim di-jar-kan oleh 3 amil: Huruf Jar, Idhafah, atau Tabi'.",
      "Huruf Jar: min, ila, 'an, 'ala, fi, rubba, ba', kaf, lam, huruf qasam (wallahi, billahi, tallahi).",
      "Idhafah menyimpan makna: Lam (kepemilikan), Min (jenis), atau Fi (tempat/waktu).",
      "Mudhaf wajib membuang tanwin atau nun tatsniyah/jamak.",
    ],
  },

  // ─── BAB 8: Tawabi' ───────────────────────────────────────────────
  {
    bab: "At-Tawabi' (Pengikut I'rab)",
    tags: [
      "tabi'", "na'at", "sifat", "athaf", "taukid", "badal",
      "na'at haqiqi", "na'at sababi", "ma'thuf", "badal kul",
      "badal ba'dh", "badal isytimal"
    ],
    rules: [
      "Tabi' terbagi 4: Na'at, Athaf, Taukid, Badal.",
      "Na'at (Sifat): mengikuti man'ut dalam rafa'/nashab/jar, ma'rifat/nakirah.",
      "Athaf (Kata Hubung): mengikuti ma'thuf 'alaih dengan perantara huruf athaf (wawu, fa, tsumma, aw, am, bal, lakin, hatta).",
      "Taukid (Penguat): mengikuti muakkad, menggunakan nafs, 'ain, kull, ajma'.",
      "Badal (Pengganti): mengikuti mubdal minhu tanpa huruf athaf. Jenis: kul min kul, ba'dh min kul, isytimal, ghalath.",
    ],
  },

  // ─── BAB 9: I'rab Fi'il Mudhari' ─────────────────────────────────
  {
    bab: "I'rab Fi'il Mudhari'",
    tags: [
      "fi'il mudhari'", "rafa' fi'il", "nashab fi'il", "jazm fi'il",
      "lan", "an", "kay", "lam", "lam ta'lil", "hatta",
      "lam amr", "la nahyy", "in syarthiyyah",
      "mu'tal akhir", "shahih akhir", "af'alul khomsah"
    ],
    rules: [
      "Fi'il Mudhari' marfu' jika tajarrud (sepi dari amil nashab/jazm). Tanda: dhommah (shahih akhir), muqoddaroh (mu'tal akhir), tsubutun nun (af'alul khomsah).",
      "Fi'il Mudhari' manshub oleh: an, lan, idzan, kay, lam ta'lil, hatta. Tanda: fathah (shahih akhir), muqoddaroh (mu'tal alif), hadzfun nun (af'alul khomsah).",
      "Fi'il Mudhari' majzum oleh: lam, lamma, lam amr, la nahyy, in syarthiyyah. Tanda: sukun (shahih akhir), hadzful 'illat (mu'tal akhir), hadzfun nun (af'alul khomsah).",
    ],
  },
];

/**
 * Retrieve all bab entries. Useful for building the full knowledge summary.
 */
export function getKnowledgeSummary(): string {
  return NAHWU_KB
    .map(k => `### ${k.bab}\n${k.rules.map(r => `- ${r}`).join('\n')}`)
    .join('\n\n');
}
