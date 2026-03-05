import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Brain, FileText, CheckCircle, BookOpen, Clock } from "lucide-react";
import { AnalysisItem } from "@/lib/ai/router";

// Mark this component as dynamic because it uses headers/cookies/session
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    // Fetch User and Stats
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            _count: {
                select: {
                    notes: true,
                    quizResults: true,
                },
            },
        },
    });

    if (!user) {
        redirect("/login");
    }

    // Fetch recent notes
    const recentNotes = await prisma.note.findMany({
        where: { userId: user.id },
        orderBy: { created_at: 'desc' },
        take: 5,
    });

    // Calculate real quiz stats
    const totalNotes = user._count.notes;
    const totalQuizzes = user._count.quizResults;

    // Aggregate quiz results for average score
    let averageScore = "0%";
    if (totalQuizzes > 0) {
        const quizStats = await prisma.quizResult.findMany({
            where: { userId: user.id },
            select: { score: true, totalQuestions: true },
        });
        const avgPct =
            quizStats.reduce((sum, r) => sum + r.score / r.totalQuestions, 0) / quizStats.length;
        averageScore = `${Math.round(avgPct * 100)}%`;
    }

    return (
        <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                        Welcome back, {user.name || "Student"}!
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Here's an overview of your Arabic learning progress.
                    </p>
                </div>
                <Link
                    href="/analyze"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 font-medium transition-colors shadow-sm"
                >
                    <Brain className="w-5 h-5 mr-2" />
                    New Analysis
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <FileText className="w-5 h-5" />
                        </div>
                        <h3 className="font-medium text-slate-700 dark:text-slate-300">Saved Notes</h3>
                    </div>
                    <p className="text-4xl font-bold text-slate-900 dark:text-white mt-auto">{totalNotes}</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <h3 className="font-medium text-slate-700 dark:text-slate-300">Kuis Diselesaikan</h3>
                    </div>
                    <p className="text-4xl font-bold text-slate-900 dark:text-white mt-auto">{totalQuizzes}</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <h3 className="font-medium text-slate-700 dark:text-slate-300">Avg. Quiz Score</h3>
                    </div>
                    <p className="text-4xl font-bold text-slate-900 dark:text-white mt-auto">{averageScore}</p>
                </div>
            </div>

            {/* Recent Notes */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        Recent Analyses
                    </h2>
                    {totalNotes > 5 && (
                        <Link href="/notes" className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
                            View all
                        </Link>
                    )}
                </div>

                {recentNotes.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No analyses yet</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                            You haven't saved any grammar analysis notes yet. Start by analyzing some Arabic text!
                        </p>
                        <Link
                            href="/analyze"
                            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 dark:hover:bg-emerald-900 font-medium transition-colors"
                        >
                            Start First Analysis
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                            {recentNotes.map((note: any) => {
                                const analysisLen = Array.isArray(note.analysisJson) ? (note.analysisJson as any[]).length : 0;

                                return (
                                    <li key={note.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <p className="font-arabic text-xl text-slate-900 dark:text-white mb-2" dir="rtl">
                                                    {note.arabic_text}
                                                </p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                                    <span>{new Date(note.created_at).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span>{analysisLen} words analyzed</span>
                                                </p>
                                            </div>
                                            {/* Would be great to link to a detailed note view page, e.g., /notes/[id] */}
                                            <Link
                                                href={`/notes/${note.id}`}
                                                className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 sm:self-center flex items-center gap-1 group"
                                            >
                                                View Details
                                                <span className="transition-transform group-hover:translate-x-1">→</span>
                                            </Link>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
