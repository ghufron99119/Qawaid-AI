Saya akan merancang pengembangan Qawaid AI secara profesional berdasarkan kebutuhan yang Anda paparkan. Fokus utama adalah melengkapi halaman Dashboard dan Analyze, serta mengimplementasikan sistem **AI Router dengan fallback multi-provider** yang robust. Rancangan ini akan menjadikan proyek Anda tidak hanya fungsional tetapi juga siap untuk skala produksi dan menjadi portfolio yang kuat.

---

## 🏗️ Arsitektur Sistem (High-Level)

Arsitektur yang diusulkan mengadopsi pola **layered architecture** dengan pemisahan concern yang jelas, cocok untuk deployment serverless di Vercel.

```
[Client Browser]
    ↓
[Vercel Edge Network]
    ↓
[Next.js App Router]  ←  Server Components & API Routes
    ├── Page: /analyze, /dashboard (Server Components + Client Interactivity)
    └── API Route: /api/analyze
           ↓
    [AI Router Layer]  ←  lib/ai/router.ts
           ↓
    [AI Providers]     ←  Gemini, OpenRouter, Groq (fallback)
           ↓
    [Database]         ←  Neon (PostgreSQL) via Prisma
```

**Penjelasan:**
- **Frontend**: Halaman `/analyze` dan `/dashboard` dibangun dengan Server Component untuk SEO dan initial load cepat, dipadukan dengan Client Component untuk interaktivitas (input teks, tombol, dll).
- **API Route**: Endpoint `/api/analyze` menangani request dari client, memanggil AI Router, dan mengembalikan hasil analisis.
- **AI Router**: Lapisan pintar yang menentukan provider AI mana yang akan digunakan, menangani kegagalan, dan melakukan fallback secara otomatis.
- **Database**: Menyimpan data pengguna, catatan analisis, dan hasil kuis. Menggunakan Prisma sebagai ORM.

---

## 📁 Struktur Folder Profesional (Scalable)

Struktur ini mengikuti konvensi Next.js App Router dan memisahkan logika bisnis dengan baik.

