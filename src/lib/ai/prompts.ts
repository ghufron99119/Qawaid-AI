export function getQuizPrompt(count: number, difficulty?: string, contextTexts?: string[]): string {
  const difficultyMap: Record<string, string> = {
    beginner: 'pemula (konsep dasar seperti isim, fi\'il, harf, mubtada\', khabar)',
    intermediate: 'menengah (konsep seperti i\'rab, nakirah/ma\'rifah, dhamir, maf\'ul bihi)',
    advanced: 'lanjut (konsep kompleks seperti tawabik, asmaaf_khomsah, idhofah, fi\'il mu\'tholli)',
  };
  const difficultyLabel = difficulty && difficultyMap[difficulty] ? difficultyMap[difficulty] : 'umum (campuran dari dasar hingga menengah)';

  const contextSection = contextTexts && contextTexts.length > 0
    ? `Gunakan teks-teks Arab berikut sebagai konteks soal jika relevan:\n${contextTexts.map((t, i) => `${i + 1}. ${t}`).join('\n')}`
    : 'Gunakan pengetahuan umum tata bahasa Arab Nahwu/Sharaf.';

  return `Anda adalah ahli pembuat soal tata bahasa Arab (Nahwu/Sharaf). Buatlah ${count} soal pilihan ganda dengan tingkat kesulitan: ${difficultyLabel}.

${contextSection}

Setiap soal HARUS memiliki:
- "question": pertanyaan dalam bahasa Indonesia (bisa mengutip kata/kalimat Arab)
- "options": array 4 pilihan jawaban sebagai string (A, B, C, D)
- "correctAnswer": indeks jawaban benar (0 untuk A, 1 untuk B, 2 untuk C, 3 untuk D)

Contoh format output:
[
  {
    "question": "Apa jenis kata 'ذهب' dalam kalimat 'ذهب الطالب إلى المدرسة'?",
    "options": ["Isim", "Fi'il Madhi", "Harf Jar", "Isim Maushul"],
    "correctAnswer": 1
  }
]

KEMBALIKAN HANYA JSON ARRAY YANG VALID. Tidak ada teks pembuka, penutup, atau markdown.`;
}

export function getPrompt(text: string): string {
  return `You are an expert in Arabic grammar (Nahwu). Analyze the following Arabic sentence and provide the output as a JSON array.

Every object in the array MUST have the exact following fields:
- "word": the word from the original text
- "type": the type of the word (e.g., Isim, Fi'il, Harf)
- "i3rab": the i'rab explanation in Arabic or transliteration (e.g., "faa'il marfu'", "maf'ul bihi mansub")
- "explanation": a short explanation in Indonesian (optional)

Example:
Input: "ذهب الطالب إلى المدرسة"
Output:
[
  {"word": "ذهب", "type": "Fi'il Madhi", "i3rab": "mabni 'alal fath", "explanation": "kata kerja lampau, dibangun atas fathah"},
  {"word": "الطالب", "type": "Isim", "i3rab": "faa'il marfu'", "explanation": "subjek, tanda rafa'nya dhammah"},
  {"word": "إلى", "type": "Harf Jar", "i3rab": "mabni", "explanation": "huruf jar"},
  {"word": "المدرسة", "type": "Isim", "i3rab": "ism majrur", "explanation": "kata benda yang dijarkan, tanda jarnya kasrah"}
]

Now analyze this sentence: "${text}"

RETURN ONLY A VALID JSON ARRAY. No introductory or concluding text, no markdown formatting.`;
}
