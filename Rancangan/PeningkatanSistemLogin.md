Membuat fitur **Forgot Password** adalah langkah penting untuk melengkapi sistem autentikasi **Qawaid-AI**. Karena Anda sudah menggunakan **Neon (PostgreSQL)** dan **Zod**, kita akan mengintegrasikan alur ini agar tetap aman dan konsisten dengan desain yang sudah ada.

Berikut adalah rancangan teknis dan UI untuk fitur tersebut:

---

## 1. Alur Logika (Backend & Database)

Untuk menyimpan permintaan reset password, Anda perlu menambahkan model baru di `schema.prisma` agar data tersimpan di **Neon**:

* **Model `PasswordResetToken**`:
* `email`: Email pengguna yang meminta reset.
* `token`: String unik (UUID atau hashed token).
* `expires`: Waktu kedaluwarsa (misalnya: `now() + 1 hour`).


* **Keamanan**: Token harus dihapus dari database segera setelah digunakan untuk mencegah penggunaan ulang.

---

## 2. Rancangan Halaman (`/forgot-password`)

Halaman ini akan diletakkan di `src/app/forgot-password/page.tsx`.

### **Elemen UI (Tailwind CSS)**

* **Input Field**: Satu kolom input email yang menggunakan `id` dan `htmlFor` untuk aksesibilitas, sama seperti halaman login Anda.
* **Zod Validation**: Menggunakan skema `z.string().email()` untuk memastikan input adalah alamat email yang valid sebelum dikirim ke server.
* **Loading State**: Tombol "Send Reset Link" akan menjadi `disabled` saat proses pengiriman berlangsung untuk mencegah *double-submit*.
* **Success Message**: Menampilkan pesan hijau yang informatif jika email berhasil dikirim: *"Check your inbox for the reset link."*.

---

## 3. Komponen Reset Password (`/reset-password/[token]`)

Setelah pengguna mengeklik link di email, mereka akan diarahkan ke halaman ini.

### **Fitur Utama**

* **Token Verification**: Sistem secara otomatis mengecek ke database **Neon** apakah token tersebut masih valid dan belum kedaluwarsa.
* **New Password Form**:
* Dua input field: "New Password" dan "Confirm Password".
* **Zod Schema**: Menambahkan validasi minimal karakter (misal: 8 karakter) untuk meningkatkan keamanan.
* **Password Toggle**: Menggunakan ikon `Eye`/`EyeOff` dari `lucide-react` yang sudah Anda implementasikan di halaman login.



---

## 4. Integrasi Layanan Email

Anda memerlukan layanan pihak ketiga untuk mengirimkan email asli (seperti **Resend**, **SendGrid**, atau **Nodemailer**).

* **Isi Email**: Harus berupa teks sederhana atau HTML yang berisi tombol menuju `https://qawaid-ai.vercel.app/reset-password/TOKEN_UNIK`.

---

## 5. Rencana Verifikasi

* **Test 1**: Masukkan email yang tidak terdaftar, pastikan sistem memberikan pesan error yang aman (tidak membocorkan apakah email tersebut ada atau tidak).
* **Test 2**: Coba gunakan token yang sudah kedaluwarsa, pastikan sistem menolak proses reset.
* **Test 3**: Verifikasi bahwa password baru berhasil di-*hash* sebelum disimpan kembali ke database **Neon** melalui Prisma.


--------------------------------------------------------------------------------


Berikut adalah skema **Prisma** yang perlu Anda tambahkan ke file `prisma/schema.prisma` untuk mendukung sistem reset password di database **Neon**.

### 1. Skema Database (Prisma Model)

Tambahkan model ini untuk menyimpan token rahasia secara sementara:

```prisma
model PasswordResetToken {
  id      String   @id @default(cuid())
  email   String
  token   String   @unique
  expires DateTime

  @@unique([email, token])
}

```

Setelah menambahkan kode di atas, jalankan perintah ini di terminal **CachyOS** Anda untuk memperbarui struktur tabel di **Neon**:

> `npx prisma db push`

---

### 2. Struktur Folder & File Baru

Untuk mengimplementasikan rancangan ini, Anda perlu membuat beberapa file baru:

* **`src/app/forgot-password/page.tsx`**: Halaman bagi pengguna untuk memasukkan email mereka.
* **`src/app/reset-password/page.tsx`**: Halaman bagi pengguna untuk memasukkan kata sandi baru (setelah mengeklik link dari email).
* **`src/lib/tokens.ts`**: Fungsi logika untuk membuat token unik menggunakan `uuid` dan menyimpannya ke Neon.

---

### 3. Logika Keamanan (Poin Penting)

Berdasarkan standar *Software Engineering*, berikut adalah aturan yang akan kita terapkan pada fitur ini:

1. **Kedaluwarsa Otomatis**: Token akan disetel agar hangus dalam waktu **1 jam** demi keamanan.
2. **Sekali Pakai**: Segera setelah pengguna berhasil mengganti password, token tersebut akan langsung dihapus dari database Neon.
3. **Hasing Password**: Password baru tetap akan divalidasi menggunakan **Zod** (minimal 8 karakter) sebelum di-*hash* dan disimpan kembali ke tabel `User`.
4. **UX Konsisten**: Tombol dan input akan menggunakan status `disabled={isLoading}` dan ikon `Eye/EyeOff` dari `lucide-react` agar serupa dengan halaman login yang sudah Anda buat.


--------------------------------------------------------------------------------

lakukan persiapan untuk ini rancangan ini:

Karena sudah menggunakan **NextAuth.js** dan **Prisma**, kita hanya perlu melakukan konfigurasi di dua sisi: **Google Cloud Console** dan **Kode Project**.

---

### 1. Konfigurasi Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Buat Proyek baru (atau pilih yang sudah ada).
3. Pergi ke **APIs & Services > OAuth consent screen**. Pilih **External** dan isi data aplikasi (nama, email support).
4. Pergi ke **Credentials > Create Credentials > OAuth client ID**.
5. Pilih **Web application**:
* **Authorized JavaScript origins**: `http://localhost:3000` (dan domain Vercel Anda nanti).
* **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`.


6. Anda akan mendapatkan **Client ID** dan **Client Secret**.

---

### 2. Update Environment Variables (`.env`)

Simpan kredensial tersebut di file `.env` Anda (jangan lupa tambahkan ke Vercel juga nanti):

```env
GOOGLE_CLIENT_ID=nomor-id-anda.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=rahasia-client-secret-anda

```

---

### 3. Update Konfigurasi NextAuth

Buka file konfigurasi NextAuth Anda (biasanya di `src/app/api/auth/[...nextauth]/route.ts` atau `src/lib/auth.ts`) dan tambahkan `GoogleProvider`:

```tsx
import GoogleProvider from "next-auth/providers/google";

// Di dalam array providers:
providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }),
  // ... credentials provider Anda yang lama tetap ada di sini
],

```

---

### 4. Tambahkan Tombol di Halaman Login

Update `src/app/login/page.tsx` untuk menambahkan tombol Google. Gunakan `signIn("google")` dari `next-auth/react`.

```tsx
import { signIn } from "next-auth/react";

// Di dalam return UI, tambahkan di bawah form:
<div className="mt-6">
  <div className="relative mb-4">
    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-300 dark:border-gray-600"></span></div>
    <div className="relative flex justify-center text-sm"><span className="bg-white dark:bg-slate-900 px-2 text-gray-500">Or continue with</span></div>
  </div>

  <button
    type="button"
    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
    className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
  >
    <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-5 h-5" />
    <span className="text-sm font-medium">Sign in with Google</span>
  </button>
</div>

```
