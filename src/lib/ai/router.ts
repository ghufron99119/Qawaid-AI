import { analyzeWithGemini, generateQuizWithGemini } from './providers/gemini';
import { analyzeWithOpenRouter, generateQuizWithOpenRouter } from './providers/openrouter';
import { analyzeWithGroq, generateQuizWithGroq } from './providers/groq';

export type AnalysisItem = {
    word: string;
    type: string;
    i3rab: string;
    explanation?: string;
    reasoning?: string;
    confidence?: 'high' | 'medium' | 'low';
};

export type AnalysisResult = AnalysisItem[];

export type QuizQuestion = {
    id?: number;
    question: string;
    options: string[];
    correctAnswer: number; // 0-based index
};

export async function analyzeWithFallback(text: string, contextNotes?: string[]): Promise<AnalysisResult> {
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
            let result = await provider.fn(text, contextNotes);

            // Enhanced validation: check structure of each item
            if (Array.isArray(result) && result.length > 0) {
                // ... logic check below ...
            } else if (typeof (result as any) === 'object' && result !== null) {
                // Try to find an array property if the model wrapped it (e.g. { "analysis": [...] })
                const foundArray = Object.values(result as any).find(val => Array.isArray(val) && (val as any[]).length > 0) as any[];
                if (foundArray) {
                    console.log(`[AI Router] Recovered wrapped array from ${provider.name}`);
                    result = foundArray as any;
                }
            }

            if (Array.isArray(result) && result.length > 0) {
                const isValid = result.every(item =>
                    item &&
                    typeof item.word === 'string' && item.word.length > 0 &&
                    typeof item.type === 'string' &&
                    typeof item.i3rab === 'string'
                );
                if (isValid) {
                    console.log(`[AI Router] Provider ${provider.name} succeeded with ${result.length} items.`);
                    return result;
                } else {
                    throw new Error('Response contains items with missing required fields (word, type, i3rab)');
                }
            } else {
                throw new Error('Invalid response format (not a valid non-empty array)');
            }
        } catch (error) {
            const e = error as Error;
            lastError = e;
            errors.push(`${provider.name}: ${e.message}`);
            console.warn(`[AI Router] Provider ${provider.name} failed:`, e.message);
        }
    }

    throw new Error(`All AI providers failed. Details: ${errors.join(' | ')}`);
}

export async function generateQuizWithFallback(count: number, difficulty?: string, contextTexts?: string[]): Promise<QuizQuestion[]> {
    const providers = [
        { name: 'Gemini', fn: generateQuizWithGemini },
        { name: 'OpenRouter', fn: generateQuizWithOpenRouter },
        { name: 'Groq', fn: generateQuizWithGroq },
    ];

    const errors: string[] = [];

    for (const provider of providers) {
        try {
            console.log(`[AI Router - Quiz] Trying provider: ${provider.name}...`);
            const result = await provider.fn(count, difficulty, contextTexts);

            if (Array.isArray(result) && result.length > 0 && typeof result[0].question === 'string') {
                console.log(`[AI Router - Quiz] Provider ${provider.name} succeeded.`);
                // Attach sequential IDs
                return result.map((q, i) => ({ ...q, id: i + 1 }));
            } else {
                throw new Error('Invalid quiz response format');
            }
        } catch (error) {
            const e = error as Error;
            errors.push(`${provider.name}: ${e.message}`);
            console.warn(`[AI Router - Quiz] Provider ${provider.name} failed:`, e.message);
        }
    }

    throw new Error(`All AI providers failed for quiz generation. Details: ${errors.join(' | ')}`);
}
