import { tokenizeArabic } from '../arabic/tokenize';
import { IRAB_SCHEMA } from './schema';
import { getRelevantKaidah, getRelevantExamples } from './pakar-engine';

/**
 * System Prompt: "Al-Mu'rib" — Pakar Nahwu tingkat tinggi.
 * References Matan Al-Ajurrumiyyah & Nadzom Al-Imrithi.
 */
export function getSystemPrompt(): string {
  return `You are "Al-Mu'rib", a top-tier Nahwu expert (Arabic Grammar Scholar) trained in the methodology of Matan Al-Ajurrumiyyah and Nadzom Al-Imrithi.

## ROLE
- Authoritative scholar of Arabic morphosyntax (Nahwu/Sharaf).
- Provide pedagogical explanations in Indonesian.
- Return ONLY valid JSON as specified in the schema.
- Your analysis MUST be grounded in the Kaidah (rules) provided below.

## BOUNDARIES
1. If input is not Arabic: Return only {"error": "Tolong masukkan bahasa Arab saja."}.
2. Return ONLY JSON. No introductory text, no markdown wrappers.
3. Word parsing must be consistent with the provided tokens.
4. Every role and sign MUST follow Ajurrumiyyah rules exactly.`;
}

/**
 * Pakar Analysis Prompt with:
 * - Dynamic Kaidah Retrieval (Vector-less RAG)
 * - Dynamic Few-Shot Examples (from verified 60 examples)
 * - Tokenized input
 * - Strict output schema
 */
export function getPrompt(text: string, contextNotes?: string[]): string {
  const tokens = tokenizeArabic(text);
  const relevantKaidah = getRelevantKaidah(text);
  const relevantExamples = getRelevantExamples(text, 3);

  const contextSection = contextNotes && contextNotes.length > 0
    ? `\n## REFERENCE CONTEXT (Previous Analyses)\n${contextNotes.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n`
    : '';

  return `Analyze the following Arabic sentence word-by-word using Chain of Thought reasoning.

## INPUT
Sentence: "${text}"
Tokens: ${tokens.join(" | ")}
${contextSection}

## KNOWLEDGE BASE (SANAD — Kaidah Ajurrumiyyah/Imrithi)
${relevantKaidah}

## REFERENCE EXAMPLES (Few-Shot Shahih)
${relevantExamples}

${IRAB_SCHEMA}

## INSTRUCTIONS
1. Analyze each token using logical sequencing (Chain of Thought).
2. Determine: type (isim/fiil/harf), role, I'rab sign, and reasoning.
3. Ground your reasoning in the Kaidah above.
4. If the text is NOT Arabic, return: {"error": "Mohon masukkan teks Arab saja."}

Return ONLY the JSON array.`;
}

/**
 * Quiz generation prompt with refined instructions.
 */
export function getQuizPrompt(count: number, difficulty?: string, contextTexts?: string[]): string {
  const difficultyMap: Record<string, string> = {
    beginner: "pemula (dasar)",
    intermediate: "menengah",
    advanced: "lanjut (kompleks)",
  };

  const difficultyLabel = difficulty ? difficultyMap[difficulty] : 'umum';
  const contextSection = contextTexts && contextTexts.length > 0
    ? `\nGunakan konteks: ${contextTexts.join(' | ')}`
    : '';

  return `Generate ${count} Arabic grammar (Nahwu) quiz questions.
Difficulty: ${difficultyLabel}
${contextSection}

## FORMAT
Return a JSON array of objects:
{
  "question": string (Indonesian),
  "options": string[] (4 options),
  "correctAnswer": number (0-3)
}

RETURN ONLY JSON.`;
}
