/**
 * Simple Arabic tokenizer for Qawaid AI.
 * Splits text by whitespace while preserving original words.
 */
export function tokenizeArabic(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(word => word.length > 0);
}

/**
 * Advanced tokenization rules can be added here, 
 * such as handling attached particles (baw, lam, kaf, etc.) 
 * if we want the AI to see them as separate components.
 * For now, we follow the "one word per token" design.
 */
