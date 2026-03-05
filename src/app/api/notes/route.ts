import { NextResponse } from 'next/server';
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
        const { originalText, analysisJson } = body;

        if (!originalText || !analysisJson) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Get user from DB
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
        }

        // Save to Database
        const note = await prisma.note.create({
            data: {
                userId: user.id,
                arabic_text: originalText,
                analysisJson: analysisJson,
            }
        });

        return NextResponse.json({ success: true, data: note }, { status: 201 });
    } catch (error) {
        console.error('API Notes Save Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to save note' },
            { status: 500 }
        );
    }
}
