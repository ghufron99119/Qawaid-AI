import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generateQuizWithFallback } from '@/lib/ai/router';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized. Please log in first.' }, { status: 401 });
        }

        const body = await req.json();
        const count: number = Math.min(Math.max(Number(body.count) || 5, 1), 20);
        const difficulty: string | undefined = body.difficulty;
        const contextTexts: string[] | undefined = body.contextTexts;

        // Optionally enrich context from the user's recent notes
        let resolvedContextTexts = contextTexts;
        if (!resolvedContextTexts || resolvedContextTexts.length === 0) {
            const user = await prisma.user.findUnique({ where: { email: session.user.email } });
            if (user) {
                const recentNotes = await prisma.note.findMany({
                    where: { userId: user.id },
                    orderBy: { created_at: 'desc' },
                    take: 3,
                    select: { arabic_text: true },
                });
                resolvedContextTexts = recentNotes.map((n) => n.arabic_text);
            }
        }

        const questions = await generateQuizWithFallback(count, difficulty, resolvedContextTexts);

        return NextResponse.json({
            quizId: crypto.randomUUID(),
            questions,
        });
    } catch (error) {
        console.error('[API Quiz Generate Error]', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to generate quiz' },
            { status: 500 }
        );
    }
}
