/**
 * Strict JSON output schema for I'rab analysis.
 * Used to constrain AI generation for higher stability.
 */
export const IRAB_SCHEMA = `
## OUTPUT FORMAT
Return ONLY a valid JSON array of objects. No introductory or concluding text.

Schema per object:
{
  "word": string,       // The exact word from the input
  "type": string,       // Category: "isim", "fiil", or "harf" (plus subcategory)
  "role": string,       // Grammatical role (e.g., "fa'il", "mubtada'", "maf'ul bihi")
  "i3rab": string,      // The formal I'rab analysis in ARABIC
  "explanation": string, // Simple explanation in INDONESIAN
  "reasoning": string,   // Step-by-step reasoning for this word in INDONESIAN
  "confidence": "high" | "medium" | "low"
}
`;
