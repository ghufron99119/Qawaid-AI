"use client";

import { Settings, Loader2, AlertCircle, RefreshCw } from "lucide-react";

interface QuizGeneratorProps {
    count: number;
    difficulty: string;
    isLoading: boolean;
    error: string | null;
    onCountChange: (count: number) => void;
    onDifficultyChange: (difficulty: string) => void;
    onGenerate: () => void;
}

const COUNT_OPTIONS = [5, 10, 15];
const DIFFICULTY_OPTIONS = [
    { value: "", label: "🎯 Umum (Campuran)" },
    { value: "beginner", label: "🟢 Pemula" },
    { value: "intermediate", label: "🟡 Menengah" },
    { value: "advanced", label: "🔴 Lanjut" },
];

export default function QuizGenerator({
    count,
    difficulty,
    isLoading,
    error,
    onCountChange,
    onDifficultyChange,
    onGenerate,
}: QuizGeneratorProps) {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📝</span>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    Kuis Tata Bahasa Arab
                </h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    Uji pemahamanmu tentang Nahwu & Sharaf melalui soal pilihan ganda yang dibuat oleh AI
                </p>
            </div>

            {/* Settings card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold text-sm uppercase tracking-wide">
                    <Settings className="w-4 h-4" />
                    Pengaturan Kuis
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Count selector */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Jumlah Soal
                        </label>
                        <div className="flex gap-2">
                            {COUNT_OPTIONS.map((n) => (
                                <button
                                    key={n}
                                    onClick={() => onCountChange(n)}
                                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border-2 transition-all ${count === n
                                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20"
                                        }`}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Difficulty selector */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Tingkat Kesulitan
                        </label>
                        <select
                            value={difficulty}
                            onChange={(e) => onDifficultyChange(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-600 transition-colors"
                        >
                            {DIFFICULTY_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Error box */}
                {error && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium mb-1">Gagal generate soal</p>
                            <p className="text-sm opacity-80">{error}</p>
                        </div>
                    </div>
                )}

                {/* Generate button */}
                <button
                    onClick={onGenerate}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-bold text-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-emerald-500/20"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Membuat soal dengan AI...
                        </>
                    ) : error ? (
                        <>
                            <RefreshCw className="w-5 h-5" />
                            Coba Lagi
                        </>
                    ) : (
                        <>
                            ⚙️ Generate Soal Baru
                        </>
                    )}
                </button>
            </div>

            {/* Info note */}
            <p className="text-xs text-center text-slate-400 dark:text-slate-500">
                Soal dibuat secara dinamis oleh AI berdasarkan teks yang pernah kamu analisis
            </p>
        </div>
    );
}
