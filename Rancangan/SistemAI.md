# Laporan Sistem AI — Qawaid AI

Sistem AI pada aplikasi Qawaid AI menggunakan arsitektur **Multi-Provider Fallback** yang dirancang untuk memaksimalkan ketersediaan (*availability*) layanan. Jika provider utama gagal karena masalah jaringan, kehabisan kuota, atau error API, sistem secara otomatis beralih ke provider berikutnya tanpa interupsi bagi pengguna.

---

## 1. Arsitektur: AI Router & Fallback Chain

Komponen inti sistem AI berada di `src/lib/ai/router.ts`. File ini mendefinisikan dua fungsi utama:

| Fungsi | Tujuan |
|---|---|
| `analyzeWithFallback(text)` | Menganalisis struktur gramatikal (I'rab) teks Arab |
| `generateQuizWithFallback(count, difficulty, contextTexts)` | Menghasilkan soal kuis pilihan ganda |

Keduanya menggunakan pola **waterfall** yang sama: mencoba provider satu per satu dari daftar terurut, dan mengembalikan hasil dari provider pertama yang berhasil. Jika seluruh provider gagal, error yang informatif dari semua provider dilaporkan sekaligus.

```
Request
   │
   ▼
[1] Google Gemini 1.5 Pro ──(gagal?)──► [2] OpenRouter (Gemini 2.5 Flash) ──(gagal?)──► [3] Groq (Llama 3.3 70B)
                                                                                                    │
                                                                                           (semua gagal?)
                                                                                                    │
                                                                                            Throw Error
```

---

## 2. Provider: Detail Teknis

### A. Google Gemini (`src/lib/ai/providers/gemini.ts`)
- **Model**: `gemini-1.5-pro`
- **SDK**: `@google/generative-ai` (SDK resmi Google)
- **Env Var**: `GEMINI_API_KEY`
- **Konektivitas**: Langsung via SDK (bukan HTTP fetch)
- **Peran**: Provider **utama (prioritas 1)**. Dipilih pertama karena model terbaiknya sudah sangat familiar dengan tata bahasa Arab klasik.

### B. OpenRouter (`src/lib/ai/providers/openrouter.ts`)
- **Model**: `google/gemini-2.5-flash` (diakses via gateway OpenRouter)
- **SDK**: Native `fetch` ke endpoint REST OpenRouter
- **Env Var**: `OPENROUTER_API_KEY`, `OPENROUTER_BASE_URL`
- **Konektivitas**: `https://openrouter.ai/api/v1/chat/completions`
- **Peran**: Provider **cadangan pertama (prioritas 2)**. Berguna sebagai *proxy* untuk mengakses Gemini dengan kuota terpisah, atau sebagai fallback jika API Google langsung mengalami masalah.

### C. Groq (`src/lib/ai/providers/groq.ts`)
- **Model**: `llama-3.3-70b-versatile`
- **SDK**: Native `fetch` ke endpoint REST Groq
- **Env Var**: `GROQ_API_KEY`, `GROQ_BASE_URL`
- **Konektivitas**: `https://api.groq.com/openai/v1/chat/completions`
- **Peran**: Provider **cadangan terakhir (prioritas 3)**. Groq menawarkan inferensi yang sangat cepat berbasis hardware khusus (LPU). Menggunakan LLM open-source Meta (Llama) bukan Gemini, sehingga menjadi diversifikasi model yang nyata.

---

## 3. Rekayasa Prompt (`src/lib/ai/prompts.ts`)

Sistem menggunakan dua template prompt yang berbeda:

### `getPrompt(text)` — Analisis I'rab
Prompt ditulis dalam bahasa **Inggris** dan menginstruksikan model untuk bertindak sebagai "ahli tata bahasa Arab (Nahwu)". Model diminta mengembalikan **JSON array murni** tanpa pembungkus markdown. Setiap objek dalam array wajib mengandung:
- `word`: kata asli dari teks
- `type`: jenis kata (`Isim`, `Fi'il`, `Harf`, dsb.)
- `i3rab`: keterangan I'rab (dalam bahasa Arab/transliterasi)
- `explanation`: penjelasan singkat dalam **Bahasa Indonesia**

### `getQuizPrompt(count, difficulty, contextTexts)` — Generasi Kuis
Prompt ditulis dalam bahasa **Indonesia** dan memiliki fitur yang lebih kaya:
- **Pemetaan Tingkat Kesulitan**: `beginner` → `intermediate` → `advanced`, masing-masing dengan deskripsi konsep yang berbeda (misalnya, `advanced` menyertakan konsep seperti *tawabik*, *idhofah*, dan *fi'il mu'thal*).
- **Konteks Dinamis**: Jika tersedia, teks Arab dari catatan pengguna disuntikkan ke dalam prompt sebagai sumber materi soal, sehingga kuis terasa *personal* dan relevan.
- **Format Output**: JSON array berisi objek dengan `question`, `options` (4 pilihan), dan `correctAnswer` (indeks 0-3).

---

## 4. Integrasi ke API Route

### `POST /api/analyze`
Menghubungkan sistem AI ke permintaan analisis dari pengguna dengan lapisan keamanan:
1. **Autentikasi**: Memverifikasi sesi NextAuth. Tolak jika belum login.
2. **Validasi Input**: Teks kosong atau lebih dari 500 karakter ditolak.
3. **Caching Cerdas**: Sebelum memanggil API AI yang berbayar, sistem memeriksa apakah teks yang sama pernah dianalisis sebelumnya oleh pengguna yang sama di tabel `Note`. Jika ada, hasil lama dikembalikan langsung (`cached: true`) tanpa biaya API tambahan.
4. **Panggil AI Router**: Jika tidak ada cache, `analyzeWithFallback()` dipanggil.

### `POST /api/quiz/generate`
1. **Autentikasi**: Wajib login.
2. **Validasi Jumlah Soal**: Jumlah soal dikunci antara 1–20 buah.
3. **Pengayaan Konteks Otomatis**: Jika pengguna tidak menyediakan teks konteks, sistem secara otomatis mengambil 3 catatan terakhir pengguna dari database sebagai bahan pembuatan soal yang relevan.
4. **Panggil AI Router**: `generateQuizWithFallback()` dipanggil dengan parameter yang sudah diperkaya.
5. **UUID Unik per Sesi Kuis**: Setiap sesi kuis mendapat ID unik menggunakan `crypto.randomUUID()`.

---

## 5. Validasi & Ketahanan Respons

Setiap provider mengimplementasikan dua lapisan validasi setelah mendapat respons dari API:
1. **Level Provider**: Pembersihan string markdown code block (` ```json...``` `) yang kadang disertakan model, lalu `JSON.parse()`. Jika gagal, provider melempar error.
2. **Level Router**: Memeriksa apakah hasil parse berupa array non-kosong dengan format field yang benar (misalnya, `result[0].word` harus berupa string). Format yang tidak valid dianggap error.

---

## 6. Ringkasan & Potensi Peningkatan

| Aspek | Status Saat Ini | Catatan |
|---|---|---|
| Ketersediaan | ✅ Tinggi — 3 provider fallback | Sangat baik |
| Akurasi Analisis | ✅ Baik — Gemini 1.5 Pro | Bisa ditingkatkan dengan few-shot examples |
| Efisiensi Biaya | ✅ Ada caching untuk analisis | Belum ada caching untuk kuis |
| Keamanan | ✅ Wajib autentikasi | Belum ada rate limiting per pengguna |
| Kontekstualisasi Kuis | ✅ Otomatis dari catatan pengguna | Fitur cerdas yang menonjol |
| Streaming Respons | ❌ Belum ada | Dapat meningkatkan UX untuk teks panjang |

> Laporan ini dibuat pada 7 Maret 2026 berdasarkan analisis kode di `src/lib/ai/`.
