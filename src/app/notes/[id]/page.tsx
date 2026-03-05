import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Calendar } from "lucide-react";
import { AnalysisItem } from "@/lib/ai/router";

export const dynamic = "force-dynamic";

export default async function NoteDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
    const { id } = await (params as any);
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    if (!id) {
        notFound();
    }

    const note = await prisma.note.findUnique({
        where: { id },
        include: { user: true }
    });

    if (!note) {
        notFound();
    }

    // Security check: only the owner can see the note
    if (note.user.email !== session.user.email) {
        redirect("/dashboard");
    }

    const results = (typeof note.analysisJson === "string"
        ? JSON.parse(note.analysisJson)
        : note.analysisJson) as AnalysisItem[];

    return (
        <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Dashboard
                </Link>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    Analysis Details
                </h1>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 mb-8">
                <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 mb-6 text-sm">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(note.created_at).toLocaleDateString()}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>

                <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mb-8">
                    <h2 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Original Text</h2>
                    <p className="font-arabic text-3xl leading-relaxed text-slate-900 dark:text-white text-right" dir="rtl">
                        {note.arabic_text}
                    </p>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-right text-sm text-slate-700 dark:text-slate-300 font-arabic">
                        <thead className="bg-slate-50 dark:bg-slate-800/80 text-emerald-800 dark:text-emerald-400 font-bold border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th scope="col" className="px-6 py-4">Word</th>
                                <th scope="col" className="px-6 py-4">Type</th>
                                <th scope="col" className="px-6 py-4">I'rab</th>
                                <th scope="col" className="px-6 py-4 text-left font-sans">Explanation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {results.map((item, index) => (
                                <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-lg text-slate-900 dark:text-white">{item.word}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{item.i3rab}</td>
                                    <td className="px-6 py-4 text-left text-slate-500 dark:text-slate-400 font-sans">{item.explanation || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
