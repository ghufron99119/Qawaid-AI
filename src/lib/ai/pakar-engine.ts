/**
 * Pakar Engine — Dynamic Knowledge Retrieval for I'rab Analysis.
 *
 * Implements Vector-less RAG: selects relevant Nahwu chapters and
 * few-shot examples based on keyword matching against the input text.
 */

import { NAHWU_KB, type KaidahEntry } from '../knowledge/nahwu-kb';
import { IRAB_EXAMPLES, type IrabExample } from '../knowledge/examples';

// ─── Arabic keyword mappings for detection ───────────────────────────
const KEYWORD_MAP: Record<string, string[]> = {
  // Nawasikh
  "kaana":  ["كَانَ", "كان", "أَصْبَحَ", "أصبح", "أَمْسَى", "أمسى", "لَيْسَ", "ليس", "صَارَ", "صار", "بَاتَ", "بات"],
  "inna":   ["إِنَّ", "إن", "أَنَّ", "أن", "كَأَنَّ", "كأن", "لَيْتَ", "ليت", "لَعَلَّ", "لعل", "لَكِنَّ", "لكن"],
  // Huruf Jar
  "jar":    ["بِ", "لِ", "فِي", "في", "مِنْ", "من", "إِلَى", "إلى", "عَنْ", "عن", "عَلَى", "على"],
  // Huruf Nashab
  "nashab": ["لَنْ", "لن", "أَنْ", "أن", "كَيْ", "كي", "حَتَّى", "حتى"],
  // Huruf Jazm
  "jazm":   ["لَمْ", "لم", "لَمَّا", "لما", "لَا", "لا"],
  // Nida'
  "nida":   ["يَا", "يا", "أَيَا", "أيا", "هَيَا", "هيا"],
  // Istisna'
  "istisna":["إِلَّا", "إلا", "غَيْرَ", "غير", "سِوَى", "سوى"],
  // Dhonna
  "dhonna": ["ظَنَّ", "ظن", "حَسِبَ", "حسب", "خَالَ", "خال", "زَعَمَ", "زعم"],
};

/**
 * Detect which tags are relevant to the input text.
 */
function detectTags(text: string): string[] {
  const detected: Set<string> = new Set();

  // Match against keyword map
  for (const [category, keywords] of Object.entries(KEYWORD_MAP)) {
    for (const kw of keywords) {
      if (text.includes(kw)) {
        detected.add(category);
        break;
      }
    }
  }

  // Always include foundational bab
  detected.add("i'rab");
  detected.add("tanda i'rab");

  // Heuristic: if no special particles detected, likely a basic jumlah
  if (detected.size <= 2) {
    detected.add("fa'il");
    detected.add("mubtada'");
    detected.add("khobar");
    detected.add("maf'ul bih");
  }

  return Array.from(detected);
}

/**
 * Retrieve relevant Kaidah chapters based on the input text.
 * Returns formatted rules text for prompt injection.
 */
export function getRelevantKaidah(text: string): string {
  const tags = detectTags(text);

  const relevant: KaidahEntry[] = NAHWU_KB.filter(entry =>
    entry.tags.some(tag => tags.some(t => tag.includes(t) || t.includes(tag)))
  );

  // Fallback: if nothing matched, return the core chapters
  if (relevant.length === 0) {
    return NAHWU_KB
      .filter(k => ["Marfu'atul Asma'", "Manshubatul Asma'", "Tanda-Tanda I'rab"].includes(k.bab))
      .map(k => `### ${k.bab}\n${k.rules.map(r => `- ${r}`).join('\n')}`)
      .join('\n\n');
  }

  return relevant
    .map(k => `### ${k.bab}\n${k.rules.map(r => `- ${r}`).join('\n')}`)
    .join('\n\n');
}

/**
 * Retrieve the most relevant few-shot examples for the input text.
 * Uses tag overlap scoring to find structurally similar examples.
 */
export function getRelevantExamples(text: string, count: number = 3): string {
  const tags = detectTags(text);

  // Score each example by tag overlap
  const scored = IRAB_EXAMPLES.map(ex => {
    let score = 0;
    const babLower = ex.bab.toLowerCase();
    for (const tag of tags) {
      if (babLower.includes(tag.toLowerCase())) score += 2;
    }
    // Bonus for structural similarity (same word count)
    const inputWordCount = text.trim().split(/\s+/).length;
    const exampleWordCount = ex.sentence.trim().split(/\s+/).length;
    if (inputWordCount === exampleWordCount) score += 1;

    return { example: ex, score };
  });

  // Sort by score (descending) and take top N
  scored.sort((a, b) => b.score - a.score);
  const selected = scored.slice(0, count).map(s => s.example);

  // If no good matches, return foundational examples (1, 8, 15, 35)
  if (selected.length === 0 || scored[0].score === 0) {
    const fallbackIds = [1, 8, 15, 35];
    const fallbacks = IRAB_EXAMPLES.filter(ex => fallbackIds.includes(ex.id));
    return formatExamples(fallbacks);
  }

  return formatExamples(selected);
}

/**
 * Format examples into a readable few-shot string for the prompt.
 */
function formatExamples(examples: IrabExample[]): string {
  return examples.map(ex => {
    const wordsStr = ex.words
      .map(w => `  - "${w.word}": ${w.irab}`)
      .join('\n');
    return `**${ex.bab}** — "${ex.sentence}" (${ex.translation})\n${wordsStr}`;
  }).join('\n\n');
}
