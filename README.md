<div align="center">

<img src="https://img.shields.io/badge/%D9%82%D9%88%D8%A7%D8%B9%D8%AF_AI-Intelligent_Arabic_Grammar-10B981?style=for-the-badge&labelColor=0f172a" alt="Qawaid AI" />

# قواعد AI — Qawaid AI

**Intelligent Arabic Grammar Companion**

<p>
  <em>AI-powered I'rab analysis · Smart notes · Interactive quizzes · Local model playground</em>
</p>

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Ollama](https://img.shields.io/badge/Ollama-Local_AI-ffffff?style=flat-square&logo=ollama&logoColor=black)](https://ollama.com/)
[![License](https://img.shields.io/badge/License-MIT-10B981?style=flat-square)](LICENSE)

[Getting Started](#-getting-started) · [Features](#-features) · [Tech Stack](#-tech-stack) · [Architecture](#-architecture) · [Contributing](#-contributing)

</div>

<br/>

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Schema](#️-database-schema)
- [Route Map](#️-route-map)
- [Application Workflow](#-application-workflow)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

<br/>

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 🔐 Authentication & Security
- Multi-provider login — **Email/Password** + **Google OAuth 2.0**
- Secure password reset via **UUID tokens** (1-hour expiry)
- Client & server validation with **Zod**
- Password hashing with **bcryptjs**
- "Remember Me" & password visibility toggle

</td>
<td width="50%" valign="top">

### 🔍 I'rab Analysis
- Full **RTL** Arabic text input support
- Multi-provider AI fallback chain (Gemini → OpenRouter → Groq)
- **Local Model Pool** via Ollama for offline development
- Automatic word-type highlighting:
  🟢 Fi'il · 🔵 Isim · 🟡 Harf
- Detailed I'rab: position, case endings, CoT reasoning
- Save any analysis as a personal note

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 📒 Smart Notes
- Save & browse analyzed Arabic texts privately
- Dedicated detail view per note
- Owner-only access control
- Personal annotations for study reference

</td>
<td width="50%" valign="top">

### 🧠 AI-Powered Quiz
- Dynamically generated **multiple-choice** questions
- Configurable difficulty (beginner → advanced)
- Intuitive navigation with progress indicator
- Elegant result screen with score & feedback
- Auto-saved quiz history & scores

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 📊 User Dashboard
- Total analyses count & average quiz score
- Learning history & progress visualization
- Quick-access links to all features

</td>
<td width="50%" valign="top">

### 🧪 AI Playground
- Test & compare local Ollama models side-by-side
- Manual model selection (Qwen · GLM · Llama)
- Real-time output for prompt tuning & accuracy testing

</td>
</tr>
</table>

<br/>

## 🛠 Tech Stack

<table>
<tr>
<td><strong>Layer</strong></td>
<td><strong>Technology</strong></td>
</tr>
<tr><td>Framework</td><td><a href="https://nextjs.org/">Next.js 16</a> (App Router)</td></tr>
<tr><td>UI</td><td><a href="https://react.dev/">React 19</a></td></tr>
<tr><td>Language</td><td><a href="https://www.typescriptlang.org/">TypeScript 5</a></td></tr>
<tr><td>Styling</td><td><a href="https://tailwindcss.com/">Tailwind CSS v4</a> · Emerald-Slate theme</td></tr>
<tr><td>Fonts</td><td>Inter · Noto Naskh Arabic · IBM Plex Sans Arabic · Amiri</td></tr>
<tr><td>Validation</td><td><a href="https://zod.dev/">Zod v4</a></td></tr>
<tr><td>Icons</td><td><a href="https://lucide.dev/">Lucide React</a></td></tr>
<tr><td>ORM</td><td><a href="https://www.prisma.io/">Prisma v5</a></td></tr>
<tr><td>Database</td><td>PostgreSQL via <a href="https://neon.tech/">Neon</a></td></tr>
<tr><td>Auth</td><td><a href="https://next-auth.js.org/">NextAuth.js v4</a> (Credentials + Google)</td></tr>
<tr><td>Email</td><td><a href="https://resend.com/">Resend</a></td></tr>
<tr><td>AI (Cloud)</td><td>Google Gemini · OpenRouter · Groq</td></tr>
<tr><td>AI (Local)</td><td><a href="https://ollama.com/">Ollama</a> — qwen2.5-coder · glm-5 · llama3.2</td></tr>
</table>

<br/>

## 🏗 Architecture

```mermaid
graph TB
    subgraph Client["🖥️ Client (React 19)"]
        LP[Landing Page]
        AN[Analyze Page]
        QZ[Quiz Module]
        NT[Notes Manager]
        DB[Dashboard]
        PG_UI[AI Playground]
    end

    subgraph API["⚡ API Routes (Next.js)"]
        AA["/api/analyze"]
        AQ["/api/quiz/*"]
        ANT["/api/notes"]
        AUTH["/api/auth/*"]
        APG["/api/admin/playground"]
    end

    subgraph AI["🤖 AI Router"]
        direction TB
        subgraph Local["Local (Ollama)"]
            QW[qwen2.5-coder]
            GL[glm-5]
            LL[llama3.2]
        end
        subgraph Cloud["Cloud Providers"]
            GEM[Google Gemini]
            OR[OpenRouter]
            GRQ[Groq]
        end
    end

    subgraph Data["💾 Data Layer"]
        PR[Prisma ORM]
        PGD[(PostgreSQL)]
    end

    AN --> AA
    QZ --> AQ
    NT --> ANT
    Client --> AUTH
    PG_UI --> APG

    AA --> AI
    AQ --> AI
    APG --> Local

    Local -.->|fallback| Cloud
    GEM -.->|fallback| OR
    OR -.->|fallback| GRQ

    API --> PR
    PR --> PGD

    AUTH --> NA[NextAuth.js]
    NA --> PGD
```

<br/>

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|:---|:---|
| Node.js | `≥ 18.x` |
| npm / yarn | latest |
| PostgreSQL | any — recommended: [Neon](https://neon.tech/) |
| Ollama *(optional)* | latest — for local AI models |

### Quick Start

```bash
# 1 — Clone
git clone https://github.com/your-username/QawaidAI.git
cd QawaidAI

# 2 — Install
npm install

# 3 — Environment
cp .env.example .env
# → edit .env with your keys (see section below)

# 4 — Database
npx prisma db push
npx prisma generate

# 5 — Run
npm run dev
```

> Open **[http://localhost:3000](http://localhost:3000)** and start analyzing Arabic text!

### Local AI Setup *(optional)*

```bash
# Start Ollama
ollama serve

# Pull required models
ollama pull qwen2.5-coder:7b
ollama pull llama3.2
ollama pull glm-5:cloud

# Set AI_PROVIDER=ollama in your .env
```

<br/>

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
# ─── Database ─────────────────────────────────────────────────────────────
DATABASE_URL="postgresql://user:password@host:5432/qawaidai"

# ─── NextAuth.js ──────────────────────────────────────────────────────────
NEXTAUTH_SECRET="your_strong_random_secret"
NEXTAUTH_URL="http://localhost:3000"

# ─── Google OAuth ─────────────────────────────────────────────────────────
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# ─── AI Provider Mode ────────────────────────────────────────────────────
AI_PROVIDER="ollama"                           # "ollama" | "gemini"
OLLAMA_URL="http://localhost:11434"

# ─── Local Model Pool ────────────────────────────────────────────────────
OLLAMA_MODEL_GRAMMAR="qwen2.5-coder:7b"
OLLAMA_MODEL_REASONING="glm-5:cloud"
OLLAMA_MODEL_GENERAL="llama3.2"

# ─── Cloud AI Keys (Production / Fallback) ───────────────────────────────
GEMINI_API_KEY="your_gemini_api_key"
OPENROUTER_API_KEY="your_openrouter_api_key"
GROQ_API_KEY="your_groq_api_key"

# ─── Resend (Email) ──────────────────────────────────────────────────────
RESEND_API_KEY="re_your_resend_api_key"
```

> [!NOTE]
> **Development:** Set `AI_PROVIDER=ollama` — all requests route to your local models, no API keys needed.
> **Production:** Set `AI_PROVIDER=gemini` — requires at least `GEMINI_API_KEY`. Automatic fallback to OpenRouter → Groq.

<br/>

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

<br/>

## 🗺️ Route Map

| Route | Access | Description |
|:---|:---:|:---|
| `/` | 🌐 Public | Landing page |
| `/login` | 🌐 Public | Sign in (Email/Password · Google OAuth) |
| `/register` | 🌐 Public | Create a new account |
| `/forgot-password` | 🌐 Public | Request password reset email |
| `/reset-password/[token]` | 🌐 Public | Set new password via reset token |
| `/dashboard` | 🔒 Auth | User progress & statistics |
| `/analyze` | 🔒 Auth | Arabic text I'rab analysis |
| `/notes` | 🔒 Auth | Browse saved notes |
| `/notes/[id]` | 🔒 Auth | View note detail |
| `/quiz` | 🔒 Auth | AI-powered interactive quiz |
| `/admin/playground` | 🔒 Auth | Local AI model testing & comparison |

<br/>

## 🔄 Application Workflow

```mermaid
flowchart LR
    A["🔐 Register / Login"] --> B["📊 Dashboard"]
    B --> C["🔍 Analyze Arabic Text"]
    C --> D{"💾 Save?"}
    D -->|Yes| E["📒 Notes"]
    D -->|No| C
    B --> F["🧠 Quiz"]
    F --> G["⚙️ Select Difficulty"]
    G --> H["✍️ Answer Questions"]
    H --> I["🏆 View Score"]
    I --> B
    E --> B
    B --> J["🧪 AI Playground"]
```

<br/>

## 📁 Project Structure

```
QawaidAI/
├── prisma/
│   └── schema.prisma                # Database schema definition
├── public/                           # Static assets (SVGs, favicon)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── admin/playground/     # POST — AI playground testing
│   │   │   ├── analyze/              # POST — AI text analysis
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/    # NextAuth.js handler
│   │   │   │   ├── forgot-password/  # POST — send reset email
│   │   │   │   ├── register/         # POST — create account
│   │   │   │   └── reset-password/   # POST — apply new password
│   │   │   ├── notes/                # GET  — fetch saved notes
│   │   │   └── quiz/
│   │   │       ├── generate/         # POST — AI quiz generation
│   │   │       └── submit/           # POST — submit quiz answers
│   │   ├── admin/playground/         # 🧪 AI Playground page
│   │   ├── analyze/                  # 🔍 Analysis page
│   │   ├── dashboard/                # 📊 Dashboard page
│   │   ├── forgot-password/          # Forgot password page
│   │   ├── login/                    # Login page
│   │   ├── notes/[id]/               # 📒 Note detail page
│   │   ├── quiz/                     # 🧠 Quiz page
│   │   ├── register/                 # Register page
│   │   ├── reset-password/[token]/   # Reset password page
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Landing page
│   ├── components/
│   │   ├── quiz/                     # Quiz UI components
│   │   ├── ui/                       # Shared UI primitives
│   │   ├── AuthProvider.tsx          # NextAuth session provider
│   │   └── Navbar.tsx                # Navigation bar
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── providers/
│   │   │   │   ├── gemini.ts         # Google Gemini provider
│   │   │   │   ├── groq.ts           # Groq provider
│   │   │   │   ├── ollama.ts         # Ollama local provider
│   │   │   │   └── openrouter.ts     # OpenRouter provider
│   │   │   ├── localModels.ts        # Task → model mapping
│   │   │   ├── prompts.ts            # Prompt engineering (CoT)
│   │   │   └── router.ts             # Multi-provider fallback router
│   │   ├── auth.ts                   # NextAuth configuration
│   │   ├── prisma.ts                 # Prisma client singleton
│   │   └── tokens.ts                 # Token generation utilities
│   ├── styles/                       # Global CSS
│   └── types/
│       └── next-auth.d.ts            # NextAuth type extensions
├── .env.example                      # Environment template
├── package.json
└── tsconfig.json
```

<br/>

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch — `git checkout -b feature/amazing-feature`
3. **Commit** your changes — `git commit -m 'feat: add amazing feature'`
4. **Push** to the branch — `git push origin feature/amazing-feature`
5. **Open** a Pull Request

> [!TIP]
> Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

<br/>

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for the preservation of Qur'anic grammar**
**and accessible Arabic language education.**

<sub>© 2026 Qawaid AI Team</sub>

</div>
