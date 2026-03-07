import { NextResponse } from 'next/server';
import { analyzeWithFallback } from '@/lib/ai/router';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized. Please log in first.' }, { status: 401 });
        }

        const body = await req.json();
        const text = body.text;

        if (!text || typeof text !== 'string') {
            return NextResponse.json({ error: 'Valid text is required' }, { status: 400 });
        }

        const cleanText = text.trim();
        if (cleanText.length === 0) {
            return NextResponse.json({ error: 'Text cannot be empty' }, { status: 400 });
        }

        if (cleanText.length > 500) {
            return NextResponse.json({ error: 'Text is too long (maximum 500 characters)' }, { status: 400 });
        }

        // Get user from DB
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
        }

        // Check caching in Notes
        const existingNote = await prisma.note.findFirst({
            where: {
                userId: user.id,
                arabic_text: cleanText,
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        if (existingNote) {
            return NextResponse.json({
                success: true,
                data: typeof existingNote.analysisJson === 'string'
                    ? JSON.parse(existingNote.analysisJson)
                    : existingNote.analysisJson,
                cached: true
            });
        }

        // Fetch recent notes for Dynamic Context Injection (RAG-Lite)
        const recentNotes = await prisma.note.findMany({
            where: { userId: user.id },
            orderBy: { created_at: 'desc' },
            take: 3,
            select: { arabic_text: true, analysisJson: true },
        });

        const contextNotes = recentNotes.map(n => 
            `Text: ${n.arabic_text}\nAnalysis: ${typeof n.analysisJson === 'string' ? n.analysisJson : JSON.stringify(n.analysisJson)}`
        );

        // Call AI Router with context (RAG-Lite)
        const analysis = await analyzeWithFallback(cleanText, contextNotes.length > 0 ? contextNotes : undefined);

        return NextResponse.json({ success: true, data: analysis, cached: false });
    } catch (error) {
        console.error('API Analyze Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to analyze text' },
            { status: 500 }
        );
    }
}
