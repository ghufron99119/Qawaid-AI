

## 📝 Fitur Kuis Interaktif

### Tujuan
Pengguna dapat menguji pemahaman tata bahasa Arab (Nahwu/Sharaf) melalui soal pilihan ganda yang dihasilkan secara dinamis oleh AI berdasarkan materi yang pernah dipelajari atau dari bank soal. Hasil kuis disimpan untuk melacak perkembangan.

### Halaman Kuis (`/quiz`)

#### Tata Letak (Layout)
```
+--------------------------------------------------+
|  🏠 Qawaid AI                        [User Avatar] |
+--------------------------------------------------+
|  [Menu]  Analyze  |  Dashboard  |  Kuis          |
+--------------------------------------------------+
|                                                  |
|  📝 **Kuis Tata Bahasa Arab**                    |
|                                                  |
|  [ ⚙️ Generate Soal Baru ]   [ 🏁 Mulai ]        |
|                                                  |
+--------------------------------------------------+
|                                                  |
|  Soal 1 dari 5                                     |
|                                                  |
|  ❓ **Apa jenis kata "ذهب" dalam kalimat**       |
|     "ذهب الطالب إلى المدرسة"?                    |
|                                                  |
|  ○ A. Isim                                       |
|  ○ B. Fi'il Madhi                                |
|  ○ C. Harf Jar                                   |
|  ○ D. Isim Maushul                               |
|                                                  |
|  [ ⏪ Sebelumnya ]       [ ⏩ Selanjutnya ]      |
|                                                  |
|  [ ✅ Kumpulkan Jawaban ]                         |
|                                                  |
+--------------------------------------------------+
|                                                  |
|  Skor Sementara: 0/5                             |
|                                                  |
+--------------------------------------------------+
```

### Alur Penggunaan

1. **Generate Soal**
   - Pengguna klik "Generate Soal Baru".
   - Frontend meminta ke endpoint `/api/quiz/generate` dengan parameter jumlah soal (misal 5) dan tingkat kesulitan (opsional).
   - Backend memanggil AI Router (dengan fallback) untuk membuat soal pilihan ganda berdasarkan teks-teks yang pernah dianalisis pengguna (jika ada) atau dari korpus umum.
   - Soal dikembalikan dalam format JSON dan disimpan di state client.

2. **Mengerjakan Kuis**
   - Pengguna menjawab soal satu per satu.
   - Jawaban sementara disimpan di state.
   - Navigasi antar soal.

3. **Pengumpulan dan Skor**
   - Setelah semua soal dijawab, klik "Kumpulkan Jawaban".
   - Frontend mengirim jawaban ke endpoint `/api/quiz/submit`.
   - Backend menghitung skor (dengan membandingkan jawaban pengguna dengan kunci jawaban yang disimpan saat generate).
   - Skor disimpan ke database (tabel `QuizResult`).
   - Hasil ditampilkan: skor, jawaban benar/salah per soal.

### Komponen yang Diperlukan

1. **`QuizGenerator`**
   - Tombol untuk memulai generate soal baru.
   - Bisa ditambahkan opsi jumlah soal (dropdown 5, 10, 15).

2. **`QuizQuestion`**
   - Menampilkan satu soal: teks soal, pilihan A-D.
   - Menandai pilihan yang dipilih.

3. **`QuizNavigation`**
   - Tombol Sebelumnya/Selanjutnya.
   - Indikator nomor soal (misal "Soal 1 dari 5").

4. **`QuizResult`**
   - Menampilkan skor akhir.
   - Rincian jawaban benar/salah (opsional).

### API Endpoints

#### `POST /api/quiz/generate`
- **Request Body**:
  ```json
  {
    "count": 5,
    "difficulty": "beginner", // opsional
    "contextTexts": ["teks1", "teks2"] // opsional, dari catatan user
  }
  ```
- **Response**:
  ```json
  {
    "quizId": "generated-id", // bisa pakai timestamp atau uuid
    "questions": [
      {
        "id": 1,
        "question": "Apa jenis kata 'ذهب' dalam kalimat 'ذهب الطالب إلى المدرسة'?",
        "options": ["Isim", "Fi'il Madhi", "Harf Jar", "Isim Maushul"],
        "correctAnswer": 1 // indeks jawaban benar (0-based)
      }
    ]
  }
  ```
- **Catatan**: `quizId` digunakan untuk menyimpan jawaban sementara di server atau client. Bisa juga di-generate di client, asalkan saat submit kita kirimkan seluruh soal dan jawaban user.

#### `POST /api/quiz/submit`
- **Request Body**:
  ```json
  {
    "questions": [...], // array soal lengkap dengan correctAnswer
    "userAnswers": [0, 2, 1, 3, 0] // indeks jawaban user per soal
  }
  ```
- **Response**:
  ```json
  {
    "score": 4,
    "total": 5,
    "details": [
      { "questionId": 1, "correct": true },
      { "questionId": 2, "correct": false }
    ]
  }
  ```
- **Server** akan menghitung skor, lalu menyimpan ke database: `QuizResult` dengan `userId`, `score`, `totalQuestions`, `createdAt`.

### Integrasi dengan AI Router

Sama seperti analisis teks, pembuatan soal juga dapat memanfaatkan AI Router dengan fallback. Buat fungsi di `lib/ai/providers/` khusus untuk generate soal.

**Contoh prompt untuk Gemini**:
```
Anda adalah ahli pembuat soal tata bahasa Arab. Buatlah {count} soal pilihan ganda tentang Nahwu/Sharaf berdasarkan teks-teks berikut (jika ada):
{contextTexts}

Setiap soal harus memiliki:
- Pertanyaan dalam bahasa Indonesia
- 4 pilihan jawaban (A, B, C, D)
- Indeks jawaban benar (0 untuk A, 1 untuk B, dst.)

Kembalikan dalam format JSON array:
[
  {
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "correctAnswer": 0
  }
]
```

**Router** akan memanggil provider secara berurutan hingga berhasil.

### Database: Model QuizResult

Perbarui `schema.prisma` dengan model berikut:

```prisma
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

### Dashboard: Perbarui Statistik

Tambahkan perhitungan rata-rata skor kuis ke `DashboardStats`. Query untuk rata-rata:
```sql
SELECT AVG(score * 1.0 / totalQuestions) FROM QuizResult WHERE userId = ?
```
Atau hitung manual di kode.

### Struktur Folder yang Diperbarui

Tambahkan folder baru di `app/api/quiz/` dan `components/quiz/`:

```
app/
  api/
    quiz/
      generate/
        route.ts
      submit/
        route.ts
  (dashboard)/
    quiz/
      page.tsx
components/
  quiz/
    QuizGenerator.tsx
    QuizQuestion.tsx
    QuizNavigation.tsx
    QuizResult.tsx
```

### Catatan Keamanan
- Pastikan endpoint generate soal juga memeriksa autentikasi.
- Jangan menyimpan kunci jawaban di client dalam bentuk plain (karena bisa diintip). Alternatif: simpan kunci jawaban di server (session) dan hanya kirimkan soal tanpa jawaban benar ke client. Saat submit, client kirim jawaban, server hitung skor berdasarkan kunci yang disimpan. Namun untuk menyederhanakan MVP, kita bisa kirimkan kunci jawaban ke client (tidak masalah karena ini aplikasi belajar, bukan ujian resmi).