```
qawaid-ai/
├── app/
│   ├── (auth)/                     # Group untuk halaman auth (opsional)
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── (dashboard)/                 # Group untuk halaman yang butuh proteksi
│   │   ├── dashboard/
│   │   │   └── page.tsx             # Halaman dashboard
│   │   ├── analyze/
│   │   │   └── page.tsx             # Halaman analisis
│   │   └── layout.tsx                # Layout dengan sidebar/navbar
│   ├── api/
│   │   ├── analyze/
│   │   │   └── route.ts              # POST /api/analyze
│   │   ├── progress/
│   │   │   └── route.ts              # GET /api/progress
│   │   ├── notes/
│   │   │   └── route.ts              # CRUD notes
│   │   └── auth/[...nextauth]/
│   │       └── route.ts              # NextAuth.js
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                           # Komponen umum (shadcn/ui jika digunakan)
│   ├── analyze/
│   │   ├── ArabicInput.tsx
│   │   ├── AnalyzeButton.tsx
│   │   ├── AnalysisResult.tsx
│   │   └── SaveNoteButton.tsx
│   └── dashboard/
│       ├── DashboardStats.tsx
│       ├── RecentAnalysisList.tsx
│       └── ProgressChart.tsx
├── lib/
│   ├── ai/
│   │   ├── router.ts                  # AI Router utama
│   │   ├── providers/
│   │   │   ├── gemini.ts
│   │   │   ├── openrouter.ts
│   │   │   └── groq.ts
│   │   └── prompts.ts                  # Template prompt
│   ├── db/
│   │   └── prisma.ts                    # Inisialisasi Prisma Client
│   └── utils/
│       └── rate-limit.ts                 # (Opsional) untuk proteksi API
├── prisma/
│   └── schema.prisma
├── public/
├── .env.local
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## 🖥️ Halaman Analyze (`/analyze`)

### Tujuan
Pengguna memasukkan teks Arab, sistem mengirim ke AI Router, menampilkan hasil analisis I'rab, dan menyimpan ke catatan jika diinginkan.

### UI/UX Layout
```
+---------------------------------------+
|  Qawaid AI - Grammar Analyzer          |
+---------------------------------------+
| [Teks Arab]                            |
| +-----------------------------------+ |
| | ذهب الطالب الى المدرسة            | |
| +-----------------------------------+ |
|                                       |
| [   Analisis Sekarang   ]             |
+---------------------------------------+
|            Hasil Analisis              |
+---------------------------------------+
| Kata      | Jenis      | I'rab        |
|-----------+------------+--------------|
| ذهب       | فعل ماض    | مبني على الفتح|
| الطالب    | فاعل       | مرفوع        |
| الى       | حرف جر     | مبني         |
| المدرسة   | اسم مجرور  | مجرور بالكسرة|
+---------------------------------------+
| [Simpan ke Catatan]                   |
+---------------------------------------+
```

### Komponen Utama
- `ArabicInput.tsx`: Textarea dengan dukungan RTL, validasi input.
- `AnalyzeButton.tsx`: Tombol dengan state loading.
- `AnalysisResult.tsx`: Menampilkan tabel hasil parsing JSON.
- `SaveNoteButton.tsx`: Menyimpan hasil ke database (memerlukan user login).

### Flow Data
1. User mengetik teks Arab, klik "Analisis Sekarang".
2. Client mengirim POST request ke `/api/analyze` dengan body `{ text: string }`.
3. API Route memanggil `AI Router` dengan teks.
4. Router mencoba provider secara berurutan hingga berhasil.
5. Respons JSON dari AI dikembalikan ke client.
6. Client merender `AnalysisResult`.
7. Jika user klik simpan, data dikirim ke `/api/notes` untuk disimpan.

---

## 📊 Halaman Dashboard (`/dashboard`)

### Tujuan
Menampilkan ringkasan aktivitas pengguna: jumlah analisis, catatan tersimpan, rata-rata skor kuis, dan riwayat terbaru.

### UI/UX Layout
```
+---------------------------------------+
|  Dashboard                            |
+---------------------------------------+
| [Selamat datang, User]                |
+---------------------------------------+
| +----------+ +----------+ +----------+|
| |Analisis  | |Catatan   | |Rata-rata ||
| |34        | |12        | |Kuis 82%  ||
| +----------+ +----------+ +----------+|
+---------------------------------------+
| Aktivitas Terbaru                      |
+---------------------------------------+
| • ذهب الطالب الى المدرسة (2 jam lalu) |
| • إن الله غفور رحيم (kemarin)         |
| • قال رسول الله صلى الله عليه وسلم    |
+---------------------------------------+
| [Lihat Semua Analisis]                 |
+---------------------------------------+
```

### Komponen Utama
- `DashboardStats.tsx`: Menampilkan 3 kartu statistik.
- `RecentAnalysisList.tsx`: Daftar 5 analisis terakhir dengan tautan.
- `ProgressChart.tsx`: (Opsional) Grafik perkembangan belajar.

### Flow Data
1. Halaman dashboard adalah Server Component yang memanggil `getServerSession` untuk mendapatkan user.
2. Melakukan query ke database: hitung jumlah `Note` milik user, hitung rata-rata skor dari `QuizResult`, ambil 5 `Note` terbaru.
3. Data dikirim ke komponen client untuk ditampilkan.
4. Alternatif: buat endpoint `/api/progress` untuk fetch data secara client-side jika ingin real-time.

---

## 🤖 AI Provider Fallback & Multi-LLM Routing

Ini adalah inti dari peningkatan. Router akan mencoba provider secara berurutan hingga mendapatkan respons sukses. Pendekatan ini meningkatkan **reliability** dan **availability** aplikasi.

### Konsep Dasar
```
function analyzeWithFallback(text: string): Promise<Analysis> {
  const providers = [gemini, openrouter, groq]; // urutan prioritas

  for (const provider of providers) {
    try {
      const result = await provider.analyze(text);
      return result; // jika sukses, langsung return
    } catch (error) {
      // Log error, lanjut ke provider berikutnya
      console.warn(`Provider ${provider.name} gagal:`, error.message);
      continue;
    }
  }
  throw new Error('Semua provider AI gagal.');
}
```

### Implementasi Detail

#### 1. Environment Variables
```

