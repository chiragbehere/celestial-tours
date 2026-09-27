import { NextResponse } from 'next/server';
import { extractPreferencesWithAI } from '@/lib/ai/gemini';

export async function POST(req) {
  try {
    const body = await req.json();
    const text = body.text || body.message || body.query;
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text query is required' }, { status: 400 });
    }

    const structured = await extractPreferencesWithAI(text);
    return NextResponse.json({ success: true, preferences: structured });
  } catch (err) {
    console.error('Error in /api/preferences:', err);
    return NextResponse.json({ error: 'Failed to extract preferences' }, { status: 500 });
  }
}
