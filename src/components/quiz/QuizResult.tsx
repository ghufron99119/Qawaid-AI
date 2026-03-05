"use client";

import { Trophy, RotateCcw, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

interface QuizDetail {
    questionId: number;
    question: string;
    userAnswer: number;
    correctAnswer: number;
    correct: boolean;
}

interface QuizResultCardProps {
    score: number;
    total: number;
    details: QuizDetail[];
    questionOptions: string[][];
    onRetry: () => void;
}

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function QuizResultCard({
    score,
    total,
    details,
    questionOptions,
    onRetry,
}: QuizResultCardProps) {
    const percentage = Math.round((score / total) * 100);

    const gradeConfig =
        percentage >= 80
            ? { label: "Sangat Bagus! 🥇", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800" }
            : percentage >= 60
                ? { label: "Cukup Baik! 👍", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800" }
                : { label: "Perlu Belajar Lagi 📚", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800" };

    return (
        <div className="space-y-6">
            {/* Score card */}
            <div className={`rounded-2xl border-2 p-8 text-center ${gradeConfig.bg}`}>
                <Trophy className={`w-12 h-12 mx-auto mb-3 ${gradeConfig.color}`} />
                <p className={`text-5xl font-extrabold mb-1 ${gradeConfig.color}`}>
                    {score}/{total}
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                    {percentage}%
                </p>
                <p className={`text-lg font-semibold ${gradeConfig.color}`}>{gradeConfig.label}</p>
            </div>

            {/* Per-question breakdown */}
            <div className="space-y-3">
                <h3 className="font-semibold text-slate-800 dark:text-white text-sm uppercase tracking-wide">
                    Rincian Jawaban
                </h3>
                {details.map((detail, i) => {
                    const opts = questionOptions[i] ?? [];
                    return (
                        <div
                            key={detail.questionId}
                            className={`rounded-xl border p-4 ${detail.correct
                                ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20"
                                : "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20"
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                    {detail.correct ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-500" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">
                                        {i + 1}. {detail.question}
                                    </p>
                                    {!detail.correct && (
                                        <div className="space-y-1 text-xs">
                                            <p className="text-red-600 dark:text-red-400">
                                                Jawaban kamu:{" "}
                                                <span className="font-semibold">
                                                    {OPTION_LABELS[detail.userAnswer]}. {opts[detail.userAnswer] ?? "—"}
                                                </span>
                                            </p>
                                            <p className="text-green-600 dark:text-green-400">
                                                Jawaban benar:{" "}
                                                <span className="font-semibold">
                                                    {OPTION_LABELS[detail.correctAnswer]}. {opts[detail.correctAnswer] ?? "—"}
                                                </span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={onRetry}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 font-semibold transition-colors"
                >
                    <RotateCcw className="w-4 h-4" />
                    Kuis Baru
                </button>
                <Link
                    href="/dashboard"
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold transition-colors"
                >
                    Ke Dashboard
                </Link>
            </div>
        </div>
    );
}
