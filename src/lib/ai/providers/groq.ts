import { AnalysisResult } from '../router';
import { getPrompt } from '../prompts';

export async function analyzeWithGroq(text: string): Promise<AnalysisResult> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY is missing");

    const url = process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1/chat/completions";

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: getPrompt(text) }],
        })
    });

    if (!response.ok) {
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
        throw new Error("No content returned from Groq");
    }

    try {
        const cleanJson = content.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("Failed to parse Groq response:", content);
        throw new Error("Invalid JSON format from Groq");
    }
}
