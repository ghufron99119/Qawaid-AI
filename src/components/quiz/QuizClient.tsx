"use client";

import { useState, useCallback } from "react";
import { QuizQuestion } from "@/lib/ai/router";
import QuizGenerator from "./QuizGenerator";
import QuizQuestionCard from "./QuizQuestion";
import QuizNavigation from "./QuizNavigation";
import QuizResultCard from "./QuizResult";

type Phase = "idle" | "loading" | "answering" | "submitting" | "results";

interface SubmitResult {
    score: number;
    total: number;
    details: {
        questionId: number;
        question: string;
        userAnswer: number;
        correctAnswer: number;
        correct: boolean;
    }[];
}

export default function QuizClient() {
    const [phase, setPhase] = useState<Phase>("idle");
    const [count, setCount] = useState(5);
    const [difficulty, setDifficulty] = useState("");
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>([]);
    const [generateError, setGenerateError] = useState<string | null>(null);
    const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);

    const handleGenerate = useCallback(async () => {
        setPhase("loading");
        setGenerateError(null);
        setSubmitResult(null);

        try {
            const res = await fetch("/api/quiz/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ count, difficulty: difficulty || undefined }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Gagal generate soal");
            }

            const qs: QuizQuestion[] = data.questions;
            setQuestions(qs);
            setAnswers(new Array(qs.length).fill(null));
            setCurrentIndex(0);
            setPhase("answering");
        } catch (err) {
            setGenerateError(err instanceof Error ? err.message : "Terjadi kesalahan");
            setPhase("idle");
        }
    }, [count, difficulty]);

    const handleSelect = useCallback((index: number) => {
        setAnswers((prev) => {
            const next = [...prev];
            next[currentIndex] = index;
            return next;
        });
    }, [currentIndex]);

    const handleSubmit = useCallback(async () => {
        setPhase("submitting");

        try {
            const res = await fetch("/api/quiz/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    questions,
                    userAnswers: answers as number[],
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Gagal mengumpulkan jawaban");
            }

            setSubmitResult(data);
            setPhase("results");
        } catch (err) {
            // If submit fails, return to answering state with an alert
            alert(err instanceof Error ? err.message : "Terjadi kesalahan saat mengumpulkan jawaban");
            setPhase("answering");
        }
    }, [questions, answers]);

    const handleRetry = useCallback(() => {
        setPhase("idle");
        setQuestions([]);
        setAnswers([]);
        setCurrentIndex(0);
        setSubmitResult(null);
        setGenerateError(null);
    }, []);

    const answeredCount = answers.filter((a) => a !== null).length;

    return (
        <div className="w-full max-w-2xl mx-auto py-8 px-4 sm:px-6">
            {/* ---- IDLE / LOADING state: show generator ---- */}
            {(phase === "idle" || phase === "loading") && (
                <QuizGenerator
                    count={count}
                    difficulty={difficulty}
                    isLoading={phase === "loading"}
                    error={generateError}
                    onCountChange={setCount}
                    onDifficultyChange={setDifficulty}
                    onGenerate={handleGenerate}
                />
            )}

            {/* ---- ANSWERING / SUBMITTING state: show quiz ---- */}
            {(phase === "answering" || phase === "submitting") && questions.length > 0 && (
                <div className="space-y-6">
                    {/* Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                        <QuizQuestionCard
                            question={questions[currentIndex]}
                            questionNumber={currentIndex + 1}
                            totalQuestions={questions.length}
                            selectedAnswer={answers[currentIndex]}
                            onSelect={handleSelect}
                        />
                    </div>

                    {/* Skor sementara */}
                    <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                        Skor Sementara:{" "}
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {answeredCount}/{questions.length}
                        </span>{" "}
                        soal terjawab
                    </div>

                    {/* Navigation */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                        <QuizNavigation
                            currentIndex={currentIndex}
                            totalQuestions={questions.length}
                            answeredCount={answeredCount}
                            onPrev={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                            onNext={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                            onSubmit={handleSubmit}
                            isSubmitting={phase === "submitting"}
                        />
                    </div>
                </div>
            )}

            {/* ---- RESULTS state ---- */}
            {phase === "results" && submitResult && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                    <QuizResultCard
                        score={submitResult.score}
                        total={submitResult.total}
                        details={submitResult.details}
                        questionOptions={questions.map((q) => q.options)}
                        onRetry={handleRetry}
                    />
                </div>
            )}
        </div>
    );
}
