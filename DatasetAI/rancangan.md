1. Implementasi "Dynamic Knowledge Retrieval"
Kita tidak akan memasukkan seluruh 60 contoh ke setiap prompt (karena akan menghabiskan token dan membuat CPU lambat). Kita akan menggunakan teknik RAG Sederhana (Vector-less RAG).

Buat file: src/lib/ai/pakar-engine.ts

TypeScript
import { ringkasanAjurrumiyyahImrithi } from "../knowledge";

// Fungsi untuk mengambil bab yang relevan berdasarkan kata kunci
export function getRelevantKaidah(detectedType: string) {
  // Jika AI mendeteksi Isim, kita berikan bab Marfu'atul Asma', dll.
  return ringkasanAjurrumiyyahImrithi
    .filter(k => k.bab.toLowerCase().includes(detectedType.toLowerCase()))
    .map(k => k.poin_poin.join("\n"))
    .join("\n");
}
2. Update System Prompt: "The Pakar Mode"
Sekarang kita ubah analyze-v2.ts agar menggunakan data tersebut sebagai referensi utama.

TypeScript
export const pakarAnalyzePrompt = (text: string, relevantExamples: string) => `
### ROLE
Anda adalah "Al-Mu'rib", pakar Nahwu tingkat tinggi yang merujuk pada Matan Al-Ajurrumiyyah dan Nadzom Al-Imrithi.

### KNOWLEDGE BASE (SANAD)
Berikut adalah kaidah yang harus Anda ikuti:
${ringkasanAjurrumiyyahImrithi.map(k => `- ${k.bab}: ${k.poin_poin[0]}`).join("\n")}

### REFERENCE EXAMPLES (FEW-SHOT)
Gunakan pola i'rab dari contoh shahih berikut:
${relevantExamples}

### INPUT SENTENCE
"${text}"

### INSTRUCTION
1. Analisis per kata dengan logika berantai (Chain of Thought).
2. Tentukan Kedudukan (Role) dan Tanda I'rab (Sign).
3. Sertakan alasan berdasarkan kaidah di atas.
4. Pastikan output HANYA JSON.

### SCHEMA
{
  "sentence": string,
  "analysis": [{
    "word": string,
    "logical_process": string, // Proses berpikir ala Nahwu
    "type": "isim" | "fiil" | "harf",
    "role": string, // Contoh: Fa'il, Mubtada'
    "sign": string, // Contoh: Dhommah, Alif
    "reason": string // Alasan dari Ajurrumiyyah
  }]
}
`;
3. Integrasi pada AI Router
Di src/lib/ai/router.ts, kamu perlu memanggil fungsi ini. Untuk tahap awal, pilihlah 3-5 contoh dari 60 contoh yang kamu punya yang paling "mirip" secara struktur.

TypeScript
// Contoh logika sederhana di Router
const examples = `1. قَامَ زَيْدٌ (Fa'il Isim Mufrad)\n2. زَيْدٌ قَائِمٌ (Mubtada Khobar)`;

const finalPrompt = pakarAnalyzePrompt(inputText, examples);
const result = await generate(finalPrompt, "grammar");
4. Strategi "Zero Hallucination" (Final Polish)
Untuk memastikan model 1.5b tidak berbohong:

Strict JSON Mode: Pastikan di request Ollama kamu, parameter format: "json" aktif.

Temperature 0: Set temperature: 0 di ollama.ts. Ini akan memaksa AI memberikan jawaban paling kaku/faktual berdasarkan data yang kamu berikan, bukan jawaban kreatif.

Validation Layer: Gunakan 60 contoh tadi sebagai Unit Test. Buat skrip yang menjalankan 60 kalimat itu ke AI, lalu cek apakah jawabannya sama dengan dataset kamu. Jika berbeda, koreksi prompt-nya.