Bagus, Uzli. Dengan model yang sudah kamu punya di **Ollama**, kita bisa membuat rancangan yang **lebih kuat dan fleksibel** dibanding sebelumnya. Kita akan memasukkan **3 model lokal** kamu ke dalam **AI Router sebagai “Local Model Pool”** untuk eksperimen dan fallback lokal.

Model yang kamu punya:

| Model              | Kegunaan terbaik             |
| ------------------ | ---------------------------- |
| `glm-5:cloud`      | reasoning / bahasa natural   |
| `qwen2.5-coder:7b` | analisis struktur & parsing  |
| `llama3.2`         | general NLP / fallback cepat |

Untuk **analisis Nahwu & I’rab**, biasanya model yang paling stabil adalah **Qwen atau LLaMA**, jadi kita buat routing yang bisa memilih model sesuai tugas.

---

# 1️⃣ Arsitektur Baru (Dengan Local Model Pool)

```text
                    Internet
                       │
                       ▼
                Frontend (Next.js)
                       │
                       ▼
                   API Routes
                       │
                       ▼
                    AI Router
         ┌─────────────┼────────────────┐
         ▼             ▼                ▼
   Local Models     Gemini         OpenRouter
     (Ollama)       Primary         Fallback
         │
         ▼
 ┌────────────┬──────────────┬─────────────┐
 ▼            ▼              ▼
glm-5      qwen2.5-coder     llama3.2
```

Artinya:

* **development** → semua model lokal
* **production** → Gemini
* **fallback production** → OpenRouter / Groq

---

# 2️⃣ Tambahkan Multi-Model Ollama Provider

File baru:

```text
src/lib/ai/providers/ollama.ts
```

Code:

```ts
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434"

export async function ollamaGenerate(model: string, prompt: string) {
  const res = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      prompt,
      stream: false
    })
  })

  if (!res.ok) {
    throw new Error("Ollama error")
  }

  const data = await res.json()
  return data.response
}
```

---

# 3️⃣ Tambahkan Model Selector

File baru:

```text
src/lib/ai/localModels.ts
```

```ts
export const LOCAL_MODELS = {
  reasoning: "glm-5:cloud",
  grammar: "qwen2.5-coder:7b",
  general: "llama3.2"
}
```

---

# 4️⃣ Update Router

Edit:

```
src/lib/ai/router.ts
```

```ts
import { ollamaGenerate } from "./providers/ollama"
import { LOCAL_MODELS } from "./localModels"

import { gemini } from "./providers/gemini"
import { openrouter } from "./providers/openrouter"
import { groq } from "./providers/groq"

export async function generate(prompt: string, task = "general") {

  const provider = process.env.AI_PROVIDER

  if (provider === "ollama") {

    const model =
      task === "grammar"
        ? LOCAL_MODELS.grammar
        : task === "reasoning"
        ? LOCAL_MODELS.reasoning
        : LOCAL_MODELS.general

    return ollamaGenerate(model, prompt)
  }

  if (provider === "gemini") {
    try {
      return await gemini(prompt)
    } catch {}
  }

  try {
    return await openrouter(prompt)
  } catch {}

  return await groq(prompt)
}
```

---

# 5️⃣ Gunakan Task-Based AI Call

Contoh di API analyze:

```
src/app/api/analyze/route.ts
```

```ts
import { generate } from "@/lib/ai/router"

const result = await generate(prompt, "grammar")
```

Artinya:

| Task      | Model         |
| --------- | ------------- |
| grammar   | qwen2.5-coder |
| reasoning | glm           |
| general   | llama         |

Ini membuat sistem kamu **lebih pintar memilih model**.

---

# 6️⃣ Tambahkan Model Switcher (Playground)

Playground nanti bisa memilih model manual.

```
/admin/playground
```

UI:

```
Prompt
↓
Select Model
- glm-5
- qwen2.5
- llama3.2
↓
Run
```

API call:

```ts
ollamaGenerate(selectedModel, prompt)
```

Ini membuat kamu bisa:

* bandingkan model
* tuning prompt
* lihat akurasi i'rab

---

# 7️⃣ Environment Configuration

Development:

```env
AI_PROVIDER=ollama

OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL_GRAMMAR=qwen2.5-coder:7b
OLLAMA_MODEL_REASONING=glm-5:cloud
OLLAMA_MODEL_GENERAL=llama3.2
```

Production (Vercel):

```env
AI_PROVIDER=gemini

LLM_API_KEY=xxxx
OPENROUTER_API_KEY=xxxx
GROQ_API_KEY=xxxx
```

---

# 8️⃣ Workflow Pengembangan

### Jalankan Ollama

```bash
ollama serve
```

### Pastikan model ada

```bash
ollama list
```

### Run project

```bash
npm run dev
```

---

# 9️⃣ Workflow Eksperimen Model

Saat kamu ingin meningkatkan akurasi I’rab:

1️⃣ test prompt di playground
2️⃣ bandingkan model

```
qwen2.5-coder
vs
llama3.2
vs
glm
```

3️⃣ pilih terbaik
4️⃣ update prompt

---

# 🔟 Peningkatan Penting (Sangat Direkomendasikan)

Tambahkan **AI evaluation dataset**.

Contoh:

```
datasets/
nahwu_test.json
```

isi:

```json
[
  {
    "text": "ذهب الطالب إلى المدرسة",
    "expected": "fi'il + fa'il + jar majrur"
  }
]
```

Script:

```
npm run eval
```

Ini akan menguji model.

Ini teknik yang dipakai **AI engineer serius**.

---