#### 2. Struktur Provider (lib/ai/providers/gemini.ts)
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function analyzeWithGemini(text: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const prompt = `Analyze the Arabic grammar of this sentence: "${text}". 
  Return a JSON array with objects containing: word, type, i3rab, explanation.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const jsonText = response.text();

  // Parsing JSON (pastikan AI mengembalikan format yang benar)
  return JSON.parse(jsonText);
}
```

#### 3. Router (lib/ai/router.ts)
```typescript
import { analyzeWithGemini } from './providers/gemini';
import { analyzeWithOpenRouter } from './providers/openrouter';
import { analyzeWithGroq } from './providers/groq';

export type AnalysisResult = Array<{
  word: string;
  type: string;
  i3rab: string;
  explanation?: string;
}>;

export async function analyzeWithFallback(text: string): Promise<AnalysisResult> {
  const providers = [
    { name: 'Gemini', fn: analyzeWithGemini },
    { name: 'OpenRouter', fn: analyzeWithOpenRouter },
    { name: 'Groq', fn: analyzeWithGroq },
  ];

  let lastError: Error | null = null;

  for (const provider of providers) {
    try {
      console.log(`Mencoba provider: ${provider.name}`);
      const result = await provider.fn(text);
      // Validasi format sederhana
      if (Array.isArray(result) && result.length > 0) {
        return result;
      } else {
        throw new Error('Format respons tidak valid');
      }
    } catch (error) {
      lastError = error as Error;
      console.warn(`Provider ${provider.name} gagal:`, error.message);
      // Lanjut ke provider berikutnya
    }
  }

  throw new Error(`Semua provider gagal. Error terakhir: ${lastError?.message}`);
}
```

#### 4. API Route (app/api/analyze/route.ts)
```typescript
import { NextResponse } from 'next/server';
import { analyzeWithFallback } from '@/lib/ai/router';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text } = await req.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Teks diperlukan' }, { status: 400 });
    }

    // Panggil AI Router
    const analysis = await analyzeWithFallback(text);

    // (Opsional) Simpan otomatis ke riwayat? Bisa juga via tombol terpisah.
    // Di sini kita hanya mengembalikan hasil.
    return NextResponse.json({ success: true, data: analysis });
  } catch (error) {
    console.error('API Analyze Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal menganalisis' },
      { status: 500 }
    );
  }
}
```

### Keuntungan Pendekatan Ini
- **Resilience**: Jika satu provider down atau quota habis, sistem tetap berjalan.
- **Cost Optimization**: Bisa memprioritaskan provider yang lebih murah.
- **Scalability**: Mudah menambah provider baru.
- **User Experience**: Pengguna tidak melihat error, hanya mungkin sedikit lambat.

---

## 🗄️ Desain Database dengan Prisma

Berdasarkan kebutuhan, skema Prisma dapat ditingkatkan.

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  passwordHash  String?   // untuk kredensial, jika tidak pakai OAuth
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  notes         Note[]
  quizResults   QuizResult[]
}

model Note {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  originalText  String   @db.Text
  analysisJson  Json     // menyimpan hasil analisis dalam format JSON
  createdAt     DateTime @default(now())

  @@index([userId])
}

model QuizResult {
  id             String   @id @default(cuid())
  userId         String
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  score          Int
  totalQuestions Int
  createdAt      DateTime @default(now())

  @@index([userId])
}
```

**Penjelasan:**
- `analysisJson` menggunakan tipe `Json` Prisma, cocok untuk menyimpan respons AI secara langsung.
- Relasi dibuat dengan `onDelete: Cascade` agar data pengguna terhapus jika akun dihapus.

---

## 🧠 Prompt Engineering yang Efektif

Prompt yang baik menentukan kualitas output. Gunakan teknik **few-shot prompting** dan instruksi format yang ketat.

Contoh prompt untuk Gemini:
```
Anda adalah ahli tata bahasa Arab (Nahwu). Analisis kalimat Arab berikut dan berikan output dalam format JSON array.

