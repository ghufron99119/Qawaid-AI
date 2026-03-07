"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Brain, Save, AlertCircle, Loader2 } from "lucide-react";
import { AnalysisItem } from "@/lib/ai/router";

export default function AnalyzePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [text, setText] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
    const [results, setResults] = useState<AnalysisItem[] | null>(null);
    const [isCachedResult, setIsCachedResult] = useState(false);

    // Protected route handling
    if (status === "unauthenticated") {
        router.push("/login"); // Redirect to login
        return null;
    }

    const handleAnalyze = async () => {
        if (!text.trim()) {
            setError("Arabic text cannot be empty.");
            return;
        }

        setError(null);
        setResults(null);
        setSaveSuccess(null);
        setIsAnalyzing(true);
        setIsCachedResult(false);

        try {
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: text.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "An error occurred during analysis.");
            }

            setResults(data.data);
            if (data.cached) {
                setIsCachedResult(true);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to connect to the AI analysis servers. Please try again later.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSaveNote = async () => {
        if (!text || !results) return;

        setIsSaving(true);
        setSaveSuccess(null);
        setError(null);

        try {
            const response = await fetch("/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    originalText: text.trim(),
                    analysisJson: results,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to save the note.");
            }

            setSaveSuccess("Note successfully saved to your dashboard!");
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to save the note.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4 flex items-center justify-center gap-3">
                    <Brain className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    Grammar Analyzer
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Paste your Arabic text below to instantly receive a detailed I'rab and morphological breakdown.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mb-8">
                <label htmlFor="arabic-text" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Arabic Text (RTL)
                </label>
                <textarea
                    id="arabic-text"
                    rows={5}
                    dir="rtl"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="أدخل النص العربي هنا..."
                    className="w-full px-4 py-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-ibm-arabic text-3xl leading-[2] resize-y"
                />

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !text.trim()}
                        className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Analyzing AI...
                            </>
                        ) : (
                            <>
                                <Brain className="w-5 h-5 mr-2" />
                                Analyze Now
                            </>
                        )}
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-8 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold">Analysis Failed</h3>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                </div>
            )}

            {results && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 animate-slide-up">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Analysis Result</h2>
                        {isCachedResult && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                                Loaded from Cache
                            </span>
                        )}
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                        <table className="w-full text-right text-sm text-slate-700 dark:text-slate-300 font-ibm-arabic">
                            <thead className="bg-slate-50 dark:bg-slate-800/80 text-emerald-800 dark:text-emerald-400 font-bold border-b border-slate-200 dark:border-slate-700">
                                <tr className="text-lg">
                                    <th scope="col" className="px-6 py-5">Word (الكلمة)</th>
                                    <th scope="col" className="px-6 py-5">Type (النوع)</th>
                                    <th scope="col" className="px-6 py-5">I'rab (الإعراب)</th>
                                    <th scope="col" className="px-6 py-5 text-left font-sans">Notes (ملاحظات)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {results.map((item, index) => (
                                    <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-5 font-bold text-2xl text-emerald-700 dark:text-emerald-400 leading-relaxed">{item.word}</td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-sans">
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-xl leading-relaxed">{item.i3rab}</td>
                                        <td className="px-6 py-5 text-left text-slate-500 dark:text-slate-400 font-sans text-base">{item.explanation || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800 pt-6">
                        <div className="flex-1">
                            {saveSuccess && (
                                <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                                    {saveSuccess}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={handleSaveNote}
                            disabled={isSaving || !!saveSuccess}
                            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            {saveSuccess ? "Saved!" : "Save to Notes"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
