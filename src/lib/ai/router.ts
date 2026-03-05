import { analyzeWithGemini } from './providers/gemini';
import { analyzeWithOpenRouter } from './providers/openrouter';
import { analyzeWithGroq } from './providers/groq';

export type AnalysisItem = {
    word: string;
    type: string;
    i3rab: string;
    explanation?: string;
};

export type AnalysisResult = AnalysisItem[];

export async function analyzeWithFallback(text: string): Promise<AnalysisResult> {
    const providers = [
        { name: 'Gemini', fn: analyzeWithGemini },
        { name: 'OpenRouter', fn: analyzeWithOpenRouter },
        { name: 'Groq', fn: analyzeWithGroq },
    ];

    let lastError: Error | null = null;
    const errors: string[] = [];

    for (const provider of providers) {
        try {
            console.log(`[AI Router] Trying provider: ${provider.name}...`);
            const result = await provider.fn(text);

            // Basic validation
            if (Array.isArray(result) && result.length > 0 && typeof result[0].word === 'string') {
                console.log(`[AI Router] Provider ${provider.name} succeeded.`);
                return result;
            } else {
                throw new Error('Invalid response format (not a valid array of items)');
            }
        } catch (error) {
            const e = error as Error;
            lastError = e;
            errors.push(`${provider.name}: ${e.message}`);
            console.warn(`[AI Router] Provider ${provider.name} failed:`, e.message);
            // Fallback: continue to next provider
        }
    }

    throw new Error(`All AI providers failed. Details: ${errors.join(' | ')}`);
}