Setiap objek dalam array harus memiliki field:
- word: kata dalam teks asli
- type: jenis kata (Isim, Fi'il, Harf)
- i3rab: penjelasan i'rab (contoh: "faa'il marfu'", "maf'ul bihi mansub")
- explanation: penjelasan singkat dalam bahasa Indonesia (opsional)

Contoh:
Input: "ذهب الطالب إلى المدرسة"
Output:
[
  {"word": "ذهب", "type": "Fi'il Madhi", "i3rab": "mabni 'alal fath", "explanation": "kata kerja lampau, dibangun atas fathah"},
  {"word": "الطالب", "type": "Isim", "i3rab": "faa'il marfu'", "explanation": "subjek, tanda rafa'nya dhammah"},
  {"word": "إلى", "type": "Harf Jar", "i3rab": "mabni", "explanation": "huruf jar"},
  {"word": "المدرسة", "type": "Isim", "i3rab": "ism majrur", "explanation": "kata benda yang dijarkan, tanda jarnya kasrah"}
]

Sekarang analisis kalimat ini: "{text}"

Hanya kembalikan JSON array, tanpa teks lain.
```

**Catatan Penting:**
- Selalu minta output **hanya JSON** agar parsing mudah.
- Sertakan contoh untuk memandu AI.
- Gunakan variabel `{text}` yang akan diganti dengan input user.

---

## 🚀 Deployment di Vercel

### Konfigurasi
1. **Environment Variables**: Semua API key dan `DATABASE_URL` harus diset di Vercel Dashboard.
2. **Serverless Functions**: API Route akan berjalan sebagai serverless function. Pastikan timeout tidak terlalu lama (default 10 detik, bisa dinaikkan hingga 60 detik di Vercel Pro). Pertimbangkan untuk menggunakan **streaming** jika analisis lama.
3. **Edge Runtime**: Tidak disarankan untuk API yang memanggil AI karena membutuhkan Node.js runtime.

### Optimasi
- **Caching**: Untuk teks yang sama, simpan hasil analisis di database dan kembalikan tanpa memanggil AI lagi (cek duplikat).
- **Rate Limiting**: Gunakan library seperti `upstash-rate-limit` untuk mencegah abuse.

---

## 📋 Prioritas Implementasi (Roadmap)

Saya sarankan mengerjakan dalam urutan berikut agar cepat mendapatkan hasil dan mudah diuji:

1. **Halaman Analyze UI** (Skeleton tanpa AI)
   - Buat routing `/analyze`, komponen input dan tombol.
   - Gunakan mock data untuk menampilkan hasil.

2. **Endpoint `/api/analyze` dengan satu provider (Gemini)**
   - Implementasi panggilan Gemini, pastikan bisa mengembalikan JSON.

3. **AI Router dengan Fallback**
   - Tambahkan provider kedua (misal OpenRouter atau Groq).
   - Uji dengan mematikan API key pertama secara sengaja.

4. **Halaman Dashboard**
   - Buat layout, komponen statis, kemudian sambungkan ke data dari database (setelah user login).

5. **Fitur Simpan Catatan**
   - Tambahkan tombol simpan, buat endpoint `/api/notes`, dan integrasikan dengan Prisma.

6. **Fitur Kuis dan lainnya** (setelah inti selesai)

---

## 💡 Fitur Tambahan untuk Memperkuat Portfolio

- **Quran Grammar Analyzer**: Pengguna bisa memasukkan nomor ayat dan sistem mengambil teks dari API Quran (misal equran.id) lalu menganalisisnya.
- **Visualisasi Pohon Sintaks (Syntax Tree)**: Gunakan library seperti `react-d3-tree` untuk menampilkan struktur kalimat.
- **Harakat Generator**: AI bisa mengembalikan teks dengan harakat lengkap (tashkeel) jika diminta.
- **Export PDF**: Hasil analisis bisa diunduh sebagai PDF.

---
