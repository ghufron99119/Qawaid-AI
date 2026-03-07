import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Calendar, Info } from "lucide-react";
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
                    <p className="font-amiri text-4xl leading-loose text-slate-900 dark:text-white text-right" dir="rtl">
                        {note.arabic_text}
                    </p>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-right text-sm text-slate-700 dark:text-slate-300 font-ibm-arabic">
                        <thead className="bg-slate-50 dark:bg-slate-800/80 text-emerald-800 dark:text-emerald-400 font-bold border-b border-slate-200 dark:border-slate-700">
                            <tr className="text-lg">
                                <th scope="col" className="px-6 py-5">Word</th>
                                <th scope="col" className="px-6 py-5">Type</th>
                                <th scope="col" className="px-6 py-5">I'rab</th>
                                <th scope="col" className="px-6 py-5 text-left font-sans">Explanation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {results.map((item, index) => (
                                <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-5 font-bold text-2xl text-emerald-700 dark:text-emerald-400 leading-relaxed">
                                        {item.word}
                                        {item.confidence && (
                                            <div className="mt-2 font-sans flex justify-end">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                                                    item.confidence === 'high' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800' :
                                                    item.confidence === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800' :
                                                    'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800'
                                                }`}>
                                                    {item.confidence === 'high' ? 'High Confidence' : item.confidence === 'medium' ? 'Medium Confidence' : 'Low Confidence'}
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 text-emerald-800 dark:text-emerald-300 font-sans">
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-xl leading-relaxed">
                                        <div className="flex items-start justify-end gap-2 group/tooltip relative">
                                            {item.i3rab}
                                            {item.reasoning && (
                                                <div className="relative flex items-center">
                                                    <Info className="w-4 h-4 text-slate-400 hover:text-emerald-500 cursor-help" />
                                                    <div className="absolute right-0 bottom-full mb-2 hidden group-hover/tooltip:block w-64 p-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-sans rounded-lg shadow-xl z-10 border border-slate-700 dark:border-slate-300 pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200">
                                                        <p className="font-semibold mb-1 text-emerald-400 dark:text-emerald-700">AI Reasoning</p>
                                                        <p className="leading-relaxed text-slate-300 dark:text-slate-700">{item.reasoning}</p>
                                                        {/* Tooltip Arrow */}
                                                        <div className="absolute -bottom-1 right-1 w-2 h-2 bg-slate-900 dark:bg-slate-100 border-r border-b border-slate-700 dark:border-slate-300 transform rotate-45"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-left text-slate-500 dark:text-slate-400 font-sans text-base">{item.explanation || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
