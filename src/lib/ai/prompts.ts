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
