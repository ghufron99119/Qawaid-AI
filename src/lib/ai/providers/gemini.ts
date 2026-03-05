import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalysisResult } from '../router';
import { getPrompt } from '../prompts';

export async function analyzeWithGemini(text: string): Promise<AnalysisResult> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is missing");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = getPrompt(text);

    const result = await model.generateContent(prompt);
    const response = result.response;
    const jsonText = response.text();

    try {
        // Attempt to extract JSON if it's wrapped in markdown blocks
        const cleanJson = jsonText.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("Failed to parse Gemini response:", jsonText);
        throw new Error("Invalid JSON format from Gemini");
    }
}
