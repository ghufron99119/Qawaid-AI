import { tokenizeArabic } from '../arabic/tokenize';
import { GRAMMAR_HINTS } from '../arabic/rules';
import { IRAB_SCHEMA } from './schema';

/**
 * Shared system prompt with refined identity and grammar context.
 */
export function getSystemPrompt(): string {
  return `You are "Qawaid AI", a Senior Arabic Linguistics Expert (Nahwu/Sharaf) following the methodology of Imam Sibawayh.

## ROLE
- Authoritative scholar of Arabic morphosyntax.
- Provide pedagogical explanations in Indonesian.
- Return ONLY valid JSON as specified in the schema.

${GRAMMAR_HINTS}

## BOUNDARIES
1. If input is not Arabic: Return only {"error": "Tolong masukkan bahasa Arab saja."}.
2. Return ONLY JSON. No introductory text or markdown wrappers unless requested.
3. Word parsing must be consistent with the provided tokens.`;
}

/**
 * Analysis prompt with Structured Output, Tokenization, and Few-Shot examples.
 */
export function getPrompt(text: string, contextNotes?: string[]): string {
  const tokens = tokenizeArabic(text);
  const contextSection = contextNotes && contextNotes.length > 0
    ? `\n## REFERENCE CONTEXT\n${contextNotes.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n`
    : '';

  return `Analyze the following Arabic sentence word-by-word.

Sentence: "${text}"
Tokens: ${tokens.join(" | ")}

${contextSection}

${IRAB_SCHEMA}

## FEW-SHOT EXAMPLE
Input: "ذهب الطالب"
Output:
[
  {
    "word": "ذهب",
    "type": "fiil madhi",
    "role": "fiil",
    "i3rab": "فعل ماضٍ مبني على الفتح",
    "explanation": "Kata kerja lampau.",
    "reasoning": "Diawali fi'il (Jumlah Fi'liyyah). 'ذهب' adalah fi'il madhi mabni 'alal fath.",
    "confidence": "high"
  },
  {
    "word": "الطالب",
    "type": "isim mufrad",
    "role": "fa'il",
    "i3rab": "فاعل مرفوع وعلامة رفعه الضمة",
    "explanation": "Subjek/pelaku.",
    "reasoning": "Isim setelah fi'il yang melakukan perbuatan. Marfu' dengan dhammah.",
    "confidence": "high"
  }
]

## TASK
Analyze the provided sentence and tokens. 
If the text is NOT Arabic, return: {"error": "Mohon masukkan teks Arab saja."}
Return ONLY the JSON array.`;
}

/**
 * Quiz generation prompt remains largely the same but with refined instructions.
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
