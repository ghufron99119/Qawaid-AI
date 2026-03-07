"use client";

import { useState } from "react";
import { Brain, Play, Sparkles, Terminal } from "lucide-react";

const MODELS = [
  { id: "qwen2.5-coder:7b", name: "Qwen 2.5 Coder (Grammar)" },
  { id: "glm-5:cloud", name: "GLM-5 (Reasoning)" },
  { id: "llama3.2", name: "Llama 3.2 (General)" },
];

export default function PlaygroundPage() {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResult("");

    try {
      const res = await fetch("/api/admin/playground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: selectedModel, prompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to run model");

      setResult(data.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl text-emerald-600">
          <Brain className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Playground</h1>
          <p className="text-slate-500">Test and compare local models from your Model Pool</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Prompt
            </label>
            <textarea
              className="w-full h-40 p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-mono text-sm"
              placeholder="Enter your prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Select Model
              </label>
              <select
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                {MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleRun}
              disabled={loading || !prompt.trim()}
              className="flex items-center gap-2 px-6 py-2.5 mt-7 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
            >
              {loading ? (
                <Sparkles className="w-5 h-5 animate-spin" />
              ) : (
                <Play className="w-5 h-5" />
              )}
              {loading ? "Running..." : "Run Analysis"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-xl flex items-start gap-3 text-red-700 dark:text-red-400">
            <Terminal className="w-5 h-5 mt-0.5" />
            <div className="text-sm font-medium">{error}</div>
          </div>
        )}

        {result && (
          <div className="bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Model Output
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {selectedModel}
              </span>
            </div>
            <div className="prose prose-invert max-w-none">
              <pre className="text-emerald-400 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                {result}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
