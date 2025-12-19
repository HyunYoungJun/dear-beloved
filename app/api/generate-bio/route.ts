import { NextResponse } from 'next/server';
import { generateMockBiography } from '@/lib/ai/biographyGenerator';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const content = await generateMockBiography(body as any);

        return NextResponse.json({ content });
    } catch (error) {
        console.error('Error in generate-bio:', error);
        return NextResponse.json(
            { error: 'Failed to generate biography' },
            { status: 500 }
        );
    }
}
