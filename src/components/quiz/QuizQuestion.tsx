"use client";

import { QuizQuestion } from "@/lib/ai/router";

interface QuizQuestionProps {
    question: QuizQuestion;
    questionNumber: number;
    totalQuestions: number;
    selectedAnswer: number | null;
    onSelect: (index: number) => void;
    showResult?: boolean;
}

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function QuizQuestionCard({
    question,
    questionNumber,
    totalQuestions,
    selectedAnswer,
    onSelect,
    showResult = false,
}: QuizQuestionProps) {
    return (
        <div className="space-y-6">
            {/* Progress indicator */}
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Soal {questionNumber} dari {totalQuestions}
                </span>
                <div className="flex gap-1.5">
                    {Array.from({ length: totalQuestions }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i + 1 === questionNumber
                                ? "w-6 bg-emerald-500"
                                : i < questionNumber - 1
                                    ? "w-3 bg-emerald-300 dark:bg-emerald-700"
                                    : "w-3 bg-slate-200 dark:bg-slate-700"
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Question text */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                <p className="text-xl font-medium text-slate-900 dark:text-white leading-loose font-ibm-arabic">
                    ❓ {question.question}
                </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
                {question.options.map((option, index) => {
                    let variant = "default";
                    if (showResult) {
                        if (index === question.correctAnswer) variant = "correct";
                        else if (index === selectedAnswer && index !== question.correctAnswer) variant = "wrong";
                    } else if (index === selectedAnswer) {
                        variant = "selected";
                    }

                    const styleMap: Record<string, string> = {
                        default:
                            "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:border-emerald-600 dark:hover:bg-emerald-950/30 cursor-pointer",
                        selected:
                            "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500/30",
                        correct:
                            "border-green-500 bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-200 ring-2 ring-green-500/30",
                        wrong:
                            "border-red-400 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200 ring-2 ring-red-400/30",
                    };

                    const iconMap: Record<string, string> = {
                        default: OPTION_LABELS[index],
                        selected: OPTION_LABELS[index],
                        correct: "✓",
                        wrong: "✗",
                    };

                    const labelStyleMap: Record<string, string> = {
                        default: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
                        selected: "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300",
                        correct: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
                        wrong: "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400",
                    };

                    return (
                        <button
                            key={index}
                            onClick={() => !showResult && onSelect(index)}
                            disabled={showResult}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${styleMap[variant]}`}
                        >
                            <span
                                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${labelStyleMap[variant]}`}
                            >
                                {iconMap[variant]}
                            </span>
                            <span className="font-ibm-arabic text-xl leading-loose">{option}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
