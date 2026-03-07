const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

export async function ollamaGenerate(model: string, prompt: string) {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt,
        stream: false
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Ollama error (${res.status}): ${errorText || res.statusText}`);
    }

    const data = await res.json();
    
    // Check if the response is valid
    if (!data.response) {
      throw new Error("Ollama returned an empty response field");
    }

    return data.response;
  } catch (error) {
    console.error("[Ollama Provider] Error:", error);
    throw error;
  }
}
