// src/lib/ai/orchestrator.ts
// Orchestrator for hybrid AI model architecture (Parsing, Reasoning, Verification)
// This file provides a high‑level API to coordinate the different model layers
// defined in the improvement plan.

import { analyzeWithGemini, generateQuizWithGemini } from "./providers/gemini";
import { analyzeWithOpenRouter, generateQuizWithOpenRouter } from "./providers/openrouter"; // placeholder imports, adjust as needed
import { getPrompt, getQuizPrompt } from "./prompts";
import { validateRelevance } from "./validation";

export type ModelLayer = "parsing" | "reasoning" | "verification";

/**
 * Select the appropriate provider function for a given layer.
 * For simplicity we use a cost‑effective default mapping:
 * - parsing: Llama 3.3 70B via OpenRouter (fast, cheap)
 * - reasoning: Gemini 2.5 Pro (high quality)
 * - verification: DeepSeek R1 or Claude 3.5 Haiku (critique)
 */
function getProviderForLayer(layer: ModelLayer) {
  switch (layer) {
    case "parsing":
      // Use OpenRouter for parsing (placeholder function)
      return analyzeWithOpenRouter;
    case "reasoning":
      return analyzeWithGemini;
    case "verification":
      // For verification we reuse Gemini as a placeholder; replace with DeepSeek/Claude later
      return analyzeWithGemini;
    default:
      throw new Error(`Unknown model layer: ${layer}`);
  }
}

/**
 * Orchestrate a full analysis workflow.
 * 1. Parsing layer produces a basic morphological list.
 * 2. Reasoning layer refines the output using CoT, Step‑Back and CoVe prompts.
 * 3. Verification layer validates the refined result and may correct it.
 */
export async function orchestrateAnalysis(text: string): Promise<any> {
  // Step 1: Parsing
  const parsingProvider = getProviderForLayer("parsing");
  const basicResult = await parsingProvider(text);

  // Step 2: Reasoning – build a CoT prompt using the basic result as context
  const reasoningPrompt = getPrompt(text);
  const reasoningProvider = getProviderForLayer("reasoning");
  const refinedResult = await reasoningProvider(reasoningPrompt);

  // Step 3: Verification – ensure relevance and correctness
  const verificationProvider = getProviderForLayer("verification");
  const verificationPrompt = `Verify the following analysis for correctness and completeness.\n\n${JSON.stringify(refinedResult)}`;
  const verifiedResult = await verificationProvider(verificationPrompt);

  // Optional relevance check using SBERT (placeholder implementation)
  const isRelevant = await validateRelevance(text, verifiedResult);
  if (!isRelevant) {
    console.warn("[Orchestrator] Relevance check failed – returning refined result.");
    return refinedResult;
  }
  return verifiedResult;
}

/**
 * Orchestrate quiz generation with optional context injection (RAG).
 */
export async function orchestrateQuiz(count: number, difficulty?: string, contextTexts?: string[]): Promise<any> {
  const prompt = getQuizPrompt(count, difficulty, contextTexts);
  const provider = getProviderForLayer("reasoning"); // use reasoning layer for quiz generation
  const rawQuiz = await provider(prompt);
  // Attach IDs if missing
  return Array.isArray(rawQuiz) ? rawQuiz.map((q, i) => ({ ...q, id: i + 1 })) : rawQuiz;
}
