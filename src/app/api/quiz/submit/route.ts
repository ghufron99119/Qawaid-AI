import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { QuizQuestion } from '@/lib/ai/router';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized. Please log in first.' }, { status: 401 });
        }

        const body = await req.json();
        const questions: QuizQuestion[] = body.questions;
        const userAnswers: number[] = body.userAnswers;

        if (!Array.isArray(questions) || questions.length === 0) {
            return NextResponse.json({ error: 'questions array is required' }, { status: 400 });
        }

        if (!Array.isArray(userAnswers) || userAnswers.length !== questions.length) {
            return NextResponse.json({ error: 'userAnswers must match questions length' }, { status: 400 });
        }

        // Score answers
        let score = 0;
        const details = questions.map((q, i) => {
            const correct = userAnswers[i] === q.correctAnswer;
            if (correct) score++;
            return {
                questionId: q.id ?? i + 1,
                question: q.question,
                userAnswer: userAnswers[i],
                correctAnswer: q.correctAnswer,
                correct,
            };
        });

        // Get user from DB
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Save quiz result to DB
        await prisma.quizResult.create({
            data: {
                userId: user.id,
                score,
                totalQuestions: questions.length,
            },
        });

        return NextResponse.json({
            score,
            total: questions.length,
            details,
        });
    } catch (error) {
        console.error('[API Quiz Submit Error]', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to submit quiz' },
            { status: 500 }
        );
    }
}
