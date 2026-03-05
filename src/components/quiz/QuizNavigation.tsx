"use client";

import { ChevronLeft, ChevronRight, CheckSquare } from "lucide-react";

interface QuizNavigationProps {
    currentIndex: number;
    totalQuestions: number;
    answeredCount: number;
    onPrev: () => void;
    onNext: () => void;
    onSubmit: () => void;
    isSubmitting: boolean;
}

export default function QuizNavigation({
    currentIndex,
    totalQuestions,
    answeredCount,
    onPrev,
    onNext,
    onSubmit,
    isSubmitting,
}: QuizNavigationProps) {
    const allAnswered = answeredCount === totalQuestions;

    return (
        <div className="space-y-4">
            {/* Answered progress */}
            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>
                    Terjawab:{" "}
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {answeredCount}/{totalQuestions}
                    </span>
                </span>
                {!allAnswered && (
                    <span className="text-xs">Jawab semua soal sebelum mengumpulkan</span>
                )}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between gap-3">
                <button
                    onClick={onPrev}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Sebelumnya
                </button>

                {currentIndex < totalQuestions - 1 ? (
                    <button
                        onClick={onNext}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-sm"
                    >
                        Selanjutnya
                        <ChevronRight className="w-4 h-4" />
                    </button>
                ) : (
                    <div /> // spacer
                )}
            </div>

            {/* Submit button — only shown when all answered */}
            {allAnswered && (
                <button
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                            Mengumpulkan...
                        </>
                    ) : (
                        <>
                            <CheckSquare className="w-4 h-4" />
                            ✅ Kumpulkan Jawaban
                        </>
                    )}
                </button>
            )}
        </div>
    );
}
