import { AnalysisResult, QuizQuestion } from '../router';
import { getPrompt, getQuizPrompt } from '../prompts';

export async function analyzeWithOpenRouter(text: string): Promise<AnalysisResult> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY is missing");

    const url = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1/chat/completions";

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3000",
            "X-Title": "Qawaid AI",
        },
        body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [{ role: "user", content: getPrompt(text) }],
        })
    });

    if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
        throw new Error("No content returned from OpenRouter");
    }

    try {
        const cleanJson = content.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("Failed to parse OpenRouter response:", content);
        throw new Error("Invalid JSON format from OpenRouter");
    }
}

export async function generateQuizWithOpenRouter(count: number, difficulty?: string, contextTexts?: string[]): Promise<QuizQuestion[]> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY is missing");

    const url = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1/chat/completions";

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3000",
            "X-Title": "Qawaid AI",
        },
        body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [{ role: "user", content: getQuizPrompt(count, difficulty, contextTexts) }],
        })
    });

    if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) throw new Error("No content returned from OpenRouter");

    try {
        const cleanJson = content.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("Failed to parse OpenRouter quiz response:", content);
        throw new Error("Invalid JSON format from OpenRouter quiz");
    }
}
