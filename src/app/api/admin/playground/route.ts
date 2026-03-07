import { NextResponse } from 'next/server';
import { ollamaGenerate } from '@/lib/ai/providers/ollama';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { model, prompt } = await req.json();

        if (!model || !prompt) {
            return NextResponse.json({ error: 'Model and prompt are required' }, { status: 400 });
        }

        console.log(`[Playground] Running model ${model}...`);
        const response = await ollamaGenerate(model, prompt);

        return NextResponse.json({ response });
    } catch (error) {
        console.error('[Playground API Error]:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}
