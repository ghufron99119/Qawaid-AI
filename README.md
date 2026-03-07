<div align="center">

# قواعد AI

### Intelligent Arabic Grammar Companion

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge)](LICENSE)

**Qawaid AI** adalah platform edukasi interaktif berbasis kecerdasan buatan yang dirancang untuk mempermudah pembelajaran tata bahasa Arab (**Nahwu** dan **Sharaf**). Analisis struktur kalimat secara instan, simpan catatan pembelajaran, dan uji kemampuanmu melalui kuis yang dihasilkan AI.

[Getting Started](#-getting-started) · [Features](#-features) · [Tech Stack](#-tech-stack) · [Architecture](#-architecture) · [Contributing](#-contributing)

</div>

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)
- [Route Map](#-route-map)
- [Application Workflow](#-application-workflow)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔐 Authentication & Security
- Multi-provider login — **Email/Password** + **Google OAuth 2.0**
- Secure password reset flow via **UUID tokens** (1-hour expiry)
- Schema validation with **Zod** (client & server)
- Password hashing with **bcryptjs**
- "Remember Me" & password visibility toggle

</td>
<td width="50%">

### 🔍 I'rab Analysis (Arabic Grammar)
- Full **RTL** text input support
- **Multi-provider AI** fallback: Gemini → OpenRouter → Groq
- **Local Model Pool (Ollama)**: Use local models for development and research:
  - `qwen2.5-coder` (Grammar Analysis)
  - `glm-5:cloud` (Reasoning)
  - `llama3.2` (General Tasks)

### 🧪 AI Playground (Admin Only)
- Interactive playground to test and compare different local models.
- Manually switch between models in the Model Pool.
- Real-time output visualization for prompt tuning and I'rab accuracy testing.


</td>
</tr>
<tr>
<td width="50%">

### 📒 Smart Notes
- Save & browse analyzed Arabic texts privately
- Dedicated detail view per note (`/notes/[id]`)
- Owner-only access control
- Personal annotations for study reference

</td>
<td width="50%">

### 🧠 AI-Powered Quiz
- Dynamically AI-generated **multiple-choice** questions
- Configurable difficulty levels
- Intuitive question navigation with progress indicator
- Elegant result screen with score & feedback
- Auto-saved quiz history & scores

</td>
</tr>
<tr>
<td colspan="2" align="center">

### 📊 User Dashboard
Track your progress — total analyses, average quiz scores, and learning history — all in one place.

</td>
</tr>
</table>

---

## 🛠 Tech Stack

| Layer | Technology |
|:---|:---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) · Emerald-Slate theme |
| **Fonts** | [Inter](https://fonts.google.com/specimen/Inter) · [Noto Naskh Arabic](https://fonts.google.com/noto/specimen/Noto+Naskh+Arabic) · [IBM Plex Sans Arabic](https://fonts.google.com/specimen/IBM+Plex+Sans+Arabic) · [Amiri](https://fonts.google.com/specimen/Amiri) |
| **Validation** | [Zod v4](https://zod.dev/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **ORM** | [Prisma v5](https://www.prisma.io/) |
| **Database** | PostgreSQL — [Neon](https://neon.tech/) |
| **Auth** | [NextAuth.js v4](https://next-auth.js.org/) (Credentials + Google Provider) |
| **Email** | [Resend](https://resend.com/) |
| **AI Providers** | Google Gemini · OpenRouter · Groq |

---

## 🏗 Architecture

```mermaid
graph TB
    subgraph Client["🖥️ Client (React 19)"]
        LP[Landing Page]
        AN[Analyze Page]
        QZ[Quiz Module]
        NT[Notes Manager]
        DB[Dashboard]
    end

    subgraph API["⚡ API Routes (Next.js)"]
        AA["/api/analyze"]
        AQ["/api/quiz/*"]
        ANT["/api/notes"]
        AUTH["/api/auth/*"]
    end

    subgraph AI["🤖 AI Router (Multi-Provider)"]
        LLM[Local Model Pool]
        GEM[Google Gemini]
        OR[OpenRouter]
        GRQ[Groq]
    end

    subgraph Data["💾 Data Layer"]
        PR[Prisma ORM]
        PG[(PostgreSQL)]
    end

    AN --> AA
    QZ --> AQ
    NT --> ANT
    Client --> AUTH

    AA --> AI
    AQ --> AI
    LLM -.->|fallback| GEM
    GEM -.->|fallback| OR
    OR -.->|fallback| GRQ

    API --> PR
    PR --> PG

    AUTH --> NA[NextAuth.js]
    NA --> PG
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|:---|:---|
| Node.js | `≥ 18.x` |
| npm / yarn | latest |
| PostgreSQL | any (recommended: [Neon](https://neon.tech/)) |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/QawaidAI.git
cd QawaidAI

# 2. Install dependencies
npm install

# 3. Configure environment (see section below)
cp .env.example .env

# 4. Push database schema
npx prisma db push
npx prisma generate

# 5. Start development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔑 Environment Variables

Create a `.env` file in the project root with the following configuration:

```env
# ─── Database ─────────────────────────────────────────────────────────────
DATABASE_URL="postgresql://user:password@host:5432/qawaidai"

# ─── NextAuth.js ──────────────────────────────────────────────────────────
NEXTAUTH_SECRET="your_strong_random_secret"
NEXTAUTH_URL="http://localhost:3000"

# ─── Google OAuth ─────────────────────────────────────────────────────────
# https://console.cloud.google.com/
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# ─── AI Engine (Mode) ───────────────────────────────────────────────────
AI_PROVIDER="ollama"                           # "ollama" for local, "gemini" for cloud
OLLAMA_URL="http://localhost:11434"

# ─── Local Model Pool ────────────────────────────────────────────────────
OLLAMA_MODEL_GRAMMAR="qwen2.5-coder:7b"
OLLAMA_MODEL_REASONING="glm-5:cloud"
OLLAMA_MODEL_GENERAL="llama3.2"

# ─── Cloud AI API Keys (Fallback / Production) ──────────────────────────
LLM_API_KEY="your_gemini_api_key"              # Primary Cloud
OPENROUTER_API_KEY="your_openrouter_api_key"
GROQ_API_KEY="your_groq_api_key"

# ─── Resend (Email) ──────────────────────────────────────────────────────
RESEND_API_KEY="re_your_resend_api_key"
```

> [!NOTE]
> At minimum, `LLM_API_KEY` (Google Gemini) is required. If a provider fails, the system automatically falls back to the next available provider.

---

## 🗃️ Database Schema

```mermaid
erDiagram
    User ||--o{ Note : has
    User ||--o{ QuizResult : has

    User {
        string id PK
        string name
        string email UK
        string password_hash
        datetime created_at
    }

    Note {
        string id PK
        string userId FK
        string arabic_text
        json analysisJson
        datetime created_at
    }

    QuizResult {
        string id PK
        string userId FK
        int score
        int totalQuestions
        datetime createdAt
    }

    PasswordResetToken {
        string id PK
        string email
        string token UK
        datetime expires
    }
```

---

## 🗺️ Route Map

| Route | Access | Description |
|:---|:---:|:---|
| `/` | 🌐 Public | Landing page |
| `/login` | 🌐 Public | Sign in (Email/Password · Google OAuth) |
| `/register` | 🌐 Public | Create a new account |
| `/forgot-password` | 🌐 Public | Request password reset email |
| `/reset-password/[token]` | 🌐 Public | Set new password via reset token |
| `/dashboard` | 🔒 Protected | User progress & statistics |
| `/analyze` | 🔒 Protected | Arabic text I'rab analysis |
| `/notes` | 🔒 Protected | Browse saved notes |
| `/notes/[id]` | 🔒 Protected | View note detail |
| `/quiz` | 🔒 Protected | AI-powered interactive quiz |
| `/admin/playground` | 🔒 Protected | AI Model Testing & Comparison |

---

## 🔄 Application Workflow

```mermaid
flowchart LR
    A[Register / Login] --> B[Dashboard]
    B --> C[Analyze Text]
    C --> D{Save?}
    D -->|Yes| E[Notes]
    D -->|No| C
    B --> F[Quiz]
    F --> G[Select Difficulty]
    G --> H[Answer Questions]
    H --> I[View Score]
    I --> B
    E --> B
```

---

## 📁 Project Structure

```
QawaidAI/
├── prisma/
│   └── schema.prisma              # Database schema
├── public/                        # Static assets
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/           # POST  — AI text analysis
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/ # NextAuth.js handler
│   │   │   │   ├── forgot-password/
│   │   │   │   ├── register/
│   │   │   │   └── reset-password/
│   │   │   ├── notes/             # GET   — Fetch saved notes
│   │   │   └── quiz/
│   │   │       ├── generate/      # POST  — AI quiz generation
│   │   │       └── submit/        # POST  — Submit quiz answers
│   │   ├── admin/
│   │   │   └── playground/        # Playground page
│   │   ├── analyze/               # Analysis page
│   │   ├── dashboard/             # Dashboard page
│   │   ├── forgot-password/       # Forgot password page
│   │   ├── login/                 # Login page
│   │   ├── notes/
│   │   │   └── [id]/              # Note detail page
│   │   ├── quiz/                  # Quiz page
│   │   ├── register/              # Register page
│   │   ├── reset-password/
│   │   │   └── [token]/           # Reset password page
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Landing page
│   ├── components/
│   │   ├── quiz/                  # Quiz UI components
│   │   │   ├── QuizClient.tsx
│   │   │   ├── QuizGenerator.tsx
│   │   │   ├── QuizNavigation.tsx
│   │   │   ├── QuizQuestion.tsx
│   │   │   └── QuizResult.tsx
│   │   ├── ui/                    # Shared UI components
│   │   ├── AuthProvider.tsx
│   │   └── Navbar.tsx
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── providers/         # AI provider implementations
│   │   │   │   ├── gemini.ts
│   │   │   │   ├── groq.ts
│   │   │   │   ├── ollama.ts
│   │   │   │   └── openrouter.ts
│   │   │   ├── localModels.ts     # Local model configuration
│   │   │   ├── prompts.ts         # AI prompt templates
│   │   │   └── router.ts          # Multi-provider fallback router
│   │   ├── auth.ts                # NextAuth configuration
│   │   ├── prisma.ts              # Prisma client singleton
│   │   └── tokens.ts              # Token generation utilities
│   ├── styles/                    # Global styles
│   └── types/
│       └── next-auth.d.ts         # NextAuth type extensions
├── .env                           # Environment variables (git-ignored)
├── package.json
└── tsconfig.json
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

> [!TIP]
> Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for the preservation of Qur'anic grammar**
**and accessible Arabic language education.**

<sub>© 2026 Qawaid AI Team</sub>

</div>
