# Laporan Sistem & Peningkatan Autentikasi Qawaid AI

Sistem autentikasi pada aplikasi Qawaid AI diimplementasikan dengan standar keamanan tingkat tinggi dan *User Experience (UX)* modern. Berikut adalah rincian teknis dari komponen form login saat ini beserta kerangka arsitektur peningkatannya:

## 1. Mekanisme Autentikasi Inti
*   **Provider**: Proses *login* dilayani menggunakan **NextAuth.js** (`next-auth/react`).
*   **Strategi Credentials**: Mengizinkan pengguna untuk masuk menggunakan skema *email* dan *password* yang kemudian dikirim ke server.
*   **Redireksi Pintar**: Parameter `redirect: false` digunakan pada sisi *client* untuk mencegah *refresh* yang tidak perlu, sehingga aplikasi dapat menampilkan pesan error kustom UI (misal: "Invalid email or password"). Apabila sukses, sistem langsung mengarahkan via `router.push('/dashboard')`.

## 2. Peningkatan User Experience (UX) & Antarmuka
*   **Password Visibility Toggle**: Pengguna dapat melihat/menyembunyikan kata sandi melalui ikon interaktif (menggunakan `lucide-react`) untuk meminimalisasi *typo*.
*   **State Loading Cerdas**: Tombol "Sign In" beserta input email dan password sepenuhnya diblokir (`disabled`) bilamana pemrosesan autentikasi tengah berlangsung untuk menghindari *double-submit*.
*   **Penanganan Isu Hydration**: Menggunakan *hook* tambahan (`isMounted`) pada komponen berbasis React (*Client Component*) guna meniadakan loncatan visual (*flicker*) atau distorsi kerangka DOM sesaat saat browser memuat state dari penyimpanan lokal.

## 3. Zod Validation & Opsi "Remember Me"
*   **Validasi Klien Ekstensif (Zod)**: Sebelum pengiriman *payload* ke API, format email (harus mendeteksi `@` dan valid) dan panjang kata sandi akan divalidasi dengan sangat ketat oleh Pustaka **Zod**.
*   **Opsi Remember Me Berbasis Privasi**: Integrasi *Checkbox* untuk kontrol penyimpanan. Jika disetujui, identitas diarsipkan di `localStorage` (*key*: `savedEmail`), jika ditolak, email terdahulu yang terekam akan dihancurkan untuk mengakomodir regulasi privasi.

## 4. Aksesibilitas & Error Logging
*   **Standar Pembaca Layar**: Label tag HTML dikaitkan ke `<input>` lewat atribut `id` dan `htmlFor` untuk mendongkrak kebergunaan aplikasi oleh piranti bantuan bantu (*screen reader*).
*   **Sistem Log Gagal (*Catch Block*)**: Pengecualian server (*Unexpected API errors*) ditangkap untuk membantu *backend debugging* via `console.error()`.

---

## 🚀 Rencana Peningkatan Sistem Autentikasi Baru

Untuk menyempurnakan alur pengguna dan mempermudah akuisisi, skema autentikasi akan di-ekspansi menuju dua kapabilitas mutakhir: Pendelegasian OAuth (Google) dan Alur Pemulihan Kata Sandi (*Forgot Password*).

### A. Integrasi Login Sosial (Google OAuth)
Menawarkan jalur otentikasi sekunder (*1-Click Sign In*) bergaya modern.

1.  **Konfigurasi Google Cloud Console**: 
    1. Membuat profil "OAuth consent screen" untuk aplikasi publik.
    2. Menghasilkan "OAuth client ID" untuk domain Vercel / server lokal.
    3. Ekstraksi `CLIENT_ID` dan `CLIENT_SECRET`.
2.  **Konfigurasi Variabel Lingkungan (`.env`)**:
    *   `GOOGLE_CLIENT_ID`
    *   `GOOGLE_CLIENT_SECRET`
3.  **Pengaturan Provider pada NextAuth**: 
    Melakukan import paket ekstensi khusus `GoogleProvider` dan menambahkannya ke list parameter *providers* dari berkas pendaftaran sentral di API routes NextAuth.
4.  **Tampilan Antarmuka Login**: 
    Menginjeksikan batas pemisah (Separator) berupa label _"Or continue with"_ di bawah *Form Credentials* lama, lengkap dengan penyempatan Google Button Logo SVG standar.

### B. Arsitektur Pemulihan Akun (*Forgot / Reset Password*)
Membangun benteng pemulihan ketika kredensial klasik kedaluwarsa atau hilang melalui pemicuan Token berbasis *Database*.

1.  **Ekspansi Model Database (Neon / Prisma)**:
    Menambahkan tabel unik `PasswordResetToken` di skema Prisma:
    *   `email` (alamat identitas), `token` (String acak / UUID valid), `expires` (Kedaluwarsa standar 1 Jam).
    *   Pasang *Index* ganda pada kombinasi tabel (*Unique Tuple*) `@@unique([email, token])`.
2.  **Pembuatan Rute Pages & Komponen Baru**:
    *   `/forgot-password/page.tsx`: Halaman permohonan dengan input tunggal "Email" yang bersinergi dengan Zod, serta pesan sukses ter-isolasi.
    *   `/reset-password/[token]/page.tsx`: Modul input ganda (*New Password* & *Confirm Password*), validasi kata sandi Zod 8-karakter, serta re-integrasi blok UI *Eye Toggle*.
3.  **Layanan Pengiriman Notifikasi (Email Relay)**:
    Implementasi konektor relai pengiriman pihak ketiga (*seperti Nodemailer atau Resend*) untuk melayangkan URL tautan pemulihan khusus (Berformat: `https://[DomainAplikasi]/reset-password/TOKEN_UNIK`) ke alamat email pengguna yang sah.
4.  **Kebijakan Siklus Hidup Rahasia (*Security Lifecycle*)**:
    *   Pembakaran Token Langsung (*Burn-After-Use*): Baris tabel database seketika dipangkas bersih saat reset diselesaikan.
    *   Validasi Lintas Parameter: Server menolak eksekusi API bila *timestamp* dari Token sudah terlewat, disusul dengan algoritma *Hash ulang* untuk melumuri password baru sebelum masuk kembali ke Tabel _User_.
