import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalysisResult, QuizQuestion } from '../router';
import { getPrompt, getQuizPrompt, getSystemPrompt } from '../prompts';

export async function analyzeWithGemini(text: string, contextNotes?: string[]): Promise<AnalysisResult> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is missing");

    const genAI = new GoogleGenerativeAI(apiKey);
    // Upgrade to gemini-2.5-pro for reasoning layer and provide system prompt
    const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: getSystemPrompt(),
    });

    const prompt = getPrompt(text, contextNotes);

    const result = await model.generateContent(prompt);
    const response = result.response;
    const jsonText = response.text();

    try {
        const cleanJson = jsonText.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("Failed to parse Gemini response:", jsonText);
        throw new Error("Invalid JSON format from Gemini");
    }
}

export async function generateQuizWithGemini(count: number, difficulty?: string, contextTexts?: string[]): Promise<QuizQuestion[]> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is missing");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: getSystemPrompt(),
    });

    const prompt = getQuizPrompt(count, difficulty, contextTexts);
    const result = await model.generateContent(prompt);
    const jsonText = result.response.text();

    try {
        const cleanJson = jsonText.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("Failed to parse Gemini quiz response:", jsonText);
        throw new Error("Invalid JSON format from Gemini quiz");
    }
}
