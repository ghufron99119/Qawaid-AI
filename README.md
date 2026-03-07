# قواعد AI (Qawaid AI) 
> **Intelligent Arabic Grammar Companion**

Qawaid AI adalah platform edukasi interaktif berbasis kecerdasan buatan (AI) yang dirancang khusus untuk mempermudah pembelajaran tata bahasa Arab (Nahwu dan Sharaf). Aplikasi ini membantu pengguna dalam menganalisis struktur kalimat, mengidentifikasi jenis kata, menyimpan catatan pembelajaran, serta melatih kemampuan melalui kuis interaktif secara otomatis.

---

## 🚀 Fitur Utama

1. **Autentikasi Pengguna Multi-Provider & Recovery**
   - **Multi-Login**: Mendukung login tradisional (Email/Password) dan **Google OAuth 2.0**.
   - **Pemulihan Akun (Forgot Password)**: Sistem reset password aman menggunakan token UUID dengan masa berlaku 1 jam dan pengiriman email otomatis.
   - **Validasi Skema (Zod)**: Validasi formulir di sisi klien dan server memastikan integritas data (format email, minimal karakter password).
   - **Fitur "Remember Me"**: Opsi bagi pengguna untuk menyimpan email di `localStorage` guna mempermudah login berikutnya.
   - **Eye Visibility Toggle**: Fitur lihat/sembunyi kata sandi di semua form autentikasi.
   - Perlindungan password optimal menggunakan hashing `bcryptjs`.

2. **Analisis Teks Arab Cerdas (I'rab Analysis) - _Dalam Pengembangan_**
   - Mendukung input teks bahasa Arab (RTL support).
   - Terintegrasi dengan **Google Gemini API** / LLM untuk mengurai kalimat (I'rab).
   - Sorotan otomatis pada jenis kata: *Fi'il* (Kata Kerja), *Isim* (Kata Benda), dan *Harf* (Partikel).

3. **Manajemen Catatan (Smart Dictionary)**
   - Simpan teks Arab yang telah dianalisis secara pribadi.
   - Tambahkan dan kelola komentar atau catatan pribadi untuk referensi studi di masa mendatang.

4. **Kuis Interaktif (Interactive Exercises)**
   - Kuis Grammar (Nahwu/Sharaf) berbentuk pilihan ganda yang dihasilkan langsung oleh AI secara dinamis berdasarkan materi.
   - Pelacakan skor otomatis untuk mengevaluasi pemahaman pengguna.

5. **Dashboard Progres Pengguna**
   - Rekap jumlah kalimat yang dianalisis.
   - Rata-rata nilai kuis.
   - Riwayat pembelajaran dan statistik yang divisualisasikan dengan elegan.

---

## 🛠 Teknologi yang Digunakan

Proyek ini dibangun menggunakan arsitektur modern dengan performa tinggi:

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Library UI:** [React 19](https://react.dev/)
- **Desain UI:** [Tailwind CSS v4](https://tailwindcss.com/) dengan palet warna Emerald-Slate Islami-modern.
- **Validasi Data:** [Zod](https://zod.dev/)
- **Ikonografi:** [Lucide React](https://lucide.dev/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL (Neon)
- **Autentikasi:** [NextAuth.js](https://next-auth.js.org/)
- **Email Service:** [Resend](https://resend.com/)
- **AI Engine:** Google Gemini AI API (Generative AI)
---

## ⚙️ Persyaratan Sistem

Sebelum menjalankan proyek ini secara lokal, pastikan Anda telah memasang:
- **Node.js** (Versi `v18.x` atau di atasnya)
- **NPM** atau **Yarn**

---

## 💻 Panduan Instalasi (Local Development)

Ikuti langkah-langkah di bawah ini untuk menjalankan **Qawaid AI** di mesin lokal Anda:

### 1. Kloning Repositori
Clone proyek ini ke dalam folder lokal Anda dan masuk ke direktori proyek.
```bash
# Pastikan Anda menggunakan terminal / command prompt
git clone <url-repository>
cd QawaidAI
```

### 2. Instalasi Dependensi
Instal seluruh *library* dan dependensi yang dibutuhkan proyek:
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Aplikasi memerlukan variabel lingkungan (`Environment Variables`) untuk mengelola rahasia dan koneksi Database. 
Buat file bernama `.env` di root/pangkal direktori aplikasi, lalu isi dengan konfigurasi berikut:

```env
# Koneksi Prisma Database (Ganti dengan koneksi PostgreSQL Anda)
DATABASE_URL="postgresql://user:password@localhost:5432/qawaidai"

# Next Auth Config (Ganti NEXTAUTH_SECRET dengan string rahasia buatan Anda sendiri)
NEXTAUTH_SECRET="some_strong_secret_for_development"
NEXTAUTH_URL="http://localhost:3000"

# Kunci API Google Gemini untuk fungsionalitas Analisis Teks & Kuis
LLM_API_KEY="masukkan_api_key_gemini_anda_disini"

# Google OAuth (Dapatkan dari Google Cloud Console)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Resend Email (Untuk fitur Reset Password)
RESEND_API_KEY="re_your_resend_api_key"
```

### 4. Setup Database
Gunakan `Prisma` untuk menyinkronkan kerangka (*schema*) tabel ke dalam database PostgreSQL Anda:
```bash
npx prisma db push
npx prisma generate
```

### 5. Jalankan Development Server
Mulai server Node.js lokal agar Anda dapat membuka aplikasinya:
```bash
npm run dev
```

Buka peramban (*browser*) Anda lalu navigasikan ke **[http://localhost:3000](http://localhost:3000)**. 
Aplikasi akan langsung menampilkan *Landing Page*.

---

## 🗃️ Skema Basis Data

Aplikasi ini menggunakan tiga entitas data utama:
- `User`: Menyimpan identitas pengguna (`id`, `name`, `email`, `password_hash`).
- `PasswordResetToken`: Menyimpan token UUID dan waktu kedaluwarsa untuk pemulihan akun.
- `Text`: Menyimpan riwayat teks Arab yang diuji/dianalisis. Ditautkan ke model *User* lewat parameter `userId`. Menyimpan balasan JSON dari LLM API.
- `QuizResult`: Menyimpan rekap hasil kuis pengguna.

---

## 🤝 Alur / Workflow Kerja Aplikasi
1. **Pendaftaran:** Pengguna membuat akun di halaman `/register`.
2. **Dashboard:** Setelah terotentikasi, pengguna dialihkan ke halaman pelacakan progres `/dashboard`.
3. **Analisa Teks:** Teks Arab dimasukkan → API Route Next.js mengelola `Prompt` → LLM Gemini mengembalikan format JSON (I'rab detail) → Frontend menampilkan highlight warna.
4. **Kuis:** Modul kuis membaca teks lama pengguna dari database → LLM mengubahnya menjadi set soal pilihan ganda menantang.

---

> Dikerjakan menggunakan hati untuk pelestarian tata bahasa Al-Qur'an dan kemudahan akses mahasiswa/pelajar bahasa Arab. 
> © 2026 Qawaid AI Team.
