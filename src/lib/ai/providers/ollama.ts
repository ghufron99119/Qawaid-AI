const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

export async function ollamaGenerate(model: string, prompt: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 600000); // 10 minutes timeout

  try {
    const res = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        format: "json",       // Strict JSON output mode
        options: {
          temperature: 0,     // Deterministic / zero-creativity for factual accuracy
          num_ctx: 4096,      // Context window size
        }
      }),
      signal: controller.signal
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
    if ((error as any).name === 'AbortError') {
      throw new Error("Ollama request timed out after 10 minutes");
    }
    console.error("[Ollama Provider] Error:", error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
