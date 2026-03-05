alurnya seperti ini.

1️⃣  tujuan aplikasi 

aplikasi Qawaid AI bertujuan:

membantu belajar Nahwu / Sharaf

menganalisis struktur kalimat Arab

memberi latihan soal otomatis

Contoh fitur utama:

Analisis kalimat Arab

Highlight jenis kata (fi'il, isim, harf)

Generate quiz

Tracking progress belajar



2️⃣ Tentukan arsitektur teknologi


Frontend

Next.js

Tailwind CSS

Backend API

Next.js API Routes / Route Handler

Database

MySQL 

AI

Google Gemini API

Deployment

Vercel

3️⃣ Desain fitur aplikasi
1. Text Analyzer

User input:

ذهب محمد إلى المدرسة

AI output:

ذهب -> fi'il
محمد -> isim
إلى -> harf
المدرسة -> isim
2. Grammar Explanation

AI menjelaskan:

ذهب = fi'il madhi
محمد = fa'il
إلى = harf jar
المدرسة = isim majrur
3. Quiz Generator

AI membuat soal:

Apa jenis kata "ذهب"?

A. isim
B. fi'il
C. harf
4. Progress tracking

Dashboard:

Text analyzed: 20
Quiz score: 80%
4️⃣ Desain database

Contoh tabel minimal:

users
id
name
email
password
created_at
texts
id
user_id
arabic_text
analysis_result
created_at
quizzes
id
user_id
question
correct_answer
created_at

5️⃣ Desain API endpoint

Contoh API:

Analisis teks
POST /api/analyze

body:

{
"text": "ذهب محمد إلى المدرسة"
}
Generate quiz
POST /api/quiz
Simpan hasil quiz
POST /api/quiz-result

6️⃣ Flow sistem (arsitektur sederhana)

User → Frontend → API → AI → Database → Response

Langkahnya:

user input kalimat

frontend kirim ke API

API kirim prompt ke AI

AI return analisis

backend simpan hasil

frontend tampilkan hasil


Next.js + database sudah cukup.

8️⃣ Urutan kerja yang benar (seperti software engineer)

Jangan langsung coding.

Urutannya:

1️⃣ define feature
2️⃣ design database
3️⃣ design API
4️⃣ design UI flow
5️⃣ baru coding