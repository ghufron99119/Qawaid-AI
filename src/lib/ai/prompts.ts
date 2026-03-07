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

export function getPrompt(text: string, level?: string): string {
  // Role & Boundary: Senior Arabic linguistics expert, reject non-Arabic input.
  const roleInstruction = "You are a senior expert in Arabic morphology and linguistics. Reject any input that is not Arabic text and respond with a brief apology in Indonesian.";
  // CEFR level tuning
  const levelInstruction = level ? `Provide explanations appropriate for CEFR level ${level}.` : "Provide explanations suitable for a general audience.";
  // Chain-of-Thought prompt
  const cotInstruction = "Think step-by-step (Chain-of-Thought) before producing the final JSON output.";
  // Deep Morphology fields
  const morphologyNote = "Include additional fields: \"root\" (the root Jidhr) and \"pattern\" (the morphological pattern Wazn) for each word when applicable.";
  return `${roleInstruction}\n${levelInstruction}\n${cotInstruction}\n${morphologyNote}\n\nYou are an expert in Arabic grammar (Nahwu). Analyze the following Arabic sentence and provide the output as a JSON array.\n\nEvery object in the array MUST have the exact following fields:\n- \"word\": the word from the original text\n- \"type\": the type of the word (e.g., Isim, Fi'il, Harf)\n- \"i3rab\": the i'rab explanation in Arabic or transliteration (e.g., \"faa'il marfu'\", \"maf'ul bihi mansub\")\n- \"explanation\": a short explanation in Indonesian (optional)\n- \"root\": the root (Jidhr) of the word if applicable\n- \"pattern\": the morphological pattern (Wazn) of the word if applicable\n\nExample:\nInput: \"ذهب الطالب إلى المدرسة\"\nOutput:\n[\n  {\"word\": \"ذهب\", \"type\": \"Fi'il Madhi\", \"i3rab\": \"mabni 'alal fath\", \"explanation\": \"kata kerja lampau, dibangun atas fathah\", \"root\": \"ذ-ه-ب\", \"pattern\": \"فَعَلَ\"},\n  {\"word\": \"الطالب\", \"type\": \"Isim\", \"i3rab\": \"faa'il marfu'\", \"explanation\": \"subjek, tanda rafa'nya dhammah\", \"root\": \"ط-ل-ب\", \"pattern\": \"فَاعِل\"}\n]\n\nNow analyze this sentence: \"${text}\"

RETURN ONLY A VALID JSON ARRAY. No introductory or concluding text, no markdown formatting.`;
}
