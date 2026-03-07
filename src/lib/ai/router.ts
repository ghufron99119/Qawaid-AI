import { analyzeWithGemini, generateQuizWithGemini } from './providers/gemini';
import { analyzeWithOpenRouter, generateQuizWithOpenRouter } from './providers/openrouter';
import { analyzeWithGroq, generateQuizWithGroq } from './providers/groq';
import { ollamaGenerate } from './providers/ollama';
import { LOCAL_MODELS } from './localModels';
import { getPrompt, getQuizPrompt, getSystemPrompt } from './prompts';
import { jsonrepair } from 'jsonrepair';

export type AnalysisItem = {
    word: string;
    type: string;
    role: string;
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

/**
 * Utility to clean AI response and parse JSON safely using jsonrepair.
 */
function cleanAndParseJson<T>(text: string): T {
    try {
        // 1. Initial trim
        let clean = text.trim();
        
        // 2. Remove markdown code block markers if present
        clean = clean.replace(/^```[a-zA-Z]*\n?([\s\S]*)\n?```$/m, '$1').trim();
        
        // 3. Try aggressive JSON repair before initial parse
        try {
            const repaired = jsonrepair(clean);
            return JSON.parse(repaired);
        } catch (repairError) {
            // 4. Fallback extraction: find the first { or [ and the last } or ]
            const startChar = clean.search(/[\[\{]/);
            const endChar = Math.max(clean.lastIndexOf(']'), clean.lastIndexOf('}'));
            
            if (startChar !== -1 && endChar !== -1 && endChar > startChar) {
                const inner = clean.substring(startChar, endChar + 1);
                try {
                    const repairedInner = jsonrepair(inner);
                    return JSON.parse(repairedInner);
                } catch (secondError) {
                    console.error("[AI Router] Failed to parse repaired JSON block:", inner);
                    throw repairError;
                }
            }
            throw repairError;
        }
    } catch (error) {
        console.error("[AI Router] JSON Parse Error. Raw content:", text);
        throw new Error("Invalid format received from AI provider");
    }
}

export async function analyzeWithFallback(text: string, contextNotes?: string[]): Promise<AnalysisResult> {
    const providerSetting = process.env.AI_PROVIDER;
    const errors: string[] = [];

    // 1. Try Ollama first if configured as priority
    if (providerSetting === 'ollama') {
        try {
            console.log(`[AI Router] Using Ollama (Local Model: ${LOCAL_MODELS.grammar}) for analysis...`);
            const systemPrompt = getSystemPrompt();
            const userPrompt = getPrompt(text, contextNotes);
            const combinedPrompt = `${systemPrompt}\n\n${userPrompt}`;
            
            const response = await ollamaGenerate(LOCAL_MODELS.grammar, combinedPrompt);
            const result = cleanAndParseJson<AnalysisResult>(response);
            
            if (validateAnalysis(result)) {
                return result;
            }
            throw new Error("Local model returned invalid items structure");
        } catch (error) {
            const msg = (error as Error).message;
            console.warn(`[AI Router] Ollama failed, falling back to cloud providers:`, msg);
            errors.push(`Ollama: ${msg}`);
        }
    }

    const providers = [
        { name: 'Gemini', fn: analyzeWithGemini },
        { name: 'OpenRouter', fn: analyzeWithOpenRouter },
        { name: 'Groq', fn: analyzeWithGroq },
    ];

    for (const provider of providers) {
        try {
            console.log(`[AI Router] Trying provider: ${provider.name}...`);
            let result = await provider.fn(text, contextNotes);

            // Recovery logic for wrapped objects
            if (!Array.isArray(result) && typeof result === 'object' && result !== null) {
                const foundArray = Object.values(result).find(val => Array.isArray(val)) as any[];
                if (foundArray) result = foundArray;
            }

            if (Array.isArray(result) && validateAnalysis(result)) {
                console.log(`[AI Router] ${provider.name} succeeded.`);
                return result;
            }
            throw new Error('Invalid analysis format');
        } catch (error) {
            const e = error as Error;
            errors.push(`${provider.name}: ${e.message}`);
            console.warn(`[AI Router] ${provider.name} failed:`, e.message);
        }
    }

    throw new Error(`All AI providers failed. Details: ${errors.join(' | ')}`);
}

/**
 * Validate analysis items have minimum required fields.
 */
function validateAnalysis(result: any[]): result is AnalysisResult {
    return result.every(item => 
        item && 
        typeof item.word === 'string' && 
        typeof item.type === 'string' &&
        (typeof item.role === 'string' || typeof item.i3rab === 'string')
    );
}

export async function generateQuizWithFallback(count: number, difficulty?: string, contextTexts?: string[]): Promise<QuizQuestion[]> {
    const providerSetting = process.env.AI_PROVIDER;
    const errors: string[] = [];

    if (providerSetting === 'ollama') {
        try {
            const model = LOCAL_MODELS.reasoning || LOCAL_MODELS.general;
            console.log(`[AI Router - Quiz] Using Ollama (${model}) for quiz generation...`);
            const systemPrompt = getSystemPrompt();
            const userPrompt = getQuizPrompt(count, difficulty, contextTexts);
            const combinedPrompt = `${systemPrompt}\n\n${userPrompt}`;

            const response = await ollamaGenerate(model, combinedPrompt);
            const result = cleanAndParseJson<QuizQuestion[]>(response);
            return result.map((q, i) => ({ ...q, id: i + 1 }));
        } catch (error) {
            const msg = (error as Error).message;
            console.warn(`[AI Router - Quiz] Ollama failed:`, msg);
            errors.push(`Ollama: ${msg}`);
        }
    }

    const providers = [
        { name: 'Gemini', fn: generateQuizWithGemini },
        { name: 'OpenRouter', fn: generateQuizWithOpenRouter },
        { name: 'Groq', fn: generateQuizWithGroq },
    ];

    for (const provider of providers) {
        try {
            const result = await provider.fn(count, difficulty, contextTexts);
            if (Array.isArray(result) && result.length > 0) {
                return result.map((q, i) => ({ ...q, id: i + 1 }));
            }
        } catch (error) {
            errors.push(`${provider.name}: ${(error as Error).message}`);
        }
    }

    throw new Error(`Quiz generation failed. Details: ${errors.join(' | ')}`);
}
